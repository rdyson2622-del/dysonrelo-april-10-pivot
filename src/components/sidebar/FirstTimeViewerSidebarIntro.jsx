import React from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#D4AF37';

export default function FirstTimeViewerSidebarIntro({ onSwitchToSubscriber, className = '' }) {
  const navigate = useNavigate();

  return (
    <div 
      className={`w-full p-4 sm:p-5 rounded-3xl border-2 text-left shadow-2xl transition-all relative overflow-hidden select-none space-y-3.5 ${className}`}
      style={{
        background: 'linear-gradient(145deg, #12100b 0%, #080808 100%)',
        borderColor: '#D4AF37',
        boxShadow: '0 12px 30px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)',
      }}
    >
      {/* Top Subtle Gold Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      {/* Header Badges: 1ST TIME VIEWER & READ-ONLY GUEST PASS */}
      <div className="flex items-center justify-between gap-2">
        <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#eab308] text-black shadow-sm">
          1ST TIME VIEWER
        </span>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#10b981]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>READ-ONLY GUEST PASS</span>
        </div>
      </div>

      {/* Title & Body */}
      <div className="space-y-1.5">
        <h3 
          className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Welcome to DysonRelo
        </h3>
        <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-normal">
          You are viewing our platform in <strong className="text-white font-semibold">Read-Only Guest Mode</strong>. Explore our 13 concierge mini-apps and fiduciary intelligence below without sales pressure.
        </p>
      </div>

      {/* Big Gold Pill Button: Pick Your Portal & Subscribe -> */}
      <button
        type="button"
        onClick={() => navigate('/subscribe')}
        className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#eab308] via-[#e5a910] to-[#ca8a04] hover:brightness-105 active:scale-98 transition-all text-black font-bold text-sm sm:text-[15px] flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        style={{
          boxShadow: '0 4px 18px rgba(234,179,8,0.3)',
        }}
      >
        <span>Pick Your Portal &amp; Subscribe</span>
        <span className="text-base font-extrabold leading-none">→</span>
      </button>

      {/* Footer Switcher: Already subscribed? Show Subscriber Card -> */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs sm:text-[12px]">
        <span className="text-white/50">Already subscribed?</span>
        <button
          type="button"
          onClick={() => {
            if (onSwitchToSubscriber) {
              onSwitchToSubscriber();
            } else {
              sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
              window.location.reload();
            }
          }}
          className="text-[#eab308] hover:text-[#fde047] hover:underline font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Show Subscriber Card →</span>
        </button>
      </div>
    </div>
  );
}