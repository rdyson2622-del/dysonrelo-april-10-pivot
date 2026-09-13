import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, Percent, 
  MapPin, Home, Brain, FileText, Gem, Volume2, 
  CheckCircle2, Clock, DollarSign, Compass, ExternalLink, Info, HelpCircle
} from 'lucide-react';
import CopilotWorkflowExplainerModal from './CopilotWorkflowExplainerModal';
import CharlieBobTagTeamBox from './CharlieBobTagTeamBox';
import CopilotDocumentViewer from './CopilotDocumentViewer';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

const INITIAL_PROPERTIES = {
  '742 Vista Del Mar, La Jolla, CA 92037': {
    address: '742 Vista Del Mar, La Jolla, CA 92037',
    price: 3450000,
    beds: 4,
    baths: 4.5,
    sqft: 3820,
    dom: 64,
    compsPrice: 3200000,
    rebate: 21562,
    risks: [
      '64 days on market — seller price reduction of $150k pending',
      'Coastal Commission permitting boundary: strict exterior remodel restrictions',
      'Recent neighborhood comp sold 7.2% below asking price'
    ],
    lastSoldPrice: 2100000,
    lastSoldYear: 2019
  },
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253': {
    address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    price: 2150000,
    beds: 4,
    baths: 3,
    sqft: 3240,
    dom: 18,
    compsPrice: 2125000,
    rebate: 13437,
    risks: [
      'HOA rental restriction: minimum 12-month lease required',
      'Dual A/C units are 14 years old — approaching replacement lifecycle'
    ],
    lastSoldPrice: 1420000,
    lastSoldYear: 2021
  },
  '4220 Oak Hollow Terrace, Austin, TX 78746': {
    address: '4220 Oak Hollow Terrace, Austin, TX 78746',
    price: 1850000,
    beds: 3,
    baths: 3.5,
    sqft: 2890,
    dom: 42,
    compsPrice: 1775000,
    rebate: 11562,
    risks: [
      'Travis County reassessment triggers ~18% property tax escalation',
      'Flash flood zone buffer near greenbelt easement'
    ],
    lastSoldPrice: 1150000,
    lastSoldYear: 2018
  }
};

export default function SlideFourPrivateWealth({ onRunAudit }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [explainerStep, setExplainerStep] = useState(1);
  const [activeProperty, setActiveProperty] = useState(INITIAL_PROPERTIES['742 Vista Del Mar, La Jolla, CA 92037']);

  const handleOpenExplainer = (step) => {
    setExplainerStep(step);
    setIsExplainerOpen(true);
  };

  const handleSubmit = (e, customAddr) => {
    if (e) e.preventDefault();
    const targetAddr = customAddr || address;
    if (!targetAddr.trim()) return;

    setIsAuditing(true);
    setAuditComplete(false);

    const matched = INITIAL_PROPERTIES[targetAddr] || {
      address: targetAddr,
      price: 2650000,
      beds: 4,
      baths: 3.5,
      sqft: 3400,
      dom: 36,
      compsPrice: 2490000,
      rebate: 16562,
      risks: [
        'Market comps indicate listing price is ~6% above 90-day tract closed median',
        'Municipal tax basis will reset to purchase price upon escrow close'
      ],
      lastSoldPrice: 1720000,
      lastSoldYear: 2020
    };
    setActiveProperty(matched);

    if (onRunAudit) onRunAudit(targetAddr);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);

      const dossierEl = document.getElementById('copilot-audit-dossier');
      if (dossierEl) {
        dossierEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 700);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
  };

  return (
    <div className="w-full text-left select-none">
      {/* ── HERO SECTION ABOVE THE CREASE (DARK OBSIDIAN / NIGHT VILLA) ── */}
      <div style={{ background: '#050505', color: '#f5f5f5' }}>
        {/* ── TOP HEADER BAR ── */}
        <div className="px-6 sm:px-10 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3.5">
            {/* Free-standing Dyson Logo */}
            <div className="shrink-0 flex items-center">
              <img 
                src={DYSON_LOGO} 
                alt="Dyson & Dyson" 
                className="h-[51px] sm:h-[55px] w-auto object-contain" 
              />
            </div>

            {/* Brand Title */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span 
                  className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  DYSON HOMES
                </span>
                <span 
                  className="font-serif italic text-2xl sm:text-[26px] text-[#D4AF37] leading-none inline-block drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  copilot
                </span>
              </div>
              <span className="hidden sm:inline text-white/30 text-xs">|</span>
              <span className="text-[9px] tracking-widest text-[#D4AF37]/80 uppercase block font-sans">
                EST. 1989 · PRIVATE WEALTH REAL ESTATE
              </span>
            </div>
          </div>

          {/* Audio Listen Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAudio}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">{isPlayingAudio ? 'Audio Playing...' : 'Listen: 30s Tag-Team Intro'}</span>
              <span className="sm:hidden">Audio</span>
            </button>
          </div>
        </div>

        {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
        <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h1 
              className="font-normal text-white leading-[1.15] tracking-tight text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              <span className="flex items-baseline justify-center gap-3 leading-tight">
                <span className="text-xl sm:text-2xl lg:text-3xl font-light text-white/80 tracking-wide">
                  Meet
                </span>
                <span className="text-4xl sm:text-5xl lg:text-[62px] font-semibold italic text-[#D4AF37] leading-none drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)]">
                  copilot
                </span>
              </span>
              <span className="block text-lg sm:text-2xl lg:text-[25px] text-white/90 font-normal tracking-normal mt-2">
                The First Personal Human &amp; AI Real Estate Assistant
              </span>
            </h1>

            {/* Search Bar — Directly under heading */}
            <form onSubmit={handleSubmit} className="pt-1">
              <div className="flex items-center bg-[#141414] rounded-2xl border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mr-1.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste any address (e.g., 742 Vista Del Mar, La Jolla, CA 92037)"
                  className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-white/40 font-normal"
                />
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] hover:brightness-105 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>{isAuditing ? 'Auditing...' : 'Send'}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </form>

            {/* Quick Sample Search Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37]/80 tracking-wider">
                Sample Lookups:
              </span>
              {SAMPLE_SEARCHES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setAddress(chip);
                    handleSubmit(null, chip);
                  }}
                  className="text-[10.5px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37] text-white/90 font-medium transition-all cursor-pointer truncate max-w-[200px]"
                >
                  {chip.split(',')[0]}
                </button>
              ))}
            </div>

            <p className="text-sm text-white/70 leading-relaxed font-normal pt-1">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161208] border-2 border-[#D4AF37] text-xs text-white shadow-md font-medium">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>When searching MLS: <strong className="text-amber-300">Do not request an agent</strong> — vet the property here first to save thousands in rebates &amp; choose vetted representation.</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Independent fiduciary match — never the listing agent.</span>
              </div>
            </div>

            {/* 3 Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white">Honest comps</span>
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  Institutional-grade comps. Real market, not marketing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white">Hidden risks</span>
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  Natural, title, flood, zoning, and neighborhood risk intelligence.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white">Closing cost credit</span>
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  Your rebate, clearly estimated. Fiduciary first.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Night Luxury Hillside Estate */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
            <img 
              src={NIGHT_HILLSIDE_ESTATE} 
              alt="Luxury Estate at Night" 
              className="w-full h-full object-cover origin-bottom-left scale-[1.20] translate-y-[2%] -translate-x-[2%] transition-transform duration-700"
            />

            {/* Top-right dark sky gradient overlay */}
            <div className="absolute top-0 right-0 w-36 h-16 bg-gradient-to-bl from-[#0a0d14]/95 via-[#0d121c]/70 to-transparent pointer-events-none rounded-tr-2xl" />

            {/* Active Audit Status Indicator */}
            {auditComplete && (
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-[#10b981]/60 text-white text-xs flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span className="text-[11px] font-semibold truncate">
                    Audit Ready for {address.split(',')[0]}
                  </span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase">
                  VIEW REPORT &darr;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LOWER SECTION BELOW THE CREASE (SIGNATURE DYSON TAN #ede0cc) ── */}
      <div 
        className="w-full px-6 sm:px-10 py-8 space-y-6 border-t border-[#d8cab6]/60"
        style={{ background: '#ede0cc', color: '#1a1815' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold tracking-widest text-[#0a0a0a] uppercase">
            HOW DYSON HOMES <span className="font-serif italic text-base text-[#854d0e] normal-case" style={{ fontFamily: 'Cormorant Garamond, serif' }}>copilot</span> WORKS
          </span>
          <span className="text-xs text-[#554c40] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            Click any step below for full detailed guide &amp; examples
          </span>
        </div>

        {/* HIGH-VISIBILITY BUYER GUIDANCE BANNER */}
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-xl text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-[13px] font-black tracking-wider uppercase text-[#D4AF37]">
                  CRITICAL BUYER ADVICE WHEN BROWSING MLS:
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold uppercase tracking-wide">
                  DO NOT REQUEST AN AGENT ON PORTAL SITES
                </span>
              </div>
              <p className="text-xs sm:text-[12.5px] text-white/90 leading-snug">
                When searching on Realtor.com, Homes.com, or Zillow, <strong>never click &ldquo;Request an Agent&rdquo; or &ldquo;Contact Agent&rdquo;</strong>. Instead, simply copy the address and <strong>vet the property here first</strong>. You&rsquo;ll save thousands in closing cash rebates while making a far more vetted choice of both property and fiduciary agent representation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleOpenExplainer(1)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] hover:brightness-105 text-black font-bold text-xs whitespace-nowrap shadow-md transition-all cursor-pointer shrink-0"
          >
            Read Full Guide
          </button>
        </div>

        {/* Charlie & Bob Dyson Tag-Team Box */}
        <CharlieBobTagTeamBox onOpenExplainer={handleOpenExplainer} />

        {/* ── NEW DIGITAL DOCUMENT VIEWER (LOADED BELOW LANDING PAGE FIRST) ── */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0a0a0a]">
              LIVE GENERATED AUDIT ARTIFACT (BELOW THE FOLD)
            </span>
            <span className="text-[11px] text-[#554c40] font-medium">
              Audit for: {activeProperty.address}
            </span>
          </div>
          <div className="rounded-2xl border border-[#d8cab6] shadow-xl overflow-hidden bg-white">
            <CopilotDocumentViewer property={activeProperty} />
          </div>
        </div>

        {/* Footer Slogan */}
        <div className="text-center pt-4 space-y-1">
          <p 
            className="text-base sm:text-lg lg:text-xl font-serif italic font-bold text-[#854d0e] tracking-wider"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            &ldquo;IF YOU DON&rsquo;T HAVE A REAL ESTATE COPILOT YOU ARE SIMPLY FLYING BLIND!&rdquo;
          </p>
          <p 
            className="text-xs sm:text-sm font-serif font-semibold text-[#554c40] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            &mdash; Bob Dyson, Founder &amp; Licensed Broker (DRE #00609384)
          </p>
        </div>
      </div>

      {/* Interactive Workflow Explainer Modal */}
      <CopilotWorkflowExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        initialStep={explainerStep}
        onLaunchAudit={(addr) => {
          setAddress(addr);
          handleSubmit(null, addr);
        }}
      />
    </div>
  );
}