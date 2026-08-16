import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  CheckCircle2, AlertTriangle, Loader2, Circle, Clock,
  TrendingUp, Award, Zap, Sparkles, ArrowLeft, ExternalLink
} from 'lucide-react';
import OrderFlowModal from '@/components/roadmap/OrderFlowModal';

const GOLD = '#D4AF37';

const STATUS_CONFIG = {
  requested:   { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: Circle,        label: 'Requested',   glow: false, spin: false },
  queued:      { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', icon: Clock,         label: 'Queued',      glow: false, spin: false },
  in_progress: { color: '#D4AF37', bg: 'rgba(212,175,55,0.18)',  icon: Loader2,       label: 'In Progress', glow: true,  spin: true  },
  completed:   { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: CheckCircle2,  label: 'Completed',   glow: false, spin: false },
  flagged:     { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   icon: AlertTriangle, label: 'Flagged',     glow: true,  spin: false },
  cancelled:   { color: '#4b5563', bg: 'rgba(75,85,99,0.12)',   icon: Circle,        label: 'Cancelled',   glow: false, spin: false },
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#111', border: `1px solid ${color}30` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
          <Icon className={`w-4 h-4 ${label === 'In Progress' ? 'animate-spin' : ''}`} style={{ color }} />
        </div>
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      </div>
      <p className="text-3xl font-serif" style={{ color }}>{value}</p>
    </div>
  );
}

function MasterLine({ items }) {
  const completed = items.filter(i => i.status === 'completed').length;
  const progress = items.length > 0 ? (completed / items.length) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="relative" style={{ height: '52px' }}>
        <div className="absolute rounded-full" style={{ top: '50%', left: '20px', right: '20px', height: '3px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute rounded-full transition-all duration-700" style={{
          top: '50%', left: '20px', height: '3px', transform: 'translateY(-50%)',
          background: `linear-gradient(90deg, #22c55e 0%, ${GOLD} 100%)`,
          width: `calc((100% - 40px) * ${progress / 100})`,
          boxShadow: `0 0 8px ${GOLD}80`,
        }} />
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {items.map((item, idx) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.requested;
            const Icon = cfg.icon;
            return (
              <div key={item.id || idx} className="relative group" style={{ zIndex: 10 }}>
                <div className="rounded-full flex items-center justify-center transition-all duration-300" style={{
                  width: 34, height: 34,
                  background: cfg.bg, border: `2.5px solid ${cfg.color}`,
                  boxShadow: cfg.glow ? `0 0 16px ${cfg.color}, 0 0 4px ${cfg.color}` : 'none',
                }}>
                  <Icon className={`w-4 h-4 ${cfg.spin ? 'animate-spin' : ''}`} style={{ color: cfg.color }} />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: '#1a1a1a', border: `1px solid ${cfg.color}40`, color: '#fff' }}>
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AccomplishmentCard({ item, onOrder }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(34,197,94,0.25)' }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-serif text-white truncate">{item.title}</h3>
            {item.is_dummy && <span className="text-[8px] px-1 py-0.5 rounded font-bold shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: `1px solid ${GOLD}40` }}>MODEL</span>}
          </div>
          {item.result_summary && <p className="text-xs text-gray-400 leading-relaxed mb-2">{item.result_summary}</p>}
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
            {item.agi_agent && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" style={{ color: GOLD }} />
                <span style={{ color: GOLD }}>{item.agi_agent}</span>
              </span>
            )}
            {item.duration_ms && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {(item.duration_ms / 1000).toFixed(1)}s
              </span>
            )}
            {item.completed_at && (
              <span>{new Date(item.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
            {item.desk_name && (
              <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{item.desk_name}</span>
            )}
            {item.result_url && (
              <a href={item.result_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-dyson-gold hover:underline">
                View <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>
      {onOrder && (
        <button
          onClick={() => onOrder(item)}
          className="mt-3 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <Zap className="w-3 h-3" /> I Need This Too
        </button>
      )}
    </div>
  );
}

function InFlightCard({ item, onOrder }) {
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.requested;
  const Icon = cfg.icon;
  return (
    <div className="rounded-xl p-3" style={{ background: '#111', border: `1px solid ${cfg.color}30` }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${cfg.spin ? 'animate-spin' : ''}`} style={{ color: cfg.color }} />
        <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: cfg.color }}>{cfg.label}</span>
        {item.is_dummy && <span className="text-[8px] px-1 py-0.5 rounded font-bold ml-auto" style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: `1px solid ${GOLD}40` }}>MODEL</span>}
      </div>
      <h3 className="text-sm font-serif text-white mb-1">{item.title}</h3>
      {item.request_text && <p className="text-[11px] text-gray-500 line-clamp-2 mb-1">{item.request_text}</p>}
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        {item.agi_agent && <span style={{ color: GOLD }}>{item.agi_agent}</span>}
        {item.flag_reason && <span style={{ color: '#ef4444' }}>⛔ {item.flag_reason}</span>}
      </div>
      {onOrder && (
        <button
          onClick={() => onOrder(item)}
          className="mt-2 flex items-center gap-1 text-[10px] font-bold transition-all hover:scale-[1.02]"
          style={{ color: GOLD }}
        >
          <Zap className="w-2.5 h-2.5" /> Order This
        </button>
      )}
    </div>
  );
}

export default function MasterShowSheet() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('weekly');
  const [orderModal, setOrderModal] = useState(null);

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['subscriberRoadmaps'],
    queryFn: () => base44.entities.SubscriberRoadmap.list('-requested_at', 100),
    refetchInterval: 5000,
  });

  // Period filter
  const periodFiltered = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (period === 'daily') cutoff.setDate(now.getDate() - 1);
    else if (period === 'weekly') cutoff.setDate(now.getDate() - 7);
    else cutoff.setMonth(now.getMonth() - 1);
    return allItems.filter(i => {
      const d = new Date(i.requested_at || i.created_date);
      return d >= cutoff;
    });
  }, [allItems, period]);

  // Prefer real, fall back to dummies as the model
  const realItems = periodFiltered.filter(i => !i.is_dummy);
  const isModelMode = realItems.length === 0;
  const items = realItems.length > 0 ? realItems : periodFiltered;

  const stats = {
    requested: items.length,
    inProgress: items.filter(i => ['in_progress', 'queued'].includes(i.status)).length,
    completed: items.filter(i => i.status === 'completed').length,
    flagged: items.filter(i => i.status === 'flagged').length,
  };
  const completionRate = stats.requested > 0 ? Math.round((stats.completed / stats.requested) * 100) : 0;
  const completedItems = items.filter(i => i.status === 'completed');
  const avgDuration = completedItems.length > 0
    ? completedItems.reduce((s, i) => s + (i.duration_ms || 0), 0) / completedItems.length / 1000
    : 0;
  const agiCount = new Set(items.map(i => i.agi_agent).filter(Boolean)).size;

  const accomplishments = [...completedItems].sort((a, b) =>
    new Date(b.completed_at || b.requested_at) - new Date(a.completed_at || a.requested_at)
  );
  const inFlight = items.filter(i => ['in_progress', 'queued', 'requested', 'flagged'].includes(i.status));

  const periods = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dyson-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>
              {isModelMode ? 'Model Show Sheet' : 'Master Show Sheet'}
            </p>
            <h1 className="text-3xl font-serif">Roadmaps Requested & Accomplished</h1>
            <p className="text-sm text-gray-400 mt-1">Every request, every AGI agent, every outcome — in one view.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOrderModal({})}
              className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-black transition-all hover:scale-[1.03]"
              style={{ background: GOLD }}
            >
              <Zap className="w-4 h-4" /> Request a Roadmap
            </button>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        {/* Period toggle */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {periods.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)} className="text-xs px-4 py-2 rounded-lg font-bold transition-all" style={{
              background: period === p.id ? `${GOLD}18` : 'transparent',
              border: `1px solid ${period === p.id ? GOLD : 'rgba(255,255,255,0.12)'}`,
              color: period === p.id ? GOLD : '#aaa',
            }}>
              {p.label}
            </button>
          ))}
          {isModelMode && (
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse ml-auto" style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: `1px solid ${GOLD}40` }}>
              ● LIVE DEMO
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Zap} label="Requested" value={stats.requested} color={GOLD} />
          <StatCard icon={Loader2} label="In Progress" value={stats.inProgress} color="#D4AF37" />
          <StatCard icon={Award} label="Completed" value={stats.completed} color="#22c55e" />
          <StatCard icon={AlertTriangle} label="Flagged" value={stats.flagged} color="#ef4444" />
        </div>

        {/* Master roadmap line */}
        {items.length > 0 && <MasterLine items={items} />}

        {/* Two columns */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Accomplishments */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5" style={{ color: '#22c55e' }} />
              <h2 className="text-lg font-serif">Accomplishments</h2>
              <span className="text-xs text-gray-500">({accomplishments.length})</span>
            </div>
            {accomplishments.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center rounded-xl" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
                No accomplishments yet for this period. AGI agents are working on it.
              </p>
            ) : (
              <div className="space-y-3">
                {accomplishments.map(item => <AccomplishmentCard key={item.id} item={item} onOrder={setOrderModal} />)}
              </div>
            )}
          </div>

          {/* In Flight + Analytics */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="text-lg font-serif">In Flight</h2>
                <span className="text-xs text-gray-500">({inFlight.length})</span>
              </div>
              {inFlight.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center rounded-xl" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
                  Nothing in the queue. Request a roadmap to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {inFlight.map(item => <InFlightCard key={item.id} item={item} onOrder={setOrderModal} />)}
                </div>
              )}
            </div>

            {/* Analytics */}
            <div className="rounded-xl p-5" style={{ background: '#111', border: `1px solid ${GOLD}25` }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>Performance</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Completion Rate</span>
                  <span className="text-lg font-serif" style={{ color: '#22c55e' }}>{completionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Avg Time to Complete</span>
                  <span className="text-lg font-serif" style={{ color: GOLD }}>{avgDuration > 0 ? `${avgDuration.toFixed(1)}s` : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">AGI Agents Engaged</span>
                  <span className="text-lg font-serif" style={{ color: GOLD }}>{agiCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {orderModal && (
        <OrderFlowModal
          prefill={orderModal}
          onClose={() => setOrderModal(null)}
          onOrdered={() => setOrderModal(null)}
        />
      )}
    </div>
  );
}