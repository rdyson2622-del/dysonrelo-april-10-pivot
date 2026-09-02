import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save, Upload, ExternalLink, FileText, Workflow } from 'lucide-react';

const GOLD = '#D4AF37';
const TABS = [
  { key: 'process', label: 'Referral Process', icon: Workflow, previewPath: '/referral-process' },
  { key: 'forms', label: 'Referral Forms', icon: FileText, previewPath: '/referral-forms' },
];

export default function AdminReferralSections() {
  const [tab, setTab] = useState('process');
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({ headline: '', subheadline: '', video_url: '', items: [], cta_label: '', cta_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.ReferralAgentSectionContent.filter({ section_key: tab }, '-created_date', 1).then((res) => {
      const rec = res?.[0] || null;
      setRecord(rec);
      setForm({ headline: '', subheadline: '', video_url: '', items: [], cta_label: '', cta_url: '', ...rec, items: rec?.items || [] });
      setLoading(false);
    });
  }, [tab]);

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
    const payload = { ...form, section_key: tab, items: form.items.filter((i) => i.trim()) };
    if (record) {
      const updated = await base44.entities.ReferralAgentSectionContent.update(record.id, payload);
      setRecord(updated);
    } else {
      const created = await base44.entities.ReferralAgentSectionContent.create(payload);
      setRecord(created);
    }
    setSaving(false);
  };

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN ADMIN</p>
            <h1 className="font-black text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
              Referral Explainer Sections
            </h1>
          </div>
          <a href={activeTab.previewPath} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full"
            style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
            <ExternalLink className="w-3.5 h-3.5" /> Preview Page
          </a>
        </div>

        <div className="flex gap-2 mb-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = t.key === tab;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={isActive
                  ? { background: GOLD, color: '#000' }
                  : { background: '#fff8ee', border: `1px solid ${GOLD}40`, color: '#1a1a1a' }}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} /></div>
        ) : (
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

            <Field label={tab === 'process' ? 'Process Steps (in order)' : 'Bullet Points'}>
              {(form.items.length ? form.items : ['']).map((item, i) => (
                <input key={i} value={item}
                  onChange={(e) => {
                    const next = [...(form.items.length ? form.items : [''])];
                    next[i] = e.target.value;
                    setForm((f) => ({ ...f, items: next }));
                  }}
                  className="w-full text-sm px-3 py-2 rounded-lg outline-none mb-2"
                  style={{ border: `1px solid ${GOLD}60`, background: '#fff' }} />
              ))}
              <button onClick={() => setForm((f) => ({ ...f, items: [...(f.items.length ? f.items : ['']), ''] }))}
                className="text-xs font-bold" style={{ color: GOLD }}>+ Add item</button>
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
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : `Save ${activeTab.label}`}
            </button>
          </div>
        )}
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