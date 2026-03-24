import React from 'react';

/**
 * SectionBadge — Universal stealth section ID watermark.
 * Position: bottom-right of the nearest `position: relative` ancestor.
 * Non-interactive, pointer-events-none. Visible on ALL pages/views.
 * Usage: <SectionBadge id={101} />
 */
export default function SectionBadge({ id }) {
  if (!id) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: '8px',
        right: '10px',
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1,
        color: 'rgba(212, 175, 55, 0.15)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        fontFamily: 'monospace',
        letterSpacing: '-0.02em',
      }}
    >
      {id}
    </div>
  );
}