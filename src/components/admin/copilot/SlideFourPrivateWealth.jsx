import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, 
  MapPin, Volume2, CheckCircle2, DollarSign, ExternalLink,
  Brain, FileText, ChevronRight, Search
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';

const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

export default function SlideFourPrivateWealth({ onRunAudit, onGoToChatCanvas }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
    }, 500);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
  };

  return (
    <div className="w-full text-left select-none" style={{ background: '#050505', color: '#f5f5f5' }}>
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 sm:px-10 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          {/* Real Dyson & Dyson vertical DD badge — no white side bars, no tear lines */}
          <DysonVerticalBadge height={48} />

          {/* Brand Title with Italicized Copilot */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-baseline gap-2.5">
              <span 
                className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DYSON HOMES
              </span>
              <span 
                className="font-serif italic text-2xl sm:text-3xl font-medium text-[#D4AF37] lowercase leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                copilot
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {onGoToChatCanvas && (
            <button
              type="button"
              onClick={onGoToChatCanvas}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold transition-all cursor-pointer shadow-sm hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Chat Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleAudio}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">{isPlayingAudio ? 'Audio Playing...' : 'Listen to Your Copilots'}</span>
            <span className="sm:hidden">Listen</span>
          </button>
        </div>
      </div>

      {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
      <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Headline: "meet" in white font, smaller than italicized gold "copilot" */}
          <div className="text-center pt-1 pb-2">
            <div className="inline-flex items-baseline justify-center gap-3">
              <span 
                className="text-lg sm:text-2xl lg:text-3xl font-light text-white tracking-wide font-serif"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                meet
              </span>
              <span 
                className="text-3xl sm:text-5xl lg:text-6xl font-serif italic font-medium text-[#D4AF37] lowercase leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                copilot
              </span>
            </div>
            <h2 
              className="text-lg sm:text-2xl lg:text-[25px] text-white/90 font-normal tracking-normal mt-2 font-serif text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              The First Personal Human &amp; AI Real Estate Assistant
            </h2>
          </div>

          {/* Search Bar — Tan Pill with Black Font + Statement on ONE Line */}
          <div className="space-y-1.5 pt-1">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center bg-[#ede0cc] rounded-2xl border-2 border-[#b8920a] shadow-[0_4px_24px_rgba(0,0,0,0.7)] p-2 pl-4 transition-all focus-within:border-[#854d0e] focus-within:ring-1 focus-within:ring-[#854d0e]">
                <MapPin className="w-4 h-4 text-[#854d0e] shrink-0 mr-2" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste any address (e.g., 742 Vista Del Mar, La Jolla, CA 92037)"
                  className="flex-1 bg-transparent text-black text-xs sm:text-sm outline-none placeholder:text-[#554c40] font-semibold"
                />
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="px-6 py-2.5 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/50 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>{isAuditing ? 'Auditing...' : 'Send'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </form>
            <p className="text-[11px] sm:text-xs lg:text-[13px] text-white/80 leading-tight font-normal px-2 whitespace-nowrap">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>
          </div>

          {/* SAMPLE LOOKUPS: Three TAN fill pills, BLACK text, GOLD accents/icons INSIDE */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
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
                className="text-xs px-3 py-1.5 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-[#0a0a0a] font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border border-[#c4b59f]"
              >
                <MapPin className="w-3 h-3 text-[#b8920a]" />
                <span>{chip.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-xs text-[#D4AF37] shadow-sm whitespace-nowrap font-medium">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-[#D4AF37] whitespace-nowrap font-medium">We are an independent research entity - no spam calls or agent involvement</span>
          </div>
        </div>

        {/* Right Column (5 cols): Night Luxury Hillside Estate */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
          <img 
            src={NIGHT_HILLSIDE_ESTATE} 
            alt="Luxury Estate at Night" 
            className="w-full h-full object-cover origin-bottom-left scale-[1.20] translate-y-[2%] -translate-x-[2%]"
          />
          {auditComplete && (
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-[#10b981]/60 text-white text-xs flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-[11px] font-semibold truncate">
                  Audit Ready for {address.split(',')[0]}
                </span>
              </div>
              <span className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase">
                REPORT GENERATED &darr;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── 3 OVER 4 SPREAD ACROSS ENTIRE PAGE (COMPS / RISKS / REBATE + 4 STEPS) ── */}
      <div className="px-6 sm:px-10 pb-8 space-y-6">
        {/* Top Row: 3 Boxes Across */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Comps & Market Intelligence */}
          <div className="relative p-5 rounded-lg bg-[#0e0e0e] border border-[#D4AF37]/50 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 38h36" />
                <path d="M12 38V26" />
                <path d="M18 38V20" />
                <path d="M24 38V14" />
                <path d="M30 38V10" />
                <circle cx="34" cy="32" r="7" />
                <path d="m39 37 5 5" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-sans">
                COMPS &amp; MARKET INTELLIGENCE
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                AI-powered comps, trends, and valuation <span className="text-[#D4AF37] font-semibold">insights.</span>
              </p>
            </div>
          </div>

          {/* Box 2: Risks & Due Diligence */}
          <div className="relative p-5 rounded-lg bg-[#0e0e0e] border border-[#D4AF37]/50 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 6s14 4 14 14c0 14-14 22-14 22S10 34 10 20c0-10 14-14 14-14z" />
                <path d="M24 16v10" />
                <circle cx="24" cy="31" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-sans">
                RISKS &amp; DUE DILIGENCE
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                Hidden risks, title issues, zoning, and red flags—<span className="text-[#D4AF37] font-semibold">before you commit.</span>
              </p>
            </div>
          </div>

          {/* Box 3: Closing Rebate */}
          <div className="relative p-5 rounded-lg bg-[#0e0e0e] border border-[#D4AF37]/50 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="18" />
                <circle cx="18" cy="18" r="2.5" fill="currentColor" />
                <circle cx="30" cy="30" r="2.5" fill="currentColor" />
                <path d="m16 32 16-16" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-sans">
                CLOSING REBATE
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                Where allowed by law. <span className="text-[#D4AF37] font-semibold">Maximize your ROI</span> with our rebate.
              </p>
            </div>
          </div>
        </div>

        {/* Divider: HOW DYSON HOMES COPILOT WORKS */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#D4AF37]/30 w-full" />
          <div className="absolute px-6 bg-[#050505] text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase whitespace-nowrap">
            HOW DYSON HOMES COPILOT WORKS
          </div>
        </div>

        {/* Top Line: Browse MLS Spread Across & Centered Directly Below Header */}
        <div className="flex items-center justify-center gap-3 pb-2 pt-1 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
            <Search className="w-4 h-4 text-[#D4AF37]" />
            <span>BROWSE MLS:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a 
              href="https://www.realtor.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-[#0a0a0a] text-xs font-semibold border border-[#c4b59f] inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Realtor.com</span>
              <ExternalLink className="w-3 h-3 text-[#854d0e]" />
            </a>
            <a 
              href="https://www.homes.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-[#0a0a0a] text-xs font-semibold border border-[#c4b59f] inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Homes.com</span>
              <ExternalLink className="w-3 h-3 text-[#854d0e]" />
            </a>
            <a 
              href="https://www.zillow.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-[#0a0a0a] text-xs font-semibold border border-[#c4b59f] inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Zillow</span>
              <ExternalLink className="w-3 h-3 text-[#854d0e]" />
            </a>
          </div>
        </div>

        {/* 4 Steps Across (Original Position Restored) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2">
          {/* Step 1 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">PASTE ADDRESS</h4>
              <p className="text-[11px] text-white/70 leading-tight">Share the property details.</p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#D4AF37]/60 hidden lg:block shrink-0" />

          {/* Step 2 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <Brain className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI + HUMAN ANALYSIS</h4>
              <p className="text-[11px] text-white/70 leading-tight">Copilot analyzes with AI precision and human expertise.</p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#D4AF37]/60 hidden lg:block shrink-0" />

          {/* Step 3 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">INTELLIGENCE DELIVERED</h4>
              <p className="text-[11px] text-white/70 leading-tight">Comps, risks, and rebate insights in one private report.</p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#D4AF37]/60 hidden lg:block shrink-0" />

          {/* Step 4 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 12L2 9z"/>
                <path d="M2 9h20"/>
                <path d="m10 3 2 6-2 12"/>
                <path d="m14 3-2 6 2 12"/>
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">BETTER DECISIONS</h4>
              <p className="text-[11px] text-white/70 leading-tight">Close with confidence. Keep more wealth.</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}