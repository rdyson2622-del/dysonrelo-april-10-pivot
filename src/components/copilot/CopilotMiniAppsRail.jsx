import React from 'react';
import { Eye, Lock } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import { ADMIN_DEPT_MINI_APPS } from '@/components/admin/AdminMiniAppsGrid';

/**
 * CopilotMiniAppsRail
 * 
 * Complete 24-App Department Mini App Library on the far-left of Page 2 (Command Center),
 * pulling directly from the canonical Admin Department Mini Apps suite.
 */
export default function CopilotMiniAppsRail({ className = '', onSelectApp }) {
  return (
    <aside className={`w-full lg:w-[130px] xl:w-[136px] bg-[#0c0c0c] border-b lg:border-b-0 lg:border-r border-white/10 p-2 flex flex-col shrink-0 select-none max-h-[960px] overflow-visible relative z-30 ${className}`}>
      <div className="space-y-2">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center pb-2 border-b border-white/10 gap-0.5">
          <DysonVerticalBadge height={28} />
          <div>
            <h2 className="text-[9px] font-serif font-normal text-white tracking-wider leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              DYSON &amp; DYSON
            </h2>
            <span className="text-[6.5px] uppercase tracking-widest text-[#D4AF37] block font-mono font-semibold">
              AI MINIONS ENGINE
            </span>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[8px]">
          <div className="flex items-center gap-1 text-stone-300 min-w-0">
            <Eye className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
            <span className="text-[7.5px] font-semibold truncate">Active Desks</span>
          </div>
          <span className="text-[6.5px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono uppercase tracking-wider shrink-0 font-bold">
            {ADMIN_DEPT_MINI_APPS.length} LIVE
          </span>
        </div>

        {/* Mini Apps Scrollable List */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[7px] font-bold uppercase tracking-wider text-stone-400 truncate">
              MINI APPS ({ADMIN_DEPT_MINI_APPS.length})
            </span>
            <span className="text-[6px] text-stone-500 font-mono">STANDBY</span>
          </div>

          <div className="space-y-1 max-h-[580px] lg:max-h-[660px] overflow-y-auto pr-0.5 scrollbar-thin">
            {ADMIN_DEPT_MINI_APPS.map((app) => {
              const IconComponent = app.icon;
              const isDNN = app.id === 'dnn';

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApp?.(app)}
                  className={`p-1 rounded-md bg-[#121212] hover:bg-[#181818] border border-white/5 hover:border-[#D4AF37]/50 flex items-center justify-between transition-all cursor-pointer group ${
                    isDNN ? 'ring-1 ring-rose-500/40 bg-rose-950/20' : ''
                  }`}
                  title={`${app.label} · ${app.copy} (Click to engage)`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* App Icon Squircle */}
                    <div 
                      className={`w-5 h-5 rounded-[6px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shrink-0 relative`}
                      style={{
                        boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      }}
                    >
                      <IconComponent 
                        className="w-2.5 h-2.5 transition-transform duration-150 group-hover:scale-110" 
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

                    {/* App Name and Sub-Label */}
                    <div className="min-w-0 flex flex-col">
                      <div className="text-[7.5px] font-semibold text-stone-200 group-hover:text-white truncate leading-tight">
                        {app.label}
                      </div>
                      <div className="text-[6.5px] text-stone-500 group-hover:text-stone-400 truncate leading-tight font-mono">
                        {app.copy}
                      </div>
                    </div>
                  </div>

                  <Lock className="w-2 h-2 text-stone-600 group-hover:text-stone-400 shrink-0 ml-0.5" />
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