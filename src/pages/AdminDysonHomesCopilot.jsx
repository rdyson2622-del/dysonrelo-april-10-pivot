import React, { useState } from 'react';
import { 
  Search, Mic, ShieldCheck, Sparkles, DollarSign, AlertTriangle, 
  TrendingUp, CheckCircle2, Phone, MessageSquare, ArrowRight, 
  Smartphone, Monitor, Copy, Check, ExternalLink, Play, Radio,
  Lock, Share2, Compass, Home, Info, ChevronRight, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

// Sample properties for instant 1-click preview
const SAMPLE_PROPERTIES = [
  {
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
    pros: [
      'Unobstructed ocean sunset view easements protected by deed',
      'High walkability score to Bird Rock village'
    ],
    listingOffice: 'Independent Coastal Brokerage',
    lastSoldPrice: 2100000,
    lastSoldYear: 2019
  },
  {
    address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    price: 2150000,
    beds: 4,
    baths: 3,
    sqft: 3240,
    dom: 18,
    compsPrice: 2125000,
    rebate: 13437,
    risks: [
      'HOA rental restriction: minimum 12-month lease required (no short-term Airbnb)',
      'Dual A/C units are 14 years old — approaching replacement lifecycle'
    ],
    pros: [
      'Camelback Mountain view corridor',
      'Zero state income tax migration corridor'
    ],
    listingOffice: 'Southwest Luxury Realty',
    lastSoldPrice: 1420000,
    lastSoldYear: 2021
  },
  {
    address: '4220 Oak Hollow Terrace, Austin, TX 78746',
    price: 1850000,
    beds: 3,
    baths: 3.5,
    sqft: 2890,
    dom: 42,
    compsPrice: 1775000,
    rebate: 11562,
    risks: [
      'Travis County tax reassessment will trigger ~18% property tax escalation next cycle',
      'Flash flood zone buffer near greenbelt easement'
    ],
    pros: [
      'Top-rated Eanes ISD school district feeder pattern',
      'Complete 2024 interior kitchen & plumbing remodel'
    ],
    listingOffice: 'Westlake Premier Estates',
    lastSoldPrice: 1150000,
    lastSoldYear: 2018
  }
];

export default function AdminDysonHomesCopilot() {
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop | mobile
  const [addressInput, setAddressInput] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(SAMPLE_PROPERTIES[0]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState('consumer_mockup'); // consumer_mockup | dnn_sponsor | admin_specs

  const handleSelectSample = (property) => {
    setIsAuditing(true);
    setAddressInput(property.address);
    setSmsSent(false);
    setTimeout(() => {
      setSelectedProperty(property);
      setIsAuditing(false);
    }, 450);
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsAuditing(true);
    setSmsSent(false);

    // Dynamic mock valuation generator based on input
    setTimeout(() => {
      setSelectedProperty({
        address: addressInput,
        price: 1950000,
        beds: 4,
        baths: 3.5,
        sqft: 3100,
        dom: 38,
        compsPrice: 1890000,
        rebate: 12187,
        risks: [
          'Average sales in this micro-pocket closed 3.5% below initial list price',
          'Check title for easement or municipal zoning updates prior to offer',
          'Property tax basis will recalculate to purchase price upon closing'
        ],
        pros: [
          'High buyer demand area with solid appreciation history',
          'Strong neighborhood school ratings and infrastructure'
        ],
        listingOffice: 'Syndicated Regional Listing',
        lastSoldPrice: 1320000,
        lastSoldYear: 2020
      });
      setIsAuditing(false);
    }, 600);
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!smsPhone) return;
    setSmsSent(true);
  };

  const copySponsorScript = () => {
    const text = `Today's housing market report is brought to you by DysonHomes Copilot at DysonHomes.com. Before you click 'Contact Agent' on any online home search site or aggregator, paste the address into DysonHomes.com to see unvarnished comps, hidden property risks, and claim your buyer closing cost rebate. Human and AI assisted real estate intelligence at DysonHomes.com.`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="min-h-screen text-[#0a0a0a] p-3 sm:p-6 lg:p-8 space-y-6 select-none" style={{ background: TAN_BG }}>
      
      {/* ─────────────────────────────────────────────────────────────
          ADMIN LABORATORY INSPECTOR BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="p-4 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
              ADMIN LAB · CONSUMER ZERO-UI PIVOT
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              DysonHomes Copilot Lab (DysonHomes.com)
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
            Eliminates all portal login walls and friction. The consumer pastes any listing address or link, gets instant comp reality, risk analysis, and exact rebate dollars, backed by Charlie AI and Bob Dyson's licensed brokerage.
          </p>
        </div>

        {/* View Controls & GoDaddy Indicator */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain status pill */}
          <div className="px-3 py-1.5 rounded-xl bg-[#141414] border border-[#D4AF37]/40 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-white/80 font-mono text-[11px]">DysonHomes.com</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">READY</span>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('consumer_mockup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'consumer_mockup' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Consumer Experience
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dnn_sponsor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dnn_sponsor' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              DNN News Sponsor Hook
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin_specs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin_specs' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Architecture &amp; Economics
            </button>
          </div>

          {/* Viewport switch */}
          {activeTab === 'consumer_mockup' && (
            <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'
                }`}
                title="Mobile Phone View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE CONSUMER COPILOT MOCKUP
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'consumer_mockup' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#0a0a0a]/70 px-2 font-medium">
            <span>
              Simulating live consumer view for <strong>https://dysonhomes.com</strong>
            </span>
            <span className="text-[#854d0e] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Zero UI • Zero Sales Pitch • Pure Buyer Intelligence
            </span>
          </div>

          {/* Frame Container */}
          <div className="flex justify-center w-full">
            <div 
              className={`transition-all duration-300 w-full rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden ${
                viewportMode === 'mobile' ? 'max-w-[420px]' : 'max-w-5xl'
              }`}
              style={{ background: '#0a0a0a' }}
            >
              {/* Fake Browser URL Bar */}
              <div className="px-4 py-2.5 bg-[#141414] border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="px-6 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 font-mono text-[11px] flex items-center gap-1.5 shadow-inner">
                  <Lock className="w-3 h-3 text-[#10b981]" />
                  <span>https://dysonhomes.com</span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
                  Live Copilot
                </span>
              </div>

              {/* ── CONSUMER HERO SECTION ── */}
              <div className="px-4 py-8 sm:py-12 sm:px-8 text-center space-y-5 text-white">
                
                {/* Brand Logo & Copilot Mark */}
                <div className="inline-flex flex-col items-center">
                  <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 sm:h-12 w-auto mb-2" />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17140b] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black tracking-widest uppercase shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>DysonHomes Copilot</span>
                  </div>
                </div>

                {/* Primary Value Headline */}
                <div className="max-w-2xl mx-auto space-y-2">
                  <h1 
                    className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Your Human &amp; AI-Assisted <br className="hidden sm:inline" />
                    <span className="text-[#D4AF37]">Private Real Estate Copilot.</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
                    Paste any address from any online real estate site to see real sold comps, hidden property risks, and your calculated cash rebate at closing.
                  </p>
                </div>

                {/* ── THE ZERO-UI SEARCH PROMPT ── */}
                <div className="max-w-2xl mx-auto pt-2">
                  <form onSubmit={handleCustomSearch} className="relative">
                    <div 
                      className="flex items-center rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3.5 gap-2 sm:gap-3 transition-all bg-[#1a1a1a] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.2)]"
                    >
                      <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <input
                        type="text"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        placeholder="Paste any address or online home link..."
                        className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-white/40"
                      />
                      
                      <Link 
                        to="/talking-app"
                        className="p-2 rounded-xl bg-black/60 hover:bg-black text-[#10b981] border border-[#10b981]/40 shrink-0 transition-transform active:scale-95"
                        title="Talk with Charlie (Voice AI)"
                      >
                        <Mic className="w-4 h-4" />
                      </Link>

                      <button
                        type="submit"
                        disabled={isAuditing}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-black shrink-0 transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-md"
                        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})` }}
                      >
                        {isAuditing ? 'Auditing...' : 'Run Copilot'}
                      </button>
                    </div>
                  </form>

                  {/* 1-Click Sample Address Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 text-xs">
                    <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mr-1">
                      Try Sample:
                    </span>
                    {SAMPLE_PROPERTIES.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSample(p)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer truncate max-w-[220px] ${
                          selectedProperty.address === p.address
                            ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                        }`}
                      >
                        {p.address.split(',')[0]} (${(p.price / 1000000).toFixed(2)}M)
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── COPILOT INTELLIGENCE DOSSIER (THE PAYOFF) ── */}
              {selectedProperty && (
                <div className="p-4 sm:p-6 lg:p-8 border-t border-[#D4AF37]/30 bg-[#0e0e0e] space-y-6">
                  
                  {/* Property Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-black border border-white/10">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-white">
                          {selectedProperty.address}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                          Verified Listing
                        </span>
                      </div>
                      <p className="text-xs text-white/50">
                        {selectedProperty.beds} Beds • {selectedProperty.baths} Baths • {selectedProperty.sqft?.toLocaleString()} SqFt • {selectedProperty.dom} Days on Market • Office: {selectedProperty.listingOffice}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xs text-white/40 uppercase font-bold tracking-wider">
                        Current List Price
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                        ${selectedProperty.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 3 Core Analytical Blocks: Rebate, Comps, Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    
                    {/* BLOCK 1: 50% REFERRAL REBATE CALCULATOR */}
                    <div className="p-4 rounded-2xl bg-[#14120b] border-2 border-[#D4AF37] shadow-lg flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                            YOUR CASH BACK AT CLOSING
                          </span>
                          <span className="p-1 rounded-md bg-[#D4AF37]/20 text-[#D4AF37]">
                            <DollarSign className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                          +${selectedProperty.rebate?.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                          Up to <strong>50% of our brokerage referral fee</strong> credited directly to your closing settlement statement or rate buy-down.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#D4AF37]/30 text-[10px] text-white/50 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>Listing Side Fee:</span>
                          <span>2.5% (${(selectedProperty.price * 0.025).toLocaleString()})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dyson 25% Referral:</span>
                          <span>${(selectedProperty.rebate * 2).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#D4AF37] font-bold">
                          <span>Your 50% Rebate:</span>
                          <span>${selectedProperty.rebate?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* BLOCK 2: UNVARNISHED COMPS REALITY */}
                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/15 shadow-md flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#60a5fa]">
                            UNBIASED COMPS VALUATION
                          </span>
                          <span className="p-1 rounded-md bg-blue-500/20 text-[#60a5fa]">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">
                          ${selectedProperty.compsPrice?.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                          Estimated market value based on actual closed neighborhood sales, not asking prices or algorithmic hype.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 text-[10px] text-white/50 space-y-1">
                        <div className="flex justify-between">
                          <span>Spread vs Ask:</span>
                          <span className={selectedProperty.price > selectedProperty.compsPrice ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                            {selectedProperty.price > selectedProperty.compsPrice 
                              ? `-$${(selectedProperty.price - selectedProperty.compsPrice).toLocaleString()} (Overpriced)`
                              : 'Fairly Priced'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Sold ({selectedProperty.lastSoldYear}):</span>
                          <span>${selectedProperty.lastSoldPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* BLOCK 3: HIDDEN PROPERTY RISKS & FLAWS */}
                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/15 shadow-md flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#f87171]">
                            HIDDEN RISKS &amp; AUDIT
                          </span>
                          <span className="p-1 rounded-md bg-red-500/20 text-[#f87171]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1.5 text-[11px] text-white/80">
                          {selectedProperty.risks.map((risk, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-red-400 font-bold leading-none shrink-0">•</span>
                              <span className="leading-snug">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-400">
                        ✓ Deed &amp; zoning audit performed by Dyson copilot
                      </div>
                    </div>

                  </div>

                  {/* ── ZERO-TRAP PRIVATE DELIVERY & TALK WITH CHARLIE ── */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#17140b] border border-[#D4AF37]/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                          PRIVATE DOSSIER · NO AGENT HARASSMENT
                        </span>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        We don't auction your phone number to 5 competing agents. Get this full property audit, comps report, and rebate guarantee sent straight to your cell.
                      </p>
                    </div>

                    {/* Send form */}
                    <div className="shrink-0 w-full md:w-auto">
                      {smsSent ? (
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Dossier sent to {smsPhone}. Check your messages!</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSendSms} className="flex items-center gap-2">
                          <input
                            type="tel"
                            value={smsPhone}
                            onChange={(e) => setSmsPhone(e.target.value)}
                            placeholder="(555) 000-0000"
                            required
                            className="px-3 py-2 rounded-xl bg-black border border-white/20 text-white text-xs w-36 sm:w-44 focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            type="submit"
                            className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black font-black text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-md"
                          >
                            Text Me Dossier
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* ── HUMAN + AI SAFETY NET FOOTER ── */}
                  <div className="p-4 rounded-2xl bg-black border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-bold">
                        BD
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">
                          Human Fiduciary Oversight
                        </div>
                        <div className="text-[11px] text-white/50">
                          Audited by Bob Dyson &amp; licensed brokers. 55 years of California transaction governance.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/talking-app"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-all"
                      >
                        <Mic className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Discuss with Charlie</span>
                      </Link>
                      <a
                        href="tel:+18583531200"
                        className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
                      >
                        <Phone className="w-3 h-3" />
                        <span>(858) 353-1200</span>
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* ── DNN REAL ESTATE NEWS LIVE TICKER INTEGRATION ── */}
              <div className="px-4 py-3 bg-[#050505] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                    DNN HOUSING PULSE:
                  </span>
                  <span className="text-white/80 text-[11px] truncate max-w-md">
                    Mortgage rates ease to 6.35% as buyers turn to private fee-rebating brokerages over aggregator portals.
                  </span>
                </div>

                <Link
                  to="/dnn-news"
                  className="text-[10px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>Watch Today's 6AM Brief</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: DNN SPONSOR BROADCAST INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'dnn_sponsor' && (
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                  LEGAL SAFE-HARBOR MEDIA HOOK
                </span>
                <h2 className="text-xl font-bold text-white">
                  DNN News Broadcast "Presented By" Sponsor Integration
                </h2>
              </div>
              <button
                type="button"
                onClick={copySponsorScript}
                className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 cursor-pointer shadow-md"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied Script' : 'Copy Broadcast Script'}</span>
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              To avoid trademark disputes with national real estate portal aggregators, our daily news broadcast and social videos use generic, protective language ("online real estate portals" and "national home search sites").
            </p>

            {/* Approved Script Card */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/40 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#10b981] block">
                APPROVED 15-SECOND DNN SPONSOR BUMPER SCRIPT
              </span>
              <p className="text-sm text-white font-serif leading-relaxed italic bg-black/60 p-3 rounded-xl border border-white/10">
                “Today’s housing market report is brought to you by DysonHomes Copilot at <strong>DysonHomes.com</strong>. Before you click ‘Contact Agent’ on any online home search site, paste the address into <strong>DysonHomes.com</strong> to see unvarnished comps, hidden property risks, and claim your buyer closing cost rebate. Real estate intelligence without the sales pitch.”
              </p>
              <div className="flex justify-between items-center text-[10px] text-white/40 pt-1">
                <span>Presenter: Charlie Simmons or Bob Dyson</span>
                <span className="text-[#D4AF37] font-semibold">Destination: https://dysonhomes.com</span>
              </div>
            </div>

            {/* Organic Funnel Flywheel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <div className="text-[10px] font-bold text-red-400 uppercase">1. Top of Funnel (Media)</div>
                <div className="font-bold text-white text-xs">DNN Real Estate News</div>
                <p className="text-white/60 text-[11px]">
                  Daily market reports, Fed rates, housing updates on LinkedIn, social video &amp; email. Zero ad spend.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase">2. The Conversion Hook</div>
                <div className="font-bold text-white text-xs">DysonHomes.com Copilot</div>
                <p className="text-white/60 text-[11px]">
                  Viewer visits DysonHomes.com, pastes a home they are touring, sees 50% rebate + unvarnished comps.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">3. The Revenue Engine</div>
                <div className="font-bold text-white text-xs">25% Referral Settlement</div>
                <p className="text-white/60 text-[11px]">
                  Dyson pairs buyer with top vetted PRN agent. Dyson collects 25%, credits 50% back to buyer, retains 50%.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: SYSTEM ARCHITECTURE & ECONOMICS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'admin_specs' && (
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                BUSINESS BLUEPRINT
              </span>
              <h2 className="text-xl font-bold text-white">
                DysonHomes.com 1-Man Scalable Operating Model
              </h2>
              <p className="text-xs text-white/70 mt-1">
                How all 12 internal admin modules power this sleek front-facing consumer experience without operational overhead.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Economics Per Closed Buyer</span>
                </h3>
                <div className="space-y-1.5 text-white/70 text-[11px]">
                  <p>• <strong>Average Purchase Price:</strong> $1,500,000</p>
                  <p>• <strong>Buyer Broker Commission (2.5%):</strong> $37,500</p>
                  <p>• <strong>Dyson Referral Fee (25%):</strong> $9,375</p>
                  <p>• <strong>50% Buyer Closing Rebate:</strong> <span className="text-emerald-400 font-bold">$4,687</span> (Credited on closing HUD-1)</p>
                  <p>• <strong>Dyson Net Retained Revenue:</strong> <span className="text-[#D4AF37] font-bold">$4,688</span> (Pure profit, zero inventory)</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>GoDaddy &amp; Custom Domain Plan</span>
                </h3>
                <div className="space-y-1.5 text-white/70 text-[11px]">
                  <p>• <strong>Consumer Landing URL:</strong> DysonHomes.com (Unused GoDaddy asset)</p>
                  <p>• <strong>Enterprise/Internal Domain:</strong> DysonRelo.com (Keeps all 12 admin apps intact)</p>
                  <p>• <strong>DNS Routing:</strong> CNAME pointer to Base44 hosting cluster</p>
                  <p>• <strong>Public Persona:</strong> Charlie Simmons (Gemini Voice AI) + Bob Dyson oversight</p>
                </div>
              </div>
            </div>

            {/* Connected Admin Modules List */}
            <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                INTEGRATED ADMIN CONSOLE MODULES CONNECTED TO DYSONHOMES COPILOT
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-white/80">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Relocation Call Desk
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ PRN Agent Bureau
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Preferred Vendors
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Charlie Voice AI
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Escrow Audit &amp; HUD-1
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ SMS Dispatch (Twilio)
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ DNN News Engine
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  ✓ Master Agreement Desk
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}