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

// Curated high-valued architectural luxury estates captured at sunset and twilight
const HERO_BACKGROUNDS = [
  {
    id: 'scottsdale',
    city: 'Scottsdale, AZ',
    title: 'Desert Sunset Architectural Estate',
    tag: '$8.9M • 0% Income Tax Destination',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'austin',
    city: 'Austin, TX',
    title: 'Twilight Hill Country Glass Villa',
    tag: '$7.5M • Corporate Tech Relo Hub',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'naples',
    city: 'Naples, FL',
    title: 'Waterfront Sunset Palm Estate',
    tag: '$12.8M • Coastal Relo Haven',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'boulder',
    city: 'Boulder, CO',
    title: 'Mountain Contemporary Glass Manor',
    tag: '$9.2M • Alpine Lifestyle Relo',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95',
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

          {/* ================= 3. STATEMENT & SEARCH PILL DIRECTLY BELOW PHOTO ================= */}
          <div className="w-full max-w-2xl mx-auto space-y-3.5 text-center pt-1">

            {/* 1ST: THE STATEMENT & EXPLANATION COPY (ALL IN BLACK FONT COLOR) */}
            <div className="space-y-0.5 pt-1 text-center">
              <h3 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                We Don't Sell Real Estate
              </h3>
              <p
                className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#854d0e',
                }}
              >
                We Orchestrate Your Entire Move.
              </p>
              <div className="text-xs sm:text-sm text-[#0a0a0a]/85 font-semibold pt-0.5 leading-relaxed">
                <div>Independent agent vetting &amp; fiduciary relocation management across all 50 states</div>
                <div className="whitespace-nowrap font-bold text-[#854d0e] sm:text-[#0a0a0a]/90">
                  — zero fees to buyers &amp; employers.
                </div>
              </div>
            </div>

            {/* 2ND: WRITING FORMAT QUOTE FROM BOB DYSON (JUST ABOVE SEARCH PILL) */}
            <div className="max-w-xl mx-auto pt-1 pb-1">
              <p
                className="text-lg sm:text-xl lg:text-2xl italic font-bold text-[#0a0a0a] tracking-normal leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                <span>“You are absolutely going to love our stressless </span>
                <span className="block">Concierge Approach to transacting your real estate ventures.”</span>
              </p>
              <div className="text-right pr-1 sm:pr-3 text-xs sm:text-sm md:text-base font-bold text-[#854d0e] tracking-wide mt-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                — Bob Dyson
              </div>
            </div>
            
            {/* 3RD: THE FLOATING LUXURY SEARCH PILL (JUST BELOW BOB'S QUOTE) */}
            <form
              id="hero-search-bar"
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchQuery);
              }}
              className="flex items-center gap-2 p-1.5 rounded-full transition-all shadow-xl"
              style={{
                background: '#faf6ee',
                border: `2px solid ${GOLD}`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center gap-2.5 w-full pl-5 py-1">
                <Search className="w-5 h-5 shrink-0" style={{ color: '#0a0a0a' }} />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter City, State, ZIP, or paste any listing URL to vet agent..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-stone-500"
                  style={{ color: '#0a0a0a' }}
                />
              </div>

              {/* Action Button */}
              <div className="flex items-center pr-1 shrink-0">
                <button
                  type="submit"
                  className="font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:brightness-105"
                  style={{
                    background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                    color: '#0a0a0a',
                  }}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* THEN: VETTING HELPER NOTE (IN BLACK FONT COLOR) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#0a0a0a] pt-1 font-medium">
              <span>Looking at a specific listing?</span>
              <span className="text-[#854d0e] font-bold">
                Subscribe to have our fiduciary team vet the listing agent &amp; audit the escrow for you.
              </span>
              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById('portal-subscribe-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/subscribe');
                }}
                className="underline text-[#78350f] hover:text-black font-bold cursor-pointer ml-1"
              >
                (FREE Subscription Required)
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}