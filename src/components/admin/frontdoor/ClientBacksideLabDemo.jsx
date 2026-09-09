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

  // Canonical 16:9 DNN Studio broadcast set (Charlie at desk + DNN center screen + Bob Dyson standing)
  const DNN_STUDIO_SET_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
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

  // 7 Core Actions: Shortened & concise per user direction (no bloated descriptions)
  const TEXT_ACTIONS = [
    {
      id: 'request',
      number: '1',
      title: 'Start / update relocation request',
      path: '/relocation-intake',
    },
    {
      id: 'strategy',
      number: '2',
      title: 'Ask for a strategy or solution',
      path: '/solutions?prompt=Tax%20migration%20and%201031%20exchange%20strategy&autostart=true',
    },
    {
      id: 'vet',
      number: '3',
      title: 'Search / vet a property or agent',
      path: '/refer',
    },
    {
      id: 'library',
      number: '4',
      title: 'Open My Library',
      action: () => setIsLibraryOpen(true),
    },
    {
      id: 'roadmap',
      number: '5',
      title: 'View / update a Roadmap',
      path: '/client-roadmap',
    },
    {
      id: 'news',
      number: '6',
      title: 'Get news / market effects',
      path: '/dnn-news',
    },
    {
      id: 'concierge',
      number: '7',
      title: 'Contact concierge',
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
            SEARCH PILL (OFF-WHITE BACKGROUND, BLACK TYPE) + TALK TO CHARLIE
            ======================================================== */}
        <section className="space-y-2.5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* SEARCH PILL: OFF-WHITE BACKGROUND (#faf6ee) + BLACK TYPE */}
            <div className="lg:col-span-8">
              <form 
                onSubmit={handleCommandSubmit}
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full border-2 border-[#D4AF37] shadow-lg text-[#0a0a0a] transition-all focus-within:ring-2 focus-within:ring-[#D4AF37]"
                style={{ background: '#faf6ee' }}
              >
                <div className="flex items-center gap-2.5 w-full pl-4 py-1">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a0a0a] shrink-0" />
                  <input
                    type="text"
                    value={commandText}
                    onChange={(e) => setCommandText(e.target.value)}
                    placeholder={`Hi ${firstName.toUpperCase()}... What can we do next for you?`}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#0a0a0a] placeholder:text-stone-500 font-medium focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2 rounded-full text-xs font-bold text-black transition-all hover:brightness-105 active:scale-95 shrink-0 shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)',
                  }}
                >
                  Go
                </button>
              </form>
            </div>

            {/* TALK WITH CHARLIE (VOICE CONCIERGE) */}
            <div className="lg:col-span-4">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-full py-2.5 px-4 rounded-full border-2 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                  isVoiceActive 
                    ? 'bg-[#10b981] border-[#10b981] text-black font-black' 
                    : 'bg-[#0a0a0a] border-[#10b981] text-white hover:bg-[#151515]'
                }`}
              >
                <Mic className={`w-4 h-4 ${isVoiceActive ? 'text-black animate-bounce' : 'text-[#10b981] animate-pulse'}`} />
                <span className="text-xs font-bold">
                  {isVoiceActive ? 'Charlie Live (Tap to End)' : 'Talk with Charlie (Voice Concierge)'}
                </span>
              </button>
            </div>
          </div>

          {/* Voice Feedback / Spoken Line */}
          {isVoiceActive && (
            <div className="p-3 rounded-xl bg-[#0a0a0a] text-white border border-[#10b981] text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping shrink-0" />
                <span className="text-[#10b981] font-semibold italic">{voiceStatus}</span>
              </div>
              <button 
                type="button" 
                onClick={() => navigate('/talking-app')}
                className="text-[11px] text-[#D4AF37] underline font-bold whitespace-nowrap hover:text-white"
              >
                Full Studio Voice →
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            2. MIDDLE SECTION: 7 SHORTENED TOOLS (LEFT) + WIDESCREEN HORIZONTAL DNN NEWS BOX (RIGHT)
            ======================================================== */}
        <section className="pt-1 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* LEFT COLUMN: 7 SHORTENED COMPACT ACTIONS (NO BLOAT, TIGHT HORIZONTAL FOOTPRINT) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-[#0a0a0a]/20 mb-1">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#854d0e]">
                    WHAT DYSONRELO DOES FOR YOU:
                  </h3>
                  <span className="text-[10px] text-[#44382c] font-medium hidden sm:inline">
                    7 Quick Actions
                  </span>
                </div>

                <div className="divide-y divide-[#0a0a0a]/10">
                  {TEXT_ACTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.action) item.action();
                        else if (item.path) navigate(item.path);
                      }}
                      className="w-full py-2 px-1 flex items-center justify-between text-left cursor-pointer transition-all hover:bg-black/5 group rounded-lg"
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#0a0a0a] group-hover:text-[#854d0e] transition-colors flex items-center gap-1.5 truncate pr-2">
                        <span className="text-xs font-mono font-bold text-[#854d0e] shrink-0">{item.number}.</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#854d0e] group-hover:translate-x-1 transition-transform shrink-0">
                        <span>Continue</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/5 border border-black/10 text-[11px] text-[#554433] flex items-center justify-between">
                <span>Direct Fiduciary Desk:</span>
                <a href="tel:+18583531200" className="font-mono font-bold text-[#0a0a0a] hover:text-[#854d0e]">
                  (858) 353-1200
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: WIDESCREEN HORIZONTAL DNN STUDIO BOX */}
            <div className="lg:col-span-7 flex flex-col">
              <div 
                onClick={() => navigate('/dnn-news')}
                className="w-full h-full rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/60 shadow-xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-[#D4AF37] hover:shadow-2xl transition-all"
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
                      navigate('/dnn-news');
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