import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';

// ── Column detection helpers (same logic as AdminSkipTrace) ────────────────

function findColExact(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.indexOf(c.toLowerCase());
    if (idx !== -1) return idx;
  }
  return -1;
}

function findColContains(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c.toLowerCase()));
    if (idx !== -1) return idx;
  }
  return -1;
}

function findCol(headers, candidates) {
  const exact = findColExact(headers, candidates);
  if (exact !== -1) return exact;
  return findColContains(headers, candidates);
}

function extractOwnerName(row, headers) {
  const lower = headers.map(h => h.toLowerCase().trim());

  // Single name columns
  const singleCol = findColExact(headers, [
    'owner name', 'seller name', 'taxpayer name', 'contact name', 'full name', 'name', 'owner', 'seller',
  ]);
  if (singleCol !== -1 && row[singleCol]?.trim()) return row[singleCol].trim();

  // PropStream skip trace: "Owner 1 First Name" / "Owner 1 Last Name"
  const o1FirstIdx = lower.indexOf('owner 1 first name');
  const o1LastIdx  = lower.indexOf('owner 1 last name');
  if (o1FirstIdx !== -1 || o1LastIdx !== -1) {
    const first = o1FirstIdx !== -1 ? (row[o1FirstIdx] || '').trim() : '';
    const last  = o1LastIdx  !== -1 ? (row[o1LastIdx]  || '').trim() : '';
    const combined = [first, last].filter(Boolean).join(' ');
    if (combined) return combined;
  }

  // Generic first/last
  const firstIdx = lower.indexOf('first name');
  const lastIdx  = lower.indexOf('last name');
  if (firstIdx !== -1 || lastIdx !== -1) {
    const first = firstIdx !== -1 ? (row[firstIdx] || '').trim() : '';
    const last  = lastIdx  !== -1 ? (row[lastIdx]  || '').trim() : '';
    const combined = [first, last].filter(Boolean).join(' ');
    if (combined) return combined;
  }

  return '';
}

function extractBestPhone(row, headers) {
  const lower = headers.map(h => h.toLowerCase().trim());
  const priority = [
    'cell phone 1', 'cell phone1', 'cellphone1',
    'cell phone 2', 'cell phone2',
    'phone 1', 'phone1',
    'mobile phone 1', 'mobile 1', 'mobile1',
    'phone 2', 'phone2',
    'mobile', 'cell', 'phone',
    'owner phone', 'contact phone',
  ];
  for (const p of priority) {
    const idx = lower.indexOf(p);
    if (idx !== -1 && row[idx]?.trim()) return row[idx].trim();
  }
  for (let i = 0; i < lower.length; i++) {
    if ((lower[i].includes('cell') || lower[i].includes('phone')) && row[i]?.trim()) {
      return row[i].trim();
    }
  }
  return '';
}

const STREET_CANDIDATES = ['property address', 'property street', 'street address', 'address', 'prop address', 'site address', 'mailing address', 'street'];
const CITY_CANDIDATES   = ['property city', 'city', 'prop city', 'site city', 'mailing city'];
const STATE_CANDIDATES  = ['property state', 'state', 'prop state', 'site state', 'mailing state'];
const ZIP_CANDIDATES    = ['property zip', 'zip code', 'zip', 'postal code'];
const PRICE_CANDIDATES  = ['list price', 'listing price', 'estimated value', 'price', 'asking price', 'est. value', 'mls amount'];
const EMAIL_CANDIDATES  = ['email 1', 'email1', 'email address', 'email', 'owner email', 'contact email'];

function parseXLSX(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject('Could not read file: ' + file.name);
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (jsonRows.length < 2) { resolve([]); return; }

        const headers = jsonRows[0].map(h => String(h).trim());
        const dataRows = jsonRows.slice(1).map(r => headers.map((_, i) => String(r[i] || '').trim()));

        const streetIdx = findCol(headers, STREET_CANDIDATES);
        if (streetIdx < 0) {
          reject('Could not find address column.\nHeaders found: ' + headers.slice(0, 12).join(', '));
          return;
        }

        const cityIdx  = findCol(headers, CITY_CANDIDATES);
        const stateIdx = findCol(headers, STATE_CANDIDATES);
        const zipIdx   = findCol(headers, ZIP_CANDIDATES);
        const priceIdx = findCol(headers, PRICE_CANDIDATES);
        const emailIdx = findCol(headers, EMAIL_CANDIDATES);

        const parsed = dataRows
          .map(row => ({
            owner_name:    extractOwnerName(row, headers),
            phone:         extractBestPhone(row, headers),
            email:         emailIdx  >= 0 ? row[emailIdx]  : '',
            street:        row[streetIdx] || '',
            city:          cityIdx   >= 0 ? row[cityIdx]   : '',
            state:         stateIdx  >= 0 ? row[stateIdx]  : '',
            zip:           zipIdx    >= 0 ? row[zipIdx]    : '',
            listing_price: priceIdx  >= 0 ? row[priceIdx]  : '',
          }))
          .filter(r => r.street.trim());

        resolve({ rows: parsed, headers });
      } catch (err) {
        reject('Could not parse file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export default function OwnerImportCSV({ open, onClose, onImportComplete }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const reset = () => { setError(null); setResult(null); if (fileRef.current) fileRef.current.value = ''; };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { rows, headers } = await parseXLSX(file);

      if (!rows.length) throw new Error('No data rows found in file.');

      // Relax validation — accept rows with just an address even if no name
      const valid = rows.filter(r => r.street.trim());
      if (!valid.length) throw new Error('No rows with a property address found.');

      const toInsert = valid.map(r => ({
        owner_name:       String(r.owner_name || 'Unknown'),
        phone:            String(r.phone || ''),
        email:            String(r.email || ''),
        property_address: String([r.street, r.city, r.state].filter(Boolean).join(', ')),
        property_city:    String(r.city || ''),
        property_state:   String(r.state || ''),
        listing_price:    r.listing_price ? parseFloat(String(r.listing_price).replace(/[^0-9.]/g, '')) || undefined : undefined,
        contact_status:   'not_contacted',
      }));

      // Batch in chunks of 25
      const CHUNK = 25;
      let totalCreated = 0;
      for (let i = 0; i < toInsert.length; i += CHUNK) {
        const created = await base44.entities.ListingOwner.bulkCreate(toInsert.slice(i, i + CHUNK));
        totalCreated += created.length;
      }

      setResult({ count: totalCreated });
      onImportComplete?.();
    } catch (err) {
      setError(typeof err === 'string' ? err : (err.message || 'Import failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Owners from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!result && (
            <>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Accepts PropStream & MLS exports automatically.</p>
                <p className="text-xs text-slate-500">Owner names, phones, addresses, and prices are detected automatically from column headers.</p>
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 cursor-pointer hover:border-slate-400 transition">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin mb-2" />
                    <span className="text-sm font-medium text-slate-600">Processing…</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-700">Select CSV / Excel file</span>
                    <span className="text-xs text-slate-400 mt-1">.csv, .xlsx, .xls</span>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} disabled={loading} className="hidden" />
              </label>

              {error && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Import failed</p>
                    <p className="text-sm text-red-800 whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {result && (
            <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-800">{result.count} owners imported</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {error && <Button onClick={reset}>Try Again</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}