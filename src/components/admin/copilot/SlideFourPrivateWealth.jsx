import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, Percent, 
  MapPin, Home, Brain, FileText, Gem, Volume2, 
  CheckCircle2, Clock, DollarSign
} from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

export default function SlideFourPrivateWealth({ onRunAudit }) {
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

      // Smooth scroll to dossier section if present
      const dossierEl = document.getElementById('copilot-audit-dossier');
      if (dossierEl) {
        dossierEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 700);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
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
      <div className="px-6 sm:px-10 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3.5">
          {/* #1: Dyson and Dyson Logo - strictly free-standing with no container box or border */}
          <div className="shrink-0 flex items-center">
            <img 
              src={DYSON_LOGO} 
              alt="Dyson & Dyson" 
              className="h-[51px] sm:h-[55px] w-auto object-contain" 
            />
          </div>

          {/* #2: Spelled out DYSON HOMES with copilot mirroring the exact font and style (lowercase) from the headline below */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span 
                className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DYSON HOMES
              </span>
              <span 
                className="font-serif italic text-2xl sm:text-[26px] text-[#D4AF37] leading-none inline-block drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                copilot
              </span>
            </div>
            <span className="hidden sm:inline text-white/30 text-xs">|</span>
            <span className="hidden sm:inline text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold">
              PRIVATE REAL ESTATE INTELLIGENCE
            </span>
          </div>
        </div>

      </div>

      {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
      <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h1 
            className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-white leading-[1.15] tracking-tight text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your Human &amp; AI-assisted<br />
            Private Real Estate <span className="italic text-[#D4AF37]">copilot.</span>
          </h1>

          {/* 1. Search Bar (Tan background / Black font) + 2. Tightened & Centered Paste Address Statement */}
          <div className="pt-6 sm:pt-7 space-y-1.5 text-center">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center bg-[#ede0cc] rounded-2xl border-2 border-[#D4AF37]/80 shadow-[0_4px_24px_rgba(212,175,55,0.25)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
                <MapPin className="w-4 h-4 text-[#854d0e] shrink-0 mr-1.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste property address"
                  className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm outline-none placeholder:text-[#554c40] font-medium"
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

            {/* 2. Tightened directly under search pill & centered */}
            <p className="text-xs sm:text-sm text-white/70 leading-normal font-normal">
              Paste address for comps, risks, closing rebate where allowed by law.
            </p>
          </div>

          {/* 3. Try sample is next (Centered, Tan with Black Font) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] text-white/50 uppercase font-semibold">Try sample:</span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setAddress(chip);
                  handleSubmit(null, chip);
                }}
                className="text-[10.5px] px-2.5 py-1 rounded-lg bg-[#ede0cc] hover:bg-[#f6ebd9] border border-[#d8cab6] hover:border-[#D4AF37] text-[#0a0a0a] font-medium transition-all cursor-pointer truncate max-w-[200px] shadow-sm"
              >
                {chip.split(',')[0]}
              </button>
            ))}
          </div>

          {/* 4. Trusted and Instant statements are next (Single-line, compact pill) */}
          <div className="flex flex-col items-center space-y-2 pt-1 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/5 border border-white/15 text-xs sm:text-sm text-white font-medium shadow-sm whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="whitespace-nowrap">Trusted by private wealth. No agent spam or interaction.</span>
            </div>

            {/* Real-time definition text */}
            <p className="text-xs sm:text-sm text-[#D4AF37] italic flex items-center justify-center gap-1.5 text-center leading-normal max-w-xl">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Instant on-screen comps &amp; rebate calculation. Human fiduciary verification delivered in minutes.</span>
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Night Luxury Villa */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
          <img 
            src={NIGHT_HILLSIDE_ESTATE} 
            alt="Hillside Estate at Night" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          {/* Active Audit Status Indicator */}
          {auditComplete && (
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-[#10b981]/60 text-white text-xs flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-[11px] font-semibold truncate">
                  Audit Ready for {address.split(',')[0]}
                </span>
              </div>
              <span className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase">
                SCROLL FOR DOSSIER ↓
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── 4 BOXES SPREAD ACROSS PAGE (UNDER PHOTO & HERO SECTION) ── */}
      <div className="px-6 sm:px-10 pb-7 space-y-2.5">
        {/* Row 1: The Three Boxes (COMPS / RISKS / CLOSING REBATE) - Sleek reduced vertical height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="py-2.5 px-4 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] space-y-0.5 shadow-sm transition-all">
            <div className="flex items-center gap-1.5 text-[#854d0e]">
              <TrendingUp className="w-3.5 h-3.5 text-[#854d0e] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#854d0e]">COMPS &amp; MARKET</span>
            </div>
            <p className="text-[11.5px] sm:text-xs text-[#0a0a0a] leading-snug font-normal">
              AI-powered comps, trends, and valuation insights.
            </p>
          </div>

          <div className="py-2.5 px-4 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] space-y-0.5 shadow-sm transition-all">
            <div className="flex items-center gap-1.5 text-[#854d0e]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#854d0e] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#854d0e]">RISKS &amp; DUE DILIGENCE</span>
            </div>
            <p className="text-[11.5px] sm:text-xs text-[#0a0a0a] leading-snug font-normal">
              Hidden risks, title issues, zoning, and red flags.
            </p>
          </div>

          <div className="py-2.5 px-4 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] space-y-0.5 shadow-sm transition-all">
            <div className="flex items-center gap-1.5 text-[#854d0e]">
              <Percent className="w-3.5 h-3.5 text-[#854d0e] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#854d0e]">CLOSING REBATE</span>
            </div>
            <p className="text-[11.5px] sm:text-xs text-[#0a0a0a] leading-snug font-normal">
              Where allowed by law. Maximize your ROI with our rebate.
            </p>
          </div>
        </div>

        {/* Row 2: Listen Charlie Box below - Sleek reduced vertical height */}
        <div className="w-full py-2 px-4 rounded-xl bg-[#ede0cc] border border-[#d8cab6] hover:border-[#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-sm transition-all">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isPlayingAudio ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#0a0a0a] text-[#D4AF37] hover:bg-[#222]'
              }`}
              title="Play Charlie Simmons Brief"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <div>
              <span className="text-[#854d0e] font-bold text-xs sm:text-[13px] block leading-tight">
                {isPlayingAudio ? 'Charlie Speaking: 15s Property Brief...' : 'Listen: Charlie AI Voice Dossier'}
              </span>
              <span className="text-[#0a0a0a] text-[10.5px] sm:text-[11px] font-normal block leading-tight pt-0.5">
                Instant property summary backed by Bob Dyson (Broker DRE #00609384)
              </span>
            </div>
          </div>
          <span className="text-[9.5px] font-bold text-[#D4AF37] px-2.5 py-0.5 rounded bg-[#0a0a0a] border border-[#D4AF37]/50 uppercase shrink-0">
            DUAL VOICE
          </span>
        </div>
      </div>

      {/* ── HOW COPILOT WORKS SECTION ── */}
      <div className="px-6 sm:px-10 pb-8 pt-4 border-t border-white/10 space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
            HOW DYSON HOMES <span className="font-serif italic text-sm text-[#e8c84a] normal-case" style={{ fontFamily: 'Cormorant Garamond, serif' }}>copilot</span> WORKS
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