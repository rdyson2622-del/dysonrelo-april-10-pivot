import React from 'react';

/**
 * SectionBadge — Universal stealth section ID watermark.
 * High z-index ensures visibility above all backgrounds/images.
 * pointer-events: none so it never blocks clicks.
 */
export default function SectionBadge({ id }) {
  if (!id) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '14px',
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1,
        color: 'rgba(212, 175, 55, 0.3)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 9999,
        fontFamily: 'monospace',
        letterSpacing: '-0.02em',
      }}
    >
      {id}
    </div>
  );
}