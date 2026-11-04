import React from 'react';

/* Small illustrated pieces for the Scent Map. Everything is drawn upright
   (as if seen from the front); the map stands each piece up on the tilted
   ground plane. */

const Shade = ({ rx = 44, cx = 60, cy = 140 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry="9" fill="#1F1B18" opacity="0.14" />
);

export function ShrineArt({ lit }) {
  return (
    <svg viewBox="0 0 160 176" width="160" height="176" aria-hidden="true">
      <Shade cx={80} cy={170} rx={68} />
      <path d="M8 170Q14 132 52 124L108 124Q146 132 152 170Z" fill="#DAD6CE" />
      <path d="M108 124Q146 132 152 170L114 170Q124 144 108 124Z" fill="#BDB8AE" />
      <path d="M26 154q10-10 22-4M98 148q12-8 24 2M60 163q8-6 18 0" stroke="#A9A398" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M42 124L118 124L112 115L48 115Z" fill="#EFE9DB" />
      <path d="M48 115L112 115L106 107L54 107Z" fill="#E6DFCD" />
      <path d="M68 124L92 124L89 107L71 107Z" fill="#D2C9B3" />
      <rect x="52" y="66" width="56" height="41" fill="#F1EBDD" />
      <rect x="96" y="66" width="12" height="41" fill="#DDD5C0" />
      {[58, 66, 74, 82].map((x) => <rect key={x} x={x} y="70" width="4" height="37" fill="#E2D9C5" />)}
      <path d="M47 66L80 47L113 66Z" fill="#F7F2E6" />
      <path d="M80 47L113 66L97 66Z" fill="#E2DAC6" />
      <rect x="62" y="37" width="36" height="10" fill="#D9D0BB" />
      <rect x="68" y="29" width="24" height="8" fill="#CFC5AE" />
      <rect x="73" y="22" width="14" height="7" fill="#C4B9A0" />
      <rect x="79" y="9" width="2.4" height="13" fill="#1F1B18" />
      <path d="M81.4 10L97 14.5L81.4 19Z" fill="#2B1D8F" />
      <circle cx="80" cy="100" r="3.4" fill="#D95A25" />
      {lit && (
        <g className="smFlame">
          <path d="M80 2C73 10 73 18 80 24C87 18 87 10 80 2Z" fill="#FFB347" />
          <path d="M80 8C77 13 77 17 80 20C83 17 83 13 80 8Z" fill="#FFE9A8" />
        </g>
      )}
    </svg>
  );
}

export function HosierArt() {
  return (
    <svg viewBox="0 0 120 150" width="120" height="150" aria-hidden="true">
      <Shade cy={144} rx={46} />
      <rect x="12" y="52" width="38" height="92" fill="#C9604C" />
      <rect x="44" y="52" width="6" height="92" fill="#A94C3B" />
      <rect x="60" y="30" width="46" height="114" fill="#E7A17E" />
      <rect x="100" y="30" width="6" height="114" fill="#CC8764" />
      <rect x="50" y="62" width="10" height="82" fill="#5A1A12" />
      {[62, 78, 94].map((y) => (
        <g key={y}>
          <rect x="18" y={y} width="9" height="9" fill="#F6DCD0" />
          <rect x="33" y={y} width="9" height="9" fill="#F6DCD0" />
        </g>
      ))}
      {[40, 56, 72, 88].map((y) => (
        <g key={y}>
          <rect x="66" y={y} width="8" height="9" fill="#F6DCD0" />
          <rect x="80" y={y} width="8" height="9" fill="#F6DCD0" />
          <rect x="94" y={y} width="6" height="9" fill="#F6DCD0" opacity="0.8" />
        </g>
      ))}
      <rect x="14" y="116" width="34" height="26" rx="3" fill="#C4325A" />
      <path d="M31 134C22 128 23 121 28 121C30 121 31 122 31 123C31 122 32 121 34 121C39 121 40 128 31 134Z" fill="#F9D648" />
      <path d="M12 52Q50 76 106 30" fill="none" stroke="#5A1A12" strokeWidth="1" />
      {[[22, 60], [34, 66], [47, 66], [62, 58], [76, 49], [90, 40]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#F9D648" />
      ))}
    </svg>
  );
}

export function MorningArt() {
  return (
    <svg viewBox="0 0 130 140" width="130" height="140" aria-hidden="true">
      <Shade cx={65} cy={134} rx={52} />
      <circle cx="68" cy="58" r="30" fill="#F6C25B" />
      {[0, 30, 60, 90, 120, 150, 180].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={68 - Math.cos(r) * 36} y1={58 - Math.sin(r) * 36} x2={68 - Math.cos(r) * 46} y2={58 - Math.sin(r) * 46} stroke="#F6C25B" strokeWidth="3" strokeLinecap="round" />;
      })}
      <path d="M52 76L56 54M84 76L80 54M48 54H88" stroke="#3A2118" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="12" y="76" width="106" height="44" rx="9" fill="#8A2515" />
      <rect x="12" y="92" width="106" height="9" fill="#F6DCD0" />
      <rect x="12" y="74" width="106" height="6" rx="3" fill="#5A1A12" />
      {[22, 44, 66, 88].map((x) => <rect key={x} x={x} y="82" width="16" height="9" rx="2" fill="#F6DCD0" />)}
      <rect x="100" y="104" width="10" height="16" rx="2" fill="#5A1A12" />
      <circle cx="34" cy="124" r="6" fill="#2A1410" />
      <circle cx="96" cy="124" r="6" fill="#2A1410" />
      <path d="M2 131H128" stroke="#5A1A12" strokeWidth="1.4" strokeDasharray="3 3" />
    </svg>
  );
}

export function OceanArt() {
  return (
    <svg viewBox="0 0 130 150" width="130" height="150" aria-hidden="true">
      <ellipse cx="65" cy="138" rx="60" ry="12" fill="#6FA89B" />
      <ellipse cx="65" cy="138" rx="60" ry="12" fill="none" stroke="#F3F8F4" strokeWidth="1.4" strokeDasharray="4 4" />
      <path d="M18 138L22 76Q30 60 42 72L48 138Z" fill="#E5CCA3" />
      <path d="M36 138L42 72Q46 66 48 74L48 138Z" fill="#C9AA7C" />
      <ellipse cx="32" cy="70" rx="12" ry="5" fill="#7FA879" />
      <path d="M50 138L55 44Q66 22 80 42L86 138Z" fill="#E5CCA3" />
      <path d="M72 138L76 40Q80 36 82 44L86 138Z" fill="#C9AA7C" />
      <ellipse cx="68" cy="40" rx="14" ry="6" fill="#7FA879" />
      <path d="M88 138L92 90Q100 78 110 90L114 138Z" fill="#E5CCA3" />
      <path d="M104 138L106 86Q109 84 110 90L114 138Z" fill="#C9AA7C" />
      <ellipse cx="101" cy="86" rx="10" ry="4" fill="#7FA879" />
      <ellipse cx="34" cy="138" rx="18" ry="4" fill="#F3F8F4" opacity="0.85" />
      <ellipse cx="68" cy="139" rx="20" ry="4" fill="#F3F8F4" opacity="0.85" />
      <ellipse cx="102" cy="139" rx="16" ry="4" fill="#F3F8F4" opacity="0.85" />
    </svg>
  );
}

export function FedArt() {
  return (
    <svg viewBox="0 0 130 150" width="130" height="150" aria-hidden="true">
      <Shade cx={65} cy={144} rx={50} />
      <path d="M96 20a14 14 0 1 0 6 20a10 10 0 1 1-6-20Z" fill="#F8EBB8" />
      <path d="M18 144L18 76L56 46L56 144Z" fill="#C3B2EE" />
      <path d="M56 46L102 70L102 144L56 144Z" fill="#A996DD" />
      <path d="M18 76L56 96L56 46Z" fill="#D6C9F5" />
      <path d="M56 96L102 70L56 46Z" fill="#B7A6E8" />
      <path d="M18 110L56 130M18 92L56 112M56 120L102 94M56 102L102 76M56 130L102 106" stroke="#F8EBB8" strokeWidth="1.3" opacity="0.8" />
      <path d="M36 144L36 126L46 132L46 144Z" fill="#5A1A12" opacity="0.5" />
    </svg>
  );
}

export function RainArt() {
  return (
    <svg viewBox="0 0 130 150" width="130" height="150" aria-hidden="true">
      <Shade cx={65} cy={144} rx={46} />
      <rect x="34" y="102" width="62" height="42" fill="#6E98C0" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={34 + i * 15.5 + 7} y="102" width="8" height="42" fill="#F8EBB8" />)}
      <path d="M28 102L65 78L102 102Z" fill="#C8E048" />
      <path d="M65 78L102 102L84 102Z" fill="#A9C230" />
      <rect x="56" y="118" width="18" height="26" rx="2" fill="#5A1A12" />
      <g>
        <ellipse cx="44" cy="38" rx="26" ry="15" fill="#9AA8B8" />
        <ellipse cx="72" cy="30" rx="30" ry="19" fill="#A9B6C6" />
        <ellipse cx="94" cy="40" rx="22" ry="14" fill="#9AA8B8" />
        <rect x="26" y="42" width="84" height="12" rx="6" fill="#7F8EA3" />
      </g>
      {[40, 58, 76, 94].map((x, i) => (
        <line key={x} className="smDrop" style={{ animationDelay: i * 0.35 + 's' }} x1={x} y1="58" x2={x - 4} y2="70" stroke="#C8E048" strokeWidth="2.2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function YarraArt() {
  return (
    <svg viewBox="0 0 140 160" width="140" height="160" aria-hidden="true">
      <Shade cx={70} cy={154} rx={52} />
      <circle cx="98" cy="62" r="24" fill="#F4C25B" opacity="0.92" />
      <path d="M58 150Q54 112 60 82L68 82Q64 112 72 150Z" fill="#B07A52" />
      <path d="M62 140Q60 112 64 90" stroke="#D3A27A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="46" cy="60" rx="30" ry="14" fill="#6E9E86" transform="rotate(-18 46 60)" />
      <ellipse cx="84" cy="46" rx="30" ry="13" fill="#8DB89A" transform="rotate(14 84 46)" />
      <ellipse cx="58" cy="38" rx="26" ry="12" fill="#E8B85A" transform="rotate(-6 58 38)" />
      <ellipse cx="30" cy="82" rx="22" ry="9" fill="#8DB89A" transform="rotate(24 30 82)" />
      <ellipse cx="92" cy="76" rx="22" ry="9" fill="#6E9E86" transform="rotate(-22 92 76)" />
      <path d="M96 140L126 140L120 150L104 150Z" fill="#D95A25" />
      <path d="M111 140L111 122" stroke="#3A2118" strokeWidth="1.4" />
      <circle cx="111" cy="120" r="3.4" fill="#F9D648" />
    </svg>
  );
}

export const LANDMARK_ART = [ShrineArt, HosierArt, MorningArt, OceanArt, FedArt, RainArt, YarraArt];

export function TreeArt({ c = '#8DB8A5' }) {
  return (
    <svg viewBox="0 0 30 46" width="30" height="46" aria-hidden="true">
      <ellipse cx="15" cy="43" rx="10" ry="2.6" fill="#1F1B18" opacity="0.14" />
      <rect x="13" y="32" width="4" height="11" fill="#B5654A" />
      <path d="M15 2C24 13 28 26 26 36L4 36C2 26 6 13 15 2Z" fill={c} />
      <path d="M15 2C20 12 22 26 20 36L26 36C28 26 24 13 15 2Z" fill="#1F1B18" opacity="0.1" />
    </svg>
  );
}

export function RockArt({ c = '#BCD3DE' }) {
  return (
    <svg viewBox="0 0 40 30" width="40" height="30" aria-hidden="true">
      <ellipse cx="20" cy="27" rx="16" ry="3" fill="#1F1B18" opacity="0.12" />
      <path d="M4 27L8 12L18 4L30 8L36 20L34 27Z" fill={c} />
      <path d="M18 4L30 8L36 20L34 27L22 27L24 14Z" fill="#1F1B18" opacity="0.1" />
      <path d="M8 12L18 4L20 12Z" fill="#fff" opacity="0.35" />
    </svg>
  );
}

export function CloudArt() {
  return (
    <svg viewBox="0 0 160 70" width="160" height="70" aria-hidden="true">
      <ellipse cx="50" cy="44" rx="40" ry="20" fill="#fff" opacity="0.92" />
      <ellipse cx="92" cy="32" rx="40" ry="26" fill="#fff" opacity="0.95" />
      <ellipse cx="124" cy="46" rx="30" ry="16" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export function BuildingArt({ w = 26, h = 40, c = '#F1E2C8' }) {
  const rows = Math.max(1, Math.floor((h - 8) / 9));
  return (
    <svg viewBox={`0 0 ${w} ${h + 6}`} width={w} height={h + 6} aria-hidden="true">
      <ellipse cx={w / 2} cy={h + 3} rx={w / 2 + 2} ry="3" fill="#1F1B18" opacity="0.13" />
      <rect x="0" y="4" width={w} height={h} fill={c} />
      <rect x={w * 0.72} y="4" width={w * 0.28} height={h} fill="#1F1B18" opacity="0.1" />
      <rect x="-1" y="1" width={w + 2} height="5" fill="#fff" opacity="0.55" />
      {Array.from({ length: rows }).map((_, r) => (
        <g key={r}>
          <rect x={w * 0.14} y={10 + r * 9} width="4" height="4" fill="#fff" opacity="0.8" />
          <rect x={w * 0.42} y={10 + r * 9} width="4" height="4" fill="#fff" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

export function PinArt({ done }) {
  return (
    <svg viewBox="0 0 40 64" width="40" height="64" aria-hidden="true">
      <ellipse cx="14" cy="61" rx="9" ry="2.6" fill="#1F1B18" opacity="0.18" />
      <rect x="13" y="8" width="2.4" height="52" fill="#1F1B18" />
      <path d="M15.4 8L38 14L15.4 24Z" fill={done ? '#EE5340' : '#fff'} stroke="#1F1B18" strokeWidth="1.4" strokeLinejoin="round" />
      <text x="22" y="20" fontSize="9" fontWeight="700" fill="#1F1B18" fontFamily="Josefin Sans, sans-serif">?</text>
    </svg>
  );
}
