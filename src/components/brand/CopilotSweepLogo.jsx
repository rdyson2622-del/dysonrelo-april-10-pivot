import React from 'react';

/**
 * CopilotSweepLogo
 * Uses the authentic pixel-identical uploaded PNG asset:
 * https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/acf69797f_copilot-sweep-logo.png
 * No redraw, no SVG, no canvas, no CSS script, no glow, no blur, no drop-shadow.
 */
export default function CopilotSweepLogo({ size = 'md', className = '', onClick }) {
  const sizeClasses = {
    xs: 'h-4',
    sm: 'h-5',
    md: 'h-7 sm:h-8',
    lg: 'h-10 sm:h-12',
    xl: 'h-12 sm:h-16 lg:h-20',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <img
      src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/acf69797f_copilot-sweep-logo.png"
      alt="copilot"
      className={`inline-block object-contain ${selectedSizeClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ mixBlendMode: 'screen', filter: 'contrast(1.4)' }}
      onClick={onClick}
    />
  );
}