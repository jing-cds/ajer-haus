import { describe, it, expect, beforeEach, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import { limiter } from '../../src/lib/rateLimit.js';

const { mockSessionsCreate } = vi.hoisted(() => ({ mockSessionsCreate: vi.fn() }));
vi.mock('../../src/lib/stripe.js', () => ({
  default: { checkout: { sessions: { create: (...args: any[]) => mockSessionsCreate(...args) } } },
}));

const { mockReserve, mockRelease } = vi.hoisted(() => ({ mockReserve: vi.fn(), mockRelease: vi.fn() }));
vi.mock('../../src/lib/inventory.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/lib/inventory.js')>('../../src/lib/inventory.js');
  return {
    ...actual,
    reserveStockForBatch: (...args: any[]) => mockReserve(...args),
    releaseReservation: (...args: any[]) => mockRelease(...args),
  };
});

// Imported after the mocks are declared so the handler picks them up.
import checkoutHandler from '../../api/create-checkout-session.js';
import { InsufficientStockError } from '../../src/lib/inventory.js';

function createMockRes() {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key: string, val: string) {
      res.headers[key.toLowerCase()] = val;
      return res;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: any) {
      res.body = data;
      return res;
    },
  };
  return res;
}

const PRODUCT = {
  id: 'prod-1',
  slug: 'shrine-of-remembrance',
  isActive: true,
  name: 'Shrine of Remembrance',
  tagline: 'Native frangipani',
  currency: 'AUD',
  priceCents: 2600, // deliberately specific — proves the price comes from the DB, not the client
};
const BATCH = { id: 'batch-1', productId: 'prod-1', status: 'LIVE' };
const PRODUCT_WITH_LIVE_BATCH = { ...PRODUCT, batches: [BATCH] };
const RESERVATION = { id: 'res-1', batchId: 'batch-1', quantity: 2, expiresAt: new Date() };

function validBody(overrides = {}) {
  return {
    slug: 'shrine-of-remembrance',
    quantity: 2,
    name: 'Jo Bloggs',
    email: 'buyer@example.com',
    method: 'delivery',
    address: '1 Example St',
    suburb: 'Carlton',
    postcode: '3000',
    ...overrides,
  };
}

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `10.1.2.${ipCounter}`;
}

describe('create-checkout-session API handler', () => {
  beforeEach(() => {
    limiter.reset();
    vi.restoreAllMocks();
    mockSessionsCreate.mockReset();
    mockReserve.mockReset();
    mockRelease.mockReset();

    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue(PRODUCT_WITH_LIVE_BATCH as any);
    mockReserve.mockResolvedValue(RESERVATION);
    mockRelease.mockResolvedValue(undefined);
    mockSessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test_123' });
  });

  it('rejects non-POST methods', async () => {
    const res = createMockRes();
    await checkoutHandler({ method: 'GET', headers: { 'x-forwarded-for': nextIp() } }, res);
    expect(res.statusCode).toBe(405);
  });

  it('charges the server-known price, not a client-supplied one', async () => {
    const res = createMockRes();
    await checkoutHandler(
      { method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody({ priceCents: 1 }) },
      res
    );
    expect(res.statusCode).toBe(200);
    const lineItems = mockSessionsCreate.mock.calls[0][0].line_items;
    expect(lineItems[0].price_data.unit_amount).toBe(PRODUCT.priceCents);
  });

  it('adds a delivery fee line item for a delivery order under the free threshold', async () => {
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    const lineItems = mockSessionsCreate.mock.calls[0][0].line_items;
    expect(lineItems).toHaveLength(2);
    expect(lineItems[1].price_data.unit_amount).toBe(1020);
  });

  it('omits the delivery fee line item for pickup', async () => {
    const res = createMockRes();
    await checkoutHandler(
      { method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody({ method: 'pickup', address: undefined, postcode: undefined }) },
      res
    );
    const lineItems = mockSessionsCreate.mock.calls[0][0].line_items;
    expect(lineItems).toHaveLength(1);
  });

  it('rejects a non-Victorian delivery postcode without reserving stock', async () => {
    const res = createMockRes();
    await checkoutHandler(
      { method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody({ postcode: '2000' }) },
      res
    );
    expect(res.statusCode).toBe(400);
    expect(mockReserve).not.toHaveBeenCalled();
  });

  it('rejects a delivery order with no suburb', async () => {
    const res = createMockRes();
    await checkoutHandler(
      { method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody({ suburb: undefined }) },
      res
    );
    expect(res.statusCode).toBe(400);
    expect(mockReserve).not.toHaveBeenCalled();
  });

  it('carries the suburb through to the Stripe session metadata', async () => {
    // Regression for the bug the orderIntake seam (src/lib/orderIntake.ts)
    // closes: a delivery order's suburb used to not exist anywhere in this
    // stack, so every Address ended up with a hardcoded suburb: ''.
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    expect(res.statusCode).toBe(200);
    expect(mockSessionsCreate.mock.calls[0][0].metadata.addressSuburb).toBe('Carlton');
  });

  it('404s for an inactive/unknown product', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue(null as any);
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    expect(res.statusCode).toBe(404);
  });

  it('409s when the product has no live batch', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue({ ...PRODUCT, batches: [] } as any);
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    expect(res.statusCode).toBe(409);
  });

  it('409s with remaining count when stock is insufficient', async () => {
    mockReserve.mockRejectedValue(new InsufficientStockError('batch-1', 2, 1));
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toContain('1 left');
  });

  it('409s with a sold-out message when zero remain', async () => {
    mockReserve.mockRejectedValue(new InsufficientStockError('batch-1', 2, 0));
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    expect(res.body.error).toMatch(/sold out/i);
  });

  it('releases the reservation if Stripe session creation fails', async () => {
    mockSessionsCreate.mockRejectedValue(new Error('stripe down'));
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': nextIp() }, body: validBody() }, res);
    expect(res.statusCode).toBe(500);
    expect(mockRelease).toHaveBeenCalledWith(RESERVATION.id);
  });

  it('rate limits after 12 attempts per IP per minute', async () => {
    const ip = nextIp();
    for (let i = 0; i < 12; i++) {
      await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: validBody() }, createMockRes());
    }
    const res = createMockRes();
    await checkoutHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: validBody() }, res);
    expect(res.statusCode).toBe(429);
  });
});
