import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, Scale, ShieldAlert, DollarSign, 
  MapPin, FlaskConical, Award
} from 'lucide-react';

const GOLD = '#D4AF37';
const LUXURY_VILLA_NIGHT = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=90";

export default function ObsidianTwilightCandidate({
  onRunAudit,
  selectedAddress = '',
}) {
  const [address, setAddress] = useState(selectedAddress);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!address.trim()) return;
    setIsAuditing(true);
    if (onRunAudit) onRunAudit(address);
    setTimeout(() => setIsAuditing(false), 800);
  };

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden border shadow-2xl text-left select-none"
      style={{ 
        background: '#0a0a0a',
        borderColor: '#262626',
        color: '#f5f5f5',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 sm:px-10 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
        
        {/* Left: Gold Crest & Dyson Homes */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37]">
            <Award className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <span 
              className="font-serif text-lg font-bold tracking-wider text-[#f5f5f5] uppercase block leading-none"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              DYSON HOMES
            </span>
            <span className="text-[9px] tracking-widest text-[#D4AF37]/80 uppercase block mt-0.5">
              EST. 1989 · PRIVATE WEALTH REAL ESTATE
            </span>
          </div>
        </div>

        {/* Right: Admin Lab mock pill */}
        <div className="flex items-center">
          <div className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-white/70 text-xs font-medium flex items-center gap-1.5 shadow-sm">
            <FlaskConical className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Admin Lab mock — not live</span>
          </div>
        </div>

      </div>

      {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
      <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Headline */}
          <h1 
            className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-white leading-[1.18] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your human &amp; AI-assisted<br />
            private real estate <span className="italic">copilot.</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm text-white/70 leading-relaxed max-w-xl font-normal">
            Paste any address to see real comps, property risks,<br className="hidden sm:inline" />
            and your closing rebate — where allowed by law.
          </p>

          {/* Fiduciary Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span>No agent spam. Independent fiduciary match — not the listing agent.</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="pt-1">
            <div className="flex items-center bg-[#141414] rounded-2xl border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mr-1.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste any address (e.g., 72 Beverly Park Ln, Beverly Hills, CA 90210)"
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

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Card 1: Honest comps */}
            <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white">Honest comps</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Institutional-grade comps. Real market, not marketing.
              </p>
            </div>

            {/* Card 2: Hidden risks */}
            <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white">Hidden risks</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Natural, title, flood, zoning, and neighborhood risk intelligence.
              </p>
            </div>

            {/* Card 3: Closing cost credit */}
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

        {/* Right Column (5 cols): Modern Luxury Stone Villa with Infinity Pool */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black">
          <img 
            src={LUXURY_VILLA_NIGHT} 
            alt="Luxury Villa with Pool at Night" 
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>

      {/* ── HOW IT WORKS DIVIDER ── */}
      <div className="px-6 sm:px-10 pt-4 pb-2">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <div className="absolute px-4 bg-[#0a0a0a] text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase">
            HOW IT WORKS
          </div>
        </div>
      </div>

      {/* ── 3 PROCESS CARDS ── */}
      <div className="px-6 sm:px-10 pb-8 pt-4 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 01 Share an address */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#222] border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                01
              </span>
              <h4 className="text-xs font-bold text-white">Share an address</h4>
            </div>
            <p className="text-[11px] text-white/60 pl-8 leading-snug">
              Paste any residential address. We handle the rest.
            </p>
          </div>

          {/* 02 We analyze for you */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#222] border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                02
              </span>
              <h4 className="text-xs font-bold text-white">We analyze for you</h4>
            </div>
            <p className="text-[11px] text-white/60 pl-8 leading-snug">
              Human experts + AI models deliver comps, risks, and your rebate — where allowed by law.
            </p>
          </div>

          {/* 03 Private guidance */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#222] border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                03
              </span>
              <h4 className="text-xs font-bold text-white">Private guidance</h4>
            </div>
            <p className="text-[11px] text-white/60 pl-8 leading-snug">
              Independent fiduciary match. No spam. No pressure. Your outcome.
            </p>
          </div>

        </div>

        {/* Footer Subtitle */}
        <div className="text-center pt-2">
          <p 
            className="text-sm font-serif italic text-[#D4AF37]/90 tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            35 years of high-end brokerage. Now augmented by AI.
          </p>
        </div>
      </div>

    </div>
  );
}