import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getFlow } from '@/lib/departmentWorkflows';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import OrderFlowModal from '@/components/roadmap/OrderFlowModal';
import CharliePagePresenter from '@/components/charlie/CharliePagePresenter';

const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";
import {
  ArrowRight, Home, Compass, MapPin, X, CheckCircle2,
  AlertTriangle, Star, Building2, User
} from 'lucide-react';

const GOLD = '#D4AF37';

// Custom flow for "Explore a City" — not in departmentWorkflows because it's
// a consumer-facing discovery path, not an internal desk flow.
const EXPLORE_FLOW = {
  stages: [
    { id: 'discover',  title: 'Discover',  plain: 'Pick a city. See what life looks like.' },
    { id: 'schools',   title: 'Schools',   plain: 'We map the school districts.' },
    { id: 'housing',   title: 'Housing',  plain: 'We show what your budget buys.' },
    { id: 'healthcare',title: 'Healthcare',plain: 'We find the doctors and hospitals.' },
    { id: 'decide',    title: 'Decide',   plain: 'You choose — then we introduce agents.' },
  ],
};

const PILLS = [
  {
    id: 'real_estate_issue',
    label: 'Real Estate Issue',
    icon: Home,
    deskId: 'marketing',
    color: '#D4AF37',
    deskName: 'Marketing',
    tagline: 'Something needs fixing',
    placeholder: 'A listing, a stuck escrow, a seller problem, a contract issue…',
  },
  {
    id: 'relocation',
    label: 'Relocation Roadmap',
    icon: Compass,
    deskId: 'operations',
    color: '#10b981',
    deskName: 'Operations',
    tagline: 'Explore a full move',
    placeholder: 'Where are you moving to? When? What matters most to your family?',
  },
  {
    id: 'explore_city',
    label: 'Explore a City',
    icon: MapPin,
    deskId: 'explore',
    color: '#38bdf8',
    deskName: 'City Guide',
    tagline: 'Just looking around',
    placeholder: "Which city are you curious about? We'll map it before you commit.",
  },
];

function getFlowForPill(pill) {
  if (pill.deskId === 'explore') return EXPLORE_FLOW;
  return getFlow(pill.deskId);
}

// Portal-specific copy — adapts the pitch to the audience
const PORTAL_COPY = {
  consumer: {
    eyebrow: 'The route before the agent',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Tell us what needs fixing. We\'ll map the route — schools, escrow, movers, timing — before you talk to anyone. Then you choose your agent from 3–5 vetted options.',
  },
  agent: {
    eyebrow: 'The route before the referral',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Got a client with a problem? We\'ll map the route before you refer them. Your client sees the Roadmap. You keep the relationship. Dyson manages the move.',
  },
  vendor: {
    eyebrow: 'The route before the pitch',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Got a client who needs help? We\'ll map the route before you pitch your service. Lenders, title, movers — we connect you when the client is ready.',
  },
  admin: {
    eyebrow: 'Your front door',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: '',
  },
};

function getPortalCopy(user) {
  if (!user) return PORTAL_COPY.consumer;
  if (user.role === 'admin') return PORTAL_COPY.admin;
  // Could detect agent/vendor by custom fields — default to consumer for now
  return PORTAL_COPY.consumer;
}

export default function SolutionMapEntry() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPill, setSelectedPill] = useState(PILLS[0]);
  const [inputValue, setInputValue] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // Auto-route subscribed brokerage users to their Broker/Agent Portal
      if (u && u.role !== 'admin' && (u.portal_role === 'brokerage_admin' || u.portal_role === 'broker') && u.brokerage_id) {
        navigate('/brokerage', { replace: true });
      }
    }).catch(() => {});
  }, [navigate]);

  const flow = getFlowForPill(selectedPill);
  const { statuses, activeStageId } = useAnimatedDemoStatuses(flow?.stages);
  const copy = getPortalCopy(user);

  // Two independent live Roadmap demos — Issues + Relocation
  const issuesFlow = getFlow('marketing');
  const relocationFlow = getFlow('operations');
  const { statuses: issuesStatuses, activeStageId: issuesActive } = useAnimatedDemoStatuses(issuesFlow?.stages);
  const { statuses: relocationStatuses, activeStageId: relocationActive } = useAnimatedDemoStatuses(relocationFlow?.stages);
  const exploreFlowDemo = EXPLORE_FLOW;
  const { statuses: exploreStatuses, activeStageId: exploreActive } = useAnimatedDemoStatuses(exploreFlowDemo?.stages);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    if (!user) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-dyson-black text-white flex flex-col">
      <CharliePagePresenter pageKey="solution-map-entry" />

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 pt-28 border-b border-white/5">
        <div />
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/portal')}
                className="text-sm text-gray-400 hover:text-white"
              >
                Switch Portal
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm px-3 py-1.5 rounded-lg gold-btn"
              >
                My Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => base44.auth.redirectToLogin()}
                className="text-sm text-gray-400 hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/subscribe')}
                className="text-sm px-3 py-1.5 rounded-lg gold-btn"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-12">
        <div className="max-w-4xl w-full text-center">
          <div className="flex justify-center mb-4">
            <img src={DYSON_LOGO} alt="Dyson & Dyson" style={{ height: '90px', width: 'auto' }} />
          </div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            {copy.eyebrow}
          </p>
          <h1 className="text-2xl md:text-3xl font-serif font-normal mb-5 leading-tight" style={{ color: '#d8cab6' }}>
            {copy.title} {copy.titleAccent}
          </h1>
          {copy.subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {copy.subtitle}
            </p>
          )}

          {/* Spacer — pushes pill down so it stands alone */}
          <div className="h-[15vh]" />

          {/* ── Input bar ── */}
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ background: '#d8cab6', border: '1px solid #D4AF37' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="relative z-10 w-full bg-transparent px-6 py-[1.3rem] text-black text-lg focus:outline-none transition-colors"
              />
              {!inputValue && (
                <div className="absolute inset-0 flex items-center px-6 overflow-hidden whitespace-nowrap pointer-events-none">
                  <span className="inline-flex animate-marquee text-lg whitespace-nowrap" style={{ color: '#000' }}>
                    {[
                      'A listing',
                      'a stalled escrow',
                      'a buyer or seller issue',
                      'a contract concern',
                      'information on a better plan to list or buy with less stress',
                      'my benefits and issues in moving locally, nationally, or internationally',
                    ].flatMap((text, i, arr) => [
                      <span key={`a-${i}`}>{text}</span>,
                      <span key={`d-${i}`} style={{ color: '#5a5a5a' }}>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>,
                    ])}
                    {[
                      'A listing',
                      'a stalled escrow',
                      'a buyer or seller issue',
                      'a contract concern',
                      'information on a better plan to list or buy with less stress',
                      'my benefits and issues in moving locally, nationally, or internationally',
                    ].flatMap((text, i, arr) => [
                      <span key={`b-${i}`}>{text}</span>,
                      <span key={`f-${i}`} style={{ color: '#5a5a5a' }}>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>,
                    ])}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-[1.3rem] rounded-2xl gold-btn text-sm font-bold"
            >
              Find A Solution
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Spacer — pushes copy below pill down so pill stands alone */}
          <div className="h-[12vh]" />

          <p className="text-center max-w-3xl mx-auto" style={{ color: GOLD, fontSize: '1.3125rem', lineHeight: 1.5 }}>
            If you have a real estate opportunity or issue, Type or Voice your request here then you can visually follow progress, obstacles and results.
          </p>

          <p className="mt-3" style={{ color: '#d8cab6', fontSize: '1.3125rem', lineHeight: 1.5 }}>
            {selectedPill.tagline} · No commitment · We map it first, you decide later
          </p>
        </div>

        {/* ── Three live animated Roadmap demos ── */}
        <div className="max-w-5xl w-full mt-10">
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-widest uppercase animate-pulse" style={{ color: GOLD }}>
              ● Live Demo — Here's what your Roadmap looks like
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Issues */}
            <div className="rounded-xl p-2 sm:p-3" style={{ background: '#0a0a0a', border: `1px solid ${GOLD}30` }}>
              <button
                onClick={() => navigate('/solve-my-story')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all mb-1.5 hover:scale-[1.03]"
                style={{
                  background: selectedPill.id === 'real_estate_issue' ? `${GOLD}20` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${selectedPill.id === 'real_estate_issue' ? GOLD : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPill.id === 'real_estate_issue' ? GOLD : '#888',
                }}
              >
                <Home className="w-3.5 h-3.5" />
                Real Estate Issue
              </button>
              <FlowRoadmapLine
                stages={issuesFlow?.stages || []}
                stageStatuses={issuesStatuses}
                color={GOLD}
                activeStageId={issuesActive}
                onSelect={() => {}}
                compact
              />
            </div>

            {/* Relocation */}
            <div className="rounded-xl p-2 sm:p-3" style={{ background: '#0a0a0a', border: '1px solid rgba(16,185,129,0.30)' }}>
              <button
                onClick={() => navigate('/relocation-intake')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all mb-1.5 hover:scale-[1.03]"
                style={{
                  background: selectedPill.id === 'relocation' ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${selectedPill.id === 'relocation' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPill.id === 'relocation' ? '#10b981' : '#888',
                }}
              >
                <Compass className="w-3.5 h-3.5" />
                Relocation Roadmap
              </button>
              <FlowRoadmapLine
                stages={relocationFlow?.stages || []}
                stageStatuses={relocationStatuses}
                color="#10b981"
                activeStageId={relocationActive}
                onSelect={() => {}}
                compact
              />
            </div>

            {/* Explore City */}
            <div className="rounded-xl p-2 sm:p-3" style={{ background: '#0a0a0a', border: '1px solid rgba(56,189,248,0.30)' }}>
              <button
                onClick={() => navigate('/city-guide')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all mb-1.5 hover:scale-[1.03]"
                style={{
                  background: selectedPill.id === 'explore_city' ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${selectedPill.id === 'explore_city' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPill.id === 'explore_city' ? '#38bdf8' : '#888',
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                Explore a City
              </button>
              <FlowRoadmapLine
                stages={exploreFlowDemo?.stages || []}
                stageStatuses={exploreStatuses}
                color="#38bdf8"
                activeStageId={exploreActive}
                onSelect={() => {}}
                compact
              />
            </div>
          </div>

          {/* Mini legend */}
          <div className="flex justify-center gap-4 mt-3">
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

          {/* AGI intelligence environment copy */}
          <p className="text-center max-w-3xl mx-auto mt-6" style={{ color: GOLD, fontSize: '1.3125rem', lineHeight: 1.5 }}>
            Dyson Real Estate Solutions is a one of a kind AGI intelligence environment supported by 21 AI Assistants that map progress in real time.
          </p>
        </div>

        {/* ── Why Dyson First ── */}
        <div className="max-w-4xl w-full mt-16">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-center mb-6" style={{ color: GOLD }}>
            Why contact Dyson first
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Agent First */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <X className="w-5 h-5" style={{ color: '#ef4444' }} />
                <h3 className="text-lg font-serif" style={{ color: '#ffffff' }}>Go to an Agent First</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />They sell you a house</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />You figure out the rest alone</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />Schools? Escrow? Movers? On you</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />One agent = one opinion</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />No Roadmap, no accountability</li>
              </ul>
            </div>
            {/* Dyson First */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}40` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
                <h3 className="text-lg font-serif" style={{ color: GOLD }}>Go to Dyson First</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />We map the whole route first</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />Schools, escrow, movers, timing</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />Then you choose from 3–5 vetted agents</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />Real-time Roadmap you can watch</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />We manage the move — the agent sells</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Portal audience row ── */}
        <div className="max-w-3xl w-full mt-16">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-center mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Built for every side of the move
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <User className="w-5 h-5 mx-auto mb-2" style={{ color: '#10b981' }} />
              <p className="text-xs font-serif text-white">Families</p>
              <p className="text-[10px] text-gray-500 mt-1">Map the move, then pick your agent</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Building2 className="w-5 h-5 mx-auto mb-2" style={{ color: '#f59e0b' }} />
              <p className="text-xs font-serif text-white">Agents</p>
              <p className="text-[10px] text-gray-500 mt-1">Refer with a Roadmap, keep the client</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Star className="w-5 h-5 mx-auto mb-2" style={{ color: '#a78bfa' }} />
              <p className="text-xs font-serif text-white">Vendors</p>
              <p className="text-[10px] text-gray-500 mt-1">Lenders, title, movers — when ready</p>
            </div>
          </div>
        </div>

      </main>

      {/* ── Order modal ── */}
      {showOrderModal && (
        <OrderFlowModal
          prefill={{
            title: inputValue,
            desk_id: selectedPill.deskId === 'explore' ? 'knowledge' : selectedPill.deskId,
            desk_name: selectedPill.deskName,
          }}
          onClose={() => setShowOrderModal(false)}
          onOrdered={() => {
            setShowOrderModal(false);
            setInputValue('');
            if (user) navigate('/master-show-sheet');
          }}
        />
      )}
    </div>
  );
}