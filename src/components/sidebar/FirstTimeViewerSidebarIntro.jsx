import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const GOLD = '#D4AF37';

export default function FirstTimeViewerSidebarIntro({ onSwitchToSubscriber }) {
  const navigate = useNavigate();

  return (
    <div 
      className="w-full p-3 sm:p-3.5 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2.5"
      style={{
        background: 'linear-gradient(135deg, #18150f 0%, #0d0b08 100%)',
        borderColor: `${GOLD}75`,
      }}
    >
      {/* Top Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      {/* Pill Badge */}
      <div className="flex items-center justify-between gap-1">
        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
          1ST TIME VIEWER
        </span>
        <span className="text-[8.5px] font-bold text-[#10b981] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          READ-ONLY GUEST PASS
        </span>
      </div>

      {/* Intro Copy */}
      <div className="space-y-1">
        <h3 
          className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Welcome to DysonRelo
        </h3>
        <p className="text-[10px] text-white/70 leading-relaxed">
          You are viewing our platform in <strong>Read-Only Guest Mode</strong>. Explore our 13 concierge mini-apps and fiduciary intelligence below without sales pressure.
        </p>
      </div>

      {/* Primary Call to Action */}
      <button
        type="button"
        onClick={() => navigate('/subscribe')}
        className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#e8c84a] via-[#D4AF37] to-[#b8920a] hover:opacity-95 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
      >
        <span>Pick Your Portal &amp; Subscribe</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Optional Mode Switcher Link */}
      {onSwitchToSubscriber && (
        <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8.5px] text-white/40">
          <span>Already subscribed?</span>
          <button
            type="button"
            onClick={onSwitchToSubscriber}
            className="text-[#D4AF37] hover:underline font-bold cursor-pointer"
          >
            Show Subscriber Card →
          </button>
        </div>
      )}
    </div>
  );
}