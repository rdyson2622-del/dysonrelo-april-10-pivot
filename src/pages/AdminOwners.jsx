import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload, Loader2, Fingerprint, Send, CheckSquare, Square } from 'lucide-react';
import OwnersList from '@/components/admin/OwnersList';
import OwnerForm from '@/components/admin/OwnerForm';
import OwnerImportCSV from '@/components/admin/OwnerImportCSV';
import { toast } from 'sonner';

// Always fetch from production via backend function (bypasses test/dev environment)
const fetchOwners = async () => {
  const res = await base44.functions.invoke('getListingOwners', {});
  return res.data?.owners || [];
};

export default function AdminOwners() {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [skipTracing, setSkipTracing] = useState(false);
  const [sendingToOutreach, setSendingToOutreach] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: owners = [] } = useQuery({
    queryKey: ['listingOwners'],
    queryFn: fetchOwners,
  });

  const filtered = owners.filter(owner =>
    owner.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
    owner.property_address?.toLowerCase().includes(search.toLowerCase()) ||
    owner.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (formData) => {
    await base44.entities.ListingOwner.create(formData);
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setShowForm(false);
  };

  const handleEdit = async (formData) => {
    await base44.entities.ListingOwner.update(editingOwner.id, formData);
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setEditingOwner(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.ListingOwner.delete(id);
    setSelectedIds(prev => prev.filter(sid => sid !== id));
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setDeleteConfirm(null);
  };

  const handleStatusChange = async (id, status) => {
    await base44.entities.ListingOwner.update(id, {
      contact_status: status,
      last_contacted: new Date().toISOString().split('T')[0],
    });
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(o => o.id));
    }
  };

  const handleSkipTrace = async () => {
    if (!selectedIds.length) return;
    setSkipTracing(true);
    try {
      const res = await base44.functions.invoke('skipTraceOwners', { owner_ids: selectedIds });
      const { processed, errors } = res.data;
      toast.success(`Skip trace complete: ${processed} updated, ${errors} errors`);
      queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
      setSelectedIds([]);
    } catch (e) {
      toast.error('Skip trace failed: ' + e.message);
    }
    setSkipTracing(false);
  };

  const handleSendToOutreach = async () => {
    if (!selectedIds.length) return;
    setSendingToOutreach(true);
    try {
      const selectedOwners = owners.filter(o => selectedIds.includes(o.id));
      let created = 0;
      for (const owner of selectedOwners) {
        // Check if campaign already exists
        const existing = await base44.entities.OwnerOutreachCampaign.filter({ listing_owner_id: owner.id });
        if (!existing.length) {
          await base44.entities.OwnerOutreachCampaign.create({
            listing_owner_id: owner.id,
            owner_name: owner.owner_name,
            owner_phone: owner.phone || '',
            property_address: owner.property_address,
            listing_price: owner.listing_price,
            workflow_stage: 'outreach',
            sms_sent_date: null,
          });
          created++;
        }
      }
      toast.success(`${created} owners added to outreach campaigns`);
      setSelectedIds([]);
      navigate('/AdminOutreachCampaigns');
    } catch (e) {
      toast.error('Failed to send to outreach: ' + e.message);
    }
    setSendingToOutreach(false);
  };

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  return (
    <div id="204" className="p-8 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Listing Owners</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => { setEditingOwner(null); setShowForm(true); }} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
        </div>
      </div>

      {/* Search + Select All */}
      <div className="mb-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, address, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleSelectAll} className="gap-2 shrink-0">
          {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          {allSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      {/* Selection Action Bar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex items-center gap-3 p-4 rounded-xl border-2 border-amber-400 bg-amber-50">
          <span className="font-semibold text-amber-800 text-sm">
            {selectedIds.length} owner{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleSkipTrace}
              disabled={skipTracing}
              className="gap-2 bg-indigo-700 hover:bg-indigo-800 text-white"
              size="sm"
            >
              {skipTracing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
              {skipTracing ? 'Skip Tracing...' : 'Step 2: Skip Trace (Get Owner Info)'}
            </Button>
            <Button
              onClick={handleSendToOutreach}
              disabled={sendingToOutreach}
              className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
              size="sm"
            >
              {sendingToOutreach ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sendingToOutreach ? 'Sending...' : 'Step 3: Send to Outreach'}
            </Button>
          </div>
        </div>
      )}

      <OwnersList
        owners={filtered}
        onEdit={(owner) => { setEditingOwner(owner); setShowForm(true); }}
        onDelete={(id) => setDeleteConfirm(id)}
        onStatusChange={handleStatusChange}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
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