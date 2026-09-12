import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, User, Lock, ExternalLink } from 'lucide-react';

export default function AdminDeskHeader({ leadAgent }) {
  return (
    <div className="space-y-4 text-left select-none">
      {/* Top Banner */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #18140c 0%, #0a0a0a 100%)',
          borderColor: 'rgba(212,175,55,0.4)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Relocation Call Desk
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37] text-black">
                STAGE 3 ACTIVE • OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Fiduciary listing lead tracking &amp; prospect call execution • Dedicated relocation desk
            </p>
          </div>
        </div>

        {/* Assigned Relocation Agent Pill & Link to Live Board */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs">
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-white/60">Lead Agent:</span>
            <span className="font-bold text-white">{leadAgent.name}</span>
            <span className="text-[10px] text-[#10b981] font-bold">(Assigned)</span>
          </div>

          <Link
            to="/relocation-agent-desk"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Open Lisa Hurt's live working board"
          >
            <span>Agent Board</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* OPERATIONAL BOUNDARY & GOVERNANCE LOCK BADGES */}
      <div 
        className="p-4 rounded-2xl border space-y-3 shadow-md"
        style={{
          background: '#0d0d0d',
          borderColor: 'rgba(212,175,55,0.3)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">
              OPERATIONAL MANDATE &amp; GOVERNANCE LOCKS
            </div>
            <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
              Daily $2M+ pending listing calls for relocation agents (Lisa Hurt) — separate from referral agents.
            </p>
          </div>
        </div>

        {/* 3 Dedicated Lock Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-amber-500/60 text-amber-400 text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>No blast email/SMS</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-[#D4AF37] text-[#D4AF37] text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Relocation agent ≠ referral agent</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-sky-500/60 text-sky-400 text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Manual import until MLS feed</span>
          </div>
        </div>
      </div>
    </div>
  );
}