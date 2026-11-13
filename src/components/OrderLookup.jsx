import React, { useEffect, useState } from 'react';

const money = (cents, currency) => `$${(cents / 100).toFixed(2)} ${currency}`;

export default function OrderLookup() {
  const [state, setState] = useState('loading'); // loading | ok | error
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setState('error');
      setError('Missing order link.');
      return;
    }
    fetch(`/api/order-lookup?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to load order.');
        setOrder(data.order);
        setState('ok');
      })
      .catch((err) => {
        setError(err.message);
        setState('error');
      });
  }, []);

  return (
    <div className="poForm" style={{ maxWidth: 560, margin: '80px auto', padding: '0 20px' }}>
      <div className="eyebrow">Order status</div>
      {state === 'loading' && <p>Loading…</p>}
      {state === 'error' && <p className="poErr">{error}</p>}
      {state === 'ok' && order && (
        <>
          <h1>{order.orderNumber}</h1>
          <p>Status: <strong>{order.status.replace(/_/g, ' ').toLowerCase()}</strong></p>
          <ul style={{ paddingLeft: 18 }}>
            {order.items.map((it, i) => (
              <li key={i}>{it.quantity} × {it.productName}</li>
            ))}
          </ul>
          <p>Total: {money(order.totalCents, order.currency)}</p>
          {order.trackingNumber && <p>Tracking: {order.trackingNumber}</p>}
          {order.deliveryAddress && (
            <p>
              {order.deliveryAddress.line1}
              {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}, {order.deliveryAddress.suburb} {order.deliveryAddress.postcode}
            </p>
          )}
        </>
      )}
    </div>
  );
}
