import React from 'react';

/**
 * CopilotSweepLogo
 * Italicized gold lower case "copilot"
 * Replaces previous image artifacts with pure typographic rendering.
 */
export default function CopilotSweepLogo({ size = 'md', className = '', onClick }) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl lg:text-6xl',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span 
      className={`inline-block font-serif italic lowercase font-normal text-[#D4AF37] tracking-normal leading-none select-none drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)] ${selectedSizeClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ fontFamily: 'Cormorant Garamond, serif' }}
      onClick={onClick}
    >
      copilot
    </span>
  );
}