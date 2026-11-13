import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import { buildAdminSessionCookie } from '../../src/lib/adminAuth.js';
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

function authedReq(rest: any) {
  const setCookie = buildAdminSessionCookie();
  const token = setCookie.match(/ajerhaus_admin_session=([^;]+)/)![1];
  return { headers: { cookie: `ajerhaus_admin_session=${token}` }, ...rest };
}

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
});

describe('admin batches handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET lists batches with live available stock attached', async () => {
    vi.spyOn(prisma.batch, 'findMany').mockResolvedValue([{ id: 'batch-1', totalUnits: 40 }] as any);
    vi.spyOn(prisma.batch, 'findUnique').mockResolvedValue({ totalUnits: 40 } as any);
    vi.spyOn(prisma.reservation, 'aggregate').mockResolvedValue({ _sum: { quantity: 0 } } as any);
    vi.spyOn(prisma.orderItem, 'aggregate').mockResolvedValue({ _sum: { quantity: 15 } } as any);

    const res = createMockRes();
    await batchesHandler(authedReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.batches[0].availableStock).toBe(25);
  });

  it('POST update-stock rejects a negative totalUnits', async () => {
    const res = createMockRes();
    await batchesHandler(authedReq({ method: 'POST', body: { action: 'update-stock', batchId: 'batch-1', totalUnits: -1 } }), res);
    expect(res.statusCode).toBe(400);
  });

  it('POST update-stock saves a valid totalUnits', async () => {
    const updateSpy = vi.spyOn(prisma.batch, 'update').mockResolvedValue({ id: 'batch-1', totalUnits: 50 } as any);
    const res = createMockRes();
    await batchesHandler(authedReq({ method: 'POST', body: { action: 'update-stock', batchId: 'batch-1', totalUnits: 50 } }), res);
    expect(res.statusCode).toBe(200);
    expect(updateSpy).toHaveBeenCalledWith({ where: { id: 'batch-1' }, data: { totalUnits: 50 } });
  });

  it('POST set-status rejects an invalid status', async () => {
    const res = createMockRes();
    await batchesHandler(authedReq({ method: 'POST', body: { action: 'set-status', batchId: 'batch-1', status: 'DELETED' } }), res);
    expect(res.statusCode).toBe(400);
  });

  it('POST set-status saves a valid status', async () => {
    const updateSpy = vi.spyOn(prisma.batch, 'update').mockResolvedValue({ id: 'batch-1', status: 'SOLD_OUT' } as any);
    const res = createMockRes();
    await batchesHandler(authedReq({ method: 'POST', body: { action: 'set-status', batchId: 'batch-1', status: 'SOLD_OUT' } }), res);
    expect(res.statusCode).toBe(200);
    expect(updateSpy).toHaveBeenCalledWith({ where: { id: 'batch-1' }, data: { status: 'SOLD_OUT' } });
  });
});
