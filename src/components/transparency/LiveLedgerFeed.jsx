import React from 'react';
import { Brain, AlertTriangle, UserCheck } from 'lucide-react';

const GOLD = '#D4AF37';

const LEDGER_ENTRIES = [
  {
    friction: 'Title delay on lot boundary.',
    action: 'AI-assisted deep research on 1980s local zoning laws initiated.',
    responsible: 'Charlie (AI) & Escrow Officer',
  },
  {
    friction: "Buyer's loan program changed mid-escrow.",
    action: 'Community lender network queried for matching rate lock; re-verification underway.',
    responsible: 'Charlie (AI) & Loan Officer',
  },
  {
    friction: 'Out-of-state agent slow to respond on referral terms.',
    action: 'Deep research pulled agent production history; backup agent shortlisted.',
    responsible: 'Charlie (AI) & Referral Desk',
  },
];

const HOOK_BLOCKS = [
  {
    title: 'Transparency Isn\u2019t Just Seeing the Finish Line. It\u2019s Watching the Engine Work.',
    body: "Every project in the Dyson ecosystem \u2014 whether you're relocating across the country or clearing a cloud on title \u2014 is anchored to our Real-Time Action Ledger. We don't just show you milestones. We expose the deep research, the friction points, and the exact individual responsible for moving your project forward.",
  },
  {
    title: 'Powered by Deep Learning, Driven by Human Intel',
    body: 'Behind every checked box on your roadmap is hours of intensive legwork. We integrate LLM-assisted deep learning and localized community research to anticipate roadblocks before they happen. You see the milestone; we show you the deep research it took to achieve it.',
  },
];

export default function LiveLedgerFeed() {
  return (
    <div className="mt-14">
      {HOOK_BLOCKS.map((block, i) => (
        <div key={i} className="mb-8">
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide mb-2" style={{ color: '#b8920a' }}>
            {block.title}
          </h3>
          <p className="text-base leading-relaxed font-medium" style={{ color: '#2c2217' }}>
            {block.body}
          </p>
        </div>
      ))}

      <div
        className="rounded-2xl p-6 sm:p-8 mb-10 shadow-2xl"
        style={{
          border: '1.5px solid rgba(212,175,55,0.4)',
          background: '#0a0a0a',
          boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
        }}
      >
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide mb-3" style={{ color: GOLD }}>
          No Hidden Agendas. No Unexplained Delays.
        </h3>
        <p className="text-stone-200 leading-relaxed mb-4 text-sm sm:text-base">
          Your live Time Clock attaches a transparent narrative to every step of your plan of action:
        </p>
        <ul className="space-y-3 text-white">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: GOLD }} />
            <span><strong style={{ color: GOLD }}>The Milestones:</strong> Clear, trackable progress points updated in real-time.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: GOLD }} />
            <span><strong style={{ color: GOLD }}>The Friction Points:</strong> If we hit a wall, you know about it immediately. We log every stopping point so you're never left wondering why things paused.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: GOLD }} />
            <span><strong style={{ color: GOLD }}>The Ownership:</strong> Every task, roadblock, and solution has a name attached to it. You'll always know exactly who is responsible for clearing the path.</span>
          </li>
        </ul>
      </div>

      <div
        className="rounded-2xl p-6 sm:p-8 shadow-2xl"
        style={{
          border: `1.5px solid ${GOLD}`,
          background: '#0a0a0a',
          boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
        }}
      >
        <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: GOLD }}>
          Live Ledger — The Dyson Time Clock
        </p>
        <p className="text-white/60 text-sm mb-5">
          A real example of how friction gets logged, researched, and resolved — with a name attached at every step.
        </p>
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {LEDGER_ENTRIES.map((entry, i) => (
            <div key={i} className="rounded-lg p-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
                <p className="text-sm text-white/90"><span className="font-bold">Friction Point:</span> {entry.friction}</p>
              </div>
              <div className="flex items-start gap-2 mb-2">
                <Brain className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                <p className="text-sm text-white/90"><span className="font-bold">Action:</span> {entry.action}</p>
              </div>
              <div className="flex items-start gap-2">
                <UserCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#10b981' }} />
                <p className="text-sm text-white/90"><span className="font-bold">Responsible:</span> {entry.responsible}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}