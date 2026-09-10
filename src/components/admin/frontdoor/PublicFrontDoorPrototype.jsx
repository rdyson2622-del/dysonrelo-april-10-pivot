import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import LabListingCard from './LabListingCard';
import PartnerPortalGateways from './PartnerPortalGateways';
import RoleSubscriptionDeck from './RoleSubscriptionDeck';
import StudioAmbiencePlayer from '@/components/charlie/StudioAmbiencePlayer';
import LuxuryHeroShowcase from './LuxuryHeroShowcase';
import ExploreDestinationsStrip from './ExploreDestinationsStrip';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const INTEL_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/67bc7aa5a_generated_image.png';

export default function PublicFrontDoorPrototype({
  deviceView,
  showAnnotations,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchEngine,
  setSearchEngine,
  handleAskCharlie,
  currentUser,
  flashNotice,
  userPortalDest,
  userRoleLabel,
  isSubscribed,
  selectedRoleForSubscription,
  setSelectedRoleForSubscription,
  mockListings = [],
}) {
  const navigate = useNavigate();

  return (
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

      {/* LAB SUB-NAVIGATION */}
      <div className="px-3 sm:px-5 py-2.5 bg-[#0e0e0e] border-b border-[#D4AF37]/50 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black shadow-sm">
            LAB ARTIFACT REVIEW
          </span>
          <span className="text-white/80 font-medium">
            Active View: <strong className="text-white">Public Front Door Prototype</strong>
          </span>
        </div>
      </div>

      {/* TOP BAR: TAN BACKDROP WITH DYSONRELO PILL CENTERED OVER THE LEFT SIDEBAR */}
      <nav
        className="py-1 sm:py-1.5 flex items-center justify-between gap-2 relative shadow-sm"
        style={{ background: TAN_BG, borderBottom: `1.5px solid ${GOLD}` }}
      >
        {/* BRAND STATEMENT: DYSONRELO PILL IN SOLID BLACK CENTERED OVER LEFT SIDEBAR */}
        <div className="w-auto lg:w-[275px] xl:w-[295px] pl-3 sm:pl-4 lg:pl-0 flex items-center justify-start lg:justify-center shrink-0">
          <div 
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-2xl shadow-sm border shrink-0 cursor-pointer hover:border-[#D4AF37] transition-all"
            onClick={() => navigate('/portal')}
            title="DysonRelo.com - Nationwide Relocation Concierge"
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
            {mockListings.slice(0, 4).map((listing) => (
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
  );
}