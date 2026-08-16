import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAllDeskStatuses } from '@/hooks/useStageStatuses';
import {
  WORKFLOW_DESKS, getFlow,
} from '@/lib/departmentWorkflows';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Loader2, Circle,
  Clock, Star, MapPin, Activity, Zap
} from 'lucide-react';

const GOLD = '#D4AF37';

const STATUS_CONFIG = {
  pending:   { color: '#666',     bg: 'rgba(255,255,255,0.03)', icon: Circle,        label: 'Pending',   glow: false },
  running:   { color: '#D4AF37',  bg: 'rgba(212,175,55,0.15)',  icon: Loader2,       label: 'In Progress', glow: true  },
  completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: CheckCircle2,  label: 'Completed', glow: false },
  flagged:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: AlertTriangle, label: 'Stopped',   glow: true  },
  detour:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: MapPin,        label: 'Detour',    glow: false },
};

function StatusLight({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${sizeClass}`}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.color}50`,
        boxShadow: cfg.glow ? `0 0 8px ${cfg.color}80` : 'none',
      }}
    >
      <Icon
        className={`${sizeClass} ${status === 'running' ? 'animate-spin' : ''}`}
        style={{ color: cfg.color }}
      />
    </div>
  );
}

function DeskRoadmap({ desk, stageStatuses, totals }) {
  const flow = getFlow(desk.id);
  if (!flow) return null;

  const stages = flow.stages;
  const hasAny = Object.keys(stageStatuses || {}).length > 0;

  return (
    <Link
      to={`/admin/workflows/${desk.id}`}
      className="block rounded-2xl p-5 transition-all hover:scale-[1.01]"
      style={{ background: '#111', border: `1px solid ${desk.color}30` }}
    >
      {/* Desk header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{desk.icon}</span>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: desk.color }}>
              {desk.specialist}
            </p>
            <h3 className="text-base font-serif text-white">{desk.name}</h3>
          </div>
        </div>
        {/* Totals */}
        <div className="flex items-center gap-3">
          {totals?.active > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: GOLD }}>
              <Zap className="w-3 h-3" /> {totals.active} active
            </span>
          )}
          {totals?.flagged > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#ef4444' }}>
              <AlertTriangle className="w-3 h-3" /> {totals.flagged} stopped
            </span>
          )}
          {totals?.completed > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#22c55e' }}>
              <CheckCircle2 className="w-3 h-3" /> {totals.completed} done
            </span>
          )}
          {!hasAny && (
            <span className="text-[10px] text-gray-600">No actions yet</span>
          )}
        </div>
      </div>

      {/* Stage flow with status lights */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {stages.map((s, idx) => {
          const action = stageStatuses?.[s.id];
          const status = action?.status || 'pending';
          const cfg = STATUS_CONFIG[status];
          return (
            <React.Fragment key={s.id}>
              <div
                className="shrink-0 rounded-xl px-3 py-2.5 min-w-[140px] transition-all"
                style={{
                  background: cfg.bg,
                  border: `1.5px solid ${cfg.color}${status === 'pending' ? '30' : '60'}`,
                  boxShadow: cfg.glow ? `0 0 12px ${cfg.color}40` : 'none',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <StatusLight status={status} />
                  <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                  {action?.duration_ms && status === 'completed' && (
                    <span className="text-[9px] text-gray-500 ml-auto flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {(action.duration_ms / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                <p className="text-xs font-serif text-white leading-tight">{s.title}</p>
                {status === 'flagged' && action?.flag_reason && (
                  <p className="text-[9px] mt-1 italic line-clamp-1" style={{ color: '#ef4444' }}>
                    ⛔ {action.flag_reason}
                  </p>
                )}
              </div>
              {idx < stages.length - 1 && (
                <div className="w-4 h-px shrink-0" style={{ background: `${desk.color}40` }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Link>
  );
}

export default function RoadMapToCompletion() {
  const navigate = useNavigate();
  const { deskMap, totals } = useAllDeskStatuses();

  // Global summary
  let totalActive = 0, totalCompleted = 0, totalFlagged = 0;
  Object.values(totals).forEach(t => {
    totalActive += t.active;
    totalCompleted += t.completed;
    totalFlagged += t.flagged;
  });

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg mb-3"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            >
              <ArrowLeft className="w-4 h-4" /> Admin home
            </Link>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>
              One glance · all projects underway
            </p>
            <h1 className="text-3xl font-serif" style={{ color: GOLD }}>Road Map to Completion</h1>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Every department, every stage, lit up in real time. Green = done. Gold = in progress. Red = stopped (401 flag). Follow the lights.
            </p>
          </div>
        </div>

        {/* Global summary bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <SummaryCard
            icon={Loader2}
            label="In Progress"
            value={totalActive}
            color="#D4AF37"
            spin
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Completed"
            value={totalCompleted}
            color="#22c55e"
          />
          <SummaryCard
            icon={AlertTriangle}
            label="Stopped (401)"
            value={totalFlagged}
            color="#ef4444"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 text-[10px]">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <StatusLight status={key} />
              <span style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Desk roadmaps */}
        <div className="space-y-4">
          {WORKFLOW_DESKS.filter(d => d.id !== 'knowledge').map(desk => (
            <DeskRoadmap
              key={desk.id}
              desk={desk}
              stageStatuses={deskMap[desk.id]}
              totals={totals[desk.id]}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color: GOLD }} />
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>
              Review Process
            </p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Completed routes show a timer and a 5-star review. Stopped routes show the 401 flag reason and require a human clear before the flow can continue. Detours show a direction change — the stage was re-run after a flag was cleared.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, spin }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: '#111', border: `1px solid ${color}30` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}40` }}
      >
        <Icon className={`w-6 h-6 ${spin ? 'animate-spin' : ''}`} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color }}>{value}</p>
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}