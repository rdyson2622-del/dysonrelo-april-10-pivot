import React from 'react';

/**
 * SectionBadge — High-visibility section ID tag.
 * Place inside any section/component wrapper (position: relative recommended).
 * Usage: <SectionBadge id={101} />
 */
export default function SectionBadge({ id }) {
  if (!id) return null;
  return (
    <div
      className="absolute top-2 right-2 pointer-events-none select-none z-50"
      title={`Section #${id}`}
    >
      <span style={{
        display: 'inline-block',
        fontSize: '0.65rem',
        fontWeight: 800,
        color: '#000',
        background: '#D4AF37',
        borderRadius: '4px',
        padding: '1px 5px',
        letterSpacing: '0.04em',
        fontFamily: 'monospace',
        boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
        opacity: 0.92,
      }}>
        #{id}
      </span>
    </div>
  );
}