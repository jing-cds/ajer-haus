import { describe, it, expect, beforeEach, vi } from 'vitest';
import prisma from '../../src/lib/prisma.js';
import { limiter } from '../../src/lib/rateLimit.js';

const mockSend = vi.fn().mockResolvedValue({ id: 'mock-email-id' });
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: (...args: any[]) => mockSend(...args) };
  },
}));

import subscribeHandler from '../../src/server/subscribe.js';

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

let ipCounter = 0;
function req(body: any) {
  ipCounter += 1;
  return { method: 'POST', headers: { 'x-forwarded-for': `10.2.0.${ipCounter}` }, body };
}

describe('subscribe handler (/api/subscribe)', () => {
  beforeEach(() => {
    limiter.reset();
    vi.restoreAllMocks();
    mockSend.mockClear();
  });

  it('rejects non-POST methods', async () => {
    const res = createMockRes();
    await subscribeHandler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('rejects an invalid email', async () => {
    const res = createMockRes();
    await subscribeHandler(req({ email: 'not-an-email' }), res);
    expect(res.statusCode).toBe(400);
  });

  it('silently "succeeds" on a tripped honeypot without writing to the DB', async () => {
    const upsertSpy = vi.spyOn(prisma.subscriber, 'upsert');
    const res = createMockRes();
    await subscribeHandler(req({ email: 'bot@example.com', _gotcha: 'spam' }), res);
    expect(res.statusCode).toBe(200);
    expect(upsertSpy).not.toHaveBeenCalled();
  });

  it('upserts a general newsletter subscriber', async () => {
    vi.spyOn(prisma.subscriber, 'findUnique').mockResolvedValue(null);
    const upsertSpy = vi.spyOn(prisma.subscriber, 'upsert').mockResolvedValue({} as any);
    const res = createMockRes();
    await subscribeHandler(req({ email: 'jo@example.com' }), res);
    expect(res.statusCode).toBe(200);
    expect(upsertSpy).toHaveBeenCalledTimes(1);
  });

  it('resolves productSlug to a productId for a notify-me signup', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue({ id: 'prod-yarra', name: 'Yarra at Dusk' } as any);
    vi.spyOn(prisma.subscriber, 'findUnique').mockResolvedValue(null);
    const upsertSpy = vi.spyOn(prisma.subscriber, 'upsert').mockResolvedValue({} as any);
    const res = createMockRes();
    await subscribeHandler(req({ email: 'jo@example.com', productSlug: 'yarra-at-dusk' }), res);
    expect(res.statusCode).toBe(200);
    expect(upsertSpy.mock.calls[0][0].create.productId).toBe('prod-yarra');
  });

  it('resets notifiedAt when switching to a different scent waitlist', async () => {
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValue({ id: 'prod-new', name: 'New Scent' } as any);
    vi.spyOn(prisma.subscriber, 'findUnique').mockResolvedValue({ productId: 'prod-old' } as any);
    const upsertSpy = vi.spyOn(prisma.subscriber, 'upsert').mockResolvedValue({} as any);
    const res = createMockRes();
    await subscribeHandler(req({ email: 'jo@example.com', productSlug: 'new-scent' }), res);
    expect(upsertSpy.mock.calls[0][0].update.notifiedAt).toBeNull();
  });

  it('returns 500 if the database write fails', async () => {
    vi.spyOn(prisma.subscriber, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.subscriber, 'upsert').mockRejectedValue(new Error('db down'));
    const res = createMockRes();
    await subscribeHandler(req({ email: 'jo@example.com' }), res);
    expect(res.statusCode).toBe(500);
  });

  it('rate limits after 10 attempts per IP per minute', async () => {
    vi.spyOn(prisma.subscriber, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.subscriber, 'upsert').mockResolvedValue({} as any);
    const ip = '10.9.9.9';
    for (let i = 0; i < 10; i++) {
      await subscribeHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: { email: 'jo@example.com' } }, createMockRes());
    }
    const res = createMockRes();
    await subscribeHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: { email: 'jo@example.com' } }, res);
    expect(res.statusCode).toBe(429);
  });
});
