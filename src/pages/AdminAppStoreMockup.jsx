import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, Mic, Home, Building, Users, Play, ShieldCheck, 
  BookOpen, Phone, MessageSquare, ArrowRight, CheckCircle2, 
  Search, SlidersHorizontal, ExternalLink, Smartphone, 
  Layout, Eye, Copy, Check
} from 'lucide-react';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

// The complete catalog of platform apps, Apple-style icons, and plain-English purposes
export const PLATFORM_APP_CATALOG = [
  {
    id: 'charlie_voice',
    title: 'Talk with Charlie AI',
    shortLabel: 'Charlie AI',
    badge: 'VOICE AI',
    badgeColor: 'bg-black text-[#10b981] border border-[#10b981]/50',
    icon: Mic,
    iconColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#0d281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
    tagline: 'Real-time 2-way conversational voice concierge',
    purpose: 'Spoken Voice-to-Voice AI assistant powered by Gemini Live. Relocating clients, agents, and HR directors can tap to speak, ask questions about schools, taxes, and destination markets, compare vetted agents, and navigate the platform completely hands-free.',
    targetAudience: 'All portal visitors & subscribers',
    route: '/talking-app',
  },
  {
    id: 'family_relo',
    title: 'Relocating Families & Buyers',
    shortLabel: 'Family Relo',
    badge: 'FREE',
    badgeColor: 'bg-black text-[#10b981] border border-[#10b981]/40',
    icon: Home,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#2e2617] via-[#17140f] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
    tagline: 'Independent agent vetting & fiduciary move management',
    purpose: 'Complete consumer intake and relocation roadmapping. Vets the top 1% of independent agents in destination markets with zero fees to the buyer. Coordinates tax comparisons, school district mapping, and buyer protection.',
    targetAudience: 'Out-of-state buyers & families moving nationwide',
    route: '/relocation-intake',
  },
  {
    id: 'corporate_hr',
    title: 'Corporate HR & Employers',
    shortLabel: 'Corporate HR',
    badge: 'ZERO FEE',
    badgeColor: 'bg-black text-[#e8c84a] border border-[#e8c84a]/40',
    icon: Building,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#332a18] via-[#1a160d] to-[#0a0a0a]',
    border: 'border-[#e8c84a]/60',
    tagline: 'Executive relocation & employee move packages',
    purpose: 'Corporate mobility suite for HR leaders and talent executives. Provides company-sponsored relocation benefits, executive home search orchestration, and milestone tracking without charging the employer or employee.',
    targetAudience: 'HR Managers, Talent Directors, Corporate Relocation Teams',
    route: '/corporate-relo',
  },
  {
    id: 'agent_network',
    title: 'Agents & Brokerages',
    shortLabel: 'Agent Network',
    badge: '25% REFERRAL',
    badgeColor: 'bg-[#1d4ed8] text-white',
    icon: Users,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#172554] via-[#0f172a] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/60',
    tagline: 'PRN Receiving Agent Bureau & Escrow Audits',
    purpose: 'The Private Referral Network (PRN) connects top-producing agents nationwide. Manages incoming client handoffs, audits escrow documentation, verifies compliance, and ensures clean 25% referral fee distribution.',
    targetAudience: 'Licensed Real Estate Agents, Brokers, and Teams',
    route: '/broker-portal',
  },
  {
    id: 'refer_lead',
    title: 'Refer a Client or Colleague',
    shortLabel: 'Refer Lead',
    badge: '25% PAYOUT',
    badgeColor: 'bg-black text-[#D4AF37] border border-[#D4AF37]',
    icon: ArrowRight,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#2b2210] via-[#17130b] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/60',
    tagline: 'Submit buyer, seller, agent or vendor referrals',
    purpose: 'Universal referral entry pill. Anyone can submit a relocating buyer, home seller, vendor partner, or real estate agent into the network. Automatically logs referral fee agreements and provides real-time transaction updates.',
    targetAudience: 'Past clients, referral agents, vendors, and partners',
    route: '/refer',
  },
  {
    id: 'dnn_news',
    title: '6AM DNN News Broadcast',
    shortLabel: 'DNN News',
    badge: 'DAILY',
    badgeColor: 'bg-[#dc2626] text-white',
    icon: Play,
    iconColor: '#ef4444',
    bgGradient: 'from-[#450a0a] via-[#1f0a0a] to-[#0a0a0a]',
    border: 'border-[#ef4444]/60',
    tagline: 'AI Charlie & Bob Dyson Daily Housing Pulse',
    purpose: 'Televised morning studio news broadcast airing at 6:00 AM daily. Breaks down mortgage rate trends, Federal Reserve decisions, housing inventory, and national relocation migration data with anchor commentary.',
    targetAudience: 'Relocating subscribers, agents, and real estate consumers',
    route: '/dnn-news',
  },
  {
    id: 'transparency',
    title: 'The Concierge Advantage',
    shortLabel: 'Transparency',
    badge: 'FIDUCIARY',
    badgeColor: 'bg-[#047857] text-white',
    icon: ShieldCheck,
    iconColor: '#34d399',
    bgGradient: 'from-[#064e3b] via-[#0d281e] to-[#0a0a0a]',
    border: 'border-[#10b981]/60',
    tagline: 'Independent Vetting vs Lead Portals',
    purpose: 'Explains the fiduciary difference. Details how DysonRelo operates as an independent concierge protecting buyers, contrasting with traditional portals (Zillow, Realtor.com) that auction buyer leads to the highest bidder.',
    targetAudience: 'Consumers seeking conflict-free representation',
    route: '/transparency',
  },
  {
    id: 'my_library',
    title: 'My Library & File Vault',
    shortLabel: 'My Library',
    badge: 'VAULT',
    badgeColor: 'bg-[#1e3a8a] text-[#93c5fd]',
    icon: BookOpen,
    iconColor: '#60a5fa',
    bgGradient: 'from-[#1e3a8a] via-[#0f172a] to-[#0a0a0a]',
    border: 'border-[#3b82f6]/60',
    tagline: 'Deeds, 1031 Exchange filings & agreements',
    purpose: 'Personal secure cloud storage vault for registered subscribers. Stores grant deeds, preliminary title audits, fiduciary representation agreements, and recorded Charlie AI voice debriefs in one click.',
    targetAudience: 'Active moving families & subscribed agents',
    route: '/admin/front-door-lab?view=client_backside',
  },
  {
    id: 'strategy_solutions',
    title: 'Tax & Strategy Solutions Map',
    shortLabel: 'Strategy',
    badge: 'AI PLAN',
    badgeColor: 'bg-black text-[#D4AF37] border border-[#D4AF37]/50',
    icon: Sparkles,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#332a18] via-[#1a160d] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/50',
    tagline: 'Custom tax savings & relocation battleplans',
    purpose: 'Generates instant, customized move roadmaps covering state income tax differences (e.g., California 13.3% vs Texas 0%), capital gains mitigation, 1031 exchange timing, and escrow milestone sequencing.',
    targetAudience: 'High-net-worth movers & real estate investors',
    route: '/solutions',
  },
  {
    id: 'concierge_direct',
    title: 'Concierge Direct Line',
    shortLabel: 'Concierge',
    badge: 'DIRECT',
    badgeColor: 'bg-black text-[#D4AF37] border border-[#D4AF37]/60',
    icon: Phone,
    iconColor: '#D4AF37',
    bgGradient: 'from-[#221c12] via-[#11100e] to-[#0a0a0a]',
    border: 'border-[#D4AF37]/50',
    tagline: 'Direct Cellular Line: (858) 353-1200',
    purpose: 'Immediate cellular phone and 2-way SMS access to Bob Dyson and the California corporate concierge desk. No call centers or automated phone trees — direct human fiduciary consultation.',
    targetAudience: 'Urgent transactions, escalations & client questions',
    action: 'tel:+18583531200',
  },
];

export default function AdminAppStoreMockup() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('full_mockup'); // 'full_mockup' | 'app_store_catalog' | 'pills_inspector'
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white p-3 sm:p-6 md:p-8 space-y-6">
      
      {/* ========================================================
          ADMIN TOP BAR & VIEW TOGGLE
          ======================================================== */}
      <header className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/50 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black shadow-sm">
              ADMIN LAB MOCKUP
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              Apple-Style Pills &amp; App Store Catalog
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Clean standalone workbench stored in Admin for review and design reference.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('full_mockup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'full_mockup'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Complete Page + Sidebar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('app_store_catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'app_store_catalog'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Store &amp; Purposes Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pills_inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pills_inspector'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pill Styles Inspector</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          TAB 1: COMPLETE MOCKUP (PAGE + APPLE-STYLE SIDEBAR PILLS)
          Re-creates the exact look from the user's screenshot!
          ======================================================== */}
      {activeTab === 'full_mockup' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-white/70 px-1">
            <span>
              Mockup preview matching the screenshot layout with <strong>Apple-style sidebar pills</strong>:
            </span>
            <span className="text-[#D4AF37] font-semibold">
              Tan Backdrop (#ede0cc) • Left Black Sidebar • Apple Squircle Pills
            </span>
          </div>

          <div 
            className="w-full max-w-6xl mx-auto rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden"
            style={{ background: TAN_BG }}
          >
            {/* TOP BAR FROM SCREENSHOT */}
            <nav 
              className="px-4 py-2.5 flex items-center justify-between gap-3 shadow-md border-b"
              style={{ background: TAN_BG, borderColor: `${GOLD}70` }}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#0a0a0a] text-white border border-[#D4AF37] shadow-sm flex items-center gap-1"
                >
                  <span className="text-sm">≡</span>
                  <span>MENU</span>
                </button>

                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-black border border-[#D4AF37]/70 shadow-sm"
                >
                  <img src={DYSON_LOGO} alt="Dyson" className="h-5 w-auto object-contain" />
                  <div className="leading-tight text-left">
                    <span 
                      className="text-xs sm:text-sm font-bold text-white tracking-wide block"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      DysonRelo.com
                    </span>
                    <span className="text-[7.5px] text-[#D4AF37] uppercase font-bold tracking-wider block">
                      NATIONWIDE RELOCATION CONCIERGE
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <div className="hidden md:flex items-center gap-5 text-xs font-bold text-[#0a0a0a]">
                <Link to="/corporate-relo" className="hover:text-[#b8920a]">Corp Relocation</Link>
                <Link to="/partner-benefits" className="hover:text-[#b8920a]">Agent Network</Link>
                <Link to="/transparency" className="hover:text-[#b8920a]">Transparency</Link>
                <Link to="/dnn-news" className="hover:text-[#b8920a]">DNN Real Estate News</Link>
              </div>

              {/* Right buttons */}
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#141414] text-white border border-white/20 shadow-sm"
                >
                  ♫ Concierge Lounge
                </button>
                <button 
                  type="button"
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#0a0a0a] text-white border border-[#D4AF37] shadow-sm"
                >
                  ● Visitor View
                </button>
              </div>
            </nav>

            {/* MAIN 2-COLUMN SECTION: SIDEBAR + HERO */}
            <div className="flex flex-col lg:flex-row w-full min-h-[640px]">
              
              {/* ========================================================
                  LEFT SIDEBAR WITH APPLE-STYLE PILLS
                  ======================================================== */}
              <aside 
                className="w-full lg:w-[320px] shrink-0 p-3 sm:p-3.5 flex flex-col justify-between text-left border-r border-[#D4AF37]/40 shadow-xl space-y-3"
                style={{ background: '#0a0a0a' }}
              >
                <div className="space-y-3">
                  {/* 55+ YEARS PILL */}
                  <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full border border-[#D4AF37]/60 bg-black text-[9.5px] font-black tracking-widest text-[#D4AF37] uppercase shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span>55+ YEARS • NATIONWIDE CONCIERGE</span>
                  </div>

                  {/* SEARCH DESTINATIONS CARD */}
                  <div 
                    className="p-3 rounded-2xl text-center text-[#0a0a0a] shadow-md border border-[#D4AF37] space-y-1"
                    style={{ background: '#ede0cc' }}
                  >
                    <h2 
                      className="text-base font-bold text-[#0a0a0a] leading-tight"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Search Destinations
                    </h2>
                    <p className="text-xs italic font-serif font-bold text-[#854d0e]">
                      Or Let Us Vet Any Listing For You.
                    </p>
                    <p className="text-[10px] text-[#44382c] leading-tight">
                      Destination market, or paste link from Realtor, Zillow, or Homes.com
                    </p>
                    <button
                      type="button"
                      className="mt-1 px-3 py-1 rounded-full bg-[#0a0a0a] text-white text-[10px] font-bold inline-flex items-center gap-1 shadow"
                    >
                      <Search className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>CLICK TO SEARCH →</span>
                    </button>
                  </div>

                  {/* SIGNED IN STRIP */}
                  <div className="py-1.5 px-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-white/90 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                      <span>Signed In: <strong>Robert Dyson</strong></span>
                    </div>
                    <span className="text-[10px] font-bold text-[#D4AF37]">Workspace →</span>
                  </div>

                  {/* ========================================================
                      INDIVIDUAL APPLE APPS ON SOLID BLACK BACKGROUND
                      (EXACT IPHONE SPRINGBOARD LOOK — NO BEIGE PILLS!)
                      ======================================================== */}
                  <div className="pt-2 text-left">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1 mb-2.5">
                      <span>IPHONE APPS:</span>
                      <span className="text-white/40 normal-case font-normal text-[10px]">tap to launch</span>
                    </div>

                    {/* 3-Column iPhone Springboard Grid directly on black background */}
                    <div className="grid grid-cols-3 gap-y-4 gap-x-2 px-1">
                      {PLATFORM_APP_CATALOG.slice(0, 9).map((app) => {
                        const Icon = app.icon;
                        return (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => navigate(app.route)}
                            className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                          >
                            {/* Standalone Apple Squircle Icon Tile on Black Background */}
                            <div 
                              className={`w-14 h-14 sm:w-15 sm:h-15 rounded-[18px] bg-gradient-to-br ${app.bgGradient} border ${app.border} shadow-lg group-hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
                              style={{
                                boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                              }}
                            >
                              {/* iPhone Glossy Top Sheen */}
                              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                              {/* Notification Pill Badge */}
                              {app.badge && (
                                <span 
                                  className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[7px] font-black uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37] shadow-md"
                                >
                                  {app.badge.split(' ')[0]}
                                </span>
                              )}

                              <Icon 
                                className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110 drop-shadow" 
                                style={{ color: app.iconColor }} 
                              />
                            </div>

                            {/* Clean iPhone App Label directly on Black */}
                            <span className="mt-1.5 text-[11px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors leading-tight text-center max-w-[76px] truncate">
                              {app.shortLabel}
                            </span>
                            {/* Micro Purpose Tag */}
                            <span className="text-[8.5px] text-white/45 leading-none mt-0.5 text-center max-w-[76px] truncate">
                              {app.tagline.split(' ')[0]} {app.tagline.split(' ')[1] || ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* BOTTOM DOCKED: CONCIERGE DIRECT (DARK IPHONE DOCK) */}
                <div 
                  className="p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg border border-[#D4AF37]/40 mt-2"
                  style={{ background: '#141414', color: '#ffffff' }}
                >
                  <div className="min-w-0">
                    <div className="text-[8.5px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      <span>CONCIERGE DIRECT</span>
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-white">
                      (858) 353–1200
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href="tel:+18583531200"
                      className="px-2 py-1 rounded-lg text-[9.5px] font-bold bg-[#0a0a0a] text-white flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#D4AF37]" />
                      <span>Call</span>
                    </a>
                    <a
                      href="sms:+18583531200"
                      className="px-2 py-1 rounded-lg text-[9.5px] font-bold bg-[#0a0a0a] text-white flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-[#10b981]" />
                      <span>Text</span>
                    </a>
                  </div>
                </div>
              </aside>

              {/* ========================================================
                  RIGHT MAIN HERO (FROM SCREENSHOT)
                  ======================================================== */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between" style={{ background: TAN_BG }}>
                {/* Featured Destination Bar */}
                <div className="w-full flex justify-center mb-4">
                  <div 
                    className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-1.5 rounded-full bg-black text-white border border-[#D4AF37]/50 shadow-md max-w-2xl w-full text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
                      <span className="font-semibold truncate">
                        Featured: <strong className="text-white">Scottsdale, AZ</strong> ($8.9M • 0% State Income Tax)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black">Scottsdale</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#181818] text-white/80">Austin</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#181818] text-white/80">Naples</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#181818] text-white/80">Boulder</span>
                    </div>
                  </div>
                </div>

                {/* Hero Villa Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10 max-w-3xl mx-auto w-full aspect-[16/9]">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90"
                    alt="Luxury Estate"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Headline & Bob Quote */}
                <div className="text-center max-w-2xl mx-auto mt-6 space-y-2">
                  <h1 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a0a0a] tracking-tight"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    We Don't Sell Real Estate
                  </h1>
                  <h2 
                    className="text-xl sm:text-2xl font-bold text-[#854d0e]"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    We Orchestrate Your Entire Move.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#44382c] max-w-xl mx-auto leading-relaxed">
                    Independent agent vetting &amp; fiduciary relocation management across all 50 states — zero fees to buyers &amp; employers.
                  </p>

                  <blockquote className="pt-3 border-t border-[#0a0a0a]/15 text-xs sm:text-sm italic font-serif text-[#0a0a0a]">
                    “You are absolutely going to love our stressless Concierge Approach to transacting your real estate ventures.”
                    <footer className="text-[11px] font-sans font-bold text-[#854d0e] not-italic mt-1">
                      — Bob Dyson
                    </footer>
                  </blockquote>
                </div>
              </main>

            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          TAB 2: APP STORE CATALOG & PURPOSES
          Clean, standalone App Store directory of all apps and their purposes!
          ======================================================== */}
      {activeTab === 'app_store_catalog' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-white/70 px-1">
            <span>
              All <strong>10 DysonRelo Platform Apps</strong> with their Apple squircle icons, badges, and plain-English purposes:
            </span>
            <span className="text-[#D4AF37] font-semibold">
              Stored for team reference &amp; feature planning
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORM_APP_CATALOG.map((app, index) => {
              const Icon = app.icon;
              return (
                <div 
                  key={app.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/30 shadow-xl hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Apple Glossy Squircle Icon Tile */}
                    <div 
                      className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden`}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-[20px]" />
                      <Icon className="w-7 h-7 drop-shadow" style={{ color: app.iconColor }} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-white/40">App #{index + 1}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${app.badgeColor}`}>
                          {app.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight mt-0.5 truncate">
                        {app.title}
                      </h3>
                      <p className="text-xs text-[#D4AF37] font-medium leading-tight">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Purpose Box */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                      CORE PURPOSE &amp; VALUE
                    </span>
                    <p className="text-white/80 leading-relaxed text-[11.5px]">
                      {app.purpose}
                    </p>
                  </div>

                  {/* Target & Action Footer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                    <span className="truncate pr-2">
                      Audience: <strong className="text-white/90">{app.targetAudience}</strong>
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(app.purpose, app.id)}
                        className="p-1.5 rounded-lg bg-[#1a1a1a] text-white/80 hover:text-white border border-white/10 cursor-pointer"
                        title="Copy purpose description"
                      >
                        {copiedId === app.id ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {app.route && (
                        <button
                          type="button"
                          onClick={() => navigate(app.route)}
                          className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-bold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-[#e8c84a]"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          TAB 3: PILLS INSPECTOR (ROW PILLS VS SQUIRCLE GRID)
          ======================================================== */}
      {activeTab === 'pills_inspector' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-white/70 px-1">
            <span>
              Comparing <strong>Horizontal Row Pills</strong> vs <strong>Compact 3x3 App Grid</strong>:
            </span>
            <span className="text-[#D4AF37] font-semibold">
              Interactive Component Inspection
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Style A: Horizontal Apple-Style Row Pills (As in Sidebar) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-3 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white">Style A: Horizontal Apple-Style Row Pills</h3>
                  <p className="text-[11px] text-white/50">Used in full desktop/tablet sidebar</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#10b981] text-black">
                  Recommended
                </span>
              </div>

              <div className="space-y-2">
                {PLATFORM_APP_CATALOG.slice(0, 6).map((app) => {
                  const Icon = app.icon;
                  return (
                    <div 
                      key={app.id}
                      className="p-2 sm:p-2.5 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-md border border-black/15 flex items-center justify-between gap-2.5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-9 h-9 rounded-[13px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shrink-0 shadow relative overflow-hidden`}>
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-[13px]" />
                          <Icon className="w-4 h-4 drop-shadow" style={{ color: app.iconColor }} />
                        </div>

                        <div className="min-w-0 leading-tight">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#0a0a0a] truncate">{app.title}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[7.5px] font-black uppercase tracking-wider ${app.badgeColor} shrink-0`}>
                              {app.badge}
                            </span>
                          </div>
                          <p className="text-[9.5px] text-[#554433] truncate mt-0.5">
                            {app.tagline}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Style B: iPhone Springboard 3x3 App Grid */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl space-y-3 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white">Style B: iPhone Springboard Grid</h3>
                  <p className="text-[11px] text-white/50">Used in mobile phone portrait view</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37] text-black">
                  Mobile Grid
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-white/20 shadow-inner">
                <div className="grid grid-cols-3 gap-4">
                  {PLATFORM_APP_CATALOG.slice(0, 6).map((app) => {
                    const Icon = app.icon;
                    return (
                      <div 
                        key={app.id}
                        onClick={() => navigate(app.route)}
                        className="flex flex-col items-center text-center group cursor-pointer"
                      >
                        <div 
                          className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-all relative overflow-hidden`}
                          style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.7)' }}
                        >
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />
                          {app.badge && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[7px] font-black uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37] shadow">
                              {app.badge.split(' ')[0]}
                            </span>
                          )}
                          <Icon className="w-6 h-6 drop-shadow" style={{ color: app.iconColor }} />
                        </div>
                        <span className="mt-1.5 text-[11px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors leading-tight truncate max-w-[85px]">
                          {app.shortLabel}
                        </span>
                        <span className="text-[8.5px] text-white/50 leading-none mt-0.5 truncate max-w-[85px]">
                          {app.tagline.split(' ')[0]} {app.tagline.split(' ')[1] || ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}