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
          <IPhoneSpringboardGrid />
        </div>

      </div>

      {/* ========================================================
          BOTTOM DOCKED: CONCIERGE DIRECT
          ======================================================== */}
      <div className="p-3 border-t border-white/15 bg-black/90 text-left space-y-2 shrink-0">
        <div 
          className="p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg border border-[#D4AF37]/50"
          style={{ background: '#121212', color: '#ffffff' }}
        >
          <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>CONCIERGE DIRECT</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-white tracking-tight">
              (858) 353–1200
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="tel:+18583531200"
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#202020] text-[#D4AF37] hover:bg-[#2a2a2a] border border-[#D4AF37]/40 transition-all flex items-center gap-1"
              title="Call Fiduciary Desk"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>Call</span>
            </a>
            <a
              href="sms:+18583531200"
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#202020] text-[#10b981] hover:bg-[#2a2a2a] border border-[#10b981]/40 transition-all flex items-center gap-1"
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