import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import { sign } from '../../src/lib/signedToken.js';
import unsubscribeHandler from '../../src/server/unsubscribe.js';

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

describe('unsubscribe handler (/api/unsubscribe)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects non-GET methods', async () => {
    const res = createMockRes();
    await unsubscribeHandler({ method: 'POST', url: '/api/unsubscribe', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('400s with no token', async () => {
    const res = createMockRes();
    await unsubscribeHandler({ method: 'GET', url: '/api/unsubscribe', headers: {} }, res);
    expect(res.statusCode).toBe(400);
  });

  it('401s for an invalid/wrong-kind token', async () => {
    const token = sign({ kind: 'order-lookup', orderId: 'x' }, 60);
    const res = createMockRes();
    await unsubscribeHandler({ method: 'GET', url: `/api/unsubscribe?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(401);
  });

  it('marks the subscriber unsubscribed for a valid token', async () => {
    const updateSpy = vi.spyOn(prisma.subscriber, 'update').mockResolvedValue({} as any);
    const token = sign({ kind: 'unsubscribe', email: 'jo@example.com' }, 60);
    const res = createMockRes();
    await unsubscribeHandler({ method: 'GET', url: `/api/unsubscribe?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(200);
    expect(updateSpy).toHaveBeenCalledWith({ where: { email: 'jo@example.com' }, data: { unsubscribedAt: expect.any(Date) } });
  });

  it('treats an already-deleted subscriber (P2025) as success', async () => {
    vi.spyOn(prisma.subscriber, 'update').mockRejectedValue({ code: 'P2025' });
    const token = sign({ kind: 'unsubscribe', email: 'ghost@example.com' }, 60);
    const res = createMockRes();
    await unsubscribeHandler({ method: 'GET', url: `/api/unsubscribe?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(200);
  });

  it('500s on an unexpected database error', async () => {
    vi.spyOn(prisma.subscriber, 'update').mockRejectedValue(new Error('db down'));
    const token = sign({ kind: 'unsubscribe', email: 'jo@example.com' }, 60);
    const res = createMockRes();
    await unsubscribeHandler({ method: 'GET', url: `/api/unsubscribe?token=${token}`, headers: {} }, res);
    expect(res.statusCode).toBe(500);
  });
});
