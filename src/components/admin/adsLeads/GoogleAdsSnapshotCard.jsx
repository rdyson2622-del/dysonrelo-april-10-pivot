import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Pencil } from 'lucide-react';

const FIELD_DEFS = [
  { key: 'update_date', label: 'Date of update', type: 'date' },
  { key: 'spend_yesterday', label: 'Spend yesterday ($)', type: 'number' },
  { key: 'spend_mtd', label: 'Spend month-to-date ($)', type: 'number' },
  { key: 'clicks', label: 'Clicks', type: 'number' },
  { key: 'impressions', label: 'Impressions', type: 'number' },
  { key: 'cpc', label: 'Cost per click ($, optional)', type: 'number' },
];

export default function GoogleAdsSnapshotCard() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await base44.entities.AdsSnapshot.list('-update_date', 1);
    const row = rows[0] || null;
    setLatest(row);
    setForm(row || { update_date: new Date().toISOString().slice(0, 10) });
    setNotes(row?.notes || '');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEditing = () => {
    setForm(latest || { update_date: new Date().toISOString().slice(0, 10) });
    setNotes(latest?.notes || '');
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    const user = await base44.auth.me().catch(() => null);
    await base44.entities.AdsSnapshot.create({
      ...form,
      spend_yesterday: form.spend_yesterday !== undefined && form.spend_yesterday !== '' ? Number(form.spend_yesterday) : undefined,
      spend_mtd: form.spend_mtd !== undefined && form.spend_mtd !== '' ? Number(form.spend_mtd) : undefined,
      clicks: form.clicks !== undefined && form.clicks !== '' ? Number(form.clicks) : undefined,
      impressions: form.impressions !== undefined && form.impressions !== '' ? Number(form.impressions) : undefined,
      cpc: form.cpc !== undefined && form.cpc !== '' ? Number(form.cpc) : undefined,
      notes,
      updated_by: user?.email,
    });
    setSaving(false);
    setEditing(false);
    load();
  };

  return (
    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111111] p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#D4AF37]">Google Ads</h2>
        <div className="flex items-center gap-2">
          <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-white/60 hover:text-[#D4AF37]">
            Open Google Ads <ExternalLink className="w-3 h-3" />
          </a>
          {!editing && (
            <Button size="sm" onClick={startEditing} className="bg-[#D4AF37] text-black hover:bg-[#e8c84a]">
              <Pencil className="w-3.5 h-3.5 mr-1.5" /> Update numbers
            </Button>
          )}
        </div>
      </div>

      {/* Read-only account labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
        <div><p className="text-white/50">Account</p><p className="font-medium">Dyson Homes CoPilot</p></div>
        <div><p className="text-white/50">Customer ID</p><p className="font-medium">331-272-4023</p></div>
        <div><p className="text-white/50">Tracking code</p><p className="font-medium">AW-18469995239</p></div>
        <div><p className="text-white/50">Landing site</p><p className="font-medium">dysonhomes.com</p></div>
      </div>

      {/* Read-only Month-1 budget targets */}
      <div className="text-xs text-white/60 mb-4 border-t border-white/10 pt-3">
        Month-1 budget targets: ~$400/month search/address-match · ~$100/month site visitors
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FIELD_DEFS.map(f => (
              <div key={f.key}>
                <label className="block text-[11px] text-white/50 mb-1">{f.label}</label>
                <Input
                  type={f.type}
                  value={form[f.key] ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="bg-black border-white/15 text-white text-sm"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[11px] text-white/50 mb-1">Notes</label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} className="bg-black border-white/15 text-white text-sm" />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving} className="bg-[#D4AF37] text-black hover:bg-[#e8c84a]">
              {saving ? 'Saving…' : 'Save snapshot'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)} className="border-white/20 text-white">Cancel</Button>
          </div>
        </div>
      ) : latest ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
          <div><p className="text-white/50 text-xs">Updated</p><p className="font-semibold">{latest.update_date || '—'}</p></div>
          <div><p className="text-white/50 text-xs">Spend yesterday</p><p className="font-semibold">{latest.spend_yesterday != null ? `$${latest.spend_yesterday}` : '—'}</p></div>
          <div><p className="text-white/50 text-xs">Spend MTD</p><p className="font-semibold">{latest.spend_mtd != null ? `$${latest.spend_mtd}` : '—'}</p></div>
          <div><p className="text-white/50 text-xs">Clicks</p><p className="font-semibold">{latest.clicks ?? '—'}</p></div>
          <div><p className="text-white/50 text-xs">Impressions</p><p className="font-semibold">{latest.impressions ?? '—'}</p></div>
          {latest.cpc != null && <div><p className="text-white/50 text-xs">CPC</p><p className="font-semibold">${latest.cpc}</p></div>}
          {latest.notes && <div className="col-span-full"><p className="text-white/50 text-xs">Notes</p><p>{latest.notes}</p></div>}
        </div>
      ) : (
        <p className="text-sm text-white/50">No numbers entered yet — click "Update numbers" after checking Google Ads.</p>
      )}
    </div>
  );
}