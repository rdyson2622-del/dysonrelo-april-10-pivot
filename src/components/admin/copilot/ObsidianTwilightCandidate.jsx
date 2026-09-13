import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, ArrowRight, TrendingUp, AlertTriangle, 
  Percent, FileText, CheckCircle2, Compass, Brain, Sparkles,
  BarChart3, ShieldAlert, Award
} from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

export default function ObsidianTwilightCandidate({
  selectedAddress = '742 Vista Del Mar, La Jolla, CA 92037',
  rebateAmount = 21562,
  onRunAudit
}) {
  const [address, setAddress] = useState(selectedAddress);
  const [isAuditing, setIsAuditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setSubmitted(true);
      if (onRunAudit) onRunAudit(address);
    }, 450);
  };

  return (
    <div className="rounded-3xl bg-[#060606] text-white border border-[#D4AF37]/50 shadow-2xl overflow-hidden font-sans select-none">
      
      {/* ── TOP LUXURY BAR ── */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-serif text-xl tracking-wider font-bold">▲▲</span>
            <div>
              <span className="font-serif text-sm tracking-[0.2em] font-bold text-white block uppercase">
                DYSON HOMES
              </span>
              <span className="text-[8px] tracking-[0.25em] text-[#D4AF37] uppercase font-bold block -mt-0.5">
                COPILOT
              </span>
            </div>
          </div>
          <span className="h-4 w-px bg-white/20 hidden sm:inline-block mx-1" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/60 hidden sm:inline-block">
            PRIVATE REAL ESTATE INTELLIGENCE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/60 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center gap-1.5 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>ADMIN LAB MOCK</span>
          </span>
        </div>
      </div>

      {/* ── MAIN ASYMMETRICAL SPLIT HERO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        
        {/* Left Content Column (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#080808] via-[#0d0d0d] to-[#050505]">
          
          <div className="space-y-4">
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.12]"
            >
              Your human &amp; <br />
              AI-assisted private <br />
              <span className="text-[#e8c84a] italic font-serif">real estate copilot.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed font-light">
              Paste address for comps, risks, closing rebate where allowed by law.
            </p>

            {/* The Private Wealth Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#D4AF37]/40 text-[11px] text-[#D4AF37] font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="text-white/90">Trusted by private wealth. <strong>No agent spam.</strong></span>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="flex items-center bg-[#121212] rounded-xl border border-[#D4AF37]/60 p-1.5 shadow-2xl focus-within:border-[#D4AF37] transition-all">
              <div className="pl-3 pr-2 flex items-center gap-2 text-white/40">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste property address (e.g., 72 Beverly Park Ln, Beverly Hills, CA)"
                className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-white/35 font-light"
              />
              <button
                type="submit"
                disabled={isAuditing}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#e8c84a] transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}
              >
                <span>{isAuditing ? 'Auditing...' : 'SEND'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </form>

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Card 1: Comps */}
            <div className="p-3.5 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/35 shadow-md space-y-1.5 group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  COMPS &amp; MARKET
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-snug">
                AI-powered comps, trends, and valuation <span className="text-[#D4AF37] font-semibold">insights</span>.
              </p>
            </div>

            {/* Card 2: Risks */}
            <div className="p-3.5 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/35 shadow-md space-y-1.5 group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  RISKS &amp; DUE DILIGENCE
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-snug">
                Hidden risks, title issues, zoning, and red flags—<span className="text-[#D4AF37] font-semibold">before you commit</span>.
              </p>
            </div>

            {/* Card 3: Rebate */}
            <div className="p-3.5 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/35 shadow-md space-y-1.5 group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Percent className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  CLOSING REBATE
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-snug">
                Where allowed by law. <span className="text-[#D4AF37] font-semibold">Maximize your ROI</span> with our rebate.
              </p>
            </div>

          </div>

        </div>

        {/* Right Architectural Image Column (5 cols) */}
        <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-black overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=95"
            alt="Twilight Glass Villa with Infinity Pool"
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent hidden lg:block" />

          {/* Floating Compass Pill */}
          <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/80 border border-[#D4AF37]/60 text-[#D4AF37] shadow-xl backdrop-blur-md">
            <Compass className="w-5 h-5 text-[#D4AF37]" />
          </div>

          {/* Property Overlay Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 border border-white/20 text-white/90 text-[10px] font-medium backdrop-blur-md">
            <span>Beverly Hills, CA • $14.5M</span>
          </div>
        </div>

      </div>

      {/* ── HORIZONTAL PROCESS LINE ── */}
      <div className="p-6 bg-[#040404] border-t border-white/10 space-y-4">
        <div className="text-center">
          <span className="text-[9.5px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            HOW DYSON HOMES COPILOT WORKS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs max-w-5xl mx-auto">
          
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#111] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] font-bold text-xs">
              1
            </div>
            <div>
              <div className="font-bold text-white text-[11px] uppercase tracking-wider">PASTE ADDRESS</div>
              <div className="text-white/60 text-[10.5px] mt-0.5">Share property details or listing link.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#111] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] font-bold text-xs">
              2
            </div>
            <div>
              <div className="font-bold text-white text-[11px] uppercase tracking-wider">AI + HUMAN ANALYSIS</div>
              <div className="text-white/60 text-[10.5px] mt-0.5">Copilot analyzes with AI precision &amp; broker expertise.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#111] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] font-bold text-xs">
              3
            </div>
            <div>
              <div className="font-bold text-white text-[11px] uppercase tracking-wider">INTELLIGENCE DELIVERED</div>
              <div className="text-white/60 text-[10.5px] mt-0.5">Comps, risks, and rebate in one private report.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-7 h-7 rounded-full bg-[#111] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] font-bold text-xs">
              4
            </div>
            <div>
              <div className="font-bold text-white text-[11px] uppercase tracking-wider">BETTER DECISIONS</div>
              <div className="text-white/60 text-[10.5px] mt-0.5">Close with confidence. Keep more wealth.</div>
            </div>
          </div>

        </div>

        <div className="text-center pt-2">
          <span className="text-[9px] tracking-[0.2em] font-serif text-[#D4AF37]/75 uppercase">
            FOR ACCREDITED INVESTORS &amp; PRIVATE WEALTH
          </span>
        </div>
      </div>

    </div>
  );
}