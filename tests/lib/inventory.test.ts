import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import {
  getAvailableStock,
  reserveStockForBatch,
  releaseReservation,
  markReservationConverted,
  InsufficientStockError,
  BatchNotFoundError,
} from '../../src/lib/inventory.js';

describe('InsufficientStockError', () => {
  it('carries batchId/requested/available and a descriptive message', () => {
    const err = new InsufficientStockError('batch-1', 5, 2);
    expect(err.name).toBe('InsufficientStockError');
    expect(err.batchId).toBe('batch-1');
    expect(err.requested).toBe(5);
    expect(err.available).toBe(2);
    expect(err.message).toContain('batch-1');
  });
});

describe('BatchNotFoundError', () => {
  it('carries the batchId', () => {
    const err = new BatchNotFoundError('batch-1');
    expect(err.batchId).toBe('batch-1');
    expect(err.name).toBe('BatchNotFoundError');
  });
});

describe('getAvailableStock', () => {
  it('subtracts active (unexpired) held + sold from total', async () => {
    const tx = {
      batch: { findUnique: vi.fn().mockResolvedValue({ totalUnits: 10 }) },
      reservation: { aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: 3 } }) },
      orderItem: { aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: 2 } }) },
    };
    const available = await getAvailableStock('batch-1', tx as any);
    expect(available).toBe(5);
  });

  it('treats a null sum as zero', async () => {
    const tx = {
      batch: { findUnique: vi.fn().mockResolvedValue({ totalUnits: 10 }) },
      reservation: { aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: null } }) },
      orderItem: { aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: null } }) },
    };
    expect(await getAvailableStock('batch-1', tx as any)).toBe(10);
  });

  it('throws BatchNotFoundError for a missing batch', async () => {
    const tx = { batch: { findUnique: vi.fn().mockResolvedValue(null) } };
    await expect(getAvailableStock('missing', tx as any)).rejects.toBeInstanceOf(BatchNotFoundError);
  });
});

describe('reserveStockForBatch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function mockTx({ totalUnits, held, sold }: { totalUnits: number; held: number; sold: number }) {
    return {
      $queryRaw: vi.fn().mockResolvedValue([{ total_units: totalUnits }]),
      reservation: {
        aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: held } }),
        create: vi.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'res-1', ...data })),
      },
      orderItem: { aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: sold } }) },
    };
  }

  it('creates an ACTIVE reservation when enough stock is available', async () => {
    const tx = mockTx({ totalUnits: 10, held: 2, sold: 1 });
    vi.spyOn(prisma, '$transaction').mockImplementation(async (fn: any) => fn(tx));

    const reservation = await reserveStockForBatch('batch-1', 3, 1800);

    expect(reservation).toMatchObject({ batchId: 'batch-1', quantity: 3, status: 'ACTIVE' });
    expect(tx.reservation.create).toHaveBeenCalledTimes(1);
  });

  it('throws InsufficientStockError (creating nothing) when not enough stock remains', async () => {
    const tx = mockTx({ totalUnits: 10, held: 9, sold: 0 }); // 1 available
    vi.spyOn(prisma, '$transaction').mockImplementation(async (fn: any) => fn(tx));

    await expect(reserveStockForBatch('batch-1', 2, 1800)).rejects.toMatchObject({
      name: 'InsufficientStockError',
      batchId: 'batch-1',
      requested: 2,
      available: 1,
    });
    expect(tx.reservation.create).not.toHaveBeenCalled();
  });

  it('throws BatchNotFoundError for an unknown batch', async () => {
    const tx = { $queryRaw: vi.fn().mockResolvedValue([]) };
    vi.spyOn(prisma, '$transaction').mockImplementation(async (fn: any) => fn(tx));
    await expect(reserveStockForBatch('missing', 1, 1800)).rejects.toBeInstanceOf(BatchNotFoundError);
  });

  it('locks the batch row with a raw FOR UPDATE query before reading aggregates', async () => {
    // This only proves the query is SHAPED with FOR UPDATE — it mocks
    // $queryRaw entirely, so it can't and doesn't prove the lock actually
    // prevents a race. That guarantee has exactly one test surface: the
    // real-Postgres tests/integration/inventory.test.ts, which fires
    // concurrent reservations against a single-unit batch. A regression
    // that silently weakened this (e.g. appending SKIP LOCKED, which would
    // still match /FOR UPDATE/) would only be caught there, not here.
    const tx = mockTx({ totalUnits: 5, held: 0, sold: 0 });
    vi.spyOn(prisma, '$transaction').mockImplementation(async (fn: any) => fn(tx));
    await reserveStockForBatch('batch-1', 1, 1800);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    // Prisma.sql's tagged-template result doesn't stringify to the raw SQL
    // via String()/toString() (unlike older Prisma versions this test was
    // first written against) — .sql is where the templated text lives.
    const sql = tx.$queryRaw.mock.calls[0][0].sql;
    expect(sql).toMatch(/FOR UPDATE(?! SKIP LOCKED)/);
  });
});

describe('releaseReservation', () => {
  it('flips an ACTIVE reservation to RELEASED', async () => {
    const spy = vi.spyOn(prisma.reservation, 'updateMany').mockResolvedValue({ count: 1 } as any);
    await releaseReservation('res-1');
    expect(spy).toHaveBeenCalledWith({ where: { id: 'res-1', status: 'ACTIVE' }, data: { status: 'RELEASED' } });
  });
});

describe('markReservationConverted', () => {
  it('flips an ACTIVE reservation to CONVERTED on the given tx', async () => {
    const tx = { reservation: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) } };
    await markReservationConverted(tx as any, 'res-1');
    expect(tx.reservation.updateMany).toHaveBeenCalledWith({
      where: { id: 'res-1', status: 'ACTIVE' },
      data: { status: 'CONVERTED' },
    });
  });
});
