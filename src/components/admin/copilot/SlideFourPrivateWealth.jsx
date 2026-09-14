import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Plus } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';

// Authentic evening luxury estate villa (hero-evening-luxury.png, never daytime hero-estate.jpg)
const HERO_EVENING = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

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
  };

  return (
    <div 
      className="w-full text-left select-none relative overflow-hidden bg-[#0a0a0a]" 
      style={{ color: '#F3F0E6' }}
    >
      {/* ── BLACK HERO SECTION ── */}
      <div className="max-w-[1180px] mx-auto px-6 sm:px-10 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column (7 cols): Official Logo Lockup + Title + Search + Samples + Trust */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Official Logo Badge centered above meet CoPilot */}
          <div className="space-y-3">
            <div className="inline-flex flex-col items-center">
              <DysonVerticalBadge height={106} className="mb-3" />
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
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-[#F3F0E6] font-normal tracking-wide">
              The First Human Driven &amp; Personal AI Real Estate Assistant
            </p>
          </div>

          {/* Gravitational center search: No rings, no outer glow, clean thin border */}
          <div className="space-y-2.5 pt-1">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(address);
              }}
            >
              <div className="max-w-[560px] w-full flex items-center bg-[#F3F0E6] rounded-full border border-[#D4AF37] p-1.5 pl-4 transition-all">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Vista Del Mar, La Jolla, CA 92037"
                  className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm outline-none placeholder:text-[#171717]/60 font-semibold min-w-0"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-[#171717] text-[#D4AF37] hover:text-[#F3F0E6] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border border-[#D4AF37]/50"
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

          {/* SAMPLE LOOKUPS: Plain text links / thin borders, no yellow dots, no badges */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider font-mono">
              SAMPLE LOOKUPS:
            </span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSampleClick(chip)}
                className="text-xs px-3 py-1 rounded-md bg-transparent hover:bg-white/5 text-[#F3F0E6]/90 hover:text-[#D4AF37] font-normal transition-colors cursor-pointer border border-white/20 hover:border-[#D4AF37]"
                title="Click to fill address into search box"
              >
                <span>{chip.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Independent Trust Statement: Plain, clean, no heavy badges */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 text-xs text-[#D4AF37]/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>We are an independent research entity — no spam calls or agent involvement</span>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Evening Luxury Estate Photo (hero-evening-luxury.png) */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#D4AF37]/40 aspect-[16/11] bg-[#0a0a0a] relative shadow-2xl">
          <img 
            src={HERO_EVENING} 
            alt="Dyson Homes Luxury Estate at Evening" 
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>

      {/* ── DYSON SIGNATURE TAN "HOW DYSON HOMES COPILOT WORKS" BAND ── */}
      <div className="w-full bg-[#ede0cc] text-[#0a0a0a] border-t border-b border-[#D4AF37]/40 py-16 sm:py-20 px-6 sm:px-10">
        <div className="max-w-[1180px] mx-auto space-y-8">
          
          {/* Header Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#D4AF37]/60 w-full" />
            <div className="absolute px-6 bg-[#ede0cc] text-xs font-bold tracking-[0.25em] text-[#0a0a0a] uppercase whitespace-nowrap font-mono">
              HOW DYSON HOMES COPILOT WORKS
            </div>
          </div>

          {/* Step 1 Line: Plain "1." with thin-border MLS links */}
          <div className="flex items-center justify-center gap-3 pb-1 flex-wrap text-center">
            <div className="text-xs sm:text-[13px] font-bold text-[#0a0a0a] uppercase tracking-wider">
              <span className="font-mono text-sm text-[#0a0a0a] mr-1.5 font-bold">1.</span>
              <span>FIRST OF ALL BROWSE YOUR PREFERRED MLS AND COPY THE MLS# OR ADDRESS:</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <a 
                href="https://www.realtor.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1 rounded-md bg-white hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-[#D4AF37] text-xs font-medium border border-stone-300 hover:border-[#0a0a0a] inline-flex items-center gap-1 transition-colors"
              >
                <span>Realtor.com</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </a>
              <a 
                href="https://www.homes.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1 rounded-md bg-white hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-[#D4AF37] text-xs font-medium border border-stone-300 hover:border-[#0a0a0a] inline-flex items-center gap-1 transition-colors"
              >
                <span>Homes.com</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </a>
              <a 
                href="https://www.zillow.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1 rounded-md bg-white hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-[#D4AF37] text-xs font-medium border border-stone-300 hover:border-[#0a0a0a] inline-flex items-center gap-1 transition-colors"
              >
                <span>Zillow</span>
                <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </a>
            </div>
          </div>

          {/* Steps 2 to 5: Plain 2. 3. 4. 5., No yellow dots, No clipart, Pure text direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            
            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-white/80 border border-stone-300 space-y-1">
              <div className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                <span className="font-mono text-[#D4AF37] mr-1.5 font-bold">2.</span>
                <span>PASTE ADDRESS</span>
              </div>
              <p className="text-xs text-[#171717]/80 leading-snug">
                Share the property details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-white/80 border border-stone-300 space-y-1">
              <div className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                <span className="font-mono text-[#D4AF37] mr-1.5 font-bold">3.</span>
                <span>AI + HUMAN ANALYSIS</span>
              </div>
              <p className="text-xs text-[#171717]/80 leading-snug">
                CoPilot analyzes with AI precision and human expertise.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-white/80 border border-stone-300 space-y-1">
              <div className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                <span className="font-mono text-[#D4AF37] mr-1.5 font-bold">4.</span>
                <span>INTELLIGENCE DELIVERED</span>
              </div>
              <p className="text-xs text-[#171717]/80 leading-snug">
                Comps, risks, and rebate insights in one private report.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-white/80 border border-stone-300 space-y-1">
              <div className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wider">
                <span className="font-mono text-[#D4AF37] mr-1.5 font-bold">5.</span>
                <span>BETTER DECISIONS</span>
              </div>
              <p className="text-xs text-[#171717]/80 leading-snug">
                Close with confidence.
              </p>
            </div>

          </div>

          {/* Three Pure-Text Value Cards: No decorative SVG clipart art, clean thin borders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            
            {/* Box 1: We Run Comps & Market Intel */}
            <div className="p-6 rounded-xl bg-white border border-[#D4AF37]/70 space-y-2 text-left">
              <h3 className="text-xs sm:text-[13px] font-bold tracking-wide text-[#0a0a0a] uppercase">
                WE RUN COMPS &amp; MARKET INTEL
              </h3>
              <p className="text-xs text-[#171717]/80 leading-relaxed">
                AI-powered comps, trends, and valuation <span className="text-[#0a0a0a] font-semibold">insights.</span>
              </p>
            </div>

            {/* Box 2: We Explore Risks Thru Due Diligence */}
            <div className="p-6 rounded-xl bg-white border border-[#D4AF37]/70 space-y-2 text-left">
              <h3 className="text-xs sm:text-[13px] font-bold tracking-wide text-[#0a0a0a] uppercase">
                WE EXPLORE RISKS THRU DUE DILIGENCE
              </h3>
              <p className="text-xs text-[#171717]/80 leading-relaxed">
                Hidden risks, title issues, zoning, and red flags— <span className="text-[#0a0a0a] font-semibold">before you commit.</span>
              </p>
            </div>

            {/* Box 3: We Audit Escrow & Compliance */}
            <div className="p-6 rounded-xl bg-white border border-[#D4AF37]/70 space-y-2 text-left">
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

      {/* ── FLOATING BOTTOM-RIGHT PILL: REFER A FRIEND + V2V ── */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 shadow-2xl">
        <a 
          href="/refer"
          className="px-3.5 py-2 rounded-l-full bg-[#fce38a] hover:bg-[#fad85d] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg"
        >
          <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
          <span>Refer a Friend</span>
        </a>
        <div className="px-3 py-2 rounded-r-full bg-[#0a0a0a] border border-[#fce38a]/40 text-[#fce38a] font-mono text-[11px] font-bold flex items-center gap-1 shadow-lg">
          <span>V2V</span>
        </div>
      </div>

    </div>
  );
}