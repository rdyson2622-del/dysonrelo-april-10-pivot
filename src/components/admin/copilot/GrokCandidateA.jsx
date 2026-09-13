import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, ExternalLink, Info, MapPin, 
  Scale, User, TrendingUp, AlertTriangle, DollarSign, FlaskConical
} from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const LUXURY_VILLA_IMAGE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/3e3531fda_Screenshot2026-09-13at43748AM.png";

export default function GrokCandidateA({ 
  onRunAudit,
  selectedAddress = '',
}) {
  const [inputVal, setInputVal] = useState(selectedAddress);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    setSubmitted(true);
    if (onRunAudit) onRunAudit(inputVal);
    setTimeout(() => setSubmitted(false), 800);
  };

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden border shadow-xl text-left select-none"
      style={{ 
        background: '#ede0cc',
        borderColor: '#d8cab6',
        color: '#1a1815',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 sm:px-10 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#d8cab6]/60">
        
        {/* Left: Dyson & Dyson Logo - free-standing */}
        <div className="flex items-center">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto object-contain" />
        </div>

        {/* Center: Browse MLS links */}
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#554c40]">
            <span className="font-serif text-sm font-medium text-[#332b22]">Browse MLS on</span>
            
            <a 
              href="https://www.realtor.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1 rounded-lg border border-[#c4b59f] bg-[#fbf7f0]/80 hover:bg-white text-[#2a241c] text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Realtor.com</span>
              <ExternalLink className="w-3 h-3 text-[#786a58]" />
            </a>

            <a 
              href="https://www.homes.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1 rounded-lg border border-[#c4b59f] bg-[#fbf7f0]/80 hover:bg-white text-[#2a241c] text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Homes.com</span>
              <ExternalLink className="w-3 h-3 text-[#786a58]" />
            </a>

            <a 
              href="https://www.zillow.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1 rounded-lg border border-[#c4b59f] bg-[#fbf7f0]/80 hover:bg-white text-[#2a241c] text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Zillow</span>
              <ExternalLink className="w-3 h-3 text-[#786a58]" />
            </a>
          </div>

          <div className="text-[11px] text-[#786a58] mt-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-[#786a58]" />
            <span>opens in a new tab — return here when ready</span>
          </div>
        </div>

        {/* Right: Admin Lab mock — not live */}
        <div className="flex items-center">
          <div className="px-3.5 py-1.5 rounded-xl border border-[#c4b59f] bg-[#fbf7f0]/80 text-[#554c40] text-xs font-medium flex items-center gap-1.5 shadow-sm">
            <FlaskConical className="w-3.5 h-3.5 text-[#854d0e]" />
            <span>Admin Lab mock — not live</span>
          </div>
        </div>

      </div>

      {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
      <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Headline, Subtext, Trust Pill, Search, 3 Cards */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Headline */}
          <h1 
            className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1a1815] leading-[1.18] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your human &amp; AI-assisted<br />
            private real estate copilot.
          </h1>

          {/* Subtext */}
          <p className="text-sm text-[#4a4237] leading-relaxed max-w-xl font-normal">
            Paste any address to see real comps, property risks,<br className="hidden sm:inline" />
            and your closing rebate — where allowed by law.
          </p>

          {/* Fiduciary Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4ebe0] border border-[#d8cab6] text-xs text-[#3a3227] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#854d0e] shrink-0" />
            <span>No agent spam. Independent fiduciary match — not the listing agent.</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="pt-1">
            <div className="flex items-center bg-[#fbf7f0] rounded-2xl border-2 border-[#e8c84a]/70 shadow-[0_4px_20px_rgba(212,175,55,0.18)] p-1.5 pl-4 transition-all">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Paste any property address"
                className="flex-1 bg-transparent text-[#1a1815] text-sm outline-none placeholder:text-[#8c7e6c] font-normal"
              />
              <button
                type="submit"
                disabled={submitted}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] hover:brightness-105 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
              >
                <span>{submitted ? 'SENDING...' : 'SEND'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 3 Value Cards (from Screenshot 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Card 1: Honest comps */}
            <div className="p-3.5 rounded-xl bg-[#fbf7f0] border border-[#d8cab6] shadow-sm space-y-1">
              <div className="w-6 h-6 rounded-md bg-[#854d0e]/10 text-[#854d0e] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1a1815]">Honest comps</div>
              <div className="text-[11px] text-[#6b5e4f] leading-snug">
                Market-backed comps, not cherry-picked listings.
              </div>
            </div>

            {/* Card 2: Hidden risks */}
            <div className="p-3.5 rounded-xl bg-[#fbf7f0] border border-[#d8cab6] shadow-sm space-y-1">
              <div className="w-6 h-6 rounded-md bg-[#854d0e]/10 text-[#854d0e] flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1a1815]">Hidden risks</div>
              <div className="text-[11px] text-[#6b5e4f] leading-snug">
                Natural risks, title flags, neighborhood &amp; build risks.
              </div>
            </div>

            {/* Card 3: Closing-cost credit */}
            <div className="p-3.5 rounded-xl bg-[#fbf7f0] border border-[#d8cab6] shadow-sm space-y-1">
              <div className="w-6 h-6 rounded-md bg-[#854d0e]/10 text-[#854d0e] flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1a1815]">Closing-cost credit</div>
              <div className="text-[11px] text-[#6b5e4f] leading-snug">
                Your rebate, where allowed by law. Transparent.
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (5 cols): Modern Luxury Stone Villa with Infinity Pool */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-xl border border-[#d8cab6]/80 aspect-[16/11] bg-black">
          <img 
            src={LUXURY_VILLA_IMAGE} 
            alt="Luxury Villa with Pool at Sunset" 
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>

      {/* ── HOW IT WORKS DIVIDER ── */}
      <div className="px-6 sm:px-10 pt-4 pb-2">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#c4b59f]/70 w-full" />
          <div className="absolute px-4 bg-[#ede0cc] text-[11px] font-bold tracking-widest text-[#786a58] uppercase flex items-center gap-2">
            <span>◆</span> HOW IT WORKS <span>◆</span>
          </div>
        </div>
      </div>

      {/* ── 3 HOW IT WORKS PROCESS CARDS (EXACT MATCH TO SCREENSHOT 1) ── */}
      <div className="px-6 sm:px-10 pb-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Step 01 */}
          <div className="p-5 rounded-2xl bg-[#fbf7f0] border border-[#d8cab6]/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-2xl font-serif text-[#854d0e] font-normal"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  01
                </span>
                <span 
                  className="text-base font-serif font-bold text-[#1a1815]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Paste any address
                </span>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <div className="w-7 h-7 rounded text-[#854d0e] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#854d0e]" />
                </div>
                <p className="text-xs text-[#554c40] leading-relaxed">
                  We analyze the property, market, and risk factors in real time.
                </p>
              </div>
            </div>
            <div className="w-12 h-0.5 bg-[#d8cab6]" />
          </div>

          {/* Step 02 */}
          <div className="p-5 rounded-2xl bg-[#fbf7f0] border border-[#d8cab6]/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-2xl font-serif text-[#854d0e] font-normal"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  02
                </span>
                <span 
                  className="text-base font-serif font-bold text-[#1a1815]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Get trusted insights
                </span>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <div className="w-7 h-7 rounded text-[#854d0e] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-[#854d0e]" />
                </div>
                <p className="text-xs text-[#554c40] leading-relaxed">
                  Comps, risks, value impacts, and your closing rebate — where allowed by law.
                </p>
              </div>
            </div>
            <div className="w-12 h-0.5 bg-[#d8cab6]" />
          </div>

          {/* Step 03 */}
          <div className="p-5 rounded-2xl bg-[#fbf7f0] border border-[#d8cab6]/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-2xl font-serif text-[#854d0e] font-normal"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  03
                </span>
                <span 
                  className="text-base font-serif font-bold text-[#1a1815]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Match independently
                </span>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <div className="w-7 h-7 rounded text-[#854d0e] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#854d0e]" />
                </div>
                <p className="text-xs text-[#554c40] leading-relaxed">
                  If you need representation, we introduce fiduciary partners — never the listing agent.
                </p>
              </div>
            </div>
            <div className="w-12 h-0.5 bg-[#d8cab6]" />
          </div>

        </div>
      </div>

    </div>
  );
}