import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, BookOpen, Phone, MessageCircle, 
  X, ChevronRight, Sparkles, ShieldCheck, 
  Home, MapPin, FileText, ArrowRight, CheckCircle2,
  Building, Compass, ExternalLink
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

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

    return () => { isMounted = false; };
  }, []);

  // Client display metadata
  const displayName = clientRecord?.full_name || currentUser?.full_name || 'Eleanor & Robert Sterling';
  const firstName = displayName.split(' ')[0] || 'Friend';
  const photoUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const originAddress = clientRecord?.current_address || '14820 Blossom Hill Rd, Los Gatos, CA';
  const originCity = clientRecord?.current_city || 'Los Gatos, CA';
  const destinationCity = clientRecord?.destination_city || 'Scottsdale, AZ';
  const destinationState = clientRecord?.destination_state || 'AZ';

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
      navigate('/RelocationRoadmap');
    } else if (q.toLowerCase().includes('voice') || q.toLowerCase().includes('charlie')) {
      navigate('/talking-app');
    } else if (q.toLowerCase().includes('solution') || q.toLowerCase().includes('strategy')) {
      navigate('/solutions');
    } else {
      const clean = q.replace(/,\s*/g, '_').replace(/\s+/g, '-');
      window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
    }
  };

  // 7 Core Actions: Plain clickable text items (NO pill boxes)
  const TEXT_ACTIONS = [
    {
      id: 'request',
      number: '1',
      title: 'Start or update a relocation request',
      desc: 'Set or update destination, budget & home criteria',
      path: '/relocation-intake',
    },
    {
      id: 'strategy',
      number: '2',
      title: 'Ask for a strategy or solution',
      desc: 'Tax migration, 1031 exchange, or custom relocation plan',
      path: '/solutions',
    },
    {
      id: 'vet',
      number: '3',
      title: 'Search/vet a property or agent',
      desc: 'Independent fiduciary audit of any listing link or agent',
      path: '/refer',
    },
    {
      id: 'library',
      number: '4',
      title: 'Open My Library',
      desc: 'All stored contracts, files & history live behind this tap',
      action: () => setIsLibraryOpen(true),
    },
    {
      id: 'roadmap',
      number: '5',
      title: 'View/update a Roadmap',
      desc: 'Step-by-step milestones, deadlines & escrow tracking',
      path: '/RelocationRoadmap',
    },
    {
      id: 'news',
      number: '6',
      title: 'Get news/market effects',
      desc: '6AM daily real estate broadcast & interest rate pulse',
      path: '/dnn-news',
    },
    {
      id: 'concierge',
      number: '7',
      title: 'Contact concierge',
      desc: 'Direct call or text with Bob Dyson fiduciary desk',
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
                    placeholder="Type what you need..."
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
            2. TEXT ONLY ACTIONS (NO BOXES / NO PILLS)
            Clean, elegant text links that take users to the next step when clicked
            ======================================================== */}
        <section className="space-y-2 pt-1 pb-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#0a0a0a]/20">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#854d0e]">
              WHAT DYSONRELO IS BUILT TO DO FOR YOU:
            </h3>
            <span className="text-[10px] text-[#44382c] font-medium hidden sm:inline">
              Click any item to continue
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
                className="w-full py-2.5 px-1 sm:px-2 flex items-center justify-between text-left cursor-pointer transition-all hover:bg-black/5 group rounded-lg"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-sm sm:text-base font-bold text-[#0a0a0a] group-hover:text-[#854d0e] transition-colors flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#854d0e]">{item.number}.</span>
                    <span>{item.title}</span>
                  </div>
                  <div className="text-xs text-[#44382c] pl-5 mt-0.5">
                    {item.desc}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#854d0e] group-hover:translate-x-1 transition-transform shrink-0">
                  <span className="hidden sm:inline text-[11px]">Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================
            3. AT THE BOTTOM ACROSS: 3 BOXES
            ONE FOR PROPERTY/PROPERTIES OWNED & SUPPORTING DATA
            ONE FOR STORED DATA & ARCHIVES
            ONE FOR RELOCATION
            ======================================================== */}
        <section className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* BOX 1: PROPERTIES OWNED & SUPPORTING OWNERSHIP DATA */}
            <div 
              className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                      Properties Owned
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#10b981] font-bold">1 Verified</span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>{originAddress}</span>
                  </div>
                  <div className="text-[11px] text-white/60 pl-4 mt-0.5">
                    Single Family Residence • 4,850 sq ft
                  </div>
                </div>

                <div className="pt-1.5 space-y-1 text-[11px] text-white/75">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Ownership Data:</span>
                    <span className="text-[#10b981] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Title &amp; Deed on File
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Estimated Equity:</span>
                    <span className="text-white font-mono font-semibold">~$2,450,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">1031 Exchange:</span>
                    <span className="text-[#D4AF37] font-semibold">Profile Prepared</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/refer')}
                className="w-full py-2 px-3 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Audit Listing / Vet Sale Agent</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* BOX 2: STORED DATA & ARCHIVES */}
            <div 
              className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                      Stored Data &amp; Archives
                    </h4>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono">My Library</span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  All signed fiduciary agreements, inspection notes, transcripts, and transaction documents are archived here.
                </p>

                <div className="space-y-1 text-[11px] text-white/75 pt-1">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#D4AF37]" />
                    <span className="truncate">Fiduciary Advisory Agreement (Signed)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#D4AF37]" />
                    <span className="truncate">Property Tax &amp; Deed Record Archive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#D4AF37]" />
                    <span className="truncate">Saved MLS Listings &amp; Search Profiles</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer shadow hover:brightness-110 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Stored Archives</span>
              </button>
            </div>

            {/* BOX 3: RELOCATION */}
            <div 
              className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#10b981]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#10b981]">
                      Relocation
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold">
                    Active Roadmap
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Target: {destinationCity}, {destinationState}</span>
                  </div>
                  <div className="text-[11px] text-white/60 mt-0.5">
                    Timeline: Fall Relocation • Stage 2 of 6
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-white/75 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Receiving Agent Vetting:</span>
                    <span className="text-[#10b981] font-semibold">Underway</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Tax Differential:</span>
                    <span className="text-white font-mono font-semibold">CA to AZ (-8.8%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Next Action:</span>
                    <span className="text-[#D4AF37] font-semibold">Review Candidate Vetting</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/RelocationRoadmap')}
                className="w-full py-2 px-3 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#10b981] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span>View Full Roadmap</span>
                <ArrowRight className="w-3 h-3 text-[#10b981]" />
              </button>
            </div>

          </div>
        </section>

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