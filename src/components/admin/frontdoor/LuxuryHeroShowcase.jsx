import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Sparkles, MapPin, Building, ShieldCheck, 
  ExternalLink, Compass, SlidersHorizontal, CheckCircle2, TrendingUp,
  Percent, Sun, Mountain, Waves, Users, Briefcase
} from 'lucide-react';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';

const GOLD = '#D4AF37';

// Curated high-valued architectural luxury estates captured at sunset and twilight
// Warm ambient glow, illuminated windows, infinity pools, and soft dusk skies provide optimal contrast and luxury presence
const HERO_BACKGROUNDS = [
  {
    id: 'scottsdale',
    title: 'Desert Sunset Architectural Estate • Scottsdale, AZ',
    tag: '$8.9M • 0% Income Tax Destination',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'austin',
    title: 'Twilight Hill Country Glass Villa • Austin, TX',
    tag: '$7.5M • Corporate Tech Relo Hub',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'naples',
    title: 'Waterfront Sunset Palm Estate • Naples, FL',
    tag: '$12.8M • Coastal Relo Haven',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'boulder',
    title: 'Mountain Contemporary Glass Manor • Boulder, CO',
    tag: '$9.2M • Alpine Lifestyle Relo',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95',
  },
];

// High-valued architectural estate photos at sunset/twilight for top relocation destinations (unique luxury photo per market)
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

        {/* Soft Sunset Vignette: warm twilight ambient glow that makes white and gold copy easy to read without harsh glare */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 25%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        {/* Subtle Top Photo Switcher Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 z-10">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md backdrop-blur-md"
            style={{ background: 'rgba(10,10,10,0.75)', border: `1.5px solid ${GOLD}`, color: GOLD }}
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>55+ YEARS • NATIONWIDE RELOCATION CONCIERGE</span>
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

        {/* Center Content: Fiduciary Relocation Story & The 3 Clear Public Doors */}
        <div className="max-w-5xl mx-auto w-full text-center space-y-4 my-auto py-5 z-10">
          <div>
            <h1
              className="font-bold leading-tight text-white tracking-tight"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2rem, 3.4vw, 3.4rem)',
                textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.85)',
              }}
            >
              We Don't Sell Real Estate.
            </h1>
            <p
              className="font-semibold mt-1 tracking-wide leading-snug"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.2rem, 1.9vw, 1.8rem)',
                color: '#fce38a',
                textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 4px 28px rgba(0,0,0,0.85)',
              }}
            >
              We Vet Top Agents With You &amp; Manage The Entire Move For You.
            </p>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl mx-auto font-sans font-medium mt-1 drop-shadow">
              Independent, fiduciary advocacy across all 50 states for over 55 years — zero fees to buyers &amp; employers.
            </p>
          </div>

          {/* THREE CLEAR PUBLIC DOORS (No login barrier) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 max-w-4xl mx-auto text-left">
            {/* Door 1: Relocating Families */}
            <button
              type="button"
              onClick={() => navigate('/relocation-intake')}
              className="group p-3.5 rounded-xl border border-white/20 bg-black/75 backdrop-blur-md hover:border-[#D4AF37] transition-all hover:scale-[1.02] shadow-xl text-left cursor-pointer flex flex-col justify-between min-h-[115px]"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    For Families &amp; Buyers
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/40">
                    Free Service
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                  Relocating Family Concierge
                </h4>
                <p className="text-[11px] text-white/70 leading-snug mt-1">
                  Independent agent vetting, school/tax analysis &amp; personal move roadmap.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] group-hover:underline">
                <span>Start Relocation Plan</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Door 2: Corporate HR & Employers */}
            <button
              type="button"
              onClick={() => navigate('/corporate-relo')}
              className="group p-3.5 rounded-xl border border-white/20 bg-black/75 backdrop-blur-md hover:border-[#D4AF37] transition-all hover:scale-[1.02] shadow-xl text-left cursor-pointer flex flex-col justify-between min-h-[115px]"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    For HR &amp; Employers
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40">
                    Zero Employer Fee
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                  Corporate Relo Packages
                </h4>
                <p className="text-[11px] text-white/70 leading-snug mt-1">
                  Turnkey executive employee relocation, milestone tracking &amp; cost control.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] group-hover:underline">
                <span>Explore HR Solutions</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Door 3: Agents & Brokers */}
            <button
              type="button"
              onClick={() => navigate('/partner-benefits')}
              className="group p-3.5 rounded-xl border border-white/20 bg-black/75 backdrop-blur-md hover:border-[#D4AF37] transition-all hover:scale-[1.02] shadow-xl text-left cursor-pointer flex flex-col justify-between min-h-[115px]"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    For Agents &amp; Brokers
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#3b82f6]/20 text-[#60a5fa] font-bold border border-[#3b82f6]/40">
                    25% Referral Fee
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                  Agent Bureau &amp; Referrals
                </h4>
                <p className="text-[11px] text-white/70 leading-snug mt-1">
                  Receiving agent bureau, inactive agent 25% referrals &amp; escrow audits.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] group-hover:underline">
                <span>Agent Opportunities</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* SECONDARY SUPERPOWER: DESTINATION HOME SEARCH & PROPERTY VETTING */}
          <div className="pt-2 max-w-2xl mx-auto border-t border-white/15">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs">
              <span className="text-[11px] text-white/80 font-medium">
                Already browsing on Realtor, Zillow, or Homes.com? Search destination listings below or paste any address:
              </span>
            </div>

            {/* Quick Intent Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
              {[
                { id: 'buy', label: 'All Destination Homes' },
                { id: 'low_tax', label: '0% State Tax Havens' },
                { id: 'new_construction', label: 'New Construction' },
                { id: 'grok_assistants', label: '24/7 AI Move Specialists' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'grok_assistants') {
                      navigate('/ai-assistants');
                      return;
                    }
                    setSearchTab(tab.id);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow ${
                    searchTab === tab.id
                      ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                      : 'bg-black/60 text-white/80 hover:text-white border border-white/20 backdrop-blur-sm'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FLOATING LUXURY SEARCH PILL */}
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
                      ? "Ask our AI Move Specialists about cities, taxes, or relocation steps..."
                      : "Enter City, State, Neighborhood, or ZIP (e.g. Scottsdale, Austin, Naples)..."
                  }
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:text-stone-500"
                  style={{ color: '#0a0a0a' }}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto font-bold text-xs sm:text-sm px-7 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105"
                style={{
                  background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                  color: '#0a0a0a',
                }}
              >
                <span>{searchTab === 'grok_assistants' ? 'Ask Move Specialists' : 'Explore Homes'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Micro Engine Picker & Charlie Tap */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-2.5 px-2 text-xs">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                <span className="text-[10px] text-white/70 font-semibold uppercase">Search Via:</span>
                <button
                  type="button"
                  onClick={() => setSearchEngine('realtor')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    searchEngine === 'realtor' ? 'bg-[#D4AF37] text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Realtor.com
                </button>
                <button
                  type="button"
                  onClick={() => setSearchEngine('homes')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    searchEngine === 'homes' ? 'bg-[#D4AF37] text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Homes.com
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
            <span className="font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">National Relocation Coverage • All 50 States</span>
          </div>
          <span className="hidden sm:inline text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] font-medium">
            THE DYSON &amp; DYSON COMPANIES • CALIFORNIA DRE #02303118
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