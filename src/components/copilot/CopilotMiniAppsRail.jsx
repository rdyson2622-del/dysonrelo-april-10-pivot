import React from 'react';
import { 
  Lock, Scale, Shield, GitBranch, ShieldCheck, Newspaper,
  Sparkles, CheckCircle2
} from 'lucide-react';
import { ADMIN_DEPT_MINI_APPS } from '@/components/admin/AdminMiniAppsGrid';

/**
 * 4 Core Execution Doors prioritized for consumer transaction execution:
 * 1. Property Audit (Comps, geotechnical, hazard risks, valuation)
 * 2. Agent Vetting (Fiduciary buyer criteria, zero dual agency)
 * 3. Move Roadmap (7-phase step-by-step milestone timeline)
 * 4. Escrow Watch (Earnest money deposit defense, title traps)
 * Plus DNN News (Daily broadcast video)
 */
export const CORE_EXECUTION_MINIONS = [
  {
    id: 'dossier',
    label: 'Property Audit',
    copy: 'Comps & Risks',
    icon: Scale,
    iconColor: '#e8c84a',
    bgGradient: 'from-[#332a18] via-[#1a160d] to-[#0a0a0a]',
    border: 'border-[#D4AF37]',
    badge: 'ACTIVE',
    badgeColor: 'bg-[#D4AF37] text-black font-extrabold',
    isActiveDoor: true
  },
  {
    id: 'vetting',
    label: 'Agent Vetting',
    copy: 'Fiduciary Match',
    icon: Shield,
    iconColor: '#c084fc',
    bgGradient: 'from-[#4c1d95] via-[#2e1065] to-[#0a0a0a]',
    border: 'border-purple-500/80',
    badge: 'ACTIVE',
    badgeColor: 'bg-purple-600 text-white font-extrabold',
    isActiveDoor: true
  },
  {
    id: 'roadmap',
    label: 'Move Roadmap',
    copy: '7-Phase Timeline',
    icon: GitBranch,
    iconColor: '#38bdf8',
    bgGradient: 'from-[#0369a1] via-[#075985] to-[#0a0a0a]',
    border: 'border-cyan-500/80',
    badge: 'ACTIVE',
    badgeColor: 'bg-cyan-600 text-black font-extrabold',
    isActiveDoor: true
  },
  {
    id: 'escrow',
    label: 'Escrow Watch',
    copy: 'Deposit Defense',
    icon: ShieldCheck,
    iconColor: '#34d399',
    bgGradient: 'from-[#065f46] via-[#022c22] to-[#0a0a0a]',
    border: 'border-emerald-500/80',
    badge: 'ACTIVE',
    badgeColor: 'bg-emerald-600 text-white font-extrabold',
    isActiveDoor: true
  },
  {
    id: 'dnn',
    label: 'DNN News',
    copy: 'Daily Broadcast',
    icon: Newspaper,
    iconColor: '#ef4444',
    bgGradient: 'from-[#450a0a] via-[#1f0a0a] to-[#0a0a0a]',
    border: 'border-rose-500/80',
    badge: 'LIVE',
    badgeColor: 'bg-rose-500 text-white font-extrabold animate-pulse',
    isActiveDoor: true
  }
];

export default function CopilotMiniAppsRail({ 
  className = '', 
  onSelectApp,
  activeApp = 'dossier'
}) {
  // Parked back-office tools filtered to avoid duplicating the 4 core doors
  const parkedTools = ADMIN_DEPT_MINI_APPS.filter(a => 
    !['dnn', 'vetting', 'workflows', 'operations'].includes(a.id)
  );

  return (
    <aside className={`w-full bg-[#0a0a0a] border-t border-white/10 px-3 sm:px-4 py-2.5 select-none relative z-30 ${className}`}>
      
      {/* Mini App Rail Header */}
      <div className="flex items-center justify-between pb-1.5 px-0.5 text-[9.5px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-bold uppercase">EXECUTION DOORS:</span>
          <span className="text-stone-400 font-sans hidden sm:inline">Tap to switch Right Panel &amp; tune Charlie &amp; Bob</span>
        </div>
        <div className="flex items-center gap-2 text-stone-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>4 Active Doors</span>
          </span>
          <span>·</span>
          <span>Parked Back-Office</span>
        </div>
      </div>

      {/* Horizontal Scrollable Strip */}
      <div className="flex items-start gap-2.5 sm:gap-3.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        
        {/* ── 4 CORE ACTIVE EXECUTION DOORS (+ DNN) ── */}
        {CORE_EXECUTION_MINIONS.map((app) => {
          const IconComponent = app.icon;
          const isSelected = activeApp === app.id;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onSelectApp && onSelectApp(app.id)}
              className={`flex flex-col items-center text-center shrink-0 p-1.5 rounded-xl transition-all cursor-pointer group min-w-[78px] sm:min-w-[86px] ${
                isSelected 
                  ? 'bg-white/10 ring-2 ring-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.03]' 
                  : 'hover:bg-white/5 active:scale-95'
              }`}
              title={`Open ${app.label} (${app.copy})`}
            >
              {/* App Icon Squircle on Top */}
              <div 
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-gradient-to-br ${app.bgGradient} border ${
                  isSelected ? 'border-white' : app.border
                } flex items-center justify-center shrink-0 relative transition-transform duration-200 group-hover:scale-105 shadow-md`}
                style={{
                  boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.4)' : '0 4px 12px rgba(0,0,0,0.6)',
                }}
              >
                <IconComponent 
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-150 group-hover:scale-110" 
                  style={{ color: app.iconColor }}
                />
                
                {app.badge && (
                  <span className={`absolute -top-1.5 -right-1 text-[7px] font-bold px-1.5 py-0.2 rounded-full border border-black shadow-sm ${app.badgeColor}`}>
                    {app.badge}
                  </span>
                )}

                {isSelected && (
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center shadow">
                    <CheckCircle2 className="w-2.5 h-2.5 text-black stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Copy Below the Mini App */}
              <div className="mt-1 flex flex-col items-center w-full">
                <span className={`text-[10px] sm:text-[11px] font-bold leading-tight truncate max-w-[82px] ${
                  isSelected ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37]'
                }`}>
                  {app.label}
                </span>
                <span className="text-[8px] sm:text-[8.5px] text-stone-400 group-hover:text-stone-300 font-mono truncate max-w-[82px] leading-tight mt-0.5">
                  {app.copy}
                </span>
              </div>
            </button>
          );
        })}

        {/* Subtle Vertical Divider between Active and Parked */}
        <div className="h-14 w-[1px] bg-white/15 shrink-0 self-center mx-1" />

        {/* ── PARKED / BACK-OFFICE MINIONS (SOFTLY DIMMED WITH LOCK) ── */}
        {parkedTools.map((app) => {
          const IconComponent = app.icon;

          return (
            <div
              key={app.id}
              onClick={() => onSelectApp && onSelectApp(app.id, true)}
              className="flex flex-col items-center text-center shrink-0 p-1.5 rounded-xl opacity-45 hover:opacity-85 transition-all cursor-pointer group min-w-[70px] sm:min-w-[78px]"
              title={`${app.label} · Fiduciary Back-Office Module (Managed by Dyson Desk)`}
            >
              {/* App Icon Squircle */}
              <div 
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] bg-gradient-to-br ${app.bgGradient} border border-white/10 flex items-center justify-center shrink-0 relative transition-transform duration-200 group-hover:scale-105 shadow-sm`}
              >
                <IconComponent 
                  className="w-4.5 h-4.5 transition-transform duration-150" 
                  style={{ color: app.iconColor }}
                />
                
                <div className="absolute bottom-1 right-1 bg-black/80 rounded-full p-0.5">
                  <Lock className="w-2 h-2 text-stone-400" />
                </div>
              </div>

              {/* Copy Below */}
              <div className="mt-1 flex flex-col items-center w-full">
                <span className="text-[9.5px] font-medium text-stone-400 group-hover:text-stone-200 truncate max-w-[75px] leading-tight">
                  {app.label}
                </span>
                <span className="text-[7.5px] text-stone-600 font-mono truncate max-w-[75px] leading-tight mt-0.5">
                  Back-Office
                </span>
              </div>
            </div>
          );
        })}

      </div>
    </aside>
  );
}