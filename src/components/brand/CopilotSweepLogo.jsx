import React from 'react';

/**
 * CopilotSweepLogo
 * Locked uploaded PNG only. No redraw, no SVG, no filter, no drop-shadow, no blur.
 * Height 64px, width auto, object-contain.
 */
export default function CopilotSweepLogo({ className = '', onClick }) {
  return (
    <img
      src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/acf69797f_copilot-sweep-logo.png"
      alt="copilot"
      style={{ height: '64px', width: 'auto' }}
      className={`inline-block object-contain ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    />
  );
}