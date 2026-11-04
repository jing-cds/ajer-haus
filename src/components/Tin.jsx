import React from 'react';

export default function Tin({ p, lit }) {
  return (
    <svg viewBox="0 0 200 230" width="104" height="120" aria-hidden="true">
      {lit && <circle cx="100" cy="62" r="54" fill="#FFB347" opacity="0.28" />}
      <ellipse cx="100" cy="215" rx="74" ry="7" fill="#000" opacity="0.14" />
      <path d="M24 90Q24 82 32 82L168 82Q176 82 176 90L166 188Q164 214 140 218L60 218Q36 214 34 188Z" fill="url(#smSilver)" />
      <ellipse cx="100" cy="82" rx="76" ry="11" fill="#C9CCCF" />
      <ellipse cx="100" cy="83" rx="67" ry="8" fill="#F3ECDC" />
      <rect x="49" y="108" width="102" height="84" fill={p.bg} />
      <rect x="80" y="114" width="64" height="52" fill="none" stroke={p.fg} strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M118 124C110 134 110 148 118 156C126 148 126 134 118 124Z" fill={p.leaf} />
      {lit && (
        <g className="smFlame">
          <path d="M100 46C92 58 92 70 100 78C108 70 108 58 100 46Z" fill="#FFB347" />
          <path d="M100 56C97 62 97 68 100 72C103 68 103 62 100 56Z" fill="#FFE9A8" />
        </g>
      )}
      <defs>
        <linearGradient id="smSilver" x1="0" x2="1">
          <stop offset="0" stopColor="#9EA2A6" /><stop offset="0.45" stopColor="#F2F3F4" /><stop offset="1" stopColor="#B9BCC0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

