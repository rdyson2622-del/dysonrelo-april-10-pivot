import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ExternalLink, Copy, MapPin, Upload, CheckCircle2, AlertCircle, X, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import * as XLSX from 'xlsx';

if (typeof window !== 'undefined') window.__XLSX__ = XLSX;

const GOLD = '#D4AF37';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

// ── Single Lookup (unchanged) ──────────────────────────────────────────────

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
          <input value={street} onChange={e => setStreet(e.target.value)} placeholder="e.g. 123 Main St"
            className="w-full rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>CITY</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Los Angeles"
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }} />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STATE</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: state ? '#fff' : 'rgba(255,255,255,0.4)', outline: 'none' }}>
              <option value="">Select State</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {fullAddress && (
          <>
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
            <a href="https://www.propstream.com" target="_blank" rel="noopener noreferrer"
              className="w-full py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000', display: 'flex' }}>
              <ExternalLink className="w-4 h-4" />
              Open PropStream — Run Skip Trace
            </a>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Copy the address above, then paste it into PropStream's Skip Trace tool.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Column detection helpers ───────────────────────────────────────────────

const COLUMN_MAP = {
  owner_name: ['owner', 'owner name', 'seller', 'seller name', 'taxpayer name', 'contact name', 'name', 'full name'],
  phone:      ['phone', 'mobile', 'cell', 'phone number', 'phone 1', 'mobile phone', 'cell phone', 'owner phone', 'contact phone'],
  email:      ['email', 'email address', 'owner email', 'contact email'],
  street:     ['property address', 'property street', 'street address', 'address', 'prop address', 'site address', 'street'],
  city:       ['property city', 'city', 'prop city', 'site city'],
  state:      ['property state', 'state', 'prop state', 'site state', 'st'],
  zip:        ['property zip', 'zip', 'zip code', 'postal code', 'prop zip', 'site zip'],
  listing_price: ['list price', 'listing price', 'price', 'asking price', 'sale price'],
};

function findCol(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c));
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseFileToRows(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const XLSX = window.__XLSX__;
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (jsonRows.length < 2) { resolve([]); return; }
        const headers = jsonRows[0].map(h => String(h).trim());
        const csvRows = jsonRows.slice(1).map(r => headers.map((_, i) => String(r[i] || '').trim()));

        const m = {};
        for (const [field, candidates] of Object.entries(COLUMN_MAP)) {
          m[field] = findCol(headers, candidates);
        }
        if (m.street < 0) { reject('Could not find address column in: ' + file.name); return; }

        const parsed = csvRows
          .map(row => ({
            owner_name:    m.owner_name    >= 0 ? row[m.owner_name]    : '',
            phone:         m.phone         >= 0 ? row[m.phone]         : '',
            email:         m.email         >= 0 ? row[m.email]         : '',
            street:                                row[m.street]        || '',
            city:          m.city          >= 0 ? row[m.city]          : '',
            state:         m.state         >= 0 ? row[m.state]         : '',
            zip:           m.zip           >= 0 ? row[m.zip]           : '',
            listing_price: m.listing_price >= 0 ? row[m.listing_price] : '',
          }))
          .filter(r => r.street.trim());
        resolve(parsed);
      } catch { reject('Could not parse: ' + file.name); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ── Bulk Builder ───────────────────────────────────────────────────────────

function BulkBuilder() {
  const [rows, setRows] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef();

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setImportError('');
    setImportResult(null);
    try {
      const allParsed = await Promise.all(Array.from(files).map(parseFileToRows));
      const merged = allParsed.flat();
      setRows(prev => {
        const combined = [...prev, ...merged];
        const seen = new Set();
        return combined.filter(r => {
          const key = r.street.toLowerCase().trim();
          if (seen.has(key)) return false;
          seen.add(key); return true;
        });
      });
      setFileNames(prev => [...prev, ...Array.from(files).map(f => f.name)]);
    } catch (err) {
      setImportError(typeof err === 'string' ? err : 'Import failed');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
  const reset = () => { setRows([]); setFileNames([]); setImportError(''); setImportResult(null); if (fileRef.current) fileRef.current.value = ''; };

  const importToListingOwners = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      const records = rows.map(r => ({
        owner_name: r.owner_name || 'Unknown',
        phone: r.phone || '',
        email: r.email || '',
        property_address: [r.street, r.city, r.state].filter(Boolean).join(', '),
        property_city: r.city || '',
        property_state: r.state || '',
        listing_price: r.listing_price ? parseFloat(String(r.listing_price).replace(/[^0-9.]/g, '')) || undefined : undefined,
        contact_status: 'not_contacted',
      }));
      const created = await base44.entities.ListingOwner.bulkCreate(records);
      setImportResult({ count: created.length });
    } catch (err) {
      setImportError('Import failed: ' + (err.message || err));
    } finally {
      setImporting(false);
    }
  };

  const phoneCount = rows.filter(r => r.phone).length;

  return (
    <>
      {/* Step 1 */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}>
        <p className="text-xs font-bold tracking-widest mb-2" style={{ color: GOLD }}>STEP 1 — RUN SKIP TRACE IN PROPSTREAM</p>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          In PropStream, open your saved list → select all records → click <strong style={{ color: '#fff' }}>Skip Trace</strong> → then <strong style={{ color: '#fff' }}>Export CSV</strong>. The export will include owner names + cell numbers.
        </p>
        <a href="https://www.propstream.com" target="_blank" rel="noopener noreferrer"
          className="w-full py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}>
          <ExternalLink className="w-4 h-4" />
          Open PropStream & Run Skip Trace
        </a>
      </div>

      {/* Step 2 */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}>
        <p className="text-xs font-bold tracking-widest mb-1" style={{ color: GOLD }}>STEP 2 — UPLOAD YOUR SKIP-TRACED CSV EXPORTS</p>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Upload 1, 2, or 3 PropStream result CSVs. Owner names + phones are read automatically. Duplicates removed.
        </p>

        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
          className="rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer transition-all hover:opacity-80"
          style={{ border: '2px dashed rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.04)' }}>
          <Upload className="w-10 h-10 mb-3" style={{ color: GOLD }} />
          <p className="font-bold mb-1" style={{ color: '#fff' }}>
            {fileNames.length === 0 ? 'Drop PropStream CSV(s) here' : 'Drop another CSV to add more'}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>or click to browse · multiple files OK</p>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>

        {fileNames.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {fileNames.map((name, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#22C55E' }} />
                <span className="text-xs font-medium" style={{ color: '#fff' }}>{name}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold" style={{ color: GOLD }}>{rows.length} total records (deduplicated)</span>
                <span className="text-xs ml-2" style={{ color: phoneCount > 0 ? '#22C55E' : 'rgba(255,255,255,0.35)' }}>
                  · {phoneCount} with cell numbers
                </span>
              </div>
              <button onClick={reset} className="text-xs hover:opacity-70 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X className="w-3 h-3" /> Clear all
              </button>
            </div>
          </div>
        )}

        {importError && (
          <div className="flex items-center gap-2 mt-3">
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#EF4444' }} />
            <span className="text-xs" style={{ color: '#EF4444' }}>{importError}</span>
          </div>
        )}
      </div>

      {/* Step 3 — Import */}
      {rows.length > 0 && !importResult && (
        <div className="rounded-2xl p-5 mb-4" style={{ background: '#000', border: `1px solid ${GOLD}` }}>
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: GOLD }}>STEP 3 — IMPORT INTO LISTING OWNERS</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Adds all {rows.length} owners to your Listing Owners database, ready for SMS outreach.
          </p>
          <button onClick={importToListingOwners} disabled={importing}
            className="w-full py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}>
            {importing
              ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Importing...</>
              : <><Users className="w-4 h-4" /> Import {rows.length} Owners to Database</>
            }
          </button>
        </div>
      )}

      {importResult && (
        <div className="rounded-2xl p-5 mb-4 flex items-start gap-3"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: '#22C55E' }}>✓ {importResult.count} owners imported!</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Go to <strong>Admin → Listing Owners</strong> to send outreach SMS to your new contacts.
            </p>
            <button onClick={reset} className="mt-3 text-xs font-semibold hover:opacity-80 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              Upload More CSVs
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AdminSkipTrace() {
  const [mode, setMode] = useState('bulk');

  const steps = mode === 'single'
    ? [
        'Enter the property address above',
        'Click "Open PropStream" and log in',
        'Paste the address into PropStream\'s Skip Trace tool',
        'Export the result and note the owner name + cell number',
        'Add them manually to the Listing Owners database',
      ]
    : [
        'Log into PropStream and open your saved property list',
        'Select all records → click Skip Trace → PropStream finds cell numbers',
        'Export the skip-traced results as a CSV file',
        'Return here and upload the CSV (or all 3 CSVs at once)',
        'Click "Import Owners to Database" — done, ready for SMS outreach',
      ];

  return (
    <div className="min-h-screen p-6" style={{ background: '#808080' }}>
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-xs font-bold tracking-[0.3em] mb-1" style={{ color: GOLD }}>ADMIN TOOL</p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#fff' }}>Skip Trace — PropStream</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Run skip trace in PropStream to get owner cell numbers, then import directly into your outreach database.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex rounded-xl p-1 mb-6 w-fit"
          style={{ background: '#000', border: '1px solid rgba(212,175,55,0.2)' }}>
          {[{ id: 'bulk', label: 'Bulk Import (3 CSVs)' }, { id: 'single', label: 'Single Address' }].map(opt => (
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

        <motion.div key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {mode === 'single' ? <SingleLookup /> : <BulkBuilder />}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 mt-4"
          style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: GOLD }}>
            HOW IT WORKS — {mode === 'single' ? 'SINGLE LOOKUP' : 'BULK IMPORT'}
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