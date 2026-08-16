import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import {
  X, Loader2, AlertTriangle, Lightbulb, CheckCircle2, Sparkles,
  ArrowRight, Plus, Clock, Shield, Zap
} from 'lucide-react';

const GOLD = '#D4AF37';

const ISSUE_TYPES = [
  { id: 'missing_docs',      label: 'Missing Documents',    icon: AlertTriangle, color: '#f59e0b' },
  { id: 'deadline_missed',   label: 'Deadline Missed',       icon: Clock,         color: '#ef4444' },
  { id: 'buyer_reneg',       label: 'Buyer Reneged',          icon: X,             color: '#ef4444' },
  { id: 'lending_failure',   label: 'Lending Failure',       icon: AlertTriangle, color: '#ef4444' },
  { id: 'loan_change',       label: 'Loan Program Change',   icon: ArrowRight,    color: '#38bdf8' },
  { id: 'inspection_failure',label: 'Inspection Failure',   icon: AlertTriangle, color: '#f59e0b' },
  { id: 'appraisal_gap',     label: 'Appraisal Gap',        icon: AlertTriangle, color: '#f59e0b' },
  { id: 'title_issue',       label: 'Title Issue',           icon: Shield,        color: '#a78bfa' },
  { id: 'seller_delay',      label: 'Seller Delay',          icon: Clock,         color: '#f59e0b' },
  { id: 'buyer_delay',       label: 'Buyer Delay',           icon: Clock,         color: '#f59e0b' },
  { id: 'other',             label: 'Other',                  icon: AlertTriangle, color: '#888' },
];

const URGENCY_COLORS = {
  immediate: '#ef4444',
  within_24h: '#f59e0b',
  within_3_days: GOLD,
  monitor: '#888',
};

export default function EscrowIssueResolver({ escrow, milestone, brokerageId, onClose, onApplied }) {
  const queryClient = useQueryClient();
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [resolving, setResolving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const raiseAndResolve = async () => {
    if (!issueType || !description.trim()) {
      setError('Select an issue type and describe the problem.');
      return;
    }
    setResolving(true);
    setError('');
    try {
      const res = await base44.functions.invoke('resolveEscrowIssue', {
        escrow_number: escrow.number,
        property_address: escrow.address,
        milestone_ref: milestone?.milestone_type || milestone?.milestone_name || '',
        issue_type: issueType,
        issue_description: description.trim(),
        brokerage_id: brokerageId,
      });
      setResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['escrowIssues'] });
    } catch (e) {
      setError(e.message || 'Failed to get solution.');
    } finally {
      setResolving(false);
    }
  };

  const applyDetour = async () => {
    if (!result?.issue?.id) return;
    try {
      await base44.entities.EscrowIssue.update(result.issue.id, { status: 'applied' });
      queryClient.invalidateQueries({ queryKey: ['escrowIssues'] });
      onApplied && onApplied();
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: '#0d0d0d', border: `1.5px solid ${GOLD}50`, boxShadow: `0 20px 60px rgba(0,0,0,0.6)` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 sticky top-0 z-10" style={{ background: '#0d0d0d' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: GOLD }} />
            <div>
              <p className="text-sm font-bold text-white">Escrow Issue Resolver</p>
              <p className="text-[10px] text-stone-500">{escrow.address || 'Escrow #' + escrow.number} {milestone ? `· ${milestone.milestone_name || milestone.milestone_type}` : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {!result && (
            <>
              <p className="text-xs text-stone-400 mb-3">Select the issue type and describe what happened. An expert solution and roadmap detour will be generated instantly.</p>

              {/* Issue type grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {ISSUE_TYPES.map(t => {
                  const Icon = t.icon;
                  const active = issueType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setIssueType(t.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                      style={{
                        background: active ? `${t.color}18` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? t.color : 'rgba(255,255,255,0.08)'}`,
                        color: active ? t.color : '#888',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Description */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail — e.g. 'Buyer's loan was denied due to employment gap, need alternative financing or exit strategy'"
                rows={4}
                className="w-full bg-transparent text-sm text-white resize-none outline-none rounded-lg p-3 placeholder-stone-600"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              />

              {error && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>}

              <button
                onClick={raiseAndResolve}
                disabled={resolving || !issueType || !description.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD}cc)`, color: '#000' }}
              >
                {resolving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating expert solution…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Get Instant Solution</>
                )}
              </button>
            </>
          )}

          {result && (
            <>
              {/* Urgency badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ background: `${URGENCY_COLORS[result.urgency]}20`, border: `1px solid ${URGENCY_COLORS[result.urgency]}`, color: URGENCY_COLORS[result.urgency] }}>
                  {result.urgency?.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: result.can_save ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${result.can_save ? '#22c55e' : '#ef4444'}`, color: result.can_save ? '#22c55e' : '#ef4444' }}>
                  {result.can_save ? 'CAN SAVE' : 'EXIT STRATEGY'}
                </span>
              </div>

              {/* Solution narrative */}
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}30` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" style={{ color: GOLD }} />
                  <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>Expert Solution</p>
                </div>
                <p className="text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">{result.solution}</p>
              </div>

              {/* Action steps */}
              {result.action_steps?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" style={{ color: GOLD }} /> Action Steps</p>
                  <div className="space-y-1.5">
                    {result.action_steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>{i + 1}</span>
                        <span className="leading-relaxed pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detour stages */}
              {result.detour_stages?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5" style={{ color: GOLD }} /> Roadmap Detour — New Stages</p>
                  <div className="space-y-1.5">
                    {result.detour_stages.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.25)' }}>
                        <Plus className="w-3.5 h-3.5 shrink-0" style={{ color: '#38bdf8' }} />
                        <div className="flex-1">
                          <p className="text-xs text-white">{s.title}</p>
                          <p className="text-[10px] text-stone-500">{s.due_date} · {s.responsible_party?.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={applyDetour}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD}cc)`, color: '#000' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Detour to Roadmap
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-400 transition-colors hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}