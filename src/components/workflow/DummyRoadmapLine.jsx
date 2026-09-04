import React from 'react';
import { CheckCircle2, AlertTriangle, Loader2, Circle } from 'lucide-react';

const STATUS_CONFIG = {
  requested:   { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: Circle,       glow: false, spin: false },
  queued:      { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', icon: Circle,       glow: false, spin: false },
  in_progress: { color: '#D4AF37', bg: 'rgba(212,175,55,0.18)',  icon: Loader2,      glow: true,  spin: true  },
  completed:   { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: CheckCircle2, glow: false, spin: false },
  flagged:     { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   icon: AlertTriangle, glow: true, spin: false },
  cancelled:   { color: '#4b5563', bg: 'rgba(75,85,99,0.12)',    icon: Circle,       glow: false, spin: false },
};

/**
 * DummyRoadmapLine — the "Show Sheet" style live milestone line: a single
 * straight row of circles that light up green when met and red when
 * friction is flagged, with a hover tooltip for the item title. Stays a
 * straight line at any width (horizontal scroll on narrow viewports
 * instead of wrapping).
 */
export default function DummyRoadmapLine({ items, color = '#D4AF37' }) {
  const completed = items.filter((i) => i.status === 'completed').length;
  const progress = items.length > 0 ? (completed / items.length) * 100 : 0;

  return (
    <div className="overflow-x-auto">
      <div className="relative" style={{ height: 52, minWidth: items.length * 46 }}>
        <div className="absolute rounded-full" style={{ top: '50%', left: '20px', right: '20px', height: '3px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)' }} />
        <div
          className="absolute rounded-full transition-all duration-700"
          style={{
            top: '50%', left: '20px', height: '3px', transform: 'translateY(-50%)',
            background: `linear-gradient(90deg, #22c55e 0%, ${color} 100%)`,
            width: `calc((100% - 40px) * ${progress / 100})`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {items.map((item, idx) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.requested;
            const Icon = cfg.icon;
            return (
              <div key={item.id || idx} className="relative group shrink-0" style={{ zIndex: 10 }}>
                <div
                  className="rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    width: 34, height: 34,
                    background: cfg.bg, border: `2.5px solid ${cfg.color}`,
                    boxShadow: cfg.glow ? `0 0 16px ${cfg.color}, 0 0 4px ${cfg.color}` : 'none',
                  }}
                >
                  <Icon className={`w-4 h-4 ${cfg.spin ? 'animate-spin' : ''}`} style={{ color: cfg.color }} />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: '#1a1a1a', border: `1px solid ${cfg.color}40`, color: '#fff' }}>
                  {item.title}
                  {item.status === 'flagged' && item.flag_reason && (
                    <span style={{ color: '#ef4444' }}> — {item.flag_reason}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}