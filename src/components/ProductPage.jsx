import React, { useState } from 'react';
import { PLACES } from '../data/places.js';
import { ING } from '../data/ingredients.js';
import { STORY, STORY_FOR_CANDLE } from '../data/events.js';
import AddToCart from './AddToCart.jsx';

const P = PLACES[0];
const Ing = ({ k, size = 72 }) => (
  <figure>
    <svg viewBox="0 0 80 96" width={size} height={size * 1.2} aria-hidden="true" style={{ overflow: 'visible' }}>
      <circle cx="47" cy="47" r="30" fill={P.fg} />
      <path d={ING[k].d} fill="none" stroke="#1F1B18" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ING[k].e || 'M0 0'} fill="none" stroke="#1F1B18" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <figcaption>{ING[k].n}</figcaption>
  </figure>
);

/* The one product page: gallery on the left, details and the pre-order form on the right,
   specs and small print below. */
export default function ProductPage() {
  const [lit, setLit] = useState(false);
  const linked = STORY_FOR_CANDLE[P.id];
  return (
    <main className="ppMain">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb"><a href="/">Home</a>{' / '}<a href="/shop">Shop</a>{' / '}<span aria-current="page">The Place Collection</span></nav>
        <h1 className="ppH">The Place Collection</h1>
        <div className="ppGrid">
          <div className="ppGallery">
            <div className="ppHero" style={{ background: P.wash }}>
              <span className="ppTag">#0126 · Hand-poured | Naarm</span>
              <div className="ppShot">
                <img src="/product/unlit.jpg" alt={P.name + ' candle, unlit'} className={lit ? 'off' : ''} />
                <img src="/product/lit.jpg" alt={P.name + ' candle, lit'} className={lit ? '' : 'off'} />
              </div>
              <button type="button" className="btn2" aria-pressed={lit} onClick={() => setLit((v) => !v)}>{lit ? 'Snuff the candle' : 'Light the candle'}</button>
            </div>
            <div className="ppMade" style={{ background: P.wash }}>
              <div className="ppLbl">What it is made of</div>
              <div className="ppIngRow">{P.items.map((k) => <Ing key={k} k={k} />)}</div>
            </div>
            {[['/product/closed.jpg', 'Lid on, ready to gift'], ['/product/lid-off.jpg', 'Lid off, wick trimmed']].map(([src, t]) => (
              <figure className="ppShotSm" key={src}><img src={src} alt={t} /><figcaption>{t}</figcaption></figure>
            ))}
            <div className="ppPhoto"><span>Photo</span>In place: the Shrine, St Kilda Rd</div>
          </div>

          <div className="ppDetail">
            <div className="ppMeta"><span>No. 0126 · The Place Collection</span><span className="ppChip">Pre-order</span></div>
            <h2 className="ppName">{P.name}</h2>
            <div className="ppPlace">{P.place}</div>
            <p className="ppMemory">{P.memory}</p>
            <div className="ppPrice"><strong>${P.price}</strong> AUD <span>90g soy-coconut tin</span></div>
            <p className="ppNotes">{P.notes}{P.sub ? ', ' + P.sub : ''}</p>
            {linked && (
              <a className="poStory" href="/events#past"><span>Born at a Scent Story</span><strong>{STORY.title}</strong><em>{STORY.when} →</em></a>
            )}
            <AddToCart />
          </div>
        </div>

        <section className="ppBottom" aria-label="Specs and small print">
          <h2 className="ppSub">The details</h2>
          <dl className="ppSpecs">
            <div><dt>Size</dt><dd>90g</dd></div>
            <div><dt>Wax</dt><dd>Soy-coconut</dd></div>
            <div><dt>Vessel</dt><dd>Silver tin with lid</dd></div>
            <div><dt>Scent notes</dt><dd>{P.notes}</dd></div>
            <div><dt>Made</dt><dd>Hand-poured in Naarm</dd></div>
            <div><dt>Batch</dt><dd>#0126</dd></div>
            <div><dt>Price</dt><dd>${P.price} AUD retail</dd></div>
            <div><dt>Burn time</dt><dd className="tbc">To be confirmed</dd></div>
          </dl>
          <div className="ppAcc">
            <details open><summary>The memory</summary><p className="ppMemory">{P.memory}</p><p className="tbc">More of the story is on its way.</p></details>
            <details><summary>How pre-ordering works</summary>
              <ol>
                <li><strong>Pay in full today.</strong> You are charged when you order.</li>
                <li><strong>Ships together.</strong> Mixed carts ship in one parcel on the pre-order dispatch date.</li>
                <li><strong>Delivery or pickup.</strong> Delivered across Victoria, or collected at the first announced Melbourne CBD pickup after dispatch.</li>
                <li><strong>We keep you posted.</strong> An email when it ships, and again if the date moves.</li>
              </ol>
            </details>
            <details><summary>Product information &amp; safety</summary><p>Soy-coconut wax, 90g, silver tin. Wick, burn time and the safety warnings will mirror the warning label.</p><p className="tbc">To be confirmed.</p></details>
            <details><summary>Care guide</summary><p className="tbc">To be confirmed.</p></details>
            <details><summary>Delivery, pickup &amp; returns</summary><p>Victoria only: $10.20 flat, free for orders of $75 or more. Pickup in the Melbourne CBD is free, with points and times announced. <a className="tlink" href="/delivery">Full details</a></p></details>
            <details><summary>Pre-order terms</summary>
              <ul>
                <li><strong>Dispatch date:</strong> <span className="tbc">[first batch dispatch date or window]</span></li>
                <li><strong>Quantity caps:</strong> <span className="tbc">[caps per product, if any]</span></li>
                <li><strong>Cancellation and refunds:</strong> <span className="tbc">[to be written and linked before pre-orders open]</span></li>
              </ul>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
