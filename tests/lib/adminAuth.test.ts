import { describe, it, expect, beforeAll } from 'vitest';
import {
  parseCookies,
  isAdminAuthenticated,
  buildAdminSessionCookie,
  buildAdminLogoutCookie,
  requireAdmin,
} from '../../src/lib/adminAuth.js';

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
});

describe('parseCookies', () => {
  it('parses a cookie header into a map', () => {
    expect(parseCookies({ headers: { cookie: 'a=1; b=2' } })).toEqual({ a: '1', b: '2' });
  });

  it('returns {} for no cookie header', () => {
    expect(parseCookies({ headers: {} })).toEqual({});
  });

  it('url-decodes values', () => {
    expect(parseCookies({ headers: { cookie: 'x=hello%20world' } })).toEqual({ x: 'hello world' });
  });
});

describe('session cookie round-trip', () => {
  it('a freshly built session cookie authenticates', () => {
    const setCookie = buildAdminSessionCookie();
    const token = setCookie.match(/ajerhaus_admin_session=([^;]+)/)![1];
    const req = { headers: { cookie: `ajerhaus_admin_session=${token}` } };
    expect(isAdminAuthenticated(req)).toBe(true);
  });

  it('no cookie means not authenticated', () => {
    expect(isAdminAuthenticated({ headers: {} })).toBe(false);
  });

  it('a garbage cookie value means not authenticated', () => {
    expect(isAdminAuthenticated({ headers: { cookie: 'ajerhaus_admin_session=garbage' } })).toBe(false);
  });

  it('logout cookie clears the session (Max-Age=0)', () => {
    expect(buildAdminLogoutCookie()).toContain('Max-Age=0');
  });
});

describe('requireAdmin', () => {
  it('sends 401 and returns false when not authenticated', () => {
    let statusCode: number | undefined;
    let body: any;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        body = data;
        return this;
      },
    };
    const result = requireAdmin({ headers: {} }, res);
    expect(result).toBe(false);
    expect(statusCode).toBe(401);
    expect(body).toEqual({ error: 'Not authenticated' });
  });

  it('returns true without touching res when authenticated', () => {
    const setCookie = buildAdminSessionCookie();
    const token = setCookie.match(/ajerhaus_admin_session=([^;]+)/)![1];
    const req = { headers: { cookie: `ajerhaus_admin_session=${token}` } };
    const res = { status: () => { throw new Error('should not be called'); } };
    expect(requireAdmin(req, res as any)).toBe(true);
  });
});
