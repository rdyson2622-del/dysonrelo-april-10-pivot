import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Building, ArrowRight, ChevronDown, 
  CheckCircle2, SlidersHorizontal, Globe 
} from 'lucide-react';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';
import LabListingCard from '@/components/admin/frontdoor/LabListingCard';
import LabInspectorHeader from '@/components/admin/frontdoor/LabInspectorHeader';
import DualFeatureEngine from '@/components/admin/frontdoor/DualFeatureEngine';
import GoDaddyDomainModal from '@/components/admin/frontdoor/GoDaddyDomainModal';
import PartnerPortalGateways from '@/components/admin/frontdoor/PartnerPortalGateways';
import RoleSubscriptionDeck from '@/components/admin/frontdoor/RoleSubscriptionDeck';
import RealtorReturnCompanion from '@/components/admin/frontdoor/RealtorReturnCompanion';
import StudioAmbiencePlayer from '@/components/charlie/StudioAmbiencePlayer';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const INTEL_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/67bc7aa5a_generated_image.png';

const MOCK_LISTINGS = [
  {
    id: 'prop-1',
    address: '2840 Mariposa Crest Lane',
    city: 'Scottsdale',
    state: 'AZ',
    price: '$1,875,000',
    beds: 4,
    baths: 4.5,
    sqft: '4,120',
    tag: 'New on MLS • 3h ago',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    status: 'Active Syndication',
  },
  {
    id: 'prop-2',
    address: '744 Mountain Laurel Ridge',
    city: 'Boulder',
    state: 'CO',
    price: '$2,450,000',
    beds: 5,
    baths: 5,
    sqft: '4,890',
    tag: 'Price Improvement',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    status: 'Active Syndication',
  },
  {
    id: 'prop-3',
    address: '112 Pelican Bay Vista',
    city: 'Naples',
    state: 'FL',
    price: '$3,195,000',
    beds: 4,
    baths: 4,
    sqft: '3,760',
    tag: 'Waterfront Tour',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    status: 'Active Syndication',
  },
  {
    id: 'prop-4',
    address: '420 Barton Creek Boulevard',
    city: 'Austin',
    state: 'TX',
    price: '$1,625,000',
    beds: 4,
    baths: 3.5,
    sqft: '3,450',
    tag: 'Relo Favorite',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    status: 'Active Syndication',
  },
];

export default function AdminFrontDoorLab() {
  const [deviceView, setDeviceView] = useState('desktop');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchEngine, setSearchEngine] = useState('realtor'); // 'realtor' | 'homes'
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [selectedRoleForSubscription, setSelectedRoleForSubscription] = useState('hr');

  useEffect(() => {
    base44.entities.DnnBroadcast.list('-broadcast_date', 1)
      .then((res) => {
        if (res && res.length > 0) {
          setLatestBroadcast(res[0]);
        }
      })
      .catch(() => {});
  }, []);

  const tags = ['All', 'Sunbelt States', 'Coastal Relo', 'Low Tax Markets', 'Mountain West', 'Golf Communities'];

  const [activeExternalSearch, setActiveExternalSearch] = useState(null);

  const handleSearch = (query) => {
    const q = (query || searchQuery).trim();
    if (!q) return;
    const cleanLocation = q.replace(/,\s*/g, '_').replace(/\s+/g, '-');
    let url = `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(cleanLocation)}`;
    let engineName = 'Realtor.com';

    if (searchEngine === 'homes') {
      const homesLoc = cleanLocation.toLowerCase().replace(/_/g, '-');
      url = `https://www.homes.com/${encodeURIComponent(homesLoc)}/homes-for-sale/`;
      engineName = 'Homes.com';
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    setActiveExternalSearch({ location: q, url, engineName });
  };

  const handleAskCharlie = (listing) => {
    const cleanLocation = `${listing.city}_${listing.state}`.replace(/\s+/g, '-');
    let url = `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(cleanLocation)}`;
    let engineName = 'Realtor.com';

    if (searchEngine === 'homes') {
      const homesLoc = cleanLocation.toLowerCase().replace(/_/g, '-');
      url = `https://www.homes.com/${encodeURIComponent(homesLoc)}/homes-for-sale/`;
      engineName = 'Homes.com';
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    setActiveExternalSearch({ location: `${listing.city}, ${listing.state}`, url, listing, engineName });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Top Admin Lab Inspector Bar */}
      <LabInspectorHeader
        deviceView={deviceView}
        setDeviceView={setDeviceView}
        showAnnotations={showAnnotations}
        setShowAnnotations={setShowAnnotations}
      />

      {/* Main Canvas Container */}
      <main className="p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div
          className={`transition-all duration-300 w-full ${
            deviceView === 'mobile'
              ? 'max-w-[420px] rounded-3xl border-4 border-[#333] shadow-2xl overflow-hidden'
              : 'max-w-6xl rounded-2xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden'
          }`}
          style={{ background: TAN_BG }}
        >
          {/* TOP BLACK BAR: BRAND HEADER (DysonHomes.com) */}
          <nav
            className="px-5 py-3.5 flex items-center justify-between relative shadow-md"
            style={{ background: '#0a0a0a', borderBottom: `2px solid ${GOLD}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow"
                style={{
                  background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                  fontFamily: 'Cormorant Garamond, serif',
                }}
              >
                D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-bold text-lg sm:text-xl tracking-wider text-white"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    DysonRelo.com
                  </span>
                  <span
                    className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full hidden sm:inline-flex"
                    style={{ background: GOLD, color: '#0a0a0a' }}
                  >
                    MLS PORTAL
                  </span>
                </div>
                <span className="text-[10px] text-white/70 block tracking-widest uppercase font-sans -mt-0.5">
                  A Dyson &amp; Dyson Company • Nationwide Relocation Concierge
                </span>
              </div>
            </div>

            {/* Quick Actions & GoDaddy Pointer Info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Studio Ambience / Concierge Lounge Audio Player */}
              <StudioAmbiencePlayer />

              {/* GoDaddy Domain Status Badge */}
              <button
                onClick={() => setDomainModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: 'rgba(212,175,55,0.15)',
                  borderColor: GOLD,
                  color: GOLD,
                }}
                title="View GoDaddy DNS Pointer Instructions"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Domain:</span>
                <span className="font-bold underline">dysonhomes.com</span>
              </button>

              {/* Corporate & Partner Portals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:brightness-110 cursor-pointer shadow-sm"
                  style={{
                    background: '#141414',
                    border: '1.5px solid rgba(212,175,55,0.4)',
                    color: GOLD,
                  }}
                >
                  <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Corporate &amp; Partner Portals</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {portalMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 border rounded-xl shadow-2xl p-2 z-50 text-xs"
                    style={{ background: '#0a0a0a', borderColor: GOLD, boxShadow: '0 12px 35px rgba(0,0,0,0.6)' }}
                  >
                    <div className="px-2 py-1.5 mb-1 border-b border-white/10 flex items-center justify-between">
                      <p className="text-[10px] uppercase font-black tracking-wider text-[#D4AF37]">
                        Specialized Workspaces
                      </p>
                      <span className="text-[9px] text-white/40">Direct Roles</span>
                    </div>

                    <Link to="/corporate-relo" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white group">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#D4AF37]">Corporate Relocation &amp; HR</div>
                        <div className="text-[10px] text-white/50">Zero-fee employee relocation programs</div>
                      </div>
                    </Link>

                    <Link to="/find-agent" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white group">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#D4AF37]">Relocation Agent Network</div>
                        <div className="text-[10px] text-white/50">20+ Vetted partner agent receiving bureau</div>
                      </div>
                    </Link>

                    <Link to="/broker-portal" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white group">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#D4AF37]">Brokerage &amp; Office Management</div>
                        <div className="text-[10px] text-white/50">Institutional pipeline &amp; transaction tools</div>
                      </div>
                    </Link>

                    <Link to="/partner-benefits" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white group">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#D4AF37]">Inactive Licensed Agents</div>
                        <div className="text-[10px] text-white/50">Monetize license with 25% referral protection</div>
                      </div>
                    </Link>

                    <Link to="/search" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white group">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#D4AF37]">Vetted Vendor Network</div>
                        <div className="text-[10px] text-white/50">Movers, inspectors, lenders &amp; stagers</div>
                      </div>
                    </Link>

                    <div className="mt-1 pt-1.5 border-t border-white/10 px-2 py-1 flex items-center justify-between text-[10px]">
                      <Link to="/portal" className="text-[#D4AF37] hover:underline font-bold">
                        Master Role Selector →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* DESIGN ANNOTATION: TAN BACKDROP WITH BLACK BOXES */}
          {showAnnotations && (
            <div
              className="px-5 py-2.5 text-xs flex items-center justify-between gap-4 border-b"
              style={{
                background: '#0d0d0d',
                borderColor: 'rgba(212,175,55,0.3)',
                color: '#ede0cc',
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  <strong>Signature Theme Applied:</strong> Tan backdrop (<code className="text-[#D4AF37]">#ede0cc</code>) with classic black command boxes (<code className="text-[#D4AF37]">#0a0a0a</code>), Cormorant Garamond serif headings, and gold accents.
                </span>
              </div>
              <button
                onClick={() => setDomainModalOpen(true)}
                className="text-[11px] underline text-[#D4AF37] font-semibold shrink-0 hover:text-white cursor-pointer"
              >
                GoDaddy Setup Details
              </button>
            </div>
          )}

          {/* HERO SECTION: TAN BACKDROP WITH BOLD BLACK SEARCH & CONCIERGE BOX */}
          <section className="px-5 sm:px-8 py-8 sm:py-10" style={{ background: TAN_BG }}>
            <div className="max-w-4xl mx-auto text-center space-y-4">
              
              {/* Badge & Signature Quote */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm"
                style={{ background: '#0a0a0a', border: `1.5px solid ${GOLD}`, color: GOLD }}
              >
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                DysonRelo.com • NATIONWIDE PROPERTY SEARCH &amp; CONCIERGE
              </div>

              <div>
                <h1
                  className="font-bold leading-tight"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1.75rem, 3.6vw, 2.9rem)',
                    color: '#111111',
                  }}
                >
                  Search Verified Homes Nationwide.
                </h1>
                <p
                  className="italic font-semibold mt-1"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1.15rem, 2.1vw, 1.7rem)',
                    color: '#b8920a',
                  }}
                >
                  Navigate Every Mile with Charlie.
                </p>
              </div>

              <p
                className="italic text-base sm:text-lg max-w-2xl mx-auto font-medium"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2a2a2a',
                }}
              >
                "We provide a real-time, lifetime workspace designed to maximize your real estate opportunities. No sales pitches, just real-time solutions."
                <span className="block not-italic text-[11px] sm:text-xs font-sans font-bold text-[#665a4c] mt-1 uppercase tracking-wider">
                  55+ YEARS OF NATIONAL REAL ESTATE RELOCATION MANAGEMENT
                </span>
              </p>

              {/* THE BLACK COMMAND SEARCH BOX */}
              <div className="pt-2 max-w-3xl mx-auto">
                <div
                  className="rounded-2xl p-4 sm:p-5 text-left shadow-2xl transition-all"
                  style={{
                    background: '#0a0a0a',
                    border: `2px solid ${GOLD}`,
                    boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37]">
                        National Search Feed:
                      </span>
                      <div className="inline-flex items-center bg-[#181818] border border-white/10 rounded-full p-0.5">
                        <button
                          type="button"
                          onClick={() => setSearchEngine('realtor')}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            searchEngine === 'realtor'
                              ? 'bg-[#D4AF37] text-black shadow'
                              : 'text-white/70 hover:text-white'
                          }`}
                        >
                          Realtor.com (Official MLS)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchEngine('homes')}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            searchEngine === 'homes'
                              ? 'bg-[#D4AF37] text-black shadow'
                              : 'text-white/70 hover:text-white'
                          }`}
                          title="Homes.com shows listing agents directly without selling buyer leads"
                        >
                          Homes.com (Zero-Poaching Feed)
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/50 font-sans hidden sm:inline">
                      Companion Dock Stays Active On Tab Launch
                    </span>
                  </div>

                  {/* Search Input Pill (Warm Off-White / Tan Pop against Black Box) */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch(searchQuery);
                    }}
                    className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-full transition-all shadow-lg"
                    style={{
                      background: '#faf6ee',
                      border: `2px solid ${GOLD}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="flex items-center gap-3 w-full pl-4 py-1">
                      <Search className="w-5 h-5 shrink-0" style={{ color: '#0a0a0a' }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search City, State, ZIP, or Neighborhood (e.g. Scottsdale, Austin, Denver, Naples)..."
                        className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-stone-500"
                        style={{ color: '#0a0a0a' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto font-bold text-xs sm:text-sm px-7 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105"
                      style={{
                        background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                        color: '#0a0a0a',
                      }}
                    >
                      <span>Search Live MLS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Trending Market Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 text-xs">
                    <span className="text-white/60 text-[11px] font-medium mr-1">Trending Markets:</span>
                    {tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTag(t)}
                        className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                          selectedTag === t
                            ? 'bg-[#D4AF37] text-black font-bold'
                            : 'bg-[#181818] border border-[#2a2a2a] text-white/70 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Charlie Voice Concierge Integration inside the box */}
                  <div className="border-t border-[#222] mt-4 pt-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white">Prefer to talk instead of type?</p>
                      <p className="text-[11px] text-white/60">Charlie can navigate to any city, school district, or intake flow.</p>
                    </div>
                    <HeroGeminiConcierge />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TWO-COLUMN DUAL ENGINE: 6AM NEWS BOX & CONCIERGE ADVANTAGE BOX */}
          <section className="px-5 sm:px-8 py-6" style={{ background: TAN_BG }}>
            <DualFeatureEngine latestBroadcast={latestBroadcast} />
          </section>

          {/* SIMULATED NATIONAL MLS FEED RESULTS (BLACK CARDS ON TAN) */}
          <section className="px-5 sm:px-8 py-8 border-t" style={{ background: TAN_BG, borderColor: 'rgba(10,10,10,0.15)' }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold text-[#0a0a0a] flex items-center gap-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    <span>Featured Listings on DysonRelo.com</span>
                    <span
                      className="text-[9px] font-sans font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: '#0a0a0a', color: GOLD, border: `1px solid ${GOLD}` }}
                    >
                      Aggregator Preview
                    </span>
                  </h3>
                  <p className="text-xs text-[#44382c]">
                    Live national properties matching current relocation subscribers
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white font-semibold shadow-sm"
                    style={{ background: '#0a0a0a', border: `1px solid ${GOLD}` }}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" /> Filters
                  </button>
                  <select
                    className="rounded-lg px-3 py-1.5 text-white text-xs font-medium focus:outline-none shadow-sm"
                    style={{ background: '#0a0a0a', border: `1px solid ${GOLD}` }}
                  >
                    <option>Sort: Newest Listings</option>
                    <option>Sort: Price: High to Low</option>
                    <option>Sort: Price: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Grid of Black Listing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_LISTINGS.map((listing) => (
                  <LabListingCard
                    key={listing.id}
                    listing={listing}
                    onAskCharlie={handleAskCharlie}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* INSTITUTIONAL & PROFESSIONAL GATEWAYS (CORPORATE HR, AGENTS, BROKERS, VENDORS) */}
          <section className="px-5 sm:px-8 py-6 border-t" style={{ background: TAN_BG, borderColor: 'rgba(10,10,10,0.15)' }}>
            <PartnerPortalGateways onSelectRole={setSelectedRoleForSubscription} />
            <RoleSubscriptionDeck
              activeRole={selectedRoleForSubscription}
              onSelectRole={setSelectedRoleForSubscription}
            />
          </section>

          {/* THREE-LOGO FOOTER ROW & LEGAL */}
          <footer
            className="px-5 py-8 text-xs flex flex-col items-center justify-center gap-4"
            style={{ background: '#0a0a0a', borderTop: `2px solid ${GOLD}` }}
          >
            {/* The 3 logos in unified pill */}
            <div
              className="flex items-center justify-center gap-12 sm:gap-24 px-8 py-2 rounded-full"
              style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto object-contain" />
              <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-8 w-auto object-contain" />
              <img src={INTEL_LOGO} alt="Intelligence" className="h-10 w-auto object-contain" />
            </div>

            <div className="text-center text-white/60 space-y-1">
              <p className="font-bold text-white text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                DysonRelo.com • THE DYSON &amp; DYSON COMPANIES, INC.
              </p>
              <p className="text-[11px] text-white/50">
                Licensed California Corporate Brokerage • Real Estate Relocation Concierge &amp; National Referral Network
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-white/50">
              <Link to="/transparency" className="hover:text-white">Transparency</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <span>•</span>
              <button
                onClick={() => setDomainModalOpen(true)}
                className="text-[#D4AF37] hover:underline font-bold cursor-pointer"
              >
                GoDaddy Pointer Setup
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* GODADDY DOMAIN POINTER INSTRUCTIONS MODAL */}
      <GoDaddyDomainModal
        isOpen={domainModalOpen}
        onClose={() => setDomainModalOpen(false)}
      />

      {/* REALTOR.COM RETURN COMPANION DOCK */}
      <RealtorReturnCompanion
        activeSearch={activeExternalSearch}
        onClose={() => setActiveExternalSearch(null)}
      />
    </div>
  );
}