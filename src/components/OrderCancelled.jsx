import React from 'react';

export default function OrderCancelled() {
  return (
    <div className="poForm" style={{ maxWidth: 560, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div className="eyebrow">Checkout cancelled</div>
      <h1>No charge was made.</h1>
      <p>Your cart is still saved — pick up where you left off whenever you're ready.</p>
      <a className="btn" href="/collection#order">Back to your order</a>
    </div>
  );
}
