import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Building, ArrowRight, 
  CheckCircle2, SlidersHorizontal 
} from 'lucide-react';
import LabListingCard from '@/components/admin/frontdoor/LabListingCard';
import LabInspectorHeader from '@/components/admin/frontdoor/LabInspectorHeader';
import PartnerPortalGateways from '@/components/admin/frontdoor/PartnerPortalGateways';
import RoleSubscriptionDeck from '@/components/admin/frontdoor/RoleSubscriptionDeck';
import RealtorReturnCompanion from '@/components/admin/frontdoor/RealtorReturnCompanion';
import StudioAmbiencePlayer from '@/components/charlie/StudioAmbiencePlayer';
import LuxuryHeroShowcase from '@/components/admin/frontdoor/LuxuryHeroShowcase';
import ExploreDestinationsStrip from '@/components/admin/frontdoor/ExploreDestinationsStrip';
import ClientBacksideLabDemo from '@/components/admin/frontdoor/ClientBacksideLabDemo';
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

export default function AdminFrontDoorLab() {
  const navigate = useNavigate();
  const [deviceView, setDeviceView] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('device') === 'desktop') return 'desktop';
      if (p.get('device') === 'mobile') return 'mobile';
    }
    return 'mobile';
  });
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('realtor'); // 'realtor' | 'homes'
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [selectedRoleForSubscription, setSelectedRoleForSubscription] = useState('hr');
  const [activeLabTab, setActiveLabTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('view') || new URLSearchParams(window.location.search).get('tab');
      if (param === 'front_door' || param === 'client_backside') return param;
    }
    return 'client_backside';
  });

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
          setUserRoleLabel('Admin Portal');
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
      }
    }).catch(() => {
      // Not authenticated — check local storage for saved subscriber role
      try {
        const saved = JSON.parse(localStorage.getItem('dyson_portal'));
        if (saved?.roleKey) {
          setIsSubscribed(true);
          const MAP = {
            admin: { dest: '/admin', label: 'Admin Portal' },
            brokerage_admin: { dest: '/brokerage', label: 'Brokerage Portal' },
            broker: { dest: '/brokerage', label: 'Brokerage Portal' },
            agent: { dest: '/agent-command-center', label: 'Agent Portal' },
            referral_agent: { dest: '/partner-benefits', label: 'Referral Portal' },
            inactive_agent: { dest: '/partner-benefits', label: 'Referral Portal' },
            hr: { dest: '/corporate-relo', label: 'Corporate Relo Suite' },
            vendor: { dest: '/search', label: 'Vendor Hub' },
            client: { dest: '/home', label: 'Client Portal' },
          };
          const m = MAP[saved.roleKey];
          if (m) {
            setUserPortalDest(m.dest);
            setUserRoleLabel(m.label);
          } else {
            setUserPortalDest(saved.dest || '/home');
            setUserRoleLabel('My Workspace');
          }
        }
      } catch (_) {}
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
        activeLabView={activeLabTab}
        setActiveLabView={setActiveLabTab}
      />

      {/* Main Canvas Container */}
      <main className="p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div
          className={`transition-all duration-300 w-full ${
            deviceView === 'mobile'
              ? 'max-w-[420px] rounded-3xl border-4 border-[#333] shadow-2xl overflow-hidden'
              : activeLabTab === 'client_backside'
              ? 'max-w-4xl rounded-2xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden'
              : 'max-w-6xl rounded-2xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden'
          }`}
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

          {/* LAB SUB-NAVIGATION / ARTIFACT SELECTOR */}
          <div className="px-3 sm:px-5 py-2.5 bg-[#0e0e0e] border-b border-[#D4AF37]/50 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black shadow-sm">
                LAB ARTIFACT REVIEW
              </span>
              <span className="text-white/80 font-medium">
                Active View: <strong className="text-white">{activeLabTab === 'client_backside' ? 'Client Backside DEMO · LAB ONLY' : 'Public Front Door Prototype'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveLabTab('client_backside')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeLabTab === 'client_backside'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#1a1a1a] text-[#fce38a] hover:text-white border border-[#D4AF37]/40'
                }`}
              >
                <span>Client Backside DEMO</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('front_door')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLabTab === 'front_door'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#1a1a1a] text-white/70 hover:text-white border border-white/20'
                }`}
              >
                Public Front Door Prototype
              </button>
            </div>
          </div>

          {activeLabTab === 'client_backside' ? (
            <div className="p-3 sm:p-5 lg:p-6">
              <ClientBacksideLabDemo />
            </div>
          ) : (
            <>
              {/* CALLOUT TO CLIENT BACKSIDE DEMO ON PUBLIC VIEW */}
              <div className="mx-3 sm:mx-6 mt-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-black bg-[#D4AF37]">
                      CLIENT BACKSIDE DEMO · LAB ONLY
                    </span>
                    <span className="text-xs font-bold text-white">
                      Clean Portrait Mobile Landing (~390px) · DEMO / LAB
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70">
                    Search/Command pill, Talk with Charlie equal voice action, plain thumb-tap service list, and one-click My Library button.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLabTab('client_backside')}
                  className="px-3.5 py-1.5 rounded-lg font-bold text-xs text-black shadow hover:brightness-110 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  <span>Open Backside DEMO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

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

                {/* Right Actions: Ambience + Workspaces Access */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <StudioAmbiencePlayer />
                  {isSubscribed ? (
                    <button
                      onClick={() => navigate(userPortalDest || '/home')}
                      className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 h-7 rounded-full text-[10px] sm:text-[11px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #1f1a0e 0%, #0d0d0d 100%)',
                        border: `1.2px solid ${GOLD}`,
                        color: GOLD,
                      }}
                    >
                      <Building className="w-3 h-3 text-[#D4AF37]" />
                      <span className="hidden sm:inline">{userRoleLabel || 'My Workspace'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/subscribe')}
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
                  )}
                </div>
              </nav>

              {/* ANNOTATION CALLOUT BOX */}
              {showAnnotations && (
                <div
                  className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl border text-xs"
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
                </div>
              )}

              {/* HYBRID LUXURY PROPERTY SHOWCASE HERO */}
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

              {/* SIMULATED NATIONAL MLS FEED RESULTS */}
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
                    {MOCK_LISTINGS.slice(0, 4).map((listing) => (
                      <LabListingCard
                        key={listing.id}
                        listing={listing}
                        onAskCharlie={handleAskCharlie}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* INSTITUTIONAL & PROFESSIONAL GATEWAYS */}
              <section className="px-5 sm:px-8 py-6 border-t" style={{ background: TAN_BG, borderColor: 'rgba(10,10,10,0.15)' }}>
                <PartnerPortalGateways onSelectRole={setSelectedRoleForSubscription} />
                <RoleSubscriptionDeck
                  activeRole={selectedRoleForSubscription}
                  onSelectRole={setSelectedRoleForSubscription}
                />
              </section>
            </>
          )}

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
      {currentUser?.role === 'admin' && activeLabTab !== 'client_backside' && (
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