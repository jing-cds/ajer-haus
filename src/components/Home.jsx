import React from "react";

import { ING } from "../data/ingredients.js";
import ScentMap from "./ScentMapLine.jsx";
import StoriesHero from "./StoriesHero.jsx";
import HomeOrderPanel from "./HomeOrderPanel.jsx";

const f = (n) => Math.round(n * 10) / 10;

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

const PREORDER_OPEN = true; // flip to false to hide the Pre-order button and page link
const PAGE = "main";

const PLACES = [
  {
    name: "Shrine of Remembrance",
    x: 738,
    y: 424,
    side: "r",
    bg: "#2B1D8F",
    fg: "#F6DCD0",
    leaf: "#D95A25",
    wash: "#DAD5F2",
    live: false,
    pre: true,
    price: 26,
    place: "The Shrine, St Kilda Rd, Melbourne CBD",
    memory: "A quiet hour on the steps, with something sweet on the air.",
    notes: "Native frangipani · oud · sweet · woody",
    sub: "with sandalwood & cedar",
    items: ["frangipani", "oud", "sandalwood", "cedar"],
  },
  {
    name: "Love Affair at Hosier",
    x: 655,
    y: 350,
    side: "l",
    bg: "#C4325A",
    fg: "#F9D648",
    leaf: "#5A1A12",
    wash: "#F4CDD8",
    live: false,
    place: "Hosier Lane, Melbourne CBD",
    memory: "A lane, a late night, smoke still in your jacket.",
    notes: "Woodsmoke · tobacco · ashy · mature",
    sub: "with aged whiskey",
    items: ["woodsmoke", "tobacco", "whiskey"],
  },
  {
    name: "Melbourne Morning",
    x: 690,
    y: 236,
    side: "r",
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
    x: 210,
    y: 480,
    side: "r",
    bg: "#4A6E66",
    fg: "#F2AAA0",
    leaf: "#D95A25",
    wash: "#CFE0DB",
    live: false,
    place: "Great Ocean Road, Victoria",
    memory: "Windows down, salt on everything.",
    notes: "Sea salt · sage · breezy",
    sub: "with jasmine & eucalyptus",
    items: ["salt", "sage", "eucalyptus", "jasmine"],
  },
  {
    name: "Night Out at Fed Square",
    x: 772,
    y: 362,
    side: "r",
    bg: "#C3B2EE",
    fg: "#F8EBB8",
    leaf: "#5A1A12",
    wash: "#E4DBF7",
    live: false,
    place: "Federation Square, Melbourne CBD",
    memory: "Lime in the glass and the square still humming.",
    notes: "Lime · coconut · zesty · creamy",
    sub: "",
    items: ["lime", "coconut"],
  },
  {
    name: "It's About to Rain",
    x: 1150,
    y: 232,
    side: "r",
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
    x: 1030,
    y: 328,
    side: "r",
    bg: "#E8B85A",
    fg: "#D95A25",
    leaf: "#5A1A12",
    wash: "#F6E1B6",
    live: false,
    place: "The Yarra, Melbourne",
    memory: "Eucalyptus on the breeze as the river goes gold.",
    notes: "Eucalyptus · fern · fresh · crisp",
    sub: "with herbs & sweet wildflower",
    items: ["eucalyptus", "fern", "wildflower"],
  },
];
PLACES[0].pre = PREORDER_OPEN;
const stat = (p) =>
  p.live ? "Available now" : p.pre ? "Pre-order" : "Coming soon";
const OFFS = [
  [-118, -112],
  [40, 6],
  [-118, 6],
  [40, -112],
];
const PAGE_BG = "#F4F8F5";
const VIEW_WIDE = { x: 0, y: 0, w: 1440, h: 760 };
const VIEW_NARROW = { x: 480, y: 130, w: 570, h: 620 };
const FLOATERS = [
  { k: "frangipani", x: 150, y: 120, w: 110, rot: -8, c: "bob", p: 0 },
  { k: "eucalyptus", x: 360, y: 300, w: 96, rot: 10, c: "bob2", p: 3 },
  { k: "wattle", x: 470, y: 90, w: 90, rot: 6, c: "bob2", p: 2 },
  { k: "lime", x: 1280, y: 330, w: 92, rot: -6, c: "bob", p: 4 },
  { k: "fern", x: 1010, y: 90, w: 96, rot: 8, c: "bob2", p: 6 },
  { k: "raindrops", x: 1300, y: 520, w: 84, rot: 4, c: "bob", p: 5 },
  { k: "sandalwood", x: 560, y: 560, w: 84, rot: -4, c: "bob", p: 1 },
];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sel: -1,
      last: 0,
      lit: false,
      drawn: false,
      w: 1440,
      hide: false,
      menu: false,
      faqOpen: false,
      contactOpen: false,
      sent: false,
      fq: 0,
      slide: 0,
      play: true,
      pre: PREORDER_OPEN,
    };
    this.onKey = this.onKey.bind(this);
    this._y = 0;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  componentDidMount() {
    this.onResize();
    window.addEventListener("scroll", this.onScroll, true);
    window.addEventListener("keydown", this.onKey);
    if (PAGE === "philosophy")
      this._tm = setInterval(() => {
        if (this.state.play)
          this.setState({ slide: (this.state.slide + 1) % 3 });
      }, 5500);
    window.addEventListener("resize", this.onResize);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, true);
    window.removeEventListener("keydown", this.onKey);
    if (this._tm) clearInterval(this._tm);
    window.removeEventListener("resize", this.onResize);
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
  onResize() {
    const w = window.innerWidth || 1440;
    if (w !== this.state.w) this.setState({ w: w });
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
  choose(i) {
    this.setState({ sel: i, last: i, lit: false, drawn: false });
    setTimeout(() => this.setState({ drawn: true }), 900);
  }
  remember(i) {
    try {
      window.localStorage.setItem("ajerSel", String(i));
    } catch (err) {}
  }
  railBy(dir) {
    const el = document.getElementById("prodRail");
    if (el)
      el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }
  renderVals() {
    const st = this.state;
    PLACES[0].pre = st.pre;
    const sel = st.sel;
    const lit = st.lit;
    const drawn = st.drawn;
    const narrow = st.w <= 820;
    const V = narrow ? VIEW_NARROW : VIEW_WIDE;
    const S = sel < 0 ? 1 : narrow ? 1.8 : 2;
    const fx = narrow ? V.x + V.w / 2 : 560;
    const fy = V.y + V.h / 2;
    const cur = PLACES[st.last];
    const tx = sel < 0 ? 0 : fx - S * cur.x;
    const ty = sel < 0 ? 0 : fy - S * cur.y;
    const px = (ux) => f(((ux - V.x) / V.w) * 100) + "%";
    const py = (uy) => f(((uy - V.y) / V.h) * 100) + "%";
    const wash = sel < 0 ? PAGE_BG : cur.wash;
    const fade = (dir) =>
      "linear-gradient(" + dir + ", " + wash + ", " + wash + "00)";

    const pins = PLACES.map((p, i) => {
      const ux = tx + S * p.x;
      const uy = ty + S * p.y;
      const vx = (ux - V.x) / V.w;
      const left = p.side === "l" ? sel < 0 : vx > 0.7;
      return {
        left: px(ux),
        top: py(uy),
        label: "Visit " + p.name + ", " + stat(p).toLowerCase(),
        tag: p.name + (p.pre ? " · Pre-order" : ""),
        bg: p.bg,
        dash: p.live || p.pre ? "0" : "3 2",
        k: i === sel ? "scale(1.3)" : "scale(1)",
        tagLeft: left ? "auto" : "30px",
        tagRight: left ? "30px" : "auto",
        tagOp: sel < 0 || i === sel ? 1 : 0.45,
        pick: () => this.choose(i),
      };
    });

    const ingredients =
      sel >= 0
        ? cur.items.map((key, j) => {
            const o = OFFS[j];
            const ing = ING[key];
            return {
              left: px(tx + S * (cur.x + o[0])),
              top: py(ty + S * (cur.y + o[1])),
              width: f(((80 * S) / V.w) * 100) + "%",
              d: ing.d,
              e: ing.e || "M0 0",
              name: ing.n,
              disc: cur.fg,
              discOp: drawn ? 1 : 0,
              off: drawn ? 0 : 1,
              delay: j * 0.25 + "s",
            };
          })
        : [];

    const floaters = FLOATERS.map((fl) => {
      const ing = ING[fl.k];
      return {
        left: px(fl.x),
        top: py(fl.y),
        width: f((fl.w / V.w) * 100) + "%",
        rot: fl.rot + "deg",
        cls: fl.c,
        op: sel < 0 && fl.x >= V.x && fl.x <= V.x + V.w - fl.w ? 1 : 0,
        d: ing.d,
        e: ing.e || "M0 0",
        name: ing.n,
        disc: PLACES[fl.p].fg,
      };
    });

    const isMain = PAGE === "main";
    const orb = (a, R) => [
      (50 + R * Math.cos((a * Math.PI) / 180)).toFixed(1) + "%",
      (50 + R * Math.sin((a * Math.PI) / 180)).toFixed(1) + "%",
    ];
    const wIng = [
      { k: "frangipani", a: -55, R: 45, w: "22%", p: 0 },
      { k: "lime", a: 65, R: 34, w: "18%", p: 4 },
      { k: "fern", a: 185, R: 45, w: "18%", p: 6 },
    ].map((w) => ({
      ox: orb(w.a, w.R)[0],
      oy: orb(w.a, w.R)[1],
      ow: w.w,
      d: ING[w.k].d,
      e: ING[w.k].e || "M0 0",
      name: ING[w.k].n,
      disc: PLACES[w.p].fg,
    }));

    return {
      hdrY: st.hide && !st.menu ? "-100%" : "0",
      menu: st.menu,
      toggleMenu: () => this.setState({ menu: !this.state.menu }),
      menuCls: st.menu ? "mnav open" : "mnav",
      ...this.ovVals(),
      vb: V.x + " " + V.y + " " + V.w + " " + V.h,
      mapT: "translate(" + f(tx) + "px, " + f(ty) + "px) scale(" + S + ")",
      wash: wash,
      fadeT: fade("to bottom"),
      fadeB: fade("to top"),
      fadeL: fade("to right"),
      fadeR: fade("to left"),
      pins: pins,
      ingredients: ingredients,
      floaters: floaters,
      welcomeIng: wIng,
      panelCls: sel >= 0 ? "mapPanel open" : "mapPanel",
      places: PLACES.map((p, i) => ({
        name: p.name,
        bg: p.bg,
        pick: () => this.choose(i),
      })),
      surprise: () => {
        let i;
        do {
          i = Math.floor(Math.random() * PLACES.length);
        } while (i === this.state.sel);
        this.choose(i);
      },
      back: () => this.setState({ sel: -1, lit: false, drawn: false }),
      goSel: () => this.remember(this.state.last),
      lit: lit,
      toggleLit: () => this.setState({ lit: !this.state.lit }),
      toggleLabel: lit ? "Blow it out" : "Light it",
      toggleBorder: lit ? "#F6DCD0" : "#EE5340",
      toggleColor: lit ? "#F6DCD0" : "#C4361F",
      candleBg: lit ? "#1B1815" : "#ECEBE6",
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
      preTrack: st.pre ? "#EE5340" : "#7A746C",
      preKnob: st.pre ? "20px" : "2px",
      preLabel: st.pre ? "On" : "Off",
      preItems: PLACES.filter((p) => p.pre).map((p) => ({
        name: p.name,
        place: p.place,
        notes: p.notes,
        bg: p.bg,
        fg: p.fg,
        leaf: p.leaf,
        wash: p.wash,
        memory: p.memory,
      })),
      preSteps: [
        {
          n: "1",
          t: "Pay in full today",
          d: "You are charged when you order. Early-bird pricing may apply.",
        },
        {
          n: "2",
          t: "Ships together",
          d: "Mixed carts ship in one parcel on the pre-order dispatch date. Want the in-stock candles sooner? Order them separately.",
        },
        {
          n: "3",
          t: "Delivery or pickup",
          d: "Delivered across Victoria, or collected at the first announced Melbourne CBD pickup after dispatch.",
        },
        {
          n: "4",
          t: "We keep you posted",
          d: "An email when it ships, and again if the date moves.",
        },
      ],
      preTerms: [
        {
          k: "Free delivery",
          v: "Pre-order items count toward the $75 free-delivery threshold. [Confirm: before or after discounts.]",
        },
        { k: "Dispatch date", v: "[FIRST BATCH DISPATCH DATE OR WINDOW]" },
        { k: "Quantity caps", v: "[CAPS PER PRODUCT, IF ANY]" },
        {
          k: "Cancellation & refunds",
          v: "[TO BE WRITTEN, reviewed and linked here before the first pre-order opens, including what happens if the dispatch date slips.]",
        },
      ],
      noPre: !PLACES.some((p) => p.pre),
      soonItems: PLACES.filter((p) => !p.live && !p.pre).map((p) => ({
        name: p.name,
        bg: p.bg,
        fg: p.fg,
        leaf: p.leaf,
        wash: p.wash,
        place: p.place,
      })),
      slideAHidden: st.slide !== 0,
      slideBHidden: st.slide !== 1,
      slideCHidden: st.slide !== 2,
      slideAHidden2: st.slide === 0,
      dotA: st.slide === 0 ? "#EE5340" : "transparent",
      dotB: st.slide === 1 ? "#EE5340" : "transparent",
      dotC: st.slide === 2 ? "#EE5340" : "transparent",
      ig0d: ING.frangipani.d,
      ig0e: ING.frangipani.e,
      ig1d: ING.oud.d,
      ig1e: ING.oud.e,
      ig2d: ING.sandalwood.d,
      ig2e: ING.sandalwood.e,
      ig3d: ING.cedar.d,
      ig3e: ING.cedar.e,
      slide: st.slide,
      slideA: st.slide === 0 ? 1 : 0,
      slideB: st.slide === 1 ? 1 : 0,
      slideC: st.slide === 2 ? 1 : 0,
      slidePlay: st.play,
      playLabel: st.play ? "Pause slideshow" : "Play slideshow",
      togglePlay: () => this.setState({ play: !this.state.play }),
      goSlide0: () => this.setState({ slide: 0 }),
      goSlide1: () => this.setState({ slide: 1 }),
      goSlide2: () => this.setState({ slide: 2 }),
      prevSlide: () => this.setState({ slide: (this.state.slide + 2) % 3 }),
      nextSlide: () => this.setState({ slide: (this.state.slide + 1) % 3 }),
      dStatus: stat(cur),
      dBadgeBg: cur.live || cur.pre ? "#EE5340" : "transparent",
      dBadgeFg: "#1F1B18",
      railPrev: () => this.railBy(-1),
      railNext: () => this.railBy(1),
      shelf: PLACES.map((p, i) => ({
        name: p.name,
        bg: p.bg,
        fg: p.fg,
        leaf: p.leaf,
        wash: p.wash,
        notes: p.notes,
        status: stat(p),
        price: p.price ? "$" + p.price + " AUD" : "Price to come",
        badgeBg: p.live || p.pre ? "#EE5340" : "#FBFAF7",
        badgeFg: "#1F1B18",
        aria: p.name + ", " + stat(p).toLowerCase() + ". View product page",
        id: ING[p.items[0]].d,
        ie: ING[p.items[0]].e || "M0 0",
        go: () => this.remember(i),
      })),
      journal: [
        {
          tag: "Upcoming",
          wash: "#E4DBF7",
          disc: PLACES[4].fg,
          d: ING.lime.d,
          e: ING.lime.e,
        },
        {
          tag: "Past story",
          wash: "#F6E1B6",
          disc: PLACES[6].fg,
          d: ING.fern.d,
          e: ING.fern.e,
        },
        {
          tag: "Past story",
          wash: "#DAD5F2",
          disc: PLACES[0].fg,
          d: ING.frangipani.d,
          e: ING.frangipani.e,
        },
      ],
      pillars: [
        {
          title: "Memory",
          note: "it starts with a moment",
          wash: "#F4CDD8",
          disc: PLACES[1].fg,
          d: ING.woodsmoke.d,
          e: "M0 0",
          text: "[ONE PARAGRAPH: how a smell brings a moment back, and why each scent starts from a memory rather than a recipe.]",
        },
        {
          title: "Place",
          note: "somewhere real",
          wash: "#CFE0DB",
          disc: PLACES[3].fg,
          d: ING.salt.d,
          e: ING.salt.e,
          text: '[ONE PARAGRAPH: Naarm and Melbourne, the seven places, and why a name like "Love Affair at Hosier" reads as a small story.]',
        },
        {
          title: "Scent",
          note: "what it is made of",
          wash: "#DAD5F2",
          disc: PLACES[0].fg,
          d: ING.frangipani.d,
          e: ING.frangipani.e,
          text: "[ONE PARAGRAPH: how notes are chosen and drawn, from native frangipani and oud to wattleseed and eucalyptus.]",
        },
      ],
      uses: [
        { t: "Client gifts", d: "[Thank-yous and renewals]", bg: PLACES[0].bg },
        {
          t: "Welcome gifts",
          d: "[Onboarding and new starters]",
          bg: PLACES[1].bg,
        },
        {
          t: "Events",
          d: "[Launches, offsites and dinners]",
          bg: PLACES[3].bg,
        },
        {
          t: "Thank-yous",
          d: "[Teams, partners, suppliers]",
          bg: PLACES[6].bg,
        },
      ],
      opts: [
        { t: "Your message", d: "A custom card in every box." },
        {
          t: "Your label",
          d: "[Custom label or lid sticker. MOQ and lead time to confirm.]",
        },
        { t: "Branded packaging", d: "[Options to confirm.]" },
        {
          t: "Many addresses",
          d: "Delivered to multiple addresses across Victoria.",
        },
      ],
      process: [
        { n: "1", t: "Tell us", d: "Occasion, quantity and date." },
        { n: "2", t: "Quote", d: "[Quote turnaround to confirm.]" },
        { n: "3", t: "Proof", d: "[Card and label proof, if customised.]" },
        { n: "4", t: "Delivered", d: "[Lead time to confirm.]" },
      ],
      sets: [
        {
          name: "The Trio",
          text: "[Three tins, three places. Contents to confirm.]",
          href: "/shop",
          wash: "#E4DBF7",
          disc: PLACES[0].bg,
          c1: PLACES[0].bg,
          c2: PLACES[4].bg,
          c3: PLACES[6].bg,
          o2: 1,
          o3: 1,
        },
        {
          name: "Pick your 3",
          text: "[Choose any three scents. Mechanic to confirm.]",
          href: "/shop",
          wash: "#F4CDD8",
          disc: PLACES[1].bg,
          c1: PLACES[1].bg,
          c2: PLACES[3].bg,
          c3: PLACES[5].bg,
          o2: 1,
          o3: 1,
        },
        {
          name: "The Pair",
          text: "[Two tins in a gift box. Contents to confirm.]",
          href: "/shop",
          wash: "#F6E1B6",
          disc: PLACES[6].bg,
          c1: PLACES[6].bg,
          c2: PLACES[2].bg,
          c3: PLACES[2].bg,
          o2: 1,
          o3: 0,
        },
      ],
      eventIng: ["frangipani", "fern", "lime"].map((k, i) => ({
        d: ING[k].d,
        e: ING[k].e || "M0 0",
        name: ING[k].n,
        disc: PLACES[[0, 6, 4][i]].fg,
      })),
      giftTins: [
        {
          left: "2%",
          bottom: "8%",
          rot: -8,
          bg: PLACES[0].bg,
          fg: PLACES[0].fg,
          leaf: PLACES[0].leaf,
        },
        {
          left: "28%",
          bottom: "0%",
          rot: 2,
          bg: PLACES[4].bg,
          fg: PLACES[4].fg,
          leaf: PLACES[4].leaf,
        },
        {
          left: "54%",
          bottom: "10%",
          rot: 9,
          bg: PLACES[6].bg,
          fg: PLACES[6].fg,
          leaf: PLACES[6].leaf,
        },
      ],
    };
  }
}

function view(v) {
  return (
    <>
      <div
        id="top"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          background: "#F4F8F5",
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
          {" Free delivery in Victoria over $75 · Or collect in Melbourne CBD "}
        </div>
        <div className="hdrwrap" style={{ transform: `translateY(${v.hdrY})` }}>
          <header>
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
                <a href="/shop">Shop</a>
                <a href="/events">Events</a>
                <a href="/gifting">Gifting</a>
              </nav>
              <a className="logo" href="/" aria-label="Ajer Haus, home"><img src="/logo.png" alt="Ajer Haus" /></a>
              <div className="navR">
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
              <a href="/shop">Shop</a>
              <a href="/events">Events</a>
              <a href="/gifting">Gifting</a>
              {v.preOn && (
                <>
                  <a href="/collection#order">Pre-order</a>
                </>
              )}
            </nav>
          </header>
        </div>
        <section
          id="welcome"
          style={{
            position: "relative",
            background:
              "linear-gradient(180deg, #C6E1DC 0%, #DDEBE3 45%, #FFFFFF 100%)",
          }}
        >
          <div className="orbit" aria-hidden="true">
            <svg className="orbRings" viewBox="0 0 600 600">
              <circle
                cx="300"
                cy="300"
                r="270"
                fill="none"
                stroke="#EE5340"
                strokeWidth="1.1"
              ></circle>
              <circle
                cx="300"
                cy="300"
                r="205"
                fill="none"
                stroke="#1F1B18"
                strokeWidth="0.8"
                strokeDasharray="1 6"
                strokeLinecap="round"
              ></circle>
              <circle
                cx="300"
                cy="300"
                r="140"
                fill="none"
                stroke="#1F1B18"
                strokeWidth="0.8"
              ></circle>
              <circle
                cx="300"
                cy="300"
                r="75"
                fill="#C9CBCD"
                opacity="0.35"
              ></circle>
              <circle cx="300" cy="300" r="6" fill="#EE5340"></circle>
              <path
                d="M-40 640L640 -40"
                fill="none"
                stroke="#1F1B18"
                strokeWidth="1.1"
                strokeDasharray="2 7"
                strokeLinecap="round"
              ></path>
            </svg>
            <div className="orbSpin">
              {v.welcomeIng.map((w, w__i) => (
                <React.Fragment key={w__i}>
                  <div
                    className="orbItem"
                    style={{ left: w.ox, top: w.oy, width: w.ow }}
                  >
                    <div className="orbCounter">
                      <svg
                        viewBox="0 0 80 96"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          overflow: "visible",
                        }}
                      >
                        <circle cx="47" cy="47" r="30" fill={w.disc}></circle>
                        <path
                          d={w.d}
                          fill="none"
                          stroke="#1F1B18"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d={w.e}
                          fill="none"
                          stroke="#1F1B18"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <text
                          x="40"
                          y="92"
                          textAnchor="middle"
                          fontFamily="Bodoni Moda, serif"
                          fontStyle="italic"
                          fontSize="11"
                          fill="#1F1B18"
                        >
                          {w.name}
                        </text>
                      </svg>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="gifStrip">
            <img
              src="/hero.gif"
              width="500"
              height="299"
              alt="Slow footage of red, white and blue flowers in a bouquet"
            />
          </div>
          <div
            className="wrap"
            style={{
              position: "relative",
              paddingTop: "48px",
              paddingBottom: "72px",
            }}
          >
            
            <div
              style={{
                maxWidth: "760px",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              <div className="eyebrow">Memory · Place · Scent</div>
              <h1
                style={{
                  margin: "0",
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: "700",
                  fontSize: "clamp(40px, 6.2vw, 88px)",
                  lineHeight: "1.02",
                  letterSpacing: "-0.01em",
                }}
              >
                {"Welcome to "}
                <span style={{ fontStyle: "italic", fontWeight: "500" }}>
                  The Scentimentalist Society.
                </span>
              </h1>
              <p
                style={{
                  margin: "0",
                  maxWidth: "600px",
                  fontSize: "19px",
                  color: "#3A352F",
                }}
              >
                A Melbourne scent house for people who keep places in their
                pockets. Every Ajer Haus candle is hand-poured in Naarm in
                soy-coconut wax and made as a memory of somewhere real. We
                deliver across Victoria, free over $75, or you can collect in
                Melbourne CBD.
              </p>
              <div
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontStyle: "italic",
                  fontWeight: "500",
                  fontSize: "19px",
                  color: "#C4361F",
                  lineHeight: "1.1",
                }}
              >
                free delivery over $75 · collect in Melbourne CBD ↓
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <a className="btn" href="#map">
                  Explore the Scent Map
                </a>
                <a className="btn2" href="#collection">
                  Shop the collection
                </a>
              </div>
            </div>
          </div>
        </section>
        <ScentMap />
        <section
          id="collection"
          style={{
            position: "relative",
            background: "#FFFFFF",
          }}
        >
          <div
            className="wrap"
            style={{
              paddingTop: "72px",
              paddingBottom: "64px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <div className="eyebrow">Candles · Soy-coconut wax</div>
              <h2
                style={{
                  margin: "0",
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: "700",
                  fontSize: "clamp(34px, 4vw, 48px)",
                  lineHeight: "1.05",
                }}
              >
                The Place Collection
              </h2>
              <p style={{ margin: 0, color: "#3A352F" }}>One place is open for pre-order. The rest are on their way.</p>
            </div>
            <div style={{ position: "relative" }}>
              
              
              <div
                id="prodRail"
                className="rail"
                aria-label="The Place Collection, scroll sideways for more"
              >
                {v.shelf.filter((x) => x.status !== "Coming soon").map((p, p__i) => (
                  <React.Fragment key={p__i}>
                    <a
                      className="pcard"
                      href="/collection"
                      onClick={p.go}
                      aria-label={p.aria}
                    >
                      <div className="pimg" style={{ background: p.wash }}>
                        <div
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "44%",
                            width: "66%",
                            aspectRatio: "1",
                            borderRadius: "50%",
                            background: p.bg,
                            transform: "translate(-50%, -50%)",
                          }}
                        ></div>
                        <svg
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: "0",
                            top: "0",
                            width: "100%",
                            height: "100%",
                          }}
                          preserveAspectRatio="none"
                          viewBox="0 0 100 100"
                        >
                          <line
                            x1="-4"
                            y1="104"
                            x2="104"
                            y2="-4"
                            stroke="#1F1B18"
                            strokeWidth="1"
                            strokeDasharray="2 7"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            opacity="0.55"
                          ></line>
                        </svg>
                        <img src="/product/unlit.jpg" alt="" className="pcardPhoto" />
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 80 96"
                          className="bob"
                          style={{
                            position: "absolute",
                            right: "5%",
                            top: "4%",
                            width: "28%",
                            height: "auto",
                            overflow: "visible",
                          }}
                        >
                          <circle cx="47" cy="47" r="30" fill={p.fg}></circle>
                          <path
                            d={p.id}
                            fill="none"
                            stroke="#1F1B18"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d={p.ie}
                            fill="none"
                            stroke="#1F1B18"
                            strokeWidth="0.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span
                          style={{
                            position: "absolute",
                            left: "10px",
                            top: "10px",
                            fontSize: "11px",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontWeight: "600",
                            padding: "3px 10px",
                            border: "1px solid #1F1B18",
                            background: p.badgeBg,
                            color: p.badgeFg,
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: "14px 16px 16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          flex: "1",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.24em",
                            textTransform: "uppercase",
                            color: "#5C564E",
                            fontWeight: "600",
                          }}
                        >
                          #0126 · Candle
                        </div>
                        <div
                          style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontWeight: "700",
                            fontSize: "21px",
                            lineHeight: "1.12",
                          }}
                        >
                          {p.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "#3A352F" }}>
                          {p.notes}
                        </div>
                        <div
                          style={{
                            marginTop: "auto",
                            paddingTop: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: "8px",
                            fontSize: "14px",
                          }}
                        >
                          <span style={{ fontWeight: "600" }}>{p.price}</span>
                          <span
                            style={{
                              color: "#C4361F",
                              fontWeight: "600",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              fontSize: "12px",
                            }}
                          >
                            View product →
                          </span>
                        </div>
                      </div>
                    </a>
                  </React.Fragment>
                ))}
                <HomeOrderPanel />
              </div>
            </div>
          </div>
        </section>
        <StoriesHero />
        <section
          id="gifting"
          style={{ position: "relative", marginTop: "-20px" }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "96px 32px 88px",
              boxSizing: "border-box",
              display: "flex",
              flexWrap: "wrap",
              gap: "56px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: "1 1 380px",
                minWidth: "0",
                position: "relative",
                height: "340px",
              }}
            >
              {v.giftTins.map((g, g__i) => (
                <React.Fragment key={g__i}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 220"
                    style={{
                      position: "absolute",
                      left: g.left,
                      bottom: g.bottom,
                      width: "42%",
                      height: "auto",
                      transform: `rotate(${g.rot}deg)`,
                    }}
                  >
                    <ellipse
                      cx="100"
                      cy="205"
                      rx="74"
                      ry="7"
                      fill="#000000"
                      opacity="0.12"
                    ></ellipse>
                    <path
                      d="M30 70C28 6 172 6 170 70"
                      fill="none"
                      stroke="#4A2F24"
                      strokeWidth="6"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M24 70Q24 62 32 62L168 62Q176 62 176 70L166 168Q164 194 140 198L60 198Q36 194 34 168Z"
                      fill="url(#silver)"
                    ></path>
                    <ellipse
                      cx="100"
                      cy="62"
                      rx="76"
                      ry="11"
                      fill="#C9CCCF"
                    ></ellipse>
                    <ellipse
                      cx="100"
                      cy="63"
                      rx="67"
                      ry="8"
                      fill="#F3ECDC"
                    ></ellipse>
                    <rect
                      x="49"
                      y="88"
                      width="102"
                      height="84"
                      fill={g.bg}
                    ></rect>
                    <text
                      x="56"
                      y="109"
                      fontFamily="grante, Dela Gothic One, sans-serif"
                      fontSize="17"
                      fill={g.fg}
                    >
                      A
                    </text>
                    <text
                      x="56"
                      y="126"
                      fontFamily="grante, Dela Gothic One, sans-serif"
                      fontSize="17"
                      fill={g.fg}
                    >
                      J
                    </text>
                    <text
                      x="56"
                      y="143"
                      fontFamily="grante, Dela Gothic One, sans-serif"
                      fontSize="17"
                      fill={g.fg}
                    >
                      E
                    </text>
                    <text
                      x="56"
                      y="160"
                      fontFamily="grante, Dela Gothic One, sans-serif"
                      fontSize="17"
                      fill={g.fg}
                    >
                      R
                    </text>
                    <rect
                      x="80"
                      y="94"
                      width="64"
                      height="52"
                      fill="none"
                      stroke={g.fg}
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    ></rect>
                    <path
                      d="M118 104C110 114 110 128 118 136C126 128 126 114 118 104Z"
                      fill={g.leaf}
                    ></path>
                  </svg>
                </React.Fragment>
              ))}
              <div
                style={{
                  position: "absolute",
                  right: "4%",
                  top: "0",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "#EE5340",
                  color: "#1F1B18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  lineHeight: "1.5",
                  transform: "rotate(8deg)",
                }}
              >
                Gifts for
                <br />
                {"clients &"}
                <br />
                teams
              </div>
            </div>
            <div
              style={{
                flex: "1 1 380px",
                minWidth: "0",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: "#C4361F",
                  fontWeight: "600",
                }}
              >
                Corporate gifting
              </div>
              <h2
                style={{
                  margin: "0",
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: "700",
                  fontSize: "44px",
                  lineHeight: "1.06",
                }}
              >
                Client gifts with a Melbourne memory inside.
              </h2>
              <p style={{ margin: "0", color: "#3A352F" }}>
                For welcome gifts, thank-yous and events. Tell us the occasion
                and we will put a quote together.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    borderTop: "1.5px solid #1F1B18",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bodoni Moda', serif",
                      fontWeight: "700",
                      fontSize: "19px",
                    }}
                  >
                    Your message
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "14px",
                      color: "#3A352F",
                    }}
                  >
                    A custom card in every box.
                  </p>
                </div>
                <div
                  style={{
                    borderTop: "1.5px solid #1F1B18",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bodoni Moda', serif",
                      fontWeight: "700",
                      fontSize: "19px",
                    }}
                  >
                    Your label
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "14px",
                      color: "#3A352F",
                    }}
                  >
                    [Custom label or lid sticker, MOQ TBC]
                  </p>
                </div>
                <div
                  style={{
                    borderTop: "1.5px solid #1F1B18",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bodoni Moda', serif",
                      fontWeight: "700",
                      fontSize: "19px",
                    }}
                  >
                    Many addresses
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "14px",
                      color: "#3A352F",
                    }}
                  >
                    Delivered across Victoria.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <a
                  href="/gifting/corporate"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: "48px",
                    padding: "0 26px",
                    background: "#EE5340",
                    color: "#1F1B18",
                    textDecoration: "none",
                    fontWeight: "600",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontSize: "13px",
                    borderRadius: "2px",
                  }}
                >
                  Request a gifting quote
                </a>
              </div>
            </div>
          </div>
        </section>
        <footer
          style={{
            background: "#1F1B18",
            color: "#C9CBCD",
            position: "relative",
          }}
        >
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
                borderBottom: "1px solid #3F3A35",
                paddingBottom: "40px",
              }}
            >
              <div style={{ flex: "1 1 360px", minWidth: "0" }}>
                <div
                  style={{
                    fontFamily: "'Bodoni Moda', serif",
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
                  flex: "1 1 420px",
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
                  autoComplete="email"
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
                    href="https://instagram.com/ajerhaus"
                    target="_blank"
                    rel="noopener noreferrer"
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
              <div
                style={{
                  flex: "1 1 140px",
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
                  Shop
                </div>
                <a
                  href="/shop"
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  The Collection
                </a>
                {v.preOn && (
                  <>
                    <a
                      href="/collection#order"
                      style={{ color: "#C9CBCD", textDecoration: "none" }}
                    >
                      Pre-order
                    </a>
                  </>
                )}
              </div>
              <div
                style={{
                  flex: "1 1 140px",
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
                  Explore
                </div>
                <a
                  href="/events"
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  Scent Stories
                </a>
                <a
                  href="/philosophy"
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  Our Philosophy
                </a>
                <a
                  href="/gifting/corporate"
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  Corporate gifting
                </a>
              </div>
              <div
                style={{
                  flex: "1 1 160px",
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
                  Help
                </div>
                <a
                  href="#faq"
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  FAQ
                </a>
                <a
                  href="/delivery"
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  {"Delivery, pickup & returns"}
                </a>
                <a
                  href="#top"
                  onClick={v.openContact}
                  style={{ color: "#C9CBCD", textDecoration: "none" }}
                >
                  Contact
                </a>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid #3F3A35",
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
                <a href="/terms" style={{ color: "#C9CBCD" }}>
                  Terms
                </a>
                <a href="/privacy" style={{ color: "#C9CBCD" }}>
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
