import React, { useState } from 'react';
import { FileSpreadsheet, X, AlertCircle, CheckCircle2, Upload, FileText, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const SAMPLE_CSV = `Address,City,Market,List Price,Pending Date,Office,Agent Name,Agent Phone,Agent Email
742 Ocean Boulevard,Coronado,SD,4850000,2026-09-10,Pacific Sotheby's International,David Sterling,(619) 555-0142,david@pacificsir.com
1890 Vallejo Street,San Francisco,SF_Bay,5995000,2026-09-11,Vanguard Properties,Elena Rossi,(415) 555-0188,elena@vanguardsf.com
12044 Beverly Park Court,Beverly Hills,LA,9450000,2026-09-09,Hilton & Hyland,Marcus Vance,(310) 555-0177,marcus@hiltonhyland.com
458 Ocean Avenue,Santa Monica,LA,3750000,2026-09-11,Compass Brentwood,Sarah Jenkins,(310) 555-0123,sjenkins@compass.com
2200 Sand Hill Road,Menlo Park,SF_Bay,6200000,2026-09-08,Golden Gate Sotheby's,Robert Chang,(650) 555-0199,rchang@ggsir.com
1440 Prospect Street,La Jolla,SD,3495000,2026-09-10,Berkshire Hathaway La Jolla,Victoria Stone,(858) 555-0165,vstone@bhhscal.com`;

export default function PendingLeadImportModal({ isOpen, onClose, onImportSuccess, agents = [] }) {
  const [csvText, setCsvText] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(() => {
    const lisa = agents.find(a => a.email === 'lisa@lisahurt.com');
    return lisa?.id || (agents[0]?.id || '');
  });
  const [createBatchRecord, setCreateBatchRecord] = useState(true);
  const [batchLabel, setBatchLabel] = useState(`$2M+ California Pending Import - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);

  if (!isOpen) return null;

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV.trim());
    parseCsv(SAMPLE_CSV.trim());
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setCsvText(text.trim());
        parseCsv(text.trim());
      }
    };
    reader.readAsText(file);
  };

  const parseCsv = (rawText) => {
    setError(null);
    if (!rawText.trim()) {
      setPreviewRows([]);
      return [];
    }

    const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setError('CSV requires a header line and at least one data row.');
      setPreviewRows([]);
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[\s_-]/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      // Split by comma handling quotes simply
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) continue;

      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cols[idx] !== undefined ? cols[idx] : '';
      });

      // Normalize into PendingLead schema fields
      const address = rowObj.address || cols[0];
      const city = rowObj.city || cols[1] || '';
      let market = rowObj.market || cols[2] || 'other';
      if (!['LA', 'SF_Bay', 'SD', 'other'].includes(market)) {
        if (market.toLowerCase().includes('la') || market.toLowerCase().includes('los angeles')) market = 'LA';
        else if (market.toLowerCase().includes('sf') || market.toLowerCase().includes('bay') || market.toLowerCase().includes('francisco')) market = 'SF_Bay';
        else if (market.toLowerCase().includes('sd') || market.toLowerCase().includes('san diego')) market = 'SD';
        else market = 'other';
      }

      const rawPrice = rowObj.listprice || rowObj.price || cols[3] || '2000000';
      const list_price = Number(String(rawPrice).replace(/[^0-9.]/g, '')) || 2000000;
      const pending_date = rowObj.pendingdate || cols[4] || new Date().toISOString().slice(0, 10);
      const listing_office = rowObj.office || rowObj.brokerage || cols[5] || '';
      const listing_agent_name = rowObj.agentname || rowObj.agent || cols[6] || '';
      const listing_agent_phone = rowObj.agentphone || rowObj.phone || cols[7] || '';
      const listing_agent_email = rowObj.agentemail || rowObj.email || cols[8] || '';

      rows.push({
        address,
        city,
        market,
        list_price,
        pending_date,
        listing_office,
        listing_agent_name,
        listing_agent_phone,
        listing_agent_email,
        source: 'CSV/Numbers Import',
        status: 'new',
        assigned_relocation_agent: selectedAgentId || undefined,
      });
    }

    setPreviewRows(rows);
    return rows;
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    const rows = parseCsv(csvText);
    if (rows.length === 0) {
      setError('No valid rows found to import. Please check CSV format.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Bulk create PendingLead records
      const recordsToInsert = rows.map(r => ({
        ...r,
        assigned_relocation_agent: selectedAgentId || undefined,
      }));

      await base44.entities.PendingLead.bulkCreate(recordsToInsert);

      // 2. Optionally create LeadListBatch record
      if (createBatchRecord) {
        await base44.entities.LeadListBatch.create({
          label: batchLabel,
          market: 'California Target Markets',
          min_price: 2000000,
          pending_window_days: 7,
          list_date: new Date().toISOString().slice(0, 10),
          assigned_relocation_agent: selectedAgentId || undefined,
          created_by: 'Admin / Relocation Call Desk',
          notes: `Imported ${recordsToInsert.length} pending listing records. Assigned to ${agents.find(a => a.id === selectedAgentId)?.name || 'Lisa Hurt'}.`
        });
      }

      onImportSuccess(recordsToInsert.length);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to import pending leads.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-6 shadow-2xl text-left space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                STAGE 3 CALL DESK INGEST
              </span>
              <h3 className="text-lg font-bold text-white">
                Import Today’s $2M+ Pending Leads (CSV / Numbers)
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          {/* Action Row: Load Sample, Upload File */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upload CSV / Spreadsheet</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleLoadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample $2M+ CA Leads</span>
              </button>
            </div>

            <span className="text-[11px] text-white/50">
              {previewRows.length} valid row{previewRows.length === 1 ? '' : 's'} detected
            </span>
          </div>

          {/* Paste CSV Box */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              CSV Data (Comma-Separated Text)
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                parseCsv(e.target.value);
              }}
              placeholder="Address,City,Market,List Price,Pending Date,Office,Agent Name,Agent Phone,Agent Email&#10;742 Ocean Blvd,Coronado,SD,4850000,2026-09-10,Pacific Sotheby's,David Sterling,(619) 555-0142,david@example.com"
              className="w-full p-3 rounded-xl bg-black border border-white/20 text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Configuration: Relocation Agent Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-black/60 border border-white/10">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Assign Directly to Relocation Agent
              </label>
              <select
                value={selectedAgentId}
                onChange={e => setSelectedAgentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email}) {a.email === 'lisa@lisahurt.com' ? '• Primary Assigned' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Lead List Batch Label
              </label>
              <input
                type="text"
                value={batchLabel}
                onChange={e => setBatchLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Preview of rows */}
          {previewRows.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50 block">
                Preview of Rows to Ingest ({previewRows.length})
              </span>
              <div className="max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-black/40 divide-y divide-white/10">
                {previewRows.slice(0, 5).map((row, idx) => (
                  <div key={idx} className="p-2 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-white">{row.address}</span>
                      <span className="text-white/60 ml-2">({row.city}, {row.market})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#D4AF37] font-semibold">${row.list_price?.toLocaleString()}</span>
                      <span className="text-white/40 ml-2">{row.listing_agent_name || 'Agent'}</span>
                    </div>
                  </div>
                ))}
                {previewRows.length > 5 && (
                  <div className="p-2 text-center text-[10px] text-white/40 italic">
                    + {previewRows.length - 5} more rows ready for batch insertion
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || previewRows.length === 0}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {loading ? 'Ingesting...' : `Import ${previewRows.length} Pending Leads`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}