import { describe, it, expect, beforeEach, vi } from 'vitest';
import { limiter } from '../../src/lib/rateLimit.js';

const mockSend = vi.fn().mockResolvedValue({ id: 'mock-email-id' });
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: (...args: any[]) => mockSend(...args) };
  },
}));

import contactHandler from '../../src/server/contact.js';

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
  return { method: 'POST', headers: { 'x-forwarded-for': `10.3.0.${ipCounter}` }, body };
}

const VALID = { name: 'Jo', email: 'jo@example.com', topic: 'An order', message: 'Where is my order?' };

describe('contact handler (/api/contact)', () => {
  beforeEach(() => {
    limiter.reset();
    vi.restoreAllMocks();
    mockSend.mockClear();
    process.env.RESEND_API_KEY = 'test-key';
  });

  it('rejects non-POST methods', async () => {
    const res = createMockRes();
    await contactHandler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('rejects a missing message', async () => {
    const res = createMockRes();
    await contactHandler(req({ ...VALID, message: '' }), res);
    expect(res.statusCode).toBe(400);
  });

  it('rejects an invalid email', async () => {
    const res = createMockRes();
    await contactHandler(req({ ...VALID, email: 'not-an-email' }), res);
    expect(res.statusCode).toBe(400);
  });

  it('silently "succeeds" on a tripped honeypot without sending an email', async () => {
    const res = createMockRes();
    await contactHandler(req({ ...VALID, _gotcha: 'spam' }), res);
    expect(res.statusCode).toBe(200);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('falls back to "Something else" for an unrecognised topic', async () => {
    const res = createMockRes();
    await contactHandler(req({ ...VALID, topic: 'Not a real topic' }), res);
    expect(res.statusCode).toBe(200);
    expect(mockSend.mock.calls[0][0].subject).toContain('Something else');
  });

  it('sends the message to the contact inbox with reply-to set to the sender', async () => {
    const res = createMockRes();
    await contactHandler(req(VALID), res);
    expect(res.statusCode).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
    const payload = mockSend.mock.calls[0][0];
    expect(payload.to).toBe('hello@ajerhaus.com');
    expect(payload.replyTo).toBe('jo@example.com');
  });

  it('returns 500 if sending the email fails', async () => {
    mockSend.mockRejectedValueOnce(new Error('resend down'));
    const res = createMockRes();
    await contactHandler(req(VALID), res);
    expect(res.statusCode).toBe(500);
  });

  it('rate limits after 5 attempts per IP per minute', async () => {
    const ip = '10.9.9.8';
    for (let i = 0; i < 5; i++) {
      await contactHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: VALID }, createMockRes());
    }
    const res = createMockRes();
    await contactHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: VALID }, res);
    expect(res.statusCode).toBe(429);
  });
});
