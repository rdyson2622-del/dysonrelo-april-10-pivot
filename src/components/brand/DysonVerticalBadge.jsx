import React from 'react';

/**
 * DysonVerticalBadge
 * Official Dyson & Dyson vertical logo (DYSON top, interlocking DD, DYSON bottom).
 * Uses the authentic high-resolution asset provided by Dyson & Dyson.
 */
export default function DysonVerticalBadge({ height = 48, className = '', onClick }) {
  const OFFICIAL_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/9b342fd53_DYSONDYSONLOGO2026.png";

  return (
    <div 
      className={`relative shrink-0 inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src={OFFICIAL_LOGO}
        alt="Dyson & Dyson"
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain block drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
      />
    </div>
  );
}