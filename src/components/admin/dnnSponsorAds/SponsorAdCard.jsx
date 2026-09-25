import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, Play, RefreshCw } from 'lucide-react';

const STATUS_COLOR = {
  draft: 'text-white/40',
  rendering: 'text-yellow-400',
  completed: 'text-green-400',
  failed: 'text-red-400',
};

export default function SponsorAdCard({ ad, onChange }) {
  const [title, setTitle] = useState(ad.title);
  const [script, setScript] = useState(ad.script);
  const [disclosure, setDisclosure] = useState(ad.disclosure || '');
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  const dirty = title !== ad.title || script !== ad.script || disclosure !== (ad.disclosure || '');

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.DnnSponsorAd.update(ad.id, { title, script, disclosure });
    setSaving(false);
    onChange();
  };

  const handleRender = async () => {
    setBusy(true);
    await base44.functions.invoke('dnnSponsorAdLibrary', { action: 'start', adId: ad.id });
    setBusy(false);
    onChange();
  };

  const handleCheck = async () => {
    setBusy(true);
    await base44.functions.invoke('dnnSponsorAdLibrary', { action: 'check', adId: ad.id });
    setBusy(false);
    onChange();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center">
            {ad.loopDay || '—'}
          </span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-[#D4AF37]/50 w-full"
          />
        </div>
        <span className={`text-xs font-bold uppercase tracking-wide shrink-0 ml-2 ${STATUS_COLOR[ad.status] || 'text-white/40'}`}>
          {ad.status}
        </span>
      </div>

      <textarea
        value={script}
        onChange={e => setScript(e.target.value)}
        rows={4}
        className="w-full text-sm bg-white/5 rounded-lg p-3 text-white/90 outline-none focus:ring-1 focus:ring-[#D4AF37]/40 resize-none"
      />

      <textarea
        value={disclosure}
        onChange={e => setDisclosure(e.target.value)}
        rows={2}
        placeholder="Sponsor / DRE disclosure line…"
        className="w-full mt-2 text-xs bg-white/5 rounded-lg p-3 text-white/60 outline-none focus:ring-1 focus:ring-[#D4AF37]/40 resize-none"
      />

      {ad.videoUrl && (
        <video src={ad.videoUrl} controls className="mt-3 w-full max-w-sm rounded-lg bg-black" />
      )}
      {ad.errorMessage && <p className="mt-2 text-xs text-red-400">{ad.errorMessage}</p>}

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 text-white/70 disabled:opacity-40"
        >
          <Save className="w-3 h-3" /> {saving ? 'Saving…' : 'Save'}
        </button>
        {ad.status !== 'rendering' && (
          <button
            onClick={handleRender}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37] text-black disabled:opacity-40"
          >
            <Play className="w-3 h-3" /> {ad.status === 'completed' ? 'Re-render' : 'Render'}
          </button>
        )}
        {ad.status === 'rendering' && (
          <button
            onClick={handleCheck}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/50 text-[#D4AF37] disabled:opacity-40"
          >
            <RefreshCw className="w-3 h-3" /> Check Status
          </button>
        )}
      </div>
    </div>
  );
}