import React, { useState, useRef } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';

// Authentic evening luxury estate villa (hero-evening-luxury-clean.png)
const HERO_EVENING = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/efdc69af3_hero-evening-luxury-clean.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

const SCROLL_COPY = "Paste any address or MLS # you obtain from Realtor.com, Zillow, Redfin or Homes.com and we will take a deep dive into that property for you";

export function extractAddressOrMls(raw) {
  if (!raw) return '';
  let str = String(raw).trim();

  // If input is an MLS or property URL (Zillow, Realtor.com, Redfin, Homes.com, etc.)
  if (/^(https?:\/\/|www\.|\w+\.(com|org|net))/i.test(str) || /zillow|realtor|redfin|homes\.com/i.test(str)) {
    try {
      const decoded = decodeURIComponent(str);

      // Zillow URL: /homedetails/7414-Fay-Ave-La-Jolla-CA-92037/16843942_zpid
      const zillowMatch = decoded.match(/homedetails\/([^/?#]+)/i);
      if (zillowMatch && zillowMatch[1]) {
        return zillowMatch[1].replace(/-\d+_zpid.*$/i, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Realtor.com URL: /realestateandhomes-detail/7414-Fay-Ave_La-Jolla_CA_92037_M12345
      const realtorMatch = decoded.match(/realestateandhomes-detail\/([^/?#]+)/i);
      if (realtorMatch && realtorMatch[1]) {
        return realtorMatch[1].replace(/_M\d+.*$/i, '').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Redfin URL: /CA/La-Jolla/7414-Fay-Ave-92037/home/481923
      const redfinMatch = decoded.match(/\/([A-Z]{2})\/([^/]+)\/([^/]+)\/home/i);
      if (redfinMatch) {
        const state = redfinMatch[1];
        const city = redfinMatch[2].replace(/-/g, ' ');
        const streetAndZip = redfinMatch[3].replace(/-/g, ' ');
        return `${streetAndZip}, ${city}, ${state}`.replace(/\s+/g, ' ').trim();
      }

      // Homes.com URL: /property/7414-fay-ave-la-jolla-ca/12345/
      const homesMatch = decoded.match(/property\/([^/?#]+)/i);
      if (homesMatch && homesMatch[1]) {
        return homesMatch[1].replace(/-\d+\/?$/i, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Generic URL path fallback
      const segments = decoded.split('/').filter(Boolean);
      for (const seg of segments.reverse()) {
        if (/\d+/.test(seg) && /[a-z]/i.test(seg) && seg.length > 5) {
          return seg.replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
        }
      }
    } catch (_) {}
  }

  // Handle MLS numbers like "MLS# 24001234" or "MLS 12345" or "NDP2401234"
  if (/^mls\s*#?\s*([a-z0-9]+)/i.test(str)) {
    const match = str.match(/^mls\s*#?\s*([a-z0-9]+)/i);
    return `MLS #${match[1].toUpperCase()}`;
  }

  return str.replace(/\s+/g, ' ').trim();
}

export default function SlideFourPrivateWealth({ onRunAudit, onOpenDossier, onGoToChatCanvas }) {
  const [address, setAddress] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const handleSend = (targetAddr) => {
    const raw = targetAddr || address;
    const cleanAddr = extractAddressOrMls(raw) || '742 Vista Del Mar, La Jolla, CA 92037';
    if (!cleanAddr) return;

    setIsSubmitting(true);
    if (onRunAudit) onRunAudit(cleanAddr);
    if (onOpenDossier) onOpenDossier(cleanAddr);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1200);
  };

  const handleSampleClick = (chip) => {
    setAddress(chip);
    handleSend(chip);
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
              <div 
                className="max-w-[560px] w-full flex items-center rounded-full border border-[#D4AF37] p-1.5 pl-4 transition-all relative overflow-hidden shadow-lg cursor-text bg-black"
                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                onClick={() => inputRef.current?.focus()}
              >
                <div className="relative flex-1 min-w-0 flex items-center h-8 sm:h-9 overflow-hidden">
                  {!address && !isFocused && (
                    <div 
                      className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none text-xs sm:text-sm whitespace-nowrap"
                      style={{ color: '#ffffff' }}
                    >
                      <div className="inline-flex animate-marquee whitespace-nowrap">
                        <span className="mr-14 font-normal" style={{ color: '#ffffff' }}>
                          {SCROLL_COPY}
                        </span>
                        <span className="mr-14 font-normal" style={{ color: '#ffffff' }}>
                          {SCROLL_COPY}
                        </span>
                      </div>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="text"
                    value={address}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setAddress(e.target.value)}
                    onPaste={(e) => {
                      const pasted = e.clipboardData?.getData('text');
                      if (pasted) {
                        const extracted = extractAddressOrMls(pasted);
                        if (extracted) {
                          setAddress(extracted);
                        }
                      }
                    }}
                    placeholder={isFocused && !address ? "Paste address or MLS #..." : ""}
                    className="w-full bg-transparent text-white text-xs sm:text-sm outline-none font-normal min-w-0 z-10 placeholder:text-white/60"
                    style={{ color: '#ffffff' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#202020] text-[#D4AF37] hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border border-[#D4AF37] ml-2 z-10"
                >
                  <span>{isSubmitting ? 'Auditing...' : 'Send'}</span>
                  <span className="text-[#D4AF37]">→</span>
                </button>
              </div>
            </form>

            <p className="text-xs sm:text-[13px] text-[#F3F0E6]/85 leading-tight font-normal px-1 whitespace-nowrap">
              Paste any address to see real comps, property risks, and potential closing cost savings where allowable by law.
            </p>
          </div>

          {/* Sample Lookups: Plain text links / thin borders, no yellow dots, no badges */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-normal text-[#D4AF37] font-sans">
              Sample Lookups:
            </span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSampleClick(chip)}
                className="text-xs px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 active:bg-[#D4AF37] active:text-black text-[#F3F0E6] hover:text-[#D4AF37] font-normal transition-all cursor-pointer border border-white/20 hover:border-[#D4AF37] shadow-sm"
                title={`Click to audit ${chip}`}
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
          <div className="space-y-3.5 text-center">
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="w-6 h-6 rounded-full border border-[#D4AF37] flex items-center justify-center text-xs font-sans font-normal text-[#D4AF37] shrink-0">
                1
              </div>
              <h3 className="text-xs sm:text-sm font-normal text-white font-sans text-center">
                First of all browse your preferred MLS and copy the MLS# or address:
              </h3>
            </div>

            <div className="flex items-center justify-center gap-3.5 flex-wrap pt-1">
              <a
                href="https://www.realtor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-white hover:bg-stone-100 text-black text-xs font-normal transition-colors border border-white inline-flex items-center justify-center text-center shadow-sm"
              >
                <span className="underline decoration-black/40 underline-offset-2">Realtor.com</span>
              </a>
              <a
                href="https://www.homes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-white hover:bg-stone-100 text-black text-xs font-normal transition-colors border border-white inline-flex items-center justify-center text-center shadow-sm"
              >
                <span className="underline decoration-black/40 underline-offset-2">Homes.com</span>
              </a>
              <a
                href="https://www.redfin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-white hover:bg-stone-100 text-black text-xs font-normal transition-colors border border-white inline-flex items-center justify-center text-center shadow-sm"
              >
                <span className="underline decoration-black/40 underline-offset-2">Redfin.com</span>
              </a>
              <a
                href="https://www.zillow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 sm:w-36 py-2 rounded-full bg-white hover:bg-stone-100 text-black text-xs font-normal transition-colors border border-white inline-flex items-center justify-center text-center shadow-sm"
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
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-normal text-[#D4AF37] shrink-0">
                  2
                </div>
                <h4 className="text-xs sm:text-[13px] font-normal text-white font-sans">
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
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-normal text-[#D4AF37] shrink-0">
                  3
                </div>
                <h4 className="text-xs sm:text-[13px] font-normal text-white font-sans">
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
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-normal text-[#D4AF37] shrink-0">
                  4
                </div>
                <h4 className="text-xs sm:text-[13px] font-normal text-white font-sans">
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
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center text-[11px] font-sans font-normal text-[#D4AF37] shrink-0">
                  5
                </div>
                <h4 className="text-xs sm:text-[13px] font-normal text-white font-sans">
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

    </div>
  );
}