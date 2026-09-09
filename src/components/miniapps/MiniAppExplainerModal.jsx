import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Check, ArrowRight, ShieldCheck, AlertCircle, Sparkles, 
  Lock, Unlock, ExternalLink, Phone, Mic, Compass, Calendar, 
  Mail, Calculator, CloudSun, BookOpen, Play, Users 
} from 'lucide-react';
import { MINI_APP_EXPLAINERS } from '@/lib/miniAppExplainers';

const GOLD = '#D4AF37';

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

  const handleLaunch = () => {
    onClose();
    if (explainer.route?.startsWith('tel:')) {
      window.open(explainer.route);
    } else if (explainer.route) {
      navigate(explainer.route);
    }
  };

  const handleSubscribe = () => {
    onClose();
    if (onSubscribeClick) {
      onSubscribeClick();
    } else {
      navigate('/subscribe');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl p-5 sm:p-7 border shadow-2xl text-left bg-[#0c0c0c] border-[#D4AF37] text-white relative max-h-[92vh] overflow-y-auto space-y-5"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212,175,55,0.4) transparent',
        }}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-13 h-13 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center shadow-lg relative shrink-0"
              style={{
                boxShadow: '0 4px 18px rgba(212,175,55,0.3)',
              }}
            >
              <IconComponent className="w-6 h-6 text-[#D4AF37]" />
              {explainer.badgeCount && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff3b30] text-white text-[9px] font-black flex items-center justify-center border border-black shadow">
                  {explainer.badgeCount}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37] text-black">
                  {explainer.badge}
                </span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                  MINI APP #{explainer.number}
                </span>
              </div>
              <h2 
                className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-0.5"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {explainer.title}
              </h2>
              <p className="text-xs text-[#e8c84a] font-medium leading-tight">
                {explainer.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181818] border border-white/20 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tagline */}
        <div className="p-3 rounded-2xl bg-[#15120a] border border-[#D4AF37]/40 text-xs text-white/90 font-medium leading-relaxed italic flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>“{explainer.tagline}”</span>
        </div>

        {/* The Problem on Other Sites */}
        <div className="p-4 rounded-2xl bg-[#140a0a] border border-[#ef4444]/30 space-y-1.5 text-xs text-left">
          <div className="flex items-center gap-1.5 text-[#ef4444] font-black text-[10px] uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>The Problem Unsubscribed Viewers Face on Public Sites</span>
          </div>
          <p className="text-white/80 leading-relaxed text-[11.5px]">
            {explainer.theProblem}
          </p>
        </div>

        {/* The Fiduciary Solution */}
        <div className="p-4 rounded-2xl bg-[#09150f] border border-[#10b981]/40 space-y-1.5 text-xs text-left">
          <div className="flex items-center gap-1.5 text-[#10b981] font-black text-[10px] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>How This Pill Solves It (The Fiduciary Advantage)</span>
          </div>
          <p className="text-white/85 leading-relaxed text-[11.5px]">
            {explainer.theFiduciarySolution}
          </p>
        </div>

        {/* Access Comparison Grid: Guest vs Subscriber */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          
          {/* Guest Access (Right Now) */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider text-white/70">
              <Unlock className="w-3 h-3 text-[#10b981]" />
              <span>Available to Guests Right Now:</span>
            </div>
            <p className="text-white/75 text-[11px] leading-relaxed">
              {explainer.unsubscribedAccess}
            </p>
          </div>

          {/* Subscriber Exclusive Unlock */}
          <div className="p-3.5 rounded-2xl bg-[#1c170d] border border-[#D4AF37]/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider text-[#D4AF37]">
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>Unlocked with Free Subscription:</span>
            </div>
            <p className="text-white/85 text-[11px] leading-relaxed">
              {explainer.subscriberUnlock}
            </p>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black hover:bg-[#1a1a1a] border border-[#D4AF37]/70 text-[#D4AF37] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Claim Free Subscriber Access</span>
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
          >
            <span>{explainer.keyActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}