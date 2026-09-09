import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, BookOpen, Home, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, Clock, Phone, MessageCircle, X, 
  FileText, Sparkles, Building, Compass, UserCheck, Layers,
  ChevronRight, Wrench, Volume2, MicOff, ExternalLink
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo({ initialClient = null }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [clientRecord, setClientRecord] = useState(initialClient);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isV2VActive, setIsV2VActive] = useState(false);
  const [v2vTranscript, setV2VTranscript] = useState('');

  // Fetch real auth user and matching client data
  useEffect(() => {
    let isMounted = true;
    base44.auth.me().then(async (user) => {
      if (!isMounted) return;
      if (user) {
        setCurrentUser(user);
        try {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (clients && clients.length > 0 && isMounted) {
            setClientRecord(clients[0]);
          } else {
            const anyClients = await base44.entities.RelocationClient.list('-created_date', 1);
            if (anyClients && anyClients.length > 0 && isMounted) {
              setClientRecord(anyClients[0]);
            }
          }
        } catch (_) {}
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Personalized identity data
  const displayName = clientRecord?.full_name || currentUser?.full_name || 'Robert & Eleanor Sterling';
  const firstName = displayName.split(' ')[0] || 'Friend';
  const currentAddress = clientRecord?.current_address || '14820 Blossom Hill Rd, Los Gatos, CA';
  const currentCity = clientRecord?.current_city || 'Los Gatos, CA';
  const destinationCity = clientRecord?.destination_city || 'Scottsdale, AZ';
  const photoUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanLocation = searchQuery.trim().replace(/,\s*/g, '_').replace(/\s+/g, '-');
    window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(cleanLocation)}`, '_blank', 'noopener,noreferrer');
  };

  const handleStartV2V = () => {
    // Navigate directly to the conversational V2V engine
    navigate('/talking-app');
  };

  const handlePresetSearch = (queryText) => {
    setSearchQuery(queryText);
    if (queryText.toLowerCase().includes('roadmap') || queryText.toLowerCase().includes('move')) {
      navigate('/RelocationRoadmap');
    } else if (queryText.toLowerCase().includes('voice') || queryText.toLowerCase().includes('charlie')) {
      navigate('/talking-app');
    } else {
      const clean = queryText.replace(/,\s*/g, '_').replace(/\s+/g, '-');
      window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-3 sm:px-6 text-left">
      
      {/* ========================================================
          CLEAN SHEET ON TAN BACKDROP (#ede0cc)
          Widescreen Landscape Command Deck (Fluidly responsive on mobile)
          ======================================================== */}
      <div 
        className="w-full rounded-3xl p-4 sm:p-7 md:p-8 shadow-2xl border border-[#0a0a0a]/15 text-[#0a0a0a] space-y-6"
        style={{
          background: TAN_BG,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        {/* ========================================================
            1. TOP BAR: IDENTITY & CONTROLS + ONE-CLICK LIBRARY
            ======================================================== */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#0a0a0a]/15">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0a0a0a]">
              DYSON RELOCATION CONCIERGE
            </span>
            <span className="hidden md:inline text-[11px] text-[#854d0e] font-semibold border-l border-[#0a0a0a]/20 pl-2">
              Fiduciary Relocation Management · CA DRE #02303118
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden lg:inline text-[11px] font-bold text-[#854d0e]">Direct Desk:</span>
              <span className="font-mono font-bold text-xs">(858) 353-1200</span>
              <a
                href="tel:+18583531200"
                className="px-2 py-0.5 rounded bg-[#0a0a0a] text-white text-[10px] font-bold hover:brightness-125"
              >
                Call
              </a>
              <a
                href="sms:+18583531200"
                className="px-2 py-0.5 rounded bg-[#0a0a0a] text-white text-[10px] font-bold hover:brightness-125"
              >
                Text
              </a>
            </div>

            {/* ONE-CLICK LIBRARY BUTTON: STORES ALL HISTORICAL DATA, CONTRACTS & BLUEPRINTS */}
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:brightness-110 active:scale-95"
              style={{
                background: '#0a0a0a',
                color: GOLD,
                border: `1.5px solid ${GOLD}`,
              }}
              title="Click to view all stored data, properties, documents and blueprints"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Library</span>
            </button>
          </div>
        </header>

        {/* ========================================================
            2. SUBSCRIBER IDENTITY & PERSONAL HORIZON
            Clear photo, welcome greeting, and live property journey
            ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Identity Card (Left) */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/60 shadow-lg flex items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src={photoUrl} 
                alt={displayName} 
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
              />
              <span 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[10px] font-black text-black"
                title="Verified Fiduciary Client"
              >
                ✓
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-black flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Verified Subscriber</span>
              </div>
              <h1 
                className="text-xl sm:text-2xl font-bold leading-tight text-white truncate"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Welcome back, {firstName}
              </h1>
              <p className="text-xs text-white/70 truncate mt-0.5">
                Account: <strong>{displayName}</strong>
              </p>
              <div className="text-[10px] text-white/50 font-mono mt-0.5">
                Fiduciary Director: <strong>Bob Dyson</strong>
              </div>
            </div>
          </div>

          {/* Active Relocation Route & Property Card (Right) */}
          <div className="lg:col-span-7 p-4 rounded-2xl bg-white/80 border border-[#0a0a0a]/15 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#854d0e] uppercase tracking-wider pb-1 mb-2 border-b border-[#0a0a0a]/10">
              <span>Your Active Relocation Horizon</span>
              <span className="text-[#10b981] flex items-center gap-1 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                In Progress
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[10px] font-bold text-[#854d0e] uppercase block">Current Primary Residence</span>
                <div className="text-sm font-bold text-[#0a0a0a] truncate">{currentAddress}</div>
                <div className="text-[11px] text-[#44382c] font-medium">Silicon Valley · Escrow Open</div>
              </div>

              <div className="sm:border-l sm:border-[#0a0a0a]/15 sm:pl-3">
                <span className="text-[10px] font-bold text-[#854d0e] uppercase block">Target Destination</span>
                <div className="text-sm font-bold text-[#0a0a0a] truncate">{destinationCity}</div>
                <div className="text-[11px] text-[#44382c] font-medium">Luxury Single-Story Search Active</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. THE COMMAND CENTERPIECE: V2V VOICE & REQUEST PILL
            Predominantly positioned as the primary AI communicator
            ======================================================== */}
        <section className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0a0a0a] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#b8920a]" />
              <span>Voice-To-Voice (V2V) &amp; Intelligent Search Pill</span>
            </h2>
            <span className="text-xs text-[#854d0e] font-semibold">
              Speak with Charlie or type to execute any strategy
            </span>
          </div>

          {/* Large Interactive Pill Form */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 p-2 sm:p-2.5 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-2xl text-white transition-all focus-within:ring-2 focus-within:ring-[#D4AF37]"
          >
            <div className="flex items-center gap-3 w-full pl-3 sm:pl-5 py-1">
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Charlie anything, order a strategy, or search properties across the USA..."
                className="w-full bg-transparent text-xs sm:text-sm md:text-base text-white placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* V2V Voice Button (Charlie Tap-To-Talk) */}
            <button
              type="button"
              onClick={handleStartV2V}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#181818] hover:bg-[#252525] border border-[#10b981] text-[#10b981] font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-inner active:scale-95"
              title="Start Voice-To-Voice session with Charlie"
            >
              <Mic className="w-4 h-4 text-[#10b981] animate-pulse" />
              <span className="hidden sm:inline">Talk V2V</span>
            </button>

            {/* Execute Button */}
            <button
              type="submit"
              className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-black transition-all hover:brightness-105 active:scale-95 shrink-0 shadow-lg cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              }}
            >
              Execute
            </button>
          </form>

          {/* Quick Action Suggestion Chips Directly Under The Pill */}
          <div className="flex flex-wrap items-center gap-2 px-2 text-xs font-semibold text-[#0a0a0a]">
            <span className="text-[#854d0e] font-black uppercase text-[10px] tracking-wider">
              Quick Suggestions:
            </span>
            <button
              type="button"
              onClick={() => handlePresetSearch('Continue my move')}
              className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Layers className="w-3 h-3 text-[#D4AF37]" />
              <span>Continue my move (Phase 3)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetSearch('Scottsdale single story luxury homes')}
              className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Search className="w-3 h-3 text-[#38bdf8]" />
              <span>Search Scottsdale Luxury</span>
            </button>
            <button
              type="button"
              onClick={() => handleStartV2V()}
              className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Volume2 className="w-3 h-3 text-[#10b981]" />
              <span>Voice debrief with Charlie</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/refer')}
              className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>Vet a listing link</span>
            </button>
          </div>
        </section>

        {/* ========================================================
            4. THE BIG PICTURE: 3 CLEAN HIGH-IMPACT CARDS
            No long confusing list of words — clean, spacious, visual
            ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* CARD 1: RELOCATION ROADMAP & MILESTONES */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Roadmap Milestones</span>
                </span>
                <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/20 px-2 py-0.5 rounded-full border border-[#10b981]/40">
                  Phase 3 of 7
                </span>
              </div>

              <h3 
                className="text-lg font-bold text-white mt-2 leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Inspection Contingency &amp; Repair Audit
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Dyson fiduciary team is reviewing seller disclosures and repair escrow timeline for your destination purchase.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/RelocationRoadmap')}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                <span>Continue Your Move</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 2: YOUR PROPERTIES & LIVE ESCROW */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  <span>Your Properties</span>
                </span>
                <span className="text-[10px] font-bold text-[#60a5fa] bg-[#60a5fa]/20 px-2 py-0.5 rounded-full border border-[#60a5fa]/40">
                  2 Logged
                </span>
              </div>

              <div className="space-y-2 mt-2">
                <div className="p-2 rounded-lg bg-[#141414] border border-white/10 text-xs">
                  <div className="font-bold text-white truncate">14820 Blossom Hill Rd (Origin)</div>
                  <div className="text-[10px] text-white/50">Purchase Agreement &amp; Title on file</div>
                </div>
                <div className="p-2 rounded-lg bg-[#141414] border border-white/10 text-xs">
                  <div className="font-bold text-white truncate">20844 N 110th Way (Target)</div>
                  <div className="text-[10px] text-[#D4AF37]">Inspection Checklist in review</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="text-xs text-[#D4AF37] underline font-bold hover:text-white cursor-pointer"
              >
                View Documents in Library →
              </button>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="px-3 py-1 rounded bg-[#1e1e1e] border border-white/20 text-xs font-bold text-white hover:border-[#D4AF37] cursor-pointer"
              >
                + Add Home
              </button>
            </div>
          </div>

          {/* CARD 3: FIDUCIARY INTELLIGENCE & V2V ADVISOR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Charlie AI Advisor</span>
                </span>
                <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/20 px-2 py-0.5 rounded-full border border-[#10b981]/40">
                  24/7 Available
                </span>
              </div>

              <h3 
                className="text-lg font-bold text-white mt-2 leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Instant Strategy &amp; Answers
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Ask about Arizona 0% income tax migration, Scottsdale private &amp; charter schools, or have Charlie audit any agent contract.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleStartV2V}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#151515] hover:bg-[#202020] border border-[#10b981] flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Mic className="w-3.5 h-3.5 text-[#10b981] animate-pulse" />
                <span>Open Voice-to-Voice Debrief</span>
              </button>
            </div>
          </div>

        </section>

        {/* ========================================================
            5. FOOTER: TRANSPARENCY & COMPLIANCE
            ======================================================== */}
        <footer className="pt-3 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#44382c]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Fiduciary Representation across all 50 States · Zero buyer or employer fees</span>
          </div>
          <div className="text-[11px] font-mono text-[#0a0a0a]">
            The Dyson &amp; Dyson Companies, Inc.
          </div>
        </footer>

      </div>

      {/* ========================================================
          ONE-CLICK LIBRARY MODAL / SLIDE-OUT
          Holds all stored data so the main page stays clean & uncluttered
          ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl max-h-[90vh] rounded-3xl p-5 sm:p-7 border space-y-4 shadow-2xl text-left flex flex-col relative overflow-hidden"
            style={{
              background: '#0a0a0a',
              borderColor: GOLD,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h2 className="text-lg font-bold text-white">Your Stored Library</h2>
                  <p className="text-xs text-white/60">Central archive for properties, contracts, blueprints &amp; history</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Library Contents */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin text-white">
              
              {/* Stored Properties & Documents */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Stored Properties &amp; Escrow Documents
                </h3>
                <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>14820 Blossom Hill Rd, Los Gatos, CA (Origin)</span>
                    <span className="text-xs text-[#10b981] font-mono">Escrow Open</span>
                  </div>
                  <div className="text-xs text-white/50">4 Beds · 3.5 Baths · 3,850 sq ft</div>
                  <div className="pt-1 flex flex-wrap gap-2 text-xs text-[#D4AF37] underline">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Executed Purchase Agreement.pdf</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Preliminary Title Report.pdf</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Seller Disclosures.pdf</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>20844 N 110th Way, Scottsdale, AZ (Destination Target)</span>
                    <span className="text-xs text-[#D4AF37] font-mono">Contract In Audit</span>
                  </div>
                  <div className="text-xs text-white/50">5 Beds · 6 Baths · 5,600 sq ft</div>
                  <div className="pt-1 flex flex-wrap gap-2 text-xs text-[#D4AF37] underline">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Inspection Contingency Checklist.pdf</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Silverleaf HOA Bylaws.pdf</span>
                  </div>
                </div>
              </div>

              {/* Blueprints & Intelligence Reports */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Relocation Blueprints &amp; Strategy Reports
                </h3>
                {[
                  { title: 'Scottsdale Unified vs Basis Charter Schools Comparison', date: 'May 18, 2026', type: 'Intelligence' },
                  { title: 'California to Arizona 1031 Exchange & Tax Shield', date: 'May 12, 2026', type: 'Tax Advisory' },
                  { title: 'Listing Agent Vetting Scorecard · Sarah Lin', date: 'April 29, 2026', type: 'Fiduciary Audit' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{doc.title}</div>
                      <div className="text-xs text-white/50">{doc.date} · {doc.type}</div>
                    </div>
                    <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  </div>
                ))}
              </div>

              {/* Direct Shortcuts */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Quick Access Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/dnn-news');
                    }}
                    className="p-2.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left"
                  >
                    <div className="font-bold text-white text-xs">6AM DNN News</div>
                    <div className="text-[10px] text-white/50">Daily Video Brief</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/solutions');
                    }}
                    className="p-2.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left"
                  >
                    <div className="font-bold text-white text-xs">Solutions Map</div>
                    <div className="text-[10px] text-white/50">Strategy Blueprints</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/refer');
                    }}
                    className="p-2.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left"
                  >
                    <div className="font-bold text-white text-xs">Vet a Listing</div>
                    <div className="text-[10px] text-white/50">Fiduciary Review</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <span>All Stored Data Secured Under Client Fiduciary Privilege</span>
              <span>The Dyson &amp; Dyson Companies</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}