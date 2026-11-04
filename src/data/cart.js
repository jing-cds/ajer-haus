// Tiny cart store: one product for now, kept in localStorage, shared by every island via events.
const KEY = 'ajerhaus.cart.v1';
export const CART_EVENT = 'ah:cart';

export function readCart() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (c && Number.isInteger(c.qty) && c.qty > 0) return { id: 'shrine', qty: Math.min(c.qty, 12) };
  } catch (e) { /* storage unavailable */ }
  return { id: 'shrine', qty: 0 };
}
export function writeCart(c) {
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* ignore */ }
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: c }));
}
export function addToCart(qty, open = true) {
  const c = readCart();
  writeCart({ id: 'shrine', qty: Math.min(12, c.qty + qty) });
  if (open) window.dispatchEvent(new Event('ah:cart-open'));
}
