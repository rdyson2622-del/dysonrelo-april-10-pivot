import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Mic, Play, Sparkles, MapPin, Building, ArrowRight, 
  ChevronDown, Volume2, ShieldCheck, Newspaper, Compass,
  Eye, Laptop, Smartphone, CheckCircle2, SlidersHorizontal, Home as HomeIcon
} from 'lucide-react';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

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
  const [deviceView, setDeviceView] = useState('desktop'); // desktop | mobile
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    // Attempt to load the latest broadcast to make the lab authentic
    base44.entities.DnnBroadcast.list('-broadcast_date', 1)
      .then((res) => {
        if (res && res.length > 0) {
          setLatestBroadcast(res[0]);
        }
      })
      .catch(() => {});
  }, []);

  const tags = ['All', 'Sunbelt States', 'Coastal Relo', 'Low Tax Markets', 'Mountain West', 'Golf Communities'];

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Top Admin Lab Inspector Bar */}
      <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            FRONT DOOR LAB
          </span>
          <span className="text-xs text-white/70 hidden sm:inline">
            Interactive Prototype: National MLS + 6AM Daily News + Charlie Concierge
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#1c1c1c] p-0.5 rounded-lg border border-[#333]">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                deviceView === 'desktop' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                deviceView === 'mobile' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          {/* Annotations Toggle */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              showAnnotations ? 'bg-[#222] border-[#D4AF37] text-[#D4AF37]' : 'bg-[#181818] border-[#333] text-white/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showAnnotations ? 'Hide Design Notes' : 'Show Design Notes'}
          </button>

          <Link
            to="/portal"
            className="text-xs text-white/60 hover:text-white px-2 py-1 underline ml-2"
          >
            Back to Current Portal
          </Link>
        </div>
      </header>

      {/* Main Canvas Container */}
      <main className="p-4 sm:p-8 flex justify-center items-start">
        <div
          className={`transition-all duration-300 w-full ${
            deviceView === 'mobile'
              ? 'max-w-[420px] rounded-3xl border-4 border-[#333] shadow-2xl bg-[#0d0d0d] overflow-hidden'
              : 'max-w-6xl rounded-2xl border border-[#222] bg-[#0c0c0c] shadow-2xl overflow-hidden'
          }`}
        >
          {/* SIMULATED SITE HEADER */}
          <nav className="border-b border-[#222] bg-[#0a0a0a]/95 backdrop-blur px-5 py-3.5 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e8c84a] via-[#D4AF37] to-[#b8920a] flex items-center justify-center font-serif font-black text-black text-lg">
                  D
                </div>
                <div>
                  <span className="font-serif font-bold text-base tracking-wider text-white">DYSON RELO</span>
                  <span className="text-[10px] text-[#D4AF37] tracking-widest block font-sans font-bold -mt-1">
                    NATIONAL CONCIERGE & SEARCH
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Navbar */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Discrete Portals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181818] hover:bg-[#222] border border-[#333] text-xs font-semibold text-white/90 hover:text-white transition-all"
                >
                  <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Workspaces (6)</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {portalMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#141414] border border-[#333] rounded-xl shadow-2xl p-2 z-50 text-xs">
                    <p className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider px-2 py-1">
                      Deep Transaction Portals
                    </p>
                    <Link
                      to="/relocation-intake"
                      className="block px-2.5 py-2 rounded-lg hover:bg-[#222] text-white/90"
                    >
                      📦 Client Relocation Intake & Roadmap
                    </Link>
                    <Link
                      to="/broker-portal"
                      className="block px-2.5 py-2 rounded-lg hover:bg-[#222] text-white/90"
                    >
                      🏛️ Broker & Office Workspace
                    </Link>
                    <Link
                      to="/find-agent"
                      className="block px-2.5 py-2 rounded-lg hover:bg-[#222] text-white/90"
                    >
                      🤝 20+ Vetted Partner Agent Bureau
                    </Link>
                    <Link
                      to="/corporate-relo"
                      className="block px-2.5 py-2 rounded-lg hover:bg-[#222] text-white/90"
                    >
                      💼 Corporate & HR Move Management
                    </Link>
                    <Link
                      to="/refer"
                      className="block px-2.5 py-2 rounded-lg hover:bg-[#222] text-white/90"
                    >
                      🎁 Referral Partner Submission
                    </Link>
                    <Link
                      to="/transparency"
                      className="block px-2.5 py-2 rounded-lg hover:bg-[#222] text-white/90"
                    >
                      🛡️ Real Estate Transparency Ledger
                    </Link>
                  </div>
                )}
              </div>

              {/* Login / Profile */}
              <Link
                to="/login"
                className="text-xs text-white/80 hover:text-white hidden sm:inline font-medium"
              >
                Sign In
              </Link>
            </div>
          </nav>

          {/* DESIGN ANNOTATION: INVERSION PRINCIPLE */}
          {showAnnotations && (
            <div className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/30 px-5 py-2.5 text-xs text-[#ede0cc] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  <strong>Design Rule 1 (The Habit Inversion):</strong> 90% of visitors want to search homes and watch the quick 90-second morning news. The deep tools are tucked into the top-right menu and routed by Charlie on-demand.
                </span>
              </div>
            </div>
          )}

          {/* HERO SECTION: SEARCH + NEWS + CONCIERGE */}
          <section className="relative px-5 py-8 sm:py-12 bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#070707]">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                NATIONAL SYNDICATED MLS FEED + CONCIERGE
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
                Search Properties Nationwide. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8c84a] via-[#D4AF37] to-[#b8920a]">
                  Navigate Relocation with Charlie.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto">
                Real-time national property search powered by direct syndication, backed by 55+ years of concierge advisory.
              </p>

              {/* THE PRIMARY SEARCH PILL / BAR */}
              <div className="pt-2 max-w-2xl mx-auto">
                <div className="bg-[#181818] border-2 border-[#D4AF37] rounded-full p-2 pl-4 sm:pl-5 flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all focus-within:shadow-[0_0_35px_rgba(212,175,55,0.4)]">
                  <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by City, State, ZIP, or Neighborhood (e.g. Scottsdale, Austin, Denver)..."
                    className="w-full bg-transparent text-sm text-white placeholder-white/50 focus:outline-none"
                  />
                  <button className="bg-gradient-to-r from-[#e8c84a] to-[#D4AF37] hover:from-[#f3d45c] hover:to-[#dfb93c] text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5 shadow">
                    <span>Search MLS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Popular Search Tags */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 text-xs">
                  <span className="text-white/50 text-[11px] font-medium mr-1">Trending:</span>
                  {tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTag(t)}
                      className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                        selectedTag === t
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-[#181818] border border-[#2a2a2a] text-white/70 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* EMBEDDED CHARLIE V2V CONCIERGE BAR */}
              <div className="pt-2 flex flex-col items-center">
                <HeroGeminiConcierge />
              </div>
            </div>
          </section>

          {/* TWO-COLUMN DUAL ENGINE: 6AM NEWS & CHARLIE SPOTLIGHT */}
          <section className="px-5 py-8 border-t border-[#1a1a1a] bg-[#0c0c0c]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT: 6AM DAILY DNN BROADCAST */}
              <div className="bg-[#141414] border border-[#282828] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      6AM DAILY EDITION
                    </span>
                    <span className="text-[11px] text-white/50 font-mono">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white mb-1.5">
                    {latestBroadcast?.show_name || "Today's National Relocation & Housing Pulse"}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-4">
                    Our AI Anchor Charlie and founder Bob Dyson deliver a 90-second executive breakdown of mortgage trends, inter-state migration shifts, and inventory alerts.
                  </p>

                  {/* Simulated Video Player */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#222] group">
                    <img
                      src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
                      alt="News Studio"
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-4 justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                          DNN Broadcast Desk
                        </span>
                        <span className="text-xs font-semibold text-white">
                          Scene 1: Charlie Desk • Scene 2: National Report
                        </span>
                      </div>
                      <Link
                        to="/dnn-news"
                        className="w-10 h-10 rounded-full bg-[#D4AF37] hover:bg-[#e8c84a] text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs border-t border-[#222] mt-4">
                  <span className="text-white/60">Updated every morning at 6:00 AM PT</span>
                  <Link to="/dnn-news" className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
                    Watch Full Archives <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* RIGHT: REAL-TIME CONCIERGE ADVANTAGE (WHY DYSON RELO) */}
              <div className="bg-[#141414] border border-[#282828] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      THE CONCIERGE ADVANTAGE
                    </span>
                    <span className="text-[11px] text-white/50">Zero Sales Pitches</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-white mb-1.5">
                    Beyond Simple Zillow Search: Human Vetting + AI
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-4">
                    Other apps dump you onto random agent advertisers. We research over 20 top agents in your destination city, check their recent closed escrows, and match you with vetted specialists.
                  </p>

                  {/* 3 Pillars List */}
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-[#181818] border border-[#222] flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-[#D4AF37]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Full Destination Orientation</h4>
                        <p className="text-[11px] text-white/60">Schools, tax impact, local vibe, and vetted movers ready for you.</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#181818] border border-[#222] flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-[#D4AF37]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Compass className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">20+ Top Agent Research</h4>
                        <p className="text-[11px] text-white/60">We interview top producing brokers and select 3 finalists tailored to your criteria.</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#181818] border border-[#222] flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-[#D4AF37]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">100% Free For Relocating Buyers</h4>
                        <p className="text-[11px] text-white/60">Compensated strictly through standard inter-brokerage referral agreements.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs border-t border-[#222] mt-4">
                  <span className="text-white/60">Need a move roadmap?</span>
                  <Link to="/relocation-intake" className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
                    Start Relocation Intake <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </section>

          {/* SIMULATED NATIONAL MLS FEED RESULTS */}
          <section className="px-5 py-8 border-t border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
                  <span>Featured Listings from the National Feed</span>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                    LIVE PREVIEW
                  </span>
                </h3>
                <p className="text-xs text-white/60">
                  Showing top destinations where subscribers are relocating this quarter
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] text-white/80 hover:text-white">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" /> Filters
                </button>
                <select className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5 text-white/80 text-xs focus:outline-none">
                  <option>Newest Listings</option>
                  <option>Price: High to Low</option>
                  <option>Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Grid of Listing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_LISTINGS.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-[#141414] border border-[#252525] hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                      <img
                        src={listing.image}
                        alt={listing.address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                        {listing.tag}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <div className="text-base font-bold text-white mb-0.5">
                        {listing.price}
                      </div>
                      <div className="text-xs font-semibold text-white/90 truncate">
                        {listing.address}
                      </div>
                      <div className="text-[11px] text-white/60 mb-2.5">
                        {listing.city}, {listing.state}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-white/70 border-t border-[#222] pt-2">
                        <span><strong>{listing.beds}</strong> bds</span>
                        <span>•</span>
                        <span><strong>{listing.baths}</strong> ba</span>
                        <span>•</span>
                        <span><strong>{listing.sqft}</strong> sqft</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-1">
                    <button
                      onClick={() => alert(`Connect with Charlie for verified insight on ${listing.address}, ${listing.city}!`)}
                      className="w-full py-1.5 rounded-lg bg-[#222] hover:bg-[#D4AF37] hover:text-black text-white/90 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4AF37] group-hover:text-black" />
                      Ask Charlie About Property
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SIMULATED FOOTER: COMPLIANCE & LEGAL */}
          <footer className="border-t border-[#1a1a1a] bg-[#070707] px-5 py-6 text-xs text-white/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white/70">The Dyson & Dyson Companies, Inc.</p>
              <p className="text-[11px] text-white/40 mt-0.5">
                Licensed California Corporate Brokerage • Relocation Concierge & Nationwide Referral Network
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link to="/transparency" className="hover:text-white">Transparency</Link>
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <Link to="/portal" className="text-[#D4AF37] hover:underline font-bold">Role Selector</Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}