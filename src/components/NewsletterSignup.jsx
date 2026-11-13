import React, { useState } from 'react';

// Shared "Join The Scentimentalist Society" footer form. Lived as ~65 lines
// of duplicated, unwired inline-styled JSX in every page component; this is
// the one place it's wired to POST /api/subscribe, same endpoint and
// source/productSlug shape as src/components/NotifyMeGrid.jsx's per-scent
// signup.
const fieldStyle = {
  minHeight: '48px',
  padding: '0 16px',
  background: 'transparent',
  border: '1px solid #7A746C',
  borderRadius: '2px',
  color: '#F4F8F5',
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '16px',
  boxSizing: 'border-box',
};

export default function NewsletterSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'newsletter' }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return <p style={{ color: '#F4F8F5', fontSize: 15, margin: 0 }}>You're on the list — thank you.</p>;
  }

  return (
    <form
      onSubmit={submit}
      style={{ flex: '1 1 420px', minWidth: '0', display: 'flex', flexWrap: 'wrap', gap: '10px' }}
    >
      <label htmlFor="nl-name" style={{ position: 'absolute', left: '-9999px' }}>Your name</label>
      <input
        id="nl-name"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ ...fieldStyle, flex: '1 1 150px', minWidth: '0' }}
      />
      <label htmlFor="nl-email" style={{ position: 'absolute', left: '-9999px' }}>Email address</label>
      <input
        id="nl-email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ ...fieldStyle, flex: '1 1 200px', minWidth: '0' }}
      />
      <button type="submit" className="btn" disabled={status === 'sending'}>
        {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <span style={{ color: '#F2AAA0', fontSize: 13, flexBasis: '100%' }}>
          Something went wrong. Please try again shortly.
        </span>
      )}
    </form>
  );
}
