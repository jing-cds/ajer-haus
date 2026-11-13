/**
 * Order number generator — "AH-2026-000123". Not guaranteed collision-free
 * on its own (six random digits); callers that insert the result into
 * Order.orderNumber (which is DB-unique) should retry generation on a
 * unique-constraint violation rather than relying on this alone. See
 * api/stripe-webhook.ts.
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');
  return `AH-${year}-${rand}`;
}
