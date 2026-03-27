import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, ExternalLink, Copy, MapPin } from 'lucide-react';
import PropStreamCSVImporter from '../components/admin/PropStreamCSVImporter';

const GOLD = '#D4AF37';

const emptyRow = () => ({ street: '', city: '', state: '', zip: '' });

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

function SingleLookup() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [copied, setCopied] = useState(false);

  const fullAddress = [street, city, state].filter(Boolean).join(', ');

  const copyAddress = () => {
    if (!fullAddress) return;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STREET ADDRESS</label>
          <input
            value={street}
            onChange={e => setStreet(e.target.value)}
            placeholder="e.g. 123 Main St"
            className="w-full rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>CITY</label>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Los Angeles"
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STATE</label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: state ? '#fff' : 'rgba(255,255,255,0.4)', outline: 'none' }}
            >
              <option value="">Select State</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {fullAddress && (
          <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#fff' }}>{fullAddress}</span>
            </div>
            <button onClick={copyAddress} className="p-1 rounded hover:opacity-70 shrink-0 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" style={{ color: GOLD }} />
              {copied && <span className="text-xs" style={{ color: GOLD }}>Copied!</span>}
            </button>
          </div>
        )}

        <a
          href="https://app.batchdata.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000', display: 'flex' }}
        >
          <ExternalLink className="w-4 h-4" />
          Open BatchData — Run Skip Trace
        </a>
        <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Copy the address above, then paste it into BatchData's Skip Trace tool after logging in.
        </p>
      </div>
    </div>
  );
}

function BulkBuilder() {
  const [rows, setRows] = useState([emptyRow()]);

  const updateRow = (i, field, val) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };
  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (i) => setRows(prev => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i));

  const validRows = rows.filter(r => r.street.trim() && r.city.trim() && r.state.trim());

  const downloadCSV = () => {
    if (!validRows.length) return;
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

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData('text') || '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    e.preventDefault();
    const parsed = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      return { street: parts[0] || '', city: parts[1] || '', state: parts[2] || '', zip: parts[3] || '' };
    }).filter(r => r.street);
    if (parsed.length) setRows(parsed);
  };

  return (
    <>
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}>
        <div className="grid grid-cols-12 gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(212,175,55,0.05)' }}>
          <div className="col-span-5 text-xs font-bold tracking-widest" style={{ color: GOLD }}>STREET ADDRESS</div>
          <div className="col-span-3 text-xs font-bold tracking-widest" style={{ color: GOLD }}>CITY</div>
          <div className="col-span-2 text-xs font-bold tracking-widest" style={{ color: GOLD }}>STATE</div>
          <div className="col-span-1 text-xs font-bold tracking-widest" style={{ color: GOLD }}>ZIP</div>
          <div className="col-span-1" />
        </div>

        <div onPaste={handlePaste}>
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-4 py-2 items-center"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="col-span-5">
                <input value={row.street} onChange={e => updateRow(i, 'street', e.target.value)}
                  placeholder="123 Main St" className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
              </div>
              <div className="col-span-3">
                <input value={row.city} onChange={e => updateRow(i, 'city', e.target.value)}
                  placeholder="Los Angeles" className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
              </div>
              <div className="col-span-2">
                <select value={row.state} onChange={e => updateRow(i, 'state', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: row.state ? '#fff' : 'rgba(255,255,255,0.3)', outline: 'none' }}>
                  <option value="">ST</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <input value={row.zip} onChange={e => updateRow(i, 'zip', e.target.value)}
                  placeholder="90210" maxLength={5} className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
              </div>
              <div className="col-span-1 flex justify-center">
                <button onClick={() => removeRow(i)} className="p-1.5 rounded-lg hover:opacity-70">
                  <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={addRow}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}>
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>
      </div>

      <p className="text-xs mb-4 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
        Tip: Paste comma-separated lines (street, city, state, zip) into any field to bulk-import.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button onClick={downloadCSV} disabled={!validRows.length}
          className="flex-1 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}>
          <Download className="w-4 h-4" />
          Download CSV ({validRows.length} address{validRows.length !== 1 ? 'es' : ''})
        </button>
        <a href="https://app.batchdata.com" target="_blank" rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 hover:opacity-80 transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
          <ExternalLink className="w-4 h-4" />
          Open BatchData — Log In & Upload
        </a>
      </div>
    </>
  );
}

export default function AdminSkipTrace() {
  const [mode, setMode] = useState('single'); // 'single' | 'bulk'

  const steps = mode === 'single'
    ? [
        'Enter the property address above and copy it',
        'Click "Open BatchData" to go to your account',
        'Paste the address into BatchData\'s Skip Trace tool',
        'Copy the owner name, phone & email back here',
        'Add them to the Listing Owners database manually',
      ]
    : [
        'Add all your property addresses in the table above',
        'Click "Download CSV" — formatted for BatchData bulk upload',
        'Click "Open BatchData" and log into your account',
        'Go to Skip Trace → Bulk Upload → upload the CSV file',
        'BatchData returns owner names, phones & emails for all addresses',
        'Download their results and add owners to your Listing Owners database',
      ];

  return (
    <div className="min-h-screen p-6" style={{ background: '#808080' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-xs font-bold tracking-[0.3em] mb-1" style={{ color: GOLD }}>ADMIN TOOL</p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#fff' }}>Skip Trace Lookup</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Look up a single address or build a bulk list — then run skip trace in BatchData.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex rounded-xl p-1 mb-6 w-fit"
          style={{ background: '#000', border: '1px solid rgba(212,175,55,0.2)' }}>
          {[{ id: 'single', label: 'Single Lookup' }, { id: 'bulk', label: 'Bulk Builder' }].map(opt => (
            <button key={opt.id} onClick={() => setMode(opt.id)}
              className="px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all"
              style={{
                background: mode === opt.id ? 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)' : 'transparent',
                color: mode === opt.id ? '#000' : 'rgba(255,255,255,0.5)',
              }}>
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* PropStream Importer — always visible */}
        <PropStreamCSVImporter />

        {/* Content */}
        <motion.div key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {mode === 'single' ? <SingleLookup /> : <BulkBuilder />}
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: GOLD }}>
            HOW TO RUN A {mode === 'single' ? 'SKIP TRACE' : 'BULK SKIP TRACE'}
          </p>
          {steps.map((step, i) => (
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