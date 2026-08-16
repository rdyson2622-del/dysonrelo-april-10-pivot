import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, CheckCircle2, XCircle, Activity, Filter } from 'lucide-react';

const GOLD = '#D4AF37';

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function AdminDispatchLog() {
  const [filter, setFilter] = useState('all');

  const { data: dispatches = [], isLoading } = useQuery({
    queryKey: ['grokDispatches', 'full'],
    queryFn: () => base44.entities.GrokDispatch.list('-created_date', 200),
    refetchInterval: 5000,
  });

  const specialists = useMemo(() => {
    const set = new Set();
    dispatches.forEach(d => { if (d.specialist_name) set.add(d.specialist_name); });
    return Array.from(set).sort();
  }, [dispatches]);

  const filtered = useMemo(() => {
    if (filter === 'all') return dispatches;
    if (filter === 'failed') return dispatches.filter(d => d.status === 'failed');
    return dispatches.filter(d => d.specialist_name === filter);
  }, [dispatches, filter]);

  const stats = useMemo(() => ({
    total: dispatches.length,
    completed: dispatches.filter(d => d.status === 'completed').length,
    failed: dispatches.filter(d => d.status === 'failed').length,
  }), [dispatches]);

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/admin/grok-command" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
          </Link>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6" style={{ color: GOLD }} />
            <div>
              <h1 className="text-2xl font-bold text-white">Dispatch Log</h1>
              <p className="text-sm text-slate-400">Full history of orchestrator → specialist dispatches</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Dispatches</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(34,197,94,0.2)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Completed</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#22c55e' }}>{stats.completed}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Failed</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#ef4444' }}>{stats.failed}</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
          <button
            onClick={() => setFilter('all')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: filter === 'all' ? 'rgba(212,175,55,0.2)' : 'transparent',
              border: `1px solid ${filter === 'all' ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: filter === 'all' ? GOLD : '#888',
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('failed')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: filter === 'failed' ? 'rgba(239,68,68,0.2)' : 'transparent',
              border: `1px solid ${filter === 'failed' ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: filter === 'failed' ? '#ef4444' : '#888',
            }}
          >
            Failed Only
          </button>
          {specialists.map(name => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: filter === name ? 'rgba(212,175,55,0.15)' : 'transparent',
                border: `1px solid ${filter === name ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: filter === name ? GOLD : '#888',
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Dispatch list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: GOLD }} />
            <p className="text-sm text-slate-500">No dispatches match this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => {
              const failed = d.status === 'failed';
              return (
                <div key={d.id} className="rounded-xl p-4" style={{ background: '#111', border: `1px solid ${failed ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.orchestrator_color || GOLD }} />
                    <span className="text-sm font-bold" style={{ color: d.orchestrator_color || GOLD }}>{d.orchestrator_name}</span>
                    {d.specialist_name && (
                      <>
                        <span className="text-slate-500">→</span>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.specialist_color || GOLD }} />
                        <span className="text-sm font-bold" style={{ color: d.specialist_color || GOLD }}>{d.specialist_name}</span>
                      </>
                    )}
                    {failed
                      ? <XCircle className="w-4 h-4 ml-auto" style={{ color: '#ef4444' }} />
                      : <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: '#22c55e' }} />
                    }
                    <span className="text-xs text-slate-500 shrink-0">{formatTime(d.created_date)}</span>
                  </div>

                  {/* Admin question */}
                  <div className="mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Admin Request</p>
                    <p className="text-sm text-white">{d.admin_message}</p>
                  </div>

                  {/* Routing reason */}
                  {d.routing_reason && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Routing Reason</p>
                      <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.routing_reason}</p>
                    </div>
                  )}

                  {/* Specialist response */}
                  {d.specialist_response && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Specialist Response</p>
                      <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-sm whitespace-pre-wrap" style={{ color: '#d0d0d0' }}>{d.specialist_response}</p>
                      </div>
                    </div>
                  )}

                  {/* Direct response (no specialist) */}
                  {!d.specialist_response && d.orchestrator_response && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Response</p>
                      <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-sm whitespace-pre-wrap" style={{ color: '#d0d0d0' }}>{d.orchestrator_response}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}