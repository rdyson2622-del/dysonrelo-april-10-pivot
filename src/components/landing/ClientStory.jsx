import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GOLD = '#D4AF37';

export default function ClientStory({ label, headline, media, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full rounded-2xl mb-4 p-3 sm:p-4" style={{ background: '#ede0cc' }}>
      <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch"
        style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.4)' }}>

        {/* Left: all copy */}
        <div className="flex-1 min-w-0 px-6 py-6">
          <button
            onClick={() => setOpen(!open)}
            className="w-full text-left flex items-start justify-between gap-4 group mb-2"
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

          {open && <div>{children}</div>}

          {!open && (
            <div className="relative -mt-2 h-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(237,224,204,0.5) 50%, rgba(237,224,204,0.95) 100%)' }}>
              <button
                onClick={() => setOpen(true)}
                className="absolute inset-0 pointer-events-auto flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-80"
                style={{ color: GOLD }}>
                Click here to read the story
              </button>
            </div>
          )}
        </div>

        {/* Right: media, in a black box on the tan background */}
        {media && (
          <div className="w-full md:w-1/2 shrink-0 flex items-center justify-center p-5 md:p-8" style={{ minHeight: '320px' }}>
            <div className="relative w-full h-full rounded-xl overflow-hidden" style={{ background: '#000', border: `1px solid ${GOLD}`, minHeight: '260px' }}>
              {media}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}