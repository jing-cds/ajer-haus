import { describe, it, expect, beforeAll } from 'vitest';
import ordersHandler from '../../src/server/admin/orders.js';
import batchesHandler from '../../src/server/admin/batches.js';

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

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
});

describe('admin endpoints require authentication', () => {
  it('orders: 401s with no admin session cookie', async () => {
    const res = createMockRes();
    await ordersHandler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(401);
  });

  it('batches: 401s with no admin session cookie', async () => {
    const res = createMockRes();
    await batchesHandler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(401);
  });

  it('orders: 401s for a garbage cookie', async () => {
    const res = createMockRes();
    await ordersHandler({ method: 'GET', headers: { cookie: 'ajerhaus_admin_session=garbage' } }, res);
    expect(res.statusCode).toBe(401);
  });
});
