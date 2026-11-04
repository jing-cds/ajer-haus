import React from "react";
import ProductPage from "./ProductPage.jsx";

const PRE_ON = true; // flip to false to hide the Pre-order button and page link
const f = (n) => Math.round(n * 10) / 10;
const circ = (cx, cy, r) =>
  "M" +
  f(cx - r) +
  " " +
  f(cy) +
  "a" +
  r +
  " " +
  r +
  " 0 1 0 " +
  2 * r +
  " 0a" +
  r +
  " " +
  r +
  " 0 1 0 " +
  -2 * r +
  " 0";
const petal = (cx, cy, len, w, deg) => {
  const a = (deg * Math.PI) / 180,
    dx = Math.cos(a),
    dy = Math.sin(a);
  const tx = cx + dx * len,
    ty = cy + dy * len,
    mx = cx + dx * len * 0.55,
    my = cy + dy * len * 0.55;
  const px = -dy * w,
    py = dx * w;
  return (
    "M" +
    f(cx) +
    " " +
    f(cy) +
    "Q" +
    f(mx + px) +
    " " +
    f(my + py) +
    " " +
    f(tx) +
    " " +
    f(ty) +
    "Q" +
    f(mx - px) +
    " " +
    f(my - py) +
    " " +
    f(cx) +
    " " +
    f(cy)
  );
};
const flower = (cx, cy, n, len, w, off) => {
  let d = "";
  for (let i = 0; i < n; i++) d += petal(cx, cy, len, w, off + (i * 360) / n);
  return d;
};
const ray = (cx, cy, r1, r2, deg) => {
  const a = (deg * Math.PI) / 180;
  return (
    "M" +
    f(cx + Math.cos(a) * r1) +
    " " +
    f(cy + Math.sin(a) * r1) +
    "L" +
    f(cx + Math.cos(a) * r2) +
    " " +
    f(cy + Math.sin(a) * r2)
  );
};
const rays = (cx, cy, n, r1, r2, off) => {
  let d = "";
  for (let i = 0; i < n; i++) d += ray(cx, cy, r1, r2, off + (i * 360) / n);
  return d;
};
const drop = (x, y, s) =>
  "M" +
  f(x) +
  " " +
  f(y - 10 * s) +
  "C" +
  f(x + 8 * s) +
  " " +
  f(y - 1 * s) +
  " " +
  f(x + 8 * s) +
  " " +
  f(y + 8 * s) +
  " " +
  f(x) +
  " " +
  f(y + 8 * s) +
  "C" +
  f(x - 8 * s) +
  " " +
  f(y + 8 * s) +
  " " +
  f(x - 8 * s) +
  " " +
  f(y - 1 * s) +
  " " +
  f(x) +
  " " +
  f(y - 10 * s) +
  "Z";
function cedarNeedles() {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const y = 14 + i * 6,
      l = 6 + i * 1.8;
    d +=
      "M40 " +
      y +
      "l" +
      f(-l) +
      " " +
      f(l * 0.7) +
      "M40 " +
      y +
      "l" +
      f(l) +
      " " +
      f(l * 0.7);
  }
  return d;
}
function eucLeaves() {
  let d = "";
  const P0 = [16, 74],
    C = [38, 44],
    P1 = [62, 8];
  for (let i = 0; i < 6; i++) {
    const t = 0.14 + i * 0.14;
    const x =
      (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P1[0];
    const y =
      (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P1[1];
    d += circ(x + (i % 2 === 0 ? 9 : -9), y - 2, 6.5 - i * 0.4);
  }
  return d;
}
function fernLeaflets() {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const y = 70 - i * 6.4,
      l = 17 - i * 1.4;
    d +=
      "M40 " +
      f(y) +
      "L" +
      f(40 - l) +
      " " +
      f(y - l * 0.55) +
      "M40 " +
      f(y) +
      "L" +
      f(40 + l) +
      " " +
      f(y - l * 0.55);
  }
  return d;
}
function lemonSegments() {
  let d = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    d += "M40 40L" + f(40 + 24 * Math.cos(a)) + " " + f(40 + 16 * Math.sin(a));
  }
  return d;
}

const ING = {
  frangipani: {
    n: "frangipani",
    d: flower(40, 40, 5, 30, 12, -90) + circ(40, 40, 3),
    e: flower(40, 40, 5, 17, 4, -54),
  },
  jasmine: {
    n: "jasmine",
    d: flower(40, 40, 6, 28, 5, -90) + circ(40, 40, 3),
    e: rays(40, 40, 6, 6, 14, -60),
  },
  wildflower: {
    n: "wildflower",
    d: flower(40, 40, 11, 26, 3.4, -90) + circ(40, 40, 7),
    e: circ(40, 40, 3.5),
  },
  oud: {
    n: "oud",
    d: "M14 52L22 30L40 20L62 27L68 46L52 62L30 64Z",
    e:
      "M24 36Q40 30 58 36M22 46Q42 40 64 46M28 56Q42 50 56 56" +
      circ(46, 44, 3),
  },
  sandalwood: {
    n: "sandalwood",
    d: circ(40, 40, 28) + circ(40, 40, 20),
    e: circ(40, 40, 12) + circ(40, 40, 5) + "M40 40L68 34M40 40L14 50",
  },
  cedar: { n: "cedar", d: "M40 74V8", e: cedarNeedles() },
  woodsmoke: {
    n: "woodsmoke",
    d: "M26 72C14 60 38 52 26 40C16 28 34 22 26 8M42 72C30 60 54 52 42 40C32 28 50 22 42 8M58 72C46 60 70 52 58 40C48 28 66 22 58 8",
    e: "M0 0",
  },
  tobacco: {
    n: "tobacco leaf",
    d: "M40 74C10 60 8 28 40 6C72 28 70 60 40 74Z",
    e: "M40 74V10M40 62L24 50M40 62L56 50M40 50L22 38M40 50L58 38M40 38L26 28M40 38L54 28M40 26L32 18M40 26L48 18",
  },
  whiskey: {
    n: "aged whiskey",
    d: "M22 24L26 66Q26 70 30 70L50 70Q54 70 54 66L58 24Z",
    e: "M25 42L55 42M32 30L42 28L44 38L34 40ZM30 50L30 62",
  },
  wattle: {
    n: "wattle blossom",
    d: "M12 70Q36 50 62 18M20 62Q10 50 8 38Q20 46 24 58M30 56Q24 44 26 32Q36 42 36 52",
    e:
      circ(62, 18, 6) +
      circ(50, 26, 5.5) +
      circ(40, 34, 5) +
      circ(31, 42, 4.5) +
      circ(22, 50, 4),
  },
  seedpod: {
    n: "wattleseed",
    d: "M14 62Q30 20 68 14Q42 28 14 62ZM22 68Q42 34 70 34Q50 42 22 68Z",
    e:
      circ(34, 40, 1.6) +
      circ(44, 28, 1.6) +
      circ(52, 22, 1.6) +
      circ(48, 46, 1.6) +
      circ(58, 40, 1.6),
  },
  sun: {
    n: "morning sun",
    d: circ(40, 40, 12) + rays(40, 40, 12, 17, 28, 0),
    e: "M0 0",
  },
  salt: {
    n: "sea salt",
    d: "M40 14L64 26L64 54L40 66L16 54L16 26Z",
    e: "M16 26L40 38L64 26M40 38L40 66M10 74l6 -7l6 7zM58 74l5 -6l5 6z",
  },
  sage: {
    n: "sage",
    d: "M40 74C14 62 14 24 40 8C66 24 66 62 40 74Z",
    e: "M40 74V12M40 60Q28 54 22 44M40 60Q52 54 58 44M40 46Q30 40 26 30M40 46Q50 40 54 30M40 32Q34 28 32 22M40 32Q46 28 48 22",
  },
  eucalyptus: { n: "eucalyptus", d: "M16 74Q38 44 62 8", e: eucLeaves() },
  lime: {
    n: "lime",
    d: circ(40, 40, 28) + circ(40, 40, 23),
    e: rays(40, 40, 8, 4, 23, 0) + circ(40, 40, 3),
  },
  lemon: {
    n: "lemon",
    d: "M10 40a30 22 0 1 0 60 0a30 22 0 1 0 -60 0M10 40L4 40M70 40L76 40",
    e: "M16 40a24 16 0 1 0 48 0a24 16 0 1 0 -48 0" + lemonSegments(),
  },
  coconut: {
    n: "coconut",
    d: circ(40, 40, 28) + circ(40, 40, 21),
    e: circ(40, 40, 8) + rays(40, 40, 16, 11, 19, 0),
  },
  raindrops: {
    n: "rain",
    d:
      drop(24, 24, 1) +
      drop(54, 18, 0.9) +
      drop(38, 50, 1.1) +
      drop(62, 52, 0.9) +
      drop(18, 58, 0.8),
    e: "M10 8L16 20M44 4L50 16M30 64L34 72",
  },
  fern: { n: "fern", d: "M40 76Q46 40 40 6", e: fernLeaflets() },
};

const PLACES = [
  {
    name: "Shrine of Remembrance",
    bg: "#2B1D8F",
    fg: "#F6DCD0",
    leaf: "#D95A25",
    wash: "#DAD5F2",
    live: false,
    pre: true,
    price: 26,
    place: "The Shrine, St Kilda Rd",
    memory: "A quiet hour on the steps, with something sweet on the air.",
    notes: "Native frangipani · oud · sweet · woody",
    sub: " · with sandalwood & cedar",
    items: ["frangipani", "oud", "sandalwood", "cedar"],
  },
  {
    name: "Love Affair at Hosier",
    bg: "#C4325A",
    fg: "#F9D648",
    leaf: "#5A1A12",
    wash: "#F4CDD8",
    live: false,
    place: "Hosier Lane, CBD",
    memory: "A lane, a late night, smoke still in your jacket.",
    notes: "Woodsmoke · tobacco · ashy · mature",
    sub: " · with aged whiskey",
    items: ["woodsmoke", "tobacco", "whiskey"],
  },
  {
    name: "Melbourne Morning",
    bg: "#8A2515",
    fg: "#F6DCD0",
    leaf: "#D95A25",
    wash: "#EBC9C0",
    live: false,
    place: "[Place to confirm]",
    memory: "Wattleseed warmth before the city wakes up.",
    notes: "Wattleseed · warmth · nutty",
    sub: "",
    items: ["wattle", "seedpod", "sun"],
  },
  {
    name: "The Great Ocean Road",
    bg: "#4A6E66",
    fg: "#F2AAA0",
    leaf: "#D95A25",
    wash: "#CFE0DB",
    live: false,
    place: "Great Ocean Road, Victoria",
    memory: "Windows down, salt on everything.",
    notes: "Sea salt · sage · breezy",
    sub: " · with jasmine & eucalyptus",
    items: ["salt", "sage", "eucalyptus", "jasmine"],
  },
  {
    name: "Night Out at Fed Square",
    bg: "#C3B2EE",
    fg: "#F8EBB8",
    leaf: "#5A1A12",
    wash: "#E4DBF7",
    live: false,
    place: "Federation Square, CBD",
    memory: "Lime in the glass and the square still humming.",
    notes: "Lime · coconut · zesty · creamy",
    sub: "",
    items: ["lime", "coconut"],
  },
  {
    name: "It's About to Rain",
    bg: "#6E98C0",
    fg: "#C8E048",
    leaf: "#5A1A12",
    wash: "#D3E3F2",
    live: false,
    place: "[Place to confirm]",
    memory: "That earthy breath of air just before the sky breaks.",
    notes: "Lemon · sandalwood · earthy · deep",
    sub: "",
    items: ["lemon", "sandalwood", "raindrops"],
  },
  {
    name: "Yarra at Dusk",
    bg: "#E8B85A",
    fg: "#D95A25",
    leaf: "#5A1A12",
    wash: "#F6E1B6",
    live: false,
    place: "The Yarra",
    memory: "Eucalyptus on the breeze as the river goes gold.",
    notes: "Eucalyptus · fern · fresh · crisp",
    sub: " · with herbs & sweet wildflower",
    items: ["eucalyptus", "fern", "wildflower"],
  },
];
const DRIFT_POS = [
  ["8%", "30%"],
  ["72%", "24%"],
  ["22%", "10%"],
  ["58%", "36%"],
];

const FAQS = [
  {
    q: "Do you deliver outside Victoria?",
    a: "Not yet. We deliver within Victoria only for now. Pop your email in at checkout and we will tell you when we reach your state.",
  },
  {
    q: "How much is delivery?",
    a: "Flat $10.20 with Australia Post, and free for orders of $75 or more. [Confirm: threshold measured before or after discounts.]",
  },
  {
    q: "Can I collect my order?",
    a: "Yes. Choose Collect in Melbourne CBD at checkout. We announce the pickup point, date and time on the Delivery, pickup & returns page, at checkout and by email. There are no slots to book.",
  },
  {
    q: "How do pre-orders work?",
    a: "You pay in full when you order. If your cart mixes in-stock and pre-order candles, everything ships together on the pre-order dispatch date. We email you when it ships, and again if the date moves.",
  },
  {
    q: "Which scents can I buy now?",
    a: "Shrine of Remembrance is poured and ready. The other six places are coming soon. Leave your email on a scent and we will tell you when it is poured.",
  },
  {
    q: "How do I burn and care for my candle?",
    a: "[BURN GUIDANCE, WARNINGS AND DISPOSAL: reproduce the label text exactly. See the care guide on each product page.]",
  },
  {
    q: "Can I send a candle as a gift?",
    a: "Yes. Add a gift message and ship to a different address within Victoria.",
  },
  {
    q: "Do you do corporate or bulk orders?",
    a: "Yes. See Gifting for custom messages, labels and delivery to multiple addresses, then send us a quote request.",
  },
  {
    q: "Where do I get Scent Story tickets?",
    a: "Tickets are sold on Humanitix. Each event page on this site links straight to the right one.",
  },
];

class Component extends React.Component {
  constructor(props) {
    super(props);
    let s0 = 0;
    try {
      const v = parseInt(window.localStorage.getItem("ajerSel"), 10);
      if (v >= 0 && v < 7) s0 = v;
    } catch (err) {}
    this.state = {
      pre: PRE_ON,
      sel: s0,
      lit: false,
      open: "memory",
      fmt: "tin",
    };
    this.state.hide = false;
    this.state.menu = false;
    this._y = 0;
    this.onScroll = this.onScroll.bind(this);
    this.onKey = this.onKey.bind(this);
    this.state.faqOpen = false;
    this.state.contactOpen = false;
    this.state.sent = false;
    this.state.fq = 0;
  }
  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, true);
    window.addEventListener("keydown", this.onKey);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, true);
    window.removeEventListener("keydown", this.onKey);
  }
  onScroll(e) {
    const t = e.target;
    let y;
    if (!t || t === document || t === window || t.nodeType === 9) {
      y =
        window.scrollY ||
        (document.documentElement && document.documentElement.scrollTop) ||
        0;
    } else {
      const root = document.getElementById("top");
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
    const stop = (e) => {
      if (e && e.preventDefault) e.preventDefault();
    };
    return {
      faqOpen: !!st.faqOpen,
      contactOpen: !!st.contactOpen,
      sent: !!st.sent,
      notSent: !st.sent,
      openFaq: (e) => {
        stop(e);
        this.setState({ faqOpen: true, contactOpen: false, menu: false });
      },
      openContact: (e) => {
        stop(e);
        this.setState({
          contactOpen: true,
          faqOpen: false,
          sent: false,
          menu: false,
        });
      },
      closeOv: () =>
        this.setState({ faqOpen: false, contactOpen: false, sent: false }),
      askFromFaq: () =>
        this.setState({ faqOpen: false, contactOpen: true, sent: false }),
      sendMsg: (e) => {
        stop(e);
        this.setState({ sent: true });
      },
      noop: () => {},
      ovFaq: FAQS.map((x, i) => ({
        q: x.q,
        a: x.a,
        open: st.fq === i,
        sign: st.fq === i ? "−" : "+",
        toggle: () => this.setState({ fq: this.state.fq === i ? -1 : i }),
      })),
    };
  }
  onKey(e) {
    if (e.key === "Escape" && (this.state.faqOpen || this.state.contactOpen))
      this.setState({ faqOpen: false, contactOpen: false, sent: false });
  }
  hdrVals() {
    return {
      hdrY: this.state.hide && !this.state.menu ? "-100%" : "0",
      menu: this.state.menu,
      toggleMenu: () => this.setState({ menu: !this.state.menu }),
      menuCls: this.state.menu ? "mnav open" : "mnav",
    };
  }
  renderVals() {
    PLACES.forEach((q) => {
      if (q.name === "Shrine of Remembrance") q.pre = this.state.pre;
    });
    const ov = this.ovVals();
    const lk = (label, href, click) => ({
      label: label,
      href: href,
      click: click || ov.noop,
    });
    const theme = this.props.theme ?? "white";
    const sfx = theme === "silver" ? "Silver" : "White";
    const homeHref = "/";
    const collHref = "Collection-" + sfx + ".dc.html";
    const delHref = "Delivery-" + sfx + ".dc.html";
    const { sel, lit, open, fmt } = this.state;
    const cur = PLACES[sel];
    const silver = theme === "silver";
    const stageBg = silver
      ? lit
        ? "radial-gradient(circle at 50% 45%, #5A4A38 0%, rgba(30,28,26,0) 65%), linear-gradient(160deg,#3A3D41,#16171A)"
        : "radial-gradient(circle at 50% 40%, " +
          cur.wash +
          " 0%, rgba(255,255,255,0) 66%), repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 1px, rgba(0,0,0,0.04) 1px 3px), linear-gradient(160deg,#EEF0F2,#B7BBC0 55%,#E4E6E9)"
      : lit
        ? "#1B1815"
        : cur.wash;
    const toggle = (key) => () =>
      this.setState({ open: this.state.open === key ? "" : key });
    const live = cur.live;
    const pre = !!cur.pre;
    return {
      theme: theme,
      homeHref: homeHref,
      delHref: delHref,
      nav: [
        { label: "Shop", href: "/shop" },
        { label: "Events", href: "/events" },
        { label: "Gifting", href: "/gifting" },
        ...(this.state.pre ? [{ label: "Pre-order", href: "/collection#order" }] : []),
      ],
      navL: [
        { label: "Shop", href: "/shop" },
        { label: "Events", href: "/events" },
        { label: "Gifting", href: "/gifting" },
      ],
      navR: [],
      preOn: this.state.pre,
      togglePre: () => this.setState({ pre: !this.state.pre }),
      preTrack: this.state.pre ? "#EE5340" : "#7A746C",
      preKnob: this.state.pre ? "20px" : "2px",
      preLabel: this.state.pre ? "On" : "Off",
      ...this.ovVals(),
      ...this.hdrVals(),
      foot: [
        {
          title: "Shop",
          links: [
            lk("The Collection", collHref),
            ...(this.state.pre ? [lk("Pre-order", "/collection#order")] : []),
          ],
        },
        {
          title: "Explore",
          links: [
            lk("Scent Stories", "/events"),
            lk("Our Philosophy", "/philosophy"),
            lk("Corporate gifting", "/gifting"),
          ],
        },
        {
          title: "Help",
          links: [
            lk("FAQ", "#faq"),
            lk("Delivery, pickup & returns", delHref),
            lk("Contact", "#top", ov.openContact),
          ],
        },
      ],
      shelf: PLACES.map((p, i) => ({
        name: p.name,
        bg: p.bg,
        fg: p.fg,
        leaf: p.leaf,
        status: p.live ? "Available" : p.pre ? "Pre-order" : "Coming soon",
        selected: i === sel,
        line:
          i === sel
            ? "3px solid #EE5340"
            : "1px solid " + (silver ? "#9A9EA3" : "#D6CFBD"),
        pick: () => this.setState({ sel: i, lit: false }),
      })),
      stageBg: stageBg,
      stageInk: lit ? "#E8E4DD" : "#1F1B18",
      glowOp: lit ? 1 : 0,
      lit: lit,
      toggleLit: () => this.setState({ lit: !this.state.lit }),
      toggleLabel: lit ? "Blow it out" : "Light the candle",
      toggleBg: lit
        ? "transparent"
        : silver
          ? "linear-gradient(180deg,#FFFFFF,#DDE0E3)"
          : "rgba(255,255,255,0.7)",
      toggleBorder: lit ? "#F6DCD0" : "#EE5340",
      toggleColor: lit ? "#F6DCD0" : "#C4361F",
      drift: cur.items.map((k, j) => ({
        left: DRIFT_POS[j][0],
        top: DRIFT_POS[j][1],
        delay: j * 1.4 + "s",
        d: ING[k].d,
        e: ING[k].e,
        disc: cur.fg,
      })),
      ings: cur.items.map((k) => ({
        name: ING[k].n,
        d: ING[k].d,
        e: ING[k].e,
        disc: cur.fg,
      })),
      dBg: cur.bg,
      dFg: cur.fg,
      dLeaf: cur.leaf,
      dName: cur.name,
      dPlace: cur.place,
      dMemory: cur.memory,
      dNameShort: cur.name.toUpperCase().slice(0, 26),
      dNotesTiny: cur.notes.toUpperCase().replace(/ · /g, " · ").slice(0, 44),
      dNotes: cur.notes,
      dSub: cur.sub,
      dLive: live,
      dSoon: !live && !pre,
      dPre: pre,
      dPrice: cur.price ? "$" + cur.price : "Price to come",
      dStatus: live ? "Available now" : pre ? "Pre-order" : "Coming soon",
      dBadgeBg: live || pre ? "#EE5340" : "transparent",
      dBadgeFg: live ? "#1F1B18" : "#1F1B18",
      fmtNote:
        fmt === "tin"
          ? "90g soy-coconut tin"
          : "[Moulded: shape, size and price to come]",
      formats: [
        { key: "tin", label: "Tin · 90g" },
        { key: "moulded", label: "Moulded" },
      ].map((x) => ({
        label: x.label,
        on: fmt === x.key,
        border: fmt === x.key ? "#EE5340" : silver ? "#9A9EA3" : "#CFCBC2",
        bg:
          fmt === x.key
            ? "#EE5340"
            : silver
              ? "linear-gradient(180deg,#FFFFFF,#DDE0E3)"
              : "transparent",
        color: fmt === x.key ? "#1F1B18" : "#1F1B18",
        pick: () => this.setState({ fmt: x.key }),
      })),
      openMemory: open === "memory",
      openSafety: open === "safety",
      openDelivery: open === "delivery",
      openCare: open === "care",
      signCare: open === "care" ? "−" : "+",
      toggleCare: toggle("care"),
      signMemory: open === "memory" ? "−" : "+",
      signSafety: open === "safety" ? "−" : "+",
      signDelivery: open === "delivery" ? "−" : "+",
      toggleMemory: toggle("memory"),
      toggleSafety: toggle("safety"),
      toggleDelivery: toggle("delivery"),
      facts: [
        { k: "Wax", v: "Soy-coconut blend, hand-poured in Naarm" },
        {
          k: "Size",
          v:
            fmt === "tin"
              ? "90g silver tin with lid"
              : "[Moulded size to come]",
        },
        { k: "Batch", v: "#0126" },
        { k: "Fragrance notes", v: cur.notes + cur.sub },
        { k: "Ingredients", v: "[INGREDIENTS LIST for " + cur.name + "]" },
      ],
      careFacts: [
        {
          k: "Burn guidance",
          v: "[BURN INSTRUCTIONS: trim, first burn, burn time, how to extinguish]",
        },
        {
          k: "Warnings",
          v: "[WARNING TEXT: reproduce the physical label wording exactly, from one CMS source]",
        },
        { k: "Disposal", v: "[DISPOSAL AND TIN RECYCLING TEXT]" },
      ],
      galBg:
        this.props.theme === "silver"
          ? "linear-gradient(160deg,#EEF0F2,#C9CCD0)"
          : cur.wash,
      rel: [1, 2, 3, 4].map((o) => {
        const i = (sel + o) % PLACES.length;
        const p = PLACES[i];
        return {
          name: p.name,
          bg: p.bg,
          fg: p.fg,
          leaf: p.leaf,
          wash: p.wash,
          status: p.live ? "Available now" : p.pre ? "Pre-order" : "Coming soon",
          price: p.price ? "$" + p.price + " AUD" : "Price to come",
          pick: () => {
            this.setState({ sel: i, lit: false });
            try {
              document.getElementById("top").scrollIntoView();
            } catch (err) {}
          },
        };
      }),
    };
  }
}

function view(v) {
  return (
    <>
      <div
        id="top"
        className="page"
        data-theme={v.theme}
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          color: "#1F1B18",
          fontSize: "17px",
          lineHeight: "1.55",
          position: "relative",
          overflowX: "clip",
        }}
      >
        <svg
          width="0"
          height="0"
          style={{ position: "absolute" }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="silver" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#7C8084"></stop>
              <stop offset="0.22" stopColor="#E4E6E8"></stop>
              <stop offset="0.5" stopColor="#B4B8BC"></stop>
              <stop offset="0.78" stopColor="#F3F4F5"></stop>
              <stop offset="1" stopColor="#868A8E"></stop>
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFC15E" stopOpacity="0.85"></stop>
              <stop offset="0.45" stopColor="#FF9A3C" stopOpacity="0.28"></stop>
              <stop offset="1" stopColor="#FF9A3C" stopOpacity="0"></stop>
            </radialGradient>
            <linearGradient id="flame" x1="0" x2="0" y1="1" y2="0">
              <stop offset="0" stopColor="#D95A25"></stop>
              <stop offset="0.6" stopColor="#FFB547"></stop>
              <stop offset="1" stopColor="#FFF1B8"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            background: "#1F1B18",
            color: "#E4E3E0",
            textAlign: "center",
            padding: "10px 16px",
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Free delivery in Victoria over $75 · Or collect in Melbourne CBD
        </div>
        <div className="hdrwrap" style={{ transform: `translateY(${v.hdrY})` }}>
          <header className="head">
            <div className="hdr">
              <nav className="navL" aria-label="Main">
                <button
                  className="ib burger"
                  aria-label="Menu"
                  aria-expanded={v.menu}
                  onClick={v.toggleMenu}
                >
                  <svg
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EE5340"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <path d="M4 7h16M4 12h16M4 17h16"></path>
                  </svg>
                </button>
                {v.navL.map((n, n__i) => (
                  <React.Fragment key={n__i}>
                    <a className="navlink" href={n.href}>
                      {n.label}
                    </a>
                  </React.Fragment>
                ))}
              </nav>
              <a className="logo" href={v.homeHref} aria-label="Ajer Haus, home"><img src="/logo.png" alt="Ajer Haus" /></a>
              <div className="navR">
                {v.navR.map((n, n__i) => (
                  <React.Fragment key={n__i}>
                    <a className="navlink lnk" href={n.href}>
                      {n.label}
                    </a>
                  </React.Fragment>
                ))}
                {v.preOn && (
                  <>
                    <a className="preBtn" href="/collection#order">
                      Pre-order
                    </a>
                  </>
                )}
                <div style={{ display: "flex" }}>
                  <button className="ib" aria-label="Search">
                    <svg
                      aria-hidden="true"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#EE5340"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <circle cx="11" cy="11" r="6.5"></circle>
                      <path d="M16 16l4.5 4.5"></path>
                    </svg>
                  </button>
                  <button className="ib" aria-label="Cart">
                    <svg
                      aria-hidden="true"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#EE5340"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 8h14l-1.2 11H6.2z"></path>
                      <path d="M9 8V6.5a3 3 0 016 0V8"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <nav className={v.menuCls} aria-label="Menu">
              {v.nav.map((n, n__i) => (
                <React.Fragment key={n__i}>
                  <a className="navlink" href={n.href}>
                    {n.label}
                  </a>
                </React.Fragment>
              ))}
            </nav>
          </header>
        </div>
        <ProductPage />
        <footer style={{ background: "var(--footer)", color: "#C9CBCD" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "64px 32px 32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "32px",
                justifyContent: "space-between",
                alignItems: "flex-end",
                borderBottom: "1px solid #4A4C50",
                paddingBottom: "40px",
              }}
            >
              <div style={{ flex: "1 1 360px", minWidth: "0" }}>
                <div
                  className="serif"
                  style={{
                    fontWeight: "700",
                    fontSize: "32px",
                    color: "#F4F8F5",
                    lineHeight: "1.1",
                  }}
                >
                  First access to new places.
                </div>
                <div style={{ fontSize: "15px", marginTop: "6px" }}>
                  Join The Scentimentalist Society for new scents, Scent Stories
                  and pickup dates.
                </div>
              </div>
              <form
                style={{
                  flex: "1 1 360px",
                  minWidth: "0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="nl-name"
                  style={{ position: "absolute", left: "-9999px" }}
                >
                  Your name
                </label>
                <input
                  id="nl-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  style={{
                    flex: "1 1 150px",
                    minWidth: "0",
                    minHeight: "48px",
                    padding: "0 16px",
                    background: "transparent",
                    border: "1px solid #7A746C",
                    borderRadius: "2px",
                    color: "#F4F8F5",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
                <label
                  htmlFor="nl-email"
                  style={{ position: "absolute", left: "-9999px" }}
                >
                  Email address
                </label>
                <input
                  id="nl-email"
                  type="email"
                  placeholder="Email address"
                  style={{
                    flex: "1 1 200px",
                    minWidth: "0",
                    minHeight: "48px",
                    padding: "0 16px",
                    background: "transparent",
                    border: "1px solid #7A746C",
                    borderRadius: "2px",
                    color: "#F4F8F5",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
                <button type="button" className="btn">
                  Subscribe
                </button>
              </form>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
              <div
                style={{
                  flex: "2 1 260px",
                  minWidth: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div className="fLogo"><img src="/logo-light.png" alt="Ajer Haus" /></div>
                <div style={{ fontSize: "15px", maxWidth: "320px" }}>
                  A Melbourne fragrance house exploring memory, place and scent.
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a
                    href={v.homeHref}
                    aria-label="Instagram"
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "1px solid #7A746C",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9CBCD"
                      strokeWidth="1.6"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="4.5"></rect>
                      <circle cx="12" cy="12" r="3.6"></circle>
                      <circle
                        cx="16.8"
                        cy="7.2"
                        r="0.8"
                        fill="#C9CBCD"
                      ></circle>
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com/@ajerhaus"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "1px solid #7A746C",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9CBCD"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 4v10.5a3.6 3.6 0 11-3.6-3.6"></path>
                      <path d="M14 4c.3 2.6 2 4.2 4.8 4.4"></path>
                    </svg>
                  </a>
                  
                </div>
              </div>
              {v.foot.map((col, col__i) => (
                <React.Fragment key={col__i}>
                  <div
                    style={{
                      flex: "1 1 150px",
                      minWidth: "0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      fontSize: "15px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "#F4F8F5",
                        fontWeight: "600",
                      }}
                    >
                      {col.title}
                    </div>
                    {col.links.map((l, l__i) => (
                      <React.Fragment key={l__i}>
                        <a
                          href={l.href}
                          onClick={l.click}
                          style={{ color: "#C9CBCD", textDecoration: "none" }}
                        >
                          {l.label}
                        </a>
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div
              style={{
                borderTop: "1px solid #4A4C50",
                paddingTop: "24px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "12px",
                fontSize: "13px",
              }}
            >
              <div>
                We acknowledge the Wurundjeri people of the Kulin Nation, the traditional custodians of this land on which we work. We pay our respects to their Elders, past and present, and recognise their creativity and connection to this unceded land.
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <span>© 2026 Ajer Haus</span>
                <a href={v.homeHref} style={{ color: "#C9CBCD" }}>
                  Terms
                </a>
                <a href={v.homeHref} style={{ color: "#C9CBCD" }}>
                  Privacy
                </a>
                
              </div>
            </div>
          </div>
        </footer>
        
        {v.contactOpen && (
          <>
            <div
              style={{
                position: "fixed",
                left: "0",
                top: "0",
                right: "0",
                bottom: "0",
                zIndex: "210",
                background: "rgba(31,27,24,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                boxSizing: "border-box",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "17px",
                lineHeight: "1.55",
                color: "#1F1B18",
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Contact Ajer Haus"
                style={{
                  width: "100%",
                  maxWidth: "560px",
                  maxHeight: "100%",
                  overflowY: "auto",
                  background: "#FBFAF7",
                  border: "1.5px solid #1F1B18",
                  borderRadius: "6px",
                  padding: "28px",
                  boxSizing: "border-box",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <button
                  onClick={v.closeOv}
                  aria-label="Close contact form"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    width: "44px",
                    height: "44px",
                    border: "0",
                    background: "transparent",
                    color: "#C4361F",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
                <div
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.34em",
                    textTransform: "uppercase",
                    color: "#C4361F",
                    fontWeight: "600",
                  }}
                >
                  Contact
                </div>
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "'Bodoni Moda', serif",
                    fontWeight: "700",
                    fontSize: "34px",
                    lineHeight: "1.08",
                  }}
                >
                  Say hello.
                </h2>
                {v.notSent && (
                  <>
                    <form
                      onSubmit={v.sendMsg}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div style={{ color: "#5C564E", fontSize: "15px" }}>
                        hello@ajerhaus.com · We reply within 2–3 business days
                      </div>
                      <label
                        htmlFor="ct-name"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        Name
                      </label>
                      <input
                        id="ct-name"
                        type="text"
                        autoComplete="name"
                        style={{
                          minHeight: "48px",
                          padding: "0 14px",
                          border: "1px solid #1F1B18",
                          borderRadius: "2px",
                          background: "#fff",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: "16px",
                          boxSizing: "border-box",
                        }}
                      />
                      <label
                        htmlFor="ct-email"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        Email
                      </label>
                      <input
                        id="ct-email"
                        type="email"
                        autoComplete="email"
                        style={{
                          minHeight: "48px",
                          padding: "0 14px",
                          border: "1px solid #1F1B18",
                          borderRadius: "2px",
                          background: "#fff",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: "16px",
                          boxSizing: "border-box",
                        }}
                      />
                      <label
                        htmlFor="ct-topic"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        What is it about?
                      </label>
                      <select
                        id="ct-topic"
                        style={{
                          minHeight: "48px",
                          padding: "0 10px",
                          border: "1px solid #1F1B18",
                          borderRadius: "2px",
                          background: "#fff",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: "16px",
                          boxSizing: "border-box",
                        }}
                      >
                        <option>An order</option>
                        <option>Delivery or pickup</option>
                        <option>Corporate gifting</option>
                        <option>Scent Story events</option>
                        <option>Something else</option>
                      </select>
                      <label
                        htmlFor="ct-msg"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        Message
                      </label>
                      <textarea
                        id="ct-msg"
                        rows="4"
                        style={{
                          padding: "12px 14px",
                          border: "1px solid #1F1B18",
                          borderRadius: "2px",
                          background: "#fff",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: "16px",
                          boxSizing: "border-box",
                          resize: "vertical",
                        }}
                      ></textarea>
                      <div>
                        <button
                          type="submit"
                          style={{
                            minHeight: "48px",
                            padding: "0 26px",
                            background: "#EE5340",
                            color: "#1F1B18",
                            border: "0",
                            borderRadius: "2px",
                            fontFamily: "'Josefin Sans', sans-serif",
                            fontWeight: "600",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          Send message
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {v.sent && (
                  <>
                    <div
                      aria-live="polite"
                      style={{
                        padding: "18px",
                        border: "1.5px solid #1F1B18",
                        borderRadius: "2px",
                        background: "rgba(246,220,208,0.6)",
                      }}
                    >
                      <span style={{ fontWeight: "700" }}>Thank you.</span>
                      {" Your message is on its way. We reply within 2–3 business days."}
                    </div>
                    <div>
                      <button
                        onClick={v.closeOv}
                        style={{
                          minHeight: "48px",
                          padding: "0 26px",
                          background: "transparent",
                          color: "#C4361F",
                          border: "1.5px solid #EE5340",
                          borderRadius: "2px",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontWeight: "600",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

Component.prototype.render = function () {
  return view(this.renderVals());
};

export default Component;
