import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronDown, ChevronRight, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const GOLD = '#D4AF37';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function AdminDispatchWidget() {
  const [open, setOpen] = useState(true);

  const { data: dispatches = [] } = useQuery({
    queryKey: ['grokDispatches'],
    queryFn: () => base44.entities.GrokDispatch.list('-created_date', 20),
    refetchInterval: 4000,
  });

  return (
    <div className="mx-3 mb-2 rounded-lg overflow-hidden" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ color: GOLD }}
        >
          {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          📡 Dispatch Log
        </button>
        <Link to="/admin/dispatch-log" title="View full log">
          <ArrowRight className="w-3 h-3 hover:scale-110 transition-transform" style={{ color: GOLD }} />
        </Link>
      </div>

      {/* Scrollable dispatch list */}
      {open && (
        <>
          <div className="space-y-1.5 px-3 pb-2 max-h-80 overflow-y-auto">
            {dispatches.length > 0 ? (
              dispatches.map((d) => {
                const failed = d.status === 'failed';
                return (
                  <div key={d.id} className="rounded-md p-2" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${failed ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                    {/* Top row: orchestrator → specialist + status + time */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.orchestrator_color || GOLD }} />
                      <span className="font-bold truncate" style={{ color: d.orchestrator_color || GOLD, fontSize: '10px' }}>
                        {d.orchestrator_name}
                      </span>
                      {d.specialist_name && (
                        <>
                          <span className="text-slate-500 shrink-0" style={{ fontSize: '9px' }}>→</span>
                          <span className="font-bold truncate" style={{ color: d.specialist_color || GOLD, fontSize: '10px' }}>
                            {d.specialist_name}
                          </span>
                        </>
                      )}
                      {failed
                        ? <XCircle className="w-3 h-3 shrink-0 ml-auto" style={{ color: '#ef4444' }} />
                        : <CheckCircle2 className="w-3 h-3 shrink-0 ml-auto" style={{ color: '#22c55e' }} />
                      }
                      <span className="text-slate-500 shrink-0" style={{ fontSize: '9px' }}>
                        {timeAgo(d.created_date)}
                      </span>
                    </div>
                    {/* Admin question */}
                    <p className="truncate mb-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                      <span style={{ color: GOLD }}>Q:</span> {d.admin_message}
                    </p>
                    {/* Specialist response — 2 lines */}
                    <p className="line-clamp-2" style={{ color: '#fff', fontSize: '10px', lineHeight: '1.3' }}>
                      {d.specialist_response || d.orchestrator_response || '—'}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 py-2 text-center">No dispatches yet</p>
            )}
          </div>
          {/* Footer link */}
          <Link
            to="/admin/dispatch-log"
            className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold tracking-wider transition-colors hover:bg-white/5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: GOLD }}
          >
            VIEW FULL LOG →
          </Link>
        </>
      )}
    </div>
  );
}