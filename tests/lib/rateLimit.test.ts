import { describe, it, expect, beforeEach } from 'vitest';
import { limiter, getClientIp, checkRateLimit } from '../../src/lib/rateLimit.js';

beforeEach(() => {
  limiter.reset();
});

describe('getClientIp', () => {
  it('prefers x-forwarded-for, first entry', () => {
    const req = { headers: { 'x-forwarded-for': '1.1.1.1, 2.2.2.2' } };
    expect(getClientIp(req)).toBe('1.1.1.1');
  });

  it('falls back to x-real-ip', () => {
    const req = { headers: { 'x-real-ip': '3.3.3.3' } };
    expect(getClientIp(req)).toBe('3.3.3.3');
  });

  it('falls back to socket.remoteAddress, then a default', () => {
    expect(getClientIp({ headers: {}, socket: { remoteAddress: '4.4.4.4' } })).toBe('4.4.4.4');
    expect(getClientIp({ headers: {} })).toBe('127.0.0.1');
    expect(getClientIp(undefined)).toBe('127.0.0.1');
  });
});

describe('checkRateLimit', () => {
  it('allows up to the limit, then blocks', () => {
    const req = { headers: { 'x-forwarded-for': '9.9.9.9' } };
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(req, { limit: 3, windowMs: 60000, prefix: 'test' }).success).toBe(true);
    }
    const blocked = checkRateLimit(req, { limit: 3, windowMs: 60000, prefix: 'test' });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('tracks different IPs independently', () => {
    const reqA = { headers: { 'x-forwarded-for': '1.1.1.1' } };
    const reqB = { headers: { 'x-forwarded-for': '2.2.2.2' } };
    checkRateLimit(reqA, { limit: 1, windowMs: 60000, prefix: 'test2' });
    const blockedA = checkRateLimit(reqA, { limit: 1, windowMs: 60000, prefix: 'test2' });
    const okB = checkRateLimit(reqB, { limit: 1, windowMs: 60000, prefix: 'test2' });
    expect(blockedA.success).toBe(false);
    expect(okB.success).toBe(true);
  });

  it('tracks different prefixes independently for the same IP', () => {
    const req = { headers: { 'x-forwarded-for': '5.5.5.5' } };
    checkRateLimit(req, { limit: 1, windowMs: 60000, prefix: 'a' });
    const blockedA = checkRateLimit(req, { limit: 1, windowMs: 60000, prefix: 'a' });
    const okB = checkRateLimit(req, { limit: 1, windowMs: 60000, prefix: 'b' });
    expect(blockedA.success).toBe(false);
    expect(okB.success).toBe(true);
  });
});
