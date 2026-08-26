import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DoorOpen, Save, ExternalLink } from 'lucide-react';

const GOLD = '#D4AF37';

// 6th "portal" — the first-time, unsubscribed visitor. Unlike the 5 signed-in
// portals, this audience never logs in, so there's no dashboard to point at.
// This admin page edits the single EntryPortalContent record that the public
// /broadcast-show landing page renders for that visitor.
export default function AdminEntryPortal() {
  const [record, setRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.EntryPortalContent.list().then(rows => {
      setRecord(rows[0] || { headline: 'Coming Soon', subheadline: '', cta_label: '', cta_url: '', is_live: true });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (record.id) {
        await base44.entities.EntryPortalContent.update(record.id, record);
      } else {
        const created = await base44.entities.EntryPortalContent.create(record);
        setRecord(created);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading…</div>;
  }

  return (
    <div className="min-h-screen p-6" style={{ background: '#0d0d0d' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
            <DoorOpen className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Entry Portal — First-Time Visitor</h1>
            <p className="text-xs text-white">The 6th audience: what an unsubscribed visitor sees before signing in, on the public studio landing page.</p>
          </div>
          <a href="/broadcast-show" target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.4)' }}>
            <ExternalLink className="w-3.5 h-3.5" /> View Live
          </a>
        </div>

        <div className="space-y-5 p-6 rounded-2xl" style={{ background: '#151515', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: GOLD }}>Headline</label>
            <input
              value={record.headline || ''}
              onChange={e => setRecord({ ...record, headline: e.target.value })}
              placeholder="Coming Soon"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: GOLD }}>Subheadline (optional)</label>
            <input
              value={record.subheadline || ''}
              onChange={e => setRecord({ ...record, subheadline: e.target.value })}
              placeholder="e.g. Real Estate Relocation, Reinvented"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: GOLD }}>CTA Button Label</label>
              <input
                value={record.cta_label || ''}
                onChange={e => setRecord({ ...record, cta_label: e.target.value })}
                placeholder="e.g. Get Started"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: GOLD }}>CTA Link</label>
              <input
                value={record.cta_url || ''}
                onChange={e => setRecord({ ...record, cta_url: e.target.value })}
                placeholder="/subscribe"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={record.is_live !== false}
              onChange={e => setRecord({ ...record, is_live: e.target.checked })}
            />
            Live (visible to visitors)
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}