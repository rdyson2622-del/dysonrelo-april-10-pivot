import React from 'react';

/**
 * SectionBadge — Subtle #ID label for content blocks.
 * Place at the bottom-right of any major section/card.
 * Usage: <SectionBadge id={101} />
 */
export default function SectionBadge({ id }) {
  if (!id) return null;
  return (
    <div
      className="absolute bottom-2 right-2 pointer-events-none select-none z-10"
      title={`Section #${id} — reference this ID when reporting issues`}
    >
      <span style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        color: 'rgba(212,175,55,0.35)',
        letterSpacing: '0.05em',
        fontFamily: 'monospace',
      }}>
        #{id}
      </span>
    </div>
  );
}