import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { GOLD } from './relocationProjectStatus';

const STEPS = [
  {
    title: 'Add the client as soon as you get the referral',
    body: 'Click "Add New Relocation Client" and enter the origin listing, destination metro, and target move date. Status starts at "Needs Destination Agent."',
  },
  {
    title: 'Dyson vets a destination agent',
    body: 'Our National Vetting Desk matches and vets a destination agent for this client. Once approved, add their name, phone, and email in the Client Workfile.',
  },
  {
    title: 'Move the status forward as the deal progresses',
    body: 'Use the status dropdown on the Client Workfile to advance the pipeline: Agent Vetting → Agent Assigned → House Hunting → In Escrow → Closed.',
  },
  {
    title: 'Track your numbers from the KPI banner',
    body: 'Active Relocations, Pending Escrows, and Projected Referral Income update automatically from every active project.',
  },
  {
    title: 'Watch the Live Action Ledger (coming soon)',
    body: 'This will show real-time tri-party updates between you, the Dyson Concierge, and the destination agent — no more chasing status by phone.',
  },
];

export default function AgentPortalGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl mb-8 overflow-hidden" style={{ background: '#161616', border: `1px solid rgba(212,175,55,0.25)` }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <span className="flex items-center gap-2 text-sm font-black" style={{ color: GOLD }}>
          <BookOpen className="w-4 h-4" /> How This Works — Agent &amp; Admin Guide
        </span>
        {open ? <ChevronDown className="w-4 h-4" style={{ color: GOLD }} /> : <ChevronRight className="w-4 h-4" style={{ color: GOLD }} />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: `1px solid rgba(212,175,55,0.4)` }}>
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{step.title}</p>
                <p className="text-xs text-white/60 mt-0.5">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}