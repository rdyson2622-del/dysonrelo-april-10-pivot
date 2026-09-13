import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, DollarSign, TrendingUp, AlertTriangle, 
  Search, Sparkles, Check, ChevronDown, CheckCircle2, Mic, MapPin, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

// Luxury Craftsman/Stone Estate image matching Grok Format A
const ESTATE_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=90";

const PRESET_SAMPLES = [
  { label: 'La Jolla Oceanfront', address: '742 Vista Del Mar, La Jolla, CA 92037', price: 3450000, rebate: 21562 },
  { label: 'Scottsdale Desert Ridge', address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253', price: 2150000, rebate: 13437 },
  { label: 'Austin Modern Glass', address: '4220 Oak Hollow Terrace, Austin, TX 78746', price: 1850000, rebate: 11562 },
];

export default function GrokCandidateA({ 
  onSelectAddress,
  onRunAudit,
  selectedAddress = '742 Vista Del Mar, La Jolla, CA 92037',
  rebateAmount = 21562
}) {
  const [inputVal, setInputVal] = useState(selectedAddress);
  const [showMlsOptions, setShowMlsOptions] = useState(false);
  const [mlsSource, setMlsSource] = useState('Realtor.com');
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
      className="w-full rounded-3xl overflow-hidden border-2 shadow-2xl text-left select-none font-sans"
      style={{ 
        background: 'linear-gradient(180deg, #fbf7f0 0%, #ede0cc 100%)',
        borderColor: `${GOLD}80`,
        color: '#1a1815'
      }}
    >
      {/* ── TOP SECTION: ASYMMETRICAL SPLIT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#0a0a0a]/10">
        
        {/* LEFT COLUMN: BRAND, HEADLINE, SEARCH & 3 CARDS (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img src={DYSON_LOGO} alt="DysonHomes" className="h-7 sm:h-8 w-auto object-contain drop-shadow" />
              <div className="leading-tight">
                <span 
                  className="font-bold text-lg sm:text-xl text-[#0a0a0a] tracking-tight block"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  DysonHomes
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#854d0e] block">
                  Private Copilot
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 border border-[#D4AF37]/40 text-[#854d0e] text-[11px] font-medium">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>35-Year Brokerage Fiduciary</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#0a0a0a] text-[#D4AF37] text-[10px] font-semibold border border-[#D4AF37]/50 shadow-sm">
                Format A · Split Screen
              </span>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div className="space-y-2.5">
            <h1 
              className="text-2xl sm:text-3xl font-semibold text-[#0a0a0a] leading-snug tracking-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Your human &amp; AI-assisted <br className="hidden sm:inline" />
              <span className="text-[#854d0e]">private real estate copilot</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#3a342c] leading-relaxed max-w-xl font-normal">
              Paste any address to see real comps, property risks, and your closing rebate — where allowed by law.
            </p>

            {/* Fiduciary Trust Statement */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf5ec] border border-[#D4AF37]/50 text-[#684614] text-[11px] font-normal shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
              <span>No agent spam. Independent fiduciary match — not the listing agent.</span>
            </div>
          </div>

          {/* Search Box & MLS Options */}
          <div className="space-y-2 pt-1">
            <form onSubmit={handleSubmit} className="relative">
              <div 
                className="flex items-center rounded-2xl p-1.5 sm:p-2 pl-3.5 sm:pl-4 gap-2 transition-all bg-[#ffffff] border-2 border-[#D4AF37] shadow-xl focus-within:ring-2 focus-within:ring-[#D4AF37]/50"
              >
                <MapPin className="w-4 h-4 text-[#854d0e] shrink-0" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Paste property address (e.g. 742 Vista Del Mar, La Jolla, CA)..."
                  className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm font-medium outline-none placeholder:text-stone-400"
                />

                {/* Talk to Charlie Voice AI */}
                <Link
                  to="/talking-app"
                  className="p-2 rounded-xl bg-black hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50 shrink-0 transition-transform active:scale-95"
                  title="Talk with Charlie (Voice AI)"
                >
                  <Mic className="w-4 h-4" />
                </Link>

                <button
                  type="submit"
                  disabled={submitted}
                  className="px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-black transition-all hover:brightness-105 active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
                  style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})` }}
                >
                  <span>{submitted ? 'Auditing...' : 'Send'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </form>

            {/* Instant 1-Click Sample Chips & MLS Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
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

              {/* MLS Source Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMlsOptions(!showMlsOptions)}
                  className="text-[11px] font-semibold text-[#854d0e] hover:text-[#0a0a0a] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>MLS options ({mlsSource})</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showMlsOptions && (
                  <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl p-1.5 z-20 text-xs text-white space-y-1">
                    {['Realtor.com', 'Homes.com', 'Direct MLS Feed'].map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => {
                          setMlsSource(src);
                          setShowMlsOptions(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between ${
                          mlsSource === src ? 'bg-[#D4AF37] text-black font-bold' : 'hover:bg-white/10 text-white/80'
                        }`}
                      >
                        <span>{src}</span>
                        {mlsSource === src && <Check className="w-3 h-3 text-black" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3 Benefit Feature Cards in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            
            {/* Card 1: Honest Comps */}
            <div className="p-3.5 rounded-2xl bg-[#ffffff]/95 border border-[#D4AF37]/50 shadow-sm space-y-1 transition-all hover:shadow-md hover:border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#854d0e]/10 text-[#854d0e] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#0a0a0a]">1. Honest comps</h4>
              </div>
              <p className="text-[11px] text-[#554c40] leading-snug">
                Real market data. No fluff. No bias.
              </p>
            </div>

            {/* Card 2: Hidden Risks Check */}
            <div className="p-3.5 rounded-2xl bg-[#ffffff]/95 border border-[#D4AF37]/50 shadow-sm space-y-1 transition-all hover:shadow-md hover:border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#0a0a0a]">2. Hidden risks</h4>
              </div>
              <p className="text-[11px] text-[#554c40] leading-snug">
                Flood, fire, and HOA hazards &amp; more.
              </p>
            </div>

            {/* Card 3: Closing-Cost Credit */}
            <div className="p-3.5 rounded-2xl bg-[#ffffff]/95 border border-[#D4AF37]/50 shadow-sm space-y-1 transition-all hover:shadow-md hover:border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#0a0a0a]">3. Closing rebate</h4>
              </div>
              <p className="text-[11px] text-[#554c40] leading-snug">
                Where allowed by law. Transparent &amp; upfront.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: ARCHITECTURAL LUXURY ESTATE PHOTO (5 cols) */}
        <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-stone-900 overflow-hidden">
          <img 
            src={ESTATE_IMAGE} 
            alt="Luxury Executive Estate" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* Refined Estate Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-white/60 block">
                Sample Property Audit
              </span>
              <span className="text-xs font-semibold block text-white/95">
                $3.45M Estate · La Jolla, CA
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/60 block">
                Estimated Closing Rebate
              </span>
              <span className="text-xs font-bold text-[#10b981] font-mono block">
                +${rebateAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── LOWER BAR: HOW IT WORKS (3 STEPS) ── */}
      <div className="p-6 sm:p-8 bg-[#f5ecde]/80 space-y-4 border-t border-[#0a0a0a]/10">
        <div className="flex items-center justify-between">
          <h3 
            className="text-base sm:text-lg font-bold text-[#0a0a0a] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            How it works
          </h3>
          <span className="text-[10px] font-semibold text-[#854d0e] uppercase tracking-wider">
            3 Simple Steps • Zero Agent Pressure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-[#ffffff]/90 border border-[#0a0a0a]/10 flex items-start gap-3 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#0a0a0a] text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
              1
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">Paste an address</h4>
              <p className="text-[11px] text-[#5a5144] mt-0.5 leading-snug">
                Share any U.S. property address or online link from any real estate site.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-[#ffffff]/90 border border-[#0a0a0a]/10 flex items-start gap-3 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#0a0a0a] text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
              2
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">We analyze</h4>
              <p className="text-[11px] text-[#5a5144] mt-0.5 leading-snug">
                Our human &amp; AI copilot delivers comps, risk &amp; closing rebate insights.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-[#ffffff]/90 border border-[#0a0a0a]/10 flex items-start gap-3 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#0a0a0a] text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
              3
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#0a0a0a]">You decide</h4>
              <p className="text-[11px] text-[#5a5144] mt-0.5 leading-snug">
                Review independently. Move forward with total clarity and confidence.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}