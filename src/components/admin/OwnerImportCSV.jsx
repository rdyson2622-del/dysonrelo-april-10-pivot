import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OwnerImportCSV({ open, onClose, onImportComplete }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Upload file to get URL
      const uploadRes = await base44.integrations.Core.UploadFile({ file });
      const fileUrl = uploadRes.file_url;

      // Extract data from CSV
      const extractRes = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: {
          type: 'object',
          properties: {
            owner_name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            property_address: { type: 'string' },
            property_city: { type: 'string' },
            property_state: { type: 'string' },
            listing_price: { type: 'number' },
            moving_to: { type: 'string' },
            notes: { type: 'string' },
          },
          required: ['owner_name', 'property_address'],
        },
      });

      if (extractRes.status !== 'success' || !extractRes.output) {
        throw new Error(extractRes.details || 'Failed to extract CSV data');
      }

      const records = Array.isArray(extractRes.output) ? extractRes.output : [extractRes.output];
      
      // Create records
      const created = await base44.entities.ListingOwner.bulkCreate(
        records.map(r => ({
          owner_name: r.owner_name || '',
          email: r.email || '',
          phone: r.phone || '',
          property_address: r.property_address || '',
          property_city: r.property_city || '',
          property_state: r.property_state || '',
          listing_price: r.listing_price ? parseFloat(r.listing_price) : undefined,
          moving_to: r.moving_to || '',
          notes: r.notes || '',
        }))
      );

      setResult({ count: created.length, records: created });
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
              <p className="text-sm text-slate-600">
                Upload a CSV file with columns: owner_name, email, phone, property_address, property_city, property_state, listing_price, moving_to, notes
              </p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 cursor-pointer hover:border-slate-400 transition">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-700">Select CSV file</span>
                <input
                  type="file"
                  accept=".csv"
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