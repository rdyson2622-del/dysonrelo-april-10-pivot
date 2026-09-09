import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, ArrowRight, 
  SlidersHorizontal 
} from 'lucide-react';
import LabListingCard from '@/components/admin/frontdoor/LabListingCard';
import PartnerPortalGateways from '@/components/admin/frontdoor/PartnerPortalGateways';
import RoleSubscriptionDeck from '@/components/admin/frontdoor/RoleSubscriptionDeck';
import RealtorReturnCompanion from '@/components/admin/frontdoor/RealtorReturnCompanion';
import StudioAmbiencePlayer from '@/components/charlie/StudioAmbiencePlayer';
import LuxuryHeroShowcase from '@/components/admin/frontdoor/LuxuryHeroShowcase';
import ExploreDestinationsStrip from '@/components/admin/frontdoor/ExploreDestinationsStrip';
import SubscriberCommandDeck from '@/components/admin/frontdoor/SubscriberCommandDeck';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const INTEL_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/67bc7aa5a_generated_image.png';

const MOCK_LISTINGS = [
  {
    id: 'prop-1',
    address: '4920 Preston Hollow Estate',
    city: 'Dallas',
    state: 'TX',
    price: '$7,850,000',
    beds: 6,
    baths: 7.5,
    sqft: '8,420',
    tag: '0% State Tax • Highland Park / Preston Hollow',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=90',
    status: 'Active Syndication',
  },
  {
    id: 'prop-2',
    address: '2840 Silverleaf Sunset Ridge',
    city: 'Scottsdale',
    state: 'AZ',
    price: '$8,950,000',
    beds: 5,
    baths: 6.5,
    sqft: '7,890',
    tag: 'Silverleaf • Desert Sunset & Infinity Pool',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=90',
    status: 'Active Syndication',
  },
  {
    id: 'prop-3',
    address: '112 Port Royal Coastal Vista',
    city: 'Naples',
    state: 'FL',
    price: '$12,800,000',
    beds: 5,
    baths: 7,
    sqft: '9,150',
    tag: 'Port Royal • Waterfront Sunset & Deepwater Dock',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=90',
    status: 'Active Syndication',
  },
  {
    id: 'prop-4',
    address: '744 Chautauqua Alpine Ridge',
    city: 'Boulder',
    state: 'CO',
    price: '$6,450,000',
    beds: 5,
    baths: 6,
    sqft: '6,780',
    tag: 'Flatirons Vista • Modern Mountain Glass',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90',
    status: 'Active Syndication',
  },
  {
    id: 'prop-5',
    address: '810 Belle Meade Manor Court',
    city: 'Nashville',
    state: 'TN',
    price: '$5,950,000',
    beds: 6,
    baths: 7,
    sqft: '7,650',
    tag: '0% State Tax • Belle Meade Estate Grounds',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=90',
    status: 'Active Syndication',
  },
  {
    id: 'prop-6',
    address: '420 Westlake Glass Pavilion',
    city: 'Austin',
    state: 'TX',
    price: '$7,250,000',
    beds: 5,
    baths: 6,
    sqft: '6,920',
    tag: '0% State Tax • Lake Austin Sunset Views',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90',
    status: 'Active Syndication',
  },
];

export default function FrontDoor() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('realtor'); // 'realtor' | 'homes'
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [selectedRoleForSubscription, setSelectedRoleForSubscription] = useState('hr');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'high_to_low' | 'low_to_high'
  const [activeListingFilter, setActiveListingFilter] = useState('all'); // 'all' | '0_tax' | 'waterfront' | 'mountain'
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showSubscriberMode, setShowSubscriberMode] = useState(true);

  // Subscriber session & direct-access detection
  const [currentUser, setCurrentUser] = useState(null);
  const [userPortalDest, setUserPortalDest] = useState(null);
  const [userRoleLabel, setUserRoleLabel] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [flashNotice, setFlashNotice] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) {
        setCurrentUser(user);
        setIsSubscribed(true);
        const firstName = user.full_name ? user.full_name.split(' ')[0] : (user.email?.split('@')[0] || 'Bob');
        setFlashNotice(`WELCOME BACK ${firstName.toUpperCase()}`);
        setTimeout(() => {
          setFlashNotice(null);
        }, 1200);
        if (user.role === 'admin') {
          setUserPortalDest('/admin');
          setUserRoleLabel('Admin Console');
        } else if (user.portal_role === 'brokerage_admin' || user.portal_role === 'broker') {
          setUserPortalDest('/brokerage');
          setUserRoleLabel('Brokerage Portal');
        } else if (user.portal_role === 'agent') {
          setUserPortalDest('/agent-command-center');
          setUserRoleLabel('Agent Portal');
        } else if (user.portal_role === 'referral_agent' || user.portal_role === 'inactive_agent') {
          setUserPortalDest('/partner-benefits');
          setUserRoleLabel('Referral Portal');
        } else if (user.portal_role === 'hr') {
          setUserPortalDest('/corporate-relo');
          setUserRoleLabel('Corporate Relo Suite');
        } else if (user.portal_role === 'vendor') {
          setUserPortalDest('/search');
          setUserRoleLabel('Vendor Hub');
        } else {
          setUserPortalDest('/home');
          setUserRoleLabel('Client Portal');
        }
      } else {
        setCurrentUser(null);
        setIsSubscribed(false);
      }
    }).catch(() => {
      // Unauthenticated visitor: keep public page clean and pristine
      setCurrentUser(null);
      setIsSubscribed(false);
    });

    base44.entities.DnnBroadcast.list('-broadcast_date', 1)
      .then((res) => {
        if (res && res.length > 0) {
          setLatestBroadcast(res[0]);
        }
      })
      .catch(() => {});
  }, []);

  const [activeExternalSearch, setActiveExternalSearch] = useState(null);

  useEffect(() => {
    const handleCharlieMls = (e) => {
      const detail = e.detail;
      if (!detail) return;
      const loc = detail.location || detail.title || '';
      if (loc) {
        setSearchQuery(loc);
      }
      if (detail.url) {
        setActiveExternalSearch({
          location: loc,
          url: detail.url,
          engineName: detail.url.includes('homes.com') ? 'Homes.com' : 'Realtor.com',
          fromCharlie: true,
        });
      }
    };

    window.addEventListener('charlie-mls-search', handleCharlieMls);
    return () => window.removeEventListener('charlie-mls-search', handleCharlieMls);
  }, []);

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
      {/* Main Container */}
      <main className="p-2 sm:p-5 md:p-6 flex justify-center items-start">
        <div
          className="w-full max-w-6xl rounded-2xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden"
          style={{ background: TAN_BG }}
        >
          {/* ONE-SECOND FLASH NOTICE: WELCOME BACK BOB */}
          {flashNotice && (
            <div className="fixed top-12 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
              <div
                className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider text-black flex items-center gap-2 shadow-2xl border border-black/30"
                style={{
                  background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                <span>{flashNotice}</span>
              </div>
            </div>
          )}

          {/* TOP BAR: TAN BACKDROP WITH COMPACT BRAND PILL & BALANCED NAVIGATION */}
          <nav
            className="px-2 sm:px-3.5 lg:px-5 py-1 sm:py-1.5 flex items-center justify-between gap-1 sm:gap-2.5 lg:gap-4 relative shadow-sm"
            style={{ background: TAN_BG, borderBottom: `1.5px solid ${GOLD}` }}
          >
            {/* BRAND STATEMENT: ULTRA-COMPACT HORIZONTALLY ON CELL PHONE PORTRAIT, EXPANDED ON LARGER SCREENS */}
            <div 
              className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-2xl shadow-sm border shrink-0"
              style={{
                background: '#0a0a0a',
                borderColor: `${GOLD}80`,
              }}
            >
              <img
                src={DYSON_LOGO}
                alt="Dyson & Dyson"
                className="h-4 sm:h-5 md:h-6 w-auto object-contain shrink-0 drop-shadow"
              />
              <div className="leading-tight">
                <span
                  className="font-bold text-[11px] sm:text-xs md:text-sm lg:text-base tracking-wide text-white block leading-tight whitespace-nowrap"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  <span className="md:hidden">DysonRelo</span>
                  <span className="hidden md:inline">DysonRelo.com</span>
                </span>
                <span className="hidden md:block text-[7.5px] md:text-[8px] lg:text-[8.5px] text-[#D4AF37] tracking-wider uppercase font-sans font-semibold leading-tight whitespace-nowrap">
                  Nationwide Relocation Concierge
                </span>
              </div>
            </div>

            {/* CENTER NAV LINKS IN BLACK FONT: FORMATTED ACROSS ONE OR TWO LINES TO NEVER OVERFLOW */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-5 text-[9px] sm:text-[10.5px] md:text-xs lg:text-[12.5px] text-[#0a0a0a] font-bold tracking-tight">
              <Link to="/corporate-relo" className="hover:text-[#b8920a] transition-colors hover:underline underline-offset-4 text-center leading-tight">
                <span>Corp </span>
                <span className="block sm:inline">Relo<span className="hidden sm:inline">cation</span></span>
              </Link>
              <Link to="/partner-benefits" className="hover:text-[#b8920a] transition-colors hover:underline underline-offset-4 text-center leading-tight">
                <span>Agent </span>
                <span className="block sm:inline">Network</span>
              </Link>
              <Link to="/transparency" className="hover:text-[#b8920a] transition-colors hover:underline underline-offset-4 text-center leading-tight whitespace-nowrap">
                Transparency
              </Link>
              <Link to="/dnn-news" className="hover:text-[#b8920a] transition-colors hover:underline underline-offset-4 text-center leading-tight">
                <span>DNN </span>
                <span className="block sm:inline whitespace-nowrap">
                  <span className="hidden md:inline">Real Estate </span>News
                </span>
              </Link>
            </div>

            {/* Right Actions: Ambience + Subscriber View Toggle + Workspaces Access */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Studio Ambience / Concierge Lounge Audio Player */}
              <StudioAmbiencePlayer />

              {/* Quick Toggle for Subscriber View Experience */}
              <button
                type="button"
                onClick={() => setShowSubscriberMode(!showSubscriberMode)}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 h-7 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer shadow-sm shrink-0 ${
                  showSubscriberMode
                    ? 'bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]'
                    : 'bg-[#181818] text-white/80 hover:text-white border border-white/20'
                }`}
                title="Toggle Recognized Subscriber Command Deck"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${showSubscriberMode ? 'bg-[#10b981] animate-pulse' : 'bg-stone-500'}`} />
                <span className="hidden sm:inline">{showSubscriberMode ? 'Subscriber View' : 'Visitor View'}</span>
                <span className="sm:hidden">{showSubscriberMode ? 'Sub' : 'Vis'}</span>
              </button>

              {/* Subscriber Workspaces & Sleek Access Button (Only for non-admin subscribers; admin pill is moved elsewhere) */}
              {isSubscribed && currentUser?.role !== 'admin' ? (
                <button
                  onClick={() => navigate(userPortalDest || '/home')}
                  className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 h-7 rounded-full text-[10px] sm:text-[11px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #1f1a0e 0%, #0d0d0d 100%)',
                    border: `1.2px solid ${GOLD}`,
                    color: GOLD,
                  }}
                  title={`Direct Access: Open ${userRoleLabel || 'Your Workspace'}`}
                >
                  <Building className="w-3 h-3 text-[#D4AF37]" />
                  <span className="hidden sm:inline">{userRoleLabel || 'My Workspace'}</span>
                  <span
                    className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full text-black flex items-center gap-0.5 ml-0.5 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
                  >
                    <span>ENTER</span>
                    <ArrowRight className="w-2 h-2" />
                  </span>
                </button>
              ) : !isSubscribed ? (
                <button
                  onClick={() => {
                    const elem = document.getElementById('portal-subscribe-section');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/subscribe');
                  }}
                  className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 h-7 rounded-full text-[10px] sm:text-[11px] font-bold transition-all hover:brightness-110 cursor-pointer shadow-sm shrink-0"
                  style={{
                    background: '#141414',
                    border: '1px solid rgba(212,175,55,0.4)',
                    color: GOLD,
                  }}
                >
                  <Building className="w-3 h-3 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Workspaces</span>
                </button>
              ) : null}
            </div>
          </nav>

          {/* RECOGNIZED SUBSCRIBER COMMAND CENTER & DIALOGUE LEDGER */}
          {showSubscriberMode && (
            <SubscriberCommandDeck
              currentUser={currentUser || { full_name: 'Bob Dyson', portal_role: 'client' }}
              onSimulateRoleChange={(roleKey) => {
                setSelectedRoleForSubscription(roleKey);
              }}
            />
          )}

          {/* THE HYBRID LUXURY PROPERTY SHOWCASE HERO */}
          <LuxuryHeroShowcase
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            searchEngine={searchEngine}
            setSearchEngine={setSearchEngine}
            onQuickMarketClick={handleSearch}
            currentUser={currentUser}
          />

          {/* DIRECTLY UNDER THE LANDING PAGE IN A SCROLL: EXPLORE TOP RELOCATION DESTINATIONS */}
          <ExploreDestinationsStrip
            onMarketClick={(city) => {
              setSearchQuery(city);
              handleSearch(city);
            }}
          />

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
                      Curated Destination Markets
                    </span>
                  </h3>
                  <p className="text-xs text-[#44382c]">
                    Featured destination properties for relocating families &amp; executive transferees
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowFilterBar(!showFilterBar)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white font-semibold shadow-sm cursor-pointer transition-all hover:brightness-110 active:scale-95"
                    style={{ background: '#0a0a0a', border: `1px solid ${GOLD}` }}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{showFilterBar ? 'Hide Filters' : 'Filters'}</span>
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg px-3 py-1.5 text-white text-xs font-medium focus:outline-none shadow-sm cursor-pointer"
                    style={{ background: '#0a0a0a', border: `1px solid ${GOLD}` }}
                  >
                    <option value="newest">Sort: Newest Listings</option>
                    <option value="high_to_low">Sort: Price: High to Low</option>
                    <option value="low_to_high">Sort: Price: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Interactive Quick Filter Chips */}
              {showFilterBar && (
                <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-xl bg-[#0a0a0a]/90 border border-[#D4AF37]/40 shadow-inner animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider pl-1">Filter by:</span>
                  {[
                    { id: 'all', label: 'All Curated' },
                    { id: '0_tax', label: '0% State Tax' },
                    { id: 'waterfront', label: 'Waterfront / Coastal' },
                    { id: 'mountain', label: 'Alpine / Mountain' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveListingFilter(f.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeListingFilter === f.id
                          ? 'bg-[#D4AF37] text-black shadow-md scale-105'
                          : 'bg-[#181818] text-white/80 hover:text-white border border-white/20'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid of Black Listing Cards: Exactly 4 in a Single Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  let filtered = [...MOCK_LISTINGS];
                  if (activeListingFilter === '0_tax') {
                    filtered = filtered.filter(l => l.tag?.includes('0% State Tax'));
                  } else if (activeListingFilter === 'waterfront') {
                    filtered = filtered.filter(l => l.tag?.toLowerCase().includes('waterfront') || l.city === 'Naples');
                  } else if (activeListingFilter === 'mountain') {
                    filtered = filtered.filter(l => l.tag?.toLowerCase().includes('alpine') || l.city === 'Boulder');
                  }

                  if (sortBy === 'high_to_low') {
                    filtered.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
                  } else if (sortBy === 'low_to_high') {
                    filtered.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
                  }

                  return filtered.slice(0, 4).map((listing) => (
                    <LabListingCard
                      key={listing.id}
                      listing={listing}
                      onAskCharlie={handleAskCharlie}
                    />
                  ));
                })()}
              </div>
            </div>
          </section>



          {/* INSTITUTIONAL & PROFESSIONAL GATEWAYS (CORPORATE HR, AGENTS, BROKERS, VENDORS) */}
          <section id="portal-subscribe-section" className="px-5 sm:px-8 py-6 border-t scroll-mt-6" style={{ background: TAN_BG, borderColor: 'rgba(10,10,10,0.15)' }}>
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
                Licensed California Corporate Brokerage • CA DRE #02303118 • Real Estate Relocation Concierge &amp; National Referral Network
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/50">
              <Link to="/transparency" className="hover:text-white">Transparency</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              {currentUser?.role === 'admin' && (
                <>
                  <span>•</span>
                  <Link to="/admin" className="text-[#D4AF37] hover:underline font-bold">Admin Console</Link>
                </>
              )}
            </div>
          </footer>
        </div>
      </main>

      {/* FLOATING ADMIN PILL — DEDICATED QUICK-ACCESS FOR THE ADMIN TEAM (OFF TOP BAR) */}
      {currentUser?.role === 'admin' && (
        <div className="fixed bottom-4 left-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full shadow-2xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            style={{
              background: '#0a0a0a',
              borderColor: GOLD,
              color: GOLD,
              boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
            }}
            title="Open DysonRelo Admin Console"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
            <span className="font-sans tracking-wide">Admin Console</span>
            <span
              className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black flex items-center gap-0.5 ml-0.5 shadow-sm group-hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
            >
              <span>ENTER</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </button>
        </div>
      )}

      {/* REALTOR.COM RETURN COMPANION DOCK */}
      <RealtorReturnCompanion
        activeSearch={activeExternalSearch}
        onClose={() => setActiveExternalSearch(null)}
      />
    </div>
  );
}