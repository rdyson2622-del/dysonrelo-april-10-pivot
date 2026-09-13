import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, ArrowRight, TrendingUp, AlertTriangle, 
  DollarSign, Check, Award, Compass, BarChart3, Shield
} from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

export default function WarmChampagneCandidate({
  selectedAddress = '742 Vista Del Mar, La Jolla, CA 92037',
  rebateAmount = 21562,
  onRunAudit
}) {
  const [address, setAddress] = useState(selectedAddress);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      if (onRunAudit) onRunAudit(address);
    }, 450);
  };

  return (
    <div className="rounded-3xl bg-[#faf6ee] text-[#1a1a1a] border border-[#d8cab6] shadow-2xl overflow-hidden font-sans select-none">
      
      {/* ── TOP LUXURY BAR ── */}
      <div className="px-6 py-4 border-b border-[#e5d8c3] flex items-center justify-between gap-4 bg-[#f5ede0]/90">
        <div className="flex items-center gap-3">
          <div className="p-1 px-2.5 rounded-lg bg-[#ede0cc] border border-[#d8cab6] flex items-center gap-2">
            <img 
              src={DYSON_LOGO} 
              alt="Dyson & Dyson" 
              className="h-7 w-auto object-contain"
            />
            <div className="leading-tight hidden sm:block">
              <span className="font-serif text-xs font-bold tracking-wider text-[#1a1a1a] block">
                DYSON HOMES
              </span>
              <span className="text-[7.5px] uppercase tracking-widest text-[#854d0e] font-bold block">
                EST. 1989 • PRIVATE REAL ESTATE COPILOT
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#ede0cc] border border-[#d8cab6] text-[#854d0e] shadow-sm">
            ADMIN LAB MOCK — NOT LIVE
          </span>
        </div>
      </div>

      {/* ── MAIN ASYMMETRICAL SPLIT HERO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        
        {/* Left Content Column (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#faf6ee] via-[#f7f1e4] to-[#ede0cc]">
          
          <div className="space-y-4">
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] tracking-tight leading-[1.12]"
            >
              Your human &amp; <br />
              AI-assisted private <br />
              <span className="text-[#854d0e] italic font-serif">real estate copilot.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#44382c] max-w-lg leading-relaxed font-normal">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>

            {/* The Fiduciary Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ede0cc] border border-[#d8cab6] text-[11px] text-[#2a241b] font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#854d0e] shrink-0" />
              <span>No agent spam. Independent fiduciary match — not the listing agent.</span>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="flex items-center bg-[#ffffff] rounded-xl border border-[#d8cab6] p-1.5 shadow-md focus-within:border-[#854d0e] focus-within:ring-1 focus-within:ring-[#854d0e]/30 transition-all">
              <div className="pl-3 pr-2 flex items-center gap-2 text-[#786a58]">
                <MapPin className="w-4 h-4 text-[#854d0e]" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste any property address (e.g., 72 Beverly Park Ln, Beverly Hills, CA)"
                className="flex-1 bg-transparent text-[#1a1a1a] text-xs sm:text-sm outline-none placeholder:text-[#9c8e7c] font-normal"
              />
              <button
                type="submit"
                disabled={isAuditing}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#854d0e] hover:bg-[#6d3e0b] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
              >
                <span>{isAuditing ? 'Auditing...' : 'SEND'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </form>

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Card 1: Comps */}
            <div className="p-4 rounded-2xl bg-[#ffffff]/90 border border-[#e5d8c3] shadow-sm space-y-1.5 group hover:border-[#854d0e] transition-all">
              <div className="flex items-center gap-2 text-[#854d0e]">
                <div className="p-1 rounded-md bg-[#faf6ee]">
                  <TrendingUp className="w-4 h-4 text-[#854d0e]" />
                </div>
                <span className="text-xs font-serif font-bold text-[#1a1a1a]">
                  Honest comps
                </span>
              </div>
              <p className="text-[11px] text-[#554738] leading-snug">
                Market-backed comps, not cherry-picked listings.
              </p>
            </div>

            {/* Card 2: Risks */}
            <div className="p-4 rounded-2xl bg-[#ffffff]/90 border border-[#e5d8c3] shadow-sm space-y-1.5 group hover:border-[#854d0e] transition-all">
              <div className="flex items-center gap-2 text-[#854d0e]">
                <div className="p-1 rounded-md bg-[#faf6ee]">
                  <Shield className="w-4 h-4 text-[#854d0e]" />
                </div>
                <span className="text-xs font-serif font-bold text-[#1a1a1a]">
                  Hidden risks
                </span>
              </div>
              <p className="text-[11px] text-[#554738] leading-snug">
                Natural risks, title flags, neighborhood &amp; build risks.
              </p>
            </div>

            {/* Card 3: Rebate */}
            <div className="p-4 rounded-2xl bg-[#ffffff]/90 border border-[#e5d8c3] shadow-sm space-y-1.5 group hover:border-[#854d0e] transition-all">
              <div className="flex items-center gap-2 text-[#854d0e]">
                <div className="p-1 rounded-md bg-[#faf6ee]">
                  <DollarSign className="w-4 h-4 text-[#854d0e]" />
                </div>
                <span className="text-xs font-serif font-bold text-[#1a1a1a]">
                  Closing-cost credit
                </span>
              </div>
              <p className="text-[11px] text-[#554738] leading-snug">
                Your rebate, where allowed by law. Transparent.
              </p>
            </div>

          </div>

        </div>

        {/* Right Architectural Sunset Villa Column (5 cols) */}
        <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-[#1a1a1a] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#e5d8c3]">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=95"
            alt="Warm Sunset Villa with Infinity Pool"
            className="w-full h-full object-cover object-center filter saturate-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Property Overlay Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 border border-[#d8cab6] text-[#1a1a1a] text-[10px] font-bold shadow-md backdrop-blur-md">
            <span>La Jolla, CA • $12.8M Coastal Estate</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-wider text-[#e8c84a] font-bold block">
              REAL-TIME MARKET SNAPSHOT
            </span>
            <span className="text-[11px] text-white/90 leading-tight block mt-0.5">
              Pacific ocean sunset easements protected by deed. 50% closing rebate active.
            </span>
          </div>
        </div>

      </div>

      {/* ── HOW IT WORKS SECTION (01 - 02 - 03) ── */}
      <div className="p-6 bg-[#f3ebd9] border-t border-[#e2d4bd] space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px bg-[#d8cab6] flex-1 max-w-xs" />
          <span className="text-[9.5px] font-bold tracking-[0.25em] text-[#854d0e] uppercase">
            HOW IT WORKS
          </span>
          <span className="h-px bg-[#d8cab6] flex-1 max-w-xs" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-2">
          
          <div className="space-y-1">
            <span className="text-xl font-serif font-bold text-[#854d0e]">01.</span>
            <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">Share an address</h4>
            <p className="text-[11px] text-[#554738] leading-relaxed">
              Paste any residential address or listing link. We handle the rest.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xl font-serif font-bold text-[#854d0e]">02.</span>
            <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">We analyze for you</h4>
            <p className="text-[11px] text-[#554738] leading-relaxed">
              Human experts + AI models deliver comps, risks, and your rebate — where allowed by law.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xl font-serif font-bold text-[#854d0e]">03.</span>
            <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">Private guidance</h4>
            <p className="text-[11px] text-[#554738] leading-relaxed">
              Independent fiduciary watch. No spam. No pressure. Your outcome.
            </p>
          </div>

        </div>

        <div className="text-center pt-3 border-t border-[#d8cab6]/60">
          <p className="text-xs font-serif italic text-[#854d0e] tracking-wide">
            35 years of high-end brokerage. Now augmented by AI.
          </p>
        </div>
      </div>

    </div>
  );
}