import React, { useEffect, useState } from 'react';

export default function Unsubscribe() {
  const [state, setState] = useState('loading'); // loading | ok | error
  const [error, setError] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setState('error');
      setError('Missing unsubscribe link.');
      return;
    }
    fetch(`/api/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to unsubscribe.');
        setState('ok');
      })
      .catch((err) => {
        setError(err.message);
        setState('error');
      });
  }, []);

  return (
    <div className="poForm" style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div className="eyebrow">Email preferences</div>
      {state === 'loading' && <p>Working on it…</p>}
      {state === 'ok' && <h1>You're unsubscribed.</h1>}
      {state === 'error' && <p className="poErr">{error}</p>}
      <a className="btn2" href="/">Back home</a>
    </div>
  );
}
