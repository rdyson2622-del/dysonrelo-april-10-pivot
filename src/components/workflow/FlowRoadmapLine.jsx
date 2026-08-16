import React from 'react';
import { CheckCircle2, AlertTriangle, Loader2, Circle, MapPin, Clock } from 'lucide-react';

/**
 * FlowRoadmapLine — Tesla FSD-style linear route line.
 * Runs across the top of each flow. Color signals show good/bad/stopped.
 * One line, one view, all the clutter goes below.
 */
const STATUS_CONFIG = {
  pending:   { color: '#555',     bg: 'rgba(85,85,85,0.12)',   glow: false, icon: Circle,        label: 'Pending',     spin: false },
  running:   { color: '#D4AF37',  bg: 'rgba(212,175,55,0.18)', glow: true,  icon: Loader2,       label: 'IN PROGRESS', spin: true  },
  completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  glow: false, icon: CheckCircle2,  label: 'DONE',         spin: false },
  flagged:   { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  glow: true,  icon: AlertTriangle, label: 'STOP',         spin: false },
  detour:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', glow: false, icon: MapPin,        label: 'DETOUR',      spin: false },
};

export default function FlowRoadmapLine({ stages, stageStatuses, color, activeStageId, onSelect }) {
  const completedCount = stages.filter(s => stageStatuses[s.id]?.status === 'completed').length;
  const progressPercent = stages.length > 0 ? (completedCount / stages.length) * 100 : 0;

  return (
    <div className="mb-10 mt-2">
      {/* ── THE LINE + MARKERS ── */}
      <div className="relative" style={{ height: '52px' }}>
        {/* Base track */}
        <div
          className="absolute rounded-full"
          style={{ top: '50%', left: '20px', right: '20px', height: '3px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)' }}
        />
        {/* Progress fill */}
        <div
          className="absolute rounded-full transition-all duration-700"
          style={{
            top: '50%',
            left: '20px',
            height: '3px',
            transform: 'translateY(-50%)',
            background: `linear-gradient(90deg, #22c55e 0%, ${color} 100%)`,
            width: `calc((100% - 40px) * ${progressPercent / 100})`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
        {/* Markers */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {stages.map((s) => {
            const status = stageStatuses[s.id]?.status || 'pending';
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isActive = activeStageId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                className="relative group transition-transform hover:scale-110"
                style={{ zIndex: 10 }}
              >
                <div
                  className="rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    width: isActive ? 42 : 34,
                    height: isActive ? 42 : 34,
                    background: cfg.bg,
                    border: `2.5px solid ${cfg.color}`,
                    boxShadow: cfg.glow ? `0 0 20px ${cfg.color}, 0 0 6px ${cfg.color}` : 'none',
                  }}
                >
                  <Icon
                    className={isActive ? 'w-5 h-5' : 'w-4 h-4'}
                    style={{ color: cfg.color }}
                    spin={cfg.spin ? true : undefined}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LABELS ROW ── */}
      <div className="flex justify-between px-1 mt-1">
        {stages.map((s) => {
          const status = stageStatuses[s.id]?.status || 'pending';
          const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
          const isActive = activeStageId === s.id;
          const action = stageStatuses[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className="flex flex-col items-center text-center group"
              style={{ width: '130px', flexShrink: 0 }}
            >
              <p className="text-[8px] font-black tracking-[0.15em] uppercase mb-0.5" style={{ color: cfg.color }}>
                {cfg.label}
              </p>
              <p
                className="text-xs font-serif leading-tight"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: isActive ? 600 : 400 }}
              >
                {s.title}
              </p>
              {status === 'completed' && action?.duration_ms && (
                <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {(action.duration_ms / 1000).toFixed(1)}s
                </p>
              )}
              {status === 'flagged' && action?.flag_reason && (
                <p className="text-[9px] mt-0.5 italic leading-tight max-w-[120px] line-clamp-2" style={{ color: '#ef4444' }}>
                  ⛔ {action.flag_reason}
                </p>
              )}
              {status === 'running' && (
                <p className="text-[9px] mt-0.5" style={{ color: '#D4AF37' }}>●●●</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}