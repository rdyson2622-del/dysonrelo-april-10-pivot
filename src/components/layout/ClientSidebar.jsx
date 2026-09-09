import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Mic, ArrowRight, ShieldCheck, Phone, 
  MessageSquare, ExternalLink, Sparkles, X
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function ClientSidebar({ onToggle }) {
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

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="w-full py-2 px-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
          >
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>CLICK TO SEARCH →</span>
          </button>
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
            SECTION: CONCIERGE TO-DO'S: select one
            ======================================================== */}
        <div className="space-y-1.5 pt-1 text-left">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
            <span>CONCIERGE TO-DO'S:</span>
            <span className="text-white/40 normal-case font-normal text-[10px]">select one</span>
          </div>

          {/* 1. Talk with Charlie */}
          <div
            onClick={() => navigate('/talking-app')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-black text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <span className="text-xs font-bold text-[#0a0a0a] truncate">Talk with Charlie</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-white shrink-0">
                  VOICE AI
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#86efac] border border-[#10b981] shrink-0 ml-auto" />
            </div>
            <p className="text-[10px] text-[#554433] mt-1 pl-8 leading-tight">
              Ask anything, vet agents &amp; navigate
            </p>
          </div>

          {/* 2. Relocating Families & Buyers */}
          <div
            onClick={() => navigate('/relocation-intake')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">Relocating Families &amp; Buyers</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#10b981] shrink-0">
                  FREE
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
            </div>
            <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
              Agent vetting, tax &amp; school roadmap
            </p>
          </div>

          {/* 3. Corporate HR & Employers */}
          <div
            onClick={() => navigate('/corporate-relo')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">Corporate HR &amp; Employers</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#D4AF37] shrink-0">
                  ZERO FEE
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
            </div>
            <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
              Executive move packages &amp; milestones
            </p>
          </div>

          {/* 4. Agents & Brokerages */}
          <div
            onClick={() => navigate('/broker-portal')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">Agents &amp; Brokerages</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#1d4ed8] text-white shrink-0">
                  25% REFERRAL
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
            </div>
            <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
              Receiving agent bureau &amp; escrow audits
            </p>
          </div>

          {/* 5. Refer a Client or Colleague */}
          <div
            onClick={() => navigate('/refer')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">Refer a Client or Colleague</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37] shrink-0">
                  25% PAYOUT
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
            </div>
            <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
              Submit buyer, seller, agent or vendor lead
            </p>
          </div>
        </div>

        {/* ========================================================
            SECTION: DETAILED SYSTEMS: direct
            ======================================================== */}
        <div className="space-y-1.5 pt-1 text-left">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
            <span>DETAILED SYSTEMS:</span>
            <span className="text-white/40 normal-case font-normal text-[10px]">direct</span>
          </div>

          {/* 6. 6AM DNN News Broadcast */}
          <div
            onClick={() => navigate('/dnn-news')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">6AM DNN News Broadcast</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#dc2626] text-white shrink-0">
                  DAILY
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#854d0e] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto">
                Open →
              </span>
            </div>
            <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
              AI Charlie &amp; Bob • Daily Housing Pulse
            </p>
          </div>

          {/* 7. The Concierge Advantage */}
          <div
            onClick={() => navigate('/transparency')}
            className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">The Concierge Advantage</span>
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#047857] text-white shrink-0">
                  FIDUCIARY
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#854d0e] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto">
                Open →
              </span>
            </div>
            <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
              Independent Vetting vs Lead Portals
            </p>
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