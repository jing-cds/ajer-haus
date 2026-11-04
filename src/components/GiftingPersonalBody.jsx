import React, { useState } from 'react';
import { PLACES } from '../data/places.js';

const P = PLACES[0];

export default function GiftingPersonalBody() {
  const [done, setDone] = useState(false);
  return (
    <main className="gfMain">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb"><a href="/">Home</a>{' / '}<a href="/gifting">Gifting</a>{' / '}<span aria-current="page">Personal</span></nav>
        <div className="eyebrow">Personal gifting</div>
        <h1 className="gfH">A place, for someone you love.</h1>
        <p className="gfLead">Every candle in The Place Collection is a Melbourne memory. Give the one that sounds like them.</p>

        <section className="gfFeature" style={{ background: P.wash }}>
          <div className="gfTag">Open for pre-order</div>
          <h2>{P.name}</h2>
          <p className="gfMemory">{P.memory}</p>
          <p>{P.notes}{P.sub ? ', ' + P.sub : ''}. 90g soy-coconut wax in a silver tin. <strong>${P.price} AUD.</strong></p>
          <a className="btn" href="/collection#order">Pre-order as a gift</a>
        </section>

        <section className="gfSteps" aria-label="How gifting works">
          <div><span>1</span><strong>Pick a place</strong><p>The Shrine of Remembrance is open now. More places are on the scent map.</p></div>
          <div><span>2</span><strong>Add your details</strong><p>Delivery is within Victoria, or collect in the Melbourne CBD. A gift message and a different delivery address are <em className="tbc">to be confirmed</em>.</p></div>
          <div><span>3</span><strong>We send it</strong><p>Delivery is $10.20, free over $75. Pre-orders ship together when the first batch is poured.</p></div>
        </section>

        <section className="gfSoon">
          <h2>Gift sets are on their way.</h2>
          <p>Trios, a pick-your-three and pairs, in a gift box. Sizes, contents and prices are still being decided.</p>
          {done ? (
            <p className="smThanks" role="status">Thank you. We will write when gift sets are ready.</p>
          ) : (
            <form className="stForm" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
              <label htmlFor="gfEmail" className="sr">Email address</label>
              <input id="gfEmail" type="email" required placeholder="Email address" autoComplete="email" />
              <button className="btn" type="submit">Tell me when</button>
            </form>
          )}
        </section>
        <p className="gfNote">Sending outside Victoria, or buying for a team? See <a className="tlink" href="/gifting/corporate">corporate gifting</a> or write to <a className="tlink" href="mailto:hello@ajerhaus.com">hello@ajerhaus.com</a>.</p>
      </div>
    </main>
  );
}
