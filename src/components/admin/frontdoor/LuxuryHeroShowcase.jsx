import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, ShieldCheck, Users, Briefcase, Building, Tv, Compass, Sparkles,
  LogIn, UserPlus, Phone, MessageCircle, Home
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';
import SubscriberCommandCard from './SubscriberCommandCard';

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

  const subscriberName = currentUser?.full_name ? currentUser.full_name.split(' ')[0] : (currentUser?.email?.split('@')[0] || 'Bob');
  const isAdmin = currentUser?.role === 'admin';
  const userRole = currentUser?.portal_role || (isAdmin ? 'admin' : 'client');
  const workspaceDest = isAdmin ? '/admin' : 
                        userRole === 'agent' ? '/agent-command-center' : 
                        userRole === 'hr' ? '/corporate-relo' : 
                        userRole === 'broker' ? '/brokerage' : '/home';
  const workspaceLabel = isAdmin ? 'Open Admin Console' : 
                         userRole === 'agent' ? 'Open Agent Workspace' : 
                         userRole === 'hr' ? 'Open Corporate Suite' : 
                         userRole === 'broker' ? 'Open Brokerage Portal' : 'Continue Your Move';
  const activeProjectLabel = isAdmin ? 'DysonRelo Platform Operations' : 
                            userRole === 'agent' ? '2 Incoming Client Referrals' : 
                            userRole === 'hr' ? '3 Active Employee Relocations' : 'San Jose → Scottsdale, AZ';

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

            {isSubscriberMode ? (
              /* PERSONAL SUBSCRIBER SIDEBAR CONSOLE */
              <div className="w-full space-y-1.5 pt-0.5">
                <div 
                  className="p-2.5 rounded-lg border text-left shadow-md space-y-1.5"
                  style={{
                    background: '#ede0cc',
                    borderColor: `${GOLD}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span 
                      className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-[#0a0a0a] shadow-sm"
                    >
                      {isAdmin ? 'ADMIN CONSOLE' : 'SUBSCRIBER WORKSPACE'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" title="Active File Connected" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0a0a0a] leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {subscriberName}'s Workspace
                    </h3>
                    <p className="text-[10px] text-[#854d0e] font-semibold leading-snug">
                      Active: {activeProjectLabel}
                    </p>
                  </div>

                  {/* One-tap direct access to personal workspace */}
                  <button
                    type="button"
                    onClick={() => navigate(workspaceDest)}
                    className="w-full py-1.5 px-2.5 rounded text-[11px] font-bold text-white bg-[#0a0a0a] hover:bg-[#1a1a1a] flex items-center justify-between shadow transition-all cursor-pointer group"
                  >
                    <span>{workspaceLabel}</span>
                    <ArrowRight className="w-3 h-3 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              /* PUBLIC VISITOR SIDEBAR TOP — REVERSE COLORS (TAN BOX WITH BLACK FONT) */
              <>
                <button
                  type="button"
                  onClick={scrollToSearch}
                  className="w-full p-2 rounded-lg border border-[#D4AF37] hover:brightness-105 transition-all cursor-pointer group shadow-sm text-center"
                  style={{ background: '#ede0cc' }}
                  title="Click to jump directly to Search Destinations"
                >
                  <div className="text-center w-full">
                    <h2
                      className="font-bold leading-tight text-[#0a0a0a] tracking-tight text-sm sm:text-base"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Search Destinations
                    </h2>
                    <p
                      className="font-semibold text-xs text-[#854d0e] leading-tight mt-0.5"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Or Let Us Vet Any Listing For You.
                    </p>
                    <p className="text-[9.5px] text-[#44382c] font-sans font-medium mt-0.5 leading-snug">
                      Destination market, or paste link from Realtor, Zillow, or Homes.com
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase text-white bg-[#0a0a0a] group-hover:bg-[#1c1c1c] transition-all">
                      <Search className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>Click to Search</span>
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* 1. RETURNING SUBSCRIBER QUICK SIGN-IN — REVERSE COLOR TAN BOX */}
                <div className="w-full pt-1 pb-0.5">
                  {!currentUser ? (
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full py-1 px-2 rounded-lg border border-[#D4AF37] transition-all text-left cursor-pointer flex items-center justify-between group shadow-sm"
                      style={{ background: '#ede0cc' }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <LogIn className="w-3 h-3 text-[#0a0a0a] shrink-0" />
                        <span className="text-[10px] font-bold text-[#0a0a0a] truncate">
                          Already Subscribed? <span className="text-[#854d0e] underline underline-offset-2">Sign In</span>
                        </span>
                      </div>
                      <ArrowRight className="w-2.5 h-2.5 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(currentUser.role === 'admin' ? '/admin' : '/home')}
                      className="w-full py-1 px-2 rounded-lg border border-[#10b981] transition-all text-left cursor-pointer flex items-center justify-between group shadow-sm"
                      style={{ background: '#ede0cc' }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
                        <span className="text-[9.5px] font-bold text-[#0a0a0a] truncate">
                          Signed In: <span className="text-[#0a0a0a] font-semibold">{currentUser.full_name || currentUser.email}</span>
                        </span>
                      </div>
                      <span className="text-[8.5px] font-bold text-[#0a0a0a] flex items-center gap-0.5 shrink-0">
                        Workspace <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ORGANIZED CONCIERGE ACTIONS & TO-DO'S — REVERSE COLOR TAN PILLS WITH BLACK TEXT */}
            <div className="space-y-1 pt-1 w-full">
              <div className="text-[8.5px] font-black uppercase tracking-wider text-[#D4AF37] px-0.5 flex items-center justify-between">
                <span>Concierge To-Do's:</span>
                <span className="text-[7.5px] text-white/50 lowercase tracking-normal">select one</span>
              </div>

              {/* TO-DO 1: TALK WITH CHARLIE (AI VOICE CONCIERGE) */}
              <div className="pb-0.5">
                <HeroGeminiConcierge sidebarMode={true} />
              </div>

              {/* TO-DO 2: Families & Buyers — REVERSE COLOR TAN PILL */}
              <button
                type="button"
                onClick={() => navigate('/relocation-intake')}
                className="w-full group p-1.5 sm:p-2 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: '#ede0cc' }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1 mb-0.2">
                    <Users className="w-3 h-3 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10px] font-bold text-[#0a0a0a] truncate">
                      Relocating Families &amp; Buyers
                    </span>
                    <span className="text-[7px] px-1 py-0.2 rounded bg-[#0a0a0a] text-[#10b981] font-bold shrink-0">
                      Free
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate">
                    Agent vetting, tax &amp; school roadmap
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* TO-DO 3: Corporate HR & Employers — REVERSE COLOR TAN PILL */}
              <button
                type="button"
                onClick={() => navigate('/corporate-relo')}
                className="w-full group p-1.5 sm:p-2 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: '#ede0cc' }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1 mb-0.2">
                    <Briefcase className="w-3 h-3 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10px] font-bold text-[#0a0a0a] truncate">
                      Corporate HR &amp; Employers
                    </span>
                    <span className="text-[7px] px-1 py-0.2 rounded bg-[#0a0a0a] text-[#D4AF37] font-bold shrink-0">
                      Zero Fee
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate">
                    Executive move packages &amp; milestones
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* TO-DO 4: Agents & Brokerages — REVERSE COLOR TAN PILL */}
              <button
                type="button"
                onClick={() => navigate('/partner-benefits')}
                className="w-full group p-1.5 sm:p-2 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: '#ede0cc' }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1 mb-0.2">
                    <Building className="w-3 h-3 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10px] font-bold text-[#0a0a0a] truncate">
                      Agents &amp; Brokerages
                    </span>
                    <span className="text-[7px] px-1 py-0.2 rounded bg-[#0a0a0a] text-[#60a5fa] font-bold shrink-0">
                      25% Referral
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate">
                    Receiving agent bureau &amp; escrow audits
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* TO-DO 5: Refer a Client or Colleague — REVERSE COLOR TAN PILL */}
              <button
                type="button"
                onClick={() => navigate('/refer')}
                className="w-full group p-1.5 sm:p-2 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: '#ede0cc' }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1 mb-0.2">
                    <UserPlus className="w-3 h-3 text-[#0a0a0a] shrink-0" />
                    <span className="text-[10px] font-bold text-[#0a0a0a] truncate">
                      Refer a Client or Colleague
                    </span>
                    <span className="text-[7px] px-1 py-0.2 rounded bg-[#0a0a0a] text-[#D4AF37] font-bold shrink-0">
                      25% Payout
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate">
                    Submit buyer, seller, agent or vendor lead
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-[#0a0a0a] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* DIRECT ACCESS: 6AM NEWS DESK & CONCIERGE ADVANTAGE — REVERSE COLOR TAN PILLS */}
            <div className="pt-1 mt-1 border-t border-white/10 space-y-1 w-full">
              <div className="text-[8.5px] font-black uppercase tracking-wider text-[#D4AF37] px-0.5 flex items-center justify-between">
                <span>Detailed Systems:</span>
                <span className="text-[7.5px] text-white/50 lowercase tracking-normal">direct</span>
              </div>

              {/* 1. 6AM NEWS BROADCAST LINK */}
              <button
                type="button"
                onClick={() => navigate('/dnn-news')}
                className="w-full group px-2 py-1 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: '#ede0cc' }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1">
                    <Tv className="w-2.5 h-2.5 text-red-600 shrink-0" />
                    <span className="text-[9.5px] font-bold text-[#0a0a0a] truncate">
                      6AM DNN News Broadcast
                    </span>
                    <span className="text-[6.5px] px-1 py-0.2 rounded bg-[#0a0a0a] text-red-400 font-bold shrink-0">
                      Daily
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-3.5">
                    AI Charlie &amp; Bob • Daily Housing Pulse
                  </p>
                </div>
                <span className="text-[8px] text-[#0a0a0a] underline font-bold whitespace-nowrap shrink-0 flex items-center gap-0.5">
                  <span>Open</span>
                  <ArrowRight className="w-2 h-2" />
                </span>
              </button>

              {/* 2. THE CONCIERGE ADVANTAGE LINK */}
              <button
                type="button"
                onClick={() => navigate('/relocation-intake')}
                className="w-full group px-2 py-1 rounded-lg border border-[#D4AF37]/60 hover:brightness-105 transition-all text-left cursor-pointer flex items-center justify-between shadow-sm"
                style={{ background: '#ede0cc' }}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#10b981] shrink-0" />
                    <span className="text-[9.5px] font-bold text-[#0a0a0a] truncate">
                      The Concierge Advantage
                    </span>
                    <span className="text-[6.5px] px-1 py-0.2 rounded bg-[#0a0a0a] text-[#10b981] font-bold shrink-0">
                      Fiduciary
                    </span>
                  </div>
                  <p className="text-[8.5px] text-[#44382c] leading-tight truncate pl-3.5">
                    Independent Vetting vs Lead Portals
                  </p>
                </div>
                <span className="text-[8px] text-[#0a0a0a] underline font-bold whitespace-nowrap shrink-0 flex items-center gap-0.5">
                  <span>Open</span>
                  <ArrowRight className="w-2 h-2" />
                </span>
              </button>
            </div>
          </div>

          {/* 3. FIDUCIARY DESK DIRECT CONTACT / TEXT LINE — REVERSE COLOR TAN BOX */}
          <div className="pt-1.5 mt-1 border-t border-white/10">
            <div 
              className="p-1.5 rounded-lg border border-[#D4AF37]/60 flex items-center justify-between gap-1.5 shadow-sm"
              style={{ background: '#ede0cc' }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[7.5px] font-black uppercase tracking-wider text-[#854d0e]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Concierge Direct</span>
                </div>
                <div className="text-[10.5px] font-bold text-[#0a0a0a] font-mono leading-tight">
                  (858) 353-1200
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href="tel:+18583531200"
                  className="px-2 py-0.5 rounded bg-[#0a0a0a] hover:bg-[#202020] text-[8.5px] font-bold text-white transition-all flex items-center gap-0.5 cursor-pointer"
                  title="Call Concierge Desk"
                >
                  <Phone className="w-2 h-2 text-[#D4AF37]" />
                  <span>Call</span>
                </a>
                <a
                  href="sms:+18583531200"
                  className="px-2 py-0.5 rounded bg-[#0a0a0a] hover:bg-[#202020] text-[8.5px] font-bold text-white transition-all flex items-center gap-0.5 cursor-pointer"
                  title="Text Concierge Desk"
                >
                  <MessageCircle className="w-2 h-2 text-[#D4AF37]" />
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

          {/* ADMIN TEAM QUICK ENTRY (DEDICATED FOR ADMINS, OUT OF TOP NAV) */}
          {currentUser?.role === 'admin' && (
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
            1. FEATURED DESTINATION BAR (ALL ON ONE LINE)
            2. PURE ARCHITECTURAL HOUSE PHOTO ON TAN BACKDROP
            3. CLEAN LUXURY SEARCH PILL FIRST
            4. COPY & CATEGORY TABS IN BLACK FONT COLOR
            In portrait (< lg), this is order-1 (first right after top bar).
            On desktop (lg+), this sits as the right column (order-2).
            ======================================================== */}
        <div 
          className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col justify-start gap-4 order-1 lg:order-2"
          style={{
            background: isSubscriberMode ? '#0a0a0a' : '#ede0cc',
          }}
        >
          {isSubscriberMode ? (
            <SubscriberCommandCard
              currentUser={currentUser}
              onSearch={onSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSwitchToVisitorView={onToggleSubscriberMode}
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