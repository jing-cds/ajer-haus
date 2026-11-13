import { describe, it, expect } from 'vitest';
import { encodeOrderIntakeMetadata, decodeOrderIntake } from '../../src/lib/orderIntake.js';

const DELIVERY_INTAKE = {
  reservationId: 'res-1',
  productId: 'prod-1',
  batchId: 'batch-1',
  quantity: 2,
  recipientName: 'Jo Bloggs',
  deliveryMethod: 'delivery' as const,
  deliveryFeeCents: 1020,
  address: { line1: '1 Example St', suburb: 'Carlton', postcode: '3053' },
  marketingOptIn: true,
};

describe('orderIntake', () => {
  it('round-trips a delivery order, including suburb', () => {
    // The exact bug this seam closes: addressSuburb used to not exist at
    // all, and every delivery Address got a hardcoded suburb: ''.
    const metadata = encodeOrderIntakeMetadata(DELIVERY_INTAKE);
    expect(metadata.addressSuburb).toBe('Carlton');
    expect(decodeOrderIntake(metadata)).toEqual(DELIVERY_INTAKE);
  });

  it('round-trips a pickup order with no address', () => {
    const intake = { ...DELIVERY_INTAKE, deliveryMethod: 'pickup' as const, deliveryFeeCents: 0, address: null };
    const metadata = encodeOrderIntakeMetadata(intake);
    expect(decodeOrderIntake(metadata)).toEqual(intake);
  });

  it('decodes a missing/empty metadata bag to a safe, non-throwing default', () => {
    const intake = decodeOrderIntake(undefined);
    expect(intake.quantity).toBe(0);
    expect(intake.address).toBeNull();
    expect(intake.deliveryMethod).toBe('delivery');
  });

  it('never fabricates an address when addressLine1 is missing, even for a delivery order', () => {
    const intake = decodeOrderIntake({ deliveryMethod: 'delivery', addressSuburb: 'Carlton' });
    expect(intake.address).toBeNull();
  });
});
