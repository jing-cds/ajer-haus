import React from 'react';


const PRE_ON = true; // flip to false to hide the Pre-order button and page link
const FAQ = [
  { q: 'Do you deliver outside Victoria?', a: 'Not yet. We deliver within Victoria only for now. Pop your email in at checkout and we will tell you when we reach your state.' },
  { q: 'Can I collect my order?', a: 'Yes. Choose Collect in Melbourne CBD at checkout. We announce the pickup point, date and time on this page, at checkout and by email. There are no slots to book.' },
  { q: 'How do pre-orders work?', a: 'You pay in full when you order. If your cart mixes in-stock and pre-order candles, everything ships together on the pre-order dispatch date. We email you when it ships, and again if the date moves.' },
  { q: 'Can I send a candle as a gift?', a: 'Yes. Add a gift message and ship to a different address within Victoria.' },
  { q: 'Do you do corporate or bulk orders?', a: 'Yes. See Gifting for custom messages, labels and delivery to multiple addresses, then send us a quote request.' }
];

const FAQS = [
  { q: 'Do you deliver outside Victoria?', a: 'Not yet. We deliver within Victoria only for now. Pop your email in at checkout and we will tell you when we reach your state.' },
  { q: 'How much is delivery?', a: 'Flat $10.20 with Australia Post, and free for orders of $75 or more. [Confirm: threshold measured before or after discounts.]' },
  { q: 'Can I collect my order?', a: 'Yes. Choose Collect in Melbourne CBD at checkout. We announce the pickup point, date and time on the Delivery, pickup & returns page, at checkout and by email. There are no slots to book.' },
  { q: 'How do pre-orders work?', a: 'You pay in full when you order. If your cart mixes in-stock and pre-order candles, everything ships together on the pre-order dispatch date. We email you when it ships, and again if the date moves.' },
  { q: 'Which scents can I buy now?', a: 'Shrine of Remembrance is poured and ready. The other six places are coming soon. Leave your email on a scent and we will tell you when it is poured.' },
  { q: 'How do I burn and care for my candle?', a: '[BURN GUIDANCE, WARNINGS AND DISPOSAL: reproduce the label text exactly. See the care guide on each product page.]' },
  { q: 'Can I send a candle as a gift?', a: 'Yes. Add a gift message and ship to a different address within Victoria.' },
  { q: 'Do you do corporate or bulk orders?', a: 'Yes. See Gifting for custom messages, labels and delivery to multiple addresses, then send us a quote request.' },
  { q: 'Where do I get Scent Story tickets?', a: 'Tickets are sold on Humanitix. Each event page on this site links straight to the right one.' }
];

const SECTIONS = [
        { eyebrow: 'Australia Post', title: 'Delivery', rows: [
          { k: 'Where', v: 'Victoria only for now. We check your postcode at checkout.' },
          { k: 'Cost', v: 'Flat $10.20. Free for orders of $75 or more.' },
          { k: 'What counts', v: 'Pre-order items count toward the $75. [Confirm: measured before or after discounts.]' },
          { k: 'Dispatch', v: '[Dispatch lead time to confirm]' },
          { k: 'Gifts', v: 'Add a gift message and ship to someone else within Victoria.' },
          { k: 'Outside Victoria', v: 'Not yet. Leave your email and we will tell you when we ship to your state.' }
        ] },
        { eyebrow: 'If something goes wrong', title: 'Returns & breakage', rows: [
          { k: 'Returns', v: '[RETURNS POLICY]' },
          { k: 'Breakage & packaging', v: '[BREAKAGE POLICY, to be written]' },
          { k: 'Wrong or faulty item', v: '[WHAT TO DO AND WHO TO CONTACT]' }
        ] }
      ];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pre: PRE_ON, pc: '', faq: 0, acc: 0, pick: false };
    this.state.hide = false; this.state.menu = false; this._y = 0;
    this.onScroll = this.onScroll.bind(this);
    this.onKey = this.onKey.bind(this);
    this.state.faqOpen = false; this.state.contactOpen = false; this.state.sent = false; this.state.fq = 0;
  }
  componentDidMount() { window.addEventListener('scroll', this.onScroll, true); window.addEventListener('keydown', this.onKey); }
  componentWillUnmount() { window.removeEventListener('scroll', this.onScroll, true); window.removeEventListener('keydown', this.onKey); }
  onScroll(e) {
    const t = e.target;
    let y;
    if (!t || t === document || t === window || t.nodeType === 9) {
      y = window.scrollY || (document.documentElement && document.documentElement.scrollTop) || 0;
    } else {
      const root = document.getElementById('top');
      if (!root || !t.contains || !t.contains(root)) return;
      y = t.scrollTop;
    }
    const d = y - this._y;
    if (Math.abs(d) < 6) return;
    this._y = y;
    const hide = d > 0 && y > 140;
    if (hide !== this.state.hide) this.setState({ hide: hide });
  }
  ovVals() {
    const st = this.state;
    const stop = (e) => { if (e && e.preventDefault) e.preventDefault(); };
    return {
      faqOpen: !!st.faqOpen,
      contactOpen: !!st.contactOpen,
      sent: !!st.sent,
      notSent: !st.sent,
      openFaq: (e) => { stop(e); this.setState({ faqOpen: true, contactOpen: false, menu: false }); },
      openContact: (e) => { stop(e); this.setState({ contactOpen: true, faqOpen: false, sent: false, menu: false }); },
      closeOv: () => this.setState({ faqOpen: false, contactOpen: false, sent: false }),
      askFromFaq: () => this.setState({ faqOpen: false, contactOpen: true, sent: false }),
      sendMsg: (e) => { stop(e); this.setState({ sent: true }); },
      noop: () => {},
      ovFaq: FAQS.map((x, i) => ({
        q: x.q, a: x.a, open: st.fq === i, sign: st.fq === i ? '−' : '+',
        toggle: () => this.setState({ fq: this.state.fq === i ? -1 : i })
      }))
    };
  }
  onKey(e) {
    if (e.key === 'Escape' && (this.state.faqOpen || this.state.contactOpen)) this.setState({ faqOpen: false, contactOpen: false, sent: false });
  }
  hdrVals() {
    return {
      hdrY: this.state.hide && !this.state.menu ? '-100%' : '0',
      menu: this.state.menu,
      toggleMenu: () => this.setState({ menu: !this.state.menu }),
      menuCls: this.state.menu ? 'mnav open' : 'mnav'
    };
  }
  renderVals() {
    const ov = this.ovVals();
    const lk = (label, href, click) => ({ label: label, href: href, click: click || ov.noop });
    const theme = this.props.theme ?? 'white';
    const sfx = theme === 'silver' ? 'Silver' : 'White';
    const homeHref = '/';
    const collHref = 'Collection-' + sfx + '.dc.html';
    const delHref = 'Delivery-' + sfx + '.dc.html';
    const pc = this.state.pc;
    let pcHead = 'Enter a postcode.';
    let pcBody = 'We deliver to Victorian postcodes.';
    let pcBorder = '#CFCBC2';
    let pcBg = 'transparent';
    if (pc.length > 0 && !/^\d{4}$/.test(pc)) {
      pcHead = 'Four digits, please.';
      pcBody = 'Australian postcodes have four digits.';
    } else if (/^\d{4}$/.test(pc)) {
      const n = Number(pc);
      const vic = (n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999);
      if (vic) {
        pcHead = 'Yes, we deliver to ' + pc + '.';
        pcBody = 'Flat $10.20, or free over $75. Or collect in Melbourne CBD.';
        pcBorder = '#1F1B18';
        pcBg = 'rgba(246,220,208,0.6)';
      } else {
        pcHead = 'Not yet for ' + pc + '.';
        pcBody = 'We only deliver within Victoria for now. Leave your email in the footer and we will tell you when we reach you.';
        pcBorder = '#EE5340';
      }
    }
    return {
      theme: theme, homeHref: homeHref,
      nav: [
        { label: 'Shop', href: '/shop' }, { label: 'Events', href: '/events' }, { label: 'Gifting', href: '/gifting' },
        ...(this.state.pre ? [{ label: 'Pre-order', href: '/pre-order' }] : [])
      ],
      navL: [{ label: 'Shop', href: '/shop' }, { label: 'Events', href: '/events' }, { label: 'Gifting', href: '/gifting' }],
      navR: [],
      preOn: this.state.pre,
      togglePre: () => this.setState({ pre: !this.state.pre }),
      preTrack: this.state.pre ? '#EE5340' : '#7A746C',
      preKnob: this.state.pre ? '20px' : '2px',
      preLabel: this.state.pre ? 'On' : 'Off',
      ...this.ovVals(),
      ...this.hdrVals(),
      foot: [
        { title: 'Shop', links: [lk('The Collection', collHref), ...(this.state.pre ? [lk('Pre-order', '/pre-order')] : [])] },
        { title: 'Explore', links: [lk('Scent Stories', '/events'), lk('Our Philosophy', '/philosophy'), lk('Corporate gifting', '/gifting')] },
        { title: 'Help', links: [lk('FAQ', '#top', ov.openFaq), lk('Delivery, pickup & returns', delHref), lk('Contact', '#top', ov.openContact)] }
      ],
      pc: pc, pcHead: pcHead, pcBody: pcBody, pcBorder: pcBorder, pcBg: pcBg,
      onPc: (e) => this.setState({ pc: String(e.target.value).replace(/\D/g, '').slice(0, 4) }),
      quick: [
        { tag: 'Delivery · Victoria', big: '$10.20', title: 'Flat Australia Post delivery', text: 'Free for orders of $75 or more.' },
        { tag: 'Pickup · Melbourne CBD', big: 'Free', title: 'Collect in Melbourne CBD', text: 'Pickup points and times are announced, no slots to book.' },
        { tag: 'Returns & breakage', big: '[TBC]', title: 'Policy to be written', text: 'Placeholder until the returns and breakage policy is confirmed.' }
      ],
      sections: SECTIONS.map((x, k) => ({ eyebrow: x.eyebrow, title: x.title, rows: x.rows, open: this.state.acc === k, sign: this.state.acc === k ? '−' : '+', toggle: () => this.setState({ acc: this.state.acc === k ? -1 : k }) })),
      pickOpen: this.state.pick, signPick: this.state.pick ? '−' : '+', togglePick: () => this.setState({ pick: !this.state.pick }),
      steps: [
        { n: '1', t: 'Choose Collect in Melbourne CBD at checkout.' },
        { n: '2', t: 'We announce the pickup point, date and time. If it is not announced yet, your confirmation email says it will follow.' },
        { n: '3', t: 'Come and collect. We email everyone with an open pickup order when a new pickup is announced.' }
      ],
      faq: FAQ.map((x, i) => ({
        q: x.q, a: x.a, open: this.state.faq === i, sign: this.state.faq === i ? '−' : '+',
        toggle: () => this.setState({ faq: this.state.faq === i ? -1 : i })
      }))
    };
  }
}


function view(v) {
  return (<><div id="top" className="page" data-theme={v.theme} style={{ "fontFamily": "'Josefin Sans', sans-serif", "color": "#1F1B18", "fontSize": "17px", "lineHeight": "1.55", "position": "relative", "overflowX": "clip" }}><svg width="0" height="0" style={{ "position": "absolute" }} aria-hidden="true" focusable="false"><defs><linearGradient id="silver" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#7C8084"></stop><stop offset="0.22" stopColor="#E4E6E8"></stop><stop offset="0.5" stopColor="#B4B8BC"></stop><stop offset="0.78" stopColor="#F3F4F5"></stop><stop offset="1" stopColor="#868A8E"></stop></linearGradient></defs></svg><div style={{ "background": "#1F1B18", "color": "#E4E3E0", "textAlign": "center", "padding": "10px 16px", "fontSize": "12px", "letterSpacing": "0.2em", "textTransform": "uppercase" }}>Free delivery in Victoria over $75 · Or collect in Melbourne CBD</div><div className="hdrwrap" style={{ "transform": `translateY(${v.hdrY})` }}><header className="head"><div className="hdr"><nav className="navL" aria-label="Main"><button className="ib burger" aria-label="Menu" aria-expanded={v.menu} onClick={v.toggleMenu}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE5340" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button>{v.navL.map((n, n__i) => (<React.Fragment key={n__i}><a className="navlink" href={n.href}>{n.label}</a></React.Fragment>))}</nav><a className="logo" href={v.homeHref} aria-label="Ajer Haus, home">{"AJER "}<span>HAUS</span></a><div className="navR">{v.navR.map((n, n__i) => (<React.Fragment key={n__i}><a className="navlink lnk" href={n.href}>{n.label}</a></React.Fragment>))}{v.preOn && (<><a className="preBtn" href="/pre-order">Pre-order</a></>)}<div style={{ "display": "flex" }}><button className="ib" aria-label="Search"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE5340" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg></button><button className="ib" aria-label="Cart"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE5340" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1.2 11H6.2z"></path><path d="M9 8V6.5a3 3 0 016 0V8"></path></svg></button></div></div></div><nav className={v.menuCls} aria-label="Menu">{v.nav.map((n, n__i) => (<React.Fragment key={n__i}><a className="navlink" href={n.href}>{n.label}</a></React.Fragment>))}</nav></header></div><section><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "28px 32px 8px", "boxSizing": "border-box" }}><div className="micro"><a href={v.homeHref} style={{ "color": "inherit", "textDecoration": "none" }}>Home</a>{" / "}<a href="#top" onClick={v.openFaq} style={{ "color": "inherit", "textDecoration": "none" }}>Help</a>{" / "}<span aria-current="page" style={{ "color": "#1F1B18" }}>{"Delivery, pickup & returns"}</span></div><h1 className="serif fx" style={{ "margin": "18px 0 0", "fontWeight": "700", "fontSize": "clamp(38px, 5vw, 56px)", "lineHeight": "1.03", "letterSpacing": "-0.01em" }}>{"Delivery, pickup "}<span style={{ "fontStyle": "italic", "fontWeight": "500" }}>{"& returns"}</span></h1></div></section><section><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "8px 32px 48px", "boxSizing": "border-box", "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(280px, 1fr))", "gap": "20px" }}>{v.quick.map((q, q__i) => (<React.Fragment key={q__i}><div className="panel" style={{ "padding": "28px", "display": "flex", "flexDirection": "column", "gap": "6px" }}><div className="micro">{q.tag}</div><div className="serif" style={{ "fontWeight": "700", "fontSize": "44px", "lineHeight": "1.05" }}>{q.big}</div><div style={{ "fontWeight": "600" }}>{q.title}</div><div style={{ "fontSize": "15px", "color": "var(--soft)" }}>{q.text}</div></div></React.Fragment>))}</div></section><section className="band"><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "64px 32px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>{v.sections.map((s, s__i) => (<React.Fragment key={s__i}><div className="panel" style={{ "overflow": "hidden" }}><button className="accbtn" onClick={s.toggle} aria-expanded={s.open}><span>{s.title}<span className="micro" style={{ "marginLeft": "14px" }}>{s.eyebrow}</span></span><span aria-hidden="true" style={{ "color": "#C4361F", "marginLeft": "16px" }}>{s.sign}</span></button>{s.open && (<><div style={{ "padding": "0 24px 24px", "display": "flex", "flexDirection": "column" }}>{s.rows.map((r, r__i) => (<React.Fragment key={r__i}><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "4px 24px", "padding": "14px 0", "borderTop": "1px solid var(--edge)" }}><div className="micro" style={{ "flex": "0 0 190px" }}>{r.k}</div><div style={{ "flex": "1 1 300px", "minWidth": "0" }}>{r.v}</div></div></React.Fragment>))}</div></>)}</div></React.Fragment>))}<div className="panel" style={{ "overflow": "hidden" }}><button className="accbtn" onClick={v.togglePick} aria-expanded={v.pickOpen}><span>Pickup<span className="micro" style={{ "marginLeft": "14px" }}>Collect in Melbourne CBD</span></span><span aria-hidden="true" style={{ "color": "#C4361F", "marginLeft": "16px" }}>{v.signPick}</span></button>{v.pickOpen && (<><div style={{ "padding": "0 24px 24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}><p style={{ "margin": "0", "color": "var(--soft)" }}>Free. No slot to book: we announce where and when, and you come and collect.</p><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "24px" }}><div className="panel" style={{ "flex": "1 1 300px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "6px", "position": "relative" }}><div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}><svg aria-hidden="true" width="28" height="36" viewBox="-14 -44 28 48"><path d="M0 0C-11 -12 -12 -30 0 -44C12 -30 11 -12 0 0Z" fill="#EE5340" stroke="#1F1B18" strokeWidth="1.5"></path><circle cx="0" cy="-26" r="4" fill="#F6DCD0"></circle></svg><span className="micro">Next pickup</span></div><div className="serif" style={{ "fontWeight": "700", "fontSize": "26px", "lineHeight": "1.1" }}>[PICKUP LOCATION]</div><div>[DATE] · [TIME WINDOW]</div><div style={{ "fontSize": "15px", "color": "var(--soft)" }}>[NOTES: where to find us, what to bring]</div><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontStyle": "italic", "fontWeight": "500", "fontSize": "16px", "color": "#C4361F", "lineHeight": "1.1" }}>edited by the team, shown here, in the cart and at checkout</div></div><div style={{ "flex": "1 1 300px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>{v.steps.map((st, st__i) => (<React.Fragment key={st__i}><div style={{ "display": "flex", "gap": "14px", "alignItems": "flex-start" }}><div className="num">{st.n}</div><div style={{ "paddingTop": "4px" }}>{st.t}</div></div></React.Fragment>))}</div></div></div></>)}</div><a className="panel" href="/pre-order" style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "center", "justifyContent": "space-between", "gap": "8px 16px", "padding": "18px 24px", "textDecoration": "none", "color": "#1F1B18" }}><span className="serif" style={{ "fontWeight": "700", "fontSize": "22px" }}>Pre-orders<span className="micro" style={{ "marginLeft": "14px" }}>Their own page</span></span><span style={{ "color": "#C4361F", "fontWeight": "600", "letterSpacing": "0.12em", "textTransform": "uppercase", "fontSize": "12px" }}>How pre-orders work →</span></a></div></section><footer style={{ "background": "var(--footer)", "color": "#C9CBCD" }}><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "64px 32px 32px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "48px" }}><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "32px", "justifyContent": "space-between", "alignItems": "flex-end", "borderBottom": "1px solid #4A4C50", "paddingBottom": "40px" }}><div style={{ "flex": "1 1 360px", "minWidth": "0" }}><div className="serif" style={{ "fontWeight": "700", "fontSize": "32px", "color": "#F4F8F5", "lineHeight": "1.1" }}>First access to new places.</div><div style={{ "fontSize": "15px", "marginTop": "6px" }}>Join The Scentimentalist Society for new scents, Scent Stories and pickup dates.</div></div><form style={{ "flex": "1 1 360px", "minWidth": "0", "display": "flex", "flexWrap": "wrap", "gap": "10px" }}><label htmlFor="nl-name" style={{ "position": "absolute", "left": "-9999px" }}>Your name</label><input id="nl-name" type="text" autoComplete="name" placeholder="Your name" style={{ "flex": "1 1 150px", "minWidth": "0", "minHeight": "48px", "padding": "0 16px", "background": "transparent", "border": "1px solid #7A746C", "borderRadius": "2px", "color": "#F4F8F5", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><label htmlFor="nl-email" style={{ "position": "absolute", "left": "-9999px" }}>Email address</label><input id="nl-email" type="email" placeholder="Email address" style={{ "flex": "1 1 200px", "minWidth": "0", "minHeight": "48px", "padding": "0 16px", "background": "transparent", "border": "1px solid #7A746C", "borderRadius": "2px", "color": "#F4F8F5", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><button type="button" className="btn">Subscribe</button></form></div><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "40px" }}><div style={{ "flex": "2 1 260px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px" }}><div style={{ "fontFamily": "'grante', 'Dela Gothic One', sans-serif", "fontSize": "32px", "color": "#F4F8F5", "lineHeight": "1" }}>{"AJER "}<span style={{ "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "400", "fontSize": "11px", "letterSpacing": "0.45em", "verticalAlign": "middle" }}>HAUS</span></div><div style={{ "fontSize": "15px", "maxWidth": "320px" }}>A Melbourne fragrance house exploring memory, place and scent.</div><div style={{ "display": "flex", "gap": "8px" }}><a href={v.homeHref} aria-label="Instagram" style={{ "width": "44px", "height": "44px", "border": "1px solid #7A746C", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "border-box" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9CBCD" strokeWidth="1.6"><rect x="4" y="4" width="16" height="16" rx="4.5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="16.8" cy="7.2" r="0.8" fill="#C9CBCD"></circle></svg></a><a href="#top" aria-label="TikTok" style={{ "width": "44px", "height": "44px", "border": "1px solid #7A746C", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "border-box" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9CBCD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.5a3.6 3.6 0 11-3.6-3.6"></path><path d="M14 4c.3 2.6 2 4.2 4.8 4.4"></path></svg></a><a href="#top" aria-label="Linktree" style={{ "width": "44px", "height": "44px", "border": "1px solid #7A746C", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "border-box" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9CBCD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"></path><path d="M12 7L7 4M12 7l5-3"></path><path d="M12 12L5.5 9M12 12l6.5-3"></path><path d="M12 17l-5-3M12 17l5-3"></path></svg></a></div></div>{v.foot.map((col, col__i) => (<React.Fragment key={col__i}><div style={{ "flex": "1 1 150px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "fontSize": "15px" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.24em", "textTransform": "uppercase", "color": "#F4F8F5", "fontWeight": "600" }}>{col.title}</div>{col.links.map((l, l__i) => (<React.Fragment key={l__i}><a href={l.href} onClick={l.click} style={{ "color": "#C9CBCD", "textDecoration": "none" }}>{l.label}</a></React.Fragment>))}</div></React.Fragment>))}</div><div style={{ "borderTop": "1px solid #4A4C50", "paddingTop": "24px", "display": "flex", "flexWrap": "wrap", "justifyContent": "space-between", "gap": "12px", "fontSize": "13px" }}><div>[ACKNOWLEDGEMENT OF COUNTRY, wording to be confirmed with Ajer Haus]</div><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "20px", "alignItems": "center" }}><span>© 2026 Ajer Haus</span><a href={v.homeHref} style={{ "color": "#C9CBCD" }}>Terms</a><a href={v.homeHref} style={{ "color": "#C9CBCD" }}>Privacy</a><span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px" }}><span>Pre-order</span><button type="button" role="switch" aria-checked={v.preOn} aria-label="Pre-order on or off (prototype switch)" onClick={v.togglePre} style={{ "position": "relative", "width": "40px", "height": "22px", "borderRadius": "999px", "border": "0", "padding": "0", "cursor": "pointer", "background": v.preTrack }}><span style={{ "position": "absolute", "top": "2px", "left": v.preKnob, "width": "18px", "height": "18px", "borderRadius": "50%", "background": "#F4F8F5", "transition": "left 0.2s ease" }}></span></button><span>{v.preLabel}</span></span></div></div></div></footer>{v.faqOpen && (<><div role="dialog" aria-modal="true" aria-label="Frequently asked questions" style={{ "position": "fixed", "left": "0", "top": "0", "right": "0", "bottom": "0", "zIndex": "200", "background": "#F4F8F5", "color": "#1F1B18", "overflowY": "auto", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "17px", "lineHeight": "1.55" }}><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "8px 32px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "boxSizing": "border-box", "minHeight": "64px" }}><div style={{ "fontFamily": "'grante', 'Dela Gothic One', sans-serif", "fontSize": "28px", "lineHeight": "1" }}>{"AJER "}<span style={{ "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "400", "fontSize": "11px", "letterSpacing": "0.45em", "verticalAlign": "middle" }}>HAUS</span></div><button onClick={v.closeOv} aria-label="Close FAQ" style={{ "minHeight": "44px", "padding": "0 16px", "border": "1.5px solid #EE5340", "background": "transparent", "color": "#C4361F", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "12px", "cursor": "pointer" }}>Close ✕</button></div><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "24px 32px 80px", "boxSizing": "border-box", "display": "flex", "flexWrap": "wrap", "gap": "32px 72px", "alignItems": "flex-start", "position": "relative" }}><svg aria-hidden="true" viewBox="0 0 400 400" style={{ "position": "absolute", "right": "-60px", "top": "-30px", "width": "360px", "height": "auto", "pointerEvents": "none", "opacity": "0.8" }}><circle cx="200" cy="200" r="170" fill="none" stroke="#EE5340" strokeWidth="1.1"></circle><circle cx="200" cy="200" r="120" fill="none" stroke="#1F1B18" strokeWidth="0.8" strokeDasharray="1 6" strokeLinecap="round"></circle><circle cx="70" cy="90" r="10" fill="#EE5340"></circle></svg><div style={{ "flex": "1 1 300px", "maxWidth": "380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px", "position": "relative" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.34em", "textTransform": "uppercase", "color": "#C4361F", "fontWeight": "600" }}>Quick answers</div><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "clamp(38px, 5vw, 60px)", "lineHeight": "1.04" }}>{"Questions "}<span style={{ "fontStyle": "italic", "fontWeight": "500" }}>people ask.</span></h2><p style={{ "margin": "0", "color": "#3A352F" }}>Can't find yours? Write to us and a real person will answer.</p><div><button onClick={v.askFromFaq} style={{ "minHeight": "48px", "padding": "0 26px", "background": "#EE5340", "color": "#1F1B18", "border": "0", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "cursor": "pointer" }}>Contact us</button></div></div><div style={{ "flex": "2 1 480px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "position": "relative" }}>{v.ovFaq.map((q, q__i) => (<React.Fragment key={q__i}><div style={{ "border": "1px solid #1F1B18", "borderRadius": "4px", "background": "#FBFAF7" }}><button onClick={q.toggle} aria-expanded={q.open} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "width": "100%", "minHeight": "60px", "padding": "8px 22px", "border": "0", "background": "transparent", "cursor": "pointer", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "20px", "color": "#1F1B18", "textAlign": "left" }}><span>{q.q}</span><span aria-hidden="true" style={{ "color": "#C4361F", "marginLeft": "16px", "fontFamily": "'Josefin Sans', sans-serif" }}>{q.sign}</span></button>{q.open && (<><div style={{ "padding": "0 22px 20px", "maxWidth": "700px", "color": "#3A352F" }}>{q.a}</div></>)}</div></React.Fragment>))}</div></div></div></>)}{v.contactOpen && (<><div style={{ "position": "fixed", "left": "0", "top": "0", "right": "0", "bottom": "0", "zIndex": "210", "background": "rgba(31,27,24,0.55)", "display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "16px", "boxSizing": "border-box", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "17px", "lineHeight": "1.55", "color": "#1F1B18" }}><div role="dialog" aria-modal="true" aria-label="Contact Ajer Haus" style={{ "width": "100%", "maxWidth": "560px", "maxHeight": "100%", "overflowY": "auto", "background": "#FBFAF7", "border": "1.5px solid #1F1B18", "borderRadius": "6px", "padding": "28px", "boxSizing": "border-box", "position": "relative", "display": "flex", "flexDirection": "column", "gap": "14px" }}><button onClick={v.closeOv} aria-label="Close contact form" style={{ "position": "absolute", "right": "10px", "top": "10px", "width": "44px", "height": "44px", "border": "0", "background": "transparent", "color": "#C4361F", "fontSize": "22px", "cursor": "pointer" }}>✕</button><div style={{ "fontSize": "12px", "letterSpacing": "0.34em", "textTransform": "uppercase", "color": "#C4361F", "fontWeight": "600" }}>Contact</div><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "34px", "lineHeight": "1.08" }}>Say hello.</h2>{v.notSent && (<><form onSubmit={v.sendMsg} style={{ "display": "flex", "flexDirection": "column", "gap": "12px" }}><div style={{ "color": "#5C564E", "fontSize": "15px" }}>[CONTACT EMAIL] · [RESPONSE TIME]</div><label htmlFor="ct-name" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Name</label><input id="ct-name" type="text" autoComplete="name" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><label htmlFor="ct-email" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Email</label><input id="ct-email" type="email" autoComplete="email" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><label htmlFor="ct-topic" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>What is it about?</label><select id="ct-topic" style={{ "minHeight": "48px", "padding": "0 10px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }}><option>An order</option><option>Delivery or pickup</option><option>Corporate gifting</option><option>Scent Story events</option><option>Something else</option></select><label htmlFor="ct-msg" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Message</label><textarea id="ct-msg" rows="4" style={{ "padding": "12px 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box", "resize": "vertical" }}></textarea><div><button type="submit" style={{ "minHeight": "48px", "padding": "0 26px", "background": "#EE5340", "color": "#1F1B18", "border": "0", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "cursor": "pointer" }}>Send message</button></div></form></>)}{v.sent && (<><div aria-live="polite" style={{ "padding": "18px", "border": "1.5px solid #1F1B18", "borderRadius": "2px", "background": "rgba(246,220,208,0.6)" }}><span style={{ "fontWeight": "700" }}>Thank you.</span>{" Your message is on its way. [RESPONSE TIME]"}</div><div><button onClick={v.closeOv} style={{ "minHeight": "48px", "padding": "0 26px", "background": "transparent", "color": "#C4361F", "border": "1.5px solid #EE5340", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "cursor": "pointer" }}>Close</button></div></>)}</div></div></>)}</div></>);
}

Component.prototype.render = function () { return view(this.renderVals()); };

export default Component;
