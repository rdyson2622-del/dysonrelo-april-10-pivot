import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import BrokerageCommandPill from '@/components/brokerage/BrokerageCommandPill';
import BrokerageCommPill from '@/components/brokerage/BrokerageCommPill';
import StudioHeroBanner from '@/components/dnn/StudioHeroBanner';
import {
  Shield, Building2, Users, Megaphone, Star, ArrowRight,
  AlertTriangle, CheckCircle2, Clock, Loader2
} from 'lucide-react';

const GOLD = '#D4AF37';

// ── Five brokerage sub-item flows ──
const ESCROW_FLOW = {
  stages: [
    { id: 'open',       title: 'Open Escrow',   plain: 'Title opened, earnest money in.' },
    { id: 'inspection', title: 'Inspection',    plain: 'Inspection period and contingency release.' },
    { id: 'appraisal',  title: 'Appraisal',     plain: 'Lender appraisal ordered and reviewed.' },
    { id: 'loan',       title: 'Loan Approval', plain: 'Buyer loan cleared to close.' },
    { id: 'ctc',        title: 'Clear to Close',plain: 'Final docs signed, funding confirmed.' },
    { id: 'fund',       title: 'Funding',       plain: 'Recording and keys.' },
  ],
};

const LISTINGS_FLOW = {
  stages: [
    { id: 'new',      title: 'New Listing',   plain: 'Listing agreement signed.' },
    { id: 'media',    title: 'Media',          plain: 'Photos, video, 3D tour.' },
    { id: 'live',     title: 'Live on MLS',   plain: 'Syndicated to all portals.' },
    { id: 'showings', title: 'Showings',       plain: 'Feedback tracked.' },
    { id: 'offer',    title: 'Offer',          plain: 'Negotiated and accepted.' },
    { id: 'sold',     title: 'Sold',           plain: 'Closed and recorded.' },
  ],
};

const AGENTS_FLOW = {
  stages: [
    { id: 'recruit', title: 'Recruit',  plain: 'Identify and invite.' },
    { id: 'onboard', title: 'Onboard',  plain: 'License and IC agreement.' },
    { id: 'assign',  title: 'Assign',   plain: 'Territory and clients.' },
    { id: 'track',   title: 'Track',    plain: 'Production and pipeline.' },
    { id: 'review',  title: 'Review',   plain: 'Quarterly performance.' },
  ],
};

const MARKETING_FLOW = {
  stages: [
    { id: 'plan',    title: 'Plan',    plain: 'Audience and offer.' },
    { id: 'build',   title: 'Build',   plain: 'Creative and copy.' },
    { id: 'launch',  title: 'Launch',  plain: 'Campaign live.' },
    { id: 'track',   title: 'Track',   plain: 'Responses and leads.' },
    { id: 'nurture', title: 'Nurture', plain: 'Follow-up sequence.' },
    { id: 'convert', title: 'Convert', plain: 'Appointment set.' },
  ],
};

const LUXURY_FLOW = {
  stages: [
    { id: 'curate',    title: 'Curate',    plain: 'Select prestige inventory.' },
    { id: 'media',     title: 'Media',     plain: 'Editorial photography and film.' },
    { id: 'feature',   title: 'Feature',   plain: 'Showcase placement.' },
    { id: 'concierge', title: 'Concierge', plain: 'White-glove service.' },
    { id: 'close',     title: 'Close',     plain: 'Discreet transaction.' },
  ],
};

const SUB_ITEMS = [
  { id: 'escrow',    label: 'Escrow Management', icon: Shield,    path: '/brokerage/escrow',    color: GOLD,        flow: ESCROW_FLOW,    tagline: 'Track every transaction milestone' },
  { id: 'listings',  label: 'Listings',           icon: Building2, path: '/brokerage/listings',  color: '#38bdf8',   flow: LISTINGS_FLOW,  tagline: 'Active and sold property inventory' },
  { id: 'agents',    label: 'Agent Records',      icon: Users,     path: '/brokerage/agents',    color: '#10b981',   flow: AGENTS_FLOW,    tagline: 'Your agents and their performance' },
  { id: 'marketing', label: 'Marketing',          icon: Megaphone, path: '/brokerage/marketing', color: '#a78bfa',   flow: MARKETING_FLOW, tagline: 'Campaigns and lead generation' },
  { id: 'luxury',    label: 'Luxury Presence',    icon: Star,      path: '/brokerage/luxury',    color: '#f59e0b',   flow: LUXURY_FLOW,    tagline: 'Prestige portfolio and concierge' },
];

export default function BrokerageDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;
  const { data: brokerage } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) {
        return await base44.entities.Brokerage.get(userBrokerageId);
      }
      return null;
    },
    enabled: !!user,
  });

  const { data: milestones = [], isLoading: milesLoading } = useQuery({
    queryKey: ['brokerageEscrowMilestones'],
    queryFn: () => base44.entities.EscrowMilestone.list('-due_date', 200),
    refetchInterval: 30000,
  });

  // Live-data detection per flow — distinguishes real records from animated demos
  const { data: listings = [] } = useQuery({
    queryKey: ['brokerageLiveListings'],
    queryFn: () => base44.entities.ListingImport.list('-created_date', 50).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: agents = [] } = useQuery({
    queryKey: ['brokerageLiveAgents'],
    queryFn: () => base44.entities.VettedPartner.filter({ status: 'active' }, '-created_date', 50).catch(() => []),
    refetchInterval: 60000,
  });
  const { data: campaigns = [] } = useQuery({
    queryKey: ['brokerageLiveCampaigns'],
    queryFn: () => base44.entities.MarketingCampaign.list('-created_date', 50).catch(() => []),
    refetchInterval: 60000,
  });

  // Animated statuses for each of the five roadmaps
  const escrowAnim = useAnimatedDemoStatuses(ESCROW_FLOW.stages);
  const listingsAnim = useAnimatedDemoStatuses(LISTINGS_FLOW.stages);
  const agentsAnim = useAnimatedDemoStatuses(AGENTS_FLOW.stages);
  const marketingAnim = useAnimatedDemoStatuses(MARKETING_FLOW.stages);
  const luxuryAnim = useAnimatedDemoStatuses(LUXURY_FLOW.stages);

  const animMap = {
    escrow: escrowAnim,
    listings: listingsAnim,
    agents: agentsAnim,
    marketing: marketingAnim,
    luxury: luxuryAnim,
  };

  // Which roadmaps have real data backing them (vs. animated demos/dummies)
  const liveMap = {
    escrow: milestones.length > 0,
    listings: listings.length > 0,
    agents: agents.length > 0,
    marketing: campaigns.length > 0,
    luxury: false,
  };
  const liveCount = Object.values(liveMap).filter(Boolean).length;

  const today = new Date();
  const atRisk = milestones.filter(m => {
    if (m.status === 'completed' || m.status === 'waived') return false;
    if (!m.due_date) return false;
    const days = Math.ceil((new Date(m.due_date) - today) / (1000 * 60 * 60 * 24));
    return days <= 3;
  });
  const completed = milestones.filter(m => m.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <StudioHeroBanner />
      {/* ── Hero ── */}
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8">
        <div className="max-w-4xl w-full text-center">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            {brokerage?.plan_tier === 'founder' ? 'Founder Subscriber · Pilot Brokerage' : 'Brokerage Subscriber'}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-normal mb-3 text-white leading-tight">
            {brokerage?.name || '—'}
          </h1>
          <p className="text-base text-gray-400 max-w-2xl mx-auto mb-2 leading-relaxed">
            Your brokerage roadmaps — five live workflows for escrow, listings, agents, marketing, and luxury presence.
          </p>
          <p className="text-xs text-gray-600">
            {brokerage?.status === 'active' ? '● Subscription active' : brokerage?.status || 'Loading…'}
            {brokerage?.subscribed_at && ` · Subscribed ${new Date(brokerage.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>

        <div className="h-10" />

        {/* ── Communication pill — speak or type to message the platform team ── */}
        <BrokerageCommPill />



        {/* ── Five live animated roadmap demos ── */}
        <div className="max-w-5xl w-full mt-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            {liveCount > 0 ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase animate-pulse" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIVE — {liveCount} roadmap{liveCount !== 1 ? 's' : ''} streaming real data
              </span>
            ) : (
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#666' }}>
                ○ Demo — animated roadmaps (connect data sources to go live)
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {SUB_ITEMS.map(item => {
              const Icon = item.icon;
              const anim = animMap[item.id];
              const isLive = liveMap[item.id];
              return (
                <div
                  key={item.id}
                  className="rounded-xl p-2 sm:p-3 cursor-pointer transition-all hover:scale-[1.005] relative"
                  style={{
                    background: '#0a0a0a',
                    border: isLive ? `1.5px solid #22c55e` : `1px solid ${item.color}30`,
                    boxShadow: isLive ? '0 0 16px rgba(34,197,94,0.15)' : 'none',
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {isLive && (
                    <div className="absolute top-0 right-0 flex items-center gap-1 px-2 py-0.5 rounded-bl-lg rounded-tr-xl text-[8px] font-black tracking-widest uppercase" style={{ background: '#22c55e', color: '#0a0a0a' }}>
                      <span className="w-1 h-1 rounded-full bg-black/60 animate-pulse" />
                      LIVE
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(item.path); }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all mb-1.5"
                    style={{
                      background: `${item.color}18`,
                      border: `1.5px solid ${item.color}`,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                    <ArrowRight className="w-3 h-3 ml-1 opacity-60" />
                  </button>
                  <FlowRoadmapLine
                    stages={item.flow.stages}
                    stageStatuses={anim.statuses}
                    color={item.color}
                    activeStageId={anim.activeStageId}
                    onSelect={() => {}}
                    compact
                  />
                  <p className="text-[10px] text-gray-600 mt-1 px-1">
                    {isLive ? <span style={{ color: '#22c55e' }}>● Live data · </span> : <span style={{ color: '#555' }}>○ Demo · </span>}
                    {item.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mini legend */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e' }}>
                <CheckCircle2 className="w-2.5 h-2.5" style={{ color: '#22c55e' }} />
              </div>
              <span className="text-[9px] text-gray-500">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37' }} />
              </div>
              <span className="text-[9px] text-gray-500">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444' }}>
                <AlertTriangle className="w-2.5 h-2.5" style={{ color: '#ef4444' }} />
              </div>
              <span className="text-[9px] text-gray-500">Stopped (401)</span>
            </div>
          </div>
        </div>

        {/* ── Escrow summary strip ── */}
        <div className="max-w-5xl w-full mt-12">
          <p className="text-[10px] font-black tracking-widest uppercase mb-3 text-center" style={{ color: GOLD }}>
            Escrow at a Glance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryStat label="Active Escrows" value={milesLoading ? '—' : new Set(milestones.map(m => m.escrow_number)).size} color={GOLD} icon={Shield} />
            <SummaryStat label="Total Milestones" value={milesLoading ? '—' : milestones.length} color="#fff" icon={Clock} />
            <SummaryStat label="At Risk (≤3d)" value={milesLoading ? '—' : atRisk.length} color="#ef4444" icon={AlertTriangle} />
            <SummaryStat label="Completed" value={milesLoading ? '—' : completed} color="#22c55e" icon={CheckCircle2} />
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="max-w-2xl w-full mt-12 text-center">
          <p className="text-sm text-gray-400 mb-4">Click any roadmap to open that section</p>
          <button
            onClick={() => navigate('/brokerage/escrow')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gold-btn text-base font-bold"
          >
            Go to Escrow Management
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color, icon: Icon }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-2xl font-serif" style={{ color }}>{value}</p>
        <Icon className="w-4 h-4" style={{ color: `${color}80` }} />
      </div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}