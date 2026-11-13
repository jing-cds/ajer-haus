import { describe, it, expect } from 'vitest';
import {
  isVictorianPostcode,
  resolveDeliveryFeeCents,
  OutOfDeliveryAreaError,
  DELIVERY_FEE_CENTS,
  FREE_DELIVERY_OVER_CENTS,
} from '../../src/lib/delivery.js';

describe('isVictorianPostcode', () => {
  it.each(['3000', '3999', '3141'])('accepts %s', (pc) => {
    expect(isVictorianPostcode(pc)).toBe(true);
  });

  it.each(['2000', '4000', '300', '30000', 'abcd', ''])('rejects %s', (pc) => {
    expect(isVictorianPostcode(pc)).toBe(false);
  });
});

describe('resolveDeliveryFeeCents', () => {
  it('pickup is always free, regardless of postcode', () => {
    expect(resolveDeliveryFeeCents('pickup', undefined, 0)).toBe(0);
    expect(resolveDeliveryFeeCents('pickup', '2000', 0)).toBe(0);
  });

  it('throws OutOfDeliveryAreaError for a missing postcode on delivery', () => {
    expect(() => resolveDeliveryFeeCents('delivery', undefined, 0)).toThrow(OutOfDeliveryAreaError);
  });

  it('throws OutOfDeliveryAreaError for a non-Victorian postcode on delivery', () => {
    expect(() => resolveDeliveryFeeCents('delivery', '2000', 0)).toThrow(OutOfDeliveryAreaError);
  });

  it('charges the flat fee below the free-delivery threshold', () => {
    expect(resolveDeliveryFeeCents('delivery', '3000', FREE_DELIVERY_OVER_CENTS - 1)).toBe(DELIVERY_FEE_CENTS);
  });

  it('is free at or above the free-delivery threshold', () => {
    expect(resolveDeliveryFeeCents('delivery', '3000', FREE_DELIVERY_OVER_CENTS)).toBe(0);
    expect(resolveDeliveryFeeCents('delivery', '3000', FREE_DELIVERY_OVER_CENTS + 100)).toBe(0);
  });
});
