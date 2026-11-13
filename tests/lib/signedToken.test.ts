import { describe, it, expect, beforeAll } from 'vitest';
import { sign, verify } from '../../src/lib/signedToken.js';

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
});

describe('sign/verify', () => {
  it('round-trips a payload', () => {
    const token = sign({ kind: 'order-lookup', orderId: 'order-1' }, 60);
    const payload = verify(token);
    expect(payload).toMatchObject({ kind: 'order-lookup', orderId: 'order-1' });
  });

  it('returns null for an expired token', () => {
    const token = sign({ kind: 'order-lookup', orderId: 'order-1' }, -1);
    expect(verify(token)).toBeNull();
  });

  it('returns null for a tampered payload', () => {
    const token = sign({ kind: 'order-lookup', orderId: 'order-1' }, 60);
    const [payloadB64, sig] = token.split('.');
    const tamperedPayload = Buffer.from(JSON.stringify({ kind: 'order-lookup', orderId: 'order-2', exp: 9999999999 }), 'utf8').toString(
      'base64url'
    );
    expect(verify(`${tamperedPayload}.${sig}`)).toBeNull();
  });

  it('returns null for malformed input', () => {
    expect(verify(null)).toBeNull();
    expect(verify(undefined)).toBeNull();
    expect(verify('not-a-token')).toBeNull();
    expect(verify('')).toBeNull();
  });

  it('throws when signing without SESSION_SECRET configured', () => {
    const prev = process.env.SESSION_SECRET;
    delete process.env.SESSION_SECRET;
    expect(() => sign({ a: 1 }, 60)).toThrow();
    process.env.SESSION_SECRET = prev;
  });

  it('verify returns null (never throws) when SESSION_SECRET is missing', () => {
    const token = sign({ a: 1 }, 60);
    const prev = process.env.SESSION_SECRET;
    delete process.env.SESSION_SECRET;
    expect(verify(token)).toBeNull();
    process.env.SESSION_SECRET = prev;
  });
});
