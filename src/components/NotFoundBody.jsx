import React from 'react';

export default function NotFoundBody() {
  return (
    <main className="gfMain nfMain">
      <div className="wrap">
        <div className="eyebrow">404</div>
        <h1 className="gfH">This place isn’t on the map.</h1>
        <p className="gfLead">The page you were looking for has moved, or the link has a typo. Here are some places that do exist.</p>
        <div className="nfLinks">
          <a className="btn" href="/">Home</a>
          <a className="btn2" href="/collection">The Place Collection</a>
          <a className="btn2" href="/events">Scent Stories</a>
          <a className="btn2" href="/gifting">Gifting</a>
        </div>
        <p className="gfNote">Still lost? Say hello at <a className="tlink" href="mailto:hello@ajerhaus.com">hello@ajerhaus.com</a>.</p>
      </div>
    </main>
  );
}
