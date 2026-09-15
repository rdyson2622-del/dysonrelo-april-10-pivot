import React, { useState } from 'react';
import { Eye, Lock } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import GrokPageTwoChatCanvas from './GrokPageTwoChatCanvas';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { ADMIN_DEPT_MINI_APPS } from '@/components/admin/AdminMiniAppsGrid';

export default function CopilotPublicReadOnlyTeamRail({ onAskAddress, onBackToLanding, onListenToggle }) {
  const [activeExplainer, setActiveExplainer] = useState(null);

  const handleTriggerExplainer = (query) => {
    const exp = findExplainerByQuery(query);
    if (exp) {
      setActiveExplainer(exp);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#D4AF37]/50 shadow-2xl overflow-visible text-left bg-[#050505] flex flex-col lg:flex-row">
      
      {/* ── FAR-LEFT STREAMLINED TEAM & MINI APPS RAIL (DYNAMIC ENLARGEMENT ON SPEAK) ── */}
      <aside className="w-full lg:w-[124px] xl:w-[128px] bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-white/10 p-2 flex flex-col shrink-0 select-none max-h-[920px] overflow-visible relative z-30">
        <div className="space-y-2.5">
          
          {/* Top: Compact D&D Brand Header */}
          <div className="flex flex-col items-center text-center pb-2 border-b border-white/10 gap-0.5">
            <DysonVerticalBadge height={30} />
            <div>
              <h2 className="text-[9.5px] font-serif font-normal text-white tracking-wider leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                DYSON &amp; DYSON
              </h2>
              <span className="text-[6.5px] uppercase tracking-widest text-[#D4AF37] block font-mono font-semibold">
                FIDUCIARY TEAM
              </span>
            </div>
          </div>

          {/* View Only Pill */}
          <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-1 text-stone-300 min-w-0">
              <Eye className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
              <span className="text-[7.5px] font-semibold truncate">Roster</span>
            </div>
            <span className="text-[6px] px-1 py-0.5 rounded bg-white/10 text-stone-400 font-mono uppercase tracking-wider shrink-0">
              LIVE
            </span>
          </div>

          {/* ── 1. BOB DYSON: DYNAMIC SPEAKER BOX (ENLARGES WHILE SPEAKING) ── */}
          <div className="relative pt-0.5">
            <CopilotDynamicSpeakerBox 
              speaker="bob"
              variant="rail"
              activeExplainer={activeExplainer}
              onClearExplainer={() => setActiveExplainer(null)}
              onTriggerExplainer={handleTriggerExplainer}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-0.5 w-10 mx-auto" />

          {/* ── 2. CHARLIE SIMMONS: DYNAMIC SPEAKER BOX (ENLARGES WHILE SPEAKING) ── */}
          <div className="relative">
            <CopilotDynamicSpeakerBox 
              speaker="charlie"
              variant="rail"
              activeExplainer={activeExplainer}
              onClearExplainer={() => setActiveExplainer(null)}
              onTriggerExplainer={handleTriggerExplainer}
            />
          </div>

          {/* ── 3. COMPACT MINI APPS LIST (24 APPS) ── */}
          <div className="space-y-1 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[7px] font-bold uppercase tracking-wider text-stone-400 truncate">
                MINI APPS ({ADMIN_DEPT_MINI_APPS.length})
              </span>
              <span className="text-[6px] text-stone-500 font-mono">SEE-ONLY</span>
            </div>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-0.5 scrollbar-thin">
              {ADMIN_DEPT_MINI_APPS.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.id}
                    className="p-1 rounded-md bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-white/15 flex items-center justify-between transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Mini-App Icon Squircle */}
                      <div 
                        className={`w-5 h-5 rounded-[6px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shrink-0 relative`}
                        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.6)' }}
                      >
                        <IconComponent 
                          className="w-2.5 h-2.5" 
                          style={{ color: app.iconColor }} 
                        />
                        {app.badgeCount && (
                          <span className={`absolute -top-1 -right-1 text-[5px] font-bold px-0.5 rounded-full ${
                            app.badgeCount === 'LIVE' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : app.badgeCount === 'V2V'
                              ? 'bg-amber-500 text-black font-extrabold'
                              : 'bg-rose-600 text-white'
                          }`}>
                            {app.badgeCount}
                          </span>
                        )}
                      </div>

                      {/* Name & Copy */}
                      <div className="min-w-0 flex flex-col">
                        <div className="text-[7.5px] font-semibold text-stone-200 group-hover:text-white truncate leading-tight">
                          {app.label}
                        </div>
                        <div className="text-[6.5px] text-stone-500 group-hover:text-stone-400 truncate leading-tight font-mono">
                          {app.copy}
                        </div>
                      </div>
                    </div>

                    <Lock className="w-2 h-2 text-stone-600 group-hover:text-stone-500 shrink-0 ml-0.5" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Notice */}
        <div className="pt-2 mt-3 border-t border-white/10 text-[7.5px] text-stone-500 leading-tight text-center">
          Under Bob Dyson · CA Broker Supervision.
        </div>
      </aside>

      {/* ── MAIN CANVAS: UPPER-RIGHT CHARLIE BOX REMOVED (HANDLED BY DYNAMIC RAIL AVATARS) ── */}
      <main className="flex-1 bg-[#0a0a0a] min-w-0">
        <GrokPageTwoChatCanvas 
          onAskAddress={onAskAddress}
          onBackToLanding={onBackToLanding}
          onListenToggle={onListenToggle}
          hideBadge={true}
          hideAvatarSlot={true}
          activeExplainer={activeExplainer}
          onExplainerChange={setActiveExplainer}
        />
      </main>
    </div>
  );
}