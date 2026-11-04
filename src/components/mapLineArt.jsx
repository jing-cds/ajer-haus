import React from 'react';

/* Line-art isometric helpers for the illustrated Scent Map.
   Everything is outlined in Shrine blue; each place is filled with its brand colour pair. */
export const INK = '#2C187A';
const r1 = (n) => Math.round(n * 10) / 10;
const P = ([x, y, z = 0]) => [r1((x - y) * 0.87), r1((x + y) * 0.5 - z)];
const str = (arr) => arr.map((a) => P(a).join(',')).join(' ');
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const on = (f, u, v) => lerp(lerp(f[0], f[1], u), lerp(f[3], f[2], u), v);

export const Defs = () => (
  <defs>
    <pattern id="lnHatch" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(52)">
      <line x1="0" y1="0" x2="0" y2="4.5" stroke={INK} strokeWidth="0.9" />
    </pattern>
    <pattern id="lnHatchLt" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(52)">
      <line x1="0" y1="0" x2="0" y2="4.5" stroke="#fff" strokeWidth="0.9" opacity=".55" />
    </pattern>
    <pattern id="lnDots" width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r=".9" fill={INK} opacity=".25" />
    </pattern>
  </defs>
);

const sw = { stroke: INK, strokeLinejoin: 'round', strokeLinecap: 'round' };

/* a 3D polygon (list of [x,y,z]) */
const Poly = ({ v, fill, hatch, w = 1.6 }) => (
  <>
    <polygon points={str(v)} fill={fill} {...sw} strokeWidth={w} />
    {hatch && <polygon points={str(v)} fill={`url(#${hatch})`} stroke="none" />}
  </>
);

/* windows laid out across a face */
const Wins = ({ f, nc, nr, fill = '#fff', pad = 0.18 }) => {
  const out = [];
  for (let i = 0; i < nc; i++) {
    for (let j = 0; j < nr; j++) {
      const u0 = (i + pad + 0.1) / nc, u1 = (i + 1 - pad - 0.1) / nc, v0 = (j + 0.28) / nr, v1 = (j + 0.72) / nr;
      out.push(
        <polygon key={i + '-' + j} points={str([on(f, u0, v0), on(f, u1, v0), on(f, u1, v1), on(f, u0, v1)])} fill={fill} stroke={INK} strokeWidth="0.7" />,
      );
    }
  }
  return <>{out}</>;
};

/* an isometric box. c = { l, r, t } colours; hatch on the left face */
export const Box = ({ x, y, z = 0, w, d, h, c, hatch = 'lnHatch', win, wc = 2, wr = 3, cols = 0, sw: w2 = 1.6 }) => {
  const L = [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]];
  const R = [[x + w, y + d, z], [x + w, y, z], [x + w, y, z + h], [x + w, y + d, z + h]];
  const T = [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
  const lines = [];
  for (let k = 1; k < cols; k++) {
    [L, R].forEach((f, fi) => {
      const a = P(on(f, k / cols, 0.04)), b = P(on(f, k / cols, 0.96));
      lines.push(<line key={fi + '-' + k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth="1.1" />);
    });
  }
  return (
    <g>
      <Poly v={L} fill={c.l} hatch={hatch} w={w2} />
      <Poly v={R} fill={c.r} w={w2} />
      <Poly v={T} fill={c.t} w={w2} />
      {win && <Wins f={L} nc={wc} nr={wr} fill={win} />}
      {win && <Wins f={R} nc={wc} nr={wr} fill={win} />}
      {lines}
    </g>
  );
};

const Tree = ({ x = 0, y = 0, r = 9, fill = '#DDEBE3' }) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1="0" y1="0" x2="0" y2={-r * 0.9} {...sw} strokeWidth="1.5" />
    <circle cx="0" cy={-r * 1.6} r={r} fill={fill} {...sw} strokeWidth="1.5" />
    <path d={`M${-r * 0.55} ${-r * 1.5}q${r * 0.3} ${r * 0.7} ${r * 0.9} ${r * 0.55}`} fill="none" {...sw} strokeWidth="1" />
  </g>
);

export const Cloud = ({ x = 0, y = 0, s = 1, fill = '#fff', drops = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0C-42 0 -42 -16 -30 -17C-30 -32 -8 -34 -2 -21C6 -30 28 -26 26 -12C40 -12 40 0 28 0Z" fill={fill} {...sw} strokeWidth="1.6" />
    {drops && [-18, -4, 10, 22].map((dx, i) => (
      <line key={i} x1={dx} y1="8" x2={dx - 3} y2="17" stroke={INK} strokeWidth="1.6" strokeLinecap="round" className="smDrop" style={{ animationDelay: i * 0.25 + 's' }} />
    ))}
  </g>
);

/* ---------------- the seven landmarks (base centre = 0,0) ---------------- */

export const Shrine = ({ bg, fg }) => {
  const wall = { l: fg, r: fg, t: '#FFF4EE' };
  const roof = { l: bg, r: bg, t: '#5B47B8' };
  return (
    <g>
      <Box x={-36} y={-36} w={72} d={72} h={5} c={wall} />
      <Box x={-26} y={-26} z={5} w={52} d={52} h={26} c={wall} cols={7} />
      <Box x={-18} y={-18} z={31} w={36} d={36} h={14} c={wall} cols={5} win={bg} wc={3} wr={1} />
      <Box x={-20} y={-20} z={45} w={40} d={40} h={4} c={roof} hatch="lnHatchLt" />
      <Box x={-15} y={-15} z={49} w={30} d={30} h={4} c={roof} hatch="lnHatchLt" />
      <Box x={-11} y={-11} z={53} w={22} d={22} h={4} c={roof} hatch="lnHatchLt" />
      <Box x={-7} y={-7} z={57} w={14} d={14} h={4} c={roof} hatch="lnHatchLt" />
      <Box x={-4} y={-4} z={61} w={8} d={8} h={5} c={roof} hatch="lnHatchLt" />
      <Box x={-1.5} y={-1.5} z={66} w={3} d={3} h={9} c={roof} hatch="lnHatchLt" sw={1.2} />
    </g>
  );
};

export const Hosier = ({ bg, fg }) => {
  const a = { l: bg, r: bg, t: fg };
  const b = { l: '#fff', r: '#F6E4EA', t: fg };
  const zig = [on([[-30, 18, 0], [4, 18, 0], [4, 18, 46], [-30, 18, 46]], 0.1, 0.35), on([[-30, 18, 0], [4, 18, 0], [4, 18, 46], [-30, 18, 46]], 0.35, 0.7), on([[-30, 18, 0], [4, 18, 0], [4, 18, 46], [-30, 18, 46]], 0.55, 0.3), on([[-30, 18, 0], [4, 18, 0], [4, 18, 46], [-30, 18, 46]], 0.85, 0.75)];
  return (
    <g>
      <Box x={-36} y={-18} w={34} d={36} h={50} c={a} win={fg} wc={2} wr={4} />
      <Box x={8} y={-20} w={34} d={36} h={38} c={b} win={bg} wc={2} wr={3} />
      <polyline points={zig.map((q) => P(q).join(',')).join(' ')} fill="none" stroke={fg} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={zig.map((q) => P(q).join(',')).join(' ')} fill="none" stroke={INK} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-4 30l12 6" stroke={INK} strokeWidth="1.2" strokeDasharray="2 3" />
    </g>
  );
};

export const Market = ({ bg, fg }) => {
  const wall = { l: fg, r: fg, t: '#FFF4EE' };
  const ridgeL = [-48, 0, 26], ridgeR = [48, 0, 26];
  return (
    <g>
      <circle cx="30" cy="-52" r="15" fill="#FFF4EE" {...sw} strokeWidth="1.5" />
      {[...Array(9)].map((_, i) => { const a = (-Math.PI * i) / 8; return <line key={i} x1={30 + Math.cos(a) * 18} y1={-52 + Math.sin(a) * 18} x2={30 + Math.cos(a) * 25} y2={-52 + Math.sin(a) * 25} {...sw} strokeWidth="1.5" />; })}
      <Box x={-48} y={-17} w={96} d={34} h={16} c={wall} cols={9} />
      <Poly v={[[-48, 17, 16], [48, 17, 16], [48, 0, 28], [-48, 0, 28]]} fill={bg} hatch="lnHatchLt" />
      <Poly v={[[48, 17, 16], [48, -17, 16], [48, 0, 28]]} fill={bg} />
      <path d={`M${P([-48, 17, 28])} L${P([48, 17, 28])}`} stroke="none" fill="none" />
      <g transform="translate(-6 28)">
        <Box x={-24} y={-6} w={48} d={12} h={11} c={{ l: bg, r: bg, t: fg }} hatch="lnHatchLt" win={fg} wc={5} wr={1} />
      </g>
      <line x1={P(ridgeL)[0]} y1={P(ridgeL)[1]} x2={P(ridgeR)[0]} y2={P(ridgeR)[1]} {...sw} strokeWidth="1.6" />
    </g>
  );
};

export const Coast = ({ bg, fg }) => (
  <g>
    <path d="M-70 4q10 -4 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" {...sw} strokeWidth="1.3" />
    <path d="M-62 14q10 -4 20 0t20 0t20 0t20 0t20 0t20 0" fill="none" {...sw} strokeWidth="1" opacity=".7" />
    {/* sea stacks */}
    <path d="M-62 0L-60 -44L-52 -62L-44 -50L-40 -20L-36 0Z" fill={fg} {...sw} strokeWidth="1.6" />
    <path d="M-62 0L-60 -44L-52 -62L-52 0Z" fill={bg} {...sw} strokeWidth="1.6" opacity=".92" />
    <path d="M-62 0L-60 -44L-52 -62L-52 0Z" fill="url(#lnHatchLt)" />
    <path d="M-30 0L-28 -30L-20 -40L-12 -30L-8 0Z" fill={fg} {...sw} strokeWidth="1.6" />
    <path d="M-30 0L-28 -30L-20 -40L-20 0Z" fill={bg} {...sw} strokeWidth="1.6" />
    <path d="M-30 0L-28 -30L-20 -40L-20 0Z" fill="url(#lnHatchLt)" />
    <path d="M-2 0L0 -52L8 -72L16 -58L18 -26L22 0Z" fill={fg} {...sw} strokeWidth="1.6" />
    <path d="M-2 0L0 -52L8 -72L8 0Z" fill={bg} {...sw} strokeWidth="1.6" />
    <path d="M-2 0L0 -52L8 -72L8 0Z" fill="url(#lnHatchLt)" />
    {/* lighthouse */}
    <g transform="translate(46 0)">
      <path d="M-11 0L-7 -52L7 -52L11 0Z" fill="#fff" {...sw} strokeWidth="1.6" />
      <path d="M-9.2 -16L9.2 -16L8 -28L-8 -28Z" fill={bg} {...sw} strokeWidth="1.2" />
      <path d="M-6.4 -40L6.4 -40L5.4 -52L-5.4 -52Z" fill={bg} {...sw} strokeWidth="1.2" />
      <rect x="-9" y="-55" width="18" height="3.5" fill={fg} {...sw} strokeWidth="1.3" />
      <rect x="-5" y="-66" width="10" height="11" fill="#FFF4EE" {...sw} strokeWidth="1.3" />
      <path d="M-7 -66L0 -75L7 -66Z" fill={bg} {...sw} strokeWidth="1.3" />
      <path d="M-5 -62L-24 -66M5 -62L24 -66" stroke={INK} strokeWidth="1.1" strokeDasharray="2 3" fill="none" />
    </g>
  </g>
);

export const Fed = ({ bg, fg }) => (
  <g>
    <Box x={-44} y={-26} w={88} d={52} h={5} c={{ l: fg, r: fg, t: '#FFF9E2' }} />
    {[
      { p: [[-34, 8], [-18, -52], [-4, 8]], f: bg },
      { p: [[-8, 8], [10, -70], [26, 8]], f: fg },
      { p: [[22, 8], [36, -44], [48, 8]], f: bg },
    ].map((s, i) => {
      const pts = s.p.map(([x, y]) => `${x},${y}`).join(' ');
      const [a, b, c] = s.p;
      const hs = [0.2, 0.4, 0.6, 0.8].map((t) => `M${r1(a[0] + (c[0] - a[0]) * t)} ${a[1]}L${r1(b[0] + (c[0] - b[0]) * (t * 0.35))} ${r1(b[1] + (c[1] - b[1]) * 0.35 * t + 8)}`);
      return (
        <g key={i} transform="translate(0 -4)">
          <polygon points={pts} fill={s.f} {...sw} strokeWidth="1.6" />
          <polygon points={`${a.join(',')} ${b.join(',')} ${[(a[0] + c[0]) / 2, a[1]].join(',')}`} fill="url(#lnHatch)" />
          {hs.map((d, k) => <path key={k} d={d} stroke={INK} strokeWidth="0.8" fill="none" opacity=".8" />)}
        </g>
      );
    })}
    <path d="M-44 12h88" stroke={INK} strokeWidth="1" strokeDasharray="2 3" transform="translate(0 6)" />
  </g>
);

export const Gardens = ({ bg, fg }) => (
  <g>
    <ellipse cx="0" cy="8" rx="46" ry="20" fill={fg} {...sw} strokeWidth="1.6" />
    <path d="M-30 8q10 -6 20 0t20 0t20 0" fill="none" {...sw} strokeWidth="1" />
    <Tree x={-52} y={6} r={13} fill={fg} />
    <Tree x={52} y={4} r={14} fill={fg} />
    <Tree x={-22} y={-14} r={11} fill={fg} />
    <Tree x={26} y={-16} r={12} fill={fg} />
    <Tree x={0} y={-24} r={10} fill={fg} />
    <Cloud x={6} y={-72} s={1.15} fill={fg} drops />
    <path d="M-44 -78q10 -8 22 -2" stroke={bg} strokeWidth="0" fill="none" />
  </g>
);

export const Dusk = ({ bg, fg }) => (
  <g>
    <path d="M-48 -4A40 40 0 0 1 32 -4Z" fill={bg} {...sw} strokeWidth="1.6" transform="translate(8 -2)" />
    {[...Array(7)].map((_, i) => { const a = Math.PI + (Math.PI * (i + 0.5)) / 7; return <line key={i} x1={-8 + Math.cos(a) * 48} y1={-6 + Math.sin(a) * 48} x2={-8 + Math.cos(a) * 60} y2={-6 + Math.sin(a) * 60} stroke={fg} strokeWidth="3" strokeLinecap="round" />; })}
    <path d="M-60 2q10 -4 20 0t20 0t20 0t20 0t20 0t20 0" fill="none" {...sw} strokeWidth="1.4" />
    <path d="M-50 11q10 -4 20 0t20 0t20 0t20 0" fill="none" {...sw} strokeWidth="1" opacity=".7" />
    {/* gum tree */}
    <g transform="translate(44 6)">
      <path d="M-3 0Q-4 -22 -1 -34Q-9 -44 -15 -48M-1 -34Q4 -42 12 -46M-2 -22Q6 -28 10 -30" fill="none" {...sw} strokeWidth="2.2" />
      <ellipse cx="-16" cy="-52" rx="14" ry="9" fill={bg} {...sw} strokeWidth="1.5" />
      <ellipse cx="12" cy="-50" rx="15" ry="9" fill={bg} {...sw} strokeWidth="1.5" />
      <ellipse cx="-2" cy="-62" rx="13" ry="9" fill={fg} {...sw} strokeWidth="1.5" />
    </g>
    {/* rowing boat */}
    <g transform="translate(-22 14)">
      <path d="M-18 -2H18L12 5H-12Z" fill="#FFF4EE" {...sw} strokeWidth="1.4" />
      <path d="M-14 -3L-26 -9M10 -3L22 -9" {...sw} strokeWidth="1.3" />
    </g>
  </g>
);

export const LANDMARKS = { shrine: Shrine, hosier: Hosier, morning: Market, ocean: Coast, fed: Fed, rain: Gardens, yarra: Dusk };

/* small generic buildings for the CBD, drawn in plan colours but outlined */
export const Block = ({ x, y, w, d, h, tint }) => (
  <g transform={`translate(${x} ${y})`}>
    <Box x={-w / 2} y={-d / 2} w={w} d={d} h={h} c={{ l: '#fff', r: tint, t: '#fff' }} sw={1.1} />
  </g>
);

export const TreeDot = Tree;
