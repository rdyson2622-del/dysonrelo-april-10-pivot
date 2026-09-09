import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Check, ArrowRight, ShieldCheck, AlertCircle, Sparkles, 
  Lock, Unlock, ExternalLink, Phone, Mic, Compass, Calendar, 
  Mail, Calculator, CloudSun, BookOpen, Play, Users 
} from 'lucide-react';
import { MINI_APP_EXPLAINERS } from '@/lib/miniAppExplainers';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

const ICON_MAP = {
  Mic,
  Compass,
  Calendar,
  Mail,
  Calculator,
  CloudSun,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Play,
  Users,
  ArrowRight,
  Phone,
};

export default function MiniAppExplainerModal({
  appId,
  isOpen,
  onClose,
  onSubscribeClick,
}) {
  const navigate = useNavigate();
  if (!isOpen || !appId) return null;

  const explainer = MINI_APP_EXPLAINERS.find((e) => e.id === appId) || MINI_APP_EXPLAINERS[0];
  const IconComponent = ICON_MAP[explainer.iconName] || Sparkles;

  const handleSubscribe = () => {
    onClose();
    if (onSubscribeClick) {
      onSubscribeClick();
    } else {
      navigate('/subscribe');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container — SIGNATURE DYSON TAN BACKDROP */}
      <div 
        className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 border-2 shadow-2xl text-left relative max-h-[92vh] overflow-y-auto space-y-6 text-[#0a0a0a]"
        style={{
          background: TAN_BG,
          borderColor: '#854d0e',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(133,77,14,0.4) transparent',
        }}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#0a0a0a]/15">
          <div className="flex items-start gap-3.5">
            {/* App Icon Squircle */}
            <div 
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center shadow-lg relative shrink-0"
              style={{
                boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
              }}
            >
              <IconComponent className="w-7 h-7 text-[#D4AF37]" />
              {explainer.badgeCount && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#ff3b30] text-white text-[10px] font-black flex items-center justify-center border-2 border-black shadow">
                  {explainer.badgeCount}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-[#D4AF37]">
                  {explainer.badge || 'MINI APP'}
                </span>
                <span className="text-[10px] font-bold text-[#854d0e] uppercase tracking-wider">
                  1ST TIME VIEWER • READ-ONLY EXPLAINER
                </span>
              </div>

              {/* Exact Title format: 1. 🎙️ Charlie AI ( /talking-app ) */}
              <h2 
                className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight leading-tight mt-1"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {explainer.number}. {explainer.title} <span className="text-sm font-sans font-normal text-[#554433]">({explainer.route})</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#0a0a0a] flex items-center justify-center cursor-pointer transition-all shrink-0"
            title="Close Explainer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            EXACT BULLET POINT COPY SPECIFICATION (FROM SCREENSHOT)
            ======================================================== */}
        <div className="space-y-4 text-xs sm:text-sm text-[#0a0a0a] leading-relaxed">
          
          {/* Bullet 1: Subtitle */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#854d0e] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">Subtitle:</strong>{' '}
              <span className="text-[#332211] font-medium">{explainer.subtitle}</span>
            </div>
          </div>

          {/* Bullet 2: The Problem Unsubscribed Viewers Face */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#dc2626] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">The Problem Unsubscribed Viewers Face:</strong>{' '}
              <span className="text-[#443322] leading-relaxed">{explainer.theProblem}</span>
            </div>
          </div>

          {/* Bullet 3: The Fiduciary Solution */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#10b981] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">The Fiduciary Solution:</strong>{' '}
              <span className="text-[#223322] leading-relaxed">{explainer.theFiduciarySolution}</span>
            </div>
          </div>

          {/* Bullet 4: Unsubscribed Viewer Access */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#854d0e] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">Unsubscribed Viewer Access:</strong>{' '}
              <span className="text-[#443322] leading-relaxed">{explainer.unsubscribedAccess}</span>
            </div>
          </div>

          {/* Bullet 5: Subscriber Unlock */}
          <div className="flex items-start gap-2.5">
            <span className="text-[#b45309] text-base font-bold leading-none select-none">•</span>
            <div>
              <strong className="text-[#0a0a0a] font-bold">Subscriber Unlock:</strong>{' '}
              <span className="text-[#2b1f13] leading-relaxed">{explainer.subscriberUnlock}</span>
            </div>
          </div>

        </div>

        {/* Read-Only Notice Box */}
        <div className="p-3.5 rounded-2xl bg-black/5 border border-black/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#854d0e] shrink-0" />
            <span className="text-[#554433]">
              <strong>Read-Only Mode:</strong> Full interactive actions activate automatically after selecting your portal and subscribing.
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#0a0a0a]/25 text-[#0a0a0a] hover:bg-black/10 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Close Explainer</span>
          </button>

          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-[#1f1f1f] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pick Your Portal &amp; Subscribe to Unlock</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>

      </div>
    </div>
  );
}