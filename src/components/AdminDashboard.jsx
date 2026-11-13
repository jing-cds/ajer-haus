import React, { useEffect, useState } from 'react';

const money = (cents, currency = 'AUD') => `$${(cents / 100).toFixed(2)} ${currency}`;

// Kept in sync with prisma/schema.prisma's BatchStatus/OrderStatus by
// tests/lib/statusChips.test.ts, which cross-checks these keys against the
// real Prisma enums — importing @prisma/client itself isn't safe here,
// since this component is bundled for the browser and the generated client
// pulls in Node-only query-engine bindings.
export const BATCH_CHIP = {
  UPCOMING: 'pending',
  LIVE: 'live',
  SOLD_OUT: 'sold',
  ARCHIVED: 'archived',
};
export const ORDER_CHIP = {
  PENDING_PAYMENT: 'pending',
  PAID: 'paid',
  PACKED: 'shipped',
  OUT_FOR_DELIVERY: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'cancelled',
};

function StatusChip({ status, map }) {
  // Falls back to the dashed/muted "archived" look, not "pending" — an
  // unrecognized status should read as unknown, not as if it's waiting.
  const cls = map[status] || 'archived';
  return <span className={`adminChip ${cls}`}>{status.replace(/_/g, ' ')}</span>;
}

function AdminBar({ onLogout }) {
  return (
    <div className="adminBar">
      <div className="adminBarIn">
        <div className="adminBarL">
          <a href="/" aria-label="Ajer Haus, home"><img src="/logo.png" alt="Ajer Haus" /></a>
          <span className="eyebrow">Admin</span>
        </div>
        {onLogout && <button type="button" className="btn2 sm" onClick={onLogout}>Log out</button>}
      </div>
    </div>
  );
}

function LoginForm({ onLoggedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adminMain">
      <AdminBar />
      <div className="adminWrap" style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={submit} className="poForm" style={{ maxWidth: 360, width: '100%', marginTop: 48 }}>
          <div className="eyebrow">Admin login</div>
          <h3 style={{ margin: 0 }}>Sign in</h3>
          <div className="poRow">
            <label htmlFor="admin-pw">Password</label>
            <input id="admin-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="poErr">{error}</p>}
          <button type="submit" className="btn" disabled={busy}>{busy ? 'Checking…' : 'Log in'}</button>
        </form>
      </div>
    </div>
  );
}

function BatchRow({ batch, onUpdated }) {
  const [totalUnits, setTotalUnits] = useState(batch.totalUnits);
  const [busy, setBusy] = useState(false);

  const post = async (body) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: batch.id, ...body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed.');
      onUpdated(data.batch);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr>
      <td><strong>{batch.product.name}</strong></td>
      <td>{batch.batchCode}</td>
      <td><StatusChip status={batch.status} map={BATCH_CHIP} /></td>
      <td>{batch.availableStock}</td>
      <td>
        <div className="adminRowActions">
          <input
            type="number"
            min="0"
            className="adminInput"
            value={totalUnits}
            onChange={(e) => setTotalUnits(Number(e.target.value))}
            style={{ width: 70 }}
          />
          <button type="button" className="btn2 sm" disabled={busy} onClick={() => post({ action: 'update-stock', totalUnits })}>
            Save
          </button>
        </div>
      </td>
      <td>
        <select
          className="adminSelect"
          value={batch.status}
          disabled={busy}
          onChange={(e) => post({ action: 'set-status', status: e.target.value })}
        >
          {['UPCOMING', 'LIVE', 'SOLD_OUT', 'ARCHIVED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

function OrderRow({ order, onUpdated }) {
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [busy, setBusy] = useState(false);

  const post = async (body) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, ...body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed.');
      onUpdated(data.order);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr>
      <td><strong>{order.orderNumber}</strong></td>
      <td>{order.customer?.email}</td>
      <td>
        <div className="adminItems">
          {order.items.map((it, i) => (
            <span key={i}>{it.quantity}× {it.product.name}</span>
          ))}
        </div>
      </td>
      <td>{money(order.totalCents, order.currency)}</td>
      <td><StatusChip status={order.status} map={ORDER_CHIP} /></td>
      <td>
        <div className="adminRowActions">
          <input
            placeholder="Tracking #"
            className="adminInput"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            style={{ width: 110 }}
          />
          <button type="button" className="btn2 sm" disabled={busy} onClick={() => post({ action: 'mark-shipped', trackingNumber: tracking })}>
            Mark shipped
          </button>
          <button type="button" className="btn2 sm" disabled={busy} onClick={() => post({ action: 'mark-delivered' })}>
            Mark delivered
          </button>
        </div>
      </td>
    </tr>
  );
}

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [ordersRes, batchesRes] = await Promise.all([fetch('/api/admin/orders'), fetch('/api/admin/batches')]);
      if (!ordersRes.ok || !batchesRes.ok) throw new Error('Failed to load admin data.');
      const ordersData = await ordersRes.json();
      const batchesData = await batchesRes.json();
      setOrders(ordersData.orders);
      setBatches(batchesData.batches);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <div className="adminMain">
      <AdminBar onLogout={logout} />
      <div className="adminWrap">
        <h1 className="adminH1">Ajer Haus admin</h1>
        {error && <p className="poErr">{error}</p>}

        <div className="adminSection">
          <div className="adminSecHead">
            <h2>Batches</h2>
            <span className="adminCount">{batches.length} total</span>
          </div>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr><th>Product</th><th>Batch</th><th>Status</th><th>Available</th><th>Total units</th><th>Change status</th></tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <BatchRow
                    key={b.id}
                    batch={b}
                    onUpdated={(updated) => setBatches((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)))}
                  />
                ))}
              </tbody>
            </table>
            {batches.length === 0 && <div className="adminEmpty">No batches yet.</div>}
          </div>
        </div>

        <div className="adminSection">
          <div className="adminSecHead">
            <h2>Orders</h2>
            <span className="adminCount">{orders.length} total</span>
          </div>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Fulfilment</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <OrderRow
                    key={o.id}
                    order={o}
                    onUpdated={(updated) => setOrders((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)))}
                  />
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="adminEmpty">No orders yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <Dashboard /> : <LoginForm onLoggedIn={() => setLoggedIn(true)} />;
}
