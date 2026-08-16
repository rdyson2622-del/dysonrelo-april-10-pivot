import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, Loader2, Activity
} from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * WorkflowActionLog — desk-wide history of all stage executions.
 * Shows the accountability chain: who ran what, when, and what happened.
 */
export default function WorkflowActionLog({ deskId, color }) {
  const deskColor = color || GOLD;

  const { data: allActions = [], isLoading } = useQuery({
    queryKey: ['workflowActions', deskId],
    queryFn: () => base44.entities.WorkflowAction.filter(
      { desk_id: deskId },
      '-created_date',
      50
    ),
    refetchInterval: 4000,
    enabled: !!deskId,
  });

  // Prefer real actions; fall back to dummies as the model when nothing real exists
  const realActions = allActions.filter(a => !a.is_dummy);
  const actions = (realActions.length > 0 ? realActions : allActions).slice(0, 20);
  const showingModel = realActions.length === 0 && allActions.length > 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 flex items-center justify-center" style={{ background: '#111', border: `1px solid ${deskColor}25` }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: deskColor }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: '#111', border: `1px solid ${deskColor}25` }}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4" style={{ color: deskColor }} />
        <p className="text-xs font-black tracking-widest uppercase" style={{ color: deskColor }}>
          Accountability Log — Last 20 Actions
        </p>
        {showingModel && (
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold ml-auto" style={{ background: 'rgba(212,175,55,0.15)', color: deskColor, border: `1px solid ${deskColor}40` }}>
            MODEL
          </span>
        )}
      </div>

      {actions.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          No actions executed yet. Run a stage above to start the accountability chain.
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {actions.map(a => {
            const isFlagged = a.status === 'flagged' || a.flag_type !== 'none';
            const isRunning = a.status === 'running';
            const isCompleted = a.status === 'completed';
            const icon = isFlagged
              ? <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
              : isRunning
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: deskColor }} />
                : isCompleted
                  ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                  : <XCircle className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />;

            return (
              <div
                key={a.id}
                className="rounded-lg p-3"
                style={{
                  background: '#1a1a1a',
                  border: `1px solid ${isFlagged ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {icon}
                  <span className="text-xs font-bold" style={{ color: isFlagged ? '#ef4444' : deskColor }}>
                    {a.stage_title || a.stage_id}
                  </span>
                  {a.flag_cleared && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                      CLEARED
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500 ml-auto flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(a.created_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                {a.input_text && (
                  <p className="text-[11px] text-gray-400 mb-1 truncate">
                    <span className="text-gray-600">In:</span> {a.input_text}
                  </p>
                )}
                {a.output && (
                  <p className="text-[11px] text-gray-300 line-clamp-2">
                    <span className="text-gray-600">Out:</span> {a.output}
                  </p>
                )}
                {isFlagged && !a.flag_cleared && a.flag_reason && (
                  <p className="text-[10px] mt-1 italic" style={{ color: '#ef4444' }}>
                    ⛔ {a.flag_reason}
                  </p>
                )}
                {a.entity_ref && (
                  <p className="text-[9px] text-gray-600 mt-1 font-mono">→ {a.entity_ref}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}