import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ArrowRight, ShieldCheck, Phone, 
  MessageSquare, ExternalLink, Sparkles, X
} from 'lucide-react';
import IPhoneSpringboardGrid from '@/components/springboard/IPhoneSpringboardGrid';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function Sidebar({ userRole, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, []);

  const signedInName = currentUser?.full_name || 'Robert Dyson';

  return (
    <aside 
      className="w-[310px] sm:w-[320px] h-full bg-[#0a0a0a] text-white flex flex-col border-r border-[#D4AF37]/30 shadow-2xl overflow-y-auto select-none"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(212,175,55,0.3) transparent',
      }}
    >
      <div className="p-3.5 space-y-3 flex-1">
        
        {/* ========================================================
            TOP BRAND HEADER PILL
            ======================================================== */}
        <div className="flex items-center justify-between gap-1.5">
          <div 
            onClick={() => navigate('/portal')}
            className="flex-1 p-2.5 rounded-2xl bg-black border border-[#D4AF37]/40 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
              <span className="font-serif text-base font-bold text-[#D4AF37]">D</span>
            </div>
            <div className="min-w-0">
              <div 
                className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight truncate"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DysonRelo.com
              </div>
              <div className="text-[8px] font-black uppercase tracking-[0.15em] text-[#D4AF37] truncate">
                NATIONWIDE CONCIERGE
              </div>
            </div>
          </div>
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="w-9 h-9 rounded-xl bg-black border border-white/20 text-white/70 hover:text-white hover:border-[#D4AF37] flex items-center justify-center cursor-pointer shrink-0 transition-all shadow-md active:scale-95"
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 55+ YEARS PILL */}
        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full border border-[#D4AF37]/60 bg-black/60 text-[10px] font-black tracking-widest text-[#D4AF37] uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>55+ YEARS • NATIONWIDE CONCIERGE</span>
        </div>

        {/* ========================================================
            SEARCH DESTINATIONS CARD (CREAM CARD)
            ======================================================== */}
        <div 
          className="p-3.5 rounded-2xl text-left text-[#0a0a0a] shadow-md border border-[#D4AF37]/40 space-y-2"
          style={{ background: '#ede0cc' }}
        >
          <div className="text-center space-y-0.5">
            <h2 
              className="text-lg font-bold tracking-tight text-[#0a0a0a] leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Search Destinations
            </h2>
            <p className="text-xs italic font-serif font-bold text-[#854d0e]">
              Or Let Us Vet Any Listing For You.
            </p>
          </div>

          <p className="text-[11px] text-center text-[#44382c] leading-snug px-1">
            Destination market, or paste link from Realtor, Zillow, or Homes.com
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.elements.sidebarQ?.value?.trim();
              if (val) {
                if (val.includes('?') || val.toLowerCase().includes('tax') || val.toLowerCase().includes('school') || val.toLowerCase().includes('how')) {
                  navigate(`/solutions?prompt=${encodeURIComponent(val)}&autostart=true`);
                } else {
                  const clean = val.replace(/,\s*/g, '_').replace(/\s+/g, '-');
                  window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
                }
              } else {
                navigate('/search');
              }
            }}
            className="flex items-center gap-1.5 p-1 rounded-full bg-white/95 border border-[#D4AF37] shadow-inner focus-within:ring-2 focus-within:ring-[#D4AF37]"
          >
            <input
              name="sidebarQ"
              type="text"
              placeholder="Ask anything or enter city / link..."
              className="w-full bg-transparent text-xs text-black pl-3 pr-1 py-1 focus:outline-none placeholder:text-stone-500 font-medium"
            />
            <button
              type="submit"
              className="p-1.5 rounded-full bg-[#0a0a0a] text-[#D4AF37] hover:bg-[#1a1a1a] transition-all shrink-0 cursor-pointer"
              title="Search or Ask"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ========================================================
            SIGNED IN STATUS STRIP
            ======================================================== */}
        <div className="py-2 px-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" />
            <span className="text-white/90 font-medium truncate">
              Signed In: <strong className="text-white font-bold">{signedInName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/portal')}
            className="text-[11px] font-bold text-[#D4AF37] hover:text-white transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* ========================================================
            INDIVIDUAL APPLE APPS ON SOLID BLACK BACKGROUND
            (EXACT IPHONE SPRINGBOARD LOOK — NO BEIGE PILLS!)
            ======================================================== */}
        <div className="pt-2 text-left">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1 mb-2.5">
            <span>CONCIERGE APPS:</span>
            <span className="text-white/40 normal-case font-normal text-[10px]">tap to launch</span>
          </div>

          {/* 3-Column iPhone Springboard Grid directly on black background */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-2 px-1">
            {[
              {
                id: 'charlie',
                shortLabel: 'Charlie AI',
                tag: 'Voice AI',
                icon: Mic,
                iconColor: '#10b981',
                bgGradient: 'from-[#064e3b] via-[#0d281e] to-[#0a0a0a]',
                border: 'border-[#10b981]/60',
                badge: 'VOICE',
                route: '/talking-app',
              },
              {
                id: 'family',
                shortLabel: 'Family Relo',
                tag: 'Intake',
                icon: Home,
                iconColor: '#D4AF37',
                bgGradient: 'from-[#2e2617] via-[#17140f] to-[#0a0a0a]',
                border: 'border-[#D4AF37]/60',
                badge: 'FREE',
                route: '/relocation-intake',
              },
              {
                id: 'hr',
                shortLabel: 'Corp HR',
                tag: 'Exec Move',
                icon: Building,
                iconColor: '#e8c84a',
                bgGradient: 'from-[#332a18] via-[#1a160d] to-[#0a0a0a]',
                border: 'border-[#e8c84a]/60',
                badge: 'ZERO',
                route: '/corporate-relo',
              },
              {
                id: 'agents',
                shortLabel: 'Agent Bureau',
                tag: 'PRN Network',
                icon: Users,
                iconColor: '#60a5fa',
                bgGradient: 'from-[#172554] via-[#0f172a] to-[#0a0a0a]',
                border: 'border-[#3b82f6]/60',
                badge: '25%',
                route: '/broker-portal',
              },
              {
                id: 'refer',
                shortLabel: 'Refer Lead',
                tag: 'Payout',
                icon: ArrowRight,
                iconColor: '#D4AF37',
                bgGradient: 'from-[#2b2210] via-[#17130b] to-[#0a0a0a]',
                border: 'border-[#D4AF37]/60',
                badge: 'PAYOUT',
                route: '/refer',
              },
              {
                id: 'news',
                shortLabel: '6AM News',
                tag: 'Daily Pulse',
                icon: Play,
                iconColor: '#ef4444',
                bgGradient: 'from-[#450a0a] via-[#1f0a0a] to-[#0a0a0a]',
                border: 'border-[#ef4444]/60',
                badge: 'DAILY',
                route: '/dnn-news',
              },
              {
                id: 'advantage',
                shortLabel: 'Advantage',
                tag: 'Fiduciary',
                icon: ShieldCheck,
                iconColor: '#34d399',
                bgGradient: 'from-[#064e3b] via-[#0d281e] to-[#0a0a0a]',
                border: 'border-[#10b981]/60',
                badge: '100%',
                route: '/transparency',
              },
              {
                id: 'library',
                shortLabel: 'My Library',
                tag: 'Vault',
                icon: BookOpen,
                iconColor: '#60a5fa',
                bgGradient: 'from-[#10223d] via-[#0c1626] to-[#0a0a0a]',
                border: 'border-[#3b82f6]/60',
                badge: 'VAULT',
                route: '/media',
              },
              {
                id: 'concierge',
                shortLabel: 'Concierge',
                tag: 'Direct Desk',
                icon: Phone,
                iconColor: '#D4AF37',
                bgGradient: 'from-[#2e2617] via-[#17140f] to-[#0a0a0a]',
                border: 'border-[#D4AF37]/60',
                badge: 'CALL',
                route: 'tel:+18583531200',
              },
            ].map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    if (app.route.startsWith('tel:')) {
                      window.open(app.route);
                    } else {
                      navigate(app.route);
                    }
                  }}
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
                        {app.badge}
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
                    {app.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================
          BOTTOM DOCKED: CONCIERGE DIRECT
          ======================================================== */}
      <div className="p-3 border-t border-white/15 bg-black/90 text-left space-y-2 shrink-0">
        <div 
          className="p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-inner"
          style={{ background: '#ede0cc', color: '#0a0a0a' }}
        >
          <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>CONCIERGE DIRECT</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-[#0a0a0a] tracking-tight">
              (858) 353–1200
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="tel:+18583531200"
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
              title="Call Fiduciary Desk"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>Call</span>
            </a>
            <a
              href="sms:+18583531200"
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
              title="Text Fiduciary Desk"
            >
              <MessageSquare className="w-3 h-3 text-[#10b981]" />
              <span>Text</span>
            </a>
          </div>
        </div>
      </div>

    </aside>
  );
}