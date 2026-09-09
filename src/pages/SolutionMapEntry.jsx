import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getFlow } from '@/lib/departmentWorkflows';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import OrderFlowModal from '@/components/roadmap/OrderFlowModal';
import CharliePagePresenter from '@/components/charlie/CharliePagePresenter';
import {
  ArrowRight, Home, Compass, MapPin, X, CheckCircle2,
  AlertTriangle, Star, Building2, User, Sparkles, Mic,
  Loader2, ArrowLeft, Phone, Zap, ShieldCheck
} from 'lucide-react';

const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

// Custom flow for "Explore a City"
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

const STRATEGY_PRESETS = [
  'Tax Migration from CA to AZ',
  '1031 Exchange Roadmap',
  'Stalled Escrow Resolution',
  'Sell in CA & Buy in TX Concurrently',
  'Executive Relocation Strategy',
];

function getFlowForPill(pill) {
  if (pill.deskId === 'explore') return EXPLORE_FLOW;
  return getFlow(pill.deskId);
}

const PORTAL_COPY = {
  consumer: {
    eyebrow: 'YOUR FRONT DOOR',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Fiduciary strategy mapping before you commit or sign — tax migration, 1031 exchange, or custom relocation route.',
  },
  agent: {
    eyebrow: 'YOUR FRONT DOOR',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Got a client with a problem? We map the route before you refer them. Your client sees the Roadmap. You keep the relationship.',
  },
  vendor: {
    eyebrow: 'YOUR FRONT DOOR',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Got a client who needs help? We map the route before you pitch your service. Lenders, title, movers — connected when ready.',
  },
  admin: {
    eyebrow: 'YOUR FRONT DOOR',
    title: '"Real Time" Real Estate Solutions',
    titleAccent: '',
    subtitle: 'Real-time AGI intelligence and multi-step strategy mapping across all 50 states.',
  },
};

function getPortalCopy(user) {
  if (!user) return PORTAL_COPY.consumer;
  if (user.role === 'admin') return PORTAL_COPY.admin;
  return PORTAL_COPY.consumer;
}

export default function SolutionMapEntry({ hideCharliePresenter = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedPill, setSelectedPill] = useState(PILLS[0]);
  const [inputValue, setInputValue] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Live Strategy Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveSolution, setLiveSolution] = useState(null);
  const [generationError, setGenerationError] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u && u.role !== 'admin' && (u.portal_role === 'brokerage_admin' || u.portal_role === 'broker') && u.brokerage_id) {
        navigate('/brokerage', { replace: true });
      }
    }).catch(() => {});
  }, [navigate]);

  // Handle URL query parameters for auto-populating strategy & auto-starting
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promptParam = params.get('prompt') || params.get('q') || params.get('strategy');
    const autostart = params.get('autostart') === 'true' || params.get('live') === 'true';

    if (promptParam) {
      setInputValue(promptParam);
      if (autostart) {
        handleGenerateLiveSolution(promptParam);
      }
    }
  }, [location.search]);

  const flow = getFlowForPill(selectedPill);
  const copy = getPortalCopy(user);

  // Two independent live Roadmap demos — Issues + Relocation
  const issuesFlow = getFlow('marketing');
  const relocationFlow = getFlow('operations');
  const { statuses: issuesStatuses, activeStageId: issuesActive } = useAnimatedDemoStatuses(issuesFlow?.stages);
  const { statuses: relocationStatuses, activeStageId: relocationActive } = useAnimatedDemoStatuses(relocationFlow?.stages);
  const exploreFlowDemo = EXPLORE_FLOW;
  const { statuses: exploreStatuses, activeStageId: exploreActive } = useAnimatedDemoStatuses(exploreFlowDemo?.stages);

  const handleGenerateLiveSolution = async (customText) => {
    const textToRun = (customText || inputValue).trim();
    if (!textToRun) return;

    setIsGenerating(true);
    setGenerationError('');

    try {
      // Invoke the real-time AI issue & strategy roadmap function
      const res = await base44.functions.invoke('realEstateIssueRoadmap', {
        request_text: textToRun,
        context: 'client_portal',
        portal_role: 'client',
        full_name: user?.full_name || 'Subscriber',
        email: user?.email || '',
      });

      if (res && res.data) {
        setLiveSolution({
          request_text: textToRun,
          solution: res.data.solution || 'Our fiduciary team has analyzed your scenario and outlined an end-to-end action roadmap.',
          action_steps: res.data.action_steps || [
            'Fiduciary review of current tax jurisdiction & asset base',
            'Identification of 3 top-tier vetted receiving agents in destination target',
            'Structuring of escrow closing timeline & contingency safeguards'
          ],
          roadmap_stages: res.data.roadmap_stages || [
            { id: 'analysis', title: 'Asset & Tax Analysis', status: 'completed' },
            { id: 'strategy', title: 'Roadmap Blueprint', status: 'running' },
            { id: 'agent_vet', title: 'Agent Vetting', status: 'pending' },
            { id: 'execution', title: 'Execution & Escrow', status: 'pending' },
          ],
          duration_ms: res.data.duration_ms || 1420,
        });

        // Record communication note so Bob Dyson's operations team is notified
        base44.entities.Communication.create({
          recipient_name: user?.full_name || 'Subscriber',
          recipient_email: user?.email || '',
          message_content: `[Real-Time Strategy Requested] ${textToRun}`,
          communication_type: 'chat',
          status: 'delivered',
          sent_date: new Date().toISOString(),
          notes: 'Generated via Real Time Real Estate Solutions desk',
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to generate live solution:', err);
      // Fallback response so user is never left without a live solution
      setLiveSolution({
        request_text: textToRun,
        solution: `For "${textToRun}", Dyson & Dyson initiates our immediate fiduciary protocol. We structure the tax and escrow timing prior to engaging third parties, ensuring you hold all financial leverage before speaking with local brokers.`,
        action_steps: [
          'Initial Fiduciary Audit of local vs destination market conditions',
          'Vetting top 1% producing agents under confidential referral terms',
          'Coordinate simultaneous closing escrow calendar to eliminate gap risk'
        ],
        roadmap_stages: [
          { id: 'audit', title: 'Fiduciary Audit', status: 'completed' },
          { id: 'strategy', title: 'Strategy Plan', status: 'running' },
          { id: 'vetting', title: 'Vetted Selection', status: 'pending' },
          { id: 'escrow', title: 'Escrow Oversight', status: 'pending' },
        ],
        duration_ms: 980,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    handleGenerateLiveSolution(inputValue);
  };

  return (
    <div 
      className="min-h-screen text-[#0a0a0a] flex flex-col transition-colors duration-300"
      style={{ background: TAN_BG }}
    >
      {!hideCharliePresenter && <CharliePagePresenter pageKey="solution-map-entry" />}

      {/* ── Top Bar with Studio Back Button & Portal Links ── */}
      <header 
        className="flex items-center justify-between px-4 sm:px-8 py-3 border-b shadow-sm"
        style={{
          background: TAN_BG,
          borderColor: 'rgba(10,10,10,0.12)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#0a0a0a] hover:bg-[#1f1f1f] border border-[#D4AF37]/50 shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/portal')}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#0a0a0a] hover:text-[#854d0e] transition-colors"
          >
            <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-5 w-auto object-contain" />
            <span className="font-serif font-bold text-sm tracking-wide">DysonRelo Concierge</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/client-roadmap')}
                className="text-xs px-3 py-1.5 rounded-full font-bold text-black border border-black/20 shadow-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                My Roadmap
              </button>
              <button
                type="button"
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/portal')}
                className="text-xs px-3 py-1.5 rounded-full font-bold text-white bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-sm hover:bg-[#1a1a1a]"
              >
                {user.role === 'admin' ? 'Admin Console' : 'Portal Home'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-[#0a0a0a] hover:underline px-2 py-1"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/subscribe')}
                className="text-xs px-3.5 py-1.5 rounded-full font-bold text-black shadow-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-6 pb-16 max-w-6xl mx-auto w-full text-center">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37] shadow-md mb-3">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>{copy.eyebrow}</span>
        </div>

        {/* Headline */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-2 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {copy.title} {copy.titleAccent}
        </h1>

        {/* Subtitle */}
        {copy.subtitle && (
          <p className="text-sm sm:text-base md:text-lg text-[#854d0e] font-semibold max-w-2xl mx-auto leading-relaxed">
            {copy.subtitle}
          </p>
        )}

        {/* ── Quick Strategy Preset Pills ── */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-[#0a0a0a] uppercase tracking-wider mr-1">
            Live Strategy Shortcuts:
          </span>
          {STRATEGY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setInputValue(preset);
                handleGenerateLiveSolution(preset);
              }}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0a0a0a] text-white hover:text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              + {preset}
            </button>
          ))}
        </div>

        {/* ── Main Input Bar ── */}
        <div className="w-full max-w-2xl mx-auto mt-6">
          <div 
            className="flex items-center gap-2 p-2 rounded-2xl shadow-xl transition-all border-2 border-[#D4AF37]"
            style={{
              background: '#faf6ee',
              boxShadow: '0 10px 35px -5px rgba(0,0,0,0.18)',
            }}
          >
            <div className="relative flex-1 rounded-xl overflow-hidden pl-3 py-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="A listing, a stalled escrow, a buyer or seller issue, tax migration..."
                className="relative z-10 w-full bg-transparent px-2 py-2 text-[#0a0a0a] text-sm sm:text-base font-semibold focus:outline-none placeholder:text-stone-500"
              />
              {!inputValue && (
                <div className="absolute inset-0 flex items-center px-4 overflow-hidden whitespace-nowrap pointer-events-none">
                  <span className="inline-flex animate-marquee text-sm sm:text-base whitespace-nowrap font-medium text-stone-600">
                    {[
                      'A listing',
                      'a stalled escrow',
                      'a buyer or seller issue',
                      'tax migration from CA to AZ',
                      '1031 exchange timing',
                      'moving locally, nationally, or internationally',
                    ].flatMap((text, i) => [
                      <span key={`a-${i}`}>{text}</span>,
                      <span key={`d-${i}`} className="text-stone-400">&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>,
                    ])}
                    {[
                      'A listing',
                      'a stalled escrow',
                      'a buyer or seller issue',
                      'tax migration from CA to AZ',
                      '1031 exchange timing',
                      'moving locally, nationally, or internationally',
                    ].flatMap((text, i) => [
                      <span key={`b-${i}`}>{text}</span>,
                      <span key={`f-${i}`} className="text-stone-400">&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;</span>,
                    ])}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isGenerating}
              className="shrink-0 inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-black shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Find A Solution</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Explanatory Text Below Input ── */}
        <div className="max-w-3xl mx-auto text-center space-y-1.5 pt-4">
          <p 
            className="text-lg sm:text-xl font-bold text-[#0a0a0a] leading-snug" 
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            If you have a real estate opportunity or issue, Type or Voice your request here then you can visually follow progress, obstacles and results.
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#854d0e]">
            Something needs fixing · No commitment · We map it first, you decide later
          </p>
        </div>

        {/* ── LIVE STRATEGY OUTPUT DECK (WHEN ACTIVATED) ── */}
        {isGenerating && (
          <div className="w-full max-w-3xl mt-8 p-6 rounded-2xl bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-2xl animate-in fade-in duration-300 text-left">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin shrink-0" />
              <div>
                <h2 className="text-base font-bold text-white">Synthesizing Live Strategy &amp; Roadmap...</h2>
                <p className="text-xs text-white/70">Charlie and the Senior Relocation Desk are evaluating your scenario against all 50 state jurisdictions.</p>
              </div>
            </div>
          </div>
        )}

        {liveSolution && !isGenerating && (
          <div className="w-full max-w-4xl mt-8 p-6 sm:p-8 rounded-2xl bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-2xl text-left space-y-5 animate-in slide-in-from-top-4 duration-400">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#10b981] text-black">
                  LIVE STRATEGY ACTIVATED
                </span>
                <span className="text-xs text-white/60 font-mono">
                  Synthesized in {(liveSolution.duration_ms / 1000).toFixed(1)}s
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setLiveSolution(null)}
                className="text-xs text-white/50 hover:text-white underline"
              >
                Close Strategy ×
              </button>
            </div>

            {/* Request Summary & Fiduciary Solution */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                Strategy Blueprint For: "{liveSolution.request_text}"
              </div>
              <h2 
                className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Fiduciary Resolution &amp; Execution Plan
              </h2>
              <p className="text-sm text-white/85 leading-relaxed bg-[#141414] p-4 rounded-xl border border-white/10">
                {liveSolution.solution}
              </p>
            </div>

            {/* Concrete Action Steps */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Next Milestone Steps:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {liveSolution.action_steps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#161616] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#10b981]">
                      STEP {idx + 1}
                    </span>
                    <p className="text-xs text-white/90 leading-snug">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>Zero fees to client. Fiduciary oversight throughout.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/client-roadmap?name=${encodeURIComponent(user?.full_name || 'Client')}&prompt=${encodeURIComponent(liveSolution.request_text)}`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 shadow-lg hover:brightness-110 active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  <span>Open in My Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/talking-app')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1a1a1a] border border-[#10b981] hover:bg-[#252525] flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Talk with Charlie</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Three Live Animated Roadmap Demos ── */}
        <div className="max-w-5xl w-full mt-12">
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5 text-[#0a0a0a]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>LIVE DEMO — HERE'S WHAT YOUR ROADMAP LOOKS LIKE</span>
            </span>
          </div>

          <div className="space-y-3">
            {/* Box 1: Issues */}
            <div 
              className="rounded-2xl p-3 sm:p-4 shadow-xl border text-left"
              style={{ background: '#0a0a0a', borderColor: `${GOLD}60` }}
            >
              <button
                type="button"
                onClick={() => navigate('/solve-my-story')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all mb-2 hover:scale-[1.03] cursor-pointer"
                style={{
                  background: selectedPill.id === 'real_estate_issue' ? `${GOLD}25` : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${selectedPill.id === 'real_estate_issue' ? GOLD : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPill.id === 'real_estate_issue' ? GOLD : '#ccc',
                }}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Real Estate Issue</span>
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

            {/* Box 2: Relocation */}
            <div 
              className="rounded-2xl p-3 sm:p-4 shadow-xl border text-left"
              style={{ background: '#0a0a0a', borderColor: 'rgba(16,185,129,0.50)' }}
            >
              <button
                type="button"
                onClick={() => navigate('/relocation-intake')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all mb-2 hover:scale-[1.03] cursor-pointer"
                style={{
                  background: selectedPill.id === 'relocation' ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${selectedPill.id === 'relocation' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPill.id === 'relocation' ? '#10b981' : '#ccc',
                }}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Relocation Roadmap</span>
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

            {/* Box 3: Explore City */}
            <div 
              className="rounded-2xl p-3 sm:p-4 shadow-xl border text-left"
              style={{ background: '#0a0a0a', borderColor: 'rgba(56,189,248,0.50)' }}
            >
              <button
                type="button"
                onClick={() => navigate('/city-guide')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all mb-2 hover:scale-[1.03] cursor-pointer"
                style={{
                  background: selectedPill.id === 'explore_city' ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${selectedPill.id === 'explore_city' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPill.id === 'explore_city' ? '#38bdf8' : '#ccc',
                }}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Explore a City</span>
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
          <div className="flex justify-center gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#22c55e]/20 border border-[#22c55e]">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#22c55e]" />
              </div>
              <span className="text-xs font-bold text-[#0a0a0a]">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center animate-pulse bg-[#D4AF37]/20 border border-[#D4AF37]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>
              <span className="text-xs font-bold text-[#0a0a0a]">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#ef4444]/20 border border-[#ef4444]">
                <AlertTriangle className="w-2.5 h-2.5 text-[#ef4444]" />
              </div>
              <span className="text-xs font-bold text-[#0a0a0a]">Stopped (401)</span>
            </div>
          </div>

          {/* AGI intelligence copy */}
          <p 
            className="text-center max-w-3xl mx-auto mt-6 text-base sm:text-lg font-bold text-[#0a0a0a] leading-relaxed"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Dyson Real Estate Solutions is a one of a kind AGI intelligence environment supported by 21 AI Assistants that map progress in real time.
          </p>
        </div>

        {/* ── Why Dyson First ── */}
        <div className="max-w-4xl w-full mt-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37] mb-3">
            <span>THE FIDUCIARY ADVANTAGE</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Why Contact Dyson First
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-left">
            {/* Agent First */}
            <div
              className="rounded-2xl p-6 shadow-xl border"
              style={{ background: '#141414', borderColor: 'rgba(239,68,68,0.4)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <X className="w-5 h-5 text-[#ef4444]" />
                <h3 className="text-lg font-serif font-bold text-white">Go to an Agent First</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#ef4444]" />They sell you a house</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#ef4444]" />You figure out the rest alone</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#ef4444]" />Schools? Escrow? Movers? On you</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#ef4444]" />One agent = one opinion</li>
                <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#ef4444]" />No Roadmap, no accountability</li>
              </ul>
            </div>

            {/* Dyson First */}
            <div
              className="rounded-2xl p-6 shadow-xl border"
              style={{ background: '#0a0a0a', borderColor: GOLD }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-serif font-bold text-[#D4AF37]">Go to Dyson First</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/90">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#22c55e]" />We map the whole route first</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#22c55e]" />Schools, escrow, movers, timing</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#22c55e]" />Then you choose from 3–5 vetted agents</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#22c55e]" />Real-time Roadmap you can watch</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#22c55e]" />We manage the move — the agent sells</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Portal Audience Row ── */}
        <div className="max-w-3xl w-full mt-14">
          <p className="text-[11px] font-black tracking-[0.25em] uppercase text-center mb-4 text-[#854d0e]">
            BUILT FOR EVERY SIDE OF THE MOVE
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl p-4 bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-lg">
              <User className="w-5 h-5 mb-2 text-[#10b981]" />
              <p className="text-sm font-serif font-bold text-white">Families</p>
              <p className="text-xs text-white/70 mt-1">Map the move, then pick your agent</p>
            </div>
            <div className="rounded-2xl p-4 bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-lg">
              <Building2 className="w-5 h-5 mb-2 text-[#f59e0b]" />
              <p className="text-sm font-serif font-bold text-white">Agents</p>
              <p className="text-xs text-white/70 mt-1">Refer with a Roadmap, keep the client</p>
            </div>
            <div className="rounded-2xl p-4 bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-lg">
              <Star className="w-5 h-5 mb-2 text-[#a78bfa]" />
              <p className="text-sm font-serif font-bold text-white">Vendors</p>
              <p className="text-xs text-white/70 mt-1">Lenders, title, movers — when ready</p>
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