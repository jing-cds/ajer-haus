import React, { useState } from 'react';

// The "Say hello." modal. Lived as ~270 lines of duplicated JSX in every
// page component, with a `sendMsg` that only ever flipped local state —
// no message was ever sent anywhere. This is the one place it's wired to
// POST /api/contact. Parent components keep `contactOpen`/`closeOv` only
// to decide whether to render this and to close it (also used to coordinate
// with the FAQ popup and mobile menu, which stays their concern).
const TOPICS = ['An order', 'Delivery or pickup', 'Corporate gifting', 'Scent Story events', 'Something else'];

const labelStyle = {
  fontSize: '12px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontWeight: '600',
};
const fieldStyle = {
  minHeight: '48px',
  padding: '0 14px',
  border: '1px solid #1F1B18',
  borderRadius: '2px',
  background: '#fff',
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: '16px',
  boxSizing: 'border-box',
};

export default function ContactModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const close = () => {
    setStatus('idle');
    setName('');
    setEmail('');
    setTopic(TOPICS[0]);
    setMessage('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        zIndex: '210',
        background: 'rgba(31,27,24,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: '17px',
        lineHeight: '1.55',
        color: '#1F1B18',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact Ajer Haus"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '100%',
          overflowY: 'auto',
          background: '#FBFAF7',
          border: '1.5px solid #1F1B18',
          borderRadius: '6px',
          padding: '28px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <button
          onClick={close}
          aria-label="Close contact form"
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            width: '44px',
            height: '44px',
            border: '0',
            background: 'transparent',
            color: '#C4361F',
            fontSize: '22px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <div style={{ fontSize: '12px', letterSpacing: '0.34em', textTransform: 'uppercase', color: '#C4361F', fontWeight: '600' }}>
          Contact
        </div>
        <h2 style={{ margin: '0', fontFamily: "'Bodoni Moda', serif", fontWeight: '700', fontSize: '34px', lineHeight: '1.08' }}>
          Say hello.
        </h2>
        {status !== 'sent' && (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ color: '#5C564E', fontSize: '15px' }}>
              hello@ajerhaus.com · We reply within 2–3 business days
            </div>
            <label htmlFor="ct-name" style={labelStyle}>Name</label>
            <input id="ct-name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
            <label htmlFor="ct-email" style={labelStyle}>Email</label>
            <input id="ct-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
            <label htmlFor="ct-topic" style={labelStyle}>What is it about?</label>
            <select id="ct-topic" value={topic} onChange={(e) => setTopic(e.target.value)} style={fieldStyle}>
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <label htmlFor="ct-msg" style={labelStyle}>Message</label>
            <textarea id="ct-msg" rows="4" required value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...fieldStyle, padding: '12px 14px', resize: 'vertical' }} />
            {status === 'error' && (
              <p style={{ color: '#C4361F', fontSize: '14px', margin: '0' }}>
                Something went wrong. Please try again, or email hello@ajerhaus.com directly.
              </p>
            )}
            <div>
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  minHeight: '48px',
                  padding: '0 26px',
                  background: '#EE5340',
                  color: '#1F1B18',
                  border: '0',
                  borderRadius: '2px',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: '600',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        )}
        {status === 'sent' && (
          <>
            <div aria-live="polite" style={{ padding: '18px', border: '1.5px solid #1F1B18', borderRadius: '2px', background: 'rgba(246,220,208,0.6)' }}>
              <span style={{ fontWeight: '700' }}>Thank you.</span>
              {' Your message is on its way. We reply within 2–3 business days.'}
            </div>
            <div>
              <button
                onClick={close}
                style={{
                  minHeight: '48px',
                  padding: '0 26px',
                  background: 'transparent',
                  color: '#C4361F',
                  border: '1.5px solid #EE5340',
                  borderRadius: '2px',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: '600',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
