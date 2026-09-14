import React, { useState } from 'react';
import { 
  ShieldCheck, Search, ExternalLink, 
  Brain, FileText, ChevronRight, Plus
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';

const HERO_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/3e3531fda_Screenshot2026-09-13at43748AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

function normalizeAddress(raw) {
  if (!raw) return '';
  return raw.trim().replace(/\s+/g, ' ');
}

export default function SlideFourPrivateWealth({ onRunAudit, onOpenDossier }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');

  // Send is a commented wire to Page 2 / audit
  const handleSend = (targetAddr) => {
    const cleanAddr = normalizeAddress(targetAddr || address);
    if (!cleanAddr) return;
    if (onRunAudit) onRunAudit(cleanAddr);
    if (onOpenDossier) onOpenDossier(cleanAddr);
  };

  // Samples fill only — does not trigger navigation or audit
  const handleSampleClick = (chip) => {
    setAddress(chip);
  };

  return (
    <div 
      className="w-full text-left select-none relative overflow-hidden bg-[#0a0a0a]" 
      style={{ color: '#F3F0E6' }}
    >
      {/* ── BLACK HERO SECTION (BRIGHT HALL: pt-30+ air, px-10, pb-24, max-w-[1180px]) ── */}
      <div className="max-w-[1180px] mx-auto px-6 sm:px-10 pt-30 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column (7 cols): Lockup + Title + Gravitational Pill + Samples + Trust */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Real existing dd-logo-1 and copilot-script-wordmark/sweep lockup */}
          <div className="flex items-center gap-3.5">
            <DysonVerticalBadge height={46} />
            <CopilotSweepLogo size="sm" />
          </div>

          {/* Exact copy: meet CoPilot / The First Human Driven & Personal AI Real Estate Assistant */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span 
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide font-serif"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                meet
              </span>
              <span 
                className="text-4xl sm:text-6xl lg:text-7xl font-serif italic font-medium text-[#D4AF37] leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                CoPilot
              </span>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-[#F3F0E6] font-normal tracking-wide">
              The First Human Driven &amp; Personal AI Real Estate Assistant
            </p>
          </div>

          {/* Gravitational center: editable address + Send in linen ~560px pill with gold outline/glow */}
          <div className="space-y-3 pt-1">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Send is a wire to Page 2 / audit
                handleSend(address);
              }}
            >
              <div className="max-w-[560px] w-full flex items-center bg-[#F3F0E6] rounded-full border border-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.3)] p-1.5 pl-4 transition-all focus-within:ring-2 focus-within:ring-[#D4AF37]">
                <span className="text-[#D4AF37] text-base mr-2 shrink-0">⌖</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Vista Del Mar, La Jolla, CA 92037"
                  className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm outline-none placeholder:text-[#171717]/60 font-semibold min-w-0"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-[#171717] text-[#D4AF37] hover:text-[#F3F0E6] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0 border border-[#D4AF37]/50"
                >
                  <span>Send</span>
                  <span className="text-[#D4AF37]">→</span>
                </button>
              </div>
            </form>

            <p className="text-xs sm:text-[13px] text-[#F3F0E6]/85 leading-tight font-normal px-1">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>
          </div>

          {/* SAMPLE LOOKUPS: Samples fill only */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[10.5px] uppercase font-bold text-[#D4AF37] tracking-wider font-mono">
              SAMPLE LOOKUPS:
            </span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSampleClick(chip)}
                className="text-xs px-3.5 py-1.5 rounded-full bg-[#F3F0E6] hover:bg-[#eae6d8] text-[#0a0a0a] font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border border-[#D4AF37]/40"
                title="Click to fill address into search box"
              >
                <span className="text-[#D4AF37] text-xs">⌖</span>
                <span>{chip.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Independent Trust Banner */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] border border-[#D4AF37] text-xs text-[#D4AF37] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="text-[#D4AF37] text-xs font-medium">
                We are an independent research entity — no spam calls or agent involvement
              </span>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Locked Luxury Estate Asset */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/40 aspect-[16/11] bg-[#0a0a0a] relative">
          <img 
            src={HERO_ESTATE} 
            alt="Dyson Homes Luxury Estate" 
            className="w-full h-full object-cover origin-center scale-[1.02]"
          />
        </div>

      </div>

      {/* ── GENEROUS LINEN "HOW DYSON HOMES COPILOT WORKS" BAND (py-20 sm:py-24 WITH GOLD RULES) ── */}
      <div className="w-full bg-[#F3F0E6] text-[#0a0a0a] border-t border-b border-[#D4AF37]/50 py-20 sm:py-24 px-6 sm:px-10">
        <div className="max-w-[1180px] mx-auto space-y-10">
          
          {/* Gold Rule Divider Header */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#D4AF37] w-full" />
            <div className="absolute px-6 bg-[#F3F0E6] text-xs sm:text-[13px] font-bold tracking-[0.25em] text-[#0a0a0a] uppercase whitespace-nowrap font-mono flex items-center gap-2">
              <span className="text-[#D4AF37]">✦</span>
              <span>HOW DYSON HOMES COPILOT WORKS</span>
              <span className="text-[#D4AF37]">✦</span>
            </div>
          </div>

          {/* Step 1 Line: Preferred MLS Copy + Target=_blank Realtor.com, Homes.com, Zillow */}
          <div className="flex items-center justify-center gap-3 pb-2 flex-wrap text-center">
            <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#0a0a0a] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full border border-[#D4AF37] bg-[#0a0a0a] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>FIRST OF ALL BROWSE YOUR PREFERRED MLS AND COPY THE MLS# OR ADDRESS:</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <a 
                href="https://www.realtor.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-[#D4AF37] text-xs font-semibold border border-[#D4AF37] inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Realtor.com</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </a>
              <a 
                href="https://www.homes.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-[#D4AF37] text-xs font-semibold border border-[#D4AF37] inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Homes.com</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </a>
              <a 
                href="https://www.zillow.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-[#D4AF37] text-xs font-semibold border border-[#D4AF37] inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Zillow</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </a>
            </div>
          </div>

          {/* Steps 2 to 5 Exact */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2">
            {/* Step 2 */}
            <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto bg-white/70 p-3.5 rounded-xl border border-[#D4AF37]/35 shadow-sm">
              <span className="w-5 h-5 rounded-full border border-[#D4AF37] bg-[#0a0a0a] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">PASTE ADDRESS</h4>
                <p className="text-[11.5px] text-[#171717]/80 leading-tight">Share the property details.</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#D4AF37] hidden lg:block shrink-0" />

            {/* Step 3 */}
            <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto bg-white/70 p-3.5 rounded-xl border border-[#D4AF37]/35 shadow-sm">
              <span className="w-5 h-5 rounded-full border border-[#D4AF37] bg-[#0a0a0a] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">AI + HUMAN ANALYSIS</h4>
                <p className="text-[11.5px] text-[#171717]/80 leading-tight">Copilot analyzes with AI precision and human expertise.</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#D4AF37] hidden lg:block shrink-0" />

            {/* Step 4 */}
            <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto bg-white/70 p-3.5 rounded-xl border border-[#D4AF37]/35 shadow-sm">
              <span className="w-5 h-5 rounded-full border border-[#D4AF37] bg-[#0a0a0a] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">INTELLIGENCE DELIVERED</h4>
                <p className="text-[11.5px] text-[#171717]/80 leading-tight">Comps, risks, and rebate insights in one private report.</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#D4AF37] hidden lg:block shrink-0" />

            {/* Step 5 */}
            <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto bg-white/70 p-3.5 rounded-xl border border-[#D4AF37]/35 shadow-sm">
              <span className="w-5 h-5 rounded-full border border-[#D4AF37] bg-[#0a0a0a] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
                5
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
                <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">BETTER DECISIONS</h4>
                <p className="text-[11.5px] text-[#171717]/80 leading-tight">Close with confidence.</p>
              </div>
            </div>
          </div>

          {/* Three White Gold-Border Value Cards with Locked Pack Copy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Box 1: We Run Comps & Market Intel */}
            <div className="relative p-6 rounded-2xl bg-white border-2 border-[#D4AF37] shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] shrink-0 flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 38h36" />
                  <path d="M12 38V26" />
                  <path d="M18 38V20" />
                  <path d="M24 38V14" />
                  <path d="M30 38V10" />
                  <circle cx="34" cy="32" r="7" />
                  <path d="m39 37 5 5" />
                </svg>
              </div>
              <div className="space-y-1.5 min-w-0">
                <h3 className="text-xs sm:text-[13px] font-bold tracking-wide text-[#0a0a0a] uppercase">
                  WE RUN COMPS &amp; MARKET INTEL
                </h3>
                <p className="text-xs text-[#171717]/80 leading-relaxed">
                  AI-powered comps, trends, and valuation <span className="text-[#0a0a0a] font-semibold">insights.</span>
                </p>
              </div>
            </div>

            {/* Box 2: We Explore Risks Thru Due Diligence */}
            <div className="relative p-6 rounded-2xl bg-white border-2 border-[#D4AF37] shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] shrink-0 flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 6s14 4 14 14c0 14-14 22-14 22S10 34 10 20c0-10 14-14 14-14z" />
                  <path d="M24 16v10" />
                  <circle cx="24" cy="31" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div className="space-y-1.5 min-w-0">
                <h3 className="text-xs sm:text-[13px] font-bold tracking-wide text-[#0a0a0a] uppercase">
                  WE EXPLORE RISKS THRU DUE DILIGENCE
                </h3>
                <p className="text-xs text-[#171717]/80 leading-relaxed">
                  Hidden risks, title issues, zoning, and red flags— <span className="text-[#0a0a0a] font-semibold">before you commit.</span>
                </p>
              </div>
            </div>

            {/* Box 3: We Audit Escrow & Compliance */}
            <div className="relative p-6 rounded-2xl bg-white border-2 border-[#D4AF37] shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] shrink-0 flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 4v40" />
                  <path d="M4 14h40" />
                  <path d="m10 24 6-6 6 6" />
                  <path d="m26 24 6-6 6 6" />
                  <path d="M16 14v16" />
                  <path d="M32 14v16" />
                  <circle cx="16" cy="34" r="4" />
                  <circle cx="32" cy="34" r="4" />
                </svg>
              </div>
              <div className="space-y-1.5 min-w-0">
                <h3 className="text-xs sm:text-[13px] font-bold tracking-wide text-[#0a0a0a] uppercase">
                  WE AUDIT ESCROW &amp; COMPLIANCE
                </h3>
                <p className="text-xs text-[#171717]/80 leading-relaxed">
                  Strict escrow shields &amp; lender guidelines— <span className="text-[#0a0a0a] font-semibold">protecting your deposit.</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── FLOATING BOTTOM-RIGHT PILL: REFER A FRIEND + V2V (PRESERVED) ── */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 shadow-2xl">
        <a 
          href="/refer"
          className="px-3.5 py-2 rounded-l-full bg-[#fce38a] hover:bg-[#fad85d] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg"
        >
          <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
          <span>Refer a Friend</span>
        </a>
        <div className="px-3 py-2 rounded-r-full bg-[#0a0a0a] border border-[#fce38a]/40 text-[#fce38a] font-mono text-[11px] font-bold flex items-center gap-1 shadow-lg">
          <span>⌖</span>
          <span>V2V</span>
        </div>
      </div>

    </div>
  );
}