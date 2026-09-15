import React from 'react';
import { Lock } from 'lucide-react';
import { ADMIN_DEPT_MINI_APPS } from '@/components/admin/AdminMiniAppsGrid';

/**
 * CopilotMiniAppsRail
 * 
 * Bottom horizontal strip of 24 Department Mini Apps on Slide 2 (Command Center),
 * with the squircle mini app icon on top and the copy/sub-labels directly below.
 */
export default function CopilotMiniAppsRail({ className = '', onSelectApp }) {
  return (
    <aside className={`w-full bg-[#0c0c0c] border-t border-white/10 p-3 sm:p-4 select-none relative z-30 ${className}`}>
      {/* Horizontal Scrollable Strip: Mini Apps with Copy Below */}
      <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-1.5 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {ADMIN_DEPT_MINI_APPS.map((app) => {
          const IconComponent = app.icon;
          const isDNN = app.id === 'dnn';

          return (
            <div
              key={app.id}
              onClick={() => onSelectApp && onSelectApp(app.id)}
              className={`flex flex-col items-center text-center shrink-0 p-1.5 rounded-xl hover:bg-white/5 transition-all cursor-default group min-w-[76px] sm:min-w-[84px] ${
                isDNN ? 'ring-1 ring-rose-500/40 bg-rose-950/20' : ''
              }`}
              title={`${app.label} · ${app.copy}`}
            >
              {/* App Icon Squircle on Top */}
              <div 
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] bg-gradient-to-br ${app.bgGradient} border ${app.border} flex items-center justify-center shrink-0 relative transition-transform duration-200 group-hover:scale-105 shadow-md`}
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                }}
              >
                <IconComponent 
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-150 group-hover:scale-110" 
                  style={{ color: app.iconColor }}
                />
                
                {app.badgeCount && (
                  <span className={`absolute -top-1 -right-1 text-[7px] font-bold px-1 py-0.2 rounded-full border border-black ${
                    app.badgeCount === 'LIVE' 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : app.badgeCount === 'V2V'
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {app.badgeCount}
                  </span>
                )}

                <div className="absolute bottom-1 right-1">
                  <Lock className="w-2.5 h-2.5 text-stone-500/80 group-hover:text-stone-300" />
                </div>
              </div>

              {/* Copy Below the Mini App */}
              <div className="mt-1.5 flex flex-col items-center w-full">
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-200 group-hover:text-white truncate max-w-[80px] leading-tight">
                  {app.label}
                </span>
                <span className="text-[8px] sm:text-[8.5px] text-stone-500 group-hover:text-stone-400 font-mono truncate max-w-[80px] leading-tight mt-0.5">
                  {app.copy}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}