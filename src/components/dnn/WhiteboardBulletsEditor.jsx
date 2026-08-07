import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, RefreshCw, ListPlus, Loader } from 'lucide-react';

const GOLD = '#D4AF37';
const MAX_BULLETS = 5;
const MAX_CHARS = 42;

/**
 * WhiteboardBulletsEditor — manual 3-word bullet entry for the DNN studio
 * whiteboard overlay. Creatomate's auto-wrapping of long sentences was producing
 * overlapping/illegible text, so the admin curates short bullets here that are
 * baked into the composited MP4 via dnnCompositeBroadcast.
 *
 * On Save: persists `content_bullets` to the DnnBroadcast.
 * On Re-composite: clears the composited render and re-triggers dnnCompositeBroadcast
 * so the new bullets bake into a fresh studio MP4.
 */
export default function WhiteboardBulletsEditor({ show, onRefresh }) {
  const [bullets, setBullets] = useState(['', '', '', '', '']);
  const [saving, setSaving] = useState(false);
  const [compositing, setCompositing] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const stored = Array.isArray(show.content_bullets) ? show.content_bullets : [];
    const next = Array.from({ length: MAX_BULLETS }, (_, i) => stored[i] || '');
    setBullets(next);
  }, [show.id, show.content_bullets]);

  const setBullet = (i, val) => {
    const capped = val.slice(0, MAX_CHARS);
    setBullets((b) => b.map((x, idx) => (idx === i ? capped : x)));
  };

  const cleaned = bullets.map((b) => b.trim()).filter(Boolean);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await base44.entities.DnnBroadcast.update(show.id, { content_bullets: cleaned });
      setMsg({ type: 'success', text: `${cleaned.length} bullets saved.` });
      onRefresh?.();
    } catch (e) {
      setMsg({ type: 'error', text: e.message || 'Save failed' });
    }
    setSaving(false);
  };

  const handleRecomposite = async () => {
    setCompositing(true);
    setMsg(null);
    try {
      // Persist first so the composite picks up the latest bullets
      await base44.entities.DnnBroadcast.update(show.id, {
        content_bullets: cleaned,
        compositedVideoUrl: null,
        compositedRenderId: null,
        status: 'ready',
      });
      const res = await base44.functions.invoke('dnnCompositeBroadcast', {
        action: 'start',
        broadcast_id: show.id,
      });
      const data = res?.data || res;
      if (data?.error) {
        setMsg({ type: 'error', text: data.error });
      } else {
        setMsg({ type: 'success', text: `Re-composite started (render ${data.renderId || '?'})` });
      }
      onRefresh?.();
    } catch (e) {
      setMsg({ type: 'error', text: e.message || 'Composite failed' });
    }
    setCompositing(false);
  };

  return (
    <div className="mb-4 rounded-xl p-4"
      style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="flex items-center gap-2 mb-2">
        <ListPlus className="w-3.5 h-3.5" style={{ color: GOLD }} />
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
          Whiteboard Bullets — Manual
        </p>
        <span className="text-[9px] text-slate-500 ml-1">Keep each ≤ {MAX_CHARS} chars (≈3-5 words)</span>
      </div>

      <div className="space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-bold w-4 text-right" style={{ color: GOLD }}>{i + 1}</span>
            <input
              type="text"
              value={b}
              onChange={(e) => setBullet(i, e.target.value)}
              maxLength={MAX_CHARS}
              placeholder={`Bullet ${i + 1} (3-5 words)`}
              className="flex-1 rounded-lg px-3 py-1.5 text-xs text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <span className="text-[9px] text-slate-600 w-8 text-right">{b.length}/{MAX_CHARS}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
          {saving ? <Loader className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save Bullets
        </button>
        <button onClick={handleRecomposite} disabled={compositing || cleaned.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black disabled:opacity-50 hover:opacity-90"
          style={{ background: compositing ? '#666' : `linear-gradient(135deg, #e8c84a, ${GOLD})` }}>
          {compositing ? <Loader className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {compositing ? 'Re-compositing…' : 'Save & Re-composite'}
        </button>
      </div>

      {msg && (
        <p className="text-[10px] mt-2" style={{ color: msg.type === 'success' ? '#4ade80' : '#f87171' }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}