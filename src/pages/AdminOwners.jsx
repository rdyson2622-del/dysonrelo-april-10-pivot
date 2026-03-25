import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload } from 'lucide-react';
import OwnersList from '@/components/admin/OwnersList';
import OwnerForm from '@/components/admin/OwnerForm';
import OwnerImportCSV from '@/components/admin/OwnerImportCSV';

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
  const queryClient = useQueryClient();

  const { data: owners = [] } = useQuery({
    queryKey: ['listingOwners'],
    queryFn: () => base44.entities.ListingOwner.list(),
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
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
    setDeleteConfirm(null);
  };

  const handleStatusChange = async (id, status) => {
    const owner = owners.find(o => o.id === id);
    await base44.entities.ListingOwner.update(id, {
      contact_status: status,
      last_contacted: new Date().toISOString().split('T')[0],
    });
    queryClient.invalidateQueries({ queryKey: ['listingOwners'] });
  };

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