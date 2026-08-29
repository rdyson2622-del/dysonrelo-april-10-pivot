import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, CheckCircle, RefreshCw, AlertTriangle, Loader, ChevronDown, ChevronUp, Play, Send, Trash2, History, RotateCcw } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const PIPELINE_STAGES = [
  { id: 'review', title: 'Script Review', who: 'Base44 (admin edit)' },
  { id: 'approved', title: 'Approved', who: 'Base44 (dispatch)' },
  { id: 'rendering', title: 'Rendering', who: 'HeyGen' },
  { id: 'complete', title: 'Complete', who: 'Base44 (storage)' },
];

// Maps an article's production_status onto the 4-stage roadmap line above.
function getPipelineStatuses(article) {
  const s = article.production_status;
  if (s === 'complete') {
    return { review: { status: 'completed' }, approved: { status: 'completed' }, rendering: { status: 'completed' }, complete: { status: 'completed' } };
  }
  if (s === 'failed') {
    return { review: { status: 'completed' }, approved: { status: 'completed' }, rendering: { status: 'flagged', flag_reason: article.last_render_error || 'Render failed' }, complete: { status: 'pending' } };
  }
  if (s === 'rendering') {
    return { review: { status: 'completed' }, approved: { status: 'completed' }, rendering: { status: 'running' }, complete: { status: 'pending' } };
  }
  if (s === 'approved_for_render' || s === 'pending') {
    return { review: { status: 'completed' }, approved: { status: 'running' }, rendering: { status: 'pending' }, complete: { status: 'pending' } };
  }
  if (s === 'needs_revision') {
    return { review: { status: 'flagged', flag_reason: 'Needs revision' }, approved: { status: 'pending' }, rendering: { status: 'pending' }, complete: { status: 'pending' } };
  }
  // new, script_generated, pending_review, none
  return { review: { status: 'running' }, approved: { status: 'pending' }, rendering: { status: 'pending' }, complete: { status: 'pending' } };
}

const STATUS_STYLES = {
  new: { label: 'New', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  script_generated: { label: 'Script Generated', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  pending_review: { label: 'Pending Review', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  approved_for_render: { label: 'Approved — Awaiting Render', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  rendering: { label: 'Rendering', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  complete: { label: 'Complete', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  failed: { label: 'Failed', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  needs_revision: { label: 'Needs Revision', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  none: { label: 'No Status', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
};

function Field({ label, value, onChange, rows = 3, mono = false, placeholder = '' }) {
  return (
    <div>
      <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1 block">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-lg px-3 py-2 text-sm text-white resize-y ${mono ? 'font-mono' : ''}`}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
    </div>
  );
}

function ReadOnly({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <label className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-1 block">{label}</label>
      <div className="rounded-lg px-3 py-2 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {value}
      </div>
    </div>
  );
}

export default function Shard1ScriptReviewCard({ article, onChanged }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Editable draft — falls back to generated values so admin starts from AI output
  const [draft, setDraft] = useState({
    edited_opening_script: article.edited_opening_script ?? article.generated_opening_script ?? '',
    edited_body_script: article.edited_body_script ?? article.generated_body_script ?? article.body ?? '',
    edited_closing_script: article.edited_closing_script ?? article.generated_closing_script ?? '',
    pronunciation_notes: article.pronunciation_notes ?? '',
    correction_notes: article.correction_notes ?? '',
  });

  const st = STATUS_STYLES[article.production_status] || STATUS_STYLES.none;
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }));

  // Before overwriting anything, snapshot whatever is CURRENTLY saved on the
  // article (its live edited_* values) into edit_history — so a save can
  // never silently destroy a prior version. History is capped at the last 20.
  const persist = async (extra, successText, startText) => {
    setSaving(true);
    setMsg({ type: 'pending', text: startText || 'Working…' });
    try {
      const current = await base44.entities.DnnArticle.get(article.id);
      const snapshot = {
        saved_at: new Date().toISOString(),
        opening: current.edited_opening_script || '',
        body: current.edited_body_script || '',
        closing: current.edited_closing_script || '',
      };
      const nextHistory = [...(current.edit_history || []), snapshot].slice(-20);
      await base44.entities.DnnArticle.update(article.id, { ...draft, ...extra, edit_history: nextHistory });
      setMsg({ type: 'success', text: successText });
      onChanged?.();
    } catch (e) {
      setMsg({ type: 'error', text: e.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreSnapshot = (snap) => {
    setDraft((d) => ({ ...d, edited_opening_script: snap.opening, edited_body_script: snap.body, edited_closing_script: snap.closing }));
    setShowHistory(false);
    setMsg({ type: 'success', text: `Restored the ${new Date(snap.saved_at).toLocaleString()} version into the fields below — click Save Corrections to keep it.` });
  };

  const handleSave = () => persist({}, 'Corrections saved.', 'Received — saving your corrections…');

  // Approve/re-render now dispatch straight to HeyGen in-app (dnnArticleDirectRender) —
  // no n8n involved. A scheduled poll (every 5 min) picks up completion.
  const dispatchDirectRender = async (extra, startText, successPrefix) => {
    setSaving(true);
    setMsg({ type: 'pending', text: startText });
    try {
      const current = await base44.entities.DnnArticle.get(article.id);
      const snapshot = {
        saved_at: new Date().toISOString(),
        opening: current.edited_opening_script || '',
        body: current.edited_body_script || '',
        closing: current.edited_closing_script || '',
      };
      const nextHistory = [...(current.edit_history || []), snapshot].slice(-20);
      await base44.entities.DnnArticle.update(article.id, { ...draft, ...extra, edit_history: nextHistory });
      const res = await base44.functions.invoke('dnnArticleDirectRender', { article_id: article.id });
      setMsg({ type: 'success', text: `${successPrefix} HeyGen job ${res.data.video_id} — rendering now, checked automatically every 5 min.` });
      onChanged?.();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || e.message || 'Render failed to start' });
    }
    setSaving(false);
  };

  const handleApprove = () =>
    dispatchDirectRender(
      { admin_approved: true, render_requested: true, production_status: 'approved_for_render' },
      'Received — rendering directly with HeyGen…',
      'Approved and rendering started —'
    );

  const handleRerender = () =>
    dispatchDirectRender(
      {
        admin_approved: true,
        render_requested: true,
        production_status: 'approved_for_render',
        render_version: (article.render_version || 0) + 1,
        video_url: null,
        last_render_error: null,
      },
      'Received — requesting re-render…',
      `Re-render v${(article.render_version || 0) + 1} started —`
    );

  const handleRepublish = () =>
    persist(
      { status: 'published', published_date: new Date().toISOString() },
      'Saved & republished to DNN News.',
      'Received — saving & republishing…'
    );

  const handleNeedsRevision = () =>
    persist(
      { admin_approved: false, render_requested: false, production_status: 'needs_revision' },
      'Marked as needs revision.',
      'Received — flagging for revision…'
    );

  const handleDelete = async () => {
    if (!confirm(`Delete this article permanently?\n\n"${article.headline}"\n\nThis cannot be undone.`)) return;
    setSaving(true);
    setMsg({ type: 'pending', text: 'Received — deleting…' });
    try {
      await base44.entities.DnnArticle.delete(article.id);
      setMsg({ type: 'success', text: 'Article deleted.' });
      onChanged?.();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
    setSaving(false);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: `1px solid ${st.color}33` }}>
      {/* Header */}
      <button onClick={() => setExpanded((e) => !e)} className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.02]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
              {st.label}
            </span>
            {article.render_version > 0 && (
              <span className="text-[10px] text-slate-600">v{article.render_version}</span>
            )}
            {article.video_url && !article.video_url.startsWith('heygen:pending:') && (
              <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>● Video ready</span>
            )}
          </div>
          <p className="text-sm font-bold text-white leading-snug truncate">{article.headline}</p>
          <p className="text-[10px] text-slate-600">{article.dateline} · {article.trigger_type?.replace(/_/g, ' ')}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="pt-4" />

          {/* Show Production Pipeline roadmap — where this article sits right now */}
          <FlowRoadmapLine
            stages={PIPELINE_STAGES}
            stageStatuses={getPipelineStatuses(article)}
            color="#D4AF37"
            activeStageId={null}
            onSelect={() => {}}
            compact
          />

          {/* Complete Broadcast Script — editable (opening + body + closing) */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#D4AF37' }}>Complete Broadcast Script — Editable</p>
            <Field label="Scene 1 — Opening" value={draft.edited_opening_script} onChange={set('edited_opening_script')} rows={4} />
            <Field label="Scene 2 — News Story" value={draft.edited_body_script} onChange={set('edited_body_script')} rows={6} />
            <Field label="Scene 3 — Closing" value={draft.edited_closing_script} onChange={set('edited_closing_script')} rows={4} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80"
              style={{ background: '#fff', color: '#000', border: '1px solid #fff' }}>
              {saving ? <Loader className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save Corrections
            </button>
            <button onClick={handleRepublish} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)', color: '#000', border: '1px solid #D4AF37' }}>
              {saving ? <Loader className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Save & Republish
            </button>
            <button onClick={handleApprove} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80"
              style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.35)' }}>
              <CheckCircle className="w-3 h-3" /> Approve for Render
            </button>
            <button onClick={handleRerender} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.35)' }}>
              <RefreshCw className="w-3 h-3" /> Request Re-render
            </button>
            <button onClick={handleNeedsRevision} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80"
              style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.35)' }}>
              <AlertTriangle className="w-3 h-3" /> Mark Needs Revision
            </button>
            {article.edit_history?.length > 0 && (
              <button onClick={() => setShowHistory((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold hover:opacity-80"
                style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' }}>
                <History className="w-3 h-3" /> Edit History ({article.edit_history.length})
              </button>
            )}
            <button onClick={handleDelete} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80 ml-auto"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              {saving ? <Loader className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
            </button>
          </div>

          {/* Save/error feedback — right under the buttons so it's never missed.
              Shows instantly on click ("Received…") then flips to success/error. */}
          {msg && (
            <div className="rounded-lg px-3 py-2.5 text-sm font-bold flex items-center gap-2" style={{
              background: msg.type === 'success' ? 'rgba(74,222,128,0.15)' : msg.type === 'pending' ? 'rgba(96,165,250,0.15)' : 'rgba(248,113,113,0.15)',
              border: `1px solid ${msg.type === 'success' ? 'rgba(74,222,128,0.4)' : msg.type === 'pending' ? 'rgba(96,165,250,0.4)' : 'rgba(248,113,113,0.4)'}`,
              color: msg.type === 'success' ? '#4ade80' : msg.type === 'pending' ? '#60a5fa' : '#f87171',
            }}>
              {msg.type === 'pending' ? <Loader className="w-3.5 h-3.5 animate-spin shrink-0" /> : <span>{msg.type === 'success' ? '✓' : '✗'}</span>}
              {msg.text}
            </div>
          )}

          {/* Edit History — every previous saved version, newest first, restorable */}
          {showHistory && (
            <div className="rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto" style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.2)' }}>
              <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#60a5fa' }}>Previous Saved Versions</p>
              {[...(article.edit_history || [])].reverse().map((snap, i) => (
                <div key={i} className="rounded-lg p-2 flex items-start justify-between gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">{new Date(snap.saved_at).toLocaleString()}</p>
                    <p className="text-xs text-slate-300 truncate">{snap.opening?.slice(0, 80) || '(empty)'}</p>
                  </div>
                  <button onClick={() => handleRestoreSnapshot(snap)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold shrink-0 hover:opacity-80"
                    style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.35)' }}>
                    <RotateCcw className="w-3 h-3" /> Restore
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Source content */}
          <ReadOnly label="Source Article Body" value={article.body} />

          {/* Video preview */}
          {article.video_url && !article.video_url.startsWith('heygen:pending:') && (
            <a href={article.video_url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
              <Play className="w-3 h-3" /> Preview Current Video
            </a>
          )}

          {article.last_render_error && (
            <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
              Last render error: {article.last_render_error}
            </div>
          )}

          {/* Generated (read-only reference) */}
          <div className="rounded-lg p-3 space-y-3" style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.15)' }}>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#60a5fa' }}>AI-Generated (reference)</p>
            <ReadOnly label="Generated Opening (Scene 1 — DNN Open)" value={article.generated_opening_script} />
            <ReadOnly label="Generated Body (Scene 2 — News Story)" value={article.generated_body_script} />
            <ReadOnly label="Generated Closing (Scene 3 — Dyson Outro)" value={article.generated_closing_script} />
          </div>

          {/* Editable fields */}
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#D4AF37' }}>Notes (internal)</p>
            <Field label="Pronunciation Notes" value={draft.pronunciation_notes} onChange={set('pronunciation_notes')} rows={2} placeholder="e.g. 'Dyson = DYE-son', 'Camas = KAM-us'" />
            <Field label="Correction Notes (internal)" value={draft.correction_notes} onChange={set('correction_notes')} rows={2} />
          </div>
        </div>
      )}
    </div>
  );
}