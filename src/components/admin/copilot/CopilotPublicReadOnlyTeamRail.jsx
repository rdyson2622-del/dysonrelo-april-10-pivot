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
      
      {/* ── FAR-LEFT REDESIGNED TEAM & MINI APPS RAIL ── */}
      <aside className="w-full lg:w-[310px] xl:w-[325px] bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-5 flex flex-col shrink-0 select-none max-h-[920px] overflow-y-auto">
        <div className="space-y-4">
          
          {/* Top: D&D Brand Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <DysonVerticalBadge height={44} />
            <div>
              <h2 className="text-sm font-serif font-bold text-white tracking-wider" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                DYSON &amp; DYSON
              </h2>
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-mono font-semibold">
                FIDUCIARY TEAM
              </span>
            </div>
          </div>

          {/* View Only Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-300">
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-semibold">Public Team Roster</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-stone-400 font-mono uppercase tracking-wider">
              VIEW ONLY
            </span>
          </div>

          {/* ── 1. BOB AT THE TOP (HEADSHOT IN BLACK SHIRT IN A BOX) ── */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#D4AF37] block">
              PRINCIPAL BROKER (HUMAN)
            </span>
            <div className="p-2.5 rounded-xl bg-[#141414] border border-[#D4AF37]/40 space-y-2 shadow-md">
              <div className="flex items-center gap-2.5">
                {/* Bob Photo in a Box (Headshot in Black Shirt) */}
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#D4AF37]/60 shrink-0 bg-black shadow-md">
                  <img 
                    src={BOB_HEADSHOT} 
                    alt="Bob Dyson Headshot in Black Shirt" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">Bob Dyson</h4>
                    <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold shrink-0">
                      ACTIVE
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300 font-medium block truncate">
                    Principal &amp; Fiduciary
                  </span>
                  <span className="text-[9px] text-[#D4AF37]/90 font-mono block">
                    DRE #00609384
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-stone-400 leading-snug pt-0.5 border-t border-white/5">
                Licensed California Broker. 35+ years luxury representation &amp; closing rebate audit.
              </p>
            </div>
          </div>

          {/* ── 2. CHARLIE IN A BOX AT HIS DESK AND COMPUTER ── */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-400 block">
              THE FACE OF COPILOT (AI CONCIERGE)
            </span>
            <div className="p-2.5 rounded-xl bg-[#141414] border border-emerald-500/40 space-y-2 shadow-md">
              <div className="flex items-center gap-2.5">
                {/* Charlie at Desk & Computer */}
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/60 shrink-0 bg-black shadow-md relative">
                  <img 
                    src={CHARLIE_DESK_PHOTO} 
                    alt="Charlie Simmons at Desk with Computer" 
                    className="w-full h-full object-cover"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0.5 right-0.5 ring-2 ring-black animate-pulse" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">Charlie Simmons</h4>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold shrink-0">
                      LIVE CONVERSATION
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300 font-medium block truncate">
                    Voice &amp; Market Concierge
                  </span>
                  <span className="text-[9px] text-[#D4AF37] font-serif italic block">
                    The Face of CoPilot
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-stone-400 leading-snug pt-0.5 border-t border-white/5">
                AI Concierge at the DNN Desk. Full property comps, risk checks &amp; closing rebate audit.
              </p>
            </div>
          </div>

          {/* ── 3. MINI APPS IN A SINGLE ROW WITH LOWER IDENTIFIERS (RUN DOWN IN A SINGULAR LINE) ── */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400">
                SPECIALIZED AI SYSTEMS &amp; MINI APPS
              </span>
              <span className="text-[8.5px] text-stone-500 font-mono">SEE-ONLY</span>
            </div>

            <div className="space-y-1.5">
              {MINI_APPS.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.name}
                    className="p-2 rounded-xl bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-white/15 flex items-center justify-between transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Vibrant Mini-App Icon Squircle */}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.gradient} border ${app.border} flex items-center justify-center shrink-0 shadow-sm relative`}>
                        <IconComponent className={`w-4 h-4 ${app.iconColor}`} />
                        {app.badge && (
                          <span className={`absolute -top-1 -right-1 text-[7.5px] font-bold px-1 rounded-full ${
                            app.badge === 'LIVE' 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-rose-600 text-white'
                          } shadow-sm`}>
                            {app.badge}
                          </span>
                        )}
                      </div>

                      {/* Name + Lower Identifier */}
                      <div className="min-w-0">
                        <div className="text-[11.5px] font-semibold text-stone-200 group-hover:text-white truncate leading-tight">
                          {app.name}
                        </div>
                        <div className="text-[9.5px] text-stone-400 group-hover:text-stone-300 truncate leading-tight mt-0.5">
                          {app.identifier}
                        </div>
                      </div>
                    </div>

                    <Lock className="w-3 h-3 text-stone-600 group-hover:text-stone-500 shrink-0 ml-1.5" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Notice */}
        <div className="pt-3 mt-4 border-t border-white/10 text-[9.5px] text-stone-500 leading-snug">
          Specialist units operate in background support under Bob Dyson's California broker license.
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