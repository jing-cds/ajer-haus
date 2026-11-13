// tests/integration/stripe-webhook.test.ts
// Real-database companion to tests/api/stripe-webhook.test.ts (which mocks
// Prisma entirely). This runs the actual handler against a real Postgres
// transaction to prove idempotency holds under a genuine unique-constraint
// check (Payment.providerPaymentId), not a mocked findUnique-returns-null
// assumption — and that checkout.session.expired really does flip a real
// Reservation row, not just call a spy.
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import Stripe from 'stripe';
import { resetDb, createProductWithBatch, testPrisma } from './helpers.js';
import { reserveStockForBatch, getAvailableStock } from '../../src/lib/inventory.js';

const mockSend = vi.fn().mockResolvedValue({ id: 'mock-email-id' });
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: (...args: any[]) => mockSend(...args) };
  },
}));

const WEBHOOK_SECRET = 'whsec_integration_test';
let handler: (req: any, res: any) => Promise<any>;

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

function createSignedReq(eventPayload: any) {
  const payload = JSON.stringify(eventPayload);
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  return { method: 'POST', headers: { 'stripe-signature': header }, rawBody: Buffer.from(payload, 'utf8') };
}

beforeAll(async () => {
  process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_integration_mock';
  process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_SECRET;
  const mod = await import('../../api/stripe-webhook.js');
  handler = mod.default;
});

beforeEach(async () => {
  await resetDb();
  mockSend.mockClear();
});

function checkoutCompletedEvent({ sessionId, reservationId, productId, batchId }: any) {
  return {
    id: `evt_${sessionId}`,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: sessionId,
        payment_intent: `pi_${sessionId}`,
        amount_total: 3620,
        currency: 'aud',
        customer_details: { email: 'integration@example.com', name: 'Integration Test' },
        metadata: {
          reservationId,
          productId,
          batchId,
          quantity: '1',
          recipientName: 'Integration Test',
          deliveryMethod: 'delivery',
          deliveryFeeCents: '1020',
          addressLine1: '1 Test St',
          addressPostcode: '3000',
          marketingOptIn: 'false',
        },
      },
    },
  };
}

describe('stripe-webhook — real database', () => {
  it('a replayed checkout.session.completed event creates only one Order/Payment', async () => {
    const { productId, batchId } = await createProductWithBatch(5);
    const reservation = await reserveStockForBatch(batchId, 1, 1800);
    const event = checkoutCompletedEvent({ sessionId: 'cs_integration_1', reservationId: reservation.id, productId, batchId });

    const res1 = createMockRes();
    await handler(createSignedReq(event), res1);
    expect(res1.statusCode).toBe(200);

    const res2 = createMockRes();
    await handler(createSignedReq(event), res2);
    expect(res2.statusCode).toBe(200);

    const payments = await testPrisma.payment.findMany({ where: { providerPaymentId: 'pi_cs_integration_1' } });
    const orders = await testPrisma.order.findMany({ where: { idempotencyKey: 'cs_integration_1' } });
    expect(payments).toHaveLength(1);
    expect(orders).toHaveLength(1);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('converts the reservation and leaves availability consistent with the sale', async () => {
    const { productId, batchId } = await createProductWithBatch(3);
    const reservation = await reserveStockForBatch(batchId, 1, 1800);
    const event = checkoutCompletedEvent({ sessionId: 'cs_integration_2', reservationId: reservation.id, productId, batchId });

    await handler(createSignedReq(event), createMockRes());

    const updatedReservation = await testPrisma.reservation.findUnique({ where: { id: reservation.id } });
    expect(updatedReservation?.status).toBe('CONVERTED');
    // 3 total, 1 sold -> 2 left (the reservation that converted into a sale
    // is no longer "held", it's "sold" — getAvailableStock must not
    // double-count it under both buckets).
    expect(await getAvailableStock(batchId)).toBe(2);
  });

  it('checkout.session.expired releases a real reservation back to available stock', async () => {
    const { batchId } = await createProductWithBatch(4);
    const reservation = await reserveStockForBatch(batchId, 2, 1800);
    expect(await getAvailableStock(batchId)).toBe(2);

    const event = {
      id: 'evt_expired_1',
      type: 'checkout.session.expired',
      data: { object: { id: 'cs_integration_expired', metadata: { reservationId: reservation.id } } },
    };
    const res = createMockRes();
    await handler(createSignedReq(event), res);
    expect(res.statusCode).toBe(200);

    const updatedReservation = await testPrisma.reservation.findUnique({ where: { id: reservation.id } });
    expect(updatedReservation?.status).toBe('RELEASED');
    expect(await getAvailableStock(batchId)).toBe(4);
  });
});
