import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GOLD = '#D4AF37';

export default function ClientStory({ label, headline, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex items-start justify-between gap-4 group"
      >
        <div className="flex-1">
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
            {label}
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
            fontWeight: 600,
            color: '#1a1a1a',
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
        <div className="pb-8">
          {children}
        </div>
      )}
    </div>
  );
}