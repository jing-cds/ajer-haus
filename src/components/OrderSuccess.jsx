import React from 'react';

export default function OrderSuccess() {
  return (
    <div className="poForm" style={{ maxWidth: 560, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div className="eyebrow">Pre-order confirmed</div>
      <h1>Thank you.</h1>
      <p>
        Your payment went through. We're emailing your confirmation and order number now — it can take a minute or
        two to arrive, so check your spam folder if you don't see it.
      </p>
      <a className="btn" href="/collection">Back to the Place Collection</a>
    </div>
  );
}
