import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

const GOLD = '#D4AF37';

const emptyRow = () => ({ street: '', city: '', state: '', zip: '' });

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

export default function AdminSkipTrace() {
  const [rows, setRows] = useState([emptyRow()]);
  const [copied, setCopied] = useState(false);

  const updateRow = (i, field, val) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const addRow = () => setRows(prev => [...prev, emptyRow()]);

  const removeRow = (i) => setRows(prev => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i));

  const validRows = rows.filter(r => r.street.trim() && r.city.trim() && r.state.trim());

  const downloadCSV = () => {
    if (!validRows.length) return;
    // BatchData bulk skip trace format
    const headers = ['First Name', 'Last Name', 'Property Address', 'Property City', 'Property State', 'Property Zip'];
    const dataRows = validRows.map(r =>
      ['', '', r.street.trim(), r.city.trim(), r.state.trim(), r.zip.trim()]
        .map(v => `"${v.replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...dataRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batchdata-skip-trace-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePasteBulk = (e) => {
    const text = e.clipboardData?.getData('text') || '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return; // not bulk paste
    e.preventDefault();
    const parsed = lines.map(line => {
      // Try comma-separated: street, city, state, zip
      const parts = line.split(',').map(p => p.trim());
      return {
        street: parts[0] || '',
        city: parts[1] || '',
        state: parts[2] || '',
        zip: parts[3] || '',
      };
    }).filter(r => r.street);
    if (parsed.length) setRows(parsed);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: '#808080' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-bold tracking-[0.3em] mb-1" style={{ color: GOLD }}>ADMIN TOOL</p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#fff' }}>Skip Trace — Bulk Builder</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Add all your property addresses below → download the CSV → upload to BatchData's bulk skip trace tool.
          </p>
        </motion.div>

        {/* Address Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(212,175,55,0.05)' }}>
            <div className="col-span-5 text-xs font-bold tracking-widest" style={{ color: GOLD }}>STREET ADDRESS</div>
            <div className="col-span-3 text-xs font-bold tracking-widest" style={{ color: GOLD }}>CITY</div>
            <div className="col-span-2 text-xs font-bold tracking-widest" style={{ color: GOLD }}>STATE</div>
            <div className="col-span-1 text-xs font-bold tracking-widest" style={{ color: GOLD }}>ZIP</div>
            <div className="col-span-1" />
          </div>

          {/* Rows */}
          <div onPaste={handlePasteBulk}>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 px-4 py-2 items-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="col-span-5">
                  <input
                    value={row.street}
                    onChange={e => updateRow(i, 'street', e.target.value)}
                    placeholder="123 Main St"
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    value={row.city}
                    onChange={e => updateRow(i, 'city', e.target.value)}
                    placeholder="Los Angeles"
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={row.state}
                    onChange={e => updateRow(i, 'state', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: row.state ? '#fff' : 'rgba(255,255,255,0.3)', outline: 'none' }}
                  >
                    <option value="">ST</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-1">
                  <input
                    value={row.zip}
                    onChange={e => updateRow(i, 'zip', e.target.value)}
                    placeholder="90210"
                    maxLength={5}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button onClick={() => removeRow(i)} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity">
                    <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add row */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={addRow}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}>
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>
        </motion.div>

        {/* Paste tip */}
        <p className="text-xs mb-6 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Tip: You can paste a comma-separated list (street, city, state, zip — one per line) directly into any field to bulk-import addresses.
        </p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <button
            onClick={downloadCSV}
            disabled={!validRows.length}
            className="flex-1 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}
          >
            <Download className="w-4 h-4" />
            Download CSV ({validRows.length} address{validRows.length !== 1 ? 'es' : ''})
          </button>

          <a
            href="https://app.batchdata.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <ExternalLink className="w-4 h-4" />
            Open BatchData — Log In & Upload
          </a>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: GOLD }}>HOW TO RUN A BULK SKIP TRACE</p>
          {[
            'Add all your property addresses in the table above (or paste a comma-separated list)',
            'Click "Download CSV" — this creates a file formatted for BatchData\'s bulk upload',
            'Click "Open BatchData" and log into your account',
            'Go to Skip Trace → Bulk Upload → upload the CSV file',
            'BatchData returns owner names, phones & emails for all addresses',
            'Download their results and add the owners to your Listing Owners database',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}>
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{step}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}