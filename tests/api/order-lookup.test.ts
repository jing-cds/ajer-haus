import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import { sign } from '../../src/lib/signedToken.js';
import orderLookupHandler, { sanitizeOrder } from '../../src/server/order-lookup.js';

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

const ORDER = {
  id: 'order-1',
  orderNumber: 'AH-2026-000001',
  status: 'PAID',
  totalCents: 3620,
  currency: 'AUD',
  createdAt: new Date('2026-01-01'),
  trackingNumber: null,
  items: [{ quantity: 1, lineTotalCents: 2600, product: { name: 'Shrine of Remembrance' } }],
  deliveryAddress: { recipientName: 'Jo', line1: '1 Example St', line2: null, suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'AU' },
};

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
});

describe('sanitizeOrder', () => {
  it('exposes only customer-safe fields', () => {
    const sanitized = sanitizeOrder(ORDER);
    expect(sanitized).toMatchObject({
      orderNumber: 'AH-2026-000001',
      status: 'PAID',
      items: [{ productName: 'Shrine of Remembrance', quantity: 1, lineTotalCents: 2600 }],
    });
    expect(sanitized).not.toHaveProperty('id');
  });
});

describe('order-lookup handler (/api/order-lookup)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects non-GET methods', async () => {
    const res = createMockRes();
    await orderLookupHandler({ method: 'POST', url: '/api/order-lookup', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('400s with no token', async () => {
    const res = createMockRes();
    await orderLookupHandler({ method: 'GET', url: '/api/order-lookup', headers: {} }, res);
    expect(res.statusCode).toBe(400);
  });

  it('401s for an invalid/wrong-kind token', async () => {
    const token = sign({ kind: 'unsubscribe', email: 'x' }, 60);
    const res = createMockRes();
    await orderLookupHandler({ method: 'GET', url: `/api/order-lookup?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(401);
  });

  it('returns the sanitized order for a valid token', async () => {
    vi.spyOn(prisma.order, 'findUnique').mockResolvedValue(ORDER as any);
    const token = sign({ kind: 'order-lookup', orderId: 'order-1' }, 60);
    const res = createMockRes();
    await orderLookupHandler({ method: 'GET', url: `/api/order-lookup?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.order.orderNumber).toBe('AH-2026-000001');
  });

  it('404s when the order no longer exists', async () => {
    vi.spyOn(prisma.order, 'findUnique').mockResolvedValue(null);
    const token = sign({ kind: 'order-lookup', orderId: 'missing' }, 60);
    const res = createMockRes();
    await orderLookupHandler({ method: 'GET', url: `/api/order-lookup?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(404);
  });
});
