import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { limiter } from '../../src/lib/rateLimit.js';
import loginHandler from '../../src/server/admin/login.js';
import logoutHandler from '../../src/server/admin/logout.js';

const ORIGINAL_ENV = { ...process.env };

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

describe('admin login handler', () => {
  beforeEach(() => {
    limiter.reset();
    process.env.ADMIN_PASSWORD = 'correct-horse-battery-staple';
    process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('rejects non-POST methods', async () => {
    const res = createMockRes();
    await loginHandler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('503s when ADMIN_PASSWORD is not configured', async () => {
    delete process.env.ADMIN_PASSWORD;
    const res = createMockRes();
    await loginHandler(req({ password: 'anything' }), res);
    expect(res.statusCode).toBe(503);
  });

  it('400s with no password', async () => {
    const res = createMockRes();
    await loginHandler(req({}), res);
    expect(res.statusCode).toBe(400);
  });

  it('401s for the wrong password', async () => {
    const res = createMockRes();
    await loginHandler(req({ password: 'wrong' }), res);
    expect(res.statusCode).toBe(401);
  });

  it('sets a session cookie on the correct password', async () => {
    const res = createMockRes();
    await loginHandler(req({ password: 'correct-horse-battery-staple' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toContain('ajerhaus_admin_session=');
  });

  it('rate limits after 8 attempts per IP per minute', async () => {
    const ip = '10.9.0.1';
    for (let i = 0; i < 8; i++) {
      await loginHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: { password: 'wrong' } }, createMockRes());
    }
    const res = createMockRes();
    await loginHandler({ method: 'POST', headers: { 'x-forwarded-for': ip }, body: { password: 'wrong' } }, res);
    expect(res.statusCode).toBe(429);
  });
});

describe('admin logout handler', () => {
  it('rejects non-POST methods', async () => {
    const res = createMockRes();
    await logoutHandler({ method: 'GET', headers: {} }, res);
    expect(res.statusCode).toBe(405);
  });

  it('clears the session cookie', async () => {
    const res = createMockRes();
    await logoutHandler({ method: 'POST', headers: {} }, res);
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toContain('Max-Age=0');
  });
});
