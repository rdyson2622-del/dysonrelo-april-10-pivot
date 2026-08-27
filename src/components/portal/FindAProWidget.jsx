import React from 'react';
import { Wrench, ExternalLink } from 'lucide-react';

const GOLD = '#D4AF37';

const PROS = [
  { label: 'Angi', desc: 'Vetted local pros', url: 'https://www.angi.com' },
  { label: 'TaskRabbit', desc: 'Quick odd jobs', url: 'https://www.taskrabbit.com' },
  { label: 'Thumbtack', desc: 'Compare local quotes', url: 'https://www.thumbtack.com' },
];

export default function FindAProWidget() {
  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase"
        style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
        <Wrench className="w-3.5 h-3.5" /> Find a Pro
      </div>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Need movers, inspectors, contractors, or stagers? Search these trusted national platforms.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PROS.map((p) => (
          <a
            key={p.label}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-5 py-4 rounded-xl transition-all hover:scale-105"
            style={{ background: '#111', border: `1px solid rgba(212,175,55,0.3)` }}
          >
            <span className="text-left">
              <span className="block font-black text-sm text-white">{p.label}</span>
              <span className="block text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.desc}</span>
            </span>
            <ExternalLink className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
          </a>
        ))}
      </div>
    </div>
  );
}