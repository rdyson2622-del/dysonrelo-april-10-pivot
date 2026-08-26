import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Copy, Check, MapPin } from 'lucide-react';
import BulkImportPanel from '@/components/admin/listingProspects/BulkImportPanel';

const GOLD = '#D4AF37';

function makeToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const EMPTY = { agent_name: '', brokerage: '', city: '', listing_address: '', listing_value: '', referral_fee_offered: '30% referral fee' };

/**
 * AdminListingProspects — quick-entry tool for the daily MLS calling list
 * (~20/day). Each entry instantly generates a personalized preview link
 * (name, listing, brokerage, city pre-filled) to text/email or pull up live
 * on the call.
 */
export default function AdminListingProspects() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [copiedId, setCopiedId] = useState(null);

  const { data: prospects = [] } = useQuery({
    queryKey: ['listingProspects'],
    queryFn: () => base44.entities.ListingProspect.list('-created_date', 100),
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.agent_name.trim()) return;
    await base44.entities.ListingProspect.create({
      ...form,
      listing_value: form.listing_value ? Number(form.listing_value) : undefined,
      token: makeToken(),
    });
    setForm(EMPTY);
    queryClient.invalidateQueries({ queryKey: ['listingProspects'] });
  };

  const linkFor = (token) => `${window.location.origin}/agent-preview/${token}`;

  const copyLink = (p) => {
    navigator.clipboard.writeText(linkFor(p.token));
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1 flex items-center gap-2" style={{ color: GOLD }}>
        <MapPin className="w-3.5 h-3.5" /> MLS Listing Agent Outreach
      </p>
      <h1 className="text-2xl font-serif text-white mb-4">Daily prospect list &amp; preview links</h1>

      <BulkImportPanel onImported={() => queryClient.invalidateQueries({ queryKey: ['listingProspects'] })} />

      <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-2xl mb-6" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}30` }}>
        <input value={form.agent_name} onChange={e => setForm(f => ({ ...f, agent_name: e.target.value }))} placeholder="Agent name*" className="col-span-1 bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <input value={form.brokerage} onChange={e => setForm(f => ({ ...f, brokerage: e.target.value }))} placeholder="Brokerage" className="bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" className="bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <input value={form.listing_address} onChange={e => setForm(f => ({ ...f, listing_address: e.target.value }))} placeholder="Listing address" className="bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <input value={form.listing_value} onChange={e => setForm(f => ({ ...f, listing_value: e.target.value }))} placeholder="Listing value ($)" type="number" className="bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <input value={form.referral_fee_offered} onChange={e => setForm(f => ({ ...f, referral_fee_offered: e.target.value }))} placeholder="Referral fee terms" className="bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        <button type="submit" className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
          <Plus className="w-4 h-4" /> Add &amp; Generate Link
        </button>
      </form>

      <div className="space-y-2">
        {prospects.map(p => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="min-w-0">
              <p className="text-sm text-white font-semibold truncate">{p.agent_name} <span className="text-white/40">· {p.brokerage}</span></p>
              <p className="text-xs text-white/50 truncate">{p.listing_address}{p.city ? `, ${p.city}` : ''} {p.listing_value ? `· $${Number(p.listing_value).toLocaleString()}` : ''}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full" style={{ color: GOLD, border: `1px solid ${GOLD}40` }}>{p.status}</span>
              <button onClick={() => copyLink(p)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}40`, color: GOLD }}>
                {copiedId === p.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Link</>}
              </button>
            </div>
          </div>
        ))}
        {prospects.length === 0 && <p className="text-sm text-white/40">No prospects added yet.</p>}
      </div>
    </div>
  );
}