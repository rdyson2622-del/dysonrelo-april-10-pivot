import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { GOLD } from './relocationProjectStatus';

/**
 * LiveActionLedgerPlaceholder — placeholder for the future tri-party
 * (sending agent ⟷ Dyson concierge ⟷ destination agent/client) activity
 * feed. Shows the intended shape so it's obvious what will populate here.
 */
export default function LiveActionLedgerPlaceholder() {
  const placeholderEntries = [
    { label: 'Client file created', sub: 'Awaiting destination agent match' },
    { label: 'Destination agent vetting', sub: 'Dyson Concierge will post updates here' },
    { label: 'House hunting tour recap', sub: 'Weekly pulse updates will appear here' },
  ];

  return (
    <div className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: GOLD }}>
        <MessageCircle className="w-3.5 h-3.5" /> Live Action Ledger
      </p>
      <p className="text-xs text-white/50 mb-4">
        Coming soon: real-time tri-party updates between you, the Dyson Concierge, and the destination agent.
      </p>
      <div className="space-y-3">
        {placeholderEntries.map((e, i) => (
          <div key={i} className="flex items-start gap-2.5 opacity-50">
            <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: GOLD }} />
            <div>
              <p className="text-sm text-white">{e.label}</p>
              <p className="text-xs text-white/40">{e.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}