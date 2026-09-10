import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, Lightbulb, UserCheck, BookOpen, Route, 
  Tv, Sparkles, ShieldCheck, Mic, Volume2, Square, 
  CheckCircle2, Info, X, ChevronRight, Lock
} from 'lucide-react';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';
const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";
const BOB_PHOTO = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/09d1d285a_bob_dyson_black_shirt.webp";
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

export default function ClientBacksideBobDeskDemo({ deviceView = 'mobile' }) {
  const navigate = useNavigate();
  const [activeTileNotice, setActiveTileNotice] = useState(null);

  const handleTalkWithCharlie = () => {
    navigate('/talking-app');
  };

  // EXACT 8 TILES REQUESTED
  const TILES = [
    { id: 'relocate', label: 'Relocate', icon: Compass, isLibrary: false },
    { id: 'strategy', label: 'Strategy', icon: Lightbulb, isLibrary: false },
    { id: 'vet_agent', label: 'Vet Agent', icon: UserCheck, isLibrary: false },
    { 
      id: 'my_library', 
      label: 'My Library', 
      icon: BookOpen, 
      isLibrary: true,
      hint: 'Single-Click Tile'
    },
    { id: 'roadmap', label: 'Roadmap', icon: Route, isLibrary: false },
    { id: 'dnn_news', label: 'DNN News', icon: Tv, isLibrary: false },
    { id: 'charlie_ai', label: 'Charlie AI', icon: Sparkles, isLibrary: false },
    { id: 'fiduciary', label: 'Fiduciary', icon: ShieldCheck, isLibrary: false },
  ];

  const handleTileClick = (tile) => {
    setActiveTileNotice({
      title: tile.label,
      isLibrary: tile.isLibrary,
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-start py-4 px-2 select-none">
      
      {/* 1. CLEAR DEMO / LAB CALLOUT BANNER (BOB EYES ONLY) */}
      <div className="w-full max-w-[420px] mb-3 px-3 py-2 rounded-2xl bg-[#0e0e0e] border border-[#D4AF37]/60 shadow-lg flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              DEMO / LAB • BOB'S EYES ONLY
            </div>
            <div className="text-[9.5px] text-white/70">
              Mobile Client Backside Template (Zero Clutter)
            </div>
          </div>
        </div>
        <span className="text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20">
          LAB ONLY
        </span>
      </div>

      {/* 2. PHONE-FIRST CANVAS (STANDALONE CLEAN DESK, NO CLUTTERED SIDEBAR) */}
      <div 
        className="w-full max-w-[420px] rounded-[32px] p-4 sm:p-5 shadow-2xl border-2 text-left relative overflow-hidden"
        style={{
          background: TAN_BG,
          borderColor: '#1f1a10',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.4)',
        }}
      >
        {/* Minimal Mobile Screen Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0a0a0a]/15 text-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-4 w-auto object-contain" />
            <span className="text-[11px] font-bold tracking-tight text-[#0a0a0a]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              DysonRelo Desk
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <img 
              src={BOB_PHOTO} 
              alt="Subscriber" 
              className="w-5 h-5 rounded-full object-cover border border-[#0a0a0a]"
            />
            <span className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-wide">
              Subscriber Desk
            </span>
          </div>
        </div>

        {/* ========================================================
            3. THE ONE SHORT COMMAND CARD
            - “Where am I? Subscriber Client Desk.”
            - “What’s next? Talk with Charlie or choose a starting point.”
            - Visually integrated "Talk with Charlie" as the speaking face
            ======================================================== */}
        <section 
          className="mt-3.5 rounded-2xl p-4 sm:p-4.5 border shadow-xl text-left relative overflow-hidden space-y-3.5"
          style={{
            background: 'linear-gradient(160deg, #16130e 0%, #0a0a0a 100%)',
            borderColor: `${GOLD}80`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          {/* Subtle Top Gold Hairline */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

          {/* Clean Command Lines */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>Verified Subscriber Desk Session</span>
            </div>

            <h2 
              className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Where am I? Subscriber Client Desk.
            </h2>

            <p className="text-xs text-[#fce38a] font-medium leading-snug">
              What’s next? Talk with Charlie or choose a starting point.
            </p>
          </div>

          {/* VISUALLY INTEGRATED "TALK WITH CHARLIE" AS THE SPEAKING FACE OF THIS SAME CLIENT DESK */}
          <div 
            onClick={handleTalkWithCharlie}
            className="w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group bg-[#121212] border-white/15 hover:border-[#D4AF37] hover:bg-[#1a1712]"
            title="Click to speak with Charlie Simmons (Speaking Face of Desk)"
          >
            {/* Charlie Headshot / Studio Desk Face */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D4AF37]/70 shrink-0 shadow">
              <img 
                src={CHARLIE_DESK_PHOTO} 
                alt="Charlie Simmons" 
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0.5 inset-x-0 text-center">
                <span className="text-[6.5px] font-black uppercase text-white tracking-widest">
                  Charlie
                </span>
              </div>
            </div>

            {/* Speaking Face Status & Interactive Trigger */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Talk with Charlie
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="text-[10px] text-white/60 leading-tight truncate">
                Speaking Face of this Client Desk
              </div>
            </div>

            {/* Action Icon */}
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/10 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black">
                <Mic className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. COMPACT 8-TILE ICON GRID (EXACT LABELS)
            Relocate, Strategy, Vet Agent, My Library,
            Roadmap, DNN News, Charlie AI, Fiduciary
            ======================================================== */}
        <section className="mt-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#0a0a0a]/80">
              Starting Points:
            </span>
            <span className="text-[9px] text-[#0a0a0a]/60">
              Template Tiles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TILES.map((tile) => {
              const Icon = tile.icon;
              const isLib = tile.isLibrary;

              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleTileClick(tile)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 group relative ${
                    isLib
                      ? 'bg-[#0a0a0a] text-white border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30 hover:scale-[1.02]'
                      : 'bg-[#0a0a0a] text-white border border-[#0a0a0a] hover:border-[#D4AF37]/70'
                  }`}
                >
                  {/* Visual distinction for My Library as single obvious one-click tile */}
                  {isLib && (
                    <span 
                      className="absolute -top-1.5 px-2 py-0.2 rounded-full text-[7px] font-black uppercase tracking-wider text-black shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                    >
                      ★ ONE-CLICK
                    </span>
                  )}

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner transition-colors ${
                    isLib 
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black' 
                      : 'bg-white/10 text-white group-hover:text-[#D4AF37]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className={`text-[11px] font-bold tracking-tight leading-tight ${
                    isLib ? 'text-[#D4AF37]' : 'text-white/90 group-hover:text-white'
                  }`}>
                    {tile.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. ACTIVE TILE TEMPLATE FEEDBACK MODAL / DRAWER */}
        {activeTileNotice && (
          <div className="mt-3.5 p-3 rounded-xl bg-[#0a0a0a] border border-[#D4AF37]/70 text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs font-bold text-white">
                  {activeTileNotice.title} Tile Selected
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTileNotice(null)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-white/70 mt-1 pl-6">
              {activeTileNotice.isLibrary 
                ? 'My Library single-click desk opened. Displays all deeds, tax files, signed agreements, and blueprints (Template demo placeholder; no backend action).' 
                : `Opened ${activeTileNotice.title} template starting point (Lab demo placeholder; no backend actions).`}
            </p>
          </div>
        )}

        {/* 6. CLEAN MINIMAL FOOTER */}
        <div className="mt-4 pt-2.5 border-t border-[#0a0a0a]/15 text-center">
          <p className="text-[9px] font-semibold text-[#0a0a0a]/60 uppercase tracking-widest">
            The Dyson &amp; Dyson Companies • Client Desk Demo
          </p>
        </div>

      </div>
    </div>
  );
}