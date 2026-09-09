import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, ShieldCheck, Users, Briefcase, Building 
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
          Left Sidebar: Elongated organized list of to-do's, including Talk with Charlie voice concierge & doorway pathways.
          Right Canvas: Unified single-line featured destination bar, pure architectural photo with luxury tan backdrop, and clean search pill. */}
      <div className="flex flex-col lg:flex-row w-full rounded-t-2xl overflow-hidden shadow-2xl bg-[#0a0a0a] border-b border-[#D4AF37]/30">
        
        {/* ========================================================
            LEFT SIDEBAR (ORGANIZED CONCIERGE TO-DO'S & PATHWAYS)
            ======================================================== */}
        <aside 
          className="w-full lg:w-[315px] xl:w-[335px] shrink-0 p-4 sm:p-5 flex flex-col justify-between text-left relative z-20"
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

            {/* ORGANIZED CONCIERGE ACTIONS & TO-DO'S */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]/90 px-0.5 flex items-center justify-between">
                <span>Concierge To-Do's:</span>
                <span className="text-[8px] text-white/50 lowercase tracking-normal">select one to begin</span>
              </div>

              {/* TO-DO 1: TALK WITH CHARLIE (AI VOICE CONCIERGE) */}
              <div className="pb-0.5">
                <HeroGeminiConcierge sidebarMode={true} />
              </div>

              {/* TO-DO 2: Families & Buyers */}
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

              {/* TO-DO 3: Corporate HR & Employers */}
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

              {/* TO-DO 4: Agents & Brokerages */}
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
            1. FEATURED DESTINATION BAR (ALL ON ONE LINE)
            2. PURE ARCHITECTURAL HOUSE PHOTO WITH TAN BACKDROP
            3. CLEAN LUXURY SEARCH PILL FIRST
            4. COPY & CATEGORY TABS
            ======================================================== */}
        <div 
          className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-start text-white gap-4 sm:gap-5"
          style={{
            background: 'radial-gradient(ellipse at top, #151515 0%, #0a0a0a 100%)',
          }}
        >
          {/* ================= 1. FEATURED DESTINATIONS BAR (ALL ON ONE LINE) ================= */}
          <div 
            className="w-full max-w-2xl mx-auto flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs shadow-lg"
            style={{
              background: '#0a0a0a',
              border: `1.5px solid ${GOLD}75`,
            }}
          >
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
              <span className="text-[#D4AF37] font-bold shrink-0 text-[11px] sm:text-xs">Featured:</span>
              <span className="font-bold text-white text-[11px] sm:text-xs truncate">{currentBg.city}</span>
              <span className="text-white/60 text-[10px] font-mono hidden md:inline truncate">({currentBg.tag})</span>
            </div>

            {/* Destination Switcher Buttons */}
            <div className="flex items-center gap-1 bg-[#151515] border border-white/20 p-0.5 rounded-full text-[10.5px] shrink-0">
              {HERO_BACKGROUNDS.map((bg, idx) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setActiveBgIndex(idx)}
                  className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeBgIndex === idx
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {bg.city.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* ================= 2. PURE ARCHITECTURAL HOUSE PHOTO (CLEAN & BORDERLESS) ================= */}
          <div className="w-full max-w-2xl mx-auto relative rounded-xl overflow-hidden shadow-2xl aspect-[16/10] sm:aspect-[16/9] bg-black">
            <img
              src={currentBg.url}
              alt={currentBg.title}
              key={currentBg.id}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
            />
          </div>

          {/* ================= 3. CLEAN SEARCH PILL DIRECTLY BELOW PHOTO ================= */}
          <div className="w-full max-w-2xl mx-auto space-y-3.5 text-center pt-1">
            
            {/* 1ST: THE FLOATING LUXURY SEARCH PILL (CLEAN & UNCLUTTERED) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchQuery);
              }}
              className="flex items-center gap-2 p-1.5 rounded-full transition-all shadow-xl"
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

              {/* Action Button */}
              <div className="flex items-center pr-1 shrink-0">
                <button
                  type="submit"
                  className="font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:brightness-105"
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
            <div className="space-y-1 pt-1">
              <h3 
                className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Search Destinations or let us Vet Any Listing for you.
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-medium">
                Enter any destination market, or paste a link from Realtor, Zillow, or Homes.com
              </p>
            </div>

            {/* THEN: CATEGORY INTENT TABS */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
              {[
                { id: 'buy', label: 'All Destination Homes' },
                { id: 'low_tax', label: '0% State Tax Havens' },
                { id: 'new_construction', label: 'New Construction' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow ${
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
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/75 pt-1">
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
                className="underline text-[#D4AF37] hover:text-[#fce38a] font-semibold cursor-pointer ml-1"
              >
                (Subscription Required)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}