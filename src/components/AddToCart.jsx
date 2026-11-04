import React, { useState } from 'react';
import { PLACES } from '../data/places.js';
import { MAX_QTY } from '../data/shop.js';
import { addToCart } from '../data/cart.js';

const P = PLACES[0];

export default function AddToCart() {
  const [qty, setQty] = useState(1);
  return (
    <div id="order" className="poForm atcBox">
      <div className="poRow">
        <label htmlFor="atc-qty">Quantity</label>
        <div className="poQty">
          <button type="button" aria-label="Fewer" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input id="atc-qty" value={qty} readOnly aria-live="polite" />
          <button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}>+</button>
        </div>
      </div>
      <button type="button" className="btn" onClick={() => addToCart(qty)}>Add to cart · ${(qty * P.price).toFixed(2)}</button>
      <p className="atcNote">Pre-order. Delivery in Victoria $10.20, free over $75. Pickup in the Melbourne CBD is free.</p>
    </div>
  );
}
