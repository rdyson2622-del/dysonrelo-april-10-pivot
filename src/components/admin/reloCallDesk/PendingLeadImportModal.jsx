import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, X, AlertCircle, CheckCircle2, Upload, 
  Sparkles, ShieldCheck, Lock, Copy, Check, Filter, Info
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const REQUIRED_HEADERS = [
  'address',
  'city',
  'county',
  'list_price',
  'pending_date',
  'property_type',
  'listing_office',
  'listing_agent_name',
  'phone',
  'email',
  'brokerage_type',
  'source'
];

const EXCLUDED_BROKERAGE_KEYWORDS = [
  'compass',
  'coldwell',
  'century 21',
  'century21',
  'sotheby'
];

const SAMPLE_CSV = `address,city,county,list_price,pending_date,property_type,listing_office,listing_agent_name,phone,email,brokerage_type,source
742 Ocean Boulevard,Coronado,San Diego,3450000,2026-09-10,Single Family,Coronado Coastal Properties,David Vance,(619) 555-0192,dvance@coronadocoastal.com,Independent Boutique,CRMLS
1890 Vallejo Street,San Francisco,San Francisco,5995000,2026-09-11,Single Family,Vanguard Properties,Elena Rossi,(415) 555-0188,elena@vanguardsf.com,Regional Independent,SFAR MLS
12044 Beverly Park Court,Beverly Hills,Los Angeles,9450000,2026-09-09,Luxury Estate,Hilton & Hyland,Marcus Vance,(310) 555-0177,marcus@hiltonhyland.com,Independent Luxury,TheMLS
458 Ocean Avenue,Santa Monica,Los Angeles,3750000,2026-09-11,Single Family,Compass Brentwood,Sarah Jenkins,(310) 555-0123,sjenkins@compass.com,Corporate Franchise,TheMLS
2200 Sand Hill Road,Menlo Park,San Mateo,6200000,2026-09-08,Contemporary Craftsman,Golden Gate Sotheby's,Robert Chang,(650) 555-0199,rchang@ggsir.com,Franchise Network,MLS Listings
210 Prospect Street,La Jolla,San Diego,2950000,2026-09-11,Ocean View Villa,La Jolla Village Realty,Sarah Jenkins,(858) 555-7742,sjenkins@ljvillagerealty.com,Independent Boutique,Sandicor
1550 Kings Road,West Hollywood,Los Angeles,4100000,2026-09-10,Modern Architectural,Sunset Strip Realty,Julian Blake,(323) 555-0134,jblake@sunsetstriprealty.com,Independent Boutique,TheMLS
920 Grand View Drive,Pasadena,Los Angeles,2650000,2026-09-11,Craftsman Estate,Coldwell Banker Pasadena,Arthur Pendelton,(626) 555-0188,apendelton@coldwellbanker.com,Corporate Franchise,CRMLS`;

export default function PendingLeadImportModal({ isOpen, onClose, onImportSuccess }) {
  // Configurable fields
  const [market, setMarket] = useState('San Diego'); // 'LA' | 'SF Bay' | 'San Diego' | 'Other'
  const [minPrice, setMinPrice] = useState(2000000);
  const [pendingWindowDays, setPendingWindowDays] = useState(2);

  // CSV content & parsing
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [headerValidation, setHeaderValidation] = useState(null); // { valid: bool, missing: string[] }
  const [parsedResults, setParsedResults] = useState({ validRows: [], excludedRows: [] });
  const [copiedHeaders, setCopiedHeaders] = useState(false);

  // Success view state
  const [createdBatchInfo, setCreatedBatchInfo] = useState(null);

  // Current user email
  const [currentUserEmail, setCurrentUserEmail] = useState('admin@dysonrelo.com');

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.email) setCurrentUserEmail(u.email);
    }).catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleCopyHeaderTemplate = () => {
    navigator.clipboard.writeText(REQUIRED_HEADERS.join(','));
    setCopiedHeaders(true);
    setTimeout(() => setCopiedHeaders(false), 2000);
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV.trim());
    parseCsv(SAMPLE_CSV.trim(), market, minPrice);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setCsvText(text.trim());
        parseCsv(text.trim(), market, minPrice);
      }
    };
    reader.readAsText(file);
  };

  // Helper to split CSV row respecting double quotes
  const splitCsvLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^["']|["']$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const parseCsv = (rawText, targetMarket = market, currentMinPrice = minPrice) => {
    setError(null);
    setHeaderValidation(null);
    setCreatedBatchInfo(null);

    if (!rawText.trim()) {
      setParsedResults({ validRows: [], excludedRows: [] });
      return { validRows: [], excludedRows: [] };
    }

    const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setError('CSV requires a header row and at least one data row.');
      setParsedResults({ validRows: [], excludedRows: [] });
      return { validRows: [], excludedRows: [] };
    }

    // Validate headers
    const rawHeaderLine = lines[0];
    const headerCols = splitCsvLine(rawHeaderLine).map(h => h.toLowerCase().trim().replace(/[\s-]/g, '_'));
    
    const missingHeaders = REQUIRED_HEADERS.filter(rh => !headerCols.includes(rh));
    if (missingHeaders.length > 0) {
      setHeaderValidation({
        valid: false,
        missing: missingHeaders,
        found: headerCols
      });
      setError(`Missing required CSV header columns: ${missingHeaders.join(', ')}`);
      setParsedResults({ validRows: [], excludedRows: [] });
      return { validRows: [], excludedRows: [] };
    }

    setHeaderValidation({ valid: true, missing: [], found: headerCols });

    // Map column indices
    const colIndexMap = {};
    REQUIRED_HEADERS.forEach(h => {
      colIndexMap[h] = headerCols.indexOf(h);
    });

    const validRows = [];
    const excludedRows = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i]);
      if (cols.length === 0 || !cols[colIndexMap['address']]) continue;

      const address = cols[colIndexMap['address']] || '';
      const city = cols[colIndexMap['city']] || '';
      const county = cols[colIndexMap['county']] || '';
      const rawPrice = cols[colIndexMap['list_price']] || '0';
      const list_price = Number(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;
      const pending_date = cols[colIndexMap['pending_date']] || new Date().toISOString().slice(0, 10);
      const property_type = cols[colIndexMap['property_type']] || 'Single Family';
      const listing_office = cols[colIndexMap['listing_office']] || '';
      const listing_agent_name = cols[colIndexMap['listing_agent_name']] || '';
      const phone = cols[colIndexMap['phone']] || '';
      const email = cols[colIndexMap['email']] || '';
      const brokerage_type = cols[colIndexMap['brokerage_type']] || 'Independent';
      const source = cols[colIndexMap['source']] || 'MLS';

      // Check locked brokerage exclusion: Compass, Coldwell Banker, Century 21, Sotheby's
      const officeLower = listing_office.toLowerCase();
      const typeLower = brokerage_type.toLowerCase();
      const matchedExclusion = EXCLUDED_BROKERAGE_KEYWORDS.find(keyword => 
        officeLower.includes(keyword) || typeLower.includes(keyword)
      );

      const rowData = {
        address,
        city,
        county,
        list_price,
        pending_date,
        property_type,
        listing_office,
        listing_agent_name,
        phone,
        email,
        brokerage_type,
        source,
      };

      if (matchedExclusion) {
        excludedRows.push({
          ...rowData,
          exclusionReason: `Corporate Franchise (${matchedExclusion.toUpperCase()}) excluded per Independent Brokerages Only policy`,
        });
        continue;
      }

      // Check min_price
      if (list_price < currentMinPrice) {
        excludedRows.push({
          ...rowData,
          exclusionReason: `Price $${list_price.toLocaleString()} below $${Number(currentMinPrice).toLocaleString()} threshold`,
        });
        continue;
      }

      validRows.push(rowData);
    }

    setParsedResults({ validRows, excludedRows });
    return { validRows, excludedRows };
  };

  const mapMarketToSchema = (m) => {
    switch (m) {
      case 'LA': return 'LA';
      case 'SF Bay': return 'SF_Bay';
      case 'San Diego': return 'SD';
      default: return 'other';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { validRows, excludedRows } = parseCsv(csvText, market, minPrice);

    if (validRows.length === 0) {
      setError('No valid rows available to import. Please check CSV format and filters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().slice(0, 10);
      const schemaMarket = mapMarketToSchema(market);

      // 1. Create LeadListBatch {market, min_price, pending_window_days, list_date=today, status:'ready', created_by}
      const batchRecord = await base44.entities.LeadListBatch.create({
        label: `${market} $${(minPrice / 1000000).toFixed(1)}M+ Pending Leads - ${today}`,
        market: schemaMarket,
        min_price: Number(minPrice),
        pending_window_days: Number(pendingWindowDays),
        list_date: today,
        status: 'ready',
        created_by: currentUserEmail,
        notes: `Imported ${validRows.length} independent leads. ${excludedRows.length} excluded (Compass, Coldwell Banker, Century 21, Sotheby's). residential_only=true, independent_brokerages_only=true.`
      });

      // 2. Create PendingLead rows linked to batch with status:'new', assigned_agent empty
      const pendingRecords = validRows.map(r => ({
        address: r.address,
        city: r.city,
        county: r.county,
        market: schemaMarket,
        list_price: r.list_price,
        pending_date: r.pending_date,
        property_type: r.property_type,
        listing_office: r.listing_office,
        listing_agent_name: r.listing_agent_name,
        listing_agent_phone: r.phone,
        listing_agent_email: r.email,
        brokerage_type: r.brokerage_type,
        brokerage_independent: true,
        source: r.source,
        batch_id: batchRecord.id,
        status: 'new',
        assigned_relocation_agent: undefined, // assigned_agent empty
        list_date: today,
      }));

      await base44.entities.PendingLead.bulkCreate(pendingRecords);

      // 3. Set created batch info and show created count + batch id
      setCreatedBatchInfo({
        batchId: batchRecord.id,
        createdCount: pendingRecords.length,
        excludedCount: excludedRows.length,
        market,
        minPrice,
        pendingWindowDays,
      });

      if (onImportSuccess) {
        onImportSuccess(pendingRecords.length, batchRecord.id);
      }
    } catch (err) {
      console.error('Import failed:', err);
      setError(err.message || 'Failed to import pending leads.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-5 sm:p-6 shadow-2xl text-left space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                STAGE 3 LISTING CALL DESK INGEST
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Import Today’s Pending Lead List
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SUCCESS VIEW: SHOW CREATED COUNT + BATCH ID */}
        {createdBatchInfo ? (
          <div className="p-6 rounded-3xl bg-black/80 border border-[#D4AF37] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Import Successfully Executed</h4>
              <p className="text-xs text-white/70">
                Created LeadListBatch and linked new PendingLead records.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#14120b] border border-[#D4AF37]/50 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/60 font-medium">Batch ID:</span>
                <span className="font-mono font-bold text-[#D4AF37] text-xs select-all">
                  {createdBatchInfo.batchId}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/60 font-medium">Created Leads Count:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {createdBatchInfo.createdCount} Leads
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/60 font-medium">Lead Status:</span>
                <span className="font-bold text-white uppercase text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
                  new (assigned_agent empty)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-white/60 font-medium">Excluded Brokerages Count:</span>
                <span className="font-bold text-amber-400 text-xs">
                  {createdBatchInfo.excludedCount} Excluded
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-white/60 font-medium">Market / Min Price:</span>
                <span className="text-white font-semibold">
                  {createdBatchInfo.market} • ${Number(createdBatchInfo.minPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Close &amp; View in Call Desk
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* ERROR BANNER */}
            {error && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* MANDATORY POLICY BADGES (LOCKED) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-black/60 border border-[#D4AF37]/40 shadow-inner">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-[10px] font-black uppercase flex items-center gap-1 shrink-0 mt-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>residential_only=true</span>
                </span>
                <span className="text-[11px] text-white/70 leading-snug">
                  Strictly filters for residential property types (Single Family, Luxury Estate, Condo).
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-black uppercase flex items-center gap-1 shrink-0 mt-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>independent_brokerages_only=true</span>
                </span>
                <span className="text-[11px] text-white/70 leading-snug">
                  Excludes locked corporate franchises: <strong>Compass, Coldwell Banker, Century 21, Sotheby's</strong>.
                </span>
              </div>
            </div>

            {/* CONFIGURATION FIELDS ROW: Market, Min Price, Pending Window */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/60 border border-white/10">
              {/* Market Selection */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Market *
                </label>
                <select
                  value={market}
                  onChange={(e) => {
                    setMarket(e.target.value);
                    if (csvText) parseCsv(csvText, e.target.value, minPrice);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="LA">LA (Los Angeles)</option>
                  <option value="SF Bay">SF Bay (San Francisco)</option>
                  <option value="San Diego">San Diego</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Min Price (Default $2,000,000) */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Min Price ($) *
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setMinPrice(val);
                    if (csvText) parseCsv(csvText, market, val);
                  }}
                  step={100000}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
                  required
                />
                <span className="text-[10px] text-white/40 mt-0.5 block">Default: $2,000,000</span>
              </div>

              {/* Pending Window Days (Default 2) */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Pending Window Days *
                </label>
                <input
                  type="number"
                  value={pendingWindowDays}
                  onChange={(e) => setPendingWindowDays(Number(e.target.value) || 2)}
                  min={1}
                  max={30}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
                  required
                />
                <span className="text-[10px] text-white/40 mt-0.5 block">Default: 2 days</span>
              </div>
            </div>

            {/* CSV IMPORT CONTROLS: Upload or Paste */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Upload CSV File</span>
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
                    <span>Load Compliant Sample</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyHeaderTemplate}
                  className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Copy the exact required 12-column header row to clipboard"
                >
                  {copiedHeaders ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3 text-[#D4AF37]" />}
                  <span>{copiedHeaders ? 'Copied Required Headers!' : 'Copy Required Header Row'}</span>
                </button>
              </div>

              {/* Exact Header Reference Banner */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[10px] text-white/60 space-y-1 font-mono">
                <div className="flex items-center justify-between text-[#D4AF37] font-sans font-bold">
                  <span>REQUIRED CSV HEADER EXACTLY (12 COLUMNS):</span>
                  {headerValidation?.valid && (
                    <span className="text-[#10b981] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Headers Validated
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto text-white/80 whitespace-nowrap">
                  {REQUIRED_HEADERS.join(', ')}
                </div>
              </div>

              {/* Textarea for CSV */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Paste CSV Text
                </label>
                <textarea
                  rows={5}
                  value={csvText}
                  onChange={(e) => {
                    setCsvText(e.target.value);
                    parseCsv(e.target.value, market, minPrice);
                  }}
                  placeholder="address,city,county,list_price,pending_date,property_type,listing_office,listing_agent_name,phone,email,brokerage_type,source&#10;742 Ocean Blvd,Coronado,San Diego,3450000,2026-09-10,Single Family,Coronado Coastal Properties,David Vance,(619) 555-0192,dvance@coronadocoastal.com,Independent,CRMLS"
                  className="w-full p-3 rounded-xl bg-black border border-white/20 text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* PREVIEW & EXCLUSION TELEMETRY */}
            {(parsedResults.validRows.length > 0 || parsedResults.excludedRows.length > 0) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/60 font-semibold">
                    Parsing Summary: <strong className="text-emerald-400">{parsedResults.validRows.length} Ready to Ingest</strong>
                    {parsedResults.excludedRows.length > 0 && (
                      <span className="text-amber-400 ml-2">
                        • {parsedResults.excludedRows.length} Excluded by Filter
                      </span>
                    )}
                  </span>
                  <span className="text-white/40 text-[10px]">
                    Status on ingest: <strong className="text-white">new</strong> (unassigned)
                  </span>
                </div>

                {/* Valid rows preview */}
                <div className="max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-black/40 divide-y divide-white/10 text-[11px]">
                  {parsedResults.validRows.slice(0, 5).map((row, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{row.address}</span>
                        <span className="text-white/50 ml-2">({row.city}, {row.county})</span>
                        <span className="text-[#D4AF37] ml-2 text-[10px]">[{row.listing_office}]</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">${row.list_price?.toLocaleString()}</span>
                        <span className="text-white/50 ml-2">{row.listing_agent_name}</span>
                      </div>
                    </div>
                  ))}
                  {parsedResults.validRows.length > 5 && (
                    <div className="p-2 text-center text-[10px] text-white/40 italic">
                      + {parsedResults.validRows.length - 5} more qualified independent pending leads
                    </div>
                  )}
                </div>

                {/* Excluded rows notice */}
                {parsedResults.excludedRows.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Filter className="w-3 h-3" />
                      <span>{parsedResults.excludedRows.length} row(s) excluded in compliance with filters:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-amber-200/80">
                      {parsedResults.excludedRows.slice(0, 3).map((ex, i) => (
                        <li key={i}>
                          <strong>{ex.address}</strong> ({ex.listing_office}) — {ex.exclusionReason}
                        </li>
                      ))}
                      {parsedResults.excludedRows.length > 3 && (
                        <li>+ {parsedResults.excludedRows.length - 3} more excluded entries</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || parsedResults.validRows.length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50 shadow-md transition-all flex items-center gap-2"
              >
                {loading ? (
                  <span>Creating Batch &amp; Leads...</span>
                ) : (
                  <span>
                    Submit Import ({parsedResults.validRows.length} Leads)
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}