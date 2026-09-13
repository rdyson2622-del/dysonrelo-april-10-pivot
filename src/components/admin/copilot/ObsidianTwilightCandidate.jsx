import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, ArrowRight, TrendingUp, AlertTriangle, 
  Percent, FileText, CheckCircle2, Compass, Brain, Sparkles,
  BarChart3, ShieldAlert, Award, Mic, Lock, Info, Check, DollarSign, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';

const PRESET_SAMPLES = [
  { label: 'Beverly Hills Estate', address: '72 Beverly Park Ln, Beverly Hills, CA 90210', price: 14500000, rebate: 90625 },
  { label: 'La Jolla Oceanfront', address: '742 Vista Del Mar, La Jolla, CA 92037', price: 3450000, rebate: 21562 },
  { label: 'Scottsdale Desert Ridge', address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253', price: 2150000, rebate: 13437 },
];

export default function ObsidianTwilightCandidate({
  selectedAddress = '742 Vista Del Mar, La Jolla, CA 92037',
  rebateAmount = 21562,
  onRunAudit
}) {
  const [address, setAddress] = useState(selectedAddress);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activePillar, setActivePillar] = useState('comps'); // 'comps' | 'risks' | 'rebate'
  const [showStateLegal, setShowStateLegal] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!address.trim()) return;
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      if (onRunAudit) onRunAudit(address);
    }, 450);
  };

  const handlePickSample = (sample) => {
    setAddress(sample.address);
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      if (onRunAudit) onRunAudit(sample.address);
    }, 400);
  };

  return (
    <div className="rounded-3xl bg-[#060606] text-white border border-[#D4AF37]/50 shadow-2xl overflow-hidden font-sans select-none">
      
      {/* ── 1. TOP PRIVATE WEALTH ACCREDITATION BAR ── */}
      <div className="px-5 sm:px-7 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-serif text-2xl tracking-wider font-bold">▲▲</span>
            <div>
              <span className="font-serif text-sm tracking-[0.22em] font-bold text-white block uppercase leading-none">
                DYSON HOMES
              </span>
              <span className="text-[8px] tracking-[0.28em] text-[#D4AF37] uppercase font-bold block mt-0.5 leading-none">
                COPILOT
              </span>
            </div>
          </div>
          <span className="h-4 w-px bg-white/20 hidden sm:inline-block mx-1" />
          <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white/60 hidden sm:inline-block">
            PRIVATE REAL ESTATE INTELLIGENCE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10.5px] text-white/70">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>35 Years High-End Brokerage • CA DRE #02303118</span>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center gap-1.5 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>ZERO-UI CONCIERGE</span>
          </span>
        </div>
      </div>

      {/* ── 2. MAIN ASYMMETRICAL SPLIT HERO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left Content Column (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#080808] via-[#0d0d0d] to-[#040404]">
          
          <div className="space-y-4">
            
            {/* The Trust Shield Pill (Anti-Aggregator Defense) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120b] border border-[#D4AF37]/60 text-[11px] text-[#D4AF37] font-semibold shadow-lg">
              <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
              <span className="text-white/90">
                <strong>The Trust Shield:</strong> No agent spam. Independent fiduciary match — not the listing agent.
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.12]"
            >
              Your human &amp; <br />
              AI-assisted private <br />
              <span className="text-[#e8c84a] italic font-serif">real estate copilot.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/75 max-w-lg leading-relaxed font-light">
              Before clicking 'Contact Agent' on any aggregator portal, paste the address here. Receive unvarnished sold comps, hidden property risks, and claim your closing cost rebate.
            </p>
          </div>

          {/* Search Box + Charlie Voice Button */}
          <div className="space-y-2.5 pt-1">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-[#121212] rounded-2xl border-2 border-[#D4AF37]/75 p-1.5 shadow-2xl focus-within:border-[#D4AF37] transition-all">
                <div className="pl-3 pr-2 flex items-center gap-2 text-white/40 shrink-0">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste property address (e.g., 72 Beverly Park Ln, Beverly Hills, CA)"
                  className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-white/40 font-light"
                />

                {/* Talk with Charlie Voice Concierge */}
                <Link
                  to="/talking-app"
                  className="p-2 rounded-xl bg-black hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50 shrink-0 transition-transform active:scale-95 mr-1"
                  title="Talk with Charlie (Real-Time Voice AI)"
                >
                  <Mic className="w-4 h-4" />
                </Link>

                <button
                  type="submit"
                  disabled={isAuditing}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-black bg-[#D4AF37] hover:bg-[#e8c84a] transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}
                >
                  <span>{isAuditing ? 'Auditing...' : 'RUN COPILOT'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </form>

            {/* Instant 1-Click Sample Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-white/40 text-[10.5px] uppercase font-bold tracking-wider mr-1">
                Try Sample:
              </span>
              {PRESET_SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickSample(s)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                    address === s.address
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/15'
                  }`}
                >
                  {s.label} (${(s.price / 1000000).toFixed(1)}M)
                </button>
              ))}
            </div>
          </div>

          {/* ── 3 THE IRRESISTIBLE VALUE PILLARS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Pillar 1: Honest Comps */}
            <div 
              onClick={() => setActivePillar('comps')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-md space-y-1.5 ${
                activePillar === 'comps'
                  ? 'bg-[#161309] border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                  : 'bg-[#0f0f0f] border-white/10 hover:border-[#D4AF37]/50'
              }`}
            >
              <div className="flex items-center justify-between text-[#D4AF37]">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    HONEST COMPS
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-[#D4AF37]/60" />
              </div>
              <p className="text-[11px] text-white/75 leading-snug">
                Unvarnished neighborhood closed sales vs. listing agent hype.
              </p>
            </div>

            {/* Pillar 2: Hidden Risks */}
            <div 
              onClick={() => setActivePillar('risks')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-md space-y-1.5 ${
                activePillar === 'risks'
                  ? 'bg-[#180e0e] border-red-500/80 ring-1 ring-red-500/50'
                  : 'bg-[#0f0f0f] border-white/10 hover:border-red-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-red-400">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    HIDDEN RISKS
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-red-400/60" />
              </div>
              <p className="text-[11px] text-white/75 leading-snug">
                Permits, coastal easements, title &amp; DOM reality portals hide.
              </p>
            </div>

            {/* Pillar 3: Closing Rebate */}
            <div 
              onClick={() => setActivePillar('rebate')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-md space-y-1.5 ${
                activePillar === 'rebate'
                  ? 'bg-[#0e1712] border-emerald-500/80 ring-1 ring-emerald-500/50'
                  : 'bg-[#0f0f0f] border-white/10 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <Percent className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">
                    CLOSING REBATE
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 text-emerald-400/60" />
              </div>
              <p className="text-[11px] text-white/75 leading-snug">
                Up to 50% referral fee credited back on your closing HUD-1.
              </p>
            </div>

          </div>

          {/* Active Pillar Inspector Footnote */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs flex items-center justify-between text-white/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[11px]">
                {activePillar === 'comps' && 'Comps Audit: Pulls real closed comps from regional MLS feeds within 0.5 miles.'}
                {activePillar === 'risks' && 'Risk Due Diligence: Scans days-on-market history, tax recalculations, and title encumbrances.'}
                {activePillar === 'rebate' && 'Closing Rebate: Credited directly toward closing costs or mortgage rate buy-down in 40 legal states.'}
              </span>
            </div>
            {activePillar === 'rebate' && (
              <button
                type="button"
                onClick={() => setShowStateLegal(!showStateLegal)}
                className="text-[10px] text-[#D4AF37] hover:underline font-bold shrink-0 ml-2"
              >
                {showStateLegal ? 'Close Legal' : 'View 40-State Map'}
              </button>
            )}
          </div>

          {showStateLegal && (
            <div className="p-3 rounded-xl bg-[#14120b] border border-[#D4AF37]/50 text-[11px] text-white/70 space-y-1">
              <div className="font-bold text-[#D4AF37]">DOJ-Approved Commission Rebate Status:</div>
              <p>Rebates are 100% legal in 40 states under federal antitrust guidelines. In the 10 prohibited states (AL, AK, IA, KS, LA, MS, MO, OK, OR, TN), DysonHomes provides full independent fiduciary representation and negotiation counsel.</p>
            </div>
          )}

        </div>

        {/* Right Architectural Image Column (5 cols) */}
        <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full bg-black overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=95"
            alt="Twilight Glass Villa with Infinity Pool"
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent hidden lg:block" />

          {/* Floating Compass Pill */}
          <div className="absolute bottom-5 right-5 p-3 rounded-full bg-black/85 border border-[#D4AF37]/70 text-[#D4AF37] shadow-2xl backdrop-blur-md">
            <Compass className="w-5 h-5 text-[#D4AF37]" />
          </div>

          {/* Property Overlay Badge */}
          <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-white/90 text-[11px] font-semibold backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span>Beverly Hills, CA • $14.5M</span>
          </div>

          {/* Overlay Quote */}
          <div className="absolute bottom-5 left-5 right-16 p-3.5 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md">
            <p className="text-xs italic text-white/90 font-serif leading-snug">
              “Never buy unrepresented. We protect your equity with fiduciary independence.”
            </p>
            <div className="text-[10px] text-[#D4AF37] font-semibold mt-1">
              — Bob Dyson, Managing Broker
            </div>
          </div>
        </div>

      </div>

      {/* ── 4. HORIZONTAL 4-STEP PROCESS LINE ── */}
      <div className="p-6 bg-[#040404] border-t border-white/10 space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            HOW DYSON HOMES COPILOT WORKS · THE 4-STEP DELIVERY
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs max-w-5xl mx-auto">
          
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#111] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 text-[#D4AF37] font-black text-xs shadow-inner">
              1
            </div>
            <div>
              <div className="font-bold text-white text-[11.5px] uppercase tracking-wider">PASTE ADDRESS</div>
              <div className="text-white/60 text-[11px] mt-0.5 leading-snug">Share property details or any online listing link.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#111] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 text-[#D4AF37] font-black text-xs shadow-inner">
              2
            </div>
            <div>
              <div className="font-bold text-white text-[11.5px] uppercase tracking-wider">AI + HUMAN ANALYSIS</div>
              <div className="text-white/60 text-[11px] mt-0.5 leading-snug">Copilot audits with AI precision &amp; broker expertise.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#111] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 text-[#D4AF37] font-black text-xs shadow-inner">
              3
            </div>
            <div>
              <div className="font-bold text-white text-[11.5px] uppercase tracking-wider">INTELLIGENCE DELIVERED</div>
              <div className="text-white/60 text-[11px] mt-0.5 leading-snug">Unbiased comps, risks, and rebate in one private report.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#111] border border-[#D4AF37]/60 flex items-center justify-center shrink-0 text-[#D4AF37] font-black text-xs shadow-inner">
              4
            </div>
            <div>
              <div className="font-bold text-white text-[11.5px] uppercase tracking-wider">BETTER DECISIONS</div>
              <div className="text-white/60 text-[11px] mt-0.5 leading-snug">Close with confidence. Retain maximum equity.</div>
            </div>
          </div>

        </div>

        <div className="text-center pt-2">
          <span className="text-[9.5px] tracking-[0.25em] font-serif text-[#D4AF37]/80 uppercase">
            FOR ACCREDITED INVESTORS &amp; PRIVATE WEALTH • DYSONHOMES.COM
          </span>
        </div>
      </div>

    </div>
  );
}