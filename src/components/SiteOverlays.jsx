import React, { useEffect, useRef, useState } from 'react';
import { PLACES } from '../data/places.js';
import { FAQ, PAYMENT_URL, DELIVERY_FEE, FREE_OVER, MAX_QTY, CONTACT_EMAIL } from '../data/shop.js';
import { readCart, writeCart, CART_EVENT } from '../data/cart.js';

const P = PLACES[0];
const money = (n) => '$' + n.toFixed(2);

function useDialogChrome(open, onClose, ref) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const key = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => ref.current && ref.current.focus(), 30);
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = '';
      clearTimeout(t);
      if (prev && prev.focus) prev.focus();
    };
  }, [open]);
}

function Faq({ open, onClose }) {
  const ref = useRef(null);
  useDialogChrome(open, onClose, ref);
  if (!open) return null;
  return (
    <div className="faqFull" role="dialog" aria-modal="true" aria-labelledby="faq-h">
      <div className="faqBar">
        <a href="/" aria-label="Ajer Haus, home"><img src="/logo.png" alt="Ajer Haus" /></a>
        <button ref={ref} type="button" className="faqClose" aria-label="Close FAQ" onClick={onClose}>Close ✕</button>
      </div>
      <div className="faqWrap">
        <div className="eyebrow">Help</div>
        <h2 id="faq-h">Questions</h2>
        {FAQ.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
        <p className="ovFoot">Still stuck? <a className="tlink" href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p>
      </div>
    </div>
  );
}

function Cart({ open, onClose, cart }) {
  const ref = useRef(null);
  useDialogChrome(open, onClose, ref);
  const [method, setMethod] = useState('delivery');
  const [f, setF] = useState({ name: '', email: '', address: '', postcode: '' });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));
  const qty = cart.qty;
  const sub = qty * P.price;
  const ship = qty === 0 || method === 'pickup' || sub >= FREE_OVER ? 0 : DELIVERY_FEE;
  const total = sub + ship;
  const toFree = Math.max(0, FREE_OVER - sub);

  const setQty = (n) => writeCart({ id: 'shrine', qty: Math.max(0, Math.min(MAX_QTY, n)) });

  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = 'Please add your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Please add a valid email.';
    if (method === 'delivery') {
      if (!f.address.trim()) x.address = 'Please add your street address.';
      if (!/^3\d{3}$/.test(f.postcode.trim())) x.postcode = 'We deliver within Victoria only (postcodes 3000–3999).';
    }
    setErr(x);
    if (Object.keys(x).length) return;
    if (PAYMENT_URL) {
      const q = new URLSearchParams({ qty, prefilled_email: f.email, method });
      window.location.href = PAYMENT_URL + (PAYMENT_URL.includes('?') ? '&' : '?') + q.toString();
    } else setDone(true);
  };

  return (
    <div className={'cdBack' + (open ? ' on' : '')} aria-hidden={!open} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="cdPanel" role="dialog" aria-modal="true" aria-labelledby="cd-h">
        <div className="ovHead">
          <h2 id="cd-h">Your cart{qty ? ` (${qty})` : ''}</h2>
          <button ref={ref} type="button" className="ovX" aria-label="Close cart" onClick={onClose}>✕</button>
        </div>
        <div className="cdScroll">
          {done ? (
            <div className="poDone" role="status">
              <h3>Almost there.</h3>
              <p>Payment isn’t switched on yet, so your order of {qty} × {P.name} ({money(total)}) hasn’t been taken. We’ll email {f.email} when pre-orders open.</p>
              <button type="button" className="btn2" onClick={() => setDone(false)}>Back to cart</button>
            </div>
          ) : qty === 0 ? (
            <div className="cdEmpty">
              <p>Your cart is empty.</p>
              <a className="btn" href="/collection#order" onClick={onClose}>See the Shrine of Remembrance</a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="cdItem">
                <div className="cdSw" style={{ background: P.bg, color: P.fg }}>{P.name.split(' ')[0]}</div>
                <div className="cdInfo">
                  <strong>{P.name}</strong>
                  <span>90g soy-coconut tin · Pre-order</span>
                  <div className="poQty">
                    <button type="button" aria-label="Fewer" onClick={() => setQty(qty - 1)}>−</button>
                    <input value={qty} readOnly aria-label="Quantity" />
                    <button type="button" aria-label="More" onClick={() => setQty(qty + 1)}>+</button>
                  </div>
                </div>
                <div className="cdPrice">{money(sub)}<button type="button" className="cdRm" onClick={() => setQty(0)}>Remove</button></div>
              </div>

              <div className="cdFree">
                {method === 'pickup' ? 'Pickup is free.' : toFree > 0 ? <>Add {money(toFree)} for free delivery.</> : 'You have free delivery.'}
                <div className="cdBar"><i style={{ width: Math.min(100, (sub / FREE_OVER) * 100) + '%' }} /></div>
              </div>

              <fieldset className="poMethod">
                <legend>Get it by</legend>
                <label><input type="radio" name="cm" checked={method === 'delivery'} onChange={() => setMethod('delivery')} /> Delivery in Victoria · {money(DELIVERY_FEE)}, free over ${FREE_OVER}</label>
                <label><input type="radio" name="cm" checked={method === 'pickup'} onChange={() => setMethod('pickup')} /> Pickup · Melbourne CBD · free</label>
              </fieldset>

              <div className="poRow"><label htmlFor="cd-name">Name</label><input id="cd-name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!err.name} />{err.name && <span className="poErr">{err.name}</span>}</div>
              <div className="poRow"><label htmlFor="cd-email">Email</label><input id="cd-email" type="email" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={!!err.email} />{err.email && <span className="poErr">{err.email}</span>}</div>
              {method === 'delivery' && (
                <>
                  <div className="poRow"><label htmlFor="cd-addr">Street address</label><input id="cd-addr" autoComplete="street-address" value={f.address} onChange={set('address')} aria-invalid={!!err.address} />{err.address && <span className="poErr">{err.address}</span>}</div>
                  <div className="poRow"><label htmlFor="cd-pc">Postcode</label><input id="cd-pc" inputMode="numeric" maxLength={4} autoComplete="postal-code" value={f.postcode} onChange={set('postcode')} aria-invalid={!!err.postcode} />{err.postcode && <span className="poErr">{err.postcode}</span>}</div>
                </>
              )}

              <dl className="poSum">
                <div><dt>Subtotal</dt><dd>{money(sub)}</dd></div>
                <div><dt>{method === 'pickup' ? 'Pickup' : 'Delivery'}</dt><dd>{ship ? money(ship) : 'Free'}</dd></div>
                <div className="tot"><dt>Total (AUD)</dt><dd>{money(total)}</dd></div>
              </dl>
              <button type="submit" className="btn">Continue to payment</button>
              <p className="cdFine">By continuing you agree to our <a className="tlink" href="/terms">Terms</a> and <a className="tlink" href="/privacy">Privacy Policy</a>.</p>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function SiteOverlays() {
  const [faq, setFaq] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({ id: 'shrine', qty: 0 });

  useEffect(() => {
    setCart(readCart());
    const sync = () => setCart(readCart());
    const openFaq = () => { setCartOpen(false); setFaq(true); };
    const openCart = () => { setFaq(false); setCartOpen(true); };
    const click = (e) => {
      const a = e.target.closest && e.target.closest('a[href="#faq"]');
      if (a) { e.preventDefault(); openFaq(); return; }
      const b = e.target.closest && e.target.closest('[aria-label="Cart"]');
      if (b) { e.preventDefault(); openCart(); }
    };
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('ah:cart-open', openCart);
    window.addEventListener('ah:faq-open', openFaq);
    document.addEventListener('click', click);
    if (location.hash === '#faq') openFaq();
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('ah:cart-open', openCart);
      window.removeEventListener('ah:faq-open', openFaq);
      document.removeEventListener('click', click);
    };
  }, []);

  // Header cart buttons live inside each page island: mark them with the count.
  useEffect(() => {
    const mark = () => document.querySelectorAll('[aria-label="Cart"]').forEach((b) => {
      if (cart.qty) b.setAttribute('data-count', String(cart.qty)); else b.removeAttribute('data-count');
    });
    mark();
    const t = [300, 1000, 2500].map((ms) => setTimeout(mark, ms));
    return () => t.forEach(clearTimeout);
  }, [cart.qty]);

  const closeFaq = () => { setFaq(false); if (location.hash === '#faq') history.replaceState(null, '', location.pathname + location.search); };
  return (
    <>
      <Faq open={faq} onClose={closeFaq} />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
    </>
  );
}
