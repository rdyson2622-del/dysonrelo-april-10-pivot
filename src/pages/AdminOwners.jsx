import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload, Send } from 'lucide-react';
import OwnersList from '@/components/admin/OwnersList';
import OwnerForm from '@/components/admin/OwnerForm';
import OwnerImportCSV from '@/components/admin/OwnerImportCSV';

export default function AdminOwners() {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sendingAll, setSendingAll] = useState(false);
  const [sendAllResult, setSendAllResult] = useState(null);
  const queryClient = useQueryClient();

  const getDataEnv = () => localStorage.getItem('base44_data_env') || 'prod';

  const { data: owners = [] } = useQuery({
    queryKey: ['listingOwners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 200),
  });

  const BATCH_SIZE = 25;
  const [batchOffset, setBatchOffset] = useState(0);

  // Reset batch offset when owner count changes (after new import)
  useEffect(() => { setBatchOffset(0); setSendAllResult(null); }, [owners.length]);

  const getUnsentOwners = () => owners.filter(o => o.phone && o.contact_status === 'not_contacted');

  const sendBatchSMS = async () => {
    const unsent = getUnsentOwners();
    if (!unsent.length) return;
    const batch = unsent.slice(batchOffset, batchOffset + BATCH_SIZE);
    if (!batch.length) return;

    if (!confirm(`Send outreach SMS to the next ${batch.length} owners (batch ${Math.floor(batchOffset / BATCH_SIZE) + 1})?\n\nMessages will be spaced 3 minutes apart. Do NOT close this tab until complete.`)) return;

    setSendingAll(true);
    setSendAllResult(null);

    try {
      const res = await base44.functions.invoke('sendBatchOutreachSMS', {
        owners: batch.map(o => ({
          listing_owner_id: o.id,
          phone: o.phone,
          owner_name: o.owner_name,
          property_address: o.property_address,
        })),
      });
      setSendAllResult(res.data);
      setBatchOffset(prev => prev + BATCH_SIZE);
    } catch (e) {
      setSendAllResult({ error: e.message });
    } finally {
      setSendingAll(false);
      queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    }
  };

  const filtered = owners.filter(owner =>
    owner.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
    owner.property_address?.toLowerCase().includes(search.toLowerCase()) ||
    owner.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (formData) => {
    await base44.entities.ListingOwner.create(formData, { data_env: 'dev' });
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setShowForm(false);
  };

  const handleEdit = async (formData) => {
    await base44.entities.ListingOwner.update(editingOwner.id, formData, { data_env: 'dev' });
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setEditingOwner(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.ListingOwner.delete(id, { data_env: 'dev' });
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setDeleteConfirm(null);
  };

  const handleStatusChange = async (id, status) => {
    const owner = owners.find(o => o.id === id);
    await base44.entities.ListingOwner.update(id, {
      contact_status: status,
      last_contacted: new Date().toISOString().split('T')[0],
    }, { data_env: 'dev' });
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
  };

  return (
    <div className="p-8 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Listing Owners</h1>
          <p className="text-sm text-slate-500 mt-1">
            {owners.filter(o => o.contact_status === 'not_contacted' && o.phone).length} owners ready to contact
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => { setEditingOwner(null); setShowForm(true); }} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
          {(() => {
            const unsent = getUnsentOwners();
            const batchNum = Math.floor(batchOffset / BATCH_SIZE) + 1;
            const remaining = unsent.slice(batchOffset);
            const nextBatchCount = Math.min(BATCH_SIZE, remaining.length);
            return (
              <Button
                onClick={sendBatchSMS}
                disabled={sendingAll || nextBatchCount === 0}
                className="gap-2 bg-slate-900 hover:bg-slate-700 text-white"
              >
                {sendingAll ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending Batch {batchNum}...</>
                ) : nextBatchCount === 0 ? (
                  <><Send className="w-4 h-4" /> All Batches Sent</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Batch {batchNum} ({nextBatchCount} owners)</>
                )}
              </Button>
            );
          })()}
        </div>
      </div>

      {sendAllResult !== null && (
        <div className={`mb-4 border rounded-lg px-4 py-3 text-sm font-semibold ${sendAllResult.error ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
          {sendAllResult.error
            ? `✗ Error: ${sendAllResult.error}`
            : `✓ Batch queued: ${sendAllResult.sent} sent, ${sendAllResult.failed || 0} failed, ${sendAllResult.skipped || 0} skipped. Messages spaced 3 min apart.`
          }
          {!sendAllResult.error && getUnsentOwners().slice(batchOffset).length > 0 && (
            <span className="ml-2 text-slate-600 font-normal">
              ({getUnsentOwners().slice(batchOffset).length} owners remaining — click button to send next batch)
            </span>
          )}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, address, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <OwnersList
        owners={filtered}
        onEdit={(owner) => { setEditingOwner(owner); setShowForm(true); }}
        onDelete={(id) => setDeleteConfirm(id)}
        onStatusChange={handleStatusChange}
        onSmsSent={() => queryClient.invalidateQueries({ queryKey: ['listingOwners'] })}
      />

      <OwnerForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingOwner(null); }}
        owner={editingOwner}
        onSave={editingOwner ? handleEdit : handleAdd}
      />

      <OwnerImportCSV
        open={showImport}
        onClose={() => setShowImport(false)}
        onImportComplete={() => {
          setShowImport(false);
          queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
        }}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Delete Owner?</h2>
            <p className="text-slate-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}