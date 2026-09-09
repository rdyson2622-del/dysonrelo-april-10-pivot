import React from 'react';

const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";
const GOLD = '#D4AF37';

export default function FirstTimeViewerSidebarIntro({ onSwitchToSubscriber, className = '' }) {
  return (
    <div 
      className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2.5 ${className}`}
      style={{
        background: 'linear-gradient(160deg, #16130e 0%, #0c0b08 100%)',
        borderColor: `${GOLD}80`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
      }}
    >
      {/* Top Subtle Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      {/* Charlie at Desk Studio Photo */}
      <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-md aspect-[16/9] w-full bg-black group">
        <img 
          src={CHARLIE_DESK_PHOTO} 
          alt="Charlie Simmons at DNN Studio Desk" 
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Discreet Name Overlay on Desk */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
          <span className="flex items-center gap-1 drop-shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>Charlie Simmons</span>
          </span>
          <span className="text-[#D4AF37] drop-shadow text-[8.5px] uppercase tracking-wider font-semibold">
            AI Concierge
          </span>
        </div>
      </div>

      {/* Charlie Welcome Message */}
      <div className="space-y-1">
        <h3 
          className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Welcome to Dyson &amp; Dyson
        </h3>
        
        <p className="text-[11px] font-semibold text-[#D4AF37] leading-snug">
          I'm Charlie Simmons, your AI Concierge.
        </p>
        
        <p className="text-[10px] sm:text-[10.5px] text-white/85 leading-relaxed font-normal pt-0.5">
          You are viewing our platform in Guest Mode. Explore our concierge mini-apps and fiduciary intelligence below without sales pressure.
        </p>
      </div>

      {/* Subtle Link for Subscribed Users */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9.5px]">
        <span className="text-white/45">Already subscribed?</span>
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
          className="text-[#D4AF37] hover:text-[#e8c84a] font-semibold transition-colors cursor-pointer"
        >
          Show Subscriber Card →
        </button>
      </div>
    </div>
  );
}