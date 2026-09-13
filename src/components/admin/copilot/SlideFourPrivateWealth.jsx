import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, Percent, 
  MapPin, Home, Brain, FileText, Gem, Volume2, 
  CheckCircle2, Clock, DollarSign, Compass, ExternalLink, Info, HelpCircle
} from 'lucide-react';
import CopilotWorkflowExplainerModal from './CopilotWorkflowExplainerModal';
import CharlieBobTagTeamBox from './CharlieBobTagTeamBox';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

export default function SlideFourPrivateWealth({ onRunAudit }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [explainerStep, setExplainerStep] = useState(1);

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

    if (onRunAudit) onRunAudit(targetAddr);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);

      // Smooth scroll to dossier section if present
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
            {/* #1: Dyson and Dyson Logo - strictly free-standing with no container box or border */}
            <div className="shrink-0 flex items-center">
              <img 
                src={DYSON_LOGO} 
                alt="Dyson & Dyson" 
                className="h-[51px] sm:h-[55px] w-auto object-contain" 
              />
            </div>

            {/* #2: Spelled out DYSON HOMES with copilot mirroring the exact font and style (lowercase) from the headline below */}
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
              <span className="hidden sm:inline text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold">
                PRIVATE REAL ESTATE INTELLIGENCE
              </span>
            </div>
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
              <span className="block text-4xl sm:text-5xl lg:text-[54px] font-medium leading-tight">
                Meet <span className="italic text-[#D4AF37]">copilot</span>
              </span>
              <span className="block text-lg sm:text-2xl lg:text-[25px] text-white/90 font-normal tracking-normal mt-2">
                The First Personal Human &amp; AI Real Estate Assistant
              </span>
            </h1>

            {/* 1. Search Bar (Tan background / Black font) + 2. Tightened & Centered Paste Address Statement */}
            <div className="pt-6 sm:pt-7 space-y-1.5 text-center">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center bg-[#ede0cc] rounded-2xl border-2 border-[#D4AF37]/80 shadow-[0_4px_24px_rgba(212,175,55,0.25)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
                  <MapPin className="w-4 h-4 text-[#854d0e] shrink-0 mr-1.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste property address"
                    className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm outline-none placeholder:text-[#554c40] font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isAuditing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] hover:brightness-105 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <span>{isAuditing ? 'AUDITING...' : 'SEND'}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </form>

              {/* 2. Tightened directly under search pill & centered */}
              <p className="text-xs sm:text-sm text-white/70 leading-normal font-normal">
                Paste address for comps, risks, closing rebate where allowed by law.
              </p>
            </div>

            {/* 3. Try sample is next (Centered, Tan with Black Font) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] text-white/50 uppercase font-semibold">Try sample:</span>
              {SAMPLE_SEARCHES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setAddress(chip);
                    handleSubmit(null, chip);
                  }}
                  className="text-[10.5px] px-2.5 py-1 rounded-lg bg-[#ede0cc] hover:bg-[#f6ebd9] border border-[#d8cab6] hover:border-[#D4AF37] text-[#0a0a0a] font-medium transition-all cursor-pointer truncate max-w-[200px] shadow-sm"
                >
                  {chip.split(',')[0]}
                </button>
              ))}
            </div>

            {/* 4. Trusted and Instant statements are next (Single-line, compact pill, matching gold italic) */}
            <div className="flex flex-col items-center space-y-2 pt-1 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[11px] sm:text-[12.5px] text-[#D4AF37] italic font-medium shadow-sm whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 not-italic" />
                <span className="whitespace-nowrap">Trusted by private wealth. No agent spam or interaction.</span>
              </div>

              {/* Real-time definition text */}
              <p className="text-[11px] sm:text-[12.5px] text-[#D4AF37] italic flex items-center justify-center gap-1.5 text-center leading-normal max-w-xl">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 not-italic" />
                <span>Instant on-screen comps &amp; rebate calculation. Human fiduciary verification delivered in minutes.</span>
              </p>
            </div>
          </div>

          {/* Right Column (5 cols): Night Luxury Villa */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
            <img 
              src={NIGHT_HILLSIDE_ESTATE} 
              alt="Hillside Estate at Night" 
              className="w-full h-full object-cover origin-bottom-left scale-[1.20] translate-y-[2%] -translate-x-[2%] transition-transform duration-700"
            />

            {/* Top-right dark twilight sky blend to eliminate any artifact */}
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
                  SCROLL FOR DOSSIER ↓
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── 4 BOXES SPREAD ACROSS PAGE (UNDER PHOTO & HERO SECTION) ── */}
        <div className="px-6 sm:px-10 pb-7 space-y-2.5">
          {/* Row 1: The Three Boxes (COMPS / RISKS / CLOSING REBATE) - Sleek reduced vertical height */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="py-1.5 px-3.5 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] shadow-sm transition-all flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#854d0e]">
                <TrendingUp className="w-3 h-3 text-[#854d0e] shrink-0" />
                <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase text-[#854d0e]">COMPS &amp; MARKET</span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-[#0a0a0a] leading-tight font-normal pt-0.5">
                AI-powered comps, trends, and valuation insights.
              </p>
            </div>

            <div className="py-1.5 px-3.5 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] shadow-sm transition-all flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#854d0e]">
                <ShieldAlert className="w-3 h-3 text-[#854d0e] shrink-0" />
                <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase text-[#854d0e]">RISKS &amp; DUE DILIGENCE</span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-[#0a0a0a] leading-tight font-normal pt-0.5">
                Hidden risks, title issues, zoning, and red flags.
              </p>
            </div>

            <div className="py-1.5 px-3.5 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] shadow-sm transition-all flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-[#854d0e]">
                <Percent className="w-3 h-3 text-[#854d0e] shrink-0" />
                <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase text-[#854d0e]">CLOSING REBATE</span>
              </div>
              <p className="text-[9.5px] sm:text-[10px] xl:text-[10.5px] text-[#0a0a0a] leading-tight font-normal tracking-tight pt-0.5">
                Where allowed by law. Maximize your ROI with our rebate.
              </p>
            </div>
          </div>

          {/* Row 2: Listen Charlie Box below - Sleek reduced vertical height */}
          <div className="w-full py-2 px-4 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-sm transition-all">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isPlayingAudio ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#0a0a0a] text-[#D4AF37] hover:bg-[#222]'
                }`}
                title="Play Charlie Simmons Brief"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <div>
                <span className="text-[#854d0e] font-bold text-xs sm:text-[13px] block leading-tight">
                  {isPlayingAudio ? 'Charlie Speaking: 15s Property Brief...' : 'Listen: Charlie AI Voice Dossier'}
                </span>
                <span className="text-[#0a0a0a] text-[10.5px] sm:text-[11px] font-normal block leading-tight pt-0.5">
                  Instant property summary backed by Bob Dyson (Broker DRE #00609384)
                </span>
              </div>
            </div>
            <span className="text-[9.5px] font-bold text-[#D4AF37] px-2.5 py-0.5 rounded bg-[#0a0a0a] border border-[#D4AF37]/50 uppercase shrink-0">
              DUAL VOICE
            </span>
          </div>
        </div>
      </div>

      {/* ── HOW COPILOT WORKS SECTION (BELOW THE CREASE - SEAMLESS TAN PAGE BACKGROUND) ── */}
      <div 
        className="w-full px-6 sm:px-10 pb-8 pt-6 border-t border-[#d8cab6] space-y-5"
        style={{ background: '#ede0cc', color: '#0a0a0a' }}
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

        {/* ── THE 5 INTERACTIVE WORKFLOW BOXES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Box 1: BROWSE MLS (Vertical Row of URLs + Chrome Advice + Full Explainer Link) */}
          <div 
            onClick={() => handleOpenExplainer(1)}
            className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#D4AF37]/70 shadow-lg space-y-2 flex flex-col justify-between transition-all cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                    1. BROWSE MLS
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] font-semibold">
                  GUIDE &rarr;
                </span>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[10px] text-white/70 font-medium block">Browse MLS in 1-Click:</span>
                
                {/* VERTICAL ROW OF ALL 3 URLS */}
                <div className="flex flex-col gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                  <a 
                    href="https://www.realtor.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full px-2.5 py-1 rounded-md border border-[#c4b59f] bg-[#ede0cc] hover:bg-white text-[#0a0a0a] text-[10px] font-semibold flex items-center justify-between shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Realtor.com</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#554c40]" />
                  </a>

                  <a 
                    href="https://www.homes.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full px-2.5 py-1 rounded-md border border-[#c4b59f] bg-[#ede0cc] hover:bg-white text-[#0a0a0a] text-[10px] font-semibold flex items-center justify-between shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Homes.com</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#554c40]" />
                  </a>

                  <a 
                    href="https://www.zillow.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full px-2.5 py-1 rounded-md border border-[#c4b59f] bg-[#ede0cc] hover:bg-white text-[#0a0a0a] text-[10px] font-semibold flex items-center justify-between shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Zillow</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#554c40]" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1.5 border-t border-white/10">
              <div className="text-[9px] text-[#D4AF37] flex items-center gap-1 font-medium">
                <Info className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
                <span>Tip: Use Google Chrome to toggle tabs easily</span>
              </div>
              <span className="text-[9px] text-white/40 block">Click for full return instructions</span>
            </div>
          </div>

          {/* Box 2: PASTE ADDRESS (Clickable to Explainer on What We Provide, How & When) */}
          <div 
            onClick={() => handleOpenExplainer(2)}
            className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#D4AF37]/70 shadow-lg space-y-2 flex flex-col justify-between transition-all cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                    2. PASTE ADDRESS
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] font-semibold">
                  HOW &amp; WHEN &rarr;
                </span>
              </div>

              <p className="text-[11px] text-white/80 leading-snug">
                Drop any address or MLS #. Get instant unvarnished comps, risks, and closing rebate.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[9.5px] text-[#10b981] block font-semibold">Zero UI &bull; No forms</span>
              <span className="text-[9px] text-white/40 block">Delivered on screen in 30s &bull; Click to see how</span>
            </div>
          </div>

          {/* Box 3: AI + HUMAN AUDIT (Clickable to Explainer on How We Audit, No Commitment) */}
          <div 
            onClick={() => handleOpenExplainer(3)}
            className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#D4AF37]/70 shadow-lg space-y-2 flex flex-col justify-between transition-all cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                    3. AI + HUMAN
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] font-semibold">
                  AUDIT &rarr;
                </span>
              </div>

              <p className="text-[11px] text-white/80 leading-snug">
                Audited with AI precision &amp; 35+ year licensed broker fiduciary oversight.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[9.5px] text-[#D4AF37] block font-medium">DRE #00609384 &bull; No Commitment</span>
              <span className="text-[9px] text-white/40 block">Click to see how our dual audit works</span>
            </div>
          </div>

          {/* Box 4: DELIVERED (Clickable to Explainer on What We Deliver + Exact Dossier Preview) */}
          <div 
            onClick={() => handleOpenExplainer(4)}
            className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#D4AF37]/70 shadow-lg space-y-2 flex flex-col justify-between transition-all cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                    4. DELIVERED
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] font-semibold">
                  PREVIEW &rarr;
                </span>
              </div>

              <p className="text-[11px] text-white/80 leading-snug">
                Comps, risks &amp; cash closing rebate in one private, unvarnished dossier.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[9.5px] text-[#10b981] block font-medium">Instant Live Dossier</span>
              <span className="text-[9px] text-white/40 block">Click to inspect sample report output</span>
            </div>
          </div>

          {/* Box 5: DECISIONS & ESCROW (Clickable to Explainer on Features, Benefits & Escrow Monitoring) */}
          <div 
            onClick={() => handleOpenExplainer(5)}
            className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#D4AF37]/70 shadow-lg space-y-2 flex flex-col justify-between transition-all cursor-pointer group hover:scale-[1.01]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Gem className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                    5. DECISIONS
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 group-hover:bg-[#D4AF37]/20 group-hover:text-[#D4AF37] font-semibold">
                  REBATE &rarr;
                </span>
              </div>

              <p className="text-[11px] text-white/80 leading-snug">
                Up to 50% rebate credited at closing plus complete fiduciary monitoring through escrow.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[9.5px] text-[#D4AF37] block font-semibold">Escrow Protection &amp; Cash Back</span>
              <span className="text-[9px] text-white/40 block">Click to explore full escrow advocacy</span>
            </div>
          </div>

        </div>

        {/* ── CHARLIE SIMMONS & BOB DYSON TAG-TEAM INTRODUCTION BOX ── */}
        <div className="pt-2">
          <CharlieBobTagTeamBox onOpenExplainer={handleOpenExplainer} />
        </div>

        {/* ── SLOGAN QUOTE ATTRIBUTED TO BOB DYSON ── */}
        <div className="text-center pt-3 pb-2 space-y-1">
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

      {/* ── INTERACTIVE WORKFLOW & EXPLAINER MODAL ── */}
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