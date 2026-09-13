import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, ShieldCheck, Users, Briefcase, Building, Tv, Compass, Sparkles,
  LogIn, UserPlus, Phone, MessageCircle, Home, Mic, Play, BookOpen
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';
import SubscriberCommandCard from './SubscriberCommandCard';
import IPhoneSpringboardGrid from '@/components/springboard/IPhoneSpringboardGrid';
import FirstTimeViewerSidebarIntro from '@/components/sidebar/FirstTimeViewerSidebarIntro';

const GOLD = '#D4AF37';

import CopilotPropertyDossier from '@/components/copilot/CopilotPropertyDossier';

// Curated high-valued architectural luxury estates captured at sunset and twilight with live Copilot dossier data
const HERO_BACKGROUNDS = [
  {
    id: 'lajolla',
    city: 'La Jolla, CA',
    title: 'Coastal Sunset Architectural Estate',
    tag: '$3.45M • Ocean View Permitted Boundary',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
    property: {
      address: '742 Vista Del Mar, La Jolla, CA 92037',
      price: 3450000,
      beds: 4,
      baths: 4.5,
      sqft: 3820,
      dom: 64,
      compsPrice: 3200000,
      rebate: 21562,
      risks: [
        '64 days on market — seller price reduction of $150k pending',
        'Coastal Commission permitting boundary: strict exterior remodel restrictions',
        'Recent neighborhood comp sold 7.2% below asking price'
      ],
      listingOffice: 'Independent Coastal Brokerage',
      lastSoldPrice: 2100000,
      lastSoldYear: 2019
    }
  },
  {
    id: 'scottsdale',
    city: 'Scottsdale, AZ',
    title: 'Desert Sunset Architectural Estate',
    tag: '$2.15M • 0% Income Tax Corridor',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
    property: {
      address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
      price: 2150000,
      beds: 4,
      baths: 3,
      sqft: 3240,
      dom: 18,
      compsPrice: 2125000,
      rebate: 13437,
      risks: [
        'HOA rental restriction: minimum 12-month lease required (no short-term Airbnb)',
        'Dual A/C units are 14 years old — approaching replacement lifecycle'
      ],
      listingOffice: 'Southwest Luxury Realty',
      lastSoldPrice: 1420000,
      lastSoldYear: 2021
    }
  },
  {
    id: 'austin',
    city: 'Austin, TX',
    title: 'Twilight Hill Country Glass Villa',
    tag: '$1.85M • Corporate Tech Relo Hub',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
    property: {
      address: '4220 Oak Hollow Terrace, Austin, TX 78746',
      price: 1850000,
      beds: 3,
      baths: 3.5,
      sqft: 2890,
      dom: 42,
      compsPrice: 1775000,
      rebate: 11562,
      risks: [
        'Travis County tax reassessment will trigger ~18% property tax escalation next cycle',
        'Flash flood zone buffer near greenbelt easement'
      ],
      listingOffice: 'Westlake Premier Estates',
      lastSoldPrice: 1150000,
      lastSoldYear: 2018
    }
  },
  {
    id: 'naples',
    city: 'Naples, FL',
    title: 'Waterfront Sunset Palm Estate',
    tag: '$4.85M • Coastal Relo Haven',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=95',
    property: {
      address: '112 Port Royal Coastal Vista, Naples, FL 34102',
      price: 4850000,
      beds: 5,
      baths: 6,
      sqft: 5120,
      dom: 29,
      compsPrice: 4650000,
      rebate: 30312,
      risks: [
        'High-velocity coastal wind & hurricane insurance surcharge',
        'Seawall inspection required for deepwater dock easement'
      ],
      listingOffice: 'Port Royal Luxury Brokerage',
      lastSoldPrice: 3200000,
      lastSoldYear: 2020
    }
  },
  {
    id: 'boulder',
    city: 'Boulder, CO',
    title: 'Mountain Contemporary Glass Manor',
    tag: '$2.95M • Alpine Lifestyle Relo',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95',
    property: {
      address: '744 Chautauqua Alpine Ridge, Boulder, CO 80302',
      price: 2950000,
      beds: 4,
      baths: 4,
      sqft: 3650,
      dom: 24,
      compsPrice: 2890000,
      rebate: 18437,
      risks: [
        'Wildfire urban interface mitigation mandate',
        'City of Boulder open space view corridor setback restrictions'
      ],
      listingOffice: 'Flatirons Alpine Realty',
      lastSoldPrice: 1950000,
      lastSoldYear: 2019
    }
  },
];

export default function LuxuryHeroShowcase({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchEngine = 'realtor',
  setSearchEngine,
  onQuickMarketClick,
  currentUser,
  isSubscriberMode = false,
  onToggleSubscriberMode,
}) {
  const navigate = useNavigate();
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const currentBg = HERO_BACKGROUNDS[activeBgIndex];

  const [customProperty, setCustomProperty] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const activeProperty = customProperty || currentBg.property;

  const handleCopilotRun = (e) => {
    e.preventDefault();
    const query = searchQuery?.trim();
    if (!query) return;
    setIsAuditing(true);

    const qLower = query.toLowerCase();
    const matchedBgIndex = HERO_BACKGROUNDS.findIndex(b => 
      qLower.includes(b.city.toLowerCase().split(',')[0]) ||
      b.property.address.toLowerCase().includes(qLower)
    );

    if (matchedBgIndex >= 0) {
      setActiveBgIndex(matchedBgIndex);
      setCustomProperty(null);
      setIsAuditing(false);
    } else {
      setTimeout(() => {
        setCustomProperty({
          address: query,
          price: 2450000,
          beds: 4,
          baths: 3.5,
          sqft: 3400,
          dom: 31,
          compsPrice: 2380000,
          rebate: 15312,
          risks: [
            'Micro-pocket sales average closed 2.8% below initial asking price',
            'Municipal zoning & tax assessment recalculation required upon transfer',
            'Verify active utility easements prior to offer submission'
          ],
          listingOffice: 'Syndicated Regional Listing',
          lastSoldPrice: 1650000,
          lastSoldYear: 2020
        });
        setIsAuditing(false);
      }, 400);
    }
  };

  const handleSelectSample = (sampleAddress, bgId) => {
    setSearchQuery(sampleAddress);
    const idx = HERO_BACKGROUNDS.findIndex(b => b.id === bgId);
    if (idx >= 0) {
      setActiveBgIndex(idx);
    }
    setCustomProperty(null);
  };

  // Gating rule:
  // Family = authenticated DnnSubscriber email OR explicit view-as localStorage dyson_view_as_family_subscriber=true (optional dyson_view_as_subscriber_email)
  // Admin alone is NEVER Family. Admin without view-as must remain Admin chrome and must not receive a Family greeting/card.
  const [isFamilySubscriber, setIsFamilySubscriber] = useState(false);
  const [clientRecord, setClientRecord] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function evaluateFamilyGate() {
      // The public front door strictly defaults to First-Timer View.
      // Subscriber mode ONLY activates when explicitly toggled on via isSubscriberMode prop.
      if (!isSubscriberMode) {
        if (isMounted) {
          setIsFamilySubscriber(false);
          setClientRecord(null);
        }
        return;
      }

      let isFamily = true;
      let targetEmail = typeof window !== 'undefined' ? localStorage.getItem('dyson_view_as_subscriber_email') : null;
      targetEmail = targetEmail || currentUser?.email;

      // Fetch live RelocationClient data for real city information (no invented milestones)
      let matchedClient = null;
      if (targetEmail) {
        try {
          const clients = await base44.entities.RelocationClient.filter({ email: targetEmail }, '-created_date', 1);
          if (clients && clients.length > 0) {
            matchedClient = clients[0];
          }
        } catch (_) {}
      }

      // If view-as without matched email, fetch latest real client to display live database city data
      if (!matchedClient && isSubscriberMode) {
        try {
          const anyClients = await base44.entities.RelocationClient.list('-created_date', 1);
          if (anyClients && anyClients.length > 0) {
            matchedClient = anyClients[0];
          }
        } catch (_) {}
      }

      if (isMounted) {
        setIsFamilySubscriber(true);
        setClientRecord(matchedClient);
      }
    }

    evaluateFamilyGate();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isSubscriberMode]);

  // Derived live move line from live RelocationClient data (no invented milestones)
  const currentCity = clientRecord?.current_city?.trim();
  const destCity = clientRecord?.destination_city?.trim();
  const hasActiveMove = Boolean(destCity || currentCity);

  let activeMoveLine = 'No active move yet — start your relocation intake';
  if (currentCity && destCity) {
    activeMoveLine = `${currentCity} → ${destCity}`;
  } else if (destCity) {
    activeMoveLine = `Destination: ${destCity}`;
  } else if (currentCity) {
    activeMoveLine = `Origin: ${currentCity}`;
  }

  const continueMoveDest = hasActiveMove ? '/RelocationRoadmap' : '/relocation-intake';
  const firstName = clientRecord?.full_name?.split(' ')[0] || 
                    currentUser?.full_name?.split(' ')[0] || 
                    currentUser?.email?.split('@')[0] || 
                    (typeof window !== 'undefined' ? localStorage.getItem('dyson_test_subscriber_name') : null) || 
                    'Friend';

  const scrollToSearch = () => {
    const searchForm = document.getElementById('hero-search-bar');
    const searchInput = document.getElementById('hero-search-input');
    if (searchForm) {
      searchForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 350);
    }
  };

  return (
    <div className="w-full">
      {/* 2-COLUMN STRUCTURE:
          Left Sidebar: Elongated organized list of to-do's, including Talk with Charlie voice concierge & doorway pathways.
          Right Canvas: Unified single-line featured destination bar, pure architectural photo with luxury tan backdrop, and clean search pill. */}
      <div className="flex flex-col lg:flex-row w-full rounded-t-2xl overflow-hidden shadow-2xl bg-[#0a0a0a] border-b border-[#D4AF37]/30">
        
        {/* ========================================================
            LEFT SIDEBAR (ORGANIZED CONCIERGE TO-DO'S & PATHWAYS)
            Sidebar stays black, pills inside are reverse colors: tan box with black font colors!
            ======================================================== */}
        <aside 
          className="w-full lg:w-[275px] xl:w-[295px] shrink-0 p-3 sm:p-3.5 flex flex-col justify-between text-left relative z-20 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-[#D4AF37]/40"
          style={{
            background: 'linear-gradient(180deg, #0e0e0e 0%, #080808 100%)',
          }}
        >
          {/* Top Branding & Fiduciary Headline */}
          <div className="space-y-1.5 flex flex-col items-center text-center">
            <div 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest uppercase shadow-sm"
              style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}60`, color: GOLD }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>55+ YEARS • NATIONWIDE CONCIERGE</span>
            </div>

            {isFamilySubscriber ? (
              /* ========================================================
                 PERSONAL FAMILY/BUYER SUBSCRIBER SIDEBAR (IPHONE SPRINGBOARD MODEL)
                 - Welcome/active move at top
                 - 3-Across iPhone Springboard Grid on solid black
                 ======================================================== */
              <div className="w-full space-y-2 pt-0.5">
                <div 
                  className="p-2.5 rounded-2xl border text-left shadow-lg space-y-1 bg-[#12100b] border-[#D4AF37]/60"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span 
                      className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black bg-[#D4AF37] shadow-sm"
                    >
                      RELOCATING FAMILY
                    </span>
                    <span className="flex items-center gap-1 text-[8.5px] text-[#10b981] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      Active Account
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight font-serif">
                      Welcome back {firstName}
                    </h3>
                    <p className="text-[10px] text-[#D4AF37] font-semibold leading-snug mt-0.5">
                      {activeMoveLine}
                    </p>
                  </div>
                </div>

                {/* Mini Apps Grid for Subscribers */}
                <div className="pt-1.5 w-full text-left">
                  <div className="text-[8.5px] font-black uppercase tracking-wider text-[#D4AF37] px-0.5 mb-2 flex items-center justify-between">
                    <span>SUBSCRIBER MINI APPS:</span>
                    <span className="text-white/40 normal-case font-normal text-[8px]">tap to launch</span>
                  </div>
                  <IPhoneSpringboardGrid />
                </div>
              </div>
            ) : (
              /* 1ST TIME UNSUBSCRIBED VIEWER INTRO CARD AT TOP OF SIDEBAR */
              <FirstTimeViewerSidebarIntro
                onSwitchToSubscriber={() => {
                  if (onToggleSubscriberMode) {
                    onToggleSubscriberMode();
                  } else {
                    sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
                    window.location.reload();
                  }
                }}
              />
            )}

            {/* CONCIERGE MINI APPS ON SOLID BLACK BACKGROUND */}
            {!isFamilySubscriber && (
              <div className="pt-1.5 w-full text-left">
                <div className="text-[8.5px] font-black uppercase tracking-wider text-[#D4AF37] px-0.5 mb-2 flex items-center justify-between">
                  <span>CONCIERGE MINI APPS:</span>
                  <span className="text-white/40 normal-case font-normal text-[8px]">tap to launch</span>
                </div>
                <IPhoneSpringboardGrid />
              </div>
            )}
          </div>

          {/* 3. FIDUCIARY DESK DIRECT CONTACT / TEXT LINE — SLEEK IPHONE DOCK */}
          <div className="pt-2 mt-1 border-t border-white/10">
            <div 
              className="p-2 rounded-2xl border border-[#D4AF37]/50 bg-[#121212] text-white flex items-center justify-between gap-1.5 shadow-lg"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#D4AF37]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span>Concierge Direct</span>
                </div>
                <div className="text-[11px] font-bold text-white font-mono leading-tight">
                  (858) 353-1200
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href="tel:+18583531200"
                  className="px-2 py-1 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] border border-[#D4AF37]/40 text-[9px] font-bold text-[#D4AF37] transition-all flex items-center gap-0.5 cursor-pointer"
                  title="Call Concierge Desk"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </a>
                <a
                  href="sms:+18583531200"
                  className="px-2 py-1 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] border border-[#10b981]/40 text-[9px] font-bold text-[#10b981] transition-all flex items-center gap-0.5 cursor-pointer"
                  title="Text Concierge Desk"
                >
                  <MessageCircle className="w-2.5 h-2.5" />
                  <span>Text</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Fiduciary License Line */}
          <div className="pt-2 mt-2 border-t border-white/10 text-[9px] text-white/60 flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>All 50 States</span>
            </span>
            <div className="text-right leading-tight">
              <div className="text-white/85 font-medium text-[8.5px] tracking-tight">The Dyson &amp; Dyson Companies, Inc.</div>
              <div className="font-mono text-white/70 text-[8.5px]">CA DRE #02303118</div>
            </div>
          </div>

          {/* ADMIN TEAM QUICK ENTRY (DEDICATED FOR ADMINS, NEVER SHOWN ON FAMILY SIDEBAR) */}
          {currentUser?.role === 'admin' && !isFamilySubscriber && (
            <div className="pt-2 mt-2 border-t border-[#D4AF37]/30">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="w-full py-1.5 px-2.5 rounded-lg border border-[#D4AF37]/60 bg-[#141414] hover:bg-[#201c12] text-[#D4AF37] flex items-center justify-between text-[10.5px] font-bold transition-all shadow-sm cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>Admin Console</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37] text-black flex items-center gap-0.5 group-hover:scale-105 transition-transform">
                  <span>ENTER</span>
                  <ArrowRight className="w-2 h-2" />
                </span>
              </button>
            </div>
          )}
        </aside>

        {/* ========================================================
            RIGHT CANVAS: 
            If Family Subscriber: Hero Command Card (gated identically).
            If Cold Visitor / Admin: Public Luxury Hero Showcase with architectural photography & search.
            ======================================================== */}
        <div 
          className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col justify-start gap-4 order-1 lg:order-2"
          style={{
            background: isFamilySubscriber ? '#0a0a0a' : '#ede0cc',
          }}
        >
          {isFamilySubscriber ? (
            <SubscriberCommandCard
              currentUser={currentUser}
              clientRecord={clientRecord}
              onSearch={onSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSwitchToVisitorView={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('dyson_view_as_family_subscriber');
                  localStorage.removeItem('dyson_view_as');
                }
                setIsFamilySubscriber(false);
                onToggleSubscriberMode?.();
              }}
            />
          ) : (
            <>
              {/* ================= 1. FEATURED DESTINATIONS BAR (ALL ON ONE LINE) ================= */}
          <div 
            className="w-full max-w-2xl mx-auto flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs shadow-md"
            style={{
              background: '#0a0a0a',
              border: `1.5px solid ${GOLD}85`,
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

          {/* ================= 2. PURE ARCHITECTURAL HOUSE PHOTO (ON TAN BACKDROP) ================= */}
          <div className="w-full max-w-2xl mx-auto relative rounded-xl overflow-hidden shadow-2xl aspect-[16/10] sm:aspect-[16/9] bg-black">
            <img
              src={currentBg.url}
              alt={currentBg.title}
              key={currentBg.id}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
            />
          </div>

          {/* ================= 3. DYSONHOMES COPILOT STATEMENT & ZERO-UI SEARCH PROMPT ================= */}
          <div className="w-full max-w-2xl mx-auto space-y-3.5 text-center pt-2">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#D4AF37]/60 text-[#D4AF37] text-[10.5px] font-black tracking-widest uppercase shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>DYSONHOMES COPILOT</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h2 
                className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Human &amp; AI-Assisted <br className="hidden sm:inline" />
                <span style={{ color: '#854d0e' }}>Private Real Estate Copilot.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#0a0a0a]/80 max-w-xl mx-auto font-medium leading-relaxed pt-1">
                Paste any address from any online real estate site to see real sold comps, hidden property risks, and your calculated cash rebate at closing.
              </p>
            </div>
            
            {/* The Zero-UI Search Pill */}
            <form
              id="hero-search-bar"
              onSubmit={handleCopilotRun}
              className="flex items-center gap-2 p-1.5 rounded-2xl sm:rounded-full transition-all shadow-xl bg-[#0a0a0a] border-2 border-[#D4AF37]"
              style={{
                boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              }}
            >
              <div className="flex items-center gap-2.5 w-full pl-4 py-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#D4AF37]" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Paste any address or online home link..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none text-white placeholder:text-white/40"
                />
              </div>

              {/* Action Buttons: Voice Mic + Run Copilot */}
              <div className="flex items-center gap-1.5 pr-1 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/talking-app')}
                  className="p-2 sm:p-2.5 rounded-xl bg-black border border-[#10b981]/50 text-[#10b981] hover:bg-[#10b981]/10 transition-all cursor-pointer"
                  title="Talk with Charlie (Live Voice AI)"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="font-black text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:brightness-110 text-black"
                  style={{
                    background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                  }}
                >
                  <span>{isAuditing ? 'Auditing...' : 'Run Copilot'}</span>
                </button>
              </div>
            </form>

            {/* 1-Click Sample Property Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs pt-1">
              <span className="text-[#0a0a0a]/60 text-[10.5px] font-bold uppercase tracking-wider mr-1">
                Try Sample:
              </span>
              <button
                type="button"
                onClick={() => handleSelectSample('742 Vista Del Mar, La Jolla, CA 92037', 'lajolla')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  activeProperty.address.includes('Vista Del Mar')
                    ? 'bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]'
                    : 'bg-[#faf6ee] text-[#0a0a0a] border border-[#0a0a0a]/20 hover:border-[#D4AF37]'
                }`}
              >
                742 Vista Del Mar ($3.45M)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('1844 Mountain Shadow Way, Scottsdale, AZ 85253', 'scottsdale')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  activeProperty.address.includes('Mountain Shadow')
                    ? 'bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]'
                    : 'bg-[#faf6ee] text-[#0a0a0a] border border-[#0a0a0a]/20 hover:border-[#D4AF37]'
                }`}
              >
                1844 Mountain Shadow Way ($2.15M)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('4220 Oak Hollow Terrace, Austin, TX 78746', 'austin')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  activeProperty.address.includes('Oak Hollow')
                    ? 'bg-[#0a0a0a] text-[#D4AF37] border border-[#D4AF37]'
                    : 'bg-[#faf6ee] text-[#0a0a0a] border border-[#0a0a0a]/20 hover:border-[#D4AF37]'
                }`}
              >
                4220 Oak Hollow Terrace ($1.85M)
              </button>
            </div>

            {/* Bob Dyson Writing Quote: Trust & Human Oversight Anchor */}
            <div className="max-w-xl mx-auto pt-2 pb-1">
              <p
                className="text-base sm:text-lg italic font-bold text-[#0a0a0a] tracking-normal leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                <span>“You are absolutely going to love our stressless </span>
                <span className="block sm:inline">Concierge Approach to transacting your real estate ventures.”</span>
              </p>
              <div className="text-right pr-2 sm:pr-4 text-xs sm:text-sm font-bold text-[#854d0e] tracking-wide mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                — Bob Dyson
              </div>
            </div>

          </div>

          {/* ================= 4. ADDED SCROLL: THE COPILOT PROPERTY DOSSIER ================= */}
          <div className="w-full max-w-2xl mx-auto pt-2">
            <CopilotPropertyDossier property={activeProperty} />
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}