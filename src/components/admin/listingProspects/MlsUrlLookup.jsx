import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link2, Sparkles, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';

function makeToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * MlsUrlLookup — paste a single MLS listing URL and everything else is
 * pulled automatically: listing details (address, price, beds/baths/sqft,
 * photo, description) AND the listing agent's name + phone + email. No
 * manual data entry.
 */
export default function MlsUrlLookup({ onImported }) {
  const [url, setUrl] = useState('');
  const [repName, setRepName] = useState(() => localStorage.getItem('dyson_last_rep') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('mlsListingLookup', { url: url.trim() });
      if (!res.data?.success) {
        setError(res.data?.error || 'Could not read that listing.');
        setLoading(false);
        return;
      }
      const listing = res.data.listing || {};
      if (!listing.agent_name) {
        setError("Couldn't find the listing agent's name on that page — try a different listing URL.");
        setLoading(false);
        return;
      }
      await base44.entities.ListingProspect.create({
        ...listing,
        rep_name: repName.trim() || undefined,
        referral_fee_offered: '30% referral fee',
        token: makeToken(),
      });
      if (repName.trim()) localStorage.setItem('dyson_last_rep', repName.trim());
      setUrl('');
      onImported?.();
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 rounded-2xl mb-6" style={{ background: '#161616', border: `1px solid ${GOLD}30` }}>
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: GOLD }}>
        <Link2 className="w-3.5 h-3.5" /> Paste MLS Listing Link
      </p>
      <p className="text-xs text-white mb-2">We pull the listing details and the listing agent's name, phone &amp; email automatically — no typing required.</p>
      <input
        value={repName}
        onChange={(e) => setRepName(e.target.value)}
        placeholder="Brought in by (e.g. Marcos)"
        disabled={loading}
        className="w-full mb-2 bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.redfin.com/... or any MLS listing URL"
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <button
          onClick={handleFetch}
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 shrink-0"
          style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching…</> : <><Sparkles className="w-4 h-4" /> Fetch &amp; Generate Link</>}
        </button>
      </div>
      {error && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}