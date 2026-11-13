import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Stripe from 'stripe';

const ORIGINAL_ENV = { ...process.env };

// src/lib/stripe.js and src/lib/prisma.js both fall back to reading a local
// .env* file for any var not already in process.env — stub fs so that
// fallback is always a no-op regardless of what's actually on disk.
vi.mock('node:fs', () => ({ default: { existsSync: () => false, readFileSync: () => '' } }));

const mockSend = vi.fn().mockResolvedValue({ id: 'mock-email-id' });
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: (...args: any[]) => mockSend(...args) };
  },
}));

const { mockMarkConverted, mockRelease } = vi.hoisted(() => ({ mockMarkConverted: vi.fn(), mockRelease: vi.fn() }));
vi.mock('../../src/lib/inventory.js', () => ({
  markReservationConverted: (...args: any[]) => mockMarkConverted(...args),
  releaseReservation: (...args: any[]) => mockRelease(...args),
}));

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

/** Builds a request whose raw body + stripe-signature header verify correctly against `secret` — real Stripe signing, not a hand-rolled fake. */
function createSignedReq(eventPayload: any, secret: string) {
  const payload = JSON.stringify(eventPayload);
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  return { method: 'POST', headers: { 'stripe-signature': header }, rawBody: Buffer.from(payload, 'utf8') };
}

async function loadHandler({
  stripeSecretKey = 'sk_test_mock_key',
  webhookSecret = 'whsec_test_mock_secret',
  databaseUrl,
}: { stripeSecretKey?: string | null; webhookSecret?: string | null; databaseUrl?: string | null } = {}) {
  if (stripeSecretKey === null) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = stripeSecretKey;

  if (webhookSecret === null) delete process.env.STRIPE_WEBHOOK_SECRET;
  else process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;

  if (databaseUrl === null) delete process.env.DATABASE_URL;
  else if (databaseUrl) process.env.DATABASE_URL = databaseUrl;

  // The confirmation email builds an order-lookup link via signedToken.js's
  // sign(), which throws without this — previously unset here, so that
  // throw was silently swallowed by handleCheckoutCompleted's
  // .catch(() => {}) and the happy-path test's mockSend assertion failed
  // for a reason the test itself never surfaced.
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
  // Same hidden-ambient-env problem for RESEND_API_KEY: without it,
  // sendOrderConfirmationEmail's own "not configured" guard returns early
  // and mockSend is never called — this test only ever passed if your
  // shell happened to already export a RESEND_API_KEY.
  process.env.RESEND_API_KEY = 'test-key';

  const prismaModule = await import('../../src/lib/prisma.js');
  const handlerModule = await import('../../api/stripe-webhook.js');
  return { prisma: prismaModule.default as any, handler: handlerModule.default };
}

function checkoutCompletedEvent(overrides: any = {}) {
  return {
    id: 'evt_1',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        payment_intent: 'pi_123',
        amount_total: 3620, // 2600 + 1020 delivery
        currency: 'aud',
        customer_details: { email: 'buyer@example.com', name: 'Jo Bloggs' },
        metadata: {
          reservationId: 'res-1',
          productId: 'prod-1',
          batchId: 'batch-1',
          quantity: '1',
          recipientName: 'Jo Bloggs',
          deliveryMethod: 'delivery',
          deliveryFeeCents: '1020',
          addressLine1: '1 Example St',
          addressSuburb: 'Carlton',
          addressPostcode: '3000',
          marketingOptIn: 'false',
        },
        ...overrides,
      },
    },
  };
}

describe('Stripe webhook handler (/api/stripe-webhook)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    mockSend.mockClear();
    mockMarkConverted.mockReset();
    mockRelease.mockReset();
    process.env = { ...ORIGINAL_ENV };
    delete (globalThis as any).stripe;
    delete (globalThis as any).prisma;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete (globalThis as any).stripe;
    delete (globalThis as any).prisma;
  });

  it('rejects non-POST HTTP methods with 405', async () => {
    const { handler } = await loadHandler();
    const res = createMockRes();
    await handler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('returns 503 when STRIPE_SECRET_KEY is not configured', async () => {
    const { handler } = await loadHandler({ stripeSecretKey: null });
    const res = createMockRes();
    await handler({ method: 'POST', headers: { 'stripe-signature': 'x' } }, res);
    expect(res.statusCode).toBe(503);
  });

  it('returns 503 when STRIPE_WEBHOOK_SECRET is not configured', async () => {
    const { handler } = await loadHandler({ webhookSecret: null });
    const res = createMockRes();
    await handler({ method: 'POST', headers: { 'stripe-signature': 'x' } }, res);
    expect(res.statusCode).toBe(503);
  });

  it('returns 503 when DATABASE_URL is not configured', async () => {
    const { handler } = await loadHandler({ databaseUrl: null });
    const res = createMockRes();
    await handler({ method: 'POST', headers: { 'stripe-signature': 'x' } }, res);
    expect(res.statusCode).toBe(503);
  });

  it('returns 400 for an invalid signature before touching the DB', async () => {
    const { handler, prisma } = await loadHandler();
    const findUniqueSpy = vi.spyOn(prisma.payment, 'findUnique');
    const res = createMockRes();
    await handler(
      { method: 'POST', headers: { 'stripe-signature': 't=1,v1=deadbeef' }, rawBody: Buffer.from('{}') },
      res
    );
    expect(res.statusCode).toBe(400);
    expect(findUniqueSpy).not.toHaveBeenCalled();
  });

  it('checkout.session.completed happy path creates Customer/Order/OrderItem/Payment and converts the reservation', async () => {
    const webhookSecret = 'whsec_happy_path';
    const { handler, prisma } = await loadHandler({ webhookSecret });

    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue(null);

    const mockTx = {
      customer: { upsert: vi.fn().mockResolvedValue({ id: 'cust-1', email: 'buyer@example.com' }) },
      subscriber: { upsert: vi.fn() },
      address: { create: vi.fn().mockResolvedValue({ id: 'addr-1', line1: '1 Example St', suburb: 'Carlton', postcode: '3000' }) },
      order: { create: vi.fn().mockResolvedValue({ id: 'order-1', orderNumber: 'AH-2026-000001' }) },
      product: { findUnique: vi.fn().mockResolvedValue({ id: 'prod-1', name: 'Shrine of Remembrance' }) },
      orderItem: { create: vi.fn() },
      payment: { create: vi.fn() },
    };
    vi.spyOn(prisma, '$transaction').mockImplementation(async (fn: any) => fn(mockTx));

    const req = createSignedReq(checkoutCompletedEvent(), webhookSecret);
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockTx.customer.upsert).toHaveBeenCalledTimes(1);
    expect(mockTx.address.create).toHaveBeenCalledTimes(1);
    // Regression: suburb used to be hardcoded to '' here regardless of
    // what the metadata carried — see src/lib/orderIntake.ts.
    expect(mockTx.address.create.mock.calls[0][0].data.suburb).toBe('Carlton');
    expect(mockTx.order.create).toHaveBeenCalledTimes(1);
    expect(mockTx.orderItem.create).toHaveBeenCalledTimes(1);
    expect(mockTx.payment.create).toHaveBeenCalledTimes(1);
    expect(mockMarkConverted).toHaveBeenCalledWith(mockTx, 'res-1');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('is idempotent: a Stripe retry for an already-recorded PaymentIntent is a no-op', async () => {
    const webhookSecret = 'whsec_idempotent';
    const { handler, prisma } = await loadHandler({ webhookSecret });

    vi.spyOn(prisma.payment, 'findUnique').mockResolvedValue({ id: 'payment-1', providerPaymentId: 'pi_123' } as any);
    const txSpy = vi.spyOn(prisma, '$transaction');

    const req = createSignedReq(checkoutCompletedEvent(), webhookSecret);
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(txSpy).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('checkout.session.expired releases the reservation', async () => {
    const webhookSecret = 'whsec_expired';
    const { handler } = await loadHandler({ webhookSecret });

    const event = {
      id: 'evt_2',
      type: 'checkout.session.expired',
      data: { object: { id: 'cs_test_456', metadata: { reservationId: 'res-2' } } },
    };
    const req = createSignedReq(event, webhookSecret);
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockRelease).toHaveBeenCalledWith('res-2');
  });

  it('ignores unhandled event types with a 200 (Stripe treats 2xx as delivered)', async () => {
    const webhookSecret = 'whsec_unhandled';
    const { handler } = await loadHandler({ webhookSecret });
    const event = { id: 'evt_3', type: 'payment_intent.created', data: { object: {} } };
    const req = createSignedReq(event, webhookSecret);
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});
