/**
 * Anti-oversell reservation logic for a pre-order Batch's stock.
 *
 * Unstitch's equivalent (src/lib/inventory.ts, `~/Unstitch`) locks
 * individual, already-materialized `Unit` rows with
 * `SELECT ... FOR UPDATE SKIP LOCKED`. Ajer Haus doesn't serialize
 * individual units — stock is just `Batch.totalUnits` minus however much is
 * currently held/sold — so instead this locks the single `Batch` row with
 * `SELECT ... FOR UPDATE` (no SKIP LOCKED: concurrent callers against the
 * *same* batch must queue and re-check, not skip past each other and both
 * read a stale "available" count) and computes availability from that one
 * locked row plus a SUM over active Reservations and sold OrderItems,
 * inside the same transaction, before deciding whether to insert a new
 * Reservation.
 *
 * This is covered by a real-Postgres integration test
 * (tests/integration/inventory.test.ts) that fires concurrent reservations
 * against a single-unit batch and asserts exactly one succeeds — the kind
 * of race a mocked-transaction unit test cannot catch.
 *
 * IMPORTANT: like Unstitch, this requires the Neon driver adapter's
 * WebSocket connection mode (`@prisma/adapter-neon` + `ws`), which holds one
 * real connection for the duration of an interactive transaction — the
 * alternative HTTP/fetch-based Neon driver does not support row locking and
 * must not be substituted in here.
 */
import { Prisma } from '@prisma/client';
import { prisma } from './prisma.js';

export class InsufficientStockError extends Error {
  batchId: string;
  requested: number;
  available: number;

  constructor(batchId: string, requested: number, available: number) {
    super(`Requested ${requested} unit(s) for batch ${batchId} but only ${available} in stock`);
    this.name = 'InsufficientStockError';
    this.batchId = batchId;
    this.requested = requested;
    this.available = available;
  }
}

export class BatchNotFoundError extends Error {
  batchId: string;
  constructor(batchId: string) {
    super(`Batch ${batchId} not found`);
    this.name = 'BatchNotFoundError';
    this.batchId = batchId;
  }
}

/**
 * How many units of a batch are still sellable right now: total minus
 * whatever is held by a still-live Reservation (expired holds don't count,
 * even if nothing has swept their status to RELEASED yet) minus whatever
 * has already been sold (committed as an OrderItem).
 *
 * `tx` is optional — pass the active transaction client when calling this
 * from inside one (as reserveStockForBatch does, against the row it just
 * locked); omit it for a plain, non-locking read (e.g. a public
 * "how much stock is left" status endpoint).
 */
export async function getAvailableStock(batchId: string, tx: any = prisma): Promise<number> {
  const batch = await tx.batch.findUnique({ where: { id: batchId }, select: { totalUnits: true } });
  if (!batch) throw new BatchNotFoundError(batchId);

  const now = new Date();
  const [heldAgg, soldAgg] = await Promise.all([
    tx.reservation.aggregate({
      where: { batchId, status: 'ACTIVE', expiresAt: { gt: now } },
      _sum: { quantity: true },
    }),
    tx.orderItem.aggregate({
      where: { batchId },
      _sum: { quantity: true },
    }),
  ]);

  const held = heldAgg._sum.quantity ?? 0;
  const sold = soldAgg._sum.quantity ?? 0;
  return batch.totalUnits - held - sold;
}

/**
 * Locks the batch row, checks real availability, and — if enough stock
 * remains — creates an ACTIVE Reservation holding `quantity` units until
 * `expiresAt`. Throws InsufficientStockError (creating nothing) otherwise.
 */
export async function reserveStockForBatch(
  batchId: string,
  quantity: number,
  holdSeconds: number
): Promise<{ id: string; batchId: string; quantity: number; expiresAt: Date }> {
  if (!prisma) throw new Error('Database not configured');

  return prisma.$transaction(async (tx: any) => {
    // Schema-qualified explicitly (not relying on the connection's
    // search_path) — these tables live in the `ajer_haus` Postgres schema,
    // not `public` (see prisma/schema.prisma's multiSchema config and
    // scripts/setup-infra.sh), and $queryRaw/$executeRaw bypass Prisma's
    // own schema-aware query builder entirely.
    const locked = await tx.$queryRaw(Prisma.sql`
      SELECT total_units FROM ajer_haus.batches WHERE id = ${batchId}::uuid FOR UPDATE
    `);
    const batchRow = (locked as Array<{ total_units: number }>)[0];
    if (!batchRow) throw new BatchNotFoundError(batchId);

    const now = new Date();
    const [heldAgg, soldAgg] = await Promise.all([
      tx.reservation.aggregate({
        where: { batchId, status: 'ACTIVE', expiresAt: { gt: now } },
        _sum: { quantity: true },
      }),
      tx.orderItem.aggregate({
        where: { batchId },
        _sum: { quantity: true },
      }),
    ]);

    const held = heldAgg._sum.quantity ?? 0;
    const sold = soldAgg._sum.quantity ?? 0;
    const available = batchRow.total_units - held - sold;

    if (available < quantity) {
      throw new InsufficientStockError(batchId, quantity, Math.max(0, available));
    }

    const expiresAt = new Date(Date.now() + holdSeconds * 1000);
    return tx.reservation.create({
      data: { batchId, quantity, status: 'ACTIVE', expiresAt },
    });
  });
}

/**
 * Releases a reservation that never converted to an order (Stripe session
 * errored out before it was even created, or the session expired without
 * payment). Idempotent: releasing an already-released/converted
 * reservation is a safe no-op.
 */
export async function releaseReservation(reservationId: string): Promise<void> {
  if (!prisma) return;
  await prisma.reservation.updateMany({
    where: { id: reservationId, status: 'ACTIVE' },
    data: { status: 'RELEASED' },
  });
}

/**
 * Flips a reservation to CONVERTED once payment has succeeded and an Order
 * has been created for it. Must be called inside the same transaction as
 * the Order/OrderItem/Payment writes (see api/stripe-webhook.ts) so the
 * reservation's active-hold accounting and the sold-stock accounting never
 * both count the same units, even momentarily.
 */
export async function markReservationConverted(tx: any, reservationId: string): Promise<void> {
  await tx.reservation.updateMany({
    where: { id: reservationId, status: 'ACTIVE' },
    data: { status: 'CONVERTED' },
  });
}
