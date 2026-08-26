import React from 'react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import { FileText, Send } from 'lucide-react';

const GOLD = '#D4AF37';

const STAGES = [
  { id: 'buyer_vetted', title: 'Buyer Vetted' },
  { id: 'wealth_manager', title: 'Wealth Manager Confirmed' },
  { id: 'destination_agent', title: 'Destination Agent (You) Assigned' },
  { id: 'touring', title: 'Touring Properties' },
  { id: 'escrow', title: 'Escrow Coordination' },
  { id: 'concierge', title: 'Concierge Settling-in' },
];

const STATUSES = {
  buyer_vetted: { status: 'completed' },
  wealth_manager: { status: 'completed' },
  destination_agent: { status: 'completed' },
  touring: { status: 'running' },
  escrow: { status: 'running' },
  concierge: { status: 'running' },
};

/**
 * AgentRoadmapSandbox — the "wow" mock live roadmap on the Agent Guest Pass
 * preview. Shows a sample $3.5M buyer moving through the process so the
 * agent sees exactly what their real Agent Portal tracks. The two action
 * buttons are soft gates — clicking either opens the "claim your portal"
 * prompt instead of doing anything live.
 */
export default function AgentRoadmapSandbox({ city, onGate }) {
  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}>
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: GOLD }}>Live Roadmap · Sandbox</p>
      <p className="text-sm text-white font-semibold mb-4">
        The Reynolds Family — Relocating from Chicago to {city || 'your market'}
      </p>
      <FlowRoadmapLine stages={STAGES} stageStatuses={STATUSES} color={GOLD} onSelect={() => {}} compact />
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={() => onGate('financials')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
        >
          <FileText className="w-3.5 h-3.5" /> View Buyer Financials
        </button>
        <button
          onClick={() => onGate('referral')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
        >
          <Send className="w-3.5 h-3.5" /> Submit a New Referral
        </button>
      </div>
    </div>
  );
}