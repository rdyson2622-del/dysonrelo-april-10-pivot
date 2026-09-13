import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, 
  MapPin, Volume2, CheckCircle2, DollarSign, ExternalLink
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';

const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

export default function SlideFourPrivateWealth({ onRunAudit, onGoToChatCanvas }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSubmit = (e, customAddr) => {
    if (e) e.preventDefault();
    const targetAddr = customAddr || address;
    if (!targetAddr.trim()) return;

    setIsAuditing(true);
    setAuditComplete(false);

    if (onRunAudit) onRunAudit(targetAddr);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 500);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
  };

  return (
    <div className="w-full text-left select-none" style={{ background: '#050505', color: '#f5f5f5' }}>
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 sm:px-10 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          {/* Real Dyson & Dyson vertical DD badge — no white side bars, no tear lines */}
          <DysonVerticalBadge height={48} />

          {/* Brand Title with Sweep Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-baseline gap-2.5">
              <span 
                className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DYSON HOMES
              </span>
              <CopilotSweepLogo size="md" />
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {onGoToChatCanvas && (
            <button
              type="button"
              onClick={onGoToChatCanvas}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold transition-all cursor-pointer shadow-sm hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Chat Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleAudio}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">{isPlayingAudio ? 'Audio Playing...' : 'Listen to Your Copilots'}</span>
            <span className="sm:hidden">Listen</span>
          </button>
        </div>
      </div>

      {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
      <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Headline: "meet" in white font, smaller than italicized gold "copilot" */}
          <div className="text-center pt-1 pb-2">
            <div className="inline-flex items-baseline justify-center gap-3">
              <span 
                className="text-lg sm:text-2xl lg:text-3xl font-light text-white tracking-wide font-serif"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                meet
              </span>
              <CopilotSweepLogo size="xl" />
            </div>
            <h2 
              className="text-lg sm:text-2xl lg:text-[25px] text-white/90 font-normal tracking-normal mt-2 font-serif text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              The First Personal Human &amp; AI Real Estate Assistant
            </h2>
          </div>

          {/* Search Bar — Tan Pill with Black Font + Statement on ONE Line */}
          <div className="space-y-1.5 pt-1">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center bg-[#ede0cc] rounded-2xl border-2 border-[#b8920a] shadow-[0_4px_24px_rgba(0,0,0,0.7)] p-2 pl-4 transition-all focus-within:border-[#854d0e] focus-within:ring-1 focus-within:ring-[#854d0e]">
                <MapPin className="w-4 h-4 text-[#854d0e] shrink-0 mr-2" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste any address (e.g., 742 Vista Del Mar, La Jolla, CA 92037)"
                  className="flex-1 bg-transparent text-black text-xs sm:text-sm outline-none placeholder:text-[#554c40] font-semibold"
                />
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="px-6 py-2.5 rounded-xl bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/50 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>{isAuditing ? 'Auditing...' : 'Send'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </form>
            <p className="text-[11px] sm:text-xs lg:text-[13px] text-white/80 leading-tight font-normal px-2 whitespace-nowrap">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>
          </div>

          {/* SAMPLE LOOKUPS: Three TAN fill pills, BLACK text, GOLD accents/icons INSIDE */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
              Sample Lookups:
            </span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setAddress(chip);
                  handleSubmit(null, chip);
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-[#ede0cc] hover:bg-[#e4d4bd] text-[#0a0a0a] font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border border-[#c4b59f]"
              >
                <MapPin className="w-3 h-3 text-[#b8920a]" />
                <span>{chip.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 shadow-sm whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span className="whitespace-nowrap">We are an independent research entity - no spam calls or agent involvement</span>
          </div>

          {/* Three lower feature boxes across: Honest comps / Hidden risks / Closing cost credit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white">Honest comps</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Institutional-grade comps. Real market, not marketing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white">Hidden risks</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Natural, title, flood, zoning, and neighborhood risk intelligence.
              </p>
            </div>

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

          {/* Quiet MLS companion chips */}
          <div className="pt-2 flex items-center gap-2 text-xs text-white/50">
            <span>Browse MLS independently on:</span>
            <a href="https://www.realtor.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#D4AF37] underline flex items-center gap-0.5">
              Realtor.com <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <a href="https://www.homes.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#D4AF37] underline flex items-center gap-0.5">
              Homes.com <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <a href="https://www.zillow.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#D4AF37] underline flex items-center gap-0.5">
              Zillow <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Right Column (5 cols): Night Luxury Hillside Estate */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
          <img 
            src={NIGHT_HILLSIDE_ESTATE} 
            alt="Luxury Estate at Night" 
            className="w-full h-full object-cover origin-bottom-left scale-[1.20] translate-y-[2%] -translate-x-[2%]"
          />
          {auditComplete && (
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-[#10b981]/60 text-white text-xs flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-[11px] font-semibold truncate">
                  Audit Ready for {address.split(',')[0]}
                </span>
              </div>
              <span className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase">
                REPORT GENERATED &darr;
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}