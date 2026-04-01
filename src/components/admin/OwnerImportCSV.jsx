import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

// Column name aliases — covers PropStream, Board of Realtors MLS, and generic formats
const COLUMN_MAP = {
  owner_name: [
    // Skip trace format (Owner 1 First + Last combined in mapRow below)
    'owner_name', 'owner name', 'seller name', 'seller', 'list owner', 'owner',
    'contact name', 'name', 'full name', 'taxpayer name', 'tax owner',
  ],
  phone: [
    // Skip trace exports: Phone 1 is primary
    'phone 1', 'phone1', 'phone_1',
    'phone', 'owner phone', 'seller phone', 'mobile', 'cell', 'phone number',
    'contact phone', 'primary phone', 'mobilephone', 'cellphone',
  ],
  email: [
    'email 1', 'email1', 'email_1',
    'email', 'owner email', 'seller email', 'email address', 'contact email', 'e-mail',
  ],
  property_address: [
    // Skip trace format uses "Address"
    'address',
    'property_address', 'property address', 'street address',
    'list address', 'listing address', 'full address', 'site address', 'prop address',
  ],
  property_city: [
    'city',
    'property_city', 'property city', 'list city', 'listing city', 'site city',
  ],
  property_state: [
    'state',
    'property_state', 'property state', 'list state', 'listing state', 'site state', 'st',
  ],
  zip: [
    'zip', 'zip code', 'postal code',
  ],
  listing_price: [
    'mls amount', 'est. value', 'last sale amount',
    'listing_price', 'listing price', 'list price', 'price', 'asking price',
    'sale price', 'sold price', 'current price', 'amount',
  ],
  moving_to: [
    'moving_to', 'moving to', 'destination', 'relocating to', 'new location',
  ],
  notes: [
    'notes', 'comments', 'remarks', 'agent remarks', 'public remarks', 'note',
  ],
};

function normalizeKey(str) {
  return str?.toString().toLowerCase().trim().replace(/\s+/g, ' ');
}

// Map a raw CSV row (with whatever column names) to our standard schema
function mapRow(rawRow) {
  const normalized = {};
  for (const [origKey, val] of Object.entries(rawRow)) {
    normalized[normalizeKey(origKey)] = val;
  }

  const mapped = {};
  for (const [field, aliases] of Object.entries(COLUMN_MAP)) {
    for (const alias of aliases) {
      if (normalized[alias] !== undefined && normalized[alias] !== '') {
        mapped[field] = normalized[alias];
        break;
      }
    }
  }

  // Handle split first/last name fields from skip trace exports
  if (!mapped.owner_name) {
    const first = normalized['owner 1 first name'] || normalized['owner1 first name'] || normalized['first name'] || '';
    const last  = normalized['owner 1 last name']  || normalized['owner1 last name']  || normalized['last name']  || '';
    const combined = [first, last].filter(Boolean).join(' ').trim();
    if (combined) mapped.owner_name = combined;
  }

  // Append unit # to address if present
  if (mapped.property_address && normalized['unit #'] && normalized['unit #'].trim()) {
    mapped.property_address = mapped.property_address + ' #' + normalized['unit #'].trim();
  }

  return mapped;
}

export default function OwnerImportCSV({ open, onClose, onImportComplete }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [detectedFormat, setDetectedFormat] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setDetectedFormat(null);

    try {
      // Upload file to get URL
      const uploadRes = await base44.integrations.Core.UploadFile({ file });
      const fileUrl = uploadRes.file_url;

      // Extract data — use a permissive array schema to get all rows with all columns as-is
      const extractRes = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: {
          type: 'object',
          description: 'Extract all rows from the CSV. Return an array of objects with all available columns preserved.',
          properties: {
            rows: {
              type: 'array',
              items: { type: 'object' },
              description: 'Array of all CSV rows — preserve original column names as keys'
            }
          }
        },
      });

      if (extractRes.status !== 'success' || !extractRes.output) {
        throw new Error(extractRes.details || 'Failed to extract CSV data');
      }

      // Handle both array response and rows property
      let records = extractRes.output.rows || (Array.isArray(extractRes.output) ? extractRes.output : [extractRes.output]);

      // Apply column mapping to normalize headers
      records = records.map(mapRow);

      // Filter out rows missing required fields
      const valid = records.filter(r => r.owner_name && r.property_address);

      if (!valid.length) {
        throw new Error('No valid rows found. Make sure the file has owner name and property address columns.');
      }

      // Detect source format for display
      const sampleKeys = Object.keys(records[0] || {}).map(normalizeKey);
      const isMLSFormat = sampleKeys.some(k => ['list price', 'list address', 'list city', 'seller name'].includes(k));
      const isPropStream = sampleKeys.some(k => ['taxpayer name', 'tax owner', 'prop address'].includes(k));
      setDetectedFormat(isPropStream ? 'PropStream' : isMLSFormat ? 'Board of Realtors MLS' : 'Standard CSV');

      // Create records in prod (matches batch send behavior)
      const created = await base44.entities.ListingOwner.bulkCreate(
        valid.map(r => ({
          owner_name: r.owner_name || '',
          email: r.email || '',
          phone: r.phone || '',
          property_address: r.property_address || '',
          property_city: r.property_city || '',
          property_state: r.property_state || '',
          listing_price: r.listing_price ? parseFloat(String(r.listing_price).replace(/[^0-9.]/g, '')) : undefined,
          moving_to: r.moving_to || '',
          notes: r.notes || '',
          contact_status: 'not_contacted',
        }))
      );

      setResult({ count: created.length });
      onImportComplete?.();
    } catch (err) {
      setError(err.message || 'Import failed');
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
          {!result && !error && (
            <>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Accepts both formats automatically:</p>
                <div className="flex gap-4 mt-1">
                  <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-800 flex-1">
                    <p className="font-bold mb-1">✓ PropStream Export</p>
                    <p className="text-blue-600">Taxpayer Name, Prop Address, Phone, List Price…</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded px-3 py-2 text-xs text-emerald-800 flex-1">
                    <p className="font-bold mb-1">✓ Board of Realtors MLS</p>
                    <p className="text-emerald-600">Seller Name, List Address, Mobile, List Price…</p>
                  </div>
                </div>
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
                    <span className="text-sm font-medium text-slate-700">Select CSV file</span>
                    <span className="text-xs text-slate-400 mt-1">PropStream or MLS export</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </>
          )}

          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Import failed</p>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-800">{result.count} owners imported</p>
                {detectedFormat && (
                  <p className="text-xs text-green-700 mt-1">Format detected: <strong>{detectedFormat}</strong></p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { setError(null); setResult(null); setDetectedFormat(null); onClose(); }}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {error && (
            <Button onClick={() => { setError(null); setResult(null); }}>
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}