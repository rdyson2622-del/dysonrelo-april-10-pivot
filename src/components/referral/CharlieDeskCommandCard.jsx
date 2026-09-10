import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Sparkles, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';
const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";

export default function CharlieDeskCommandCard({ 
  className = '',
  agentName = '',
  portalLabel = 'Referral Agent Desk',
}) {
  const navigate = useNavigate();

  const handleTalk = () => {
    navigate('/talking-app?from=referral_agent');
  };

  return (
    <div 
      onClick={handleTalk}
      className={`w-full p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4 relative overflow-hidden group select-none ${className}`}
      style={{
        background: 'linear-gradient(160deg, #17140e 0%, #0a0a0a 100%)',
        borderColor: `${GOLD}90`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.1)',
      }}
      title="Click to talk with Charlie Simmons (AI Concierge)"
    >
      {/* Top Gold Hairline */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      {/* Left: Charlie Desk Photo & Face Badge */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-[#D4AF37] shrink-0 shadow-md bg-black">
          <img 
            src={CHARLIE_DESK_PHOTO} 
            alt="Charlie Simmons" 
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0.5 inset-x-0 text-center">
            <span className="text-[6.5px] font-black uppercase text-white tracking-widest">
              Charlie
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              Talk with Charlie
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              Live V2V
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#fce38a] font-medium leading-tight truncate mt-0.5">
            Speaking Face of this {portalLabel}
          </div>
          <div className="text-[9.5px] text-white/50 leading-tight truncate hidden sm:block mt-0.5">
            Discuss 25% referral fees, buyer-broker handoffs, &amp; client status
          </div>
        </div>
      </div>

      {/* Right: Mic Trigger Button */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all bg-[#D4AF37] text-black shadow-md group-hover:bg-[#e8c84a] group-hover:scale-105 active:scale-95">
          <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
        </div>
      </div>
    </div>
  );
}