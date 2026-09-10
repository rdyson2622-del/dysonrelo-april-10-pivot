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
import ClientBacksideBobDeskDemo from '@/components/admin/frontdoor/ClientBacksideBobDeskDemo';
import PublicFrontDoorPrototype from '@/components/admin/frontdoor/PublicFrontDoorPrototype';
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
        {activeLabTab === 'client_backside' ? (
          <ClientBacksideBobDeskDemo deviceView={deviceView} />
        ) : (
          <PublicFrontDoorPrototype
            deviceView={deviceView}
            showAnnotations={showAnnotations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            searchEngine={searchEngine}
            setSearchEngine={setSearchEngine}
            handleAskCharlie={handleAskCharlie}
            currentUser={currentUser}
            flashNotice={flashNotice}
            userPortalDest={userPortalDest}
            userRoleLabel={userRoleLabel}
            isSubscribed={isSubscribed}
            selectedRoleForSubscription={selectedRoleForSubscription}
            setSelectedRoleForSubscription={setSelectedRoleForSubscription}
            mockListings={MOCK_LISTINGS}
          />
        )}
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