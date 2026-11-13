// tests/integration/inventory.test.ts
// The one test in this repo that a mocked-Prisma unit test structurally
// cannot write: fires genuinely concurrent requests at a real Postgres
// transaction and checks the row-locking in src/lib/inventory.ts actually
// prevents an oversell. Unstitch's equivalent logic (src/lib/inventory.ts,
// ~/Unstitch) has never been tested this way — every one of its tests
// mocks `prisma.$transaction` outright, so a regression that removed the
// `FOR UPDATE` lock (or swapped it for something that doesn't block)
// would pass every existing test there and still oversell in production.
import { describe, it, expect, beforeEach } from 'vitest';
import { resetDb, createProductWithBatch } from './helpers.js';
import { reserveStockForBatch, getAvailableStock, InsufficientStockError } from '../../src/lib/inventory.js';

beforeEach(async () => {
  await resetDb();
});

describe('reserveStockForBatch — real concurrency', () => {
  it('exactly one of N concurrent reservations succeeds against a single-unit batch', async () => {
    const { batchId } = await createProductWithBatch(1);

    const attempts = 8;
    const results = await Promise.allSettled(
      Array.from({ length: attempts }, () => reserveStockForBatch(batchId, 1, 1800))
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(attempts - 1);
    for (const r of rejected as PromiseRejectedResult[]) {
      expect(r.reason).toBeInstanceOf(InsufficientStockError);
    }

    // And the batch now shows zero available — not "1 minus 8 concurrent
    // attempts" or any other inconsistent number a lost update could produce.
    expect(await getAvailableStock(batchId)).toBe(0);
  });

  it('exactly as many of N concurrent reservations succeed as there is real stock (5 of 12 for 5 units)', async () => {
    const { batchId } = await createProductWithBatch(5);

    const attempts = 12;
    const results = await Promise.allSettled(
      Array.from({ length: attempts }, () => reserveStockForBatch(batchId, 1, 1800))
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    expect(fulfilled).toHaveLength(5);
    expect(await getAvailableStock(batchId)).toBe(0);
  });

  it('a single successful reservation followed by a conflicting one still rejects cleanly', async () => {
    const { batchId } = await createProductWithBatch(2);
    await reserveStockForBatch(batchId, 2, 1800); // takes all remaining stock
    await expect(reserveStockForBatch(batchId, 1, 1800)).rejects.toBeInstanceOf(InsufficientStockError);
  });
});
