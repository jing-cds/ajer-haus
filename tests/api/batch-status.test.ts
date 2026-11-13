import { describe, it, expect, beforeEach, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import batchStatusHandler from '../../src/server/batch-status.js';

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

describe('batch-status handler (/api/batch-status)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects non-GET methods', async () => {
    const res = createMockRes();
    await batchStatusHandler({ method: 'POST', url: '/api/batch-status', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('400s with no slug', async () => {
    const res = createMockRes();
    await batchStatusHandler({ method: 'GET', url: '/api/batch-status', headers: {} }, res);
    expect(res.statusCode).toBe(400);
  });

  it('404s for an unknown/inactive product', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);
    const res = createMockRes();
    await batchStatusHandler({ method: 'GET', url: '/api/batch-status?slug=nope', headers: {} }, res);
    expect(res.statusCode).toBe(404);
  });

  it('reports live:false for a product with no live batch', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue({ isActive: true, batches: [] } as any);
    const res = createMockRes();
    await batchStatusHandler({ method: 'GET', url: '/api/batch-status?slug=yarra-at-dusk', headers: {} }, res);
    expect(res.body).toEqual({ live: false, available: 0 });
  });

  it('reports remaining stock for a live batch', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue({
      isActive: true,
      batches: [{ id: 'batch-1' }],
    } as any);
    vi.spyOn(prisma.batch, 'findUnique').mockResolvedValue({ totalUnits: 40 } as any);
    vi.spyOn(prisma.reservation, 'aggregate').mockResolvedValue({ _sum: { quantity: 5 } } as any);
    vi.spyOn(prisma.orderItem, 'aggregate').mockResolvedValue({ _sum: { quantity: 10 } } as any);

    const res = createMockRes();
    await batchStatusHandler({ method: 'GET', url: '/api/batch-status?slug=shrine-of-remembrance', headers: {} }, res);
    expect(res.body).toEqual({ live: true, available: 25, soldOut: false });
  });

  it('never reports negative available stock as sold out only, not negative', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue({ isActive: true, batches: [{ id: 'batch-1' }] } as any);
    vi.spyOn(prisma.batch, 'findUnique').mockResolvedValue({ totalUnits: 5 } as any);
    vi.spyOn(prisma.reservation, 'aggregate').mockResolvedValue({ _sum: { quantity: 0 } } as any);
    vi.spyOn(prisma.orderItem, 'aggregate').mockResolvedValue({ _sum: { quantity: 10 } } as any);

    const res = createMockRes();
    await batchStatusHandler({ method: 'GET', url: '/api/batch-status?slug=shrine-of-remembrance', headers: {} }, res);
    expect(res.body).toEqual({ live: true, available: 0, soldOut: true });
  });
});
