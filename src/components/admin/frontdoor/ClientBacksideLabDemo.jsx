import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, BookOpen, Home, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle2, Clock, Phone, MessageCircle, X, 
  FileText, Sparkles, Building, Compass, UserCheck, Layers,
  ChevronRight, Wrench, HelpCircle
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
  const [voiceActive, setVoiceActive] = useState(false);

  // Fetch live auth user and matching client data
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

  // Personalized Identity values
  const displayName = clientRecord?.full_name || currentUser?.full_name || 'Robert & Eleanor Sterling';
  const firstName = displayName.split(' ')[0] || 'Friend';
  const primaryProperty = clientRecord?.current_address || '14820 Blossom Hill Rd, Los Gatos, CA';
  const destinationMarket = clientRecord?.destination_city ? `${clientRecord.destination_city}, ${clientRecord.destination_state || 'AZ'}` : 'Scottsdale, AZ';
  const photoUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  // The focused, clean vertical list of what we can do / active projects
  const SERVICES_LIST = [
    {
      id: 'research',
      title: 'Research Properties',
      subtitle: 'Search national MLS or paste any listing URL',
      status: 'Active Search',
      statusColor: '#10b981',
      path: '/search',
      icon: Search,
    },
    {
      id: 'solution',
      title: 'Provide a Strategy & Solution',
      subtitle: 'Custom real estate gameplan & tax-advantage roadmap',
      status: 'Ready',
      statusColor: '#D4AF37',
      path: '/solutions',
      icon: Compass,
    },
    {
      id: 'properties',
      title: 'Store & Manage My Properties',
      subtitle: 'Current residence + target acquisition files',
      status: '2 Properties Logged',
      statusColor: '#60a5fa',
      path: '#properties',
      action: 'open_properties',
      icon: Home,
    },
    {
      id: 'communications',
      title: 'My Communications & History',
      subtitle: 'Transcripts, Charlie Q&A, and direct notes',
      status: 'Up to Date',
      statusColor: '#a78bfa',
      path: '/chat',
      icon: MessageCircle,
    },
    {
      id: 'relocation',
      title: 'Relocation Services & Roadmap',
      subtitle: 'Step-by-step moving timeline & school reports',
      status: 'In Progress · Step 3',
      statusColor: '#D4AF37',
      path: '/RelocationRoadmap',
      icon: Layers,
    },
    {
      id: 'escrow',
      title: 'The Escrow Process & Audit',
      subtitle: 'Fiduciary timeline, contingency releases & deposit check',
      status: 'Pending Review',
      statusColor: '#fb923c',
      path: '/relo-management',
      icon: FileText,
    },
    {
      id: 'vet_agents',
      title: 'Vetting Agents',
      subtitle: 'Independent fiduciary audit of listing or buyer agents',
      status: '1 Agent Vetted',
      statusColor: '#10b981',
      path: '/find-agent',
      icon: UserCheck,
    },
    {
      id: 'vet_vendors',
      title: 'Vetting Vendors & Lenders',
      subtitle: 'Movers, escrow officers, title & competitive rates',
      status: 'Available',
      statusColor: '#94a3b8',
      path: '/financial-services',
      icon: Wrench,
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanLocation = searchQuery.trim().replace(/,\s*/g, '_').replace(/\s+/g, '-');
    window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(cleanLocation)}`, '_blank', 'noopener,noreferrer');
  };

  const handleServiceClick = (item) => {
    if (item.action === 'open_properties') {
      setIsLibraryOpen(true);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4 text-left">
      
      {/* ========================================================
          PORTRAIT-MOBILE-FIRST CHASSIS (~390px) ON CLEAN TAN BACKDROP
          Strictly framed, NO sidebar, ultra-clean, serene & personal.
          ======================================================== */}
      <div 
        className="w-full max-w-[390px] rounded-[36px] p-4 shadow-2xl relative flex flex-col border border-[#0a0a0a]/15 text-[#0a0a0a]"
        style={{
          background: TAN_BG,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        {/* TOP BAR: BRANDING + ONE-CLICK LIBRARY BUTTON */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#0a0a0a]/15">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]">
              DYSON RELOCATION CONCIERGE
            </span>
          </div>

          {/* ONE-CLICK LIBRARY BUTTON: REPLACES CLUTTERED SIDEBAR ENTIRELY */}
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer hover:brightness-110 active:scale-95"
            style={{
              background: '#0a0a0a',
              color: GOLD,
              border: `1px solid ${GOLD}`,
            }}
            title="Click to open your personal stored library"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Library</span>
          </button>
        </div>

        {/* 1. SUBSCRIBER IDENTITY & PICTURE */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-md">
          <div className="relative shrink-0">
            <img 
              src={photoUrl} 
              alt={displayName} 
              className="w-13 h-13 rounded-full object-cover border-2 border-[#D4AF37] shadow"
            />
            <span 
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[8px] font-black text-black"
              title="Verified Client"
            >
              ✓
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-black">
              Verified Subscriber
            </div>
            <h2 
              className="text-lg font-bold leading-tight text-white truncate"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Welcome back, {firstName}
            </h2>
            <div className="text-[10px] text-white/70 truncate flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">{destinationMarket}</span>
            </div>
          </div>
        </div>

        {/* 2. SUBSCRIBER'S CURRENT PROPERTY CARD (IF THEY OWN) */}
        <div className="mt-2.5 p-2.5 rounded-xl bg-white/70 border border-[#0a0a0a]/15 text-[#0a0a0a] shadow-sm">
          <div className="flex items-center justify-between text-[9px] font-bold text-[#854d0e] uppercase tracking-wider mb-0.5">
            <span className="flex items-center gap-1">
              <Home className="w-3 h-3 text-[#0a0a0a]" />
              <span>Current Primary Property</span>
            </span>
            <span className="text-[#10b981]">Active File</span>
          </div>
          <div className="text-xs font-bold truncate text-[#0a0a0a]">
            {primaryProperty}
          </div>
        </div>

        {/* 3. PREDOMINANT SEARCH PILL (THE MAIN COMMUNICATOR) WITH INTEGRATED CHARLIE VOICE */}
        <div className="mt-3.5 space-y-1.5">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#0a0a0a] px-1 flex items-center justify-between">
            <span>Main Communicator</span>
            <span className="text-[8.5px] text-[#854d0e] font-semibold">Type or Tap Charlie to Speak</span>
          </div>

          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-xl text-white"
          >
            <div className="flex items-center gap-2 w-full pl-3 py-1">
              <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Charlie or search anything on your site..."
                className="w-full bg-transparent text-xs text-white placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* Charlie Voice Concierge Button */}
            <button
              type="button"
              onClick={() => navigate('/talking-app')}
              className="p-2 rounded-full bg-[#181818] hover:bg-[#252525] border border-[#D4AF37]/60 text-[#D4AF37] transition-all shrink-0 cursor-pointer"
              title="Talk with Charlie (Voice AI)"
            >
              <Mic className="w-3.5 h-3.5 text-[#10b981]" />
            </button>

            {/* Execute / Explore Button */}
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-black transition-all hover:brightness-105 active:scale-95 shrink-0 shadow"
              style={{
                background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              }}
            >
              Go
            </button>
          </form>
        </div>

        {/* 4. CLEAN VERTICAL LIST: WHAT WE CAN DO / PROJECTS BUILDING & PENDING */}
        <div className="mt-4 space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#0a0a0a] px-1 flex items-center justify-between">
            <span>What We Are Doing For You</span>
            <span className="text-[8.5px] text-[#854d0e] font-semibold">Select Any Item</span>
          </div>

          <div className="space-y-1.5">
            {SERVICES_LIST.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleServiceClick(item)}
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white hover:brightness-110 transition-all text-left flex items-center justify-between gap-2 shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                      style={{ background: '#181818' }}
                    >
                      <Icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {item.title}
                        </span>
                        <span 
                          className="text-[7.5px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0"
                          style={{
                            background: `${item.statusColor}20`,
                            color: item.statusColor,
                            border: `1px solid ${item.statusColor}50`
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-white/60 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-white/40 shrink-0 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. DIRECT CONCIERGE HELP CONTACT */}
        <div className="mt-4 pt-3 border-t border-[#0a0a0a]/15 flex items-center justify-between text-xs text-[#0a0a0a]">
          <div>
            <div className="text-[8px] font-black uppercase text-[#854d0e]">Concierge Direct Desk</div>
            <div className="font-mono font-bold text-[11px]">(858) 353-1200</div>
          </div>
          <div className="flex items-center gap-1.5">
            <a 
              href="tel:+18583531200"
              className="px-2.5 py-1 rounded bg-[#0a0a0a] text-white text-[9px] font-bold hover:brightness-125 flex items-center gap-1"
            >
              <Phone className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>Call</span>
            </a>
            <a 
              href="sms:+18583531200"
              className="px-2.5 py-1 rounded bg-[#0a0a0a] text-white text-[9px] font-bold hover:brightness-125 flex items-center gap-1"
            >
              <MessageCircle className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>Text</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          ONE-CLICK LIBRARY DRAWER / MODAL
          Holds all stored data so the sidebar can go away!
          ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-[400px] max-h-[85vh] rounded-3xl p-5 border space-y-4 shadow-2xl text-left flex flex-col relative overflow-hidden"
            style={{
              background: '#0a0a0a',
              borderColor: GOLD,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-base font-bold text-white">Your Stored Library</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-7 h-7 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Library Contents */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin text-white">
              
              {/* Category 1: Stored Properties */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  Stored Properties &amp; Documents
                </div>
                <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>14820 Blossom Hill Rd, Los Gatos, CA</span>
                    <span className="text-[8px] text-[#10b981] font-mono">Origin</span>
                  </div>
                  <div className="text-[9px] text-white/50">4 Beds · 3.5 Baths · 3,850 sq ft</div>
                  <div className="pt-1 flex items-center gap-2 text-[8px] text-[#D4AF37] underline">
                    <span>Executed Purchase Agreement.pdf</span>
                    <span>Title Report.pdf</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>20844 N 110th Way, Scottsdale, AZ</span>
                    <span className="text-[8px] text-[#D4AF37] font-mono">Target</span>
                  </div>
                  <div className="text-[9px] text-white/50">5 Beds · 6 Baths · 5,600 sq ft</div>
                  <div className="pt-1 flex items-center gap-2 text-[8px] text-[#D4AF37] underline">
                    <span>Inspection Checklist.pdf</span>
                    <span>HOA Bylaws.pdf</span>
                  </div>
                </div>
              </div>

              {/* Category 2: Stored Blueprints & Reports */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  Relocation Blueprints &amp; Reports
                </div>
                {[
                  { title: 'Scottsdale Unified School District Analysis', date: 'May 18, 2026', type: 'Intelligence' },
                  { title: 'California to Arizona Tax Shield Comparison', date: 'May 12, 2026', type: 'Tax Advisory' },
                  { title: 'Listing Agent Vetting Scorecard', date: 'April 29, 2026', type: 'Fiduciary Audit' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-[11px]">{doc.title}</div>
                      <div className="text-[8.5px] text-white/50">{doc.date} · {doc.type}</div>
                    </div>
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  </div>
                ))}
              </div>

              {/* Category 3: Quick Navigation to Portals */}
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  Concierge Direct Shortcuts
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/dnn-news');
                    }}
                    className="p-2 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left"
                  >
                    <div className="font-bold text-white text-[10.5px]">6AM DNN News</div>
                    <div className="text-[8px] text-white/50">Daily Video Brief</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/refer');
                    }}
                    className="p-2 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left"
                  >
                    <div className="font-bold text-white text-[10.5px]">Vet a Listing</div>
                    <div className="text-[8px] text-white/50">Fiduciary Review</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-white/50">
              <span>All Stored Data Secured</span>
              <span>The Dyson &amp; Dyson Companies</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}