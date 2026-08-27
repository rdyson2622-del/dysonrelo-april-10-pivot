import React from 'react';
import { Search, Eye, ShieldCheck, DollarSign } from 'lucide-react';

const GOLD = '#D4AF37';

const ITEMS = [
  { icon: Search, title: 'Deep Research', desc: "We use AI-assisted local intel to identify the top 1% of agents in your client's destination city." },
  { icon: Eye, title: 'Total Transparency', desc: 'You get a Real-Time Action Ledger showing exactly who we are interviewing and what we find.' },
  { icon: ShieldCheck, title: 'You Keep Control', desc: 'We hand you the vetted options. You present them to your client as an added value of your service.' },
  { icon: DollarSign, title: 'Zero Expense', desc: 'We handle the legwork. You look like a hero.' },
];

/** ValuePropList — the "We Work For You" pitch on the Listing Agent Preview. */
export default function ValuePropList() {
  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>
        How Your Free Destination Vetting Works
      </p>
      <div className="space-y-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}40` }}>
              <Icon className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}