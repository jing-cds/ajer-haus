import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PLACES } from '../data/places.js';
import { ING } from '../data/ingredients.js';
import Tin from './Tin.jsx';
import { INK, Defs, LANDMARKS, Block, TreeDot } from './mapLineArt.jsx';

/* ---------------------------------------------------------------
   The Scent Map (illustrated line version).
   A flat, hand-drawn style map of Melbourne: outlined streets and
   isometric buildings in Shrine blue, each place filled with its
   candle's colour pair. Drag to move, zoom, click a place.
   The earlier 3D tilt-and-turn version lives on at /map-3d.
--------------------------------------------------------------- */

const W = 1600, H = 1100;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const WATER = '#CFE4F0', LAND = '#FBFAF7', PARK = '#DCEBE3';

const spline = (pts) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    out.push([
      p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1],
    ]);
  }
  return 'M' + pts[0][0] + ' ' + pts[0][1] + out.map((s) => 'C' + s.map((n) => Math.round(n)).join(' ')).join('');
};
const RIVER = spline([[1640, 470], [1500, 505], [1350, 545], [1200, 585], [1040, 575], [880, 590], [720, 572], [560, 580], [420, 600], [280, 640], [140, 690], [-40, 745]]);
const BAY = 'M-10 770C110 790 250 850 320 940C375 1010 345 1065 300 1110L-10 1110Z';
const ROAD = 'M960 592C972 700 1000 800 1012 1110';

let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

const wavy = (x, y, n) => 'M' + x + ' ' + y + 'q6 -4 12 0'.repeat(1) + 't12 0'.repeat(n);

export default function ScentMapLine() {
  const stage = useRef(null);
  const svgRef = useRef(null);
  const gest = useRef({ pts: new Map(), moved: 0, suppress: false, d0: 0, m0: 1 });
  const live = useRef({});
  const [size, setSize] = useState({ w: 1440, h: 760 });
  const [m, setM] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [anim, setAnim] = useState(false);
  const [sel, setSel] = useState(-1);
  const [hov, setHov] = useState(-1);
  const [lit, setLit] = useState(false);
  const [mode, setMode] = useState('idle');
  const [pending, setPending] = useState(null);
  const [sugg, setSugg] = useState([]);
  const [form, setForm] = useState({ name: '', memory: '', email: '' });
  const [eoi, setEoi] = useState({});
  const sc = useMemo(() => scenery(), []);
  live.current = { ...live.current, m, size };

  const wide = size.w > 820;
  const S = Math.max(size.w / W, size.h / H);
  const minM = clamp(Math.min(size.w / W, size.h / H) / S, 0.5, 1);
  live.current.minM = minM;
  const ext = (mm) => ({
    x: Math.max(0, (W * S * mm - size.w) / 2),
    y: Math.max(0, (H * S * mm - size.h) / 2),
  });
  const fit = (p, mm) => { const e = ext(mm); return { x: clamp(p.x, -e.x, e.x), y: clamp(p.y, -e.y, e.y) }; };

  const P = sel >= 0 ? PLACES[sel] : null;
  const isPre = !!P && P.status === 'preorder';
  const open = sel >= 0 || mode === 'form' || mode === 'thanks';

  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 1440, h: el.clientHeight || 760 }));
    ro.observe(el);
    setSize({ w: el.clientWidth || 1440, h: el.clientHeight || 760 });
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setAnim(false);
      const f = Math.exp(-e.deltaY * 0.0025);
      setM((v) => clamp(v * f, live.current.minM, 3.2));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { ro.disconnect(); el.removeEventListener('wheel', onWheel); };
  }, []);
  const first = useRef(true);
  useEffect(() => {
    if (first.current && size.w < 820 && size.w > 0) { first.current = false; setPan(fit({ x: 0, y: -150 }, m)); return; }
    setPan((p) => fit(p, m));
  }, [m, size.w, size.h]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeAll(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const focusOn = (lx, ly, mm) => {
    const px = (lx - W / 2) * S * mm, py = (ly - H / 2) * S * mm;
    setAnim(true); setM(mm);
    const want = { x: -px + (wide ? -190 : 0), y: -py + (wide ? 0 : -90) };
    const e = { x: Math.max(0, (W * S * mm - size.w) / 2), y: Math.max(0, (H * S * mm - size.h) / 2) };
    setPan({ x: clamp(want.x, -e.x, e.x), y: clamp(want.y, -e.y, e.y) });
  };
  const choose = (i) => {
    if (gest.current.suppress) return;
    setSel(i); setLit(false); setMode('idle'); setPending(null);
    focusOn(PLACES[i].lx, PLACES[i].ly, wide ? 1.7 : 1.5);
    try { window.localStorage.setItem('ajerSel', String(i)); } catch (err) { /* ignore */ }
  };
  const closeAll = () => { setSel(-1); setMode('idle'); setPending(null); setAnim(true); setM(1); setPan({ x: 0, y: 0 }); };
  const zoomBy = (f) => { setAnim(true); setM((v) => clamp(v * f, live.current.minM, 3.2)); };
  const reset = () => { setSel(-1); setMode('idle'); setPending(null); setAnim(true); setM(1); setPan({ x: 0, y: 0 }); };

  /* drag: the map follows the cursor / finger */
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
      if (g.d0) setM(clamp((g.m0 * d) / g.d0, live.current.minM, 3.2));
    } else if (g.moved > 6) {
      setPan((p) => fit({ x: p.x + dx, y: p.y + dy }, live.current.m));
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
    if (g.pts.size === 0) g.moved = 0;
    g.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (g.pts.size === 2) { const [a, b] = [...g.pts.values()]; g.d0 = Math.hypot(a.x - b.x, a.y - b.y); g.m0 = live.current.m; }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const dropPin = (e) => {
    if (mode !== 'drop' || gest.current.suppress) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    setPending({ x, y }); setMode('form'); setSel(-1);
    focusOn(x, y, wide ? 1.6 : 1.4);
  };
  const submitSuggestion = (e) => {
    e.preventDefault();
    const s = { ...pending, ...form };
    setSugg((l) => [...l, s]);
    // TODO: send `s` to the Ajer Haus backend (suggestions endpoint).
    try { console.info('Place suggestion', s); } catch (err) { /* ignore */ }
    setMode('thanks');
  };

  const items = PLACES.map((p, i) => ({ p, i })).sort((a, b) => a.p.ly - b.p.ly);
  const roadsV = [], roadsH = [];
  for (let x = 420; x <= 1120; x += 70) roadsV.push(x);
  for (let y = 190; y <= 540; y += 52) roadsH.push(y);

  const Pin = ({ x, y, fill }) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0C-14 -16 -14 -34 0 -34C14 -34 14 -16 0 0Z" fill={fill} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="0" cy="-22" r="4.5" fill="#fff" stroke={INK} strokeWidth="1.4" />
    </g>
  );

  return (
    <section id="map" className="smSec" aria-labelledby="smTitle">
      <div className="wrap smHead">
        <div className="eyebrow">The Scent Map</div>
        <h2 id="smTitle" className="smTitle">Where does a memory <span>live?</span></h2>
        <p>Seven places, seven scents. Shrine of Remembrance is open for pre-order now. The rest are on their way. Drag to explore, zoom in, tap a place, or drop a pin where we should go next.</p>
        <ul className="smLegend" aria-label="Map key">
          <li><i className="k pre" /> Open for pre-order</li>
          <li><i className="k soon" /> Coming soon</li>
          <li><i className="k you" /> Your suggestions</li>
        </ul>
      </div>

      <div className={'smStage lmStage' + (mode === 'drop' ? ' dropping' : '')} ref={stage} onPointerDown={onDown}>
        <div className={'lmCam' + (anim ? ' anim' : '')} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${m})`, width: W * S, height: H * S }}>
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W * S} height={H * S} role="img" aria-label="Illustrated line map of Melbourne with the Yarra, Port Phillip Bay and seven candle places" onClick={dropPin}>
            <Defs />
            <clipPath id="lmClip"><rect width={W} height={H} /></clipPath>
            <g clipPath="url(#lmClip)">
              <rect width={W} height={H} fill={LAND} />
              <rect width={W} height={H} fill="url(#lnDots)" opacity=".5" />

              {/* parks */}
              <g fill={PARK} stroke={INK} strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round">
                <path d="M1060 770C1130 700 1330 690 1440 760C1540 830 1520 990 1400 1050C1290 1105 1140 1080 1090 1000C1050 940 1030 830 1060 770Z" />
                <path d="M1120 275C1150 240 1270 240 1330 270C1370 300 1330 350 1260 360C1180 365 1100 320 1120 275Z" />
                <path d="M790 118C830 85 960 82 1010 112C1030 140 990 160 920 162C850 164 770 150 790 118Z" />
              </g>

              {/* streets */}
              <g stroke={INK} strokeLinecap="round" fill="none">
                <g strokeWidth="1.2" opacity=".32">
                  {roadsV.map((x) => <path key={x} d={`M${x} 170V545`} />)}
                  {roadsH.map((y) => <path key={y} d={`M410 ${y}H1130`} />)}
                  {[640, 700].map((y) => <path key={y} d={`M600 ${y}H1120`} />)}
                  {[640, 780, 900, 1020].map((x) => <path key={x} d={`M${x} 600V740`} />)}
                  {[700, 800, 900].map((x) => <path key={x} d={`M${x} 760V1090`} opacity=".6" />)}
                  {[800, 900, 1000].map((y) => <path key={y} d={`M560 ${y}H900`} opacity=".6" />)}
                </g>
                <g strokeWidth="3.4" opacity=".55">
                  <path d="M410 545H1130" />
                  <path d="M630 170V545M910 170V545" />
                  <path d={ROAD} />
                </g>
              </g>

              {/* railway */}
              <g fill="none" strokeLinecap="butt">
                <path d="M300 520H1230" stroke={INK} strokeWidth="6" opacity=".85" />
                <path d="M300 520H1230" stroke="#fff" strokeWidth="3.4" strokeDasharray="7 7" />
              </g>

              {/* river */}
              <path d={RIVER} fill="none" stroke={INK} strokeWidth="46" strokeLinecap="round" />
              <path d={RIVER} fill="none" stroke={WATER} strokeWidth="42" strokeLinecap="round" />
              <path d={RIVER} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="10 14" opacity=".35" transform="translate(0 -6)" />

              {/* bay */}
              <path d={BAY} fill={WATER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <path d={BAY} fill="none" stroke={INK} strokeWidth="9" strokeDasharray="1 7" strokeLinecap="round" opacity=".25" transform="translate(-8 -2)" />
              {sc.waves.map((w, i) => <path key={i} d={wavy(w.x, w.y, 3)} fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" opacity=".45" />)}

              {/* labels on the ground */}
              <g fontFamily="'Josefin Sans', sans-serif" fill={INK} fontWeight="700" textAnchor="middle" stroke={LAND} strokeWidth="5" strokeLinejoin="round" paintOrder="stroke" style={{ pointerEvents: 'none' }}>
                <text x="760" y="168" fontSize="22" letterSpacing="7">MELBOURNE CBD</text>
                <text x="960" y="132" fontSize="12" letterSpacing="4" opacity=".7">CARLTON GARDENS</text>
                <text x="1230" y="268" fontSize="12" letterSpacing="4" opacity=".7">FITZROY GARDENS</text>
                <text x="860" y="508" fontSize="11" letterSpacing="3" opacity=".75">FLINDERS ST STATION</text>
                <text x="1170" y="1048" fontSize="13" letterSpacing="5" opacity=".7">ROYAL BOTANIC GARDENS</text>
                <text x="740" y="668" fontSize="12" letterSpacing="5" opacity=".7">SOUTHBANK</text>
                <text x="0" y="0" fontSize="11" letterSpacing="5" opacity=".7" transform="translate(1000 760) rotate(86)">ST KILDA RD</text>
                <text x="115" y="1070" fontSize="16" letterSpacing="6" opacity=".75">PORT PHILLIP BAY</text>
                <text x="1270" y="525" fontSize="15" fontFamily="'Bodoni Moda', serif" fontStyle="italic" fontWeight="500" letterSpacing="2" transform="rotate(-9 1270 525)">Yarra River</text>
              </g>

              {/* generic buildings, trees */}
              {sc.trees.map((t, i) => <TreeDot key={i} x={t.x} y={t.y} r={t.r} />)}
              <g opacity=".62">{sc.blocks.map((b, i) => <Block key={i} {...b} tint="#ECE8F8" />)}</g>

              {/* suggestions */}
              {sugg.map((s, i) => <g key={i}><Pin x={s.x} y={s.y} fill="#fff" /><text x={s.x} y={s.y + 16} textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="'Josefin Sans', sans-serif" fill={INK} letterSpacing="2">{(s.name || 'YOU').toUpperCase().slice(0, 18)}</text></g>)}
              {pending && <Pin x={pending.x} y={pending.y} fill="#EE5340" />}

              {/* the seven places */}
              {items.map(({ p, i }) => {
                const Art = LANDMARKS[p.id];
                const pre = p.status === 'preorder';
                const on = i === hov || i === sel;
                const scale = pre ? 1.55 : 1.2;
                const label = pre ? 'Shrine of Remembrance' : p.short;
                const tag = pre ? 'Pre-order' : 'Coming soon';
                const tw = label.length * 9.3 + 26;
                return (
                  <g key={p.id} transform={`translate(${p.lx} ${p.ly})`}>
                    <g className={'lmPlace ' + (pre ? 'pre' : 'soon') + (on ? ' on' : '')} role="button" tabIndex={0}
                      aria-label={`${p.name}${pre ? ', open for pre-order' : ', coming soon'}`}
                      onClick={(e) => { e.stopPropagation(); if (mode === 'drop') return; choose(i); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(i); } }}
                      onPointerEnter={() => setHov(i)} onPointerLeave={() => setHov(-1)} onFocus={() => setHov(i)} onBlur={() => setHov(-1)}>
                      <rect x="-95" y="-125" width="190" height="215" fill="transparent" />
                      {pre && <ellipse className="smPulse" cx="0" cy="4" rx="62" ry="26" fill="none" stroke={p.bg} strokeWidth="2.5" />}
                      <polygon points={pre ? '-86,2 0,-42 86,2 0,46' : '-70,2 0,-34 70,2 0,38'} fill={p.wash} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
                      <polygon points={pre ? '-86,2 0,46 0,54 -86,10' : '-70,2 0,38 0,45 -70,9'} fill={INK} opacity=".85" />
                      <polygon points={pre ? '86,2 0,46 0,54 86,10' : '70,2 0,38 0,45 70,9'} fill={INK} opacity=".6" />
                      <g className="lmArt"><g transform={`scale(${scale})`}><Art bg={p.bg} fg={p.fg} /></g></g>
                      <g transform={`translate(0 ${pre ? 62 : 48})`}>
                        <rect x={-tw / 2} y="0" width={tw} height="22" rx="11" fill={pre ? p.bg : '#fff'} stroke={INK} strokeWidth="1.6" strokeDasharray={pre ? undefined : '4 3'} />
                        <text x="0" y="15" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="2.2" fontFamily="'Josefin Sans', sans-serif" fill={pre ? p.fg : INK}>{label.toUpperCase()}</text>
                        <g transform="translate(0 28)">
                          <rect x="-48" y="0" width="96" height="17" rx="8.5" fill={pre ? '#EE5340' : p.fg} stroke={INK} strokeWidth="1.3" />
                          <text x="0" y="12" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="1.8" fontFamily="'Josefin Sans', sans-serif" fill={INK}>{tag.toUpperCase()}</text>
                        </g>
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>
            <rect x="2" y="2" width={W - 4} height={H - 4} fill="none" stroke={INK} strokeWidth="4" />
          </svg>
        </div>

        {mode === 'drop' && (
          <div className="smUI smBanner" role="status">
            Click anywhere on the map to drop a pin
            <button type="button" onClick={() => setMode('idle')}>Cancel</button>
          </div>
        )}

        <div className="smUI smTools" role="group" aria-label="Map controls">
          <button type="button" onClick={() => zoomBy(1.3)} aria-label="Zoom in">＋</button>
          <button type="button" onClick={() => zoomBy(0.77)} aria-label="Zoom out">－</button>
          <button type="button" onClick={reset} aria-label="Reset the map" className="txt">Reset</button>
        </div>
        <div className="smUI smSuggest">
          <button type="button" className="btn2" onClick={() => { setSel(-1); setMode(mode === 'drop' ? 'idle' : 'drop'); setPending(null); }}>
            {mode === 'drop' ? 'Cancel pin' : 'Suggest a place'}
          </button>
        </div>
        <p className="smHint" aria-hidden="true">Drag to move · Ctrl + scroll to zoom</p>

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

function scenery() {
  seed = 7;
  const blocks = [];
  const avoid = PLACES.map((p) => [p.lx, p.ly]);
  const cell = (cx, cy) => {
    if (avoid.some(([ax, ay]) => Math.hypot(ax - cx, (ay - cy) * 1.4) < 95)) return;
    if (rnd() < 0.38) return;
    blocks.push({ x: cx + (rnd() - 0.5) * 8, y: cy + (rnd() - 0.5) * 6, w: 22 + rnd() * 14, d: 18 + rnd() * 10, h: 14 + rnd() * rnd() * 56 });
  };
  for (let x = 455; x < 1100; x += 70) for (let y = 215; y < 520; y += 52) cell(x, y);
  for (let x = 640; x < 1100; x += 70) for (let y = 640; y < 700; y += 52) cell(x, y);
  const trees = [];
  const noAvoid = (x, y) => !avoid.some(([ax, ay]) => Math.hypot(ax - x, (ay - y) * 1.3) < 70);
  for (let i = 0; i < 30; i++) { const t = { x: 1090 + rnd() * 330, y: 740 + rnd() * 250, r: 7 + rnd() * 3 }; if (noAvoid(t.x, t.y)) trees.push(t); }
  for (let i = 0; i < 12; i++) trees.push({ x: 1150 + rnd() * 170, y: 290 + rnd() * 55, r: 7 + rnd() * 3 });
  for (let i = 0; i < 14; i++) { const t = { x: 440 + i * 52, y: 556 + (i % 3) * 3, r: 6 }; if (noAvoid(t.x, t.y)) trees.push(t); }
  const waves = [];
  for (let i = 0; i < 16; i++) waves.push({ x: 20 + rnd() * 250, y: 830 + rnd() * 230 });
  return { blocks: blocks.sort((a, b) => a.y - b.y), trees: trees.sort((a, b) => a.y - b.y), waves };
}
