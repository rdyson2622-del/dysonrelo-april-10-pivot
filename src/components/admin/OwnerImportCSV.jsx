import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

// Column name aliases — covers PropStream, Board of Realtors MLS, and generic formats
const COLUMN_MAP = {
  owner_name: [
    'owner_name', 'owner name', 'seller name', 'seller', 'list owner', 'owner',
    'contact name', 'name', 'full name', 'taxpayer name', 'tax owner',
  ],
  phone: [
    'phone', 'owner phone', 'seller phone', 'mobile', 'cell', 'phone number',
    'contact phone', 'primary phone', 'phone 1', 'mobilephone', 'cellphone',
  ],
  email: [
    'email', 'owner email', 'seller email', 'email address', 'contact email',
    'e-mail', 'primary email',
  ],
  property_address: [
    'property_address', 'property address', 'address', 'street address',
    'list address', 'listing address', 'full address', 'site address', 'prop address',
  ],
  property_city: [
    'property_city', 'property city', 'city', 'list city', 'listing city', 'site city',
  ],
  property_state: [
    'property_state', 'property state', 'state', 'list state', 'listing state', 'site state', 'st',
  ],
  listing_price: [
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
  // Build a lookup from normalized key → original value
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

      // Extract data — use a broad schema so AI returns all fields as strings first
      const extractRes = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: {
          type: 'object',
          description: 'Extract ALL rows from the CSV. Preserve original column names as keys.',
          properties: {
            owner_name: { type: 'string', description: 'Owner or seller name — may be labeled: owner name, seller name, taxpayer name, contact name' },
            phone: { type: 'string', description: 'Phone number — may be labeled: phone, mobile, cell, owner phone, seller phone' },
            email: { type: 'string', description: 'Email address' },
            property_address: { type: 'string', description: 'Street address — may be labeled: address, list address, site address, street address' },
            property_city: { type: 'string', description: 'City — may be labeled: city, list city, site city' },
            property_state: { type: 'string', description: 'State — may be labeled: state, st, list state' },
            listing_price: { type: 'number', description: 'List price — may be labeled: price, list price, listing price, asking price' },
            moving_to: { type: 'string', description: 'Destination/relocation city if present' },
            notes: { type: 'string', description: 'Any remarks or notes' },
          },
          required: ['owner_name', 'property_address'],
        },
      });

      if (extractRes.status !== 'success' || !extractRes.output) {
        throw new Error(extractRes.details || 'Failed to extract CSV data');
      }

      let records = Array.isArray(extractRes.output) ? extractRes.output : [extractRes.output];

      // Apply column mapping as a safety net on top of AI extraction
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
          <Button variant="outline" onClick={onClose}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && !error && (
            <Button disabled={loading}>
              {loading ? 'Processing...' : 'Select File'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}