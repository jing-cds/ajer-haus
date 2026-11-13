// tests/integration/helpers.ts
// Shared setup for the real-database integration tier. Unlike
// tests/lib/tests/api (which mock Prisma entirely), these tests run
// against a genuine Postgres — a `postgres:16` service container in CI,
// or a local Postgres you point TEST_DATABASE_URL at — so they actually
// exercise row locking, transactions, and unique constraints.
//
// Requires the schema to already be pushed: `prisma db push` against
// TEST_DATABASE_URL before running (see package.json's `test:integration`
// script, and .github/workflows/ci.yml).
import prisma from '../../src/lib/prisma.js';

if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL is not set. The integration tier needs a real Postgres ' +
      '(see package.json\'s test:integration script) — it is never run against the shared Neon project.'
  );
}

export const testPrisma = prisma;

/** Clears every table between tests so they don't leak state into each other. */
export async function resetDb(): Promise<void> {
  await testPrisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      ajer_haus.payments,
      ajer_haus.order_items,
      ajer_haus.orders,
      ajer_haus.addresses,
      ajer_haus.customers,
      ajer_haus.reservations,
      ajer_haus.batches,
      ajer_haus.subscribers,
      ajer_haus.products
    RESTART IDENTITY CASCADE
  `);
}

export async function createProductWithBatch(totalUnits: number): Promise<{ productId: string; batchId: string }> {
  const product = await testPrisma.product.create({
    data: {
      slug: `test-product-${Math.random().toString(36).slice(2)}`,
      sku: `TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: 'Test Product',
      priceCents: 2600,
    },
  });
  const batch = await testPrisma.batch.create({
    data: { productId: product.id, batchCode: 'B001', totalUnits, status: 'LIVE' },
  });
  return { productId: product.id, batchId: batch.id };
}
