import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save, Upload, ExternalLink, Video } from 'lucide-react';

const GOLD = '#D4AF37';

export default function AdminReferralAgentExplainer() {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({ headline: '', subheadline: '', video_url: '', bullets: [], fee_summary: '', cta_label: '', cta_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    base44.entities.ReferralAgentExplainerContent.list('-created_date', 1).then((res) => {
      const rec = res?.[0] || null;
      setRecord(rec);
      if (rec) setForm({ ...form, ...rec, bullets: rec.bullets || [] });
      setLoading(false);
    });
  }, []);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((f) => ({ ...f, video_url: file_url }));
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, bullets: form.bullets.filter((b) => b.trim()) };
    if (record) {
      const updated = await base44.entities.ReferralAgentExplainerContent.update(record.id, payload);
      setRecord(updated);
    } else {
      const created = await base44.entities.ReferralAgentExplainerContent.create(payload);
      setRecord(created);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#ede0cc' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN ADMIN</p>
            <h1 className="font-black text-2xl flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
              <Video className="w-6 h-6" style={{ color: GOLD }} /> Referral Agent Explainer
            </h1>
          </div>
          <a href="/referral-agent-explainer" target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full"
            style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
            <ExternalLink className="w-3.5 h-3.5" /> Preview Page
          </a>
        </div>

        <div className="rounded-2xl p-6 space-y-4" style={{ background: '#fff8ee', border: `1px solid ${GOLD}40` }}>
          <Field label="Headline">
            <input value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
          </Field>
          <Field label="Subheadline">
            <input value={form.subheadline} onChange={(e) => setForm((f) => ({ ...f, subheadline: e.target.value }))}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
          </Field>

          <Field label="Explainer Video">
            {form.video_url && (
              <video src={form.video_url} controls className="w-full rounded-lg mb-2" style={{ border: `1px solid ${GOLD}40` }} />
            )}
            <label className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer w-fit"
              style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
              <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading…' : 'Upload Video'}
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
          </Field>

          <Field label="Value Proposition Bullets">
            {(form.bullets.length ? form.bullets : ['']).map((b, i) => (
              <input key={i} value={b}
                onChange={(e) => {
                  const next = [...(form.bullets.length ? form.bullets : [''])];
                  next[i] = e.target.value;
                  setForm((f) => ({ ...f, bullets: next }));
                }}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none mb-2"
                style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
            ))}
            <button onClick={() => setForm((f) => ({ ...f, bullets: [...(f.bullets.length ? f.bullets : ['']), ''] }))}
              className="text-xs font-bold" style={{ color: GOLD }}>+ Add bullet</button>
          </Field>

          <Field label="Fee Summary">
            <textarea value={form.fee_summary} onChange={(e) => setForm((f) => ({ ...f, fee_summary: e.target.value }))}
              rows={3} className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none" style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA Label">
              <input value={form.cta_label} onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
            </Field>
            <Field label="CTA URL">
              <input value={form.cta_url} onChange={(e) => setForm((f) => ({ ...f, cta_url: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
            </Field>
          </div>

          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: GOLD, color: '#000' }}>
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Explainer Content'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>{label}</p>
      {children}
    </div>
  );
}