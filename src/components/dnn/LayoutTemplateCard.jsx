import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, XCircle, Save, RotateCcw, Lock, Unlock, Film } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * LayoutTemplateCard — editable view of a single LayoutTemplate record.
 * All visual parameters (background, presenter positions, solution panel)
 * are editable here and persist to the LayoutTemplate entity.
 *
 * When a template is "approved", dnnStitchBroadcast pulls these exact
 * coordinates for every render — ensuring visual consistency across all shows.
 */
export default function LayoutTemplateCard({ template, onSave, onStatusChange }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(template);
  const [error, setError] = useState(null);

  const isApproved = template.status === 'approved';

  const handleField = (path, value) => {
    const next = JSON.parse(JSON.stringify(draft));
    const keys = path.split('.');
    let obj = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] || (obj[keys[i]] = {});
    obj[keys[keys.length - 1]] = value;
    setDraft(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await base44.entities.LayoutTemplate.update(template.id, {
        template_name: draft.template_name,
        status: draft.status,
        background: draft.background,
        presenter_1: draft.presenter_1,
        presenter_2: draft.presenter_2,
        solution_panel: draft.solution_panel,
        video_dimensions: draft.video_dimensions,
        notes: draft.notes,
      });
      setEditing(false);
      onSave?.();
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setDraft(template);
    setEditing(false);
    setError(null);
  };

  const handleToggleApproved = async () => {
    const newStatus = isApproved ? 'archived' : 'approved';
    await base44.entities.LayoutTemplate.update(template.id, { status: newStatus });
    onStatusChange?.();
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a1a', border: `1px solid ${isApproved ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          {isApproved ? <Lock className="w-4 h-4" style={{ color: GOLD }} /> : <Unlock className="w-4 h-4 text-slate-500" />}
          <div>
            {editing ? (
              <input
                value={draft.template_name || ''}
                onChange={e => handleField('template_name', e.target.value)}
                className="bg-transparent text-sm font-black text-white border-b border-yellow-500/40 outline-none px-1"
                style={{ minWidth: '200px' }}
              />
            ) : (
              <p className="text-sm font-black text-white">{template.template_name}</p>
            )}
            <p className="text-[10px] text-slate-500">{template.notes || 'No notes'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{
              background: isApproved ? 'rgba(212,175,55,0.15)' : template.status === 'archived' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
              color: isApproved ? GOLD : template.status === 'archived' ? '#ef4444' : '#999',
            }}>
            {template.status?.toUpperCase()}
          </span>
          {isApproved && (
            <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
              ✓ GOLDEN MASTER
            </span>
          )}
        </div>
      </div>

      {/* Reference video */}
      {template.reference_video_url && (
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 flex items-center gap-1">
            <Film className="w-3 h-3" /> Reference Master Video
          </p>
          <video src={template.reference_video_url} muted playsInline preload="metadata"
            onLoadedMetadata={e => { e.target.currentTime = 1; }}
            className="w-full max-h-32 object-cover rounded-lg" />
          <p className="text-[9px] text-slate-600 mt-1 truncate">{template.reference_video_url}</p>
        </div>
      )}

      {/* Body — layout parameters */}
      <div className="px-5 py-4 space-y-4">
        {/* Background */}
        <Section title="Background Matrix">
          <Field label="Type">
            <select value={draft.background?.type || 'image'} disabled={!editing}
              onChange={e => handleField('background.type', e.target.value)}
              className="bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="URL" wide>
            <input value={draft.background?.url || ''} disabled={!editing}
              onChange={e => handleField('background.url', e.target.value)}
              className="w-full bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Description" wide>
            <input value={draft.background?.description || ''} disabled={!editing}
              onChange={e => handleField('background.description', e.target.value)}
              className="w-full bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
        </Section>

        {/* Presenter 1 — Charlie */}
        <Section title="Presenter 1 — Charlie (Avatar)">
          <Field label="HeyGen Avatar ID">
            <input value={draft.presenter_1?.heygen_id || ''} disabled={!editing}
              onChange={e => handleField('presenter_1.heygen_id', e.target.value)}
              className="w-full bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Voice ID">
            <input value={draft.presenter_1?.voice_id || ''} disabled={!editing}
              onChange={e => handleField('presenter_1.voice_id', e.target.value)}
              className="w-full bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Scale">
            <input type="number" step="0.01" value={draft.presenter_1?.scale ?? 0.55} disabled={!editing}
              onChange={e => handleField('presenter_1.scale', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Offset X">
            <input type="number" step="0.01" value={draft.presenter_1?.offset_x ?? -0.25} disabled={!editing}
              onChange={e => handleField('presenter_1.offset_x', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Offset Y">
            <input type="number" step="0.01" value={draft.presenter_1?.offset_y ?? 0.2} disabled={!editing}
              onChange={e => handleField('presenter_1.offset_y', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Alignment">
            <select value={draft.presenter_1?.alignment || 'left'} disabled={!editing}
              onChange={e => handleField('presenter_1.alignment', e.target.value)}
              className="bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </Section>

        {/* Presenter 2 — Bob */}
        <Section title="Presenter 2 — Bob Dyson (Talking Photo)">
          <Field label="HeyGen Photo ID">
            <input value={draft.presenter_2?.heygen_id || ''} disabled={!editing}
              onChange={e => handleField('presenter_2.heygen_id', e.target.value)}
              className="w-full bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Voice ID">
            <input value={draft.presenter_2?.voice_id || ''} disabled={!editing}
              onChange={e => handleField('presenter_2.voice_id', e.target.value)}
              className="w-full bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Scale">
            <input type="number" step="0.01" value={draft.presenter_2?.scale ?? 0.55} disabled={!editing}
              onChange={e => handleField('presenter_2.scale', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Offset X">
            <input type="number" step="0.01" value={draft.presenter_2?.offset_x ?? 0.25} disabled={!editing}
              onChange={e => handleField('presenter_2.offset_x', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Offset Y">
            <input type="number" step="0.01" value={draft.presenter_2?.offset_y ?? 0.2} disabled={!editing}
              onChange={e => handleField('presenter_2.offset_y', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Alignment">
            <select value={draft.presenter_2?.alignment || 'right'} disabled={!editing}
              onChange={e => handleField('presenter_2.alignment', e.target.value)}
              className="bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </Section>

        {/* Solution Panel */}
        <Section title="Solution Panel Overlay">
          <Field label="Enabled">
            <input type="checkbox" checked={draft.solution_panel?.enabled ?? true} disabled={!editing}
              onChange={e => handleField('solution_panel.enabled', e.target.checked)} />
          </Field>
          <Field label="Position">
            <select value={draft.solution_panel?.position || 'upper_center'} disabled={!editing}
              onChange={e => handleField('solution_panel.position', e.target.value)}
              className="bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none">
              <option value="upper_center">Upper Center</option>
              <option value="upper_left">Upper Left</option>
              <option value="upper_right">Upper Right</option>
              <option value="lower_center">Lower Center</option>
            </select>
          </Field>
          <Field label="Width %">
            <input type="number" value={draft.solution_panel?.width_percent ?? 50} disabled={!editing}
              onChange={e => handleField('solution_panel.width_percent', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="BG Color">
            <input type="text" value={draft.solution_panel?.background_color || '#ffffff'} disabled={!editing}
              onChange={e => handleField('solution_panel.background_color', e.target.value)}
              className="w-20 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Border Color">
            <input type="text" value={draft.solution_panel?.border_color || '#D4AF37'} disabled={!editing}
              onChange={e => handleField('solution_panel.border_color', e.target.value)}
              className="w-20 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Border Width px">
            <input type="number" value={draft.solution_panel?.border_width_px ?? 2} disabled={!editing}
              onChange={e => handleField('solution_panel.border_width_px', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Border Radius px">
            <input type="number" value={draft.solution_panel?.border_radius_px ?? 14} disabled={!editing}
              onChange={e => handleField('solution_panel.border_radius_px', parseFloat(e.target.value))}
              className="w-16 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Title Color">
            <input type="text" value={draft.solution_panel?.title_color || '#1a1a1a'} disabled={!editing}
              onChange={e => handleField('solution_panel.title_color', e.target.value)}
              className="w-20 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Title Font">
            <input type="text" value={draft.solution_panel?.title_font_family || 'Cormorant Garamond, serif'} disabled={!editing}
              onChange={e => handleField('solution_panel.title_font_family', e.target.value)}
              className="w-40 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Title Weight">
            <input type="text" value={draft.solution_panel?.title_font_weight || 'bold'} disabled={!editing}
              onChange={e => handleField('solution_panel.title_font_weight', e.target.value)}
              className="w-20 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Bullet Color">
            <input type="text" value={draft.solution_panel?.bullet_color || '#2a2a2a'} disabled={!editing}
              onChange={e => handleField('solution_panel.bullet_color', e.target.value)}
              className="w-20 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Bullet Marker">
            <input type="text" value={draft.solution_panel?.bullet_marker_color || '#D4AF37'} disabled={!editing}
              onChange={e => handleField('solution_panel.bullet_marker_color', e.target.value)}
              className="w-20 bg-transparent text-[10px] text-slate-400 border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Text Alignment">
            <select value={draft.solution_panel?.text_alignment || 'center'} disabled={!editing}
              onChange={e => handleField('solution_panel.text_alignment', e.target.value)}
              className="bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </Section>

        {/* Video dimensions */}
        <Section title="Output Video Dimensions">
          <Field label="Width">
            <input type="number" value={draft.video_dimensions?.width ?? 1280} disabled={!editing}
              onChange={e => handleField('video_dimensions.width', parseInt(e.target.value))}
              className="w-20 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
          <Field label="Height">
            <input type="number" value={draft.video_dimensions?.height ?? 720} disabled={!editing}
              onChange={e => handleField('video_dimensions.height', parseInt(e.target.value))}
              className="w-20 bg-transparent text-xs text-white border border-white/10 rounded px-2 py-1 outline-none" />
          </Field>
        </Section>

        {/* Error */}
        {error && (
          <div className="rounded-lg p-2.5 flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {editing ? (
          <>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-black transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
              {saving ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : 'Save Layout'}
            </button>
            <button onClick={handleCancel}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-white transition-all"
              style={{ background: '#333', border: '1px solid rgba(255,255,255,0.1)' }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-white transition-all"
              style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
              <Unlock className="w-3.5 h-3.5" /> Edit Layout
            </button>
            <button onClick={handleToggleApproved}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-black transition-all"
              style={{ background: isApproved ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg, #e8c84a, #D4AF37)', color: isApproved ? '#ef4444' : '#000' }}>
              {isApproved ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
              {isApproved ? 'Archive Layout' : 'Set as Golden Master'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <p className="text-[9px] font-black tracking-widest uppercase text-slate-500 mb-2">{title}</p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children, wide }) {
  return (
    <div className={wide ? 'w-full' : ''}>
      <p className="text-[8px] font-bold uppercase text-slate-600 mb-0.5">{label}</p>
      {children}
    </div>
  );
}