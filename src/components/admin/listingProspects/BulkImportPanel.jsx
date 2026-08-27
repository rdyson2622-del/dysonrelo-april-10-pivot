import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { UploadCloud, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';

function makeToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Turns pasted rows like:
//   Jane Smith, Compass, Palo Alto, 123 Main St, 3500000, 30% referral fee
// into ListingProspect records, one per line.
function parseRows(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [agent_name, brokerage, city, listing_address, listing_value, referral_fee_offered] = line.split(',').map(v => (v || '').trim());
      if (!agent_name) return null;
      return {
        agent_name,
        brokerage: brokerage || '',
        city: city || '',
        listing_address: listing_address || '',
        listing_value: listing_value ? Number(listing_value.replace(/[^0-9.]/g, '')) : undefined,
        referral_fee_offered: referral_fee_offered || '30% referral fee',
        token: makeToken(),
      };
    })
    .filter(Boolean);
}

/**
 * BulkImportPanel — automates loading today's 20 listing agents at once
 * instead of typing each one into the single-entry form. Paste one agent
 * per line (comma-separated: name, brokerage, city, listing address,
 * listing value, referral fee) and every row instantly gets its own
 * preview token/link.
 */
export default function BulkImportPanel({ onImported }) {
  const [text, setText] = useState('');
  const [repName, setRepName] = useState(() => localStorage.getItem('dyson_last_rep') || '');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    const rows = parseRows(text);
    if (rows.length === 0) return;
    setImporting(true);
    setResult(null);
    const withRep = repName.trim() ? rows.map(r => ({ ...r, rep_name: repName.trim() })) : rows;
    await base44.entities.ListingProspect.bulkCreate(withRep);
    if (repName.trim()) localStorage.setItem('dyson_last_rep', repName.trim());
    setResult(rows.length);
    setText('');
    setImporting(false);
    onImported?.();
  };

  return (
    <div className="p-4 rounded-2xl mb-6" style={{ background: '#161616', border: `1px solid ${GOLD}30` }}>
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: GOLD }}>
        <UploadCloud className="w-3.5 h-3.5" /> Bulk Import — Paste Today's List
      </p>
      <p className="text-xs text-white mb-2">One agent per line: Name, Brokerage, City, Listing Address, Listing Value, Referral Fee</p>
      <input
        value={repName}
        onChange={(e) => setRepName(e.target.value)}
        placeholder="Brought in by (e.g. Marcos) — applies to this whole batch"
        disabled={importing}
        className="w-full mb-2 bg-transparent text-sm text-white outline-none rounded-lg p-2.5 placeholder-stone-500"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Jane Smith, Compass, Palo Alto, 123 Main St, 3500000, 30% referral fee\nJohn Doe, Sotheby's, Malibu, 456 Ocean Ave, 4200000, 25% referral fee"}
        rows={5}
        disabled={importing}
        className="w-full bg-transparent text-sm text-white outline-none rounded-lg p-3 placeholder-stone-500 mb-3"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <button
        onClick={handleImport}
        disabled={importing || !text.trim()}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
      >
        {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</> : 'Import All & Generate Links'}
      </button>
      {result != null && <p className="text-xs mt-2" style={{ color: '#4ade80' }}>Added {result} agent{result === 1 ? '' : 's'} with preview links below.</p>}
    </div>
  );
}