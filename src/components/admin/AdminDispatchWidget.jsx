import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';

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
  const queryClient = useQueryClient();

  const { data: dispatches = [] } = useQuery({
    queryKey: ['grokDispatches'],
    queryFn: () => base44.entities.GrokDispatch.list('-created_date', 5),
    refetchInterval: 4000,
  });

  const recent = dispatches.slice(0, 3);

  return (
    <div className="mx-3 mb-2 p-3 rounded-lg" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ color: GOLD }}
        >
          {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          📡 Recent Dispatches
        </button>
        <Link to="/admin/grok-command">
          <ArrowRight className="w-3 h-3 hover:scale-110 transition-transform" style={{ color: GOLD }} />
        </Link>
      </div>

      {open && (
        <div className="space-y-2 mt-2">
          {recent.length > 0 ? (
            recent.map((d) => (
              <div key={d.id} className="text-xs">
                {/* Orchestrator → Specialist badge */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: d.orchestrator_color || GOLD }}
                  />
                  <span className="font-bold truncate" style={{ color: d.orchestrator_color || GOLD, fontSize: '10px' }}>
                    {d.orchestrator_name}
                  </span>
                  {d.specialist_name && (
                    <>
                      <span className="text-slate-500" style={{ fontSize: '9px' }}>→</span>
                      <span className="font-bold truncate" style={{ color: d.specialist_color || GOLD, fontSize: '10px' }}>
                        {d.specialist_name}
                      </span>
                    </>
                  )}
                  <span className="text-slate-500 ml-auto shrink-0" style={{ fontSize: '9px' }}>
                    {timeAgo(d.created_date)}
                  </span>
                </div>
                {/* Truncated response */}
                <p className="truncate pl-3.5" style={{ color: '#fff', fontSize: '10px' }}>
                  {d.specialist_response || d.orchestrator_response || '—'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No dispatches yet</p>
          )}
        </div>
      )}
    </div>
  );
}