import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PLACES } from '../data/places.js';
import { ING } from '../data/ingredients.js';
import Tin from './Tin.jsx';
import {
  LANDMARK_ART, TreeArt, RockArt, CloudArt, BuildingArt, PinArt,
} from './mapArt.jsx';

/* ---------------------------------------------------------------
   The Scent Map: a miniature, tilted landscape of Melbourne.
   - The ground is a 1600 x 1200 plane tilted with CSS 3D.
   - Landmarks, trees and buildings are upright "billboards" that
     counter-rotate so they always face the viewer.
   - Drag to pan, Shift + drag (or the buttons) to rotate, the
     buttons / Ctrl + scroll / pinch to zoom.
   --------------------------------------------------------------- */

const W = 1600;
const H = 1200;
const RIVER = [[1650, 300], [1500, 345], [1380, 305], [1260, 365], [1140, 435], [1020, 470], [900, 445], [790, 470], [700, 540], [645, 620], [615, 720], [610, 810], [600, 900], [606, 960]];
const COAST = [[-20, 905], [160, 885], [300, 930], [450, 900], [560, 918], [620, 965], [800, 1012], [1000, 992], [1200, 935], [1400, 962], [1620, 925]];

function spline(pts) {
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    segs.push([p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]);
  }
  return segs;
}
const pathOf = (segs) => 'M' + segs[0][0].join(' ') + segs.map((s) => `C${s[1].join(' ')} ${s[2].join(' ')} ${s[3].join(' ')}`).join('');
function sample(segs, n = 10) {
  const out = [];
  segs.forEach((s) => {
    for (let k = 0; k < n; k++) {
      const t = k / n, u = 1 - t;
      out.push([
        u * u * u * s[0][0] + 3 * u * u * t * s[1][0] + 3 * u * t * t * s[2][0] + t * t * t * s[3][0],
        u * u * u * s[0][1] + 3 * u * u * t * s[1][1] + 3 * u * t * t * s[2][1] + t * t * t * s[3][1],
      ]);
    }
  });
  return out;
}
const RIVER_SEGS = spline(RIVER);
const COAST_SEGS = spline(COAST);
const RIVER_D = pathOf(RIVER_SEGS);
const COAST_D = pathOf(COAST_SEGS);
const RIVER_PTS = sample(RIVER_SEGS);
const COAST_PTS = sample(COAST_SEGS);
const coastY = (x) => {
  for (let i = 0; i < COAST_PTS.length - 1; i++) {
    const a = COAST_PTS[i], b = COAST_PTS[i + 1];
    if (x >= a[0] && x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0] || 1);
  }
  return 900;
};
const riverDist = (x, y) => RIVER_PTS.reduce((m, p) => Math.min(m, Math.hypot(p[0] - x, p[1] - y)), 1e9);
const nearestRiver = (x) => {
  let best = 0;
  RIVER_PTS.forEach((p, i) => { if (Math.abs(p[0] - x) < Math.abs(RIVER_PTS[best][0] - x)) best = i; });
  const a = RIVER_PTS[Math.max(0, best - 1)], b = RIVER_PTS[Math.min(RIVER_PTS.length - 1, best + 1)];
  return { x: RIVER_PTS[best][0], y: RIVER_PTS[best][1], ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
};
const BRIDGES = [1020, 700, 1380].map(nearestRiver);

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TREE_COLOURS = ['#8DB8A5', '#9CC4A0', '#7FAE98', '#A8C79A', '#B7D0A2', '#86B7B0'];
const CBD = { cx: 800, cy: 320, ang: -8 };

function scenery() {
  const r = rng(7);
  const keepAway = (x, y, d) => PLACES.every((p) => Math.hypot(p.x - x, p.y - y) > d);
  const inCbd = (x, y) => x > 600 && x < 1010 && y > 180 && y < 440;
  const trees = [];
  for (let i = 0; i < 400 && trees.length < 62; i++) {
    const x = 50 + r() * (W - 100), y = 50 + r() * (H - 100);
    if (y > coastY(x) - 26 || riverDist(x, y) < 40 || !keepAway(x, y, 95) || inCbd(x, y)) continue;
    trees.push({ x, y, s: 0.75 + r() * 0.6, c: TREE_COLOURS[Math.floor(r() * TREE_COLOURS.length)] });
  }
  const rocks = [];
  for (let i = 0; i < 200 && rocks.length < 14; i++) {
    const x = 60 + r() * (W - 120), y = 60 + r() * (H - 120);
    if (y > coastY(x) - 20 || riverDist(x, y) < 36 || !keepAway(x, y, 90) || inCbd(x, y)) continue;
    rocks.push({ x, y, s: 0.8 + r() * 0.9, c: r() > 0.5 ? '#BCD3DE' : '#C9D8C8' });
  }
  const blds = [];
  const a = (CBD.ang * Math.PI) / 180;
  const palette = ['#F1E2C8', '#E8D9BF', '#DCE6D2', '#E6DDEB', '#F3D9C9'];
  for (let cx = 0; cx < 6; cx++) {
    for (let cy = 0; cy < 4; cy++) {
      const lx = -150 + cx * 60 + 26, ly = -100 + cy * 46 + 18;
      const x = CBD.cx + lx * Math.cos(a) - ly * Math.sin(a);
      const y = CBD.cy + lx * Math.sin(a) + ly * Math.cos(a);
      if (!keepAway(x, y, 78) || r() < 0.3) continue;
      blds.push({ x, y, w: 20 + Math.floor(r() * 8), h: 22 + Math.floor(r() * 44), c: palette[Math.floor(r() * palette.length)] });
    }
  }
  return { trees, rocks, blds };
}

const CLOUDS = [
  { y: 200, h: 340, d: 170, delay: -20, s: 0.8 },
  { y: 760, h: 380, d: 210, delay: -110, s: 0.9 },
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function Up({ x, y, h = 0, s = 1, className = '', children }) {
  return (
    <div className={'smUp ' + className} style={{ '--x': x + 'px', '--y': y + 'px', '--h': h + 'px', '--s': s }}>
      {children}
    </div>
  );
}

export default function ScentMap() {
  const [rot, setRot] = useState(-24);
  const [tilt, setTilt] = useState(55);
  const [m, setM] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [anim, setAnim] = useState(false);
  const [sel, setSel] = useState(-1);
  const [hov, setHov] = useState(-1);
  const [lit, setLit] = useState(false);
  const [mode, setMode] = useState('idle'); // idle | drop | form | thanks
  const [pending, setPending] = useState(null);
  const [sugg, setSugg] = useState([]);
  const [form, setForm] = useState({ name: '', memory: '', email: '' });
  const [eoi, setEoi] = useState({});
  const [wc, setWc] = useState(1440);
  const stage = useRef(null);
  const gest = useRef({ pts: new Map(), moved: 0, suppress: false, d0: 0, m0: 1 });
  const live = useRef({ rot, m });
  live.current = { rot, m };

  const { trees, rocks, blds } = useMemo(scenery, []);
  const base = clamp(wc / 2150, 0.34, 0.9);
  const scale = base * m;
  const wide = wc > 900;
  const P = sel >= 0 ? PLACES[sel] : null;
  const isPre = !!P && P.status === 'preorder';
  const open = sel >= 0 || mode === 'form' || mode === 'thanks';

  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setWc(el.clientWidth || 1440));
    ro.observe(el);
    setWc(el.clientWidth || 1440);
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setAnim(false);
      const f = Math.exp(-e.deltaY * 0.0025);
      setM((v) => { const nv = clamp(v * f, 0.7, 2.6); setPan((p) => ({ x: (p.x * nv) / v, y: (p.y * nv) / v })); return nv; });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { ro.disconnect(); el.removeEventListener('wheel', onWheel); };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeAll(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toScreen = (x, y, r, t) => {
    const a = (r * Math.PI) / 180;
    const dx = x - W / 2, dy = y - H / 2;
    return { sx: dx * Math.cos(a) - dy * Math.sin(a), sy: (dx * Math.sin(a) + dy * Math.cos(a)) * Math.cos((t * Math.PI) / 180) };
  };
  const focusOn = (x, y, mm, r = rot, t = tilt) => {
    const { sx, sy } = toScreen(x, y, r, t);
    const sc = base * mm;
    setAnim(true);
    setM(mm);
    setPan({ x: -sx * sc + (wide ? -200 : 0), y: -sy * sc + (wide ? 0 : -110) });
  };
  const choose = (i) => {
    setSel(i); setLit(false); setMode('idle'); setPending(null);
    focusOn(PLACES[i].x, PLACES[i].y, wide ? 1.7 : 1.35);
    try { window.localStorage.setItem('ajerSel', String(i)); } catch (err) { /* ignore */ }
  };
  const closeAll = () => {
    setSel(-1); setMode('idle'); setPending(null);
    setAnim(true); setM(1); setPan({ x: 0, y: 0 });
  };
  const rotateBy = (d) => {
    const r = rot + d;
    setRot(r); setAnim(true);
    if (sel >= 0) focusOn(PLACES[sel].x, PLACES[sel].y, m, r, tilt);
  };
  const zoomBy = (f) => {
    setAnim(true);
    setM((v) => { const nv = clamp(v * f, 0.7, 2.6); setPan((p) => ({ x: (p.x * nv) / v, y: (p.y * nv) / v })); return nv; });
  };
  const cycleTilt = () => {
    const t = tilt === 55 ? 28 : tilt === 28 ? 0 : 55;
    setTilt(t); setAnim(true);
    if (sel >= 0) focusOn(PLACES[sel].x, PLACES[sel].y, m, rot, t);
  };
  const reset = () => { setRot(-24); setTilt(55); setSel(-1); setMode('idle'); setPending(null); setAnim(true); setM(1); setPan({ x: 0, y: 0 }); };

  /* pointer gestures */
  const onMove = (e) => {
    const g = gest.current;
    const prev = g.pts.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
    g.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    g.moved += Math.abs(dx) + Math.abs(dy);
    if (g.pts.size >= 2) {
      const [a, b] = [...g.pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.d0) setM(clamp((g.m0 * d) / g.d0, 0.7, 2.6));
    } else if (g.moved > 6) {
      if (g.shift) setRot((r) => r + dx * 0.35);
      else setPan((p) => ({ x: clamp(p.x + dx, -1100, 1100), y: clamp(p.y + dy, -800, 800) }));
    }
  };
  const onUp = (e) => {
    const g = gest.current;
    g.pts.delete(e.pointerId);
    g.d0 = 0;
    if (g.pts.size === 0) {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (g.moved > 6) { g.suppress = true; setTimeout(() => { g.suppress = false; }, 60); }
    }
  };
  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('.smUI') || e.target.closest('.smPanel')) return;
    const g = gest.current;
    setAnim(false);
    if (g.pts.size === 0) { g.moved = 0; g.shift = e.shiftKey; }
    g.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (g.pts.size === 2) { const [a, b] = [...g.pts.values()]; g.d0 = Math.hypot(a.x - b.x, a.y - b.y); g.m0 = live.current.m; }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const dropPin = (e) => {
    if (mode !== 'drop' || gest.current.suppress) return;
    const x = e.nativeEvent.offsetX, y = e.nativeEvent.offsetY;
    setPending({ x, y }); setMode('form'); setSel(-1);
    focusOn(x, y, wide ? 1.4 : 1.2);
  };
  const submitSuggestion = (e) => {
    e.preventDefault();
    const s = { ...pending, ...form };
    setSugg((l) => [...l, s]);
    // TODO: send `s` to the Ajer Haus backend (suggestions endpoint).
    try { console.info('Place suggestion', s); } catch (err) { /* ignore */ }
    setMode('thanks');
  };

  const dim = (i) => i === hov || i === sel;
  const trail = (p, i) => {
    const s = PLACES[0];
    const mx = (s.x + p.x) / 2 + (i % 2 ? 60 : -60), my = (s.y + p.y) / 2 - 40;
    return `M${s.x} ${s.y} Q${mx} ${my} ${p.x} ${p.y}`;
  };

  return (
    <section id="map" className="smSec" aria-labelledby="smTitle">
      <div className="wrap smHead">
        <div className="eyebrow">The Scent Map</div>
        <h2 id="smTitle" className="smTitle">Where does a memory <span>live?</span></h2>
        <p>Seven places, seven scents. Shrine of Remembrance is open for pre-order now. The rest are on their way. Drag to explore, zoom in, turn the map, or drop a pin where we should go next.</p>
        <ul className="smLegend" aria-label="Map key">
          <li><i className="k pre" /> Open for pre-order</li>
          <li><i className="k soon" /> Coming soon</li>
          <li><i className="k you" /> Your suggestions</li>
        </ul>
      </div>

      <div className={'smStage' + (mode === 'drop' ? ' dropping' : '')} ref={stage} onPointerDown={onDown}>
        <div className="smSky" aria-hidden="true" />
        <div className={'smCam' + (anim ? ' anim' : '')} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}>
          <div className="smPlane" style={{ '--rot': rot + 'deg', '--tilt': tilt + 'deg', width: W, height: H }}>
            <div className="smSlab shadow" aria-hidden="true" />
            {[18, 15, 12, 9, 6, 3].map((d, i) => (
              <div key={d} className="smSlab" aria-hidden="true" style={{ '--d': d, background: ['#B9A878', '#C2B183', '#CABA8D', '#D2C296', '#DACB9F', '#E2D4A8'][i] }} />
            ))}
            <svg className="smGround" viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Illustrated miniature map of Melbourne: the Yarra river, Port Phillip Bay and seven candle places">
              <defs>
                <clipPath id="smClip"><rect width={W} height={H} rx="70" /></clipPath>
                <pattern id="smWave" width="34" height="14" patternUnits="userSpaceOnUse"><path d="M0 7Q8.5 0 17 7T34 7" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.5" /></pattern>
                <radialGradient id="smHill"><stop offset="0" stopColor="#F7F5CF" /><stop offset="1" stopColor="#F7F5CF" stopOpacity="0" /></radialGradient>
                <radialGradient id="smGlow"><stop offset="0" stopColor="#FFB347" stopOpacity="0.7" /><stop offset="1" stopColor="#FFB347" stopOpacity="0" /></radialGradient>
              </defs>
              <g clipPath="url(#smClip)">
                <rect width={W} height={H} fill="#E4EBBE" />
                {[[300, 300, 380, 230], [1250, 220, 360, 200], [1130, 640, 420, 240], [380, 600, 300, 200], [960, 820, 380, 150]].map(([x, y, rx, ry], i) => (
                  <g key={i}>
                    <ellipse cx={x + 8} cy={y + 14} rx={rx} ry={ry} fill="#CFD99F" />
                    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#EBF0C6" />
                    <ellipse cx={x - 20} cy={y - 16} rx={rx * 0.7} ry={ry * 0.7} fill="url(#smHill)" />
                  </g>
                ))}
                {/* parks */}
                <ellipse cx="540" cy="380" rx="86" ry="52" fill="#BFDDB0" />
                <ellipse cx="1180" cy="540" rx="110" ry="60" fill="#BFDDB0" />
                <ellipse cx="400" cy="720" rx="100" ry="58" fill="#C6E2B6" />
                <ellipse cx="1430" cy="720" rx="90" ry="54" fill="#C6E2B6" />
                {/* the Hoddle grid */}
                <g transform={`rotate(${CBD.ang} ${CBD.cx} ${CBD.cy})`}>
                  <rect x="635" y="205" width="330" height="230" rx="14" fill="#EFE3C4" />
                  {Array.from({ length: 6 }).map((_, cx) => Array.from({ length: 4 }).map((__, cy) => (
                    <rect key={cx + '-' + cy} x={650 + cx * 54} y={218 + cy * 52} width="44" height="42" rx="5" fill="#F7EFD8" />
                  )))}
                </g>
                {/* bay */}
                <path d={COAST_D + ' L1620 1220 L-20 1220Z'} fill="#EBD9A8" stroke="#EBD9A8" strokeWidth="46" strokeLinejoin="round" />
                <path d={COAST_D + ' L1620 1220 L-20 1220Z'} fill="#9FD0DC" />
                <path d={COAST_D + ' L1620 1220 L-20 1220Z'} fill="url(#smWave)" />
                <path d={COAST_D} fill="none" stroke="#fff" strokeWidth="5" opacity="0.7" />
                <text x="900" y="1100" fontFamily="Josefin Sans, sans-serif" fontSize="22" letterSpacing="14" fill="#4F86A2" opacity="0.8" textAnchor="middle">PORT PHILLIP BAY</text>
                {/* river */}
                <path d={RIVER_D} fill="none" stroke="#EBD9A8" strokeWidth="64" strokeLinecap="round" />
                <path d={RIVER_D} fill="none" stroke="#7DB6CF" strokeWidth="46" strokeLinecap="round" />
                <path d={RIVER_D} fill="none" stroke="#A9D3E3" strokeWidth="8" strokeLinecap="round" strokeDasharray="30 22" />
                <text x="1210" y="332" fontFamily="Josefin Sans, sans-serif" fontSize="15" letterSpacing="9" fill="#4F86A2" opacity="0.85" transform="rotate(-26 1210 332)">BIRRARUNG · YARRA</text>
                {BRIDGES.map((b, i) => (
                  <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.ang + 90})`}>
                    <rect x="-44" y="-9" width="88" height="18" rx="3" fill="#D7B78A" />
                    {[-32, -20, -8, 4, 16, 28].map((x) => <line key={x} x1={x} y1="-9" x2={x} y2="9" stroke="#B8966A" strokeWidth="1.4" />)}
                  </g>
                ))}
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <animateMotion dur={60 + i * 18 + 's'} begin={-i * 21 + 's'} repeatCount="indefinite" rotate="auto" path={RIVER_D} />
                    <ellipse cx="0" cy="0" rx="12" ry="4.4" fill="#F7EFD8" stroke="#1F1B18" strokeWidth="1" />
                    <path d="M-2 0L-2 -0.1" stroke="#EE5340" strokeWidth="3" />
                  </g>
                ))}
                {/* roads and tram lines */}
                <path d="M-20 560Q300 520 560 600T1000 650T1640 600" fill="none" stroke="#F7EFD8" strokeWidth="16" strokeLinecap="round" opacity="0.9" />
                <path d="M-20 560Q300 520 560 600T1000 650T1640 600" fill="none" stroke="#EE5340" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
                <path d="M1000 650Q1120 760 1180 880" fill="none" stroke="#F7EFD8" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
                <path d="M150 940Q80 880 -20 850" fill="none" stroke="#F7EFD8" strokeWidth="12" strokeLinecap="round" />
                {/* scent trails (foreshadowing) */}
                {PLACES.slice(1).map((p, i) => (
                  <path key={p.id} d={trail(p, i)} fill="none" stroke={i + 1 === sel ? '#EE5340' : '#1F1B18'} strokeWidth={i + 1 === sel ? 3 : 2} strokeDasharray="2 10" strokeLinecap="round" opacity={i + 1 === sel ? 0.9 : 0.3} />
                ))}
                {/* plinths */}
                {PLACES.map((p, i) => {
                  const big = i === 0;
                  const r = big ? 104 : 72;
                  return (
                    <g key={p.id}>
                      <circle cx={p.x + 5} cy={p.y + 8} r={r + 4} fill="#8A7A45" opacity="0.18" />
                      {big && <circle className="smPulse" cx={p.x} cy={p.y} r={r + 10} fill="none" stroke="#EE5340" strokeWidth="3" />}
                      <circle cx={p.x} cy={p.y} r={r} fill="#F4ECD6" stroke="#D9CFB2" strokeWidth="2" />
                      <circle cx={p.x} cy={p.y} r={r - 18} fill="#FBF5E4" />
                      {i === sel && <circle cx={p.x} cy={p.y} r={r + 4} fill="none" stroke="#EE5340" strokeWidth="4" />}
                      {big && lit && <circle cx={p.x} cy={p.y} r="170" fill="url(#smGlow)" />}
                    </g>
                  );
                })}
                {pending && <circle cx={pending.x} cy={pending.y} r="34" fill="#F4ECD6" stroke="#EE5340" strokeWidth="3" strokeDasharray="4 6" />}
                {sugg.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r="30" fill="#F4ECD6" stroke="#D9CFB2" strokeWidth="2" />)}
              </g>
            </svg>
            <div className={'smHit' + (mode === 'drop' ? ' on' : '')} onClick={dropPin} />

            {/* upright pieces */}
            {rocks.map((r, i) => <Up key={'r' + i} x={r.x} y={r.y} s={r.s}><div className="smArt"><RockArt c={r.c} /></div></Up>)}
            {trees.map((t, i) => <Up key={'t' + i} x={t.x} y={t.y} s={t.s}><div className="smArt"><TreeArt c={t.c} /></div></Up>)}
            {blds.map((b, i) => <Up key={'b' + i} x={b.x} y={b.y}><div className="smArt"><BuildingArt w={b.w} h={b.h} c={b.c} /></div></Up>)}

            {PLACES.map((p, i) => {
              const Art = LANDMARK_ART[i];
              const pre = p.status === 'preorder';
              return (
                <Up key={p.id} x={p.x} y={p.y} s={pre ? 1.5 : 1.15} className={dim(i) ? 'hot' : ''}>
                  <button
                    type="button"
                    className={'smBtn' + (pre ? ' pre' : ' soon') + (dim(i) ? ' on' : '')}
                    aria-label={`${p.name}, ${pre ? 'open for pre-order' : 'coming soon'}. Open details`}
                    onClick={() => { if (!gest.current.suppress) choose(i); }}
                    onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)}
                    onFocus={() => setHov(i)} onBlur={() => setHov(-1)}
                  >
                    <span className="smArt">
                      <span className={'smTag' + (pre ? ' pre' : '')}>{pre ? 'Pre-order · $' + p.price : dim(i) ? 'Coming soon' : '?'}</span>
                      <span className="smArtInner"><Art lit={pre && lit} /></span>
                    </span>
                  </button>
                </Up>
              );
            })}
            {sugg.map((s, i) => (
              <Up key={'s' + i} x={s.x} y={s.y}><div className="smArt smYou"><span className="smTag">{s.name || 'Your pin'}</span><PinArt done /></div></Up>
            ))}
            {pending && <Up x={pending.x} y={pending.y}><div className="smArt smYou"><PinArt /></div></Up>}
            {CLOUDS.map((c, i) => (
              <div key={'c' + i} className="smCloud" style={{ '--y': c.y + 'px', '--h': c.h + 'px', '--s': c.s, animationDuration: c.d + 's', animationDelay: c.delay + 's' }}>
                <div className="smArt"><CloudArt /></div>
              </div>
            ))}
          </div>
        </div>

        {mode === 'drop' && (
          <div className="smBanner smUI" role="status">
            Click anywhere on the map to drop a pin
            <button type="button" onClick={() => setMode('idle')}>Cancel</button>
          </div>
        )}

        <div className="smUI smTools" role="group" aria-label="Map controls">
          <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in">＋</button>
          <button type="button" onClick={() => zoomBy(0.8)} aria-label="Zoom out">－</button>
          <button type="button" onClick={() => rotateBy(-45)} aria-label="Rotate the map left"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" /></svg></button>
          <button type="button" onClick={() => rotateBy(45)} aria-label="Rotate the map right"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-3-6.2M20 4v4h-4" /></svg></button>
          <button type="button" onClick={cycleTilt} aria-label="Change the viewing angle" className="txt">{tilt === 55 ? '3D' : tilt === 28 ? 'Low' : '2D'}</button>
          <button type="button" onClick={reset} aria-label="Reset the map" className="txt">Reset</button>
        </div>
        <div className="smUI smCompass" aria-hidden="true" title="North">
          <svg viewBox="0 0 60 60" width="54" height="54" style={{ transform: `rotate(${rot}deg)`, transition: 'transform .9s cubic-bezier(.6,0,.25,1)' }}>
            <circle cx="30" cy="30" r="27" fill="#FBFAF7" stroke="#1F1B18" strokeWidth="1" />
            <path d="M30 8L35 30L30 52L25 30Z" fill="#F4ECD6" stroke="#1F1B18" strokeWidth="1" />
            <path d="M30 8L35 30L25 30Z" fill="#EE5340" stroke="#1F1B18" strokeWidth="1" />
            <text x="30" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1F1B18" fontFamily="Josefin Sans, sans-serif" transform="translate(0 -14)">N</text>
          </svg>
        </div>
        <div className="smUI smSuggest">
          <button type="button" className="btn2" onClick={() => { setSel(-1); setMode(mode === 'drop' ? 'idle' : 'drop'); setPending(null); }}>
            {mode === 'drop' ? 'Cancel pin' : 'Suggest a place'}
          </button>
        </div>
        <p className="smHint" aria-hidden="true">Drag to move · Shift + drag to turn · Ctrl + scroll to zoom</p>

        <aside className={'smPanel' + (open ? ' open' : '')} aria-hidden={!open} aria-live="polite">
          <button type="button" className="smClose" onClick={closeAll} aria-label="Close panel" tabIndex={open ? 0 : -1}>✕</button>
          {P && (
            <div className="smBody" key={P.id}>
              <div className="eyebrow">{isPre ? 'Open for pre-order' : 'Coming soon'}</div>
              <h3>{P.name}</h3>
              {isPre ? (
                <>
                  <div className="smMeta">{P.place}</div>
                  <p className="smMemory">{P.memory}</p>
                  <div className="smNotes">{P.notes}{P.sub ? ', ' + P.sub : ''}</div>
                  <div className="smIng" aria-label="Ingredients">
                    {P.items.map((k) => (
                      <figure key={k}>
                        <svg viewBox="0 0 80 96" width="64" height="76" aria-hidden="true" style={{ overflow: 'visible' }}>
                          <circle cx="47" cy="47" r="30" fill={P.fg} />
                          <path d={ING[k].d} fill="none" stroke="#1F1B18" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          <path d={ING[k].e || 'M0 0'} fill="none" stroke="#1F1B18" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <figcaption>{ING[k].n}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="smCandle">
                    <Tin p={P} lit={lit} />
                    <button type="button" className="btn2" aria-pressed={lit} onClick={() => setLit((v) => !v)}>{lit ? 'Snuff the candle' : 'Light the candle'}</button>
                  </div>
                  <div className="smCta">
                    <a className="btn" href="/collection#order">Pre-order · ${P.price} AUD</a>
                    <a className="tlink" href="/collection" onClick={() => { try { window.localStorage.setItem('ajerSel', '0'); } catch (err) { /* ignore */ } }}>See the candle →</a>
                  </div>
                </>
              ) : (
                <>
                  <p className="smTeaser">{P.teaser}</p>
                  <div className="smNotes">First note: {P.notes.split(' · ')[0]} · ··· · ···</div>
                  <div className="smMeta">The rest is a secret until it is poured.</div>
                  {eoi[P.id] ? (
                    <p className="smThanks" role="status">Thank you. We will write when {P.name} is ready.</p>
                  ) : (
                    <form className="smForm" onSubmit={(e) => { e.preventDefault(); setEoi((o) => ({ ...o, [P.id]: true })); }}>
                      <label htmlFor="smEoi">Tell me when it is poured</label>
                      <div className="row">
                        <input id="smEoi" type="email" required placeholder="Email address" autoComplete="email" />
                        <button className="btn" type="submit">Notify me</button>
                      </div>
                    </form>
                  )}
                  <button type="button" className="tlink" onClick={() => choose(0)}>Shrine of Remembrance is open now →</button>
                </>
              )}
            </div>
          )}
          {!P && mode === 'form' && (
            <form className="smBody smForm big" onSubmit={submitSuggestion}>
              <div className="eyebrow">Suggest a place</div>
              <h3>Where should we go next?</h3>
              <p className="smMemory">Your pin is on the map. Tell us what makes this place worth a candle.</p>
              <label htmlFor="sgName">Place</label>
              <input id="sgName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Queen Victoria Market" />
              <label htmlFor="sgMem">The memory</label>
              <textarea id="sgMem" rows="4" value={form.memory} onChange={(e) => setForm({ ...form, memory: e.target.value })} placeholder="What does it smell like? What do you remember?" />
              <label htmlFor="sgMail">Email (optional)</label>
              <input id="sgMail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="So we can tell you if it happens" />
              <div className="smCta"><button className="btn" type="submit">Send suggestion</button><button type="button" className="tlink" onClick={() => { setPending(null); setMode('drop'); }}>Move the pin</button></div>
            </form>
          )}
          {!P && mode === 'thanks' && (
            <div className="smBody">
              <div className="eyebrow">Thank you</div>
              <h3>Pin dropped.</h3>
              <p className="smMemory">We read every suggestion. If it becomes a candle, you will hear it from us first.</p>
              <div className="smCta">
                <button type="button" className="btn2" onClick={() => { setForm({ name: '', memory: '', email: '' }); setMode('drop'); }}>Drop another</button>
                <button type="button" className="tlink" onClick={closeAll}>Back to the map</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
