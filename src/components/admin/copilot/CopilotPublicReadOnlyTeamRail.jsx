import React, { useState } from 'react';
import { 
  Eye, ShieldCheck, Tv, Network, Newspaper, 
  MapPin, DollarSign, Shield, MessageSquare, Mail, Lock 
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import GrokPageTwoChatCanvas from './GrokPageTwoChatCanvas';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';

const MINI_APPS = [
  {
    name: 'Grok Viewer',
    identifier: 'Screen Vision',
    icon: Tv,
    gradient: 'from-sky-500/25 via-blue-600/20 to-slate-900',
    border: 'border-sky-500/40',
    iconColor: 'text-sky-400',
    badge: null,
  },
  {
    name: 'Workflows',
    identifier: 'Atlas & Roadmap',
    icon: Network,
    gradient: 'from-cyan-500/25 via-teal-600/20 to-slate-900',
    border: 'border-cyan-400/40',
    iconColor: 'text-cyan-300',
    badge: null,
  },
  {
    name: 'DNN News',
    identifier: 'Studio Broadcast',
    icon: Newspaper,
    gradient: 'from-rose-600/25 via-red-700/20 to-slate-900',
    border: 'border-rose-500/40',
    iconColor: 'text-rose-400',
    badge: '3',
  },
  {
    name: 'Vetting Desk',
    identifier: 'Agents & Lenders',
    icon: ShieldCheck,
    gradient: 'from-purple-600/25 via-indigo-700/20 to-slate-900',
    border: 'border-purple-400/40',
    iconColor: 'text-purple-300',
    badge: null,
  },
  {
    name: 'MLS Outreach',
    identifier: 'Listing Agent CRM',
    icon: MapPin,
    gradient: 'from-amber-600/25 via-orange-700/20 to-slate-900',
    border: 'border-amber-400/40',
    iconColor: 'text-amber-400',
    badge: '1',
  },
  {
    name: 'Finance',
    identifier: 'HUD-1 & Escrow',
    icon: DollarSign,
    gradient: 'from-yellow-600/25 via-amber-700/20 to-slate-900',
    border: 'border-yellow-400/40',
    iconColor: 'text-yellow-400',
    badge: null,
  },
  {
    name: 'Operations',
    identifier: 'Compliance & Audits',
    icon: Shield,
    gradient: 'from-emerald-600/25 via-teal-700/20 to-slate-900',
    border: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    badge: null,
  },
  {
    name: 'Text / SMS',
    identifier: 'Twilio (858) 353-0858',
    icon: MessageSquare,
    gradient: 'from-emerald-500/25 via-green-600/20 to-slate-900',
    border: 'border-emerald-400/40',
    iconColor: 'text-emerald-300',
    badge: null,
  },
  {
    name: 'Email Desk',
    identifier: 'bob@dysonrelo.com',
    icon: Mail,
    gradient: 'from-sky-500/25 via-blue-600/20 to-slate-900',
    border: 'border-sky-400/40',
    iconColor: 'text-sky-300',
    badge: 'LIVE',
  },
];

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

          {/* ── 3. COMPACT MINI APPS LIST ── */}
          <div className="space-y-1 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[7px] font-bold uppercase tracking-wider text-stone-400 truncate">
                MINI APPS
              </span>
              <span className="text-[6px] text-stone-500 font-mono">SEE-ONLY</span>
            </div>

            <div className="space-y-1">
              {MINI_APPS.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.name}
                    className="p-1 rounded-md bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-white/15 flex items-center justify-between transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Mini-App Icon */}
                      <div className={`w-5 h-5 rounded bg-gradient-to-br ${app.gradient} border ${app.border} flex items-center justify-center shrink-0 relative`}>
                        <IconComponent className={`w-2.5 h-2.5 ${app.iconColor}`} />
                        {app.badge && (
                          <span className={`absolute -top-1 -right-1 text-[5.5px] font-bold px-0.5 rounded-full ${
                            app.badge === 'LIVE' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-rose-600 text-white'
                          }`}>
                            {app.badge}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="min-w-0">
                        <div className="text-[8.5px] font-semibold text-stone-200 group-hover:text-white truncate leading-tight">
                          {app.name}
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
          Under Bob Dyson's CA Broker License #00609384.
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