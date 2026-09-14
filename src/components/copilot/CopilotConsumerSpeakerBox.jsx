import React from 'react';
import { User, Sparkles, Radio } from 'lucide-react';

// Elegant, professional executive woman portrait with warm architectural background
export const DEFAULT_CONSUMER_PHOTO = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

/**
 * CopilotConsumerSpeakerBox
 * 
 * Interactive avatar box for the consumer / subscriber on Page 2 Command Center.
 * - Resting state: matches Bob and Charlie's compact card (photo, "You · Subscriber", "Verified Buyer").
 * - Active state: lights up with a brilliant RED / Crimson circle band and border
 *   when the consumer speaks or asks a question, providing distinct 3-way color-coded dialogue:
 *   Bob = Gold, Charlie = Emerald Green, Client = Ruby Red.
 */
export default function CopilotConsumerSpeakerBox({
  isTransmitting = false,
  userName = 'You',
  userRole = 'Verified Buyer',
  photoUrl = DEFAULT_CONSUMER_PHOTO,
  className = '',
}) {
  // ── 1. ACTIVE TRANSMITTING / SPEAKING STATE (LIGHTS UP IN RED) ──
  if (isTransmitting) {
    return (
      <div className={`relative z-40 transition-all duration-300 ease-out w-full sm:w-[240px] ${className}`}>
        <div className="w-full rounded-xl bg-[#0c0c0c] border-2 border-rose-500 shadow-[0_12px_40px_rgba(239,68,68,0.45)] p-2.5 flex flex-col items-center text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full flex items-center justify-between text-[10px] px-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400 font-bold tracking-wider uppercase text-[9.5px]">
                YOU SPEAKING (BUYER)
              </span>
            </div>
            <span className="text-rose-400 font-mono font-bold text-[9px] px-1 py-0.2 rounded bg-rose-500/20">
              LIVE
            </span>
          </div>

          <div className="relative shrink-0 pt-0.5">
            {/* Third Color: Red glowing avatar circle band */}
            <div className="w-14 h-14 aspect-square rounded-full border-2 border-rose-500 p-0.5 overflow-hidden bg-black shadow-[0_0_25px_rgba(239,68,68,0.8)] ring-4 ring-rose-500/80 scale-105 transition-all">
              <img 
                src={photoUrl} 
                alt={userName} 
                className="w-full h-full object-cover object-top scale-105 rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/90 border border-rose-500/80 text-[8px] font-mono text-rose-300 flex items-center gap-1 shadow-md whitespace-nowrap">
              <Sparkles className="w-2 h-2 text-rose-400 animate-spin" />
              <span>Transmitting Live</span>
            </div>
          </div>

          <div className="space-y-0.5 w-full pt-0.5">
            <h3 className="text-[11.5px] font-bold text-white tracking-wide leading-tight">
              {userName}
            </h3>
            <p className="text-[9px] text-rose-200 font-medium truncate leading-tight">
              Routing question to Bob &amp; Charlie...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. RESTING STATE ──
  return (
    <div 
      className={`w-[132px] sm:w-[138px] rounded-xl bg-[#0c0c0c] border border-stone-700/60 hover:border-rose-500/70 shadow-[0_6px_20px_rgba(0,0,0,0.8)] p-2 flex flex-col items-center text-center space-y-1 transition-all duration-300 shrink-0 relative group cursor-default ${className}`}
    >
      <div className="relative shrink-0 pt-0.5">
        <div className="w-12 h-12 aspect-square rounded-full border-2 border-stone-500 group-hover:border-rose-500 p-0.5 overflow-hidden bg-black shadow-md ring-1.5 ring-white/10 group-hover:ring-rose-500/50 group-hover:scale-105 transition-all">
          <img 
            src={photoUrl} 
            alt={userName} 
            className="w-full h-full object-cover object-top scale-105 rounded-full" 
          />
        </div>
        <span className="w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 ring-1.5 ring-[#0c0c0c] bg-rose-500 shadow-sm" />
      </div>

      <div className="space-y-0.5 w-full">
        <h4 className="text-[11px] font-bold text-white tracking-wide leading-tight group-hover:text-rose-400 transition-colors truncate">
          {userName}
        </h4>
        <p className="text-[8px] text-stone-300 font-medium leading-tight truncate">
          {userRole}
        </p>
        <span className="text-[7px] block leading-none text-stone-400 font-mono">
          CLIENT SUBSCRIBER
        </span>
      </div>

      <div className="w-full pt-1">
        <div className="w-full py-1 px-1.5 rounded-md bg-white/5 border border-white/10 text-stone-300 text-[9px] font-semibold flex items-center justify-center gap-1 group-hover:border-rose-500/40">
          <User className="w-2.5 h-2.5 text-stone-400 group-hover:text-rose-400" />
          <span>Active Session</span>
        </div>
      </div>
    </div>
  );
}