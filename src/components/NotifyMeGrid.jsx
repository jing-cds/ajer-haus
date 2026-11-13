import React, { useState } from 'react';
import { PLACES } from '../data/places.js';

const SOON = PLACES.filter((p) => !p.live);

function NotifyCard({ place }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'notify-me', productSlug: place.slug }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="nmCard" style={{ background: place.wash || '#F4F8F5', borderRadius: 12, padding: '18px 20px' }}>
      <strong>{place.name}</strong>
      {place.teaser && <p style={{ margin: '6px 0 12px', fontSize: 14 }}>{place.teaser}</p>}
      {state === 'done' ? (
        <p role="status" style={{ fontSize: 14 }}>You're on the list — we'll email you when it's poured.</p>
      ) : (
        <form onSubmit={submit} className="poRow" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <input
            type="email"
            aria-label={`Email for ${place.name}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn2" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Notify me'}
          </button>
        </form>
      )}
      {state === 'error' && <span className="poErr">Please add a valid email and try again.</span>}
    </div>
  );
}

export default function NotifyMeGrid() {
  if (SOON.length === 0) return null;
  return (
    <section id="coming-soon" style={{ padding: '48px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="eyebrow">Coming soon</div>
      <h2>Leave your email on a scent</h2>
      <p>The other six places are on their way. Tell us which one, and we'll email you the moment it's poured.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 20 }}>
        {SOON.map((p) => (
          <NotifyCard key={p.id} place={p} />
        ))}
      </div>
    </section>
  );
}
