import { describe, it, expect } from 'vitest';
import { generateOrderNumber } from '../../src/lib/orderNumber.js';

describe('generateOrderNumber', () => {
  it('matches the AH-<year>-<6 digits> shape', () => {
    const num = generateOrderNumber();
    expect(num).toMatch(/^AH-\d{4}-\d{6}$/);
  });

  it('uses the current year', () => {
    const num = generateOrderNumber();
    expect(num).toContain(`AH-${new Date().getFullYear()}-`);
  });

  it('is not trivially constant across calls', () => {
    const samples = new Set(Array.from({ length: 20 }, () => generateOrderNumber()));
    expect(samples.size).toBeGreaterThan(1);
  });
});
