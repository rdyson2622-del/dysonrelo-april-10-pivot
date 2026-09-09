import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp,
  Sun, Mountain, Waves, Users, Briefcase, Building, Compass
} from 'lucide-react';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';

const GOLD = '#D4AF37';

// Curated high-valued architectural luxury estates captured at sunset and twilight
const HERO_BACKGROUNDS = [
  {
    id: 'scottsdale',
    city: 'Scottsdale, AZ',
    title: 'Desert Sunset Architectural Estate',
    tag: '$8.9M • 0% Income Tax Destination',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'austin',
    city: 'Austin, TX',
    title: 'Twilight Hill Country Glass Villa',
    tag: '$7.5M • Corporate Tech Relo Hub',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'naples',
    city: 'Naples, FL',
    title: 'Waterfront Sunset Palm Estate',
    tag: '$12.8M • Coastal Relo Haven',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'boulder',
    city: 'Boulder, CO',
    title: 'Mountain Contemporary Glass Manor',
    tag: '$9.2M • Alpine Lifestyle Relo',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95',
  },
];

// Top destination market cards shown in the clean destination strip
const QUICK_MARKETS = [
  {
    city: 'Scottsdale, AZ',
    state: 'AZ',
    avgPrice: '$3.85M',
    tag: 'Low Tax • Sunbelt',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Austin, TX',
    state: 'TX',
    avgPrice: '$4.25M',
    tag: '0% State Tax • Tech',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Naples, FL',
    state: 'FL',
    avgPrice: '$6.75M',
    tag: 'Waterfront • No Tax',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Boulder, CO',
    state: 'CO',
    avgPrice: '$4.90M',
    tag: 'Mountain Outdoors',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Nashville, TN',
    state: 'TN',
    avgPrice: '$3.95M',
    tag: '0% State Tax • Belle Meade',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Dallas, TX',
    state: 'TX',
    avgPrice: '$5.40M',
    tag: 'Highland Park • Executive',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=90',
  },
];

export default function LuxuryHeroShowcase({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchEngine = 'realtor',
  setSearchEngine,
  onQuickMarketClick,
}) {
  const navigate = useNavigate();
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [searchTab, setSearchTab] = useState('buy'); // buy, low_tax, new_construction
  const currentBg = HERO_BACKGROUNDS[activeBgIndex];

  return (
    <div className="w-full">
      {/* 2-COLUMN STRUCTURE:
          Left Sidebar: Narrowed by 15% (lg:w-[285px] xl:w-[310px]) to save space and make all content fit snugly.
          Right Canvas: Pure, reduced-size architectural home photo on top, followed by Search Pill 1ST, then the copy & category tabs. */}
      <div className="flex flex-col lg:flex-row w-full rounded-t-2xl overflow-hidden shadow-2xl bg-[#0a0a0a] border-b border-[#D4AF37]/30">
        
        {/* ========================================================
            LEFT SIDEBAR (NARROWED BY 15% — SNUG & ELEGANT)
            ======================================================== */}
        <aside 
          className="w-full lg:w-[285px] xl:w-[310px] shrink-0 p-4 sm:p-5 flex flex-col justify-between text-left relative z-20"
          style={{
            background: 'linear-gradient(180deg, #0e0e0e 0%, #080808 100%)',
            borderRight: `1.5px solid ${GOLD}35`,
          }}
        >
          {/* Top Branding & Fiduciary Headline */}
          <div className="space-y-2">
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm"
              style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}60`, color: GOLD }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>55+ YEARS • NATIONWIDE CONCIERGE</span>
            </div>

            <div>
              <h2
                className="font-bold leading-tight text-white tracking-tight"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(1.35rem, 1.75vw, 1.7rem)',
                }}
              >
                We Don't Sell Real Estate.
              </h2>
              {/* REQUESTED CHANGE: We Orchestrate Your Entire Move. */}
              <p
                className="font-semibold mt-0.5 tracking-wide leading-snug"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.15rem',
                  color: '#fce38a',
                }}
              >
                We Orchestrate Your Entire Move.
              </p>
              <p className="text-[11px] text-white/70 font-sans font-medium mt-1 leading-relaxed">
                Independent agent vetting &amp; fiduciary relocation management across all 50 states — zero fees to buyers &amp; employers.
              </p>
            </div>

            {/* THREE STRATEGIC DOORWAY TILES */}
            <div className="space-y-1.5 pt-1.5">
              <div className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]/90 px-0.5">
                Select Your Pathway:
              </div>

              {/* Door 1: Families & Buyers */}
              <button
                type="button"
                onClick={() => navigate('/relocation-intake')}
                className="w-full group p-2.5 rounded-xl border border-white/10 bg-[#141414] hover:border-[#D4AF37] hover:bg-[#1a1a1a] transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
              >
                <div className="min-w-0 pr-1.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="text-[11px] font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      Relocating Families &amp; Buyers
                    </span>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/30 shrink-0">
                      Free
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/55 leading-tight truncate">
                    Agent vetting, tax &amp; school roadmap
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Door 2: Corporate HR & Employers */}
              <button
                type="button"
                onClick={() => navigate('/corporate-relo')}
                className="w-full group p-2.5 rounded-xl border border-white/10 bg-[#141414] hover:border-[#D4AF37] hover:bg-[#1a1a1a] transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
              >
                <div className="min-w-0 pr-1.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="text-[11px] font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      Corporate HR &amp; Employers
                    </span>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40 shrink-0">
                      Zero Fee
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/55 leading-tight truncate">
                    Executive move packages &amp; milestones
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Door 3: Agents & Brokerages */}
              <button
                type="button"
                onClick={() => navigate('/partner-benefits')}
                className="w-full group p-2.5 rounded-xl border border-white/10 bg-[#141414] hover:border-[#D4AF37] hover:bg-[#1a1a1a] transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
              >
                <div className="min-w-0 pr-1.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Building className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="text-[11px] font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      Agents &amp; Brokerages
                    </span>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-[#3b82f6]/20 text-[#60a5fa] font-bold border border-[#3b82f6]/40 shrink-0">
                      25% Referral
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/55 leading-tight truncate">
                    Receiving agent bureau &amp; escrow audits
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bottom Compliance & Fiduciary License Line */}
          <div className="pt-2.5 mt-2.5 border-t border-white/10 text-[9.5px] text-white/60 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>All 50 States</span>
            </span>
            <span className="font-mono text-white/80">CA DRE #02303118</span>
          </div>
        </aside>

        {/* ========================================================
            RIGHT CANVAS: 
            1. PURE & REDUCED-SIZE HOUSE PHOTO ON TOP
            2. SEARCH PILL 1ST DIRECTLY BELOW PHOTO
            3. THEN ALL COPY & TABS
            ======================================================== */}
        <div 
          className="flex-1 p-4 sm:p-5 flex flex-col justify-start text-white gap-3.5"
          style={{
            background: 'radial-gradient(ellipse at top, #151515 0%, #0a0a0a 100%)',
          }}
        >
          {/* ================= TOP: PURE & REDUCED-SIZE HOUSE PHOTO ================= */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl group bg-black h-[180px] sm:h-[210px] lg:h-[225px] shrink-0">
            {/* Pure Architectural Photo */}
            <img
              src={currentBg.url}
              alt={currentBg.title}
              key={currentBg.id}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Subtle soft gradient overlay to preserve crystal-clear architectural view */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)',
              }}
            />

            {/* Top Bar on Photo: Location Badge + Switcher Pills */}
            <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2 z-10">
              <div className="bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white/95 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-[#D4AF37] font-bold">Featured Destination:</span>
                <span>{currentBg.city}</span>
                <span className="text-white/60 text-[10.5px] hidden sm:inline ml-1 font-mono">({currentBg.tag})</span>
              </div>

              {/* Photo Switcher Pills */}
              <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/20 p-0.5 rounded-full text-[10.5px] shadow-md">
                {HERO_BACKGROUNDS.map((bg, idx) => (
                  <button
                    key={bg.id}
                    onClick={() => setActiveBgIndex(idx)}
                    className={`px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                      activeBgIndex === idx
                        ? 'bg-[#D4AF37] text-black font-bold shadow'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {bg.city.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Caption on Photo */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[11px] text-white/90 z-10 font-medium drop-shadow">
              <span>{currentBg.title}</span>
              <span className="text-white/60 text-[10px]">Pure Architectural View</span>
            </div>
          </div>

          {/* ================= BELOW PHOTO: SEARCH PILL 1ST, THEN COPY ================= */}
          <div className="w-full max-w-2xl mx-auto space-y-2.5 text-center">
            
            {/* 1ST: THE FLOATING LUXURY SEARCH PILL PLACED FIRST ABOVE ALL COPY */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchQuery);
              }}
              className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-full transition-all shadow-xl"
              style={{
                background: '#faf6ee',
                border: `2px solid ${GOLD}`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-center gap-2.5 w-full pl-5 py-1">
                <Search className="w-5 h-5 shrink-0" style={{ color: '#0a0a0a' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchTab === 'low_tax'
                      ? "Search 0% state tax havens (e.g. Scottsdale, Austin, Naples)..."
                      : searchTab === 'new_construction'
                      ? "Search new developments (e.g. Austin, Phoenix, Dallas)..."
                      : "Enter City, State, ZIP, or paste any listing URL to vet agent..."
                  }
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-stone-500"
                  style={{ color: '#0a0a0a' }}
                />
              </div>

              {/* Charlie Voice Concierge & Action Button */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 pr-1">
                <HeroGeminiConcierge />
                <button
                  type="submit"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:brightness-105"
                  style={{
                    background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                    color: '#0a0a0a',
                  }}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* THEN: THE HEADER & EXPLANATION COPY */}
            <div className="space-y-0.5 pt-0.5">
              <h3 
                className="text-xl sm:text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Search Destinations or let us Vet Any Listing for you.
              </h3>
              <p className="text-xs text-white/70 font-medium">
                Enter any destination market, or paste a link from Realtor, Zillow, or Homes.com
              </p>
            </div>

            {/* THEN: CATEGORY INTENT TABS */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[
                { id: 'buy', label: 'All Destination Homes' },
                { id: 'low_tax', label: '0% State Tax Havens' },
                { id: 'new_construction', label: 'New Construction' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id)}
                  className={`px-3 py-1 rounded-full text-[10.5px] font-bold transition-all cursor-pointer shadow ${
                    searchTab === tab.id
                      ? 'bg-[#D4AF37] text-black shadow-md scale-105'
                      : 'bg-[#181818] text-white/75 hover:text-white border border-white/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* THEN: VETTING HELPER NOTE */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10.5px] text-white/75 pt-0.5">
              <span>Looking at a specific listing?</span>
              <span className="text-[#fce38a] font-bold">
                Subscribe to have our fiduciary team vet the listing agent &amp; audit the escrow for you.
              </span>
              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('portal-subscribe-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/subscribe');
                }}
                className="underline text-[#D4AF37] hover:text-[#fce38a] font-semibold cursor-pointer ml-0.5"
              >
                (Subscription Required)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK DESTINATION PHOTO STRIP (HOMES.COM CATEGORIES STYLE) */}
      <div className="px-5 sm:px-8 py-4 border-b border-[#0a0a0a]/10" style={{ background: '#f5eee2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#0a0a0a]">
                Explore Top Relocation Destinations:
              </span>
            </div>
            <span className="text-[11px] text-[#665a4c] font-medium hidden sm:inline">
              Zero state tax &amp; executive growth hubs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {QUICK_MARKETS.map((m) => {
              const MarketIcon = m.icon;
              return (
                <button
                  key={m.city}
                  onClick={() => {
                    setSearchQuery(m.city);
                    onSearch(m.city);
                  }}
                  className="group relative rounded-xl overflow-hidden p-2.5 text-left border border-[#D4AF37]/50 shadow-md transition-all hover:scale-[1.03] hover:shadow-xl cursor-pointer flex flex-col justify-end min-h-[95px] bg-[#0a0a0a]"
                >
                  <img
                    src={m.image}
                    alt={m.city}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
                    }}
                  />
                  <div className="relative z-10">
                    <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 drop-shadow">
                      <MarketIcon className="w-2.5 h-2.5" />
                      <span>{m.tag}</span>
                    </span>
                    <span className="text-xs font-bold text-white leading-tight group-hover:text-[#D4AF37] transition-colors drop-shadow block">
                      {m.city}
                    </span>
                    <span className="text-[10px] text-white/90 font-mono block drop-shadow">
                      Avg {m.avgPrice}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}