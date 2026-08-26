import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function AdminTransparency() {
  const [record, setRecord] = useState(null);
  const [headline, setHeadline] = useState('Transparency');
  const [subheadline, setSubheadline] = useState('');
  const [bulletsText, setBulletsText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.TransparencyContent.list().then(rows => {
      const rec = rows[0];
      if (rec) {
        setRecord(rec);
        setHeadline(rec.headline || 'Transparency');
        setSubheadline(rec.subheadline || '');
        setBulletsText((rec.bullets || []).join('\n'));
        setVideoUrl(rec.video_url || '');
      }
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = {
      headline,
      subheadline,
      bullets: bulletsText.split('\n').map(b => b.trim()).filter(Boolean),
      video_url: videoUrl,
      is_live: true,
    };
    if (record) {
      await base44.entities.TransparencyContent.update(record.id, payload);
    } else {
      const created = await base44.entities.TransparencyContent.create(payload);
      setRecord(created);
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-black mb-1" style={{ color: GOLD }}>Transparency Explainer Page</h1>
      <p className="text-sm text-white/60 mb-6">Edit the public /transparency page content (headline, bullets, Charlie video).</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-white/60">Headline</label>
          <input value={headline} onChange={e => setHeadline(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black border border-white/20 text-white" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-white/60">Subheadline</label>
          <input value={subheadline} onChange={e => setSubheadline(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black border border-white/20 text-white" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-white/60">Bullet Points (one per line)</label>
          <textarea value={bulletsText} onChange={e => setBulletsText(e.target.value)} rows={8} className="w-full mt-1 px-3 py-2 rounded bg-black border border-white/20 text-white" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-white/60">Charlie Explainer Video URL</label>
          <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full mt-1 px-3 py-2 rounded bg-black border border-white/20 text-white" />
        </div>
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded font-bold" style={{ background: GOLD, color: '#000' }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}