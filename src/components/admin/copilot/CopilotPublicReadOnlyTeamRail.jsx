import React from 'react';
import { Eye, ShieldCheck, UserCheck, Bot, Sparkles, MessageSquare, Compass, PhoneCall, Newspaper, Scale, Lock } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';
import GrokPageTwoChatCanvas from './GrokPageTwoChatCanvas';

export default function CopilotPublicReadOnlyTeamRail({ onAskAddress, onBackToLanding, onListenToggle }) {
  return (
    <div className="w-full rounded-2xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden text-left bg-[#050505] flex flex-col lg:flex-row">
      
      {/* ── FAR-LEFT READ-ONLY / SEE-ONLY TEAM ROSTER RAIL ── */}
      <aside className="w-full lg:w-72 bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-white/10 p-5 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-5">
          {/* Top: D&D badge ONLY in sidebar top */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <DysonVerticalBadge height={48} />
            <div>
              <h2 className="text-sm font-serif font-bold text-white tracking-wider" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                DYSON &amp; DYSON
              </h2>
              <span className="text-[9.5px] uppercase tracking-widest text-[#D4AF37] block font-mono">
                FIDUCIARY TEAM
              </span>
            </div>
          </div>

          {/* See-only / View only pill */}
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-300">
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-semibold">Public Team Roster</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-stone-400 font-mono uppercase tracking-wider">
              VIEW ONLY
            </span>
          </div>

          {/* 1. Humans at top */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
              PRINCIPAL BROKER (HUMAN)
            </span>
            <div className="p-3 rounded-xl bg-[#141414] border border-[#D4AF37]/30 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1c1c1c] border border-[#D4AF37] flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                    BD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Bob Dyson</h4>
                    <span className="text-[10px] text-stone-400">Principal &amp; Fiduciary</span>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-[10.5px] text-stone-400 leading-snug pt-1">
                Licensed California Broker (DRE #00609384). 35+ years luxury representation &amp; closing rebate audit.
              </p>
            </div>
          </div>

          {/* 2. Specialized Bots with Name + Expertise */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                SPECIALIZED AI SYSTEM
              </span>
              <span className="text-[9px] text-stone-500 font-mono">SEE-ONLY</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Charlie: The Live Conversation */}
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#10b981]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-[#10b981] flex items-center justify-center font-bold text-[11px]">
                    C
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Charlie</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-stone-400">Voice &amp; Market Concierge</div>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  LIVE CONVERSATION
                </span>
              </div>

              {/* Read-Only Bots */}
              {[
                { name: 'Grok Bot', role: 'Architecture & Orchestration', icon: Sparkles },
                { name: 'Roadmaps', role: 'Escrow & Transaction Milestones', icon: Compass },
                { name: 'Call Desk', role: 'Relocation & Agent Verification', icon: PhoneCall },
                { name: 'News Engine', role: 'DNN Pulse Daily Intelligence', icon: Newspaper },
                { name: 'Escrow & Audit', role: 'HUD-1 Fiduciary Credit Check', icon: Scale },
              ].map((bot) => (
                <div 
                  key={bot.name}
                  className="p-2.5 rounded-xl bg-[#111] border border-white/5 flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center gap-2">
                    <bot.icon className="w-3.5 h-3.5 text-[#D4AF37]/80" />
                    <div>
                      <div className="text-xs font-medium text-stone-200">{bot.name}</div>
                      <div className="text-[10px] text-stone-500">{bot.role}</div>
                    </div>
                  </div>
                  <Lock className="w-3 h-3 text-stone-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="pt-4 border-t border-white/10 text-[10px] text-stone-500 leading-snug">
          Charlie is the single active conversational portal. Specialist units operate in background support under Bob Dyson's license.
        </div>
      </aside>

      {/* ── MAIN CANVAS: CHARLIE REMAINS ONLY LIVE CONVERSATION ── */}
      <main className="flex-1 bg-[#0a0a0a] min-w-0">
        <GrokPageTwoChatCanvas 
          onAskAddress={onAskAddress}
          onBackToLanding={onBackToLanding}
          onListenToggle={onListenToggle}
          hideBadge={true}
        />
      </main>
    </div>
  );
}