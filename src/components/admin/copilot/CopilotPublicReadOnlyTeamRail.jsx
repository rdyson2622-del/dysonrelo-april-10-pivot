import React from 'react';
import { 
  Eye, ShieldCheck, Tv, Network, Newspaper, 
  MapPin, DollarSign, Shield, MessageSquare, Mail, Lock 
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import GrokPageTwoChatCanvas from './GrokPageTwoChatCanvas';

const BOB_HEADSHOT = 'https://files2.heygen.ai/talking_photo/31b79a86784e495090472af2e7b9407c/5c0bde249fe348bb8b9dfb07299f608c.WEBP?Expires=1789606882&Signature=YUNW1j0tU8LsI1vb0JnPSMwCFFhUwdI2U1MoECnlYvthEhenxAfg-ws0S6jibQKfxBhXSRobys8qEkDXU-WvfEi4rH1Sej4yZCwxgjlxPNNv9XjJgaTpZDeeMYzQC8A5cLTT3-l~u5Jy~zeoIlaRFJGM2yu4vTRxo2Ul0fPWg4dK-10LrLqrsFrxEITI1uvRsyfP5ysTm1J7HaW9pCVY~1~1z2HB1zmNuMsVYcCowXhZWfyyOAsPySSciYJfIkFN6Xw16C~n7mK1B5twxKAPjW-yV0Cq8H~wCvqAUr9BbBZpTut1jy1kHtWCEmRiju1M-sQOb4ymWXlvLHxP71xlpA__&Key-Pair-Id=K38HBHX5LX3X2H';
const CHARLIE_DESK_PHOTO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';

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
  return (
    <div className="w-full rounded-2xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden text-left bg-[#050505] flex flex-col lg:flex-row">
      
      {/* ── FAR-LEFT COMPACT TEAM & MINI APPS RAIL (REDUCED TO ~55% WIDTH) ── */}
      <aside className="w-full lg:w-[175px] xl:w-[185px] bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-white/10 p-2.5 sm:p-3 flex flex-col shrink-0 select-none max-h-[920px] overflow-y-auto">
        <div className="space-y-3">
          
          {/* Top: Compact D&D Brand Header */}
          <div className="flex flex-col items-center text-center pb-2.5 border-b border-white/10 gap-1">
            <DysonVerticalBadge height={36} />
            <div>
              <h2 className="text-[11px] font-serif font-bold text-white tracking-wider leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                DYSON &amp; DYSON
              </h2>
              <span className="text-[7.5px] uppercase tracking-widest text-[#D4AF37] block font-mono font-semibold">
                FIDUCIARY TEAM
              </span>
            </div>
          </div>

          {/* View Only Pill */}
          <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-stone-300 min-w-0">
              <Eye className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span className="text-[9px] font-semibold truncate">Team Roster</span>
            </div>
            <span className="text-[7px] px-1 py-0.5 rounded bg-white/10 text-stone-400 font-mono uppercase tracking-wider shrink-0">
              VIEW
            </span>
          </div>

          {/* ── 1. BOB DYSON: VERTICAL / SQUARE CARD ── */}
          <div className="space-y-1">
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#D4AF37] block text-center">
              PRINCIPAL BROKER
            </span>
            <div className="p-2 rounded-xl bg-[#141414] border border-[#D4AF37]/40 flex flex-col items-center text-center space-y-1.5 shadow-md">
              {/* Bob Photo */}
              <div className="relative pt-0.5">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#D4AF37]/60 shrink-0 bg-black shadow-md">
                  <img 
                    src={BOB_HEADSHOT} 
                    alt="Bob Dyson Headshot" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-emerald-500/90 text-black font-mono font-bold absolute -bottom-1 left-1/2 -translate-x-1/2 shadow whitespace-nowrap">
                  ACTIVE
                </span>
              </div>

              <div className="w-full pt-0.5 space-y-0.5">
                <h4 className="text-[11px] font-bold text-white truncate">Bob Dyson</h4>
                <span className="text-[9px] text-stone-300 font-medium block leading-tight">
                  Principal &amp; Fiduciary
                </span>
                <span className="text-[8px] text-[#D4AF37]/90 font-mono block">
                  DRE #00609384
                </span>
              </div>

              <p className="text-[8px] text-stone-400 leading-tight pt-1 border-t border-white/5 w-full">
                Licensed CA Broker. 35+ yrs luxury representation &amp; rebate audit.
              </p>
            </div>
          </div>

          {/* ── 2. CHARLIE SIMMONS: VERTICAL / SQUARE CARD ── */}
          <div className="space-y-1">
            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 block text-center">
              THE FACE OF COPILOT
            </span>
            <div className="p-2 rounded-xl bg-[#141414] border border-emerald-500/40 flex flex-col items-center text-center space-y-1.5 shadow-md">
              {/* Charlie Desk Photo */}
              <div className="relative pt-0.5">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-emerald-500/60 shrink-0 bg-black shadow-md">
                  <img 
                    src={CHARLIE_DESK_PHOTO} 
                    alt="Charlie Simmons at Desk" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[7px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-bold absolute -bottom-1 left-1/2 -translate-x-1/2 shadow whitespace-nowrap">
                  LIVE CHAT
                </span>
              </div>

              <div className="w-full pt-0.5 space-y-0.5">
                <h4 className="text-[11px] font-bold text-white truncate">Charlie Simmons</h4>
                <span className="text-[9px] text-stone-300 font-medium block leading-tight">
                  Voice &amp; Concierge
                </span>
                <span className="text-[8px] text-[#D4AF37] font-serif italic block">
                  The Face of CoPilot
                </span>
              </div>

              <p className="text-[8px] text-stone-400 leading-tight pt-1 border-t border-white/5 w-full">
                AI Concierge at DNN Desk. Full comps, risk checks &amp; rebate audit.
              </p>
            </div>
          </div>

          {/* ── 3. COMPACT MINI APPS LIST ── */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[7.5px] font-bold uppercase tracking-wider text-stone-400 truncate">
                MINI APPS
              </span>
              <span className="text-[7px] text-stone-500 font-mono">SEE-ONLY</span>
            </div>

            <div className="space-y-1">
              {MINI_APPS.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.name}
                    className="p-1.5 rounded-lg bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-white/15 flex items-center justify-between transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Mini-App Icon */}
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${app.gradient} border ${app.border} flex items-center justify-center shrink-0 shadow-sm relative`}>
                        <IconComponent className={`w-3 h-3 ${app.iconColor}`} />
                        {app.badge && (
                          <span className={`absolute -top-1 -right-1 text-[6.5px] font-bold px-0.5 rounded-full ${
                            app.badge === 'LIVE' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-rose-600 text-white'
                          } shadow-sm`}>
                            {app.badge}
                          </span>
                        )}
                      </div>

                      {/* Name + Identifier */}
                      <div className="min-w-0">
                        <div className="text-[9.5px] font-semibold text-stone-200 group-hover:text-white truncate leading-tight">
                          {app.name}
                        </div>
                        <div className="text-[7.5px] text-stone-400 group-hover:text-stone-300 truncate leading-tight mt-0.5">
                          {app.identifier}
                        </div>
                      </div>
                    </div>

                    <Lock className="w-2.5 h-2.5 text-stone-600 group-hover:text-stone-500 shrink-0 ml-1" />
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