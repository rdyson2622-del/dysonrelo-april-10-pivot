import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Building, ArrowRight, ChevronDown, 
  CheckCircle2, SlidersHorizontal, Globe, Lock 
} from 'lucide-react';
import LabListingCard from '@/components/admin/frontdoor/LabListingCard';
import LabInspectorHeader from '@/components/admin/frontdoor/LabInspectorHeader';
import PartnerPortalGateways from '@/components/admin/frontdoor/PartnerPortalGateways';
import RoleSubscriptionDeck from '@/components/admin/frontdoor/RoleSubscriptionDeck';
import RealtorReturnCompanion from '@/components/admin/frontdoor/RealtorReturnCompanion';
import StudioAmbiencePlayer from '@/components/charlie/StudioAmbiencePlayer';
import LuxuryHeroShowcase from '@/components/admin/frontdoor/LuxuryHeroShowcase';
import ExploreDestinationsStrip from '@/components/admin/frontdoor/ExploreDestinationsStrip';
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
  const [deviceView, setDeviceView] = useState('desktop');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('realtor'); // 'realtor' | 'homes'
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [selectedRoleForSubscription, setSelectedRoleForSubscription] = useState('hr');

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

  const ROLE_NAV_DESTS = {
    hr: '/corporate-relo',
    agent: '/agent-command-center',
    broker: '/brokerage',
    inactive_agent: '/partner-benefits',
    vendor: '/search',
    client: '/home',
    admin: '/admin',
  };

  const handleSelectRoleFromNav = (roleKey) => {
    setPortalMenuOpen(false);
    const dest = ROLE_NAV_DESTS[roleKey] || '/home';
    localStorage.setItem('dyson_portal', JSON.stringify({ roleKey, dest }));
    sessionStorage.setItem('dyson_role', roleKey);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(dest);
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

          {/* TOP BAR: TAN BACKDROP WITH COMPACT BRAND PILL & SINGLE-ROW NAVIGATION */}
          <nav
            className="px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 sm:gap-4 relative shadow-sm overflow-x-auto overflow-y-visible"
            style={{ background: TAN_BG, borderBottom: `1.5px solid ${GOLD}` }}
          >
            {/* BRAND STATEMENT: COMPACT WIDTH & REDUCED VERTICAL SIZE */}
            <div 
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg shadow-sm border shrink-0"
              style={{
                background: '#0a0a0a',
                borderColor: `${GOLD}80`,
              }}
            >
              <img
                src={DYSON_LOGO}
                alt="Dyson & Dyson"
                className="h-5 sm:h-6 w-auto object-contain shrink-0 drop-shadow"
              />
              <div className="leading-tight">
                <span
                  className="font-bold text-sm sm:text-base tracking-wide text-white block leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  DysonRelo.com
                </span>
                <span className="text-[8px] sm:text-[8.5px] text-[#D4AF37] block tracking-wider uppercase font-sans font-semibold leading-tight">
                  Nationwide Relocation Concierge
                </span>
              </div>
            </div>

            {/* CENTER NAV LINKS IN BLACK FONT: STRICTLY ONE ROW */}
            <div className="flex items-center flex-nowrap whitespace-nowrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-xs sm:text-[12.5px] text-[#0a0a0a] font-bold tracking-tight shrink-0">
              <Link to="/corporate-relo" className="hover:text-[#b8920a] transition-colors whitespace-nowrap hover:underline underline-offset-4">
                Corp Relocation
              </Link>
              <Link to="/partner-benefits" className="hover:text-[#b8920a] transition-colors whitespace-nowrap hover:underline underline-offset-4">
                Agent Network
              </Link>
              <Link to="/transparency" className="hover:text-[#b8920a] transition-colors whitespace-nowrap hover:underline underline-offset-4">
                Transparency
              </Link>
              <Link to="/dnn-news" className="hover:text-[#b8920a] transition-colors whitespace-nowrap hover:underline underline-offset-4">
                DNN Real Estate News
              </Link>
            </div>

            {/* Right Actions: Ambience + Workspaces Access (Reduced Vertical Size) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Studio Ambience / Concierge Lounge Audio Player */}
              <StudioAmbiencePlayer />

              {/* Subscriber Workspaces & Direct Access Button */}
              <div className="relative flex items-center">
                {isSubscribed ? (
                  /* ALREADY SUBSCRIBED: Direct access to their specific personal DysonRelo site/portal! */
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(userPortalDest || '/home')}
                      className="flex items-center gap-1.5 px-2.5 py-0.5 h-7 rounded-full text-[11px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #1f1a0e 0%, #0d0d0d 100%)',
                        border: `1.2px solid ${GOLD}`,
                        color: GOLD,
                      }}
                      title={`Direct Access: Open ${userRoleLabel || 'Your Workspace'}`}
                    >
                      <Building className="w-3 h-3 text-[#D4AF37]" />
                      <span>{userRoleLabel || 'My Workspace'}</span>
                      <span
                        className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full text-black flex items-center gap-0.5 ml-0.5 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
                      >
                        <span>ENTER</span>
                        <ArrowRight className="w-2 h-2" />
                      </span>
                    </button>
                    <button
                      onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                      className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Switch Workspace / Options"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* NOT SUBSCRIBED: Opens the subscriber workspace options */
                  <button
                    onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:brightness-110 cursor-pointer shadow-sm"
                    style={{
                      background: '#141414',
                      border: '1.5px solid rgba(212,175,55,0.4)',
                      color: GOLD,
                    }}
                  >
                    <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Subscriber Workspaces</span>
                    <span className="text-[9px] bg-[#D4AF37] text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider hidden sm:inline">
                      Subscribers Only
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}

                {portalMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 border rounded-2xl shadow-2xl p-3.5 z-50 text-xs"
                    style={{
                      background: '#0a0a0a',
                      borderColor: GOLD,
                      boxShadow: '0 16px 45px rgba(0,0,0,0.85)',
                    }}
                  >
                    {/* Header with clear status and direct options */}
                    <div className="px-1 pb-3 mb-2 border-b border-white/10">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-[#D4AF37]" />
                          Subscriber Workspaces
                        </span>
                        <span className="text-[9px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 px-2 py-0.5 rounded-full uppercase">
                          {isSubscribed ? 'Subscribed' : 'Subscription Required'}
                        </span>
                      </div>

                      {/* Logged in status or sign-in/enroll options */}
                      {currentUser ? (
                        <div className="mt-2 flex items-center justify-between text-[11px] bg-[#141414] p-2 rounded-lg border border-white/10">
                          <span className="text-white/80 truncate">
                            Signed in: <strong className="text-white">{currentUser.email}</strong>
                          </span>
                          <button
                            onClick={async () => {
                              await base44.auth.logout();
                              localStorage.removeItem('dyson_portal');
                              sessionStorage.removeItem('dyson_role');
                              window.location.reload();
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px] font-bold underline ml-2 shrink-0 cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mt-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPortalMenuOpen(false);
                              const elem = document.getElementById('portal-subscribe-section');
                              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="py-1.5 px-2 rounded-lg font-bold text-[10px] text-black text-center cursor-pointer transition-transform active:scale-95 shadow"
                            style={{
                              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                            }}
                          >
                            Enroll / Activate Free
                          </button>
                          <Link
                            to="/login"
                            onClick={() => setPortalMenuOpen(false)}
                            className="py-1.5 px-2 rounded-lg font-bold text-[10px] text-white text-center border border-white/20 bg-[#1a1a1a] hover:bg-[#252525] cursor-pointer"
                          >
                            Subscriber Sign In
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Roles List with Clear Subscription Requirements */}
                    <div className="space-y-1">
                      <div className="px-1 pt-1 pb-1 text-[9px] uppercase font-bold tracking-wider text-white/40">
                        {isSubscribed ? 'Select Workspace to Open Directly:' : 'Choose Your Workspace to Enroll or Sign In:'}
                      </div>

                      {/* Corporate HR */}
                      <button
                        type="button"
                        onClick={() => handleSelectRoleFromNav('hr')}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors group cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-[#D4AF37] text-xs">
                              Corporate Relocation &amp; HR
                            </span>
                            <span className="text-[9px] text-[#D4AF37] font-semibold underline">
                              {isSubscribed ? 'Open Workspace →' : 'Enroll / Open'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-tight">
                            Zero-fee employee relocation packages &amp; executive milestone dashboard
                          </p>
                        </div>
                      </button>

                      {/* Agent Network */}
                      <button
                        type="button"
                        onClick={() => handleSelectRoleFromNav('agent')}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors group cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-[#D4AF37] text-xs">
                              Relocation Agent Network
                            </span>
                            <span className="text-[9px] text-[#D4AF37] font-semibold underline">
                              {isSubscribed ? 'Open Workspace →' : 'Enroll / Open'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-tight">
                            Receiving agent bureau • Capped territories &amp; pre-qualified clients
                          </p>
                        </div>
                      </button>

                      {/* Brokerage Management */}
                      <button
                        type="button"
                        onClick={() => handleSelectRoleFromNav('broker')}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors group cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-[#D4AF37] text-xs">
                              Brokerage &amp; Office Management
                            </span>
                            <span className="text-[9px] text-[#D4AF37] font-semibold underline">
                              {isSubscribed ? 'Open Workspace →' : 'Enroll / Open'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-tight">
                            BackOffice sync, escrow friction audits &amp; multi-agent pipeline
                          </p>
                        </div>
                      </button>

                      {/* Inactive Licensed Agents */}
                      <button
                        type="button"
                        onClick={() => handleSelectRoleFromNav('inactive_agent')}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors group cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-[#D4AF37] text-xs">
                              Inactive Licensed Agents
                            </span>
                            <span className="text-[9px] text-[#D4AF37] font-semibold underline">
                              {isSubscribed ? 'Open Workspace →' : 'Enroll / Open'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-tight">
                            25% Protected referral contract • Full escrow milestone tracking
                          </p>
                        </div>
                      </button>

                      {/* Vetted Vendor Network */}
                      <button
                        type="button"
                        onClick={() => handleSelectRoleFromNav('vendor')}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors group cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-[#D4AF37] text-xs">
                              Vetted Vendor Network
                            </span>
                            <span className="text-[9px] text-[#D4AF37] font-semibold underline">
                              {isSubscribed ? 'Open Workspace →' : 'Enroll / Open'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-tight">
                            Certified movers, inspectors, lenders &amp; stagers directory
                          </p>
                        </div>
                      </button>

                      {/* Client Relocation Workspace */}
                      <button
                        type="button"
                        onClick={() => handleSelectRoleFromNav('client')}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors group cursor-pointer border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white group-hover:text-[#D4AF37] text-xs">
                              Relocation Client &amp; Buyer
                            </span>
                            <span className="text-[9px] text-[#D4AF37] font-semibold underline">
                              {isSubscribed ? 'Open Workspace →' : 'Enroll / Open'}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-tight">
                            Personal relocation intake, milestones &amp; verified agent matching
                          </p>
                        </div>
                      </button>

                      {/* Platform Admin Console if user is admin */}
                      {currentUser?.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleSelectRoleFromNav('admin')}
                          className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl bg-[#1f1606] hover:bg-[#2a1e08] transition-colors group cursor-pointer border border-[#D4AF37]/40 mt-1"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#D4AF37] text-xs">
                                Platform Admin Console
                              </span>
                              <span className="text-[9px] text-[#D4AF37] font-bold underline">
                                Admin Access →
                              </span>
                            </div>
                            <p className="text-[10px] text-white/60 leading-tight">
                              Full platform control, broadcasts, audits, and user management
                            </p>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Bottom link to master role selector / subscribe page */}
                    <div className="mt-2 pt-2 border-t border-white/10 px-1 flex items-center justify-between text-[10px]">
                      <span className="text-white/40">Need help deciding?</span>
                      <Link
                        to="/subscribe"
                        onClick={() => setPortalMenuOpen(false)}
                        className="text-[#D4AF37] hover:underline font-bold"
                      >
                        Full Subscription Matrix →
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
            </div>
          )}

          {/* OPTION 3: THE HYBRID LUXURY PROPERTY SHOWCASE HERO */}
          <LuxuryHeroShowcase
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            searchEngine={searchEngine}
            setSearchEngine={setSearchEngine}
            onQuickMarketClick={handleSearch}
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

              {/* Grid of Black Listing Cards: Exactly 4 in a Single Row */}
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
                Licensed California Corporate Brokerage • CA DRE #02303118 • Real Estate Relocation Concierge &amp; National Referral Network
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-white/50">
              <Link to="/transparency" className="hover:text-white">Transparency</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white">Terms</Link>
            </div>
          </footer>
        </div>
      </main>

      {/* REALTOR.COM RETURN COMPANION DOCK */}
      <RealtorReturnCompanion
        activeSearch={activeExternalSearch}
        onClose={() => setActiveExternalSearch(null)}
      />
    </div>
  );
}