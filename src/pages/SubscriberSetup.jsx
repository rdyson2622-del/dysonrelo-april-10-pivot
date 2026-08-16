import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import {
  Shield, Building2, Users, Megaphone, Star, ArrowRight, Sparkles,
  AlertTriangle, CheckCircle2, Newspaper, Layers, MapPin, Loader2, Zap
} from 'lucide-react';

const GOLD = '#D4AF37';

const SHOWCASE_FLOWS = {
  escrow: {
    stages: [
      { id: 'open', title: 'Open Escrow' }, { id: 'insp', title: 'Inspection' },
      { id: 'appr', title: 'Appraisal' }, { id: 'loan', title: 'Loan Approval' },
      { id: 'ctc', title: 'Clear to Close' }, { id: 'fund', title: 'Funding' },
    ],
  },
  listings: {
    stages: [
      { id: 'new', title: 'New Listing' }, { id: 'media', title: 'Media' },
      { id: 'live', title: 'Live on MLS' }, { id: 'show', title: 'Showings' },
      { id: 'offer', title: 'Offer' }, { id: 'sold', title: 'Sold' },
    ],
  },
};

const CAPABILITIES = [
  { icon: Shield, title: 'Live Escrow Roadmaps', desc: 'Every transaction milestone tracked in real time with Tesla-style route lines.', color: GOLD },
  { icon: Sparkles, title: 'AI Issue Resolver', desc: 'Raise any issue — missing docs, lending failure, buyer reneg — get an instant expert solution and roadmap detour.', color: '#38bdf8' },
  { icon: AlertTriangle, title: 'Two-Tier Alerts', desc: 'Agent & TC see critical alerts first to fix issues before they ever stress your buyer or seller.', color: '#ef4444' },
  { icon: Newspaper, title: 'Daily News Broadcast', desc: 'AI-generated DNN news shows delivered to your clients every morning.', color: '#a78bfa' },
  { icon: Layers, title: 'Tiered Subscribers', desc: 'Free, Paid, and VIP tiers — manage who gets what across your whole brokerage.', color: '#10b981' },
  { icon: Megaphone, title: 'Marketing Engine', desc: 'Audience targeting, SMS campaigns, and lead nurturing built in.', color: '#f59e0b' },
];

export default function SubscriberSetup() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;

  const { data: brokerage } = useQuery({
    queryKey: ['subscriberSetup', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) return await base44.entities.Brokerage.get(userBrokerageId);
      return null;
    },
    enabled: !!user,
  });

  const escrowAnim = useAnimatedDemoStatuses(SHOWCASE_FLOWS.escrow.stages);
  const listingsAnim = useAnimatedDemoStatuses(SHOWCASE_FLOWS.listings.stages);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>DysonRelo · Subscriber Setup</span>
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/admin')} className="text-xs text-stone-500 hover:text-white">← Back to Admin</button>
        )}
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-8 text-center">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
          {brokerage?.plan_tier === 'founder' ? 'Founder Subscriber · Pilot Brokerage' : 'Brokerage Subscriber'}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 leading-tight">
          {brokerage?.name ? `Welcome, ${brokerage.name}` : 'Your Portal Is Ready'}
        </h1>
        {brokerage?.office_address && (
          <p className="text-sm text-stone-400 flex items-center justify-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} />
            {brokerage.office_address}
          </p>
        )}
        <p className="text-base text-stone-500 max-w-2xl mx-auto leading-relaxed">
          Your brokerage is set up and linked. Here's everything DysonRelo has built for you —
          a complete management tool with Dyson real estate roadmaps, AI issue resolution, and daily news for your clients.
        </p>
        <div className="h-8" />
        <button
          onClick={() => navigate('/brokerage')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gold-btn text-base font-bold"
        >
          Enter My Portal <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Live roadmap showcase */}
      <div className="max-w-4xl mx-auto px-6 pb-10">
        <p className="text-[10px] font-black tracking-widest uppercase text-center mb-4 animate-pulse" style={{ color: GOLD }}>
          ● Live — Your brokerage roadmaps in action
        </p>
        <div className="space-y-4">
          <ShowcaseRow icon={Shield} label="Escrow Roadmap" color={GOLD} flow={SHOWCASE_FLOWS.escrow} anim={escrowAnim} />
          <ShowcaseRow icon={Building2} label="Listings Roadmap" color="#38bdf8" flow={SHOWCASE_FLOWS.listings} anim={listingsAnim} />
        </div>
      </div>

      {/* Capabilities grid */}
      <div className="max-w-5xl mx-auto px-6 pb-14">
        <p className="text-[10px] font-black tracking-widest uppercase text-center mb-5" style={{ color: GOLD }}>
          What DysonRelo executes for your brokerage
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAPABILITIES.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-xl p-4" style={{ background: '#111', border: `1px solid ${c.color}25` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${c.color}15`, border: `1px solid ${c.color}40` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: c.color }} />
                </div>
                <h3 className="text-sm font-serif text-white mb-1">{c.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier showcase */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <p className="text-[10px] font-black tracking-widest uppercase text-center mb-4" style={{ color: GOLD }}>Subscriber Tiers</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { tier: 'Tier 1', label: 'Free', desc: 'Daily news + portal access', color: '#888' },
            { tier: 'Tier 2', label: 'Paid', desc: 'Roadmaps + AI issue resolution', color: GOLD },
            { tier: 'Tier 3', label: 'VIP / Agent', desc: 'Private-label broadcasts + concierge', color: '#a78bfa' },
          ].map(t => (
            <div key={t.tier} className="rounded-xl p-4 text-center" style={{ background: '#111', border: `1px solid ${t.color}40` }}>
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: t.color }}>{t.tier}</p>
              <p className="text-lg font-serif text-white mb-1">{t.label}</p>
              <p className="text-[11px] text-stone-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-16 text-center">
        <Zap className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
        <h2 className="text-2xl font-serif text-white mb-2">Your management tool is live.</h2>
        <p className="text-sm text-stone-500 mb-5">Click below to open your Broker/Agent Portal and start managing escrows, listings, agents, marketing, and luxury presence.</p>
        <button onClick={() => navigate('/brokerage')} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gold-btn text-base font-bold">
          Open Broker/Agent Portal <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ShowcaseRow({ icon: Icon, label, color, flow, anim }) {
  return (
    <div className="rounded-xl p-3" style={{ background: '#0d0d0d', border: `1px solid ${color}30` }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
      </div>
      <FlowRoadmapLine stages={flow.stages} stageStatuses={anim.statuses} color={color} activeStageId={anim.activeStageId} onSelect={() => {}} compact />
    </div>
  );
}