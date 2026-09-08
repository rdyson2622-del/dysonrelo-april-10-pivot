import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Sparkles, MapPin, Building, ShieldCheck, 
  ExternalLink, Compass, SlidersHorizontal, CheckCircle2, TrendingUp,
  Percent, Sun, Mountain, Waves
} from 'lucide-react';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';

const GOLD = '#D4AF37';

// Curated crystal-clear, high-resolution architectural luxury homes (bright natural daylight, no dark filters)
const HERO_BACKGROUNDS = [
  {
    id: 'scottsdale',
    title: 'Modern Desert Villa • Scottsdale, AZ',
    tag: '0% Income Tax Destination',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'austin',
    title: 'Architectural Farmhouse • Austin, TX',
    tag: 'Corporate Tech Relo Hub',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'naples',
    title: 'Waterfront Estate • Naples, FL',
    tag: 'Coastal Relo Favorite',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'boulder',
    title: 'Mountain Contemporary • Boulder, CO',
    tag: 'Lifestyle Relocation',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  },
];

// Clean, bright daylight architectural home photos for top relocation destinations
const QUICK_MARKETS = [
  {
    city: 'Scottsdale, AZ',
    state: 'AZ',
    avgPrice: '$1.15M',
    tag: 'Low Tax • Sunbelt',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Austin, TX',
    state: 'TX',
    avgPrice: '$890K',
    tag: '0% State Tax • Tech',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Naples, FL',
    state: 'FL',
    avgPrice: '$1.45M',
    tag: 'Waterfront • No Tax',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Boulder, CO',
    state: 'CO',
    avgPrice: '$1.28M',
    tag: 'Mountain Outdoors',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Nashville, TN',
    state: 'TN',
    avgPrice: '$740K',
    tag: '0% State Tax • Culture',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=90',
  },
  {
    city: 'Dallas, TX',
    state: 'TX',
    avgPrice: '$825K',
    tag: 'Corporate Executive',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=90',
  },
];

export default function LuxuryHeroShowcase({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchEngine,
  setSearchEngine,
  onQuickMarketClick,
}) {
  const navigate = useNavigate();
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [searchTab, setSearchTab] = useState('buy'); // buy, low_tax, new_construction, grok_assistants
  const [vetAddressInput, setVetAddressInput] = useState('');
  const [vettingStatus, setVettingStatus] = useState(null);

  const currentBg = HERO_BACKGROUNDS[activeBgIndex];

  const handleVetAddress = (e) => {
    e.preventDefault();
    if (!vetAddressInput.trim()) return;
    setVettingStatus('vetting');
    setTimeout(() => {
      setVettingStatus('ready');
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* FULL-BLEED CINEMATIC HERO (HOMES.COM & REALTOR.COM STYLE) */}
      <div 
        className="relative min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex flex-col justify-between p-6 sm:p-10 text-white rounded-t-2xl overflow-hidden shadow-2xl bg-[#0a0a0a]"
      >
        {/* Crystal-Clear, Crisp High-Resolution Home Background (No grey/dark filter) */}
        <img
          src={currentBg.url}
          alt={currentBg.title}
          key={currentBg.id}
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-700 ease-in-out"
        />

        {/* Minimal Soft Vignette: middle 75% is completely clear so architectural details, pools & skies stay vibrant */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.65) 100%)',
          }}
        />
        {/* Subtle Top Photo Switcher Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 z-10">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md backdrop-blur-md"
            style={{ background: 'rgba(10,10,10,0.75)', border: `1.5px solid ${GOLD}`, color: GOLD }}
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>NATIONWIDE RELOCATION MLS FEED</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 p-1 rounded-full text-[11px]">
            {HERO_BACKGROUNDS.map((bg, idx) => (
              <button
                key={bg.id}
                onClick={() => setActiveBgIndex(idx)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  activeBgIndex === idx
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {bg.title.split('•')[1]?.trim() || bg.title}
              </button>
            ))}
          </div>
        </div>

        {/* Center Content: Headline & Visual Floating Search Bar */}
        <div className="max-w-5xl mx-auto w-full text-center space-y-4 my-auto py-6 z-10">
          <div>
            <h1
              className="font-bold leading-tight text-white tracking-tight sm:tracking-normal sm:whitespace-nowrap"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.6rem, 2.85vw, 2.85rem)',
                textShadow: '0 2px 18px rgba(0,0,0,0.9), 0 4px 35px rgba(0,0,0,0.8)',
              }}
            >
              The Newest Way to Find Your Next Home Nationwide.
            </h1>
            <p
              className="font-semibold mt-2 tracking-wide leading-snug"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)',
                color: '#fce38a',
                textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 4px 28px rgba(0,0,0,0.85)',
              }}
            >
              <span className="block">We Don't Sell Real Estate! We Vet Top Agents With You</span>
              <span className="block">and Manage The Entire Move For You.</span>
            </p>
          </div>

          {/* Quick Intent Filter Tabs on the Hero (Like Realtor.com / Homes.com) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'buy', label: 'Search All Homes' },
              { id: 'low_tax', label: '0% State Tax Havens' },
              { id: 'new_construction', label: 'New Construction' },
              { id: 'grok_assistants', label: '21 Grok Bot Assistants 24/7' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchTab(tab.id);
                  if (tab.id === 'grok_assistants' && !searchQuery.trim()) {
                    // Optional quick suggestion or navigation
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow ${
                  searchTab === tab.id
                    ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                    : 'bg-black/60 text-white/85 hover:text-white border border-white/20 backdrop-blur-sm'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FLOATING LUXURY SEARCH PILL (POPS WITH OFF-WHITE WARM BACKGROUND & GOLD BORDER) */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTab === 'grok_assistants' && (!searchQuery.trim() || searchQuery.toLowerCase().includes('bot') || searchQuery.toLowerCase().includes('grok'))) {
                  navigate('/ai-assistants');
                  return;
                }
                onSearch(searchQuery);
              }}
              className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-full transition-all shadow-2xl backdrop-blur-md"
              style={{
                background: '#faf6ee',
                border: `2px solid ${GOLD}`,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-center gap-3 w-full pl-5 py-1">
                <Search className="w-5 h-5 shrink-0" style={{ color: '#0a0a0a' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchTab === 'low_tax'
                      ? "Search 0% state tax havens (e.g. Dallas, Scottsdale, Naples, Nashville)..."
                      : searchTab === 'new_construction'
                      ? "Search new construction & modern developments (e.g. Austin, Phoenix)..."
                      : searchTab === 'grok_assistants'
                      ? "Ask our 21 Grok Bot specialists about cities, taxes, or relocation steps..."
                      : "Enter City, State, Neighborhood, or ZIP (e.g. Scottsdale, Austin, Naples)..."
                  }
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:text-stone-500"
                  style={{ color: '#0a0a0a' }}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto font-bold text-xs sm:text-sm px-8 py-3 rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105"
                style={{
                  background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                  color: '#0a0a0a',
                }}
              >
                <span>{searchTab === 'grok_assistants' ? 'Ask Assistants' : 'Search Live MLS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Micro Engine Picker & Charlie Tap */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-2 text-xs">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                <span className="text-[10px] text-white/70 font-semibold uppercase">Feed Engine:</span>
                <button
                  type="button"
                  onClick={() => setSearchEngine('realtor')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    searchEngine === 'realtor' ? 'bg-[#D4AF37] text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Realtor.com MLS
                </button>
                <button
                  type="button"
                  onClick={() => setSearchEngine('homes')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    searchEngine === 'homes' ? 'bg-[#D4AF37] text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Homes.com Direct
                </button>
              </div>

              {/* Charlie Voice Concierge Pill */}
              <div className="flex items-center">
                <HeroGeminiConcierge />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hero Tagline Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-3 text-[11px] text-white/90 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-sm" />
            <span className="font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">Direct National MLS Syndication • 50 States</span>
          </div>
          <span className="hidden sm:inline text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] font-medium">
            55+ Years of National Relocation Management • Independent Fiduciary Advice
          </span>
        </div>
      </div>

      {/* QUICK DESTINATION PHOTO STRIP (JUST LIKE HOMES.COM CATEGORIES & ZILLOW RECENT) */}
      <div className="px-5 sm:px-8 py-5 border-b border-[#0a0a0a]/10" style={{ background: '#f5eee2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#0a0a0a]">
                Explore Top Relocation Destinations:
              </span>
            </div>
            <span className="text-[11px] text-[#665a4c] font-medium hidden sm:inline">
              Zero state tax &amp; executive hubs
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
                  className="group relative rounded-xl overflow-hidden p-2.5 text-left border border-[#D4AF37]/50 shadow-md transition-all hover:scale-[1.03] hover:shadow-xl cursor-pointer flex flex-col justify-end min-h-[105px] bg-[#0a0a0a]"
                >
                  {/* Clear crisp home photo without dark veil */}
                  <img
                    src={m.image}
                    alt={m.city}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle bottom shadow only under text, top 55% is completely unfiltered */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)',
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

      {/* THE HYBRID SECRET WEAPON: VET ANY PROPERTY FOUND ON REALTOR / ZILLOW */}
      <div 
        className="px-5 sm:px-8 py-5 border-b"
        style={{
          background: '#0a0a0a',
          borderColor: GOLD,
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
              style={{ background: '#1c1c1c', border: `1.5px solid ${GOLD}` }}
            >
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50">
                  The Dyson Concierge Advantage
                </span>
                <span className="text-xs text-white/60 hidden sm:inline">• Free for buyers</span>
              </div>
              <h3 
                className="text-base sm:text-lg font-bold text-white mt-0.5"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Found a home on Realtor.com, Zillow, or Homes.com?
              </h3>
              <p className="text-xs text-white/70">
                Paste the address or link below. We vet the top 1% local agent and oversee your escrow at zero cost to you.
              </p>
            </div>
          </div>

          {/* Rapid Property Vetting Input */}
          <form 
            onSubmit={handleVetAddress}
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <div className="relative flex-1 lg:w-80">
              <input
                type="text"
                value={vetAddressInput}
                onChange={(e) => setVetAddressInput(e.target.value)}
                placeholder="Paste listing address or URL..."
                className="w-full bg-[#181818] border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-full font-bold text-xs whitespace-nowrap cursor-pointer transition-all active:scale-95 shadow"
              style={{
                background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                color: '#0a0a0a',
              }}
            >
              {vettingStatus === 'vetting' ? 'Vetting...' : 'Vet Agent & Escrow'}
            </button>
          </form>
        </div>

        {vettingStatus === 'ready' && (
          <div className="max-w-6xl mx-auto mt-3 p-3 rounded-xl bg-[#141414] border border-[#D4AF37]/40 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span>
                Property received! Charlie and our relocation concierge are matching the verified top 1% agent in this area.
              </span>
            </div>
            <a
              href="/relocation-intake"
              className="text-[#D4AF37] font-bold underline hover:text-white"
            >
              Open Your Relocation Plan →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}