import React from 'react';

/**
 * DysonVerticalBadge
 * Official Dyson & Dyson vertical badge.
 * Uses the authentic pixel-identical uploaded PNG asset:
 * https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/740e65083_dd-logo-1.png
 * No drop-shadow, no filters, no redraws.
 */
export default function DysonVerticalBadge({ height = 48, className = '', onClick }) {
  const OFFICIAL_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/740e65083_dd-logo-1.png";

  return (
    <div 
      className={`relative shrink-0 inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src={OFFICIAL_LOGO}
        alt="Dyson & Dyson"
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain block"
      />
    </div>
  );
}