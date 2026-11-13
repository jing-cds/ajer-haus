// src/lib/orderIntake.ts
// The one typed seam for what a Stripe Checkout Session's metadata carries
// from api/create-checkout-session.ts (encodeOrderIntakeMetadata) to
// api/stripe-webhook.ts's order-creation logic (decodeOrderIntake). Stripe
// metadata is string-only, so this is where that stringly-typed bag
// becomes — and un-becomes — a real shape: one place that knows the key
// names and coercion rules, instead of two files quietly agreeing on them
// by convention. A key added on one side without the other now fails to
// compile here, not silently at runtime (see tests/lib/orderIntake.test.ts
// for the exact bug this used to let through: an address with no suburb).
export interface OrderIntakeAddress {
  line1: string;
  suburb: string;
  postcode: string;
}

export interface OrderIntake {
  reservationId: string;
  productId: string;
  batchId: string;
  quantity: number;
  recipientName: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryFeeCents: number;
  address: OrderIntakeAddress | null;
  marketingOptIn: boolean;
}

export function encodeOrderIntakeMetadata(intake: OrderIntake): Record<string, string> {
  return {
    reservationId: intake.reservationId,
    productId: intake.productId,
    batchId: intake.batchId,
    quantity: String(intake.quantity),
    recipientName: intake.recipientName,
    deliveryMethod: intake.deliveryMethod,
    deliveryFeeCents: String(intake.deliveryFeeCents),
    addressLine1: intake.address?.line1 || '',
    addressSuburb: intake.address?.suburb || '',
    addressPostcode: intake.address?.postcode || '',
    marketingOptIn: String(intake.marketingOptIn),
  };
}

export function decodeOrderIntake(metadata: Record<string, string | undefined> | null | undefined): OrderIntake {
  const m = metadata || {};
  const deliveryMethod: 'delivery' | 'pickup' = m.deliveryMethod === 'pickup' ? 'pickup' : 'delivery';
  const hasAddress = deliveryMethod === 'delivery' && !!m.addressLine1;

  return {
    reservationId: m.reservationId || '',
    productId: m.productId || '',
    batchId: m.batchId || '',
    quantity: parseInt(m.quantity || '', 10) || 0,
    recipientName: m.recipientName || '',
    deliveryMethod,
    deliveryFeeCents: m.deliveryFeeCents ? parseInt(m.deliveryFeeCents, 10) || 0 : 0,
    address: hasAddress
      ? { line1: m.addressLine1 || '', suburb: m.addressSuburb || '', postcode: m.addressPostcode || '' }
      : null,
    marketingOptIn: m.marketingOptIn === 'true',
  };
}
