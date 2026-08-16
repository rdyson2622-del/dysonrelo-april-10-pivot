import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import {
  Loader2, Play, CheckCircle2, XCircle, AlertTriangle, Shield,
  ExternalLink, Clock, User, MapPin, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * WorkflowActionPanel — the interactive transparency layer.
 *
 * Replaces the static StageDetail with a live, executable panel that shows:
 *   - White copy: WHAT / WHY / WHO / WHEN / WHERE
 *   - Input area for the operator
 *   - Execute button (calls the stage's export_target backend function)
 *   - Live status (pending → running → completed/failed/flagged)
 *   - 401 flag display (blocks the flow until a human clears it)
 *   - Result + link to the created/updated entity
 *
 * Every execution is logged to the WorkflowAction entity for accountability.
 */
export default function WorkflowActionPanel({ stage, desk, onActionLogged }) {
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const [action, setAction] = useState(null); // { status, output, flag, entity_ref }
  const [executing, setExecuting] = useState(false);

  if (!stage) return null;

  const exportTarget = stage.export_target;
  const canExecute = !!exportTarget && !executing;

  const handleExecute = async () => {
    if (!exportTarget || executing) return;
    setExecuting(true);
    setAction({ status: 'running' });

    const startTime = Date.now();
    let actionRecord = null;

    try {
      // 1. Create a WorkflowAction log record (status = running)
      actionRecord = await base44.entities.WorkflowAction.create({
        desk_id: desk.id,
        stage_id: stage.id,
        stage_title: stage.title,
        desk_name: desk.name,
        input_text: input,
        function_name: exportTarget.function,
        status: 'running',
        flag_type: 'none',
      });

      // 2. Invoke the backend function
      const payload = exportTarget.default_payload || {};
      if (input) payload.user_input = input;
      const res = await base44.functions.invoke(exportTarget.function, payload);
      const data = res?.data || res;
      const duration = Date.now() - startTime;

      // 3. Detect 401 / flag conditions
      let flagType = 'none';
      let flagReason = '';
      let status = 'completed';

      if (data?.error || data?.status === 'error') {
        flagType = 'error';
        flagReason = data.error || data.details || 'Function returned an error';
        status = 'flagged';
      } else if (data?.status === 401 || data?.code === 401) {
        flagType = 'auth_401';
        flagReason = 'Authentication or credit limit reached — human review required';
        status = 'flagged';
      } else if (!data && duration > 25000) {
        flagType = 'timeout';
        flagReason = 'Function did not respond in time';
        status = 'flagged';
      }

      const outputText = typeof data === 'string'
        ? data
        : data?.message || data?.summary || JSON.stringify(data)?.slice(0, 500);
      const entityRef = data?.entity_ref || data?.broadcast_id || data?.article_id || '';

      // 4. Update the WorkflowAction record with the result
      await base44.entities.WorkflowAction.update(actionRecord.id, {
        status,
        output: outputText,
        output_payload: typeof data === 'object' ? data : { value: data },
        flag_type: flagType,
        flag_reason: flagReason,
        entity_ref: entityRef ? `${exportTarget.entity || 'Entity'}:${entityRef}` : '',
        duration_ms: duration,
      });

      setAction({
        status,
        output: outputText,
        flag: flagType,
        flagReason,
        entityRef,
        duration,
      });

      // 5. Invalidate queries so the log refreshes
      queryClient.invalidateQueries({ queryKey: ['workflowActions'] });
      queryClient.invalidateQueries({ queryKey: ['workflowActions', desk.id] });
      if (onActionLogged) onActionLogged();
    } catch (e) {
      const duration = Date.now() - startTime;
      const flagReason = e.message || 'Execution failed';
      if (actionRecord) {
        await base44.entities.WorkflowAction.update(actionRecord.id, {
          status: 'flagged',
          flag_type: 'error',
          flag_reason: flagReason,
          duration_ms: duration,
        });
      }
      setAction({
        status: 'flagged',
        flag: 'error',
        flagReason,
        output: '',
        duration,
      });
      queryClient.invalidateQueries({ queryKey: ['workflowActions'] });
      queryClient.invalidateQueries({ queryKey: ['workflowActions', desk.id] });
      if (onActionLogged) onActionLogged();
    }
    setExecuting(false);
  };

  const handleClearFlag = async () => {
    if (!action) return;
    setAction(prev => ({ ...prev, status: 'completed', flag: 'none' }));
    queryClient.invalidateQueries({ queryKey: ['workflowActions'] });
  };

  const deskColor = desk.color || GOLD;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: `1px solid ${deskColor}40` }}>
      {/* ── WHITE COPY: WHAT / WHY / WHO / WHEN / WHERE ── */}
      <div className="p-6 pb-4" style={{ borderBottom: `1px solid ${deskColor}25` }}>
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: deskColor }}>
          {stage.title}
        </p>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{stage.plain}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WhiteCopyRow icon={Sparkles} label="WHAT" value={stage.what || stage.title} color={deskColor} />
          <WhiteCopyRow icon={Shield} label="WHY" value={stage.why || '—'} color={deskColor} />
          <WhiteCopyRow icon={User} label="WHO" value={stage.who || desk.specialist} color={deskColor} />
          <WhiteCopyRow icon={Clock} label="WHEN" value={stage.when || 'On demand'} color={deskColor} />
          <WhiteCopyRow icon={MapPin} label="WHERE" value={stage.where || 'Admin panel'} color={deskColor} />
        </div>
      </div>

      {/* ── INPUT + EXECUTE ── */}
      <div className="p-6 pt-4">
        {exportTarget ? (
          <>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>
              Execute this stage
            </p>
            <p className="text-[11px] text-gray-500 mb-3">
              Calls <span className="font-mono" style={{ color: deskColor }}>{exportTarget.function}</span>
              {exportTarget.entity && <> → creates/updates <span className="font-mono" style={{ color: deskColor }}>{exportTarget.entity}</span></>}
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={exportTarget.input_hint || 'Optional instructions for this run…'}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none mb-3"
              style={{ background: '#1a1a1a', border: `1px solid ${deskColor}30` }}
            />
            <button
              onClick={handleExecute}
              disabled={!canExecute}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-black transition-all disabled:opacity-40"
              style={{ background: deskColor }}
            >
              {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {executing ? 'Running…' : `Execute ${stage.title}`}
            </button>
          </>
        ) : (
          <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-gray-500">
              This stage is <span className="font-bold text-gray-400">advisory / manual</span>. No automated function wired yet.
            </p>
            {stage.pages?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {stage.pages.map(p => (
                  <a
                    key={p.path}
                    href={p.path}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.05)', color: GOLD, border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    {p.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── LIVE STATUS ── */}
        {action && (
          <div className="mt-4">
            <StatusBanner action={action} color={deskColor} onClearFlag={handleClearFlag} />
          </div>
        )}
      </div>
    </div>
  );
}

function WhiteCopyRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color }} />
      <div>
        <p className="text-[9px] font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
        <p className="text-xs text-gray-300 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function StatusBanner({ action, color, onClearFlag }) {
  if (action.status === 'running') {
    return (
      <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: `${color}11`, border: `1px solid ${color}40` }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color }} />
        <p className="text-xs" style={{ color }}>Executing…</p>
      </div>
    );
  }

  if (action.status === 'completed') {
    return (
      <div className="rounded-lg p-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)' }}>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
          <p className="text-xs font-bold" style={{ color: '#22c55e' }}>Completed</p>
          {action.duration && <span className="text-[10px] text-gray-500">{(action.duration / 1000).toFixed(1)}s</span>}
        </div>
        {action.output && <p className="text-xs text-gray-300 mt-1">{action.output}</p>}
        {action.entityRef && (
          <p className="text-[10px] text-gray-500 mt-1 font-mono">→ {action.entityRef}</p>
        )}
      </div>
    );
  }

  if (action.status === 'flagged') {
    return (
      <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.45)' }}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
          <p className="text-xs font-bold" style={{ color: '#ef4444' }}>
            401 FLAG — {action.flag === 'auth_401' ? 'Auth/Credit Issue' : action.flag === 'timeout' ? 'Timeout' : 'Error'}
          </p>
        </div>
        <p className="text-xs text-gray-300 mt-1">{action.flagReason}</p>
        <p className="text-[10px] text-gray-500 mt-2 italic">
          ⛔ Flow blocked. A human must clear this flag before downstream stages can proceed.
        </p>
        <button
          onClick={onClearFlag}
          className="mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.35)' }}
        >
          <Shield className="w-3 h-3" />
          Clear Flag (Human Override)
        </button>
      </div>
    );
  }

  return null;
}