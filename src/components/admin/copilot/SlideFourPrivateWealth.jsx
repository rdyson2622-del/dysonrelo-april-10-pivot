import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, Percent, 
  MapPin, Home, Brain, FileText, Gem, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';
const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

export default function SlideFourPrivateWealth({ onRunAudit }) {
  const [address, setAddress] = useState('');
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
        background: '#050505',
        borderColor: '#222222',
        color: '#f5f5f5'
      }}
    >
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 sm:px-10 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#854d0e] flex items-center justify-center text-black font-black text-sm shadow-md">
            <span>D</span>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="font-serif text-lg font-bold tracking-wider text-white uppercase block leading-none"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              DYSON HOMES COPILOT
            </span>
            <span className="hidden sm:inline text-white/30 text-xs">|</span>
            <span className="hidden sm:inline text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold">
              PRIVATE REAL ESTATE INTELLIGENCE
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="px-3.5 py-1 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>ADMIN LAB MOCK</span>
          </div>
        </div>
      </div>

      {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
      <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h1 
            className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-white leading-[1.15] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your human &amp;<br />
            AI-assisted private<br />
            real estate <span className="italic">copilot.</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-lg font-normal">
            Paste address for comps, risks,<br className="hidden sm:inline" />
            closing rebate where allowed by law.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Trusted by private wealth. No agent spam.</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="pt-1">
            <div className="flex items-center bg-[#111111] rounded-2xl border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.8)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mr-1.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste property address"
                className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-white/40 font-normal"
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

          {/* 3 Dark Intelligence Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wider uppercase">COMPS &amp; MARKET</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                AI-powered comps, trends, and valuation insights.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wider uppercase">RISKS &amp; DUE DILIGENCE</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Hidden risks, title issues, zoning, and red flags.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <Percent className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wider uppercase">CLOSING REBATE</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Where allowed by law. Maximize your ROI with our rebate.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Night Luxury Villa */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black">
          <img 
            src={NIGHT_HILLSIDE_ESTATE} 
            alt="Hillside Estate at Night" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* ── HOW COPILOT WORKS SECTION ── */}
      <div className="px-6 sm:px-10 pb-8 pt-4 border-t border-white/10 space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
            HOW DYSON HOMES COPILOT WORKS
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#222] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold text-white uppercase tracking-wider">1. PASTE ADDRESS</span>
            </div>
            <p className="text-[11px] text-white/60 leading-snug pl-8">
              Share the property details.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#222] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold text-white uppercase tracking-wider">2. AI + HUMAN</span>
            </div>
            <p className="text-[11px] text-white/60 leading-snug pl-8">
              Audited with AI precision &amp; broker expertise.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#222] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold text-white uppercase tracking-wider">3. DELIVERED</span>
            </div>
            <p className="text-[11px] text-white/60 leading-snug pl-8">
              Comps, risks &amp; rebate in one private report.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#111111] border border-white/10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#222] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Gem className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold text-white uppercase tracking-wider">4. DECISIONS</span>
            </div>
            <p className="text-[11px] text-white/60 leading-snug pl-8">
              Close with confidence. Keep more wealth.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-[9.5px] font-bold tracking-widest text-white/40 uppercase">
            FOR ACCREDITED INVESTORS &amp; PRIVATE WEALTH
          </span>
        </div>
      </div>
    </div>
  );
}