import React, { useState } from 'react';

let uidCounter = 0;

/**
 * Procedural SVG landscape artwork matching each destination type & color palette
 */
export const SceneArt = ({ kind, colors, className = '' }) => {
  const [gradId] = useState(() => `scene-grad-${uidCounter++}`);
  const c = colors || ['#9FE3E0', '#FDE7C2', '#FFB347', '#0B7F86', '#F4D9A6', '#0E9AA0'];

  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c[0]} />
          <stop offset="1" stopColor={c[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${gradId})`} />
      <circle cx="290" cy="90" r="34" fill={c[2]} />

      {kind === 'beach' && (
        <>
          <rect y="130" width="400" height="110" fill={c[5]} />
          <path d="M0 150 Q100 140 200 150 T400 146" stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" />
          <path d="M0 172 Q100 150 200 172 T400 165 V240 H0Z" fill={c[4]} />
          <path d="M70 240 Q78 195 92 152" stroke="#5a3b22" strokeWidth="6" fill="none" strokeLinecap="round" />
          <g stroke={c[3]} strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M92 152 Q62 128 34 150" />
            <path d="M92 152 Q72 118 48 116" />
            <path d="M92 152 Q98 114 124 110" />
            <path d="M92 152 Q122 130 148 150" />
          </g>
        </>
      )}

      {kind === 'hills' && (
        <>
          <path d="M0 150 L70 90 L140 140 L220 70 L310 145 L400 100 V240 H0Z" fill={c[3]} />
          <path d="M0 190 Q90 130 180 175 T400 160 V240 H0Z" fill={c[4]} />
          <g stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none">
            <path d="M0 205 Q100 165 200 195 T400 185" />
            <path d="M0 220 Q100 185 200 212 T400 204" />
          </g>
        </>
      )}

      {kind === 'culture' && (
        <>
          <ellipse cx="60" cy="205" rx="72" ry="42" fill={c[3]} />
          <ellipse cx="190" cy="220" rx="92" ry="46" fill={c[3]} />
          <ellipse cx="335" cy="206" rx="80" ry="40" fill={c[3]} />
          <rect x="140" y="122" width="120" height="10" fill={c[4]} />
          <rect x="150" y="132" width="100" height="62" fill={c[4]} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={158 + i * 20} y="136" width="8" height="58" fill={c[3]} />
          ))}
          <rect y="196" width="400" height="44" fill={c[4]} />
        </>
      )}

      {kind === 'backwaters' && (
        <>
          <rect y="125" width="400" height="115" fill={c[5]} />
          <path d="M0 135 Q80 120 160 130 T320 125 T400 130 V145 H0Z" fill={c[3]} />
          <path d="M115 178 C135 186, 235 186, 265 178 L280 168 C255 169, 125 169, 100 168 Z" fill={c[4]} />
          <path d="M125 168 Q185 136 250 168 Z" fill="#6A4526" />
          <rect x="150" y="152" width="22" height="14" rx="2" fill={c[2]} opacity="0.9" />
          <rect x="185" y="152" width="22" height="14" rx="2" fill={c[2]} opacity="0.9" />
          <path d="M45 240 Q40 170 18 120" stroke="#4A3319" strokeWidth="5" fill="none" strokeLinecap="round" />
          <g stroke={c[3]} strokeWidth="5" fill="none" strokeLinecap="round">
            <path d="M18 120 Q-10 100 -30 115" />
            <path d="M18 120 Q-5 85 -20 70" />
            <path d="M18 120 Q20 85 45 75" />
            <path d="M18 120 Q45 100 65 115" />
          </g>
          <g stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" fill="none">
            <path d="M100 195 Q180 190 270 195" />
            <path d="M140 210 Q210 206 290 210" />
            <path d="M50 225 Q120 220 200 225" />
          </g>
        </>
      )}

      {kind === 'wildlife' && (
        <>
          <path d="M0 135 Q60 95 140 120 T300 105 T400 125 V240 H0Z" fill={c[3]} />
          <path d="M0 165 Q110 145 220 160 T400 152 V240 H0Z" fill={c[4]} />
          <rect y="185" width="400" height="55" fill={c[5] || '#176063'} />
          <g fill={c[3]}>
            <ellipse cx="140" cy="155" rx="36" ry="24" />
            <circle cx="106" cy="148" r="16" />
            <path d="M96 150 Q85 160 88 174 Q92 178 95 174 Q92 165 100 158" stroke={c[3]} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M100 158 Q95 166 90 165" stroke="#FFF" strokeWidth="2" fill="none" />
            <rect x="114" y="165" width="8" height="24" rx="3" />
            <rect x="127" y="165" width="8" height="24" rx="3" />
            <rect x="152" y="165" width="8" height="24" rx="3" />
            <rect x="164" y="165" width="8" height="24" rx="3" />
            <path d="M174 150 Q180 162 178 170" stroke={c[3]} strokeWidth="2" fill="none" />
          </g>
          <g stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" fill="none">
            <path d="M80 200 Q140 196 200 200" />
            <path d="M100 215 Q150 212 220 215" />
          </g>
        </>
      )}

      {kind === 'waterfalls' && (
        <>
          <path d="M0 70 L90 90 L120 240 H0 Z" fill={c[3]} />
          <path d="M400 60 L300 85 L270 240 H400 Z" fill={c[3]} />
          <path d="M80 100 L140 110 L130 240 H60 Z" fill={c[4]} />
          <path d="M320 95 L260 105 L265 240 H340 Z" fill={c[4]} />
          <path d="M140 100 Q200 95 260 100 L260 210 Q200 215 140 210 Z" fill="#D8F3F1" />
          <path d="M155 100 L150 210 M175 100 L170 210 M195 98 L195 210 M215 98 L220 210 M235 100 L240 210 M250 100 L255 210" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <rect y="205" width="400" height="35" fill={c[5] || '#157F83'} />
          <ellipse cx="200" cy="210" rx="90" ry="16" fill="#FFFFFF" opacity="0.6" />
          <ellipse cx="200" cy="214" rx="70" ry="10" fill="#E8F9F8" opacity="0.8" />
          <g stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" fill="none">
            <path d="M70 224 Q200 218 330 224" />
            <path d="M110 232 Q200 228 290 232" />
          </g>
        </>
      )}
    </svg>
  );
};
