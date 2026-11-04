import React from 'react';

export default function GiftingHubBody() {
  return (
    <main className="gfMain">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb"><a href="/">Home</a>{' / '}<span aria-current="page">Gifting</span></nav>
        <div className="eyebrow">Gifting</div>
        <h1 className="gfH">Give a place.</h1>
        <p className="gfLead">A candle that carries a Melbourne memory, for someone you love or for the people you work with. Choose where to start.</p>
        <div className="gfChoose">
          <a className="gfBig" href="/gifting/personal" style={{ background: '#C9DEEC' }}>
            <span className="eyebrow">For someone you love</span>
            <h2>Personal gifting</h2>
            <p>Birthdays, thank-yous and housewarmings. Send the Shrine of Remembrance, with more places on the way.</p>
            <span className="gfGo">Start here →</span>
          </a>
          <a className="gfBig" href="/gifting/corporate" style={{ background: '#CFE6DC' }}>
            <span className="eyebrow">For clients and teams</span>
            <h2>Corporate gifting</h2>
            <p>Client gifts, welcome gifts and event gifts, with a custom message and delivery to many addresses.</p>
            <span className="gfGo">Start here →</span>
          </a>
        </div>
        <p className="gfNote">Not sure which one? Say hello at <a className="tlink" href="mailto:hello@ajerhaus.com">hello@ajerhaus.com</a>. We reply within 2–3 business days.</p>
      </div>
    </main>
  );
}
