import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, Percent, 
  MapPin, Home, Brain, FileText, Gem, Volume2, 
  CheckCircle2, Clock, DollarSign, Compass, ExternalLink, Info, HelpCircle
} from 'lucide-react';
import CopilotDocumentViewer from './CopilotDocumentViewer';
import CopilotChatDossierCanvas from './CopilotChatDossierCanvas';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_SEARCHES = [
  '742 Vista Del Mar, La Jolla, CA 92037',
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  '4220 Oak Hollow Terrace, Austin, TX 78746'
];

const INITIAL_PROPERTIES = {
  '742 Vista Del Mar, La Jolla, CA 92037': {
    address: '742 Vista Del Mar, La Jolla, CA 92037',
    price: 3450000,
    beds: 4,
    baths: 4.5,
    sqft: 3820,
    dom: 64,
    compsPrice: 3200000,
    rebate: 21562,
    risks: [
      '64 days on market — seller price reduction of $150k pending',
      'Coastal Commission permitting boundary: strict exterior remodel restrictions',
      'Recent neighborhood comp sold 7.2% below asking price'
    ],
    lastSoldPrice: 2100000,
    lastSoldYear: 2019
  },
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253': {
    address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    price: 2150000,
    beds: 4,
    baths: 3,
    sqft: 3240,
    dom: 18,
    compsPrice: 2125000,
    rebate: 13437,
    risks: [
      'HOA rental restriction: minimum 12-month lease required',
      'Dual A/C units are 14 years old — approaching replacement lifecycle'
    ],
    lastSoldPrice: 1420000,
    lastSoldYear: 2021
  },
  '4220 Oak Hollow Terrace, Austin, TX 78746': {
    address: '4220 Oak Hollow Terrace, Austin, TX 78746',
    price: 1850000,
    beds: 3,
    baths: 3.5,
    sqft: 2890,
    dom: 42,
    compsPrice: 1775000,
    rebate: 11562,
    risks: [
      'Travis County reassessment triggers ~18% property tax escalation',
      'Flash flood zone buffer near greenbelt easement'
    ],
    lastSoldPrice: 1150000,
    lastSoldYear: 2018
  }
};

export default function SlideFourPrivateWealth({ onRunAudit }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeProperty, setActiveProperty] = useState(INITIAL_PROPERTIES['742 Vista Del Mar, La Jolla, CA 92037']);

  const handleSubmit = (e, customAddr) => {
    if (e) e.preventDefault();
    const targetAddr = customAddr || address;
    if (!targetAddr.trim()) return;

    setIsAuditing(true);
    setAuditComplete(false);

    const matched = INITIAL_PROPERTIES[targetAddr] || {
      address: targetAddr,
      price: 2650000,
      beds: 4,
      baths: 3.5,
      sqft: 3400,
      dom: 36,
      compsPrice: 2490000,
      rebate: 16562,
      risks: [
        'Market comps indicate listing price is ~6% above 90-day tract closed median',
        'Municipal tax basis will reset to purchase price upon escrow close'
      ],
      lastSoldPrice: 1720000,
      lastSoldYear: 2020
    };
    setActiveProperty(matched);

    if (onRunAudit) onRunAudit(targetAddr);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);

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
    <div className="w-full text-left select-none">
      {/* ── HERO SECTION ABOVE THE CREASE (DARK OBSIDIAN / NIGHT VILLA) ── */}
      <div style={{ background: '#050505', color: '#f5f5f5' }}>
        {/* ── TOP HEADER BAR ── */}
        <div className="px-6 sm:px-10 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3.5">
            {/* Free-standing Dyson Logo */}
            <div className="shrink-0 flex items-center">
              <img 
                src={DYSON_LOGO} 
                alt="Dyson & Dyson" 
                className="h-[51px] sm:h-[55px] w-auto object-contain" 
              />
            </div>

            {/* Brand Title */}
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
              <span className="text-[9px] tracking-widest text-[#D4AF37]/80 uppercase block font-sans">
                EST. 1989 · PRIVATE WEALTH REAL ESTATE
              </span>
            </div>
          </div>

          {/* Audio Listen Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAudio}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">{isPlayingAudio ? 'Audio Playing...' : 'Listen: 30s Tag-Team Intro'}</span>
              <span className="sm:hidden">Audio</span>
            </button>
          </div>
        </div>

        {/* ── MAIN HERO SECTION (SPLIT LAYOUT) ── */}
        <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h1 
              className="font-normal text-white leading-[1.15] tracking-tight text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              <span className="flex items-baseline justify-center gap-3 leading-tight">
                <span className="text-xl sm:text-2xl lg:text-3xl font-light text-white/80 tracking-wide">
                  Meet
                </span>
                <span className="text-4xl sm:text-5xl lg:text-[62px] font-semibold italic text-[#D4AF37] leading-none drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)]">
                  copilot
                </span>
              </span>
              <span className="block text-lg sm:text-2xl lg:text-[25px] text-white/90 font-normal tracking-normal mt-2">
                The First Personal Human &amp; AI Real Estate Assistant
              </span>
            </h1>

            {/* Search Bar — Directly under heading */}
            <form onSubmit={handleSubmit} className="pt-1">
              <div className="flex items-center bg-[#141414] rounded-2xl border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mr-1.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste any address (e.g., 742 Vista Del Mar, La Jolla, CA 92037)"
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

            {/* Quick Sample Search Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37]/80 tracking-wider">
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
                  className="text-[10.5px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37] text-white/90 font-medium transition-all cursor-pointer truncate max-w-[200px]"
                >
                  {chip.split(',')[0]}
                </button>
              ))}
            </div>

            <p className="text-sm text-white/70 leading-relaxed font-normal pt-1">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>Independent fiduciary match — never the listing agent.</span>
            </div>

            {/* 3 Value Cards */}
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
          </div>

          {/* Right Column (5 cols): Night Luxury Hillside Estate */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
            <img 
              src={NIGHT_HILLSIDE_ESTATE} 
              alt="Luxury Estate at Night" 
              className="w-full h-full object-cover origin-bottom-left scale-[1.20] translate-y-[2%] -translate-x-[2%] transition-transform duration-700"
            />

            {/* Top-right dark sky gradient overlay */}
            <div className="absolute top-0 right-0 w-36 h-16 bg-gradient-to-bl from-[#0a0d14]/95 via-[#0d121c]/70 to-transparent pointer-events-none rounded-tr-2xl" />

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
                  VIEW REPORT &darr;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LOWER SECTION: STEP 2 DIRECT CONNECTION (SIGNATURE DYSON TAN #ede0cc) ── */}
      <div 
        className="w-full px-6 sm:px-10 py-6 space-y-6 border-t border-[#d8cab6]/60"
        style={{ background: '#ede0cc', color: '#1a1815' }}
      >
        {/* ── STEP 2: 2-COLUMN CHAT CANVAS & DOSSIER ARTIFACT (LOADED DIRECTLY BELOW HERO SEARCH) ── */}
        <div id="copilot-audit-dossier" className="pt-4 space-y-3 scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#854d0e] block">
                STEP 2 · POST-SEARCH INTERACTIVE WORKSPACE
              </span>
              <span className="text-sm font-bold text-[#0a0a0a]">
                Live 2-Column Chat &amp; Dossier Canvas
              </span>
            </div>
            <span className="text-xs text-[#554c40] font-medium">
              Auditing: <strong>{activeProperty.address.split(',')[0]}</strong>
            </span>
          </div>

          {/* 2-Column Chat + Dossier Canvas */}
          <CopilotChatDossierCanvas 
            property={activeProperty}
            onPropertyChange={(newAddr) => {
              handleSubmit(null, newAddr);
            }}
          />
        </div>

        {/* Footer Slogan */}
        <div className="text-center pt-4 space-y-1">
          <p 
            className="text-base sm:text-lg lg:text-xl font-serif italic font-bold text-[#854d0e] tracking-wider"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            &ldquo;IF YOU DON&rsquo;T HAVE A REAL ESTATE COPILOT YOU ARE SIMPLY FLYING BLIND!&rdquo;
          </p>
          <p 
            className="text-xs sm:text-sm font-serif font-semibold text-[#554c40] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            &mdash; Bob Dyson, Founder &amp; Licensed Broker (DRE #00609384)
          </p>
        </div>
      </div>
    </div>
  );
}