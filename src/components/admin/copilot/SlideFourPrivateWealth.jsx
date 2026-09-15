import React, { useState } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';

// Authentic evening luxury estate villa (hero-evening-luxury-clean.png)
const HERO_EVENING = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/efdc69af3_hero-evening-luxury-clean.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

function normalizeAddress(raw) {
  if (!raw) return '';
  return raw.trim().replace(/\s+/g, ' ');
}

export default function SlideFourPrivateWealth({ onRunAudit, onOpenDossier, onGoToChatCanvas }) {
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
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Column (7 cols): Official Logo Lockup + Title + Search + Samples + Trust */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          
          {/* Official Logo Badge centered directly over CoPilot (over the P); meet reduced by 15% */}
          <div className="space-y-3">
            <div className="inline-flex items-end gap-3">
              <span 
                className="text-[26px] sm:text-[31px] lg:text-[41px] font-light text-white tracking-wide font-serif pb-1.5 sm:pb-2 lg:pb-2.5 leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                meet
              </span>
              <div className="inline-flex flex-col items-center">
                <DysonVerticalBadge height={106} className="mb-3" />
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

            <p className="text-xs sm:text-[13px] text-[#F3F0E6]/85 leading-tight font-normal px-1 whitespace-nowrap">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>
          </div>

          {/* Sample Lookups: Plain text links / thin borders, no yellow dots, no badges */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-semibold text-[#D4AF37] font-sans">
              Sample Lookups:
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

        {/* Right Column (5 cols): Evening Luxury Estate Photo (shifted right to give text room, moved up 4%) */}
        <div className="lg:col-span-5 xl:col-span-5 lg:pl-4 rounded-2xl overflow-hidden aspect-[16/11] bg-transparent relative shadow-2xl -translate-y-[4%]">
          <img 
            src={HERO_EVENING} 
            alt="Dyson Homes Luxury Estate at Evening" 
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>

      {/* ── HOW DYSON HOMES COPILOT WORKS ── */}
      <section className="w-full bg-[#0a0a0a] text-[#F3F0E6] border-t border-white/10 py-12 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[1240px] mx-auto space-y-8 font-sans">
          
          {/* Centered Divider with Title */}
          <div className="flex items-center justify-center gap-4 text-xs font-sans tracking-wider text-stone-400">
            <div className="h-[1px] bg-white/15 flex-1" />
            <span className="shrink-0 font-medium">How Dyson Homes CoPilot Works</span>
            <div className="h-[1px] bg-white/15 flex-1" />
          </div>

          {/* Step 1: MLS browse + pills */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border border-[#D4AF37] flex items-center justify-center text-xs font-sans font-bold text-[#D4AF37] shrink-0">
                1
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-white font-sans">
                First of all browse your preferred MLS and copy the MLS# or address:
              </h3>
            </div>

            <div className="flex items-center justify-center gap-3.5 flex-wrap pt-1">
              <a
                href="https://www.realtor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e2d3bd] text-black text-xs font-semibold transition-colors border border-[#ede0cc] inline-flex items-center justify-center text-center shadow-sm"
              >
                <span className="underline decoration-black/40 underline-offset-2">Realtor.com</span>
              </a>
              <a
                href="https://www.homes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e2d3bd] text-black text-xs font-semibold transition-colors border border-[#ede0cc] inline-flex items-center justify-center text-center shadow-sm"
              >
                <span className="underline decoration-black/40 underline-offset-2">Homes.com</span>
              </a>
              <a
                href="https://www.zillow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-[#ede0cc] hover:bg-[#e2d3bd] text-black text-xs font-semibold transition-colors border border-[#ede0cc] inline-flex items-center justify-center text-center shadow-sm"
              >
                <span className="underline decoration-black/40 underline-offset-2">Zillow</span>
              </a>
            </div>
          </div>

          {/* Subtle horizontal rule between step 1 and steps 2-5 */}
          <div className="h-[1px] bg-white/10" />

          {/* Steps 2-5: 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pt-1">
            
            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-bold text-[#D4AF37] shrink-0">
                  2
                </div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-white font-sans">
                  Paste Address
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-400 pl-7 leading-relaxed font-normal font-sans">
                Share the property details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-bold text-[#D4AF37] shrink-0">
                  3
                </div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-white font-sans">
                  AI + Human Analysis
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-400 pl-7 leading-relaxed font-normal font-sans">
                CoPilot analyzes with AI precision and human expertise.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-bold text-[#D4AF37] shrink-0">
                  4
                </div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-white font-sans">
                  Intelligence Delivered
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-400 pl-7 leading-relaxed font-normal font-sans">
                Comps, risks, and rebate insights in one private report.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-bold text-[#D4AF37] shrink-0">
                  5
                </div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-white font-sans">
                  Better Decisions
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-stone-400 pl-7 leading-relaxed font-normal font-sans">
                Close with confidence. Keep more wealth.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── FLOATING BOTTOM-RIGHT PILL: REFER A FRIEND + V2V ── */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 shadow-2xl">
        <a 
          href="/refer"
          className="px-3.5 py-2 rounded-l-full bg-[#fce38a] hover:bg-[#fad85d] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg"
        >
          <Plus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
          <span>Refer a Friend</span>
        </a>
        <div className="px-3 py-2 rounded-r-full bg-[#0a0a0a] border border-[#fce38a]/40 text-[#fce38a] font-mono text-[11px] font-bold flex items-center gap-1 shadow-lg">
          <span>V2V</span>
        </div>
      </div>

    </div>
  );
}