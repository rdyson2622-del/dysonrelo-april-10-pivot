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
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [latestBroadcast, setLatestBroadcast] = useState(null);

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

  const handleAskCharlie = (listing) => {
    alert(`Charlie Voice Concierge on ${listing.address}, ${listing.city}: "This property has low property tax assessment and sits 12 minutes from top-rated schools."`);
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
                    DYSONHOMES.COM
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

              {/* Discrete Portals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer"
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(212,175,55,0.3)',
                  }}
                >
                  <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Workspaces (6)</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {portalMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 border rounded-xl shadow-2xl p-2 z-50 text-xs"
                    style={{ background: '#0a0a0a', borderColor: GOLD }}
                  >
                    <p className="text-[10px] uppercase font-black tracking-wider px-2 py-1 text-[#D4AF37]">
                      Concierge &amp; Enterprise Portals
                    </p>
                    <Link to="/relocation-intake" className="block px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white/90">
                      📦 Client Relocation Intake &amp; Roadmap
                    </Link>
                    <Link to="/broker-portal" className="block px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white/90">
                      🏛️ Broker &amp; Office Workspace
                    </Link>
                    <Link to="/find-agent" className="block px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white/90">
                      🤝 20+ Vetted Partner Agent Bureau
                    </Link>
                    <Link to="/corporate-relo" className="block px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white/90">
                      💼 Corporate &amp; HR Move Management
                    </Link>
                    <Link to="/refer" className="block px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white/90">
                      🎁 Referral Partner Submission
                    </Link>
                    <Link to="/transparency" className="block px-2.5 py-2 rounded-lg hover:bg-[#1f1f1f] text-white/90">
                      🛡️ Real Estate Transparency Ledger
                    </Link>
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
                DYSONHOMES.COM • NATIONWIDE PROPERTY SEARCH &amp; CONCIERGE
              </div>

              <h1
                className="font-bold leading-tight"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(1.75rem, 3.8vw, 3.1rem)',
                  color: '#111111',
                }}
              >
                Search Verified Homes Nationwide. <br />
                <span className="italic" style={{ color: '#b8920a' }}>
                  Navigate Every Mile with Charlie.
                </span>
              </h1>

              <p
                className="italic text-base sm:text-lg max-w-2xl mx-auto font-medium"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2a2a2a',
                }}
              >
                "We provide a real-time, lifetime workspace designed to maximize your real estate opportunities. No sales pitches, just real-time solutions."
                <span className="block not-italic text-xs font-sans font-bold text-[#665a4c] mt-1 uppercase tracking-wider">
                  — Bob Dyson, 55+ Years California Real Estate
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37]">
                      Direct Aggregator Search • Nationwide Listings
                    </span>
                    <span className="text-[10px] text-white/50 font-sans hidden sm:inline">
                      DysonHomes Public Feed
                    </span>
                  </div>

                  {/* Search Input Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#181818] p-1.5 rounded-xl border border-[#333]">
                    <div className="flex items-center gap-2.5 w-full pl-3 py-1">
                      <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search City, State, ZIP, or Neighborhood (e.g. Scottsdale, Austin, Denver, Naples)..."
                        className="w-full bg-transparent text-sm text-white placeholder-white/50 focus:outline-none"
                      />
                    </div>
                    <button
                      className="w-full sm:w-auto font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg whitespace-nowrap transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                        color: '#0a0a0a',
                      }}
                    >
                      <span>Search Feed</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

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
                    <span>Featured Listings on DysonHomes.com</span>
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
                DYSONHOMES.COM • THE DYSON &amp; DYSON COMPANIES, INC.
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
    </div>
  );
}