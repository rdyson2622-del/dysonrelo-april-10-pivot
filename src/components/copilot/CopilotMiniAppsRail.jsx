import React from 'react';
import { 
  Eye, ShieldCheck, Tv, Network, Newspaper, 
  MapPin, DollarSign, Shield, MessageSquare, Mail, Lock 
} from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';

export const MINI_APPS = [
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

/**
 * CopilotMiniAppsRail
 * 
 * Compact vertical rail (~120px) showcasing the team of AI minions & automated workflows
 * backing Dyson & Dyson's rapid responses and fiduciary intelligence.
 */
export default function CopilotMiniAppsRail({ className = '', onSelectApp }) {
  return (
    <aside className={`w-full lg:w-[124px] xl:w-[128px] bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-white/10 p-2 flex flex-col shrink-0 select-none max-h-[920px] overflow-visible relative z-30 ${className}`}>
      <div className="space-y-2.5">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center pb-2 border-b border-white/10 gap-0.5">
          <DysonVerticalBadge height={28} />
          <div>
            <h2 className="text-[9px] font-serif font-bold text-white tracking-wider leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              DYSON &amp; DYSON
            </h2>
            <span className="text-[6.5px] uppercase tracking-widest text-[#D4AF37] block font-mono font-semibold">
              AI MINIONS ENGINE
            </span>
          </div>
        </div>

        {/* Live Pill */}
        <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[8px]">
          <div className="flex items-center gap-1 text-stone-300 min-w-0">
            <Eye className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
            <span className="text-[7.5px] font-semibold truncate">Active Desks</span>
          </div>
          <span className="text-[6px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono uppercase tracking-wider shrink-0 font-bold">
            9 LIVE
          </span>
        </div>

        {/* Mini Apps List */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[7px] font-bold uppercase tracking-wider text-stone-400 truncate">
              AUTOMATIONS
            </span>
            <span className="text-[6px] text-stone-500 font-mono">STANDBY</span>
          </div>

          <div className="space-y-1">
            {MINI_APPS.map((app) => {
              const IconComponent = app.icon;
              return (
                <div
                  key={app.name}
                  onClick={() => onSelectApp?.(app)}
                  className={`p-1 rounded-md bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-[#D4AF37]/50 flex items-center justify-between transition-all cursor-pointer group ${
                    app.name === 'DNN News' ? 'ring-1 ring-rose-500/40' : ''
                  }`}
                  title={`${app.name} · ${app.identifier} (Click to open)`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
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

                    <div className="min-w-0">
                      <div className="text-[8px] font-semibold text-stone-200 group-hover:text-white truncate leading-tight">
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

      <div className="pt-2 mt-auto border-t border-white/10 text-[7px] text-stone-500 leading-tight text-center">
        Under Bob Dyson DRE #00609384
      </div>
    </aside>
  );
}