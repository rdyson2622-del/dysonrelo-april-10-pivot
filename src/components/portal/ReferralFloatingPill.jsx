import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mic } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * ReferralFloatingPill — a persistent, bottom-right reminder on every page
 * that any visitor or subscriber can refer someone who's relocating.
 * Completely separate from the "Talk to us" / Ask Anything pill — this one
 * links straight to the dedicated /refer page with Voice/V2V support.
 */
export default function ReferralFloatingPill() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link
        to="/refer"
        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black tracking-wide transition-all hover:scale-105 active:scale-95 group shadow-2xl"
        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000', boxShadow: '0 6px 20px rgba(0,0,0,0.45)' }}
        title="Refer a friend with Charlie Hands-Free Voice"
      >
        <UserPlus className="w-4 h-4" />
        <span>Refer a Friend</span>
        <span className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider bg-black/85 text-[#D4AF37] px-2 py-0.5 rounded-full border border-black/40">
          <Mic className="w-2.5 h-2.5 text-[#D4AF37]" />
          <span>V2V</span>
        </span>
      </Link>
    </div>
  );
}