import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, BookOpen, Phone, MessageSquare, 
  X, Sparkles, ShieldCheck, Compass, Play, 
  ArrowRight, FileText, CheckCircle2, Lock
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Charlie is standing by · Tap mic for live voice');

  // Client Data State
  const [currentUser, setCurrentUser] = useState(null);
  const [clientRecord, setClientRecord] = useState(null);

  useEffect(() => {
    let isMounted = true;
    base44.auth.me().then(user => {
      if (user && isMounted) setCurrentUser(user);
    }).catch(() => {});

    base44.entities.RelocationClient.list('-created_date', 1).then(clients => {
      if (clients && clients.length > 0 && isMounted) {
        setClientRecord(clients[0]);
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const displayName = clientRecord?.full_name || currentUser?.full_name || 'Kayden Sterling';
  const photoUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const originCity = clientRecord?.current_city || 'Los Gatos, CA';
  const destinationCity = clientRecord?.destination_city ? clientRecord.destination_city.replace(/,\s*[A-Z]{2}$/i, '') : 'Scottsdale';
  const destinationState = clientRecord?.destination_state || 'AZ';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (q.toLowerCase().includes('roadmap') || q.toLowerCase().includes('move')) {
      navigate('/client-roadmap');
    } else if (q.toLowerCase().includes('voice') || q.toLowerCase().includes('charlie')) {
      navigate('/talking-app');
    } else if (q.toLowerCase().includes('solution') || q.toLowerCase().includes('strategy') || q.toLowerCase().includes('tax')) {
      navigate(`/solutions?prompt=${encodeURIComponent(q)}&autostart=true`);
    } else if (q.toLowerCase().includes('library') || q.toLowerCase().includes('file')) {
      setIsLibraryOpen(true);
    } else {
      const clean = q.replace(/,\s*/g, '_').replace(/\s+/g, '-');
      window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleVoice = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceStatus('Charlie is listening (Live V2V)... "Hello Kayden, how can I assist your move today?"');
    } else {
      setIsVoiceActive(false);
      setVoiceStatus('Charlie is standing by · Tap mic for live voice');
    }
  };

  // The 6 clean iOS-style app tiles requested:
  // 1. Strategy
  // 2. Vet listing/agent
  // 3. My Library
  // 4. Roadmap
  // 5. News / market
  // 6. Concierge
  const APPS = [
    {
      id: 'strategy',
      label: 'Strategy',
      sub: 'Tax & Solutions',
      icon: Sparkles,
      iconColor: '#e8c84a',
      bgGradient: 'from-[#221d13] via-[#15130f] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      action: () => navigate('/solutions?prompt=Tax%20migration%20and%201031%20exchange%20strategy&autostart=true'),
    },
    {
      id: 'vet',
      label: 'Vet listing/agent',
      sub: 'Search / Vetting',
      icon: ShieldCheck,
      iconColor: '#34d399',
      bgGradient: 'from-[#0b271d] via-[#0d1a15] to-[#0a0a0a]',
      border: 'border-[#10b981]/50',
      action: () => navigate('/refer'),
    },
    {
      id: 'library',
      label: 'My Library',
      sub: 'Deeds & Files',
      badge: '3 Docs',
      icon: BookOpen,
      iconColor: '#60a5fa',
      bgGradient: 'from-[#10223d] via-[#0c1626] to-[#0a0a0a]',
      border: 'border-[#3b82f6]/50',
      action: () => setIsLibraryOpen(true),
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      sub: 'Move Stages',
      icon: Compass,
      iconColor: '#D4AF37',
      bgGradient: 'from-[#241f17] via-[#14120f] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      action: () => navigate('/client-roadmap'),
    },
    {
      id: 'news',
      label: 'News / market',
      sub: '6 AM Daily Pulse',
      badge: '6 AM',
      icon: Play,
      iconColor: '#f87171',
      bgGradient: 'from-[#2a1313] via-[#180e0e] to-[#0a0a0a]',
      border: 'border-[#ef4444]/50',
      action: () => navigate('/dnn-news'),
    },
    {
      id: 'concierge',
      label: 'Concierge',
      sub: 'Direct Desk',
      icon: Phone,
      iconColor: '#D4AF37',
      bgGradient: 'from-[#241f17] via-[#14120f] to-[#0a0a0a]',
      border: 'border-[#D4AF37]/50',
      action: () => window.open('tel:+18583531200'),
    },
  ];

  return (
    <div className="w-full text-left font-sans">
      <div 
        className="w-full rounded-3xl p-4 sm:p-6 shadow-2xl border border-[#0a0a0a]/20 text-[#0a0a0a] space-y-5"
        style={{
          background: TAN_BG,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        {/* ========================================================
            1. TOP CLIENT HEADER: WELCOME + VERIFIED SUBSCRIBER + MY LIBRARY
            ======================================================== */}
        <section className="p-3.5 sm:p-4 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/60 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={photoUrl} 
                alt={displayName} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[9px] font-black text-black"
                title="Verified Subscriber"
              >
                ✓
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#10b981] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  Verified Subscriber
                </span>
                <span className="text-white/30 text-[10px]">•</span>
                <span className="text-[10px] text-white/60 font-medium">
                  {originCity} → {destinationCity}, {destinationState}
                </span>
              </div>
              <h1 
                className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight mt-0.5 truncate"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Welcome back, {displayName}
              </h1>
            </div>
          </div>

          {/* Dedicated My Library Top Access Button */}
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            style={{
              background: '#151515',
              color: GOLD,
              border: `1.2px solid ${GOLD}`,
            }}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>My Library</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#D4AF37] text-black font-black hidden sm:inline">
              3
            </span>
          </button>
        </section>

        {/* ========================================================
            2. SEARCH + CHARLIE AI BAR
            ======================================================== */}
        <section className="space-y-2">
          {/* Unified Luxury Search with Charlie Mic Trigger */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-black text-white border-2 border-[#D4AF37] shadow-xl"
          >
            {/* Charlie Tap-to-Talk Mic Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isVoiceActive
                  ? 'bg-[#10b981] text-black animate-pulse shadow-md'
                  : 'bg-[#181818] text-[#D4AF37] hover:bg-[#222] border border-[#D4AF37]/50'
              }`}
              title="Talk with Charlie AI"
            >
              <Mic className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Charlie AI</span>
            </button>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Ask Charlie anything or search ${destinationCity}...`}
              className="w-full bg-transparent text-xs sm:text-sm text-white px-2 py-1 focus:outline-none placeholder:text-white/45 font-medium"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black hover:bg-[#e8c84a] transition-all font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Charlie Voice Status Line */}
          <div className="px-2 flex items-center justify-between text-[11px] text-[#554433]">
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-[#10b981] animate-ping' : 'bg-[#D4AF37]'}`} />
              <span className="font-medium truncate">{voiceStatus}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/talking-app')}
              className="text-[10px] font-bold text-[#854d0e] hover:underline shrink-0"
            >
              Full Screen V2V →
            </button>
          </div>
        </section>

        {/* ========================================================
            3. CLEAN iOS-LIKE ICON GRID (6 ICONS: 3x2 ON MOBILE)
            - Strategy
            - Vet listing/agent
            - My Library
            - Roadmap
            - News / market
            - Concierge
            ======================================================== */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#854d0e]">
              WORKSPACE APPS
            </h2>
            <span className="text-[10px] text-[#554433] font-medium">
              Tap to Open
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 py-1">
            {APPS.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={app.action}
                  className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                >
                  {/* iOS Squircle Icon Tile */}
                  <div 
                    className={`w-15 h-15 sm:w-16 sm:h-16 rounded-[22px] bg-gradient-to-br ${app.bgGradient} border ${app.border} shadow-lg group-hover:shadow-2xl group-hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Glossy iOS Reflection Sheen */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/18 via-white/5 to-transparent pointer-events-none rounded-t-[22px]" />

                    {/* Optional Badge */}
                    {app.badge && (
                      <span 
                        className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#D4AF37] text-black shadow-sm"
                      >
                        {app.badge}
                      </span>
                    )}

                    <Icon 
                      className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110 drop-shadow" 
                      style={{ color: app.iconColor }} 
                    />
                  </div>

                  {/* Clean Short Label Under Each Icon */}
                  <span className="mt-1.5 text-xs font-bold text-[#0a0a0a] group-hover:text-[#854d0e] transition-colors leading-tight truncate max-w-[95px]">
                    {app.label}
                  </span>
                  {/* Micro Subtitle */}
                  <span className="text-[9px] text-[#554433] leading-none mt-0.5 truncate max-w-[95px]">
                    {app.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            4. MY LIBRARY QUICK ACCESS CARD
            ======================================================== */}
        <section 
          onClick={() => setIsLibraryOpen(true)}
          className="p-3.5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:border-[#D4AF37] transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#3b82f6]/50 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#60a5fa]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">My Library Vault</span>
                <span className="px-2 py-0.2 rounded-full text-[8.5px] font-bold bg-[#1e3a8a] text-[#93c5fd]">
                  3 Active Files
                </span>
              </div>
              <p className="text-[11px] text-white/60 truncate mt-0.5">
                Deeds, 1031 Exchange filing, and Fiduciary Agreements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#D4AF37] group-hover:translate-x-0.5 transition-transform shrink-0">
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </section>

        {/* ========================================================
            FOOTER: FIDUCIARY DESK DIRECT LINE
            ======================================================== */}
        <footer className="pt-2 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#554433]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Fiduciary Representation across all 50 States · The Dyson &amp; Dyson Companies, Inc.</span>
          </div>
          <div className="flex items-center gap-2 font-mono font-bold text-[#0a0a0a] text-[11px]">
            <a href="tel:+18583531200" className="hover:text-[#854d0e]">(858) 353-1200</a>
            <span>•</span>
            <a href="sms:+18583531200" className="text-[#854d0e] uppercase hover:underline">Text Concierge</a>
          </div>
        </footer>

      </div>

      {/* ========================================================
          MY LIBRARY DRAWER / MODAL
          ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg rounded-3xl p-6 border space-y-4 shadow-2xl text-left bg-[#0a0a0a] border-[#D4AF37] text-white relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#3b82f6]/50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-[#60a5fa]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">My Library &amp; Stored Vault</h2>
                  <p className="text-xs text-white/50">{displayName} · Verified Account</p>
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
              <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D4AF37]">Properties &amp; Deed Vault</span>
                  <span className="text-[10px] text-[#10b981] font-semibold">Verified</span>
                </div>
                <p className="text-white/60 text-[11px]">
                  Grant deed, preliminary title report, and property survey for {originCity}.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D4AF37]">Fiduciary Engagement &amp; Disclosures</span>
                  <span className="text-[10px] text-[#10b981] font-semibold">Active</span>
                </div>
                <p className="text-white/60 text-[11px]">
                  Master fiduciary representation agreement and zero-fee disclosure filed with The Dyson &amp; Dyson Companies, Inc.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D4AF37]">Charlie AI Sessions &amp; Call Logs</span>
                  <span className="text-[10px] text-white/40">3 Turns</span>
                </div>
                <p className="text-white/60 text-[11px]">
                  Spoken audio logs, transcripts, and vetted agent comparison notes for {destinationCity}.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-black cursor-pointer shadow hover:brightness-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                Close Library Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}