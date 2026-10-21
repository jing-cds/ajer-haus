import React from 'react';


const f = (n) => Math.round(n * 10) / 10;
const circ = (cx, cy, r) => 'M' + f(cx - r) + ' ' + f(cy) + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0';
const petal = (cx, cy, len, w, deg) => {
  const a = deg * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a);
  const tx = cx + dx * len, ty = cy + dy * len, mx = cx + dx * len * 0.55, my = cy + dy * len * 0.55;
  const px = -dy * w, py = dx * w;
  return 'M' + f(cx) + ' ' + f(cy) + 'Q' + f(mx + px) + ' ' + f(my + py) + ' ' + f(tx) + ' ' + f(ty) + 'Q' + f(mx - px) + ' ' + f(my - py) + ' ' + f(cx) + ' ' + f(cy);
};
const flower = (cx, cy, n, len, w, off) => { let d = ''; for (let i = 0; i < n; i++) d += petal(cx, cy, len, w, off + i * 360 / n); return d; };
const ray = (cx, cy, r1, r2, deg) => { const a = deg * Math.PI / 180; return 'M' + f(cx + Math.cos(a) * r1) + ' ' + f(cy + Math.sin(a) * r1) + 'L' + f(cx + Math.cos(a) * r2) + ' ' + f(cy + Math.sin(a) * r2); };
const rays = (cx, cy, n, r1, r2, off) => { let d = ''; for (let i = 0; i < n; i++) d += ray(cx, cy, r1, r2, off + i * 360 / n); return d; };
const drop = (x, y, s) => 'M' + f(x) + ' ' + f(y - 10 * s) + 'C' + f(x + 8 * s) + ' ' + f(y - 1 * s) + ' ' + f(x + 8 * s) + ' ' + f(y + 8 * s) + ' ' + f(x) + ' ' + f(y + 8 * s) + 'C' + f(x - 8 * s) + ' ' + f(y + 8 * s) + ' ' + f(x - 8 * s) + ' ' + f(y - 1 * s) + ' ' + f(x) + ' ' + f(y - 10 * s) + 'Z';

function cedarNeedles() {
  let d = '';
  for (let i = 0; i < 10; i++) { const y = 14 + i * 6, l = 6 + i * 1.8; d += 'M40 ' + y + 'l' + f(-l) + ' ' + f(l * 0.7) + 'M40 ' + y + 'l' + f(l) + ' ' + f(l * 0.7); }
  return d;
}
function eucLeaves() {
  let d = '';
  const P0 = [16, 74], C = [38, 44], P1 = [62, 8];
  for (let i = 0; i < 6; i++) {
    const t = 0.14 + i * 0.14;
    const x = (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P1[0];
    const y = (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P1[1];
    const side = i % 2 === 0 ? 1 : -1;
    d += circ(x + side * 9, y - 2, 6.5 - i * 0.4);
  }
  return d;
}
function fernLeaflets() {
  let d = '';
  for (let i = 0; i < 10; i++) { const y = 70 - i * 6.4, l = 17 - i * 1.4; d += 'M40 ' + f(y) + 'L' + f(40 - l) + ' ' + f(y - l * 0.55) + 'M40 ' + f(y) + 'L' + f(40 + l) + ' ' + f(y - l * 0.55); }
  return d;
}
function lemonSegments() {
  let d = '';
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; d += 'M40 40L' + f(40 + 24 * Math.cos(a)) + ' ' + f(40 + 16 * Math.sin(a)); }
  return d;
}

const ING = {
  frangipani: { n: 'frangipani', d: flower(40, 40, 5, 30, 12, -90) + circ(40, 40, 3), e: flower(40, 40, 5, 17, 4, -54) },
  jasmine: { n: 'jasmine', d: flower(40, 40, 6, 28, 5, -90) + circ(40, 40, 3), e: rays(40, 40, 6, 6, 14, -60) },
  wildflower: { n: 'wildflower', d: flower(40, 40, 11, 26, 3.4, -90) + circ(40, 40, 7), e: circ(40, 40, 3.5) },
  oud: { n: 'oud', d: 'M14 52L22 30L40 20L62 27L68 46L52 62L30 64Z', e: 'M24 36Q40 30 58 36M22 46Q42 40 64 46M28 56Q42 50 56 56' + circ(46, 44, 3) },
  sandalwood: { n: 'sandalwood', d: circ(40, 40, 28) + circ(40, 40, 20), e: circ(40, 40, 12) + circ(40, 40, 5) + 'M40 40L68 34M40 40L14 50' },
  cedar: { n: 'cedar', d: 'M40 74V8', e: cedarNeedles() },
  woodsmoke: { n: 'woodsmoke', d: 'M26 72C14 60 38 52 26 40C16 28 34 22 26 8M42 72C30 60 54 52 42 40C32 28 50 22 42 8M58 72C46 60 70 52 58 40C48 28 66 22 58 8', e: '' },
  tobacco: { n: 'tobacco leaf', d: 'M40 74C10 60 8 28 40 6C72 28 70 60 40 74Z', e: 'M40 74V10M40 62L24 50M40 62L56 50M40 50L22 38M40 50L58 38M40 38L26 28M40 38L54 28M40 26L32 18M40 26L48 18' },
  whiskey: { n: 'aged whiskey', d: 'M22 24L26 66Q26 70 30 70L50 70Q54 70 54 66L58 24Z', e: 'M25 42L55 42M32 30L42 28L44 38L34 40ZM30 50L30 62' },
  wattle: { n: 'wattle blossom', d: 'M12 70Q36 50 62 18M20 62Q10 50 8 38Q20 46 24 58M30 56Q24 44 26 32Q36 42 36 52', e: circ(62, 18, 6) + circ(50, 26, 5.5) + circ(40, 34, 5) + circ(31, 42, 4.5) + circ(22, 50, 4) },
  seedpod: { n: 'wattleseed', d: 'M14 62Q30 20 68 14Q42 28 14 62ZM22 68Q42 34 70 34Q50 42 22 68Z', e: circ(34, 40, 1.6) + circ(44, 28, 1.6) + circ(52, 22, 1.6) + circ(48, 46, 1.6) + circ(58, 40, 1.6) },
  sun: { n: 'morning sun', d: circ(40, 40, 12) + rays(40, 40, 12, 17, 28, 0), e: '' },
  salt: { n: 'sea salt', d: 'M40 14L64 26L64 54L40 66L16 54L16 26Z', e: 'M16 26L40 38L64 26M40 38L40 66M10 74l6 -7l6 7zM58 74l5 -6l5 6z' },
  sage: { n: 'sage', d: 'M40 74C14 62 14 24 40 8C66 24 66 62 40 74Z', e: 'M40 74V12M40 60Q28 54 22 44M40 60Q52 54 58 44M40 46Q30 40 26 30M40 46Q50 40 54 30M40 32Q34 28 32 22M40 32Q46 28 48 22' },
  eucalyptus: { n: 'eucalyptus', d: 'M16 74Q38 44 62 8', e: eucLeaves() },
  lime: { n: 'lime', d: circ(40, 40, 28) + circ(40, 40, 23), e: rays(40, 40, 8, 4, 23, 0) + circ(40, 40, 3) },
  lemon: { n: 'lemon', d: 'M10 40a30 22 0 1 0 60 0a30 22 0 1 0 -60 0M10 40L4 40M70 40L76 40', e: 'M16 40a24 16 0 1 0 48 0a24 16 0 1 0 -48 0' + lemonSegments() },
  coconut: { n: 'coconut', d: circ(40, 40, 28) + circ(40, 40, 21), e: circ(40, 40, 8) + rays(40, 40, 16, 11, 19, 0) },
  raindrops: { n: 'rain', d: drop(24, 24, 1) + drop(54, 18, 0.9) + drop(38, 50, 1.1) + drop(62, 52, 0.9) + drop(18, 58, 0.8), e: 'M10 8L16 20M44 4L50 16M30 64L34 72' },
  fern: { n: 'fern', d: 'M40 76Q46 40 40 6', e: fernLeaflets() }
};

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

const PREORDER_OPEN = true; // flip to false to hide the Pre-order button and page link
const PAGE = 'gifting';

const PLACES = [
  { name: 'Shrine of Remembrance', x: 738, y: 424, side: 'r', bg: '#2B1D8F', fg: '#F6DCD0', leaf: '#D95A25', wash: '#DAD5F2', live: true, place: 'The Shrine, St Kilda Rd, Melbourne CBD', memory: 'A quiet hour on the steps, with something sweet on the air.', notes: 'Native frangipani · oud · sweet · woody', sub: 'with sandalwood & cedar', items: ['frangipani', 'oud', 'sandalwood', 'cedar'] },
  { name: 'Love Affair at Hosier', x: 655, y: 350, side: 'l', bg: '#C4325A', fg: '#F9D648', leaf: '#5A1A12', wash: '#F4CDD8', live: false, place: 'Hosier Lane, Melbourne CBD', memory: 'A lane, a late night, smoke still in your jacket.', notes: 'Woodsmoke · tobacco · ashy · mature', sub: 'with aged whiskey', items: ['woodsmoke', 'tobacco', 'whiskey'] },
  { name: 'Melbourne Morning', x: 690, y: 236, side: 'r', bg: '#8A2515', fg: '#F6DCD0', leaf: '#D95A25', wash: '#EBC9C0', live: false, place: '[Place to confirm]', memory: 'Wattleseed warmth before the city wakes up.', notes: 'Wattleseed · warmth · nutty', sub: '', items: ['wattle', 'seedpod', 'sun'] },
  { name: 'The Great Ocean Road', x: 210, y: 480, side: 'r', bg: '#4A6E66', fg: '#F2AAA0', leaf: '#D95A25', wash: '#CFE0DB', live: false, place: 'Great Ocean Road, Victoria', memory: 'Windows down, salt on everything.', notes: 'Sea salt · sage · breezy', sub: 'with jasmine & eucalyptus', items: ['salt', 'sage', 'eucalyptus', 'jasmine'] },
  { name: 'Night Out at Fed Square', x: 772, y: 362, side: 'r', bg: '#C3B2EE', fg: '#F8EBB8', leaf: '#5A1A12', wash: '#E4DBF7', live: false, place: 'Federation Square, Melbourne CBD', memory: 'Lime in the glass and the square still humming.', notes: 'Lime · coconut · zesty · creamy', sub: '', items: ['lime', 'coconut'] },
  { name: "It's About to Rain", x: 1150, y: 232, side: 'r', bg: '#6E98C0', fg: '#C8E048', leaf: '#5A1A12', wash: '#D3E3F2', live: false, place: '[Place to confirm]', memory: 'That earthy breath of air just before the sky breaks.', notes: 'Lemon · sandalwood · earthy · deep', sub: '', items: ['lemon', 'sandalwood', 'raindrops'] },
  { name: 'Yarra at Dusk', x: 1030, y: 328, side: 'r', bg: '#E8B85A', fg: '#D95A25', leaf: '#5A1A12', wash: '#F6E1B6', live: false, place: 'The Yarra, Melbourne', memory: 'Eucalyptus on the breeze as the river goes gold.', notes: 'Eucalyptus · fern · fresh · crisp', sub: 'with herbs & sweet wildflower', items: ['eucalyptus', 'fern', 'wildflower'] }
];
PLACES[1].pre = PREORDER_OPEN;
const stat = (p) => (p.live ? 'Available now' : p.pre ? 'Pre-order' : 'Coming soon');
const OFFS = [[-118, -112], [40, 6], [-118, 6], [40, -112]];
const PAGE_BG = '#F4F8F5';
const VIEW_WIDE = { x: 0, y: 0, w: 1440, h: 760 };
const VIEW_NARROW = { x: 480, y: 130, w: 570, h: 620 };
const FLOATERS = [
  { k: 'frangipani', x: 150, y: 120, w: 110, rot: -8, c: 'bob', p: 0 },
  { k: 'eucalyptus', x: 360, y: 300, w: 96, rot: 10, c: 'bob2', p: 3 },
  { k: 'wattle', x: 470, y: 90, w: 90, rot: 6, c: 'bob2', p: 2 },
  { k: 'lime', x: 1280, y: 330, w: 92, rot: -6, c: 'bob', p: 4 },
  { k: 'fern', x: 1010, y: 90, w: 96, rot: 8, c: 'bob2', p: 6 },
  { k: 'raindrops', x: 1300, y: 520, w: 84, rot: 4, c: 'bob', p: 5 },
  { k: 'sandalwood', x: 560, y: 560, w: 84, rot: -4, c: 'bob', p: 1 }
];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sel: -1, last: 0, lit: false, drawn: false, w: 1440, hide: false, menu: false, faqOpen: false, contactOpen: false, sent: false, fq: 0, slide: 0, play: true, pre: PREORDER_OPEN };
    this.onKey = this.onKey.bind(this);
    this._y = 0;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  componentDidMount() {
    this.onResize();
    window.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('keydown', this.onKey);
    if (PAGE === 'philosophy') this._tm = setInterval(() => { if (this.state.play) this.setState({ slide: (this.state.slide + 1) % 3 }); }, 5500);
    window.addEventListener('resize', this.onResize);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('keydown', this.onKey);
    if (this._tm) clearInterval(this._tm);
    window.removeEventListener('resize', this.onResize);
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
  onResize() {
    const w = window.innerWidth || 1440;
    if (w !== this.state.w) this.setState({ w: w });
  }
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
  choose(i) {
    this.setState({ sel: i, last: i, lit: false, drawn: false });
    setTimeout(() => this.setState({ drawn: true }), 900);
  }
  remember(i) {
    try { window.localStorage.setItem('ajerSel', String(i)); } catch (err) {}
  }
  railBy(dir) {
    const el = document.getElementById('prodRail');
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  }
  renderVals() {
    const st = this.state;
    PLACES[1].pre = st.pre;
    const sel = st.sel;
    const lit = st.lit;
    const drawn = st.drawn;
    const narrow = st.w <= 820;
    const V = narrow ? VIEW_NARROW : VIEW_WIDE;
    const S = sel < 0 ? 1 : (narrow ? 1.8 : 2);
    const fx = narrow ? V.x + V.w / 2 : 560;
    const fy = V.y + V.h / 2;
    const cur = PLACES[st.last];
    const tx = sel < 0 ? 0 : fx - S * cur.x;
    const ty = sel < 0 ? 0 : fy - S * cur.y;
    const px = (ux) => f((ux - V.x) / V.w * 100) + '%';
    const py = (uy) => f((uy - V.y) / V.h * 100) + '%';
    const wash = sel < 0 ? PAGE_BG : cur.wash;
    const fade = (dir) => 'linear-gradient(' + dir + ', ' + wash + ', ' + wash + '00)';

    const pins = PLACES.map((p, i) => {
      const ux = tx + S * p.x;
      const uy = ty + S * p.y;
      const vx = (ux - V.x) / V.w;
      const left = p.side === 'l' ? sel < 0 : vx > 0.7;
      return {
        left: px(ux),
        top: py(uy),
        label: 'Visit ' + p.name + ', ' + stat(p).toLowerCase(),
        tag: p.name + (p.pre ? ' · Pre-order' : ''),
        bg: p.bg,
        dash: (p.live || p.pre) ? '0' : '3 2',
        k: i === sel ? 'scale(1.3)' : 'scale(1)',
        tagLeft: left ? 'auto' : '30px',
        tagRight: left ? '30px' : 'auto',
        tagOp: sel < 0 || i === sel ? 1 : 0.45,
        pick: () => this.choose(i)
      };
    });

    const ingredients = sel >= 0 ? cur.items.map((key, j) => {
      const o = OFFS[j];
      const ing = ING[key];
      return {
        left: px(tx + S * (cur.x + o[0])),
        top: py(ty + S * (cur.y + o[1])),
        width: f(80 * S / V.w * 100) + '%',
        d: ing.d,
        e: ing.e || 'M0 0',
        name: ing.n,
        disc: cur.fg,
        discOp: drawn ? 1 : 0,
        off: drawn ? 0 : 1,
        delay: (j * 0.25) + 's'
      };
    }) : [];

    const floaters = FLOATERS.map((fl) => {
      const ing = ING[fl.k];
      return {
        left: px(fl.x),
        top: py(fl.y),
        width: f(fl.w / V.w * 100) + '%',
        rot: fl.rot + 'deg',
        cls: fl.c,
        op: sel < 0 && fl.x >= V.x && fl.x <= V.x + V.w - fl.w ? 1 : 0,
        d: ing.d,
        e: ing.e || 'M0 0',
        name: ing.n,
        disc: PLACES[fl.p].fg
      };
    });

    const isMain = PAGE === 'main';
    const orb = (a, R) => [(50 + R * Math.cos(a * Math.PI / 180)).toFixed(1) + '%', (50 + R * Math.sin(a * Math.PI / 180)).toFixed(1) + '%'];
    const wIng = [
      { k: 'frangipani', a: -55, R: 45, w: '22%', p: 0 },
      { k: 'lime', a: 65, R: 34, w: '18%', p: 4 },
      { k: 'fern', a: 185, R: 45, w: '18%', p: 6 }
    ].map((w) => ({ ox: orb(w.a, w.R)[0], oy: orb(w.a, w.R)[1], ow: w.w, d: ING[w.k].d, e: ING[w.k].e || 'M0 0', name: ING[w.k].n, disc: PLACES[w.p].fg }));

    return {
      hdrY: st.hide && !st.menu ? '-100%' : '0',
      menu: st.menu,
      toggleMenu: () => this.setState({ menu: !this.state.menu }),
      menuCls: st.menu ? 'mnav open' : 'mnav',
      ...this.ovVals(),
      vb: V.x + ' ' + V.y + ' ' + V.w + ' ' + V.h,
      mapT: 'translate(' + f(tx) + 'px, ' + f(ty) + 'px) scale(' + S + ')',
      wash: wash,
      fadeT: fade('to bottom'),
      fadeB: fade('to top'),
      fadeL: fade('to right'),
      fadeR: fade('to left'),
      pins: pins,
      ingredients: ingredients,
      floaters: floaters,
      welcomeIng: wIng,
      panelCls: sel >= 0 ? 'mapPanel open' : 'mapPanel',
      places: PLACES.map((p, i) => ({ name: p.name, bg: p.bg, pick: () => this.choose(i) })),
      surprise: () => {
        let i;
        do { i = Math.floor(Math.random() * PLACES.length); } while (i === this.state.sel);
        this.choose(i);
      },
      back: () => this.setState({ sel: -1, lit: false, drawn: false }),
      goSel: () => this.remember(this.state.last),
      lit: lit,
      toggleLit: () => this.setState({ lit: !this.state.lit }),
      toggleLabel: lit ? 'Blow it out' : 'Light it',
      toggleBorder: lit ? '#F6DCD0' : '#EE5340',
      toggleColor: lit ? '#F6DCD0' : '#C4361F',
      candleBg: lit ? '#1B1815' : '#ECEBE6',
      glowOp: lit ? 1 : 0,
      dName: cur.name,
      dPlace: cur.place,
      dMemory: cur.memory,
      dNotes: cur.notes,
      dSub: cur.sub,
      dBg: cur.bg,
      dFg: cur.fg,
      dLeaf: cur.leaf,
      dLive: cur.live,
      dSoon: !cur.live && !cur.pre,
      dPre: !!cur.pre,
      preOn: st.pre,
      togglePre: () => this.setState({ pre: !this.state.pre }),
      preTrack: st.pre ? '#EE5340' : '#7A746C',
      preKnob: st.pre ? '20px' : '2px',
      preLabel: st.pre ? 'On' : 'Off',
      preItems: PLACES.filter((p) => p.pre).map((p) => ({ name: p.name, place: p.place, notes: p.notes, bg: p.bg, fg: p.fg, leaf: p.leaf, wash: p.wash, memory: p.memory })),
      preSteps: [
        { n: '1', t: 'Pay in full today', d: 'You are charged when you order. Early-bird pricing may apply.' },
        { n: '2', t: 'Ships together', d: 'Mixed carts ship in one parcel on the pre-order dispatch date. Want the in-stock candles sooner? Order them separately.' },
        { n: '3', t: 'Delivery or pickup', d: 'Delivered across Victoria, or collected at the first announced Melbourne CBD pickup after dispatch.' },
        { n: '4', t: 'We keep you posted', d: 'An email when it ships, and again if the date moves.' }
      ],
      preTerms: [
        { k: 'Free delivery', v: 'Pre-order items count toward the $75 free-delivery threshold. [Confirm: before or after discounts.]' },
        { k: 'Dispatch date', v: '[FIRST BATCH DISPATCH DATE OR WINDOW]' },
        { k: 'Quantity caps', v: '[CAPS PER PRODUCT, IF ANY]' },
        { k: 'Cancellation & refunds', v: '[TO BE WRITTEN, reviewed and linked here before the first pre-order opens, including what happens if the dispatch date slips.]' }
      ],
      noPre: !PLACES.some((p) => p.pre),
      soonItems: PLACES.filter((p) => !p.live && !p.pre).map((p) => ({ name: p.name, bg: p.bg, fg: p.fg, leaf: p.leaf, wash: p.wash, place: p.place })),
      slideAHidden: st.slide !== 0, slideBHidden: st.slide !== 1, slideCHidden: st.slide !== 2, slideAHidden2: st.slide === 0,
      dotA: st.slide === 0 ? '#EE5340' : 'transparent', dotB: st.slide === 1 ? '#EE5340' : 'transparent', dotC: st.slide === 2 ? '#EE5340' : 'transparent',
      ig0d: ING.frangipani.d, ig0e: ING.frangipani.e, ig1d: ING.oud.d, ig1e: ING.oud.e, ig2d: ING.sandalwood.d, ig2e: ING.sandalwood.e, ig3d: ING.cedar.d, ig3e: ING.cedar.e,
      slide: st.slide, slideA: st.slide === 0 ? 1 : 0, slideB: st.slide === 1 ? 1 : 0, slideC: st.slide === 2 ? 1 : 0,
      slidePlay: st.play, playLabel: st.play ? 'Pause slideshow' : 'Play slideshow',
      togglePlay: () => this.setState({ play: !this.state.play }),
      goSlide0: () => this.setState({ slide: 0 }), goSlide1: () => this.setState({ slide: 1 }), goSlide2: () => this.setState({ slide: 2 }),
      prevSlide: () => this.setState({ slide: (this.state.slide + 2) % 3 }), nextSlide: () => this.setState({ slide: (this.state.slide + 1) % 3 }),
      dStatus: stat(cur),
      dBadgeBg: (cur.live || cur.pre) ? '#EE5340' : 'transparent',
      dBadgeFg: '#1F1B18',
      railPrev: () => this.railBy(-1),
      railNext: () => this.railBy(1),
      shelf: PLACES.map((p, i) => ({
        name: p.name, bg: p.bg, fg: p.fg, leaf: p.leaf, wash: p.wash,
        notes: p.notes,
        status: stat(p),
        badgeBg: (p.live || p.pre) ? '#EE5340' : '#FBFAF7',
        badgeFg: '#1F1B18',
        aria: p.name + ', ' + stat(p).toLowerCase() + '. View product page',
        id: ING[p.items[0]].d,
        ie: ING[p.items[0]].e || 'M0 0',
        go: () => this.remember(i)
      })),
      journal: [
        { tag: 'Upcoming', wash: '#E4DBF7', disc: PLACES[4].fg, d: ING.lime.d, e: ING.lime.e },
        { tag: 'Past story', wash: '#F6E1B6', disc: PLACES[6].fg, d: ING.fern.d, e: ING.fern.e },
        { tag: 'Past story', wash: '#DAD5F2', disc: PLACES[0].fg, d: ING.frangipani.d, e: ING.frangipani.e }
      ],
      pillars: [
        { title: 'Memory', note: 'it starts with a moment', wash: '#F4CDD8', disc: PLACES[1].fg, d: ING.woodsmoke.d, e: 'M0 0', text: '[ONE PARAGRAPH: how a smell brings a moment back, and why each scent starts from a memory rather than a recipe.]' },
        { title: 'Place', note: 'somewhere real', wash: '#CFE0DB', disc: PLACES[3].fg, d: ING.salt.d, e: ING.salt.e, text: '[ONE PARAGRAPH: Naarm and Melbourne, the seven places, and why a name like "Love Affair at Hosier" reads as a small story.]' },
        { title: 'Scent', note: 'what it is made of', wash: '#DAD5F2', disc: PLACES[0].fg, d: ING.frangipani.d, e: ING.frangipani.e, text: '[ONE PARAGRAPH: how notes are chosen and drawn, from native frangipani and oud to wattleseed and eucalyptus.]' }
      ],
      uses: [
        { t: 'Client gifts', d: '[Thank-yous and renewals]', bg: PLACES[0].bg },
        { t: 'Welcome gifts', d: '[Onboarding and new starters]', bg: PLACES[1].bg },
        { t: 'Events', d: '[Launches, offsites and dinners]', bg: PLACES[3].bg },
        { t: 'Thank-yous', d: '[Teams, partners, suppliers]', bg: PLACES[6].bg }
      ],
      opts: [
        { t: 'Your message', d: 'A custom card in every box.' },
        { t: 'Your label', d: '[Custom label or lid sticker. MOQ and lead time to confirm.]' },
        { t: 'Branded packaging', d: '[Options to confirm.]' },
        { t: 'Many addresses', d: 'Delivered to multiple addresses across Victoria.' }
      ],
      process: [
        { n: '1', t: 'Tell us', d: 'Occasion, quantity and date.' },
        { n: '2', t: 'Quote', d: '[Quote turnaround to confirm.]' },
        { n: '3', t: 'Proof', d: '[Card and label proof, if customised.]' },
        { n: '4', t: 'Delivered', d: '[Lead time to confirm.]' }
      ],
      sets: [
        { name: 'The Trio', text: '[Three tins, three places. Contents to confirm.]', href: '/shop', wash: '#E4DBF7', disc: PLACES[0].bg, c1: PLACES[0].bg, c2: PLACES[4].bg, c3: PLACES[6].bg, o2: 1, o3: 1 },
        { name: 'Pick your 3', text: '[Choose any three scents. Mechanic to confirm.]', href: '/shop', wash: '#F4CDD8', disc: PLACES[1].bg, c1: PLACES[1].bg, c2: PLACES[3].bg, c3: PLACES[5].bg, o2: 1, o3: 1 },
        { name: 'The Pair', text: '[Two tins in a gift box. Contents to confirm.]', href: '/shop', wash: '#F6E1B6', disc: PLACES[6].bg, c1: PLACES[6].bg, c2: PLACES[2].bg, c3: PLACES[2].bg, o2: 1, o3: 0 }
      ],
      eventIng: ['frangipani', 'fern', 'lime'].map((k, i) => ({ d: ING[k].d, e: ING[k].e || 'M0 0', name: ING[k].n, disc: PLACES[[0, 6, 4][i]].fg })),
      giftTins: [
        { left: '2%', bottom: '8%', rot: -8, bg: PLACES[0].bg, fg: PLACES[0].fg, leaf: PLACES[0].leaf },
        { left: '28%', bottom: '0%', rot: 2, bg: PLACES[4].bg, fg: PLACES[4].fg, leaf: PLACES[4].leaf },
        { left: '54%', bottom: '10%', rot: 9, bg: PLACES[6].bg, fg: PLACES[6].fg, leaf: PLACES[6].leaf }
      ]
    };
  }
}


function view(v) {
  return (<><div id="top" style={{ "fontFamily": "'Josefin Sans', sans-serif", "background": "#F4F8F5", "color": "#1F1B18", "fontSize": "17px", "lineHeight": "1.55", "position": "relative", "overflowX": "clip" }}><svg width="0" height="0" style={{ "position": "absolute" }} aria-hidden="true" focusable="false"><defs><linearGradient id="silver" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#7C8084"></stop><stop offset="0.22" stopColor="#E4E6E8"></stop><stop offset="0.5" stopColor="#B4B8BC"></stop><stop offset="0.78" stopColor="#F3F4F5"></stop><stop offset="1" stopColor="#868A8E"></stop></linearGradient><radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFC15E" stopOpacity="0.85"></stop><stop offset="0.45" stopColor="#FF9A3C" stopOpacity="0.28"></stop><stop offset="1" stopColor="#FF9A3C" stopOpacity="0"></stop></radialGradient><linearGradient id="flame" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#D95A25"></stop><stop offset="0.6" stopColor="#FFB547"></stop><stop offset="1" stopColor="#FFF1B8"></stop></linearGradient></defs></svg><div style={{ "background": "#1F1B18", "color": "#E4E3E0", "textAlign": "center", "padding": "10px 16px", "fontSize": "12px", "letterSpacing": "0.2em", "textTransform": "uppercase" }}>{" Free delivery in Victoria over $75 · Or collect in Melbourne CBD "}</div><div className="hdrwrap" style={{ "transform": `translateY(${v.hdrY})` }}><header><div className="hdr"><nav className="navL" aria-label="Main"><button className="ib burger" aria-label="Menu" aria-expanded={v.menu} onClick={v.toggleMenu}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE5340" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button><a href="/shop">Shop</a><a href="/events">Events</a><a href="/gifting">Gifting</a></nav><a className="logo" href="/" aria-label="Ajer Haus, home">{"AJER "}<span>HAUS</span></a><div className="navR">{v.preOn && (<><a className="preBtn" href="/pre-order">Pre-order</a></>)}<div style={{ "display": "flex" }}><button className="ib" aria-label="Search"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE5340" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path></svg></button><button className="ib" aria-label="Cart"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE5340" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1.2 11H6.2z"></path><path d="M9 8V6.5a3 3 0 016 0V8"></path></svg></button></div></div></div><nav className={v.menuCls} aria-label="Menu"><a href="/shop">Shop</a><a href="/events">Events</a><a href="/gifting">Gifting</a>{v.preOn && (<><a href="/pre-order">Pre-order</a></>)}</nav></header></div><div className="wrap" style={{ "paddingTop": "22px" }}><nav className="crumb" aria-label="Breadcrumb"><a href="/">Home</a>{" / "}<span aria-current="page">Corporate gifting</span></nav></div><section id="gifting" style={{ "position": "relative", "marginTop": "-20px" }}><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "96px 32px 88px", "boxSizing": "border-box", "display": "flex", "flexWrap": "wrap", "gap": "56px", "alignItems": "center" }}><div style={{ "flex": "1 1 380px", "minWidth": "0", "position": "relative", "height": "340px" }}>{v.giftTins.map((g, g__i) => (<React.Fragment key={g__i}><svg aria-hidden="true" viewBox="0 0 200 220" style={{ "position": "absolute", "left": g.left, "bottom": g.bottom, "width": "42%", "height": "auto", "transform": `rotate(${g.rot}deg)` }}><ellipse cx="100" cy="205" rx="74" ry="7" fill="#000000" opacity="0.12"></ellipse><path d="M30 70C28 6 172 6 170 70" fill="none" stroke="#4A2F24" strokeWidth="6" strokeLinecap="round"></path><path d="M24 70Q24 62 32 62L168 62Q176 62 176 70L166 168Q164 194 140 198L60 198Q36 194 34 168Z" fill="url(#silver)"></path><ellipse cx="100" cy="62" rx="76" ry="11" fill="#C9CCCF"></ellipse><ellipse cx="100" cy="63" rx="67" ry="8" fill="#F3ECDC"></ellipse><rect x="49" y="88" width="102" height="84" fill={g.bg}></rect><text x="56" y="109" fontFamily="grante, Dela Gothic One, sans-serif" fontSize="17" fill={g.fg}>A</text><text x="56" y="126" fontFamily="grante, Dela Gothic One, sans-serif" fontSize="17" fill={g.fg}>J</text><text x="56" y="143" fontFamily="grante, Dela Gothic One, sans-serif" fontSize="17" fill={g.fg}>E</text><text x="56" y="160" fontFamily="grante, Dela Gothic One, sans-serif" fontSize="17" fill={g.fg}>R</text><rect x="80" y="94" width="64" height="52" fill="none" stroke={g.fg} strokeWidth="0.8" strokeDasharray="2 2"></rect><path d="M118 104C110 114 110 128 118 136C126 128 126 114 118 104Z" fill={g.leaf}></path></svg></React.Fragment>))}<div style={{ "position": "absolute", "right": "4%", "top": "0", "width": "120px", "height": "120px", "borderRadius": "50%", "background": "#EE5340", "color": "#1F1B18", "display": "flex", "alignItems": "center", "justifyContent": "center", "textAlign": "center", "fontSize": "11px", "letterSpacing": "0.2em", "textTransform": "uppercase", "fontWeight": "600", "lineHeight": "1.5", "transform": "rotate(8deg)" }}>Gifts for<br />{"clients &"}<br />teams</div></div><div style={{ "flex": "1 1 380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "18px" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.34em", "textTransform": "uppercase", "color": "#C4361F", "fontWeight": "600" }}>Corporate gifting</div><h1 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "44px", "lineHeight": "1.06" }}>Client gifts with a Melbourne memory inside.</h1><p style={{ "margin": "0", "color": "#3A352F" }}>For welcome gifts, thank-yous and events. Tell us the occasion and we will put a quote together.</p><div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(150px, 1fr))", "gap": "16px" }}><div style={{ "borderTop": "1.5px solid #1F1B18", "paddingTop": "10px" }}><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "19px" }}>Your message</div><p style={{ "margin": "4px 0 0", "fontSize": "14px", "color": "#3A352F" }}>A custom card in every box.</p></div><div style={{ "borderTop": "1.5px solid #1F1B18", "paddingTop": "10px" }}><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "19px" }}>Your label</div><p style={{ "margin": "4px 0 0", "fontSize": "14px", "color": "#3A352F" }}>[Custom label or lid sticker, MOQ TBC]</p></div><div style={{ "borderTop": "1.5px solid #1F1B18", "paddingTop": "10px" }}><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "19px" }}>Many addresses</div><p style={{ "margin": "4px 0 0", "fontSize": "14px", "color": "#3A352F" }}>Delivered across Victoria.</p></div></div><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "12px" }}><a href="#enquiry" style={{ "display": "inline-flex", "alignItems": "center", "minHeight": "48px", "padding": "0 26px", "background": "#EE5340", "color": "#1F1B18", "textDecoration": "none", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "borderRadius": "2px" }}>Request a quote</a></div></div></div></section><section style={{ "position": "relative", "borderTop": "1px solid #DDD8CE", "borderBottom": "1px solid #DDD8CE" }}><div className="wrap" style={{ "paddingTop": "64px", "paddingBottom": "72px", "display": "flex", "flexDirection": "column", "gap": "28px" }}><div><div className="eyebrow">Who it is for</div><h2 style={{ "margin": "8px 0 0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "clamp(32px, 3.8vw, 46px)", "lineHeight": "1.06" }}>Four reasons to give a place.</h2></div><div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(220px, 1fr))", "gap": "20px" }}>{v.uses.map((u, u__i) => (<React.Fragment key={u__i}><div style={{ "border": "1px solid #1F1B18", "borderRadius": "4px", "background": "#F4F8F5", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "6px" }}><div style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": u.bg, "border": "1px solid #1F1B18" }}></div><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "22px", "lineHeight": "1.1" }}>{u.t}</div><div style={{ "fontSize": "15px", "color": "#3A352F" }}>{u.d}</div></div></React.Fragment>))}</div></div></section><section style={{ "position": "relative" }}><div className="wrap" style={{ "paddingTop": "72px", "paddingBottom": "72px", "display": "flex", "flexWrap": "wrap", "gap": "40px 64px", "alignItems": "flex-start" }}><div style={{ "flex": "1 1 340px", "maxWidth": "420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px" }}><div className="eyebrow">Make it yours</div><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "clamp(32px, 3.6vw, 44px)", "lineHeight": "1.06" }}>Options</h2><p style={{ "margin": "0", "color": "#3A352F" }}>{"Sets are curated from The Place Collection. See "}<a href="/shop#gift-sets" style={{ "fontWeight": "600" }}>gift sets on the Shop page</a>.</p></div><div style={{ "flex": "2 1 480px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px" }}>{v.opts.map((o, o__i) => (<React.Fragment key={o__i}><div style={{ "border": "1px solid #1F1B18", "borderRadius": "4px", "background": "#FBFAF7", "padding": "16px 22px", "display": "flex", "flexWrap": "wrap", "gap": "4px 24px", "alignItems": "baseline" }}><div style={{ "flex": "0 0 190px", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "20px" }}>{o.t}</div><div style={{ "flex": "1 1 260px", "minWidth": "0", "color": "#3A352F" }}>{o.d}</div></div></React.Fragment>))}<div style={{ "border": "1px dashed #1F1B18", "borderRadius": "4px", "padding": "16px 22px", "color": "#3A352F" }}><span style={{ "fontWeight": "700" }}>Bulk pricing.</span>{" [TIERS TO BE DECIDED: show as a table, or \"request a quote\".]"}</div></div></div></section><section style={{ "position": "relative" }}><div className="wrap" style={{ "paddingTop": "72px", "paddingBottom": "72px", "display": "flex", "flexDirection": "column", "gap": "28px" }}><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "clamp(30px, 3.6vw, 44px)", "lineHeight": "1.06" }}>How it works</h2><div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))", "gap": "24px" }}>{v.process.map((s, s__i) => (<React.Fragment key={s__i}><div style={{ "borderTop": "1.5px solid #1F1B18", "paddingTop": "12px", "display": "flex", "flexDirection": "column", "gap": "4px" }}><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontStyle": "italic", "fontWeight": "500", "fontSize": "22px", "color": "#C4361F", "lineHeight": "1" }}>{s.n}</div><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "21px" }}>{s.t}</div><div style={{ "fontSize": "15px", "color": "#3A352F" }}>{s.d}</div></div></React.Fragment>))}</div></div></section><section id="enquiry" style={{ "position": "relative" }}><div className="wrap" style={{ "paddingTop": "56px", "paddingBottom": "88px", "display": "flex", "flexWrap": "wrap", "gap": "40px 64px", "alignItems": "flex-start" }}><div style={{ "flex": "1 1 320px", "maxWidth": "420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px" }}><div className="eyebrow">Request a quote</div><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "clamp(32px, 3.6vw, 44px)", "lineHeight": "1.06" }}>Tell us the occasion.</h2><p style={{ "margin": "0", "color": "#3A352F" }}>We deliver across Victoria. Recipients elsewhere? Talk to us.</p><div><a className="btn2" href="#top">Download the gifting PDF</a></div></div><form style={{ "flex": "2 1 480px", "minWidth": "0", "border": "1px solid #1F1B18", "borderRadius": "4px", "background": "#FBFAF7", "padding": "28px", "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(220px, 1fr))", "gap": "14px" }}><div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-co" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Company</label><input id="g-co" type="text" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /></div><div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-nm" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Your name</label><input id="g-nm" type="text" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /></div><div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-em" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Email</label><input id="g-em" type="email" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /></div><div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-qty" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Quantity</label><input id="g-qty" type="text" inputMode="numeric" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /></div><div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-dt" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Needed by</label><input id="g-dt" type="text" placeholder="e.g. 5 December" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /></div><div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-bd" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Budget</label><input id="g-bd" type="text" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /></div><div style={{ "gridColumn": "1 / -1", "display": "flex", "flexDirection": "column", "gap": "6px" }}><label htmlFor="g-ms" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Message</label><textarea id="g-ms" rows="4" style={{ "padding": "12px 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box", "resize": "vertical" }}></textarea></div><div style={{ "gridColumn": "1 / -1" }}><button type="button" className="btn">Send enquiry</button></div></form></div></section><footer style={{ "background": "#1F1B18", "color": "#C9CBCD", "position": "relative" }}><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "64px 32px 32px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "48px" }}><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "32px", "justifyContent": "space-between", "alignItems": "flex-end", "borderBottom": "1px solid #3F3A35", "paddingBottom": "40px" }}><div style={{ "flex": "1 1 360px", "minWidth": "0" }}><div style={{ "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "32px", "color": "#F4F8F5", "lineHeight": "1.1" }}>First access to new places.</div><div style={{ "fontSize": "15px", "marginTop": "6px" }}>Join The Scentimentalist Society for new scents, Scent Stories and pickup dates.</div></div><form style={{ "flex": "1 1 420px", "minWidth": "0", "display": "flex", "flexWrap": "wrap", "gap": "10px" }}><label htmlFor="nl-name" style={{ "position": "absolute", "left": "-9999px" }}>Your name</label><input id="nl-name" type="text" autoComplete="name" placeholder="Your name" style={{ "flex": "1 1 150px", "minWidth": "0", "minHeight": "48px", "padding": "0 16px", "background": "transparent", "border": "1px solid #7A746C", "borderRadius": "2px", "color": "#F4F8F5", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><label htmlFor="nl-email" style={{ "position": "absolute", "left": "-9999px" }}>Email address</label><input id="nl-email" type="email" autoComplete="email" placeholder="Email address" style={{ "flex": "1 1 200px", "minWidth": "0", "minHeight": "48px", "padding": "0 16px", "background": "transparent", "border": "1px solid #7A746C", "borderRadius": "2px", "color": "#F4F8F5", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><button type="button" className="btn">Subscribe</button></form></div><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "40px" }}><div style={{ "flex": "2 1 260px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px" }}><div style={{ "fontFamily": "'grante', 'Dela Gothic One', sans-serif", "fontSize": "32px", "color": "#F4F8F5", "lineHeight": "1" }}>{"AJER "}<span style={{ "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "400", "fontSize": "11px", "letterSpacing": "0.45em", "verticalAlign": "middle" }}>HAUS</span></div><div style={{ "fontSize": "15px", "maxWidth": "320px" }}>A Melbourne fragrance house exploring memory, place and scent.</div><div style={{ "display": "flex", "gap": "8px" }}><a href="#top" aria-label="Instagram" style={{ "width": "44px", "height": "44px", "border": "1px solid #7A746C", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "border-box" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9CBCD" strokeWidth="1.6"><rect x="4" y="4" width="16" height="16" rx="4.5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="16.8" cy="7.2" r="0.8" fill="#C9CBCD"></circle></svg></a><a href="#top" aria-label="TikTok" style={{ "width": "44px", "height": "44px", "border": "1px solid #7A746C", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "border-box" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9CBCD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.5a3.6 3.6 0 11-3.6-3.6"></path><path d="M14 4c.3 2.6 2 4.2 4.8 4.4"></path></svg></a><a href="#top" aria-label="Linktree" style={{ "width": "44px", "height": "44px", "border": "1px solid #7A746C", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxSizing": "border-box" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9CBCD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"></path><path d="M12 7L7 4M12 7l5-3"></path><path d="M12 12L5.5 9M12 12l6.5-3"></path><path d="M12 17l-5-3M12 17l5-3"></path></svg></a></div></div><div style={{ "flex": "1 1 140px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "fontSize": "15px" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.24em", "textTransform": "uppercase", "color": "#F4F8F5", "fontWeight": "600" }}>Shop</div><a href="/shop" style={{ "color": "#C9CBCD", "textDecoration": "none" }}>The Collection</a>{v.preOn && (<><a href="/pre-order" style={{ "color": "#C9CBCD", "textDecoration": "none" }}>Pre-order</a></>)}</div><div style={{ "flex": "1 1 140px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "fontSize": "15px" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.24em", "textTransform": "uppercase", "color": "#F4F8F5", "fontWeight": "600" }}>Explore</div><a href="/events" style={{ "color": "#C9CBCD", "textDecoration": "none" }}>Scent Stories</a><a href="/philosophy" style={{ "color": "#C9CBCD", "textDecoration": "none" }}>Our Philosophy</a><a href="/gifting" style={{ "color": "#C9CBCD", "textDecoration": "none" }}>Corporate gifting</a></div><div style={{ "flex": "1 1 160px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "fontSize": "15px" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.24em", "textTransform": "uppercase", "color": "#F4F8F5", "fontWeight": "600" }}>Help</div><a href="#top" onClick={v.openFaq} style={{ "color": "#C9CBCD", "textDecoration": "none" }}>FAQ</a><a href="/delivery" style={{ "color": "#C9CBCD", "textDecoration": "none" }}>{"Delivery, pickup & returns"}</a><a href="#top" onClick={v.openContact} style={{ "color": "#C9CBCD", "textDecoration": "none" }}>Contact</a></div></div><div style={{ "borderTop": "1px solid #3F3A35", "paddingTop": "24px", "display": "flex", "flexWrap": "wrap", "justifyContent": "space-between", "gap": "12px", "fontSize": "13px" }}><div>[ACKNOWLEDGEMENT OF COUNTRY, wording to be confirmed with Ajer Haus]</div><div style={{ "display": "flex", "flexWrap": "wrap", "gap": "20px", "alignItems": "center" }}><span>© 2026 Ajer Haus</span><a href="#top" style={{ "color": "#C9CBCD" }}>Terms</a><a href="#top" style={{ "color": "#C9CBCD" }}>Privacy</a><span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px" }}><span>Pre-order</span><button type="button" role="switch" aria-checked={v.preOn} aria-label="Pre-order on or off (prototype switch)" onClick={v.togglePre} style={{ "position": "relative", "width": "40px", "height": "22px", "borderRadius": "999px", "border": "0", "padding": "0", "cursor": "pointer", "background": v.preTrack }}><span style={{ "position": "absolute", "top": "2px", "left": v.preKnob, "width": "18px", "height": "18px", "borderRadius": "50%", "background": "#F4F8F5", "transition": "left 0.2s ease" }}></span></button><span>{v.preLabel}</span></span></div></div></div></footer>{v.faqOpen && (<><div role="dialog" aria-modal="true" aria-label="Frequently asked questions" style={{ "position": "fixed", "left": "0", "top": "0", "right": "0", "bottom": "0", "zIndex": "200", "background": "#F4F8F5", "color": "#1F1B18", "overflowY": "auto", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "17px", "lineHeight": "1.55" }}><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "8px 32px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "boxSizing": "border-box", "minHeight": "64px" }}><div style={{ "fontFamily": "'grante', 'Dela Gothic One', sans-serif", "fontSize": "28px", "lineHeight": "1" }}>{"AJER "}<span style={{ "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "400", "fontSize": "11px", "letterSpacing": "0.45em", "verticalAlign": "middle" }}>HAUS</span></div><button onClick={v.closeOv} aria-label="Close FAQ" style={{ "minHeight": "44px", "padding": "0 16px", "border": "1.5px solid #EE5340", "background": "transparent", "color": "#C4361F", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "12px", "cursor": "pointer" }}>Close ✕</button></div><div style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "24px 32px 80px", "boxSizing": "border-box", "display": "flex", "flexWrap": "wrap", "gap": "32px 72px", "alignItems": "flex-start", "position": "relative" }}><svg aria-hidden="true" viewBox="0 0 400 400" style={{ "position": "absolute", "right": "-60px", "top": "-30px", "width": "360px", "height": "auto", "pointerEvents": "none", "opacity": "0.8" }}><circle cx="200" cy="200" r="170" fill="none" stroke="#EE5340" strokeWidth="1.1"></circle><circle cx="200" cy="200" r="120" fill="none" stroke="#1F1B18" strokeWidth="0.8" strokeDasharray="1 6" strokeLinecap="round"></circle><circle cx="70" cy="90" r="10" fill="#EE5340"></circle></svg><div style={{ "flex": "1 1 300px", "maxWidth": "380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px", "position": "relative" }}><div style={{ "fontSize": "12px", "letterSpacing": "0.34em", "textTransform": "uppercase", "color": "#C4361F", "fontWeight": "600" }}>Quick answers</div><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "clamp(38px, 5vw, 60px)", "lineHeight": "1.04" }}>{"Questions "}<span style={{ "fontStyle": "italic", "fontWeight": "500" }}>people ask.</span></h2><p style={{ "margin": "0", "color": "#3A352F" }}>Can't find yours? Write to us and a real person will answer.</p><div><button onClick={v.askFromFaq} style={{ "minHeight": "48px", "padding": "0 26px", "background": "#EE5340", "color": "#1F1B18", "border": "0", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "cursor": "pointer" }}>Contact us</button></div></div><div style={{ "flex": "2 1 480px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "position": "relative" }}>{v.ovFaq.map((q, q__i) => (<React.Fragment key={q__i}><div style={{ "border": "1px solid #1F1B18", "borderRadius": "4px", "background": "#FBFAF7" }}><button onClick={q.toggle} aria-expanded={q.open} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "width": "100%", "minHeight": "60px", "padding": "8px 22px", "border": "0", "background": "transparent", "cursor": "pointer", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "20px", "color": "#1F1B18", "textAlign": "left" }}><span>{q.q}</span><span aria-hidden="true" style={{ "color": "#C4361F", "marginLeft": "16px", "fontFamily": "'Josefin Sans', sans-serif" }}>{q.sign}</span></button>{q.open && (<><div style={{ "padding": "0 22px 20px", "maxWidth": "700px", "color": "#3A352F" }}>{q.a}</div></>)}</div></React.Fragment>))}</div></div></div></>)}{v.contactOpen && (<><div style={{ "position": "fixed", "left": "0", "top": "0", "right": "0", "bottom": "0", "zIndex": "210", "background": "rgba(31,27,24,0.55)", "display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "16px", "boxSizing": "border-box", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "17px", "lineHeight": "1.55", "color": "#1F1B18" }}><div role="dialog" aria-modal="true" aria-label="Contact Ajer Haus" style={{ "width": "100%", "maxWidth": "560px", "maxHeight": "100%", "overflowY": "auto", "background": "#FBFAF7", "border": "1.5px solid #1F1B18", "borderRadius": "6px", "padding": "28px", "boxSizing": "border-box", "position": "relative", "display": "flex", "flexDirection": "column", "gap": "14px" }}><button onClick={v.closeOv} aria-label="Close contact form" style={{ "position": "absolute", "right": "10px", "top": "10px", "width": "44px", "height": "44px", "border": "0", "background": "transparent", "color": "#C4361F", "fontSize": "22px", "cursor": "pointer" }}>✕</button><div style={{ "fontSize": "12px", "letterSpacing": "0.34em", "textTransform": "uppercase", "color": "#C4361F", "fontWeight": "600" }}>Contact</div><h2 style={{ "margin": "0", "fontFamily": "'Bodoni Moda', serif", "fontWeight": "700", "fontSize": "34px", "lineHeight": "1.08" }}>Say hello.</h2>{v.notSent && (<><form onSubmit={v.sendMsg} style={{ "display": "flex", "flexDirection": "column", "gap": "12px" }}><div style={{ "color": "#5C564E", "fontSize": "15px" }}>[CONTACT EMAIL] · [RESPONSE TIME]</div><label htmlFor="ct-name" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Name</label><input id="ct-name" type="text" autoComplete="name" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><label htmlFor="ct-email" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Email</label><input id="ct-email" type="email" autoComplete="email" style={{ "minHeight": "48px", "padding": "0 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }} /><label htmlFor="ct-topic" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>What is it about?</label><select id="ct-topic" style={{ "minHeight": "48px", "padding": "0 10px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box" }}><option>An order</option><option>Delivery or pickup</option><option>Corporate gifting</option><option>Scent Story events</option><option>Something else</option></select><label htmlFor="ct-msg" style={{ "fontSize": "12px", "letterSpacing": "0.16em", "textTransform": "uppercase", "fontWeight": "600" }}>Message</label><textarea id="ct-msg" rows="4" style={{ "padding": "12px 14px", "border": "1px solid #1F1B18", "borderRadius": "2px", "background": "#fff", "fontFamily": "'Josefin Sans', sans-serif", "fontSize": "16px", "boxSizing": "border-box", "resize": "vertical" }}></textarea><div><button type="submit" style={{ "minHeight": "48px", "padding": "0 26px", "background": "#EE5340", "color": "#1F1B18", "border": "0", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "cursor": "pointer" }}>Send message</button></div></form></>)}{v.sent && (<><div aria-live="polite" style={{ "padding": "18px", "border": "1.5px solid #1F1B18", "borderRadius": "2px", "background": "rgba(246,220,208,0.6)" }}><span style={{ "fontWeight": "700" }}>Thank you.</span>{" Your message is on its way. [RESPONSE TIME]"}</div><div><button onClick={v.closeOv} style={{ "minHeight": "48px", "padding": "0 26px", "background": "transparent", "color": "#C4361F", "border": "1.5px solid #EE5340", "borderRadius": "2px", "fontFamily": "'Josefin Sans', sans-serif", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "fontSize": "13px", "cursor": "pointer" }}>Close</button></div></>)}</div></div></>)}</div></>);
}

Component.prototype.render = function () { return view(this.renderVals()); };

export default Component;
