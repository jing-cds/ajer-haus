/**
 * Delivery pricing/validation. Ajer Haus only ships within Victoria and
 * charges one flat fee (free over a threshold) or offers free Melbourne CBD
 * pickup — nothing like Unstitch's distance-tiered DeliveryZone table is
 * needed here, so this stays plain constants + functions, matching the
 * values already hardcoded in src/data/shop.js on the frontend.
 */
export const DELIVERY_FEE_CENTS = 1020; // $10.20
export const FREE_DELIVERY_OVER_CENTS = 7500; // $75.00

export class OutOfDeliveryAreaError extends Error {
  constructor(postcode: string) {
    super(`Postcode ${postcode} is outside our Victoria-only delivery area`);
    this.name = 'OutOfDeliveryAreaError';
  }
}

/** Victoria postcodes are 3000-3999. */
export function isVictorianPostcode(postcode: string): boolean {
  return /^3\d{3}$/.test(postcode);
}

/**
 * Throws OutOfDeliveryAreaError for a delivery postcode outside Victoria.
 * Pickup orders don't need a postcode at all, so `postcode` is only
 * required/checked when `method === 'delivery'`.
 */
export function resolveDeliveryFeeCents(method: 'delivery' | 'pickup', postcode: string | undefined, subtotalCents: number): number {
  if (method === 'pickup') return 0;
  if (!postcode || !isVictorianPostcode(postcode)) {
    throw new OutOfDeliveryAreaError(postcode || '');
  }
  return subtotalCents >= FREE_DELIVERY_OVER_CENTS ? 0 : DELIVERY_FEE_CENTS;
}
