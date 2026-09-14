import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, ExternalLink,
  Brain, FileText, ChevronRight, Search,
  Plus, Users
} from 'lucide-react';

const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

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

  const handleSend = (targetAddr) => {
    const cleanAddr = normalizeAddress(targetAddr || address);
    if (!cleanAddr) return;
    if (onRunAudit) onRunAudit(cleanAddr);
    if (onOpenDossier) onOpenDossier(cleanAddr);
  };

  const handleSampleClick = (chip) => {
    setAddress(chip);
    handleSend(chip);
  };

  return (
    <div 
      className="w-full text-left select-none relative overflow-hidden" 
      style={{ background: '#000000', color: '#f5f5f5' }}
    >
      {/* ── MAIN HERO SECTION (MATCHES LOCKED PAGE 1 PNG EXACTLY) ── */}
      <div className="px-6 sm:px-10 lg:px-12 pt-10 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header Title: "meet" in white serif + "CoPilot" in gold italic */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-3">
              <span 
                className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-wide font-serif"
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

            <p className="text-sm sm:text-base lg:text-lg text-white font-normal tracking-wide">
              The First Human Driven &amp; Personal AI Real Estate Assistant
            </p>
          </div>

          {/* Search Bar — Tan Pill with Black Font + Black "Send →" inside */}
          <div className="space-y-2 pt-1">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(address);
              }}
            >
              <div className="flex items-center bg-[#ede0cc] rounded-full border-2 border-[#c5b59e] shadow-[0_4px_24px_rgba(0,0,0,0.8)] p-1.5 pl-4 transition-all focus-within:ring-2 focus-within:ring-[#D4AF37]">
                <span className="text-[#854d0e] text-base mr-2 shrink-0">⌖</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Vista Del Mar, La Jolla, CA 92037"
                  className="flex-1 bg-transparent text-black text-xs sm:text-sm outline-none placeholder:text-[#554c40] font-semibold min-w-0"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-[#181818] text-[#ede0cc] hover:text-[#D4AF37] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0 border border-black/40"
                >
                  <span>Send</span>
                  <span>→</span>
                </button>
              </div>
            </form>

            <p className="text-xs sm:text-[13px] text-white/90 leading-tight font-normal px-1">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>
          </div>

          {/* SAMPLE LOOKUPS: Three TAN fill pills (Clicking opens Page 2) */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[10.5px] uppercase font-bold text-[#D4AF37] tracking-wider font-mono">
              SAMPLE LOOKUPS:
            </span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSampleClick(chip)}
                className="text-xs px-3.5 py-1.5 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-black font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border border-[#c4b59f]"
              >
                <span className="text-[#854d0e] text-xs">⌖</span>
                <span>{chip.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Independent Trust Banner */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-[#D4AF37]/50 text-xs text-[#D4AF37] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="text-[#D4AF37] text-xs font-medium">
                We are an independent research entity - no spam calls or agent involvement
              </span>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Night Luxury Hillside Estate Image */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative">
          <img 
            src={NIGHT_HILLSIDE_ESTATE} 
            alt="Luxury Estate at Night" 
            className="w-full h-full object-cover origin-center scale-[1.05]"
          />
        </div>

      </div>

      {/* ── HOW DYSON HOMES COPILOT WORKS (MATCHES LOCKED PAGE 1 PNG) ── */}
      <div className="px-6 sm:px-10 lg:px-12 pb-10 space-y-6">
        
        {/* Divider: HOW DYSON HOMES COPILOT WORKS */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#D4AF37]/40 w-full" />
          <div className="absolute px-6 bg-[#000000] text-xs sm:text-[13px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase whitespace-nowrap font-mono">
            HOW DYSON HOMES COPILOT WORKS
          </div>
        </div>

        {/* Step 1 Line: Browse MLS Pills */}
        <div className="flex items-center justify-center gap-3 pb-1 flex-wrap text-center">
          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-white uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
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
              className="px-3.5 py-1 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-black text-xs font-semibold border border-[#c4b59f] inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Realtor.com</span>
              <ExternalLink className="w-3 h-3 text-[#854d0e]" />
            </a>
            <a 
              href="https://www.homes.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3.5 py-1 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-black text-xs font-semibold border border-[#c4b59f] inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Homes.com</span>
              <ExternalLink className="w-3 h-3 text-[#854d0e]" />
            </a>
            <a 
              href="https://www.zillow.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3.5 py-1 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-black text-xs font-semibold border border-[#c4b59f] inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Zillow</span>
              <ExternalLink className="w-3 h-3 text-[#854d0e]" />
            </a>
          </div>
        </div>

        {/* 4 Steps Across (Steps 2 to 5) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-1">
          {/* Step 2 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              2
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

          {/* Step 3 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              3
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

          {/* Step 4 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
              4
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

          {/* Step 5 */}
          <div className="flex items-center gap-3.5 flex-1 w-full lg:w-auto">
            <span className="w-5 h-5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
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
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">BETTER DECISIONS</h4>
              <p className="text-[11px] text-white/70 leading-tight">Close with confidence. Keep more wealth.</p>
            </div>
          </div>
        </div>

        {/* 3 Gold-Bordered Boxes Across */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Box 1: Comps & Market Intelligence */}
          <div className="relative p-5 rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/60 shadow-lg flex items-center gap-3.5">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-9 h-9 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 38h36" />
                <path d="M12 38V26" />
                <path d="M18 38V20" />
                <path d="M24 38V14" />
                <path d="M30 38V10" />
                <circle cx="34" cy="32" r="7" />
                <path d="m39 37 5 5" />
              </svg>
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-xs sm:text-[12.5px] font-bold tracking-wide text-white uppercase whitespace-nowrap">
                WE RUN COMPS &amp; MARKET INTEL
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                AI-powered comps, trends, and valuation <span className="text-[#D4AF37] font-semibold">insights.</span>
              </p>
            </div>
          </div>

          {/* Box 2: Risks & Due Diligence */}
          <div className="relative p-5 rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/60 shadow-lg flex items-center gap-3.5">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-9 h-9 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 6s14 4 14 14c0 14-14 22-14 22S10 34 10 20c0-10 14-14 14-14z" />
                <path d="M24 16v10" />
                <circle cx="24" cy="31" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-xs sm:text-[12.5px] font-bold tracking-wide text-white uppercase whitespace-nowrap">
                WE EXPLORE RISKS THRU DUE DILIGENCE
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                Hidden risks, title issues, zoning, and red flags—<span className="text-[#D4AF37] font-semibold">before you commit.</span>
              </p>
            </div>
          </div>

          {/* Box 3: Escrow & Compliance */}
          <div className="relative p-5 rounded-xl bg-[#0c0c0c] border border-[#D4AF37]/60 shadow-lg flex items-center gap-3.5">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-9 h-9 text-[#D4AF37]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="space-y-1 min-w-0">
              <h3 className="text-xs sm:text-[12.5px] font-bold tracking-wide text-white uppercase whitespace-nowrap">
                WE AUDIT ESCROW &amp; COMPLIANCE
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                Strict escrow shields &amp; lender guidelines—<span className="text-[#D4AF37] font-semibold">protecting your deposit.</span>
              </p>
            </div>
          </div>

        </div>

      </div>



    </div>
  );
}