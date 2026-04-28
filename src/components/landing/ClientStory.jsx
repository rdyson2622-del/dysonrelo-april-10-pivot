import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GOLD = '#D4AF37';

export default function ClientStory({ label, headline, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-2xl mb-4 overflow-hidden" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-6 flex items-start justify-between gap-4 group"
      >
        <div className="flex-1">
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
            {label}
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.25,
          }}>
            {headline}
          </h2>
        </div>
        <div className="shrink-0 mt-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: open ? GOLD : 'rgba(212,175,55,0.12)', border: `1px solid ${open ? GOLD : 'rgba(212,175,55,0.3)'}` }}>
          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: '#000' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: GOLD }} />
          }
        </div>
      </button>

      {/* Expandable body */}
      {open && (
        <div className="px-6 pb-8">
          {children}
        </div>
      )}

      {/* Shadow overlay with CTA when collapsed */}
      {!open && (
        <div className="relative -mt-12 h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(17,17,17,0.3) 50%, rgba(17,17,17,0.9) 100%)'
          }}>
          <button
            onClick={() => setOpen(true)}
            className="absolute inset-0 pointer-events-auto flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-80"
            style={{ color: GOLD }}>
            Click here to read the story
          </button>
        </div>
      )}
    </div>
  );
}