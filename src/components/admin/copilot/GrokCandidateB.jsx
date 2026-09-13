import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, DollarSign, TrendingUp, AlertTriangle, 
  Search, Sparkles, Check, Gift, FileText, CheckCircle2, Mic, MapPin, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

// Luxury Estate background softly blending into tan
const TWIN_MANSION_BG = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=95";

const PRESET_SAMPLES = [
  { label: 'Scottsdale Desert Ridge', address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253', price: 2150000, rebate: 13437 },
  { label: 'La Jolla Oceanfront', address: '742 Vista Del Mar, La Jolla, CA 92037', price: 3450000, rebate: 21562 },
  { label: 'Austin Modern Glass', address: '4220 Oak Hollow Terrace, Austin, TX 78746', price: 1850000, rebate: 11562 },
];

export default function GrokCandidateB({
  onSelectAddress,
  onRunAudit,
  selectedAddress = '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
  rebateAmount = 13437
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

  const handlePickSample = (sample) => {
    setInputVal(sample.address);
    setSubmitted(true);
    if (onRunAudit) onRunAudit(sample.address);
    setTimeout(() => setSubmitted(false), 800);
  };

  return (
    <div 
      className="w-full rounded-3xl overflow-hidden border-2 shadow-2xl text-center select-none relative font-sans"
      style={{ 
        background: 'linear-gradient(180deg, #fefbf6 0%, #ede0cc 100%)',
        borderColor: `${GOLD}80`,
        color: '#1a1815'
      }}
    >
      {/* ── BACKGROUND ESTATE VIGNETTE ── */}
      <div className="relative pt-8 pb-10 px-4 sm:px-8 lg:px-12 overflow-hidden">
        
        {/* Soft Estate Backdrop with Tan Gradient Scrim */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <img 
            src={TWIN_MANSION_BG} 
            alt="Estate Background" 
            className="w-full h-full object-cover object-center filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fefbf6]/85 via-[#fefbf6]/65 to-[#ede0cc]" />
        </div>

        {/* Top Header & Brand Pill */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-2 mb-6">
          <div className="flex items-center justify-between w-full max-w-4xl px-2">
            <div className="flex items-center gap-2">
              <img src={DYSON_LOGO} alt="DysonHomes" className="h-6 sm:h-7 w-auto object-contain drop-shadow" />
              <span 
                className="font-bold text-lg text-[#0a0a0a] tracking-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DysonHomes Copilot
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[10.5px] font-semibold text-[#854d0e] px-3 py-1 rounded-full bg-white/70 border border-[#D4AF37]/40">
                35-Yr Brokerage Fiduciary
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#D4AF37]/60 text-[#D4AF37] text-[10px] font-black uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span>Grok Format B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Headline */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-3 mb-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf5ec] border border-[#D4AF37]/60 text-[#684614] text-[11px] font-medium shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span><strong>The Trust Shield:</strong> No agent spam. Independent fiduciary match — not the listing agent.</span>
          </div>

          <h1 
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] leading-[1.12] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your human &amp; AI-assisted <br />
            <span className="text-[#854d0e]">private real estate copilot.</span>
          </h1>

          <p className="text-xs sm:text-base text-[#3a342c] font-normal max-w-xl mx-auto leading-relaxed">
            Paste any address to get comps, risks, and a closing rebate where allowed by law.
          </p>

          {/* Centered Floating Search Bar */}
          <div className="max-w-xl mx-auto pt-2 space-y-2">
            <form onSubmit={handleSubmit} className="relative">
              <div 
                className="flex items-center rounded-full p-1.5 pl-4 gap-2 transition-all bg-[#ffffff] border-2 border-[#D4AF37] shadow-xl focus-within:ring-2 focus-within:ring-[#D4AF37]/50"
              >
                <Search className="w-4 h-4 text-[#854d0e] shrink-0" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Paste address here (e.g. 1844 Mountain Shadow Way, Scottsdale, AZ)..."
                  className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm font-medium outline-none placeholder:text-stone-400"
                />

                {/* Talk to Charlie Voice AI */}
                <Link
                  to="/talking-app"
                  className="p-2 rounded-full bg-black hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50 shrink-0 transition-transform active:scale-95 mr-1"
                  title="Talk with Charlie (Voice AI)"
                >
                  <Mic className="w-4 h-4" />
                </Link>

                <button
                  type="submit"
                  disabled={submitted}
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-black text-black transition-all hover:brightness-105 active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
                  style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})` }}
                >
                  <span>{submitted ? 'Auditing...' : 'Send'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </form>

            {/* Instant 1-Click Sample Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs pt-1">
              <span className="text-stone-500 text-[10.5px] uppercase font-bold tracking-wider mr-1">
                Try Sample:
              </span>
              {PRESET_SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickSample(s)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                    inputVal === s.address
                      ? 'bg-[#0a0a0a] text-[#D4AF37] border-[#D4AF37] font-bold shadow-sm'
                      : 'bg-white/80 hover:bg-white text-[#1a1815] border-stone-300'
                  }`}
                >
                  {s.label} (${(s.price / 1000000).toFixed(2)}M)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3 ELEVATED LUXURY CARDS (SYMMETRICAL) ── */}
        <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          
          {/* Card 1: Smart Comps */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#ffffff]/95 border border-[#D4AF37]/50 shadow-lg space-y-2.5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-[#854d0e]/10 text-[#854d0e] flex items-center justify-center shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 
              className="text-base sm:text-lg font-bold text-[#0a0a0a]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Smart Comps
            </h3>
            <p className="text-xs text-[#554c40] leading-relaxed">
              Instant, accurate comps tailored to the property and local micro-market sales.
            </p>
          </div>

          {/* Card 2: Risk Insights */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#ffffff]/95 border border-[#D4AF37]/50 shadow-lg space-y-2.5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 
              className="text-base sm:text-lg font-bold text-[#0a0a0a]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Risk Insights
            </h3>
            <p className="text-xs text-[#554c40] leading-relaxed">
              AI-flagged risks, title red flags, permit boundaries, and local factors that actually matter.
            </p>
          </div>

          {/* Card 3: Closing Rebate */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#ffffff]/95 border border-[#D4AF37]/50 shadow-lg space-y-2.5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shadow-inner">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 
              className="text-base sm:text-lg font-bold text-[#0a0a0a]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Closing Rebate
            </h3>
            <p className="text-xs text-[#554c40] leading-relaxed">
              Earn thousands back at closing — where allowed by law. Up to 50% referral fee credited.
            </p>
          </div>

        </div>

      </div>

      {/* ── CONNECTED PROCESS: HOW IT WORKS (WITH MILESTONE DOTS) ── */}
      <div className="p-6 sm:p-8 bg-[#f5ecde] border-t border-[#0a0a0a]/10 space-y-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 
              className="text-lg font-bold text-[#0a0a0a] tracking-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              How it works
            </h3>
          </div>

          {/* Connected Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0a0a0a] text-[#D4AF37] text-xs font-bold flex items-center justify-center shadow-md mb-1">
                1
              </div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">Paste any address</h4>
              <p className="text-[11px] text-[#5a5144] max-w-xs leading-snug">
                We analyze the property instantly across comps, tax basis, and zoning.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0a0a0a] text-[#D4AF37] text-xs font-bold flex items-center justify-center shadow-md mb-1">
                2
              </div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">Get comps, risks &amp; insights</h4>
              <p className="text-[11px] text-[#5a5144] max-w-xs leading-snug">
                Human fiduciary expertise meets AI precision — zero sales pressure.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0a0a0a] text-[#D4AF37] text-xs font-bold flex items-center justify-center shadow-md mb-1">
                3
              </div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">Close with confidence</h4>
              <p className="text-[11px] text-[#5a5144] max-w-xs leading-snug">
                And keep more with your cash rebate where allowed by law.
              </p>
            </div>

          </div>

          {/* Trust Statement Footer */}
          <div className="pt-5 border-t border-[#0a0a0a]/10 mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-[#554c40]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>No agent spam.</span>
            </div>
            <span>•</span>
            <div>No hidden fees.</div>
            <span>•</span>
            <div>Just smart real estate support.</div>
          </div>
        </div>
      </div>
    </div>
  );
}