import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getFlow } from '@/lib/departmentWorkflows';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import OrderFlowModal from '@/components/roadmap/OrderFlowModal';
import DnDLogo from '@/components/brand/DnDLogo';
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
    title: 'Real Estate Issues',
    titleAccent: '& Relocation Road Maps',
    subtitle: 'Tell us what needs fixing. We\'ll map the route — schools, escrow, movers, timing — before you talk to anyone. Then you choose your agent from 3–5 vetted options.',
  },
  agent: {
    eyebrow: 'The route before the referral',
    title: 'Client Issues',
    titleAccent: '& Relocation Road Maps',
    subtitle: 'Got a client with a problem? We\'ll map the route before you refer them. Your client sees the roadmap. You keep the relationship. Dyson manages the move.',
  },
  vendor: {
    eyebrow: 'The route before the pitch',
    title: 'Client Issues',
    titleAccent: '& Relocation Road Maps',
    subtitle: 'Got a client who needs help? We\'ll map the route before you pitch your service. Lenders, title, movers — we connect you when the client is ready.',
  },
  admin: {
    eyebrow: 'The front door',
    title: 'Real Estate Issues',
    titleAccent: '& Relocation Road Maps',
    subtitle: '',
  },
};

function getPortalCopy(user) {
  if (!user) return PORTAL_COPY.consumer;
  if (user.role === 'admin') return PORTAL_COPY.admin;
  // Could detect agent/vendor by custom fields — default to consumer for now
  return PORTAL_COPY.consumer;
}

export default function RoadMapEntry() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPill, setSelectedPill] = useState(PILLS[0]);
  const [inputValue, setInputValue] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const flow = getFlowForPill(selectedPill);
  const { statuses, activeStageId } = useAnimatedDemoStatuses(flow?.stages);
  const copy = getPortalCopy(user);

  // Two independent live roadmap demos — Issues + Relocation
  const issuesFlow = getFlow('marketing');
  const relocationFlow = getFlow('operations');
  const { statuses: issuesStatuses, activeStageId: issuesActive } = useAnimatedDemoStatuses(issuesFlow?.stages);
  const { statuses: relocationStatuses, activeStageId: relocationActive } = useAnimatedDemoStatuses(relocationFlow?.stages);
  const [demoMode, setDemoMode] = useState('issues');

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
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-serif gold-text-gradient">Dyson & Dyson</span>
        </div>
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
      <main className="flex-1 flex flex-col items-center px-6 pt-16 pb-12">
        <div className="max-w-4xl w-full text-center">
          <div className="flex justify-center mb-4">
            <DnDLogo size="sm" />
          </div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            {copy.eyebrow}
          </p>
          <h1 className="text-2xl md:text-3xl font-serif font-normal mb-5 leading-tight">
            {copy.title}
            <br />
            <span className="gold-text-gradient">{copy.titleAccent}</span>
          </h1>
          {copy.subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {copy.subtitle}
            </p>
          )}

          {/* ── Pill bar ── */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {PILLS.map((pill) => {
              const Icon = pill.icon;
              const isActive = selectedPill.id === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedPill(pill)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: isActive ? `${pill.color}20` : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isActive ? pill.color : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? pill.color : '#888',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* ── Input bar ── */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={selectedPill.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-36 text-white text-base placeholder-gray-500 focus:outline-none focus:border-dyson-gold/50 transition-colors"
            />
            <button
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gold-btn text-sm font-bold"
            >
              Map My Route
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-3">
            {selectedPill.tagline} · No commitment · We map it first, you decide later
          </p>
        </div>

        {/* ── Two live animated roadmap demos ── */}
        <div className="max-w-5xl w-full mt-14">
          <div className="flex flex-col items-center gap-4 mb-5">
            <span className="text-[10px] font-black tracking-widest uppercase animate-pulse" style={{ color: GOLD }}>
              ● Live Demo — Here's what your roadmap looks like
            </span>
            {/* Toggle between Issues and Relocation */}
            <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => setDemoMode('issues')}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: demoMode === 'issues' ? `${GOLD}20` : 'transparent',
                  border: `1.5px solid ${demoMode === 'issues' ? GOLD : 'transparent'}`,
                  color: demoMode === 'issues' ? GOLD : '#888',
                }}
              >
                <Home className="w-4 h-4" />
                Real Estate Issue
              </button>
              <button
                onClick={() => setDemoMode('relocation')}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: demoMode === 'relocation' ? 'rgba(16,185,129,0.18)' : 'transparent',
                  border: `1.5px solid ${demoMode === 'relocation' ? '#10b981' : 'transparent'}`,
                  color: demoMode === 'relocation' ? '#10b981' : '#888',
                }}
              >
                <Compass className="w-4 h-4" />
                Relocation
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 transition-colors duration-500"
            style={{
              background: '#0a0a0a',
              border: `1px solid ${demoMode === 'issues' ? `${GOLD}30` : 'rgba(16,185,129,0.30)'}`,
            }}
          >
            {demoMode === 'issues' ? (
              <FlowRoadmapLine
                stages={issuesFlow?.stages || []}
                stageStatuses={issuesStatuses}
                color={GOLD}
                activeStageId={issuesActive}
                onSelect={() => {}}
              />
            ) : (
              <FlowRoadmapLine
                stages={relocationFlow?.stages || []}
                stageStatuses={relocationStatuses}
                color="#10b981"
                activeStageId={relocationActive}
                onSelect={() => {}}
              />
            )}
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center">
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e' }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
                </div>
                <p className="text-[10px] text-gray-500">Green = Done</p>
              </div>
              <div className="text-center">
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse"
                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
                </div>
                <p className="text-[10px] text-gray-500">Gold = In Progress</p>
              </div>
              <div className="text-center">
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444' }}
                >
                  <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
                </div>
                <p className="text-[10px] text-gray-500">Red = Stopped (401)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Why Dyson First ── */}
        <div className="max-w-4xl w-full mt-16">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-center mb-6" style={{ color: GOLD }}>
            Why Dyson first
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
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />No roadmap, no accountability</li>
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
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />Real-time roadmap you can watch</li>
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
              <p className="text-[10px] text-gray-500 mt-1">Refer with a roadmap, keep the client</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Star className="w-5 h-5 mx-auto mb-2" style={{ color: '#a78bfa' }} />
              <p className="text-xs font-serif text-white">Vendors</p>
              <p className="text-[10px] text-gray-500 mt-1">Lenders, title, movers — when ready</p>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="max-w-2xl w-full mt-16 text-center">
          <p className="text-sm text-gray-400 mb-4">Ready to see your route?</p>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gold-btn text-base font-bold"
          >
            Map My Route
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[10px] text-gray-600 mt-4">
            Dyson & Dyson Real Estate · The route before the agent
          </p>
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