import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * ReferralFloatingPill — a persistent, bottom-right reminder on every page
 * that any visitor or subscriber can refer someone who's relocating.
 * Completely separate from the "Talk to us" / Ask Anything pill — this one
 * links straight to the dedicated /refer page.
 */
export default function ReferralFloatingPill() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link
        to="/refer"
        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black tracking-wide transition-all hover:scale-105 active:scale-95"
        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000', boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}
      >
        <UserPlus className="w-4 h-4" /> Refer a Friend
      </Link>
    </div>
  );
}