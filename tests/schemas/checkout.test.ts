import { describe, it, expect } from 'vitest';
import { CreateCheckoutSessionSchema } from '../../src/lib/schemas/checkout.js';

const base = {
  quantity: 2,
  name: 'Jo Bloggs',
  email: 'jo@example.com',
  method: 'delivery' as const,
  address: '1 Example St',
  suburb: 'Carlton',
  postcode: '3000',
};

describe('CreateCheckoutSessionSchema', () => {
  it('accepts a valid delivery payload and defaults slug', () => {
    const result = CreateCheckoutSessionSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.slug).toBe('shrine-of-remembrance');
  });

  it('accepts pickup without address/suburb/postcode', () => {
    const result = CreateCheckoutSessionSchema.safeParse({ ...base, method: 'pickup', address: undefined, suburb: undefined, postcode: undefined });
    expect(result.success).toBe(true);
  });

  it('lower-cases and trims email', () => {
    const result = CreateCheckoutSessionSchema.safeParse({ ...base, email: '  JO@EXAMPLE.COM  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('jo@example.com');
  });

  it('rejects quantity 0', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, quantity: 0 }).success).toBe(false);
  });

  it('rejects quantity above 12', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, quantity: 13 }).success).toBe(false);
  });

  it('rejects a non-integer quantity', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, quantity: 1.5 }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a blank name', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, name: '  ' }).success).toBe(false);
  });

  it('rejects an invalid method', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, method: 'teleport' }).success).toBe(false);
  });

  it('rejects a malformed postcode', () => {
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, postcode: '12345' }).success).toBe(false);
  });

  it('rejects a well-formed but non-Victorian postcode', () => {
    // Regression for the gap where this schema's postcode check (previously
    // just /^\d{0,4}$/) was looser than src/lib/delivery.ts's actual gate —
    // a 4-digit NSW postcode like 2000 used to pass schema validation.
    expect(CreateCheckoutSessionSchema.safeParse({ ...base, postcode: '2000' }).success).toBe(false);
  });
});
