import React from 'react';

/**
 * DysonVerticalBadge
 * Real Dyson & Dyson vertical DD badge with no white side bars and no tear lines.
 */
export default function DysonVerticalBadge({ height = 48, className = '' }) {
  return (
    <div className={`relative shrink-0 inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 96 138"
        height={height}
        style={{ width: 'auto' }}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <linearGradient id="badgeGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A227" />
            <stop offset="35%" stopColor="#FFF0A0" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6C18" />
          </linearGradient>

          <linearGradient id="badgeTextGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF5BA" />
            <stop offset="60%" stopColor="#E2BD4F" />
            <stop offset="100%" stopColor="#9E781B" />
          </linearGradient>

          <linearGradient id="badgeDdGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5DB7A" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#A88017" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Clean solid dark background pill/box */}
        <rect x="2" y="2" width="92" height="134" rx="8" ry="8" fill="#0d0d0d" stroke="url(#badgeGoldBorder)" strokeWidth="3" />
        <rect x="6" y="6" width="84" height="126" rx="5" ry="5" fill="none" stroke="url(#badgeGoldBorder)" strokeWidth="0.8" opacity="0.6" />

        {/* Top "DYSON" text */}
        <text
          x="48"
          y="23"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="4.5"
          fill="url(#badgeTextGold)"
        >
          DYSON
        </text>

        <line x1="8" y1="32" x2="88" y2="32" stroke="url(#badgeGoldBorder)" strokeWidth="0.8" opacity="0.6" />

        {/* ── Interlocking Clean DD Monogram (No tear lines) ── */}
        {/* Left D */}
        <path
          d="M 22 42 L 22 96 L 36 96 C 54 96, 62 85, 62 69 C 62 53, 54 42, 36 42 Z"
          fill="url(#badgeDdGold)"
        />
        <path
          d="M 30 51 L 30 87 L 36 87 C 48 87, 53 79, 53 69 C 53 59, 48 51, 36 51 Z"
          fill="#0d0d0d"
        />

        {/* Right D */}
        <path
          d="M 40 42 L 40 96 L 54 96 C 72 96, 80 85, 80 69 C 80 53, 72 42, 54 42 Z"
          fill="url(#badgeDdGold)"
        />
        <path
          d="M 48 51 L 48 87 L 54 87 C 66 87, 71 79, 71 69 C 71 59, 66 51, 54 51 Z"
          fill="#0d0d0d"
        />

        <line x1="8" y1="106" x2="88" y2="106" stroke="url(#badgeGoldBorder)" strokeWidth="0.8" opacity="0.6" />

        {/* Bottom "DYSON" text */}
        <text
          x="48"
          y="120"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontWeight="700"
          fontSize="13"
          letterSpacing="4.5"
          fill="url(#badgeTextGold)"
        >
          DYSON
        </text>
      </svg>
    </div>
  );
}