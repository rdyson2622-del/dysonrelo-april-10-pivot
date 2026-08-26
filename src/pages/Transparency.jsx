import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldCheck } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const GOLD = '#D4AF37';
const CHARLIE_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/94a10d6e0_Screenshot2026-08-26at71908AM.png';

// Dummy sample roadmap — visually shows what "every milestone visible to everyone" means.
const SAMPLE_STAGES = [
  { id: 'offer', title: 'Offer Accepted' },
  { id: 'inspection', title: 'Inspection' },
  { id: 'loan', title: 'Loan Approval' },
  { id: 'clear', title: 'Clear to Close' },
  { id: 'closing', title: 'Closing Day' },
];
const SAMPLE_STATUSES = {
  offer: { status: 'completed' },
  inspection: { status: 'completed' },
  loan: { status: 'running' },
  clear: { status: 'pending' },
  closing: { status: 'pending' },
};

const DEFAULT_BULLETS = [
  "Whatever brought you here — a relocation, a lien, a cloud on title, a listing, a referral, a vendor job, or a housing need — every milestone in that issue is visible in real time to everyone touching it: you, our team, agents, brokers, lenders, title, escrow.",
  "What's live today: your Dyson & Dyson team keeps a live roadmap current on every client, agent, vendor, and corporate account we take on — across all six portals.",
  "What we're building toward: lenders, title, escrow, and every partner network are invited to view — and, as integrations mature, to update — so nothing waits on a phone call.",
  'Every friction point we uncover along the way is logged and reused, so the next person — in any portal, with any need — benefits from lessons learned on the last one.',
];

export default function Transparency() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    base44.entities.TransparencyContent.list().then(rows => {
      const rec = rows.find(r => r.is_live !== false) || rows[0];
      if (rec) setContent(rec);
    }).catch(() => {});
  }, []);

  const bullets = content?.bullets?.length ? content.bullets : DEFAULT_BULLETS;

  return (
    <div className="min-h-screen px-6 py-16" style={{ background: '#0A0B0F' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8" style={{ color: GOLD }} />
            <h1 className="text-3xl sm:text-4xl font-black tracking-widest uppercase" style={{ color: GOLD }}>
              {content?.headline || 'Transparency'}
            </h1>
          </div>
          <p className="text-white/80 text-lg">
            {content?.subheadline || 'The one thing missing in real estate — a live, shared roadmap for every issue and every objective, whichever of our six portals brought you here.'}
          </p>
        </div>

        {/* Charlie explainer — fixed, centered under the 4-box NEWS/RELOCATION/INTELLIGENCE/TRANSPARENCY rail */}
        <div className="fixed z-30 flex justify-center" style={{ top: '152px', right: '12px', width: '386px' }}>
          <button
            type="button"
            onClick={() => content?.video_url && window.open(content.video_url, '_blank')}
            className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            aria-label="Watch Charlie's Transparency explainer"
          >
            <img src={CHARLIE_HEADSHOT} alt="Charlie — Dyson AI Concierge" className="w-full h-full object-cover" />
            {!content?.video_url && (
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/50">
                Video coming soon
              </span>
            )}
          </button>
        </div>

        {/* Visual sample roadmap — shows what "every milestone visible to everyone" looks like */}
        <div className="rounded-xl p-6 mb-8 mt-24" style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: GOLD }}>Sample Roadmap — Everyone Sees This</p>
          <FlowRoadmapLine
            stages={SAMPLE_STAGES}
            stageStatuses={SAMPLE_STATUSES}
            color={GOLD}
            activeStageId={null}
            onSelect={() => {}}
            compact
          />
        </div>

        <ul className="space-y-4">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-white/90">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}