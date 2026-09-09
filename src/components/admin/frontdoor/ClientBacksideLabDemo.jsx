import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, BookOpen, Phone, MessageCircle, 
  X, ChevronRight, Sparkles, ShieldCheck, 
  Home, MapPin, FileText, ArrowRight, CheckCircle2,
  Building, Compass, ExternalLink, Play
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ClientBottomCardsDeck from './ClientBottomCardsDeck';
import UnifiedConciergeSearchPill from '@/components/portal/UnifiedConciergeSearchPill';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo() {
  const navigate = useNavigate();
  const [commandText, setCommandText] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap microphone to start live Voice-to-Voice with Charlie');

  // Client Data State
  const [currentUser, setCurrentUser] = useState(null);
  const [clientRecord, setClientRecord] = useState(null);
  const [latestNews, setLatestNews] = useState(null);

  useEffect(() => {
    let isMounted = true;
    base44.auth.me().then(user => {
      if (user && isMounted) {
        setCurrentUser(user);
      }
    }).catch(() => {});

    base44.entities.RelocationClient.list('-created_date', 1).then(clients => {
      if (clients && clients.length > 0 && isMounted) {
        setClientRecord(clients[0]);
      }
    }).catch(() => {});

    base44.entities.DnnArticle.filter({ status: 'published' }, '-published_date', 1).then(articles => {
      if (articles && articles.length > 0 && isMounted) {
        setLatestNews(articles[0]);
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Client display metadata
  const displayName = clientRecord?.full_name || currentUser?.full_name || 'Kayden Sterling';
  const firstName = displayName.split(' ')[0] || 'Kayden';
  const photoUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const originAddress = clientRecord?.current_address || '14820 Blossom Hill Rd, Los Gatos, CA';
  const originCity = clientRecord?.current_city || 'Los Gatos, CA';
  const destinationCity = clientRecord?.destination_city ? clientRecord.destination_city.replace(/,\s*[A-Z]{2}$/i, '') : 'Scottsdale';
  const destinationState = clientRecord?.destination_state || 'AZ';

  // Canonical 16:9 DNN Studio news placeholder (Charlie at desk + DNN center screen + Bob Dyson standing)
  const DNN_STUDIO_SET_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/cd821f5a9_Screenshot2026-09-09at110438AM.png';
  const newsHeadline = latestNews?.headline || 'Seattle Office Market Stabilizes as AI Firms Drive New Leasing Demand';

  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceStatus('Charlie is listening (Live V2V)... "Hello! How can I help with your move today?"');
    } else {
      setIsVoiceActive(false);
      setVoiceStatus('Tap microphone to start live Voice-to-Voice with Charlie');
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandText.trim()) return;
    const q = commandText.trim();
    if (q.toLowerCase().includes('roadmap') || q.toLowerCase().includes('move')) {
      navigate('/client-roadmap');
    } else if (q.toLowerCase().includes('voice') || q.toLowerCase().includes('charlie')) {
      navigate('/talking-app');
    } else if (q.toLowerCase().includes('solution') || q.toLowerCase().includes('strategy')) {
      navigate(`/solutions?prompt=${encodeURIComponent(q)}&autostart=true`);
    } else {
      const clean = q.replace(/,\s*/g, '_').replace(/\s+/g, '-');
      window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
    }
  };

  // iPhone-style App Symbols Grid (Springboard)
  const APP_SYMBOLS = [
    {
      id: 'relocate',
      label: 'Relocate',
      sub: 'Start / Move',
      badge: 'Active',
      icon: Home,
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/relocation-intake',
    },
    {
      id: 'strategy',
      label: 'Strategy',
      sub: 'Tax & Solutions',
      icon: Sparkles,
      iconColor: '#e8c84a',
      bgGradient: 'from-[#1c1917] via-[#121212] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      path: '/solutions?prompt=Tax%20migration%20and%201031%20exchange%20strategy&autostart=true',
    },
    {
      id: 'vet',
      label: 'Vet Agent',
      sub: 'Search / Refer',
      icon: ShieldCheck,
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      path: '/refer',
    },
    {
      id: 'library',
      label: 'My Library',
      sub: 'Deeds & Files',
      icon: BookOpen,
      iconColor: '#60a5fa',
      bgGradient: 'from-[#1e3a8a]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#60a5fa]/40',
      action: () => setIsLibraryOpen(true),
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      sub: 'Phases & Steps',
      icon: Compass,
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      path: '/client-roadmap',
    },
    {
      id: 'news',
      label: 'DNN News',
      sub: 'Market Pulse',
      badge: '6 AM',
      icon: Play,
      iconColor: '#ef4444',
      bgGradient: 'from-[#7f1d1d]/30 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#ef4444]/40',
      path: '/dnn-news',
    },
    {
      id: 'charlie',
      label: 'Charlie AI',
      sub: 'Live Voice',
      badge: 'Live',
      icon: Mic,
      iconColor: '#10b981',
      bgGradient: 'from-[#064e3b]/40 via-[#121212] to-[#0a0a0a]',
      border: 'border-[#10b981]/60',
      action: () => navigate('/talking-app'),
    },
    {
      id: 'concierge',
      label: 'Fiduciary',
      sub: 'Direct Desk',
      icon: Phone,
      iconColor: '#D4AF37',
      bgGradient: 'from-[#1a1a1a] via-[#111111] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/40',
      action: () => window.open('tel:+18583531200'),
    },
  ];

  return (
    <div className="w-full text-left">
      <div 
        className="w-full rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#0a0a0a]/20 text-[#0a0a0a] space-y-6"
        style={{
          background: TAN_BG,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        {/* ========================================================
            1. LANDSCAPE FIRST: CLIENT PHOTO & INFO ABOVE CONCIERGE CONTENT
            Placed prominently at the very top of the client backside
            ======================================================== */}
        <section className="p-3.5 sm:p-4 rounded-xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img 
                src={photoUrl} 
                alt={displayName} 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[9px] font-black text-black"
                title="Verified Subscriber"
              >
                ✓
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
                  DEMO / LAB
                </span>
                <span className="text-[10px] text-[#10b981] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  Verified Subscriber Account
                </span>
              </div>
              <h1 
                className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-tight mt-0.5"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Welcome back, {displayName}
              </h1>
              <p className="text-xs text-white/70 font-sans mt-0.5">
                Current Residence: <span className="text-[#D4AF37] font-semibold">{originCity}</span>
                <span className="mx-1.5 text-white/30">•</span>
                Relocation Target: <span className="text-[#10b981] font-semibold">{destinationCity}, {destinationState}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <div className="hidden lg:block text-right text-xs pr-2 border-r border-white/15">
              <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Fiduciary Desk</div>
              <div className="font-mono text-white font-bold">(858) 353-1200</div>
            </div>
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              style={{
                background: '#151515',
                color: GOLD,
                border: `1.2px solid ${GOLD}`,
              }}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>My Library</span>
            </button>
          </div>
        </section>

        {/* ========================================================
            2. DYSON RELO CONCIERGE HEADER
            ======================================================== */}
        <div className="space-y-0.5 text-left">
          <h2 
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            DysonRelo Concierge
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#854d0e]">
            Independent Fiduciary Relocation Management
          </p>
        </div>

        {/* ========================================================
            THE ONE UNIFIED SEARCH & ASK PILL (INCLUDES EMBEDDED VOICE AI)
            ======================================================== */}
        <section className="space-y-1">
          <UnifiedConciergeSearchPill 
            placeholder={`Hi ${firstName.toUpperCase()}... What can we do next for you?`}
            showVoiceToggle={true}
            showSuggestions={false}
          />
        </section>

        {/* ========================================================
            2. MIDDLE SECTION: 7 SHORTENED TOOLS (LEFT) + WIDESCREEN HORIZONTAL DNN NEWS BOX (RIGHT)
            ======================================================== */}
        <section className="pt-1 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* LEFT COLUMN: IPHONE / ANDROID STYLE APP SYMBOLS (SPRINGBOARD) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#0a0a0a]/20 mb-3">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#854d0e]">
                    CONCIERGE WORKSPACE APPS
                  </h3>
                  <span className="text-[10px] text-[#44382c] font-medium">
                    Tap to Launch
                  </span>
                </div>

                {/* 4-COLUMN PHONE APP SPRINGBOARD GRID */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4 py-1">
                  {APP_SYMBOLS.map((app) => {
                    const Icon = app.icon;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => {
                          if (app.action) app.action();
                          else if (app.path) navigate(app.path);
                        }}
                        className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                      >
                        {/* Squircle App Icon Container */}
                        <div 
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${app.bgGradient} border ${app.border} shadow-md group-hover:shadow-xl group-hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
                        >
                          {/* Glossy highlight */}
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />

                          {/* Optional Status Badge */}
                          {app.badge && (
                            <span 
                              className={`absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider border leading-none shadow-sm ${
                                app.badge === 'Live' 
                                  ? 'bg-[#10b981] text-black border-black animate-pulse'
                                  : app.badge === '6 AM'
                                  ? 'bg-[#ef4444] text-white border-white/20'
                                  : 'bg-[#D4AF37] text-black border-black/40'
                              }`}
                            >
                              {app.badge}
                            </span>
                          )}

                          <Icon 
                            className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110" 
                            style={{ color: app.iconColor }} 
                          />
                        </div>

                        {/* App Label */}
                        <span className="mt-1.5 text-xs font-bold text-[#0a0a0a] group-hover:text-[#854d0e] transition-colors leading-tight truncate max-w-[80px]">
                          {app.label}
                        </span>
                        {/* Secondary micro-label */}
                        <span className="text-[9px] text-[#554433] leading-none mt-0.5 hidden sm:block truncate max-w-[84px]">
                          {app.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Desk Hotline */}
              <div className="p-2.5 rounded-xl bg-black/5 border border-black/10 text-[11px] text-[#554433] flex items-center justify-between">
                <span>Direct Fiduciary Desk:</span>
                <div className="flex items-center gap-2">
                  <a href="tel:+18583531200" className="font-mono font-bold text-[#0a0a0a] hover:text-[#854d0e]">
                    (858) 353-1200
                  </a>
                  <span className="text-black/30">|</span>
                  <a href="sms:+18583531200" className="text-[10px] uppercase font-bold text-[#854d0e] hover:underline">
                    Text Concierge
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: WIDESCREEN HORIZONTAL DNN STUDIO BOX (20% REDUCED FOOTPRINT) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div 
                onClick={() => {
                  if (latestNews?.id) navigate(`/dnn-news?articleId=${latestNews.id}`);
                  else navigate('/dnn-news');
                }}
                className="w-full rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/60 shadow-xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-[#D4AF37] hover:shadow-2xl transition-all"
                title="Click to view Today's Daily News"
              >
                <div>
                  {/* WIDESCREEN 16:9 STUDIO BACKDROP: CHARLIE AT DESK + DNN SCREEN + BOB DYSON */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img 
                      src={DNN_STUDIO_SET_URL} 
                      alt="DNN News Network Studio"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
                    
                    {/* Broadcast Live Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/85 text-[#D4AF37] border border-[#D4AF37]/60 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                      <span>DNN 6AM DAILY BROADCAST</span>
                    </div>

                    <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black">
                      Daily News
                    </span>

                    {/* Headline and Topic Banner */}
                    <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                      <div className="text-[10px] text-[#fce38a] font-bold uppercase tracking-wider">
                        Today's Market Pulse &amp; Rates
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                        {newsHeadline}
                      </div>
                    </div>
                  </div>

                  {/* Content below the 16:9 broadcast photo */}
                  <div className="p-3.5 sm:p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>Anchor: Charlie &amp; Bob Dyson</span>
                      <span className="text-[#10b981] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Updated 6:00 AM
                      </span>
                    </div>
                    <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                      Daily AI &amp; expert fiduciary relocation intelligence covering tax migration data, interest rate adjustments, and local market effects across all 50 states.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (latestNews?.id) navigate(`/dnn-news?articleId=${latestNews.id}`);
                      else navigate('/dnn-news');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-2 cursor-pointer shadow hover:brightness-110 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Click Thru to Daily News</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            3. AT THE BOTTOM: CLIENT BOTTOM CARDS DECK
            IN PORTRAIT: POSTED ONE AT A TIME FULL SCREEN / FULL WIDTH
            IN LANDSCAPE DESKTOP: 3 IN A ROW
            ======================================================== */}
        <ClientBottomCardsDeck 
          originAddress={originAddress}
          destinationCity={destinationCity}
          destinationState={destinationState}
          onOpenLibrary={() => setIsLibraryOpen(true)}
        />

        {/* ========================================================
            FOOTER
            ======================================================== */}
        <footer className="pt-3 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#44382c]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Independent Fiduciary Representation across all 50 States</span>
          </div>
          <div className="font-mono text-[#0a0a0a] text-[11px]">
            The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118
          </div>
        </footer>

      </div>

      {/* ========================================================
          MY LIBRARY ARCHIVE MODAL (STORED DATA LIVES BEHIND HERE)
          ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg rounded-2xl p-6 border space-y-4 shadow-2xl text-left bg-[#0a0a0a] border-[#D4AF37] text-white relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h2 className="text-base font-bold text-white">Stored Data &amp; Archives (DEMO / LAB)</h2>
                  <p className="text-xs text-white/50">{displayName} · Secure Library</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1c1c1c] text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <div className="font-bold text-[#D4AF37]">Properties &amp; Ownership Files</div>
                <p className="text-white/60 text-[11px]">Deeds, title reports, property surveys, and 1031 exchange filings for {originAddress}.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <div className="font-bold text-[#D4AF37]">Fiduciary Agreements &amp; Disclosure</div>
                <p className="text-white/60 text-[11px]">Signed master engagement agreement, confidentiality agreement, and zero-fee disclosure.</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <div className="font-bold text-[#D4AF37]">Charlie AI Sessions &amp; Call Logs</div>
                <p className="text-white/60 text-[11px]">Spoken audio logs, transcripts, and vetted agent comparison reports.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-black cursor-pointer shadow hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Close Library Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}