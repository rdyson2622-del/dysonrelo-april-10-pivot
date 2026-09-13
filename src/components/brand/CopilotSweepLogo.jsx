import React from 'react';

/**
 * CopilotSweepLogo
 * Official gold cursive "copilot" sweep logo with underline flourish.
 * Uses the authentic brand image asset provided by DysonHomes.
 */
export default function CopilotSweepLogo({ size = 'md', height, className = '', onClick }) {
  const OFFICIAL_COPILOT_IMAGE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a2d1d7d8e_Screenshot2026-09-13at84701AM.png";

  const sizeHeights = {
    sm: 28,
    md: 40,
    lg: 56,
    xl: 78,
  };

  const finalHeight = height || sizeHeights[size] || 40;

  return (
    <div 
      className={`inline-flex items-center justify-center relative select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src={OFFICIAL_COPILOT_IMAGE}
        alt="copilot"
        style={{ height: `${finalHeight}px`, width: 'auto' }}
        className="object-contain block rounded-lg mix-blend-screen drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)]"
      />
    </div>
  );
}