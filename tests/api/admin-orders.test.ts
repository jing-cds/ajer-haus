import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import { buildAdminSessionCookie } from '../../src/lib/adminAuth.js';
import ordersHandler from '../../src/server/admin/orders.js';

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

function authedReq(rest: any) {
  const setCookie = buildAdminSessionCookie();
  const token = setCookie.match(/ajerhaus_admin_session=([^;]+)/)![1];
  return { headers: { cookie: `ajerhaus_admin_session=${token}` }, ...rest };
}

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
});

describe('admin orders handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET lists orders most-recent-first', async () => {
    const findManySpy = vi.spyOn(prisma.order, 'findMany').mockResolvedValue([{ id: 'order-1' }] as any);
    const res = createMockRes();
    await ordersHandler(authedReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.orders).toHaveLength(1);
    expect(findManySpy.mock.calls[0][0].orderBy).toEqual({ createdAt: 'desc' });
  });

  it('POST mark-shipped sets status/shippedAt/trackingNumber', async () => {
    const updateSpy = vi.spyOn(prisma.order, 'update').mockResolvedValue({ id: 'order-1', status: 'OUT_FOR_DELIVERY' } as any);
    const res = createMockRes();
    await ordersHandler(authedReq({ method: 'POST', body: { action: 'mark-shipped', orderId: 'order-1', trackingNumber: 'AP123' } }), res);
    expect(res.statusCode).toBe(200);
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'OUT_FOR_DELIVERY', shippedAt: expect.any(Date), trackingNumber: 'AP123' },
    });
  });

  it('POST mark-delivered sets status/deliveredAt', async () => {
    const updateSpy = vi.spyOn(prisma.order, 'update').mockResolvedValue({ id: 'order-1', status: 'DELIVERED' } as any);
    const res = createMockRes();
    await ordersHandler(authedReq({ method: 'POST', body: { action: 'mark-delivered', orderId: 'order-1' } }), res);
    expect(res.statusCode).toBe(200);
    expect(updateSpy).toHaveBeenCalledWith({ where: { id: 'order-1' }, data: { status: 'DELIVERED', deliveredAt: expect.any(Date) } });
  });

  it('POST 400s without an orderId', async () => {
    const res = createMockRes();
    await ordersHandler(authedReq({ method: 'POST', body: { action: 'mark-delivered' } }), res);
    expect(res.statusCode).toBe(400);
  });

  it('POST 400s on an unknown action', async () => {
    const res = createMockRes();
    await ordersHandler(authedReq({ method: 'POST', body: { action: 'nuke', orderId: 'order-1' } }), res);
    expect(res.statusCode).toBe(400);
  });

  it('405s on other methods', async () => {
    const res = createMockRes();
    await ordersHandler(authedReq({ method: 'DELETE' }), res);
    expect(res.statusCode).toBe(405);
  });
});
