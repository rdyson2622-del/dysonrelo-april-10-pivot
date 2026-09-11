import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Phone, MessageSquare, X, ArrowRight, HelpCircle
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import SubscriberProfileHeader from '@/components/sidebar/SubscriberProfileHeader';
import IPhoneSpringboardGrid, { BROKER_DEFAULT_APPS, IPHONE_DEFAULT_APPS } from '@/components/springboard/IPhoneSpringboardGrid';
import MiniAppExplainerModal from '@/components/miniapps/MiniAppExplainerModal';
import { isFirstTimeVisitorMode } from '@/lib/miniAppExplainers';

const GOLD = '#D4AF37';

export default function ClientSidebar({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [explainerAppId, setExplainerAppId] = useState(null);
  const [, setModeTick] = useState(0);

  useEffect(() => {
    const syncRole = () => {
      setModeTick((t) => t + 1);
    };
    window.addEventListener('dyson_role_change', syncRole);
    window.addEventListener('dyson_viewer_mode_change', syncRole);
    return () => {
      window.removeEventListener('dyson_role_change', syncRole);
      window.removeEventListener('dyson_viewer_mode_change', syncRole);
    };
  }, []);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, []);

  // Show Pill Guide + charlieVideoUrl explainer for:
  // - sessionStorage guest (dyson_viewer_mode === 'guest')
  // - role first_time_visitor (dyson_role === 'first_time_visitor')
  // - URL ?visitor=1
  // - unauthenticated missing role/mode (not subscriber)
  // Hide ONLY subscriber or role set != first_time_visitor (no !isAuthenticated gate)
  const isFirstTimeVisitor = isFirstTimeVisitorMode();

  return (
    <aside 
      className="w-[310px] sm:w-[320px] h-full bg-[#0a0a0a] text-white flex flex-col border-r border-[#D4AF37]/30 shadow-2xl overflow-y-auto select-none"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(212,175,55,0.3) transparent',
      }}
    >
      <div className="p-3.5 space-y-3 flex-1">
        
        {/* Mobile close button if opened via drawer */}
        {onToggle && (
          <div className="flex justify-end pb-1">
            <button
              type="button"
              onClick={onToggle}
              className="w-8 h-8 rounded-xl bg-black border border-white/20 text-white/70 hover:text-white hover:border-[#D4AF37] flex items-center justify-center cursor-pointer shrink-0 transition-all shadow-md active:scale-95"
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 55+ YEARS PILL */}
        <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full border border-[#D4AF37]/60 bg-black/60 text-[10px] font-black tracking-widest text-[#D4AF37] uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>55+ YEARS • NATIONWIDE CONCIERGE</span>
        </div>

        {/* ========================================================
            TOP SUBSCRIBER PROFILE HEADER (REPLACES SEARCH DESTINATIONS)
            Photo & Basic Subscriber Info visible throughout searches & changed pages.
            Click to view full details or edit move file.
            ======================================================== */}
        <SubscriberProfileHeader />

        {/* ========================================================
            MINI APPS GRID (SOLID BLACK BACKGROUND)
            Subscribers get full interactive in-place mini apps & routes.
            1st time / guest viewers see the Pill Guide button & explainer videos.
            ======================================================== */}
        <div className="pt-1.5 text-left">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1 mb-2">
            <span>SUBSCRIBER MINI APPS:</span>
            {isFirstTimeVisitor ? (
              <button
                type="button"
                onClick={() => setExplainerAppId('charlie')}
                className="text-[#D4AF37] hover:text-[#e8c84a] font-bold text-[9px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Pill Guide for new viewers"
              >
                <HelpCircle className="w-3 h-3 text-[#D4AF37]" />
                <span>Pill Guide</span>
              </button>
            ) : (
              <span className="text-white/40 normal-case font-normal text-[9px]">tap to launch on page</span>
            )}
          </div>
          <IPhoneSpringboardGrid 
            apps={location.pathname.startsWith('/broker') ? BROKER_DEFAULT_APPS : IPHONE_DEFAULT_APPS}
            onAppClick={isFirstTimeVisitor ? (app) => setExplainerAppId(app.id) : undefined}
            onInfoClick={(app) => setExplainerAppId(app.id)}
          />
        </div>

      </div>

      {/* Mini App Explainer Modal exclusively for 1st Time / Unsubscribed Viewers */}
      {isFirstTimeVisitor && (
        <MiniAppExplainerModal
          appId={explainerAppId}
          isOpen={Boolean(explainerAppId)}
          onClose={() => setExplainerAppId(null)}
        />
      )}

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
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#202020] text-[#D4AF37] hover:bg-[#2a2a2a] border border-[#D4AF37]/40 transition-all flex items-center gap-1 cursor-pointer"
              title="Call Fiduciary Desk"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>Call</span>
            </a>
            <a
              href="sms:+18583531200"
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#202020] text-[#10b981] hover:bg-[#2a2a2a] border border-[#10b981]/40 transition-all flex items-center gap-1 cursor-pointer"
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