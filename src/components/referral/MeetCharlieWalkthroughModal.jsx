import React from 'react';
import { Mic, ArrowRight, ShieldCheck, Sparkles, X, Volume2 } from 'lucide-react';

const GOLD = '#D4AF37';
const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";

export default function MeetCharlieWalkthroughModal({
  isOpen,
  onTalkWithCharlie,
  onContinueToDesk,
  agentName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border-2 shadow-2xl text-left relative max-h-[94vh] overflow-y-auto space-y-5 text-white"
        style={{
          background: 'linear-gradient(165deg, #181510 0%, #0d0c0a 100%)',
          borderColor: GOLD,
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.25)',
        }}
      >
        {/* Top Header Badge Row */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              Pre-Enrolled Referral Partner • Live Walkthrough
            </span>
          </div>

          <button
            type="button"
            onClick={onContinueToDesk}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Dismiss to Desk"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Presenter Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/40 shadow-inner">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0 shadow-lg">
            <img 
              src={CHARLIE_DESK_PHOTO} 
              alt="Charlie Simmons - AI Concierge" 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-1 inset-x-0 text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                Charlie Simmons
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
              Speaking Face of Your Referral Desk
            </div>
            <h2 
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Meet Charlie, {agentName ? agentName.split(' ')[0] : 'Partner'}
            </h2>
            <p className="text-xs text-[#fce38a] leading-relaxed">
              You are pre-enrolled. Walk the site with Charlie to explore your referral pipeline, fee protection, and client onboarding tools.
            </p>
          </div>
        </div>

        {/* 3 Quick Value Highlights */}
        <div className="space-y-2.5 text-xs text-white/90">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Speaking Face of This Desk:</strong> Charlie is your real-time conversational concierge, built directly into this portal.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Your 25% Fee Guaranteed:</strong> Charlie tracks out-of-area client referrals from initial vetting through close of escrow.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Volume2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Live Voice Discussion:</strong> Full-duplex conversational AI — no robotic menus, just talk naturally.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={onTalkWithCharlie}
            className="w-full py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, #e8c84a 0%, ${GOLD} 50%, #b8920a 100%)`,
              color: '#000',
              boxShadow: '0 6px 20px rgba(212,175,55,0.4)',
            }}
          >
            <Mic className="w-4 h-4 text-black" />
            <span>Talk with Charlie Now</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onContinueToDesk}
              className="text-xs text-white/60 hover:text-white transition-colors underline cursor-pointer py-1"
            >
              Continue to desk (I'll talk later)
            </button>
          </div>
        </div>

        {/* Fiduciary Compliance Footer Note */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-white/50">
          <span>The Dyson &amp; Dyson Companies, Inc.</span>
          <span className="text-[#D4AF37] font-semibold">CA DRE #02303118</span>
        </div>
      </div>
    </div>
  );
}