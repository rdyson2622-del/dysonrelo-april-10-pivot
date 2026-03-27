import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, ExternalLink, CheckCircle2, AlertCircle, X, FileText } from 'lucide-react';

const GOLD = '#D4AF37';

// Common PropStream column name variations
const COLUMN_MAP = {
  street: ['property address', 'property street', 'street address', 'address', 'prop address', 'site address', 'street'],
  city: ['property city', 'city', 'prop city', 'site city'],
  state: ['property state', 'state', 'prop state', 'site state', 'st'],
  zip: ['property zip', 'zip', 'zip code', 'postal code', 'prop zip', 'site zip'],
  owner: ['owner name', 'owner 1 first name', 'owner name 1', 'first name', 'owner', 'seller name'],
};

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { headers: [], rows: [] };
  
  // Handle quoted fields
  const parseRow = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  const rows = lines.slice(1).map(l => parseRow(l).map(v => v.replace(/^"|"$/g, '').trim()));
  return { headers, rows };
}

function findColumn(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase());
  for (const candidate of candidates) {
    const idx = lower.findIndex(h => h.includes(candidate));
    if (idx !== -1) return idx;
  }
  return -1;
}

export default function PropStreamCSVImporter() {
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      if (!headers.length) return;

      // Auto-detect column mapping
      const detected = {};
      for (const [field, candidates] of Object.entries(COLUMN_MAP)) {
        detected[field] = findColumn(headers, candidates);
      }

      setParsed({ headers, rows });
      setMapping(detected);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const validRows = parsed?.rows.filter(row => {
    const street = mapping?.street >= 0 ? row[mapping.street] : '';
    const city = mapping?.city >= 0 ? row[mapping.city] : '';
    const state = mapping?.state >= 0 ? row[mapping.state] : '';
    return street && city && state;
  }) || [];

  const downloadBatchDataCSV = () => {
    if (!validRows.length) return;

    const headers = ['First Name', 'Last Name', 'Property Address', 'Property City', 'Property State', 'Property Zip'];
    const dataRows = validRows.map(row => {
      const ownerFull = mapping?.owner >= 0 ? (row[mapping.owner] || '') : '';
      const parts = ownerFull.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const street = mapping?.street >= 0 ? row[mapping.street] : '';
      const city = mapping?.city >= 0 ? row[mapping.city] : '';
      const state = mapping?.state >= 0 ? row[mapping.state] : '';
      const zip = mapping?.zip >= 0 ? row[mapping.zip] : '';
      return [firstName, lastName, street, city, state, zip]
        .map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...dataRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batchdata-upload-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setParsed(null);
    setMapping(null);
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
        style={{ background: '#000', border: `1px solid rgba(212,175,55,0.3)` }}
      >
        <div className="flex items-center gap-3">
          <Upload className="w-5 h-5" style={{ color: GOLD }} />
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: '#fff' }}>Import PropStream Export</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Upload your PropStream CSV → auto-convert to BatchData format → download & upload to BatchData
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: GOLD }}>
          {open ? 'Close' : 'Open'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-6 mt-2" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>

              {/* Step 1: Instructions */}
              <div className="mb-5 rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>HOW IT WORKS</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { step: '1', text: 'In PropStream → My Properties → select your list → Export CSV' },
                    { step: '2', text: 'Upload that CSV here — we auto-detect and map the address columns' },
                    { step: '3', text: 'Download the BatchData-formatted CSV → upload to app.batchdata.com → get owner contacts' },
                  ].map(s => (
                    <div key={s.step} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}>{s.step}</div>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Drop Zone */}
              {!parsed ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer transition-all hover:opacity-80"
                  style={{ border: '2px dashed rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.04)' }}
                >
                  <FileText className="w-10 h-10 mb-3" style={{ color: GOLD }} />
                  <p className="font-bold mb-1" style={{ color: '#fff' }}>Drop PropStream CSV here</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>or click to browse</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div>
                  {/* File loaded summary */}
                  <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-4"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
                      <span className="text-sm font-semibold" style={{ color: '#fff' }}>{fileName}</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        — {parsed.rows.length} rows, {validRows.length} valid addresses found
                      </span>
                    </div>
                    <button onClick={reset} className="p-1 hover:opacity-70">
                      <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
                    </button>
                  </div>

                  {/* Column mapping preview */}
                  <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>DETECTED COLUMNS</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(COLUMN_MAP).map(([field]) => {
                        const colIdx = mapping[field];
                        const colName = colIdx >= 0 ? parsed.headers[colIdx] : null;
                        return (
                          <div key={field} className="flex items-center gap-2">
                            {colName ? (
                              <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: '#22C55E' }} />
                            ) : (
                              <AlertCircle className="w-3 h-3 shrink-0" style={{ color: '#F59E0B' }} />
                            )}
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              {field}:
                            </span>
                            <span className="text-xs font-semibold" style={{ color: colName ? '#fff' : '#F59E0B' }}>
                              {colName || 'not found'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview table */}
                  {validRows.length > 0 && (
                    <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="px-4 py-2 text-xs font-bold tracking-widest" style={{ background: 'rgba(212,175,55,0.08)', color: GOLD }}>
                        PREVIEW (first 5 rows)
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              {['Street', 'City', 'State', 'Zip', 'Owner'].map(h => (
                                <th key={h} className="text-left px-3 py-2 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {validRows.slice(0, 5).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td className="px-3 py-2" style={{ color: '#fff' }}>{mapping.street >= 0 ? row[mapping.street] : '—'}</td>
                                <td className="px-3 py-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{mapping.city >= 0 ? row[mapping.city] : '—'}</td>
                                <td className="px-3 py-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{mapping.state >= 0 ? row[mapping.state] : '—'}</td>
                                <td className="px-3 py-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{mapping.zip >= 0 ? row[mapping.zip] : '—'}</td>
                                <td className="px-3 py-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{mapping.owner >= 0 ? row[mapping.owner] : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={downloadBatchDataCSV}
                      disabled={!validRows.length}
                      className="flex-1 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-30"
                      style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}
                    >
                      <Download className="w-4 h-4" />
                      Download for BatchData ({validRows.length} addresses)
                    </button>
                    <a
                      href="https://app.batchdata.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 hover:opacity-80"
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open BatchData → Upload CSV
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}