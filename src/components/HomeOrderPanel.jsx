import React from 'react';
import { PLACES } from '../data/places.js';
import { ING } from '../data/ingredients.js';
import { STORY_FOR_CANDLE, STORY } from '../data/events.js';

const P = PLACES[0];

/* Sits beside the Shrine card on the home page: the essentials and a way straight into the order. */
export default function HomeOrderPanel() {
  return (
    <aside className="hopPanel" aria-label="Pre-order Shrine of Remembrance">
      <div className="eyebrow">Open for pre-order</div>
      <h3>{P.name}</h3>
      <p className="hopMemory">{P.memory}</p>
      <div className="hopIng">
        {P.items.map((k) => (
          <figure key={k}>
            <svg viewBox="0 0 80 96" width="48" height="58" aria-hidden="true" style={{ overflow: 'visible' }}>
              <circle cx="47" cy="47" r="30" fill={P.fg} />
              <path d={ING[k].d} fill="none" stroke="#1F1B18" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={ING[k].e || 'M0 0'} fill="none" stroke="#1F1B18" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <figcaption>{ING[k].n}</figcaption>
          </figure>
        ))}
      </div>
      <ul className="hopList">
        <li><span>Price</span><strong>${P.price} AUD</strong></li>
        <li><span>Size</span><strong>90g soy-coconut tin</strong></li>
        <li><span>Delivery</span><strong>Victoria $10.20, free over $75</strong></li>
        <li><span>Pickup</span><strong>Melbourne CBD, free</strong></li>
      </ul>
      {STORY_FOR_CANDLE[P.id] && <a className="tlink" href="/events#past">Born at {STORY.title} →</a>}
      <a className="btn" href="/collection#order">Pre-order · ${P.price} AUD</a>
    </aside>
  );
}
