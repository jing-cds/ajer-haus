import { describe, it, expect } from 'vitest';
import { SubscribeSchema } from '../../src/lib/schemas/subscribe.js';

describe('SubscribeSchema', () => {
  it('accepts a bare email and defaults source to newsletter', () => {
    const result = SubscribeSchema.safeParse({ email: 'jo@example.com' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe('newsletter');
      expect(result.data.name).toBeNull();
      expect(result.data.productSlug).toBeUndefined();
    }
  });

  it('lower-cases and trims email', () => {
    const result = SubscribeSchema.safeParse({ email: '  JO@EXAMPLE.COM  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('jo@example.com');
  });

  it('keeps an explicit source and productSlug', () => {
    const result = SubscribeSchema.safeParse({ email: 'jo@example.com', source: 'notify-me', productSlug: 'yarra-at-dusk' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe('notify-me');
      expect(result.data.productSlug).toBe('yarra-at-dusk');
    }
  });

  it('rejects an invalid email', () => {
    expect(SubscribeSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a non-empty honeypot', () => {
    expect(SubscribeSchema.safeParse({ email: 'jo@example.com', _gotcha: 'bot' }).success).toBe(false);
  });

  it('accepts an empty honeypot', () => {
    expect(SubscribeSchema.safeParse({ email: 'jo@example.com', _gotcha: '' }).success).toBe(true);
  });
});
