// Line-art ingredient library (shared). Each entry: d/e are SVG path data, n is the caption.
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
    const side = i % 2 === 0 ? 1 : -1;
    d += circ(x + side * 9, y - 2, 6.5 - i * 0.4);
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

export const ING = {
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
    e: "",
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
    e: "",
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
