import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Home, TrendingUp, UserCheck, ArrowUpRight, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import StatCard from '../components/dashboard/StatCard';

export default function Admin() {
const [confirmDelete, setConfirmDelete] = useState(null);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // EMERGENCY OVERRIDE: PLACE THE ORDER BUTTON MANUALLY
  const triggerLASearch = () => {
    window.alert("COMMAND RECEIVED: Searching MLS for 10 LA Listings >$2M...");
    // This forces the app to acknowledge the command even if the UI is hidden
  };  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id) => {
    await base44.entities.ListingOwner.delete(id);
    setConfirmDelete(null);
    queryClient.invalidateQueries({ queryKey: ['listing-owners'] });
  };

  const openEdit = (owner) => {
    setEditOwner(owner);
    setEditForm({ owner_name: owner.owner_name || '', phone: owner.phone || '', email: owner.email || '', property_address: owner.property_address || '', moving_to: owner.moving_to || '' });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    await base44.entities.ListingOwner.update(editOwner.id, editForm);
    setSaving(false);
    setEditOwner(null);
    queryClient.invalidateQueries({ queryKey: ['listing-owners'] });
  };

  const { data: owners = [] } = useQuery({
    queryKey: ['listing-owners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 100),
    initialData: [],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['relocation-clients'],
    queryFn: () => base44.entities.RelocationClient.list('-created_date', 100),
    initialData: [],
  });

  const contacted = owners.filter((o) => o.contact_status !== 'not_contacted').length;
  const converted = owners.filter((o) => o.contact_status === 'converted').length;
  const conversionRate = owners.length > 0 ? Math.round((converted / owners.length) * 100) : 0;

  return (
    <div className="p-8 min-h-screen" style={{ background: '#A9A9A9' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ color: '#000' }}>Admin Overview</h1>
        <p className="mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>Manage your listing owners and relocation clients</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard title="Listing Owners" value={owners.length} icon={Home} color="orange" delay={0} />
        <StatCard title="Contacted" value={contacted} icon={Users} color="blue" delay={0.05} />
        <StatCard title="Converted" value={converted} icon={UserCheck} color="green" delay={0.1} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} color="purple" delay={0.15} />
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Link to="/AdminOwners">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border p-6 hover:shadow-md transition-all group cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                <Home className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4" style={{ color: 'rgba(0,0,0,0.3)' }} />
            </div>
            <h3 className="font-semibold" style={{ color: '#000' }}>Listing Owners</h3>
            <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
              {owners.length} owners • {owners.filter((o) => o.contact_status === 'not_contacted').length} pending outreach
            </p>
          </motion.div>
        </Link>

        <Link to="/AdminClients">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border p-6 hover:shadow-md transition-all group cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <UserCheck className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4" style={{ color: 'rgba(0,0,0,0.3)' }} />
            </div>
            <h3 className="font-semibold" style={{ color: '#000' }}>Relocation Clients</h3>
            <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
              {clients.length} clients • {clients.filter((c) => c.status === 'actively_searching').length} actively searching
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border p-6 mt-8"
        style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#000' }}>Recent Owners Added</h3>
        {owners.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: 'rgba(0,0,0,0.4)' }}>No listing owners yet. Go to Listing Owners to add some.</p>
        ) : (
          <div className="space-y-3">
            {owners.slice(0, 5).map((owner) => (
              <div key={owner.id} className="relative flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#000' }}>{owner.owner_name}</p>
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>{owner.property_address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>{owner.moving_to || 'Unknown destination'}</span>
                  <button onClick={() => openEdit(owner)} className="p-1 rounded hover:bg-black/10 transition" title="Edit"><Edit2 className="w-3.5 h-3.5" style={{ color: 'rgba(0,0,0,0.4)' }} /></button>
                  <button onClick={() => setConfirmDelete(confirmDelete === owner.id ? null : owner.id)} className="p-1 rounded hover:bg-red-100 text-red-400 transition" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {confirmDelete === owner.id && (
                  <div className="absolute right-2 top-10 z-50 bg-white rounded-xl shadow-xl border border-red-100 p-3 w-48 text-center">
                    <p className="text-xs font-semibold text-red-700 mb-2">Delete {owner.owner_name}?</p>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleDelete(owner.id)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold">Delete</button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 rounded-lg border text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
      {/* Edit Owner Dialog */}
      <Dialog open={!!editOwner} onOpenChange={() => setEditOwner(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Owner</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label>Name</Label><Input value={editForm.owner_name} onChange={e => setEditForm(f => ({...f, owner_name: e.target.value}))} /></div>
            <div><Label>Phone</Label><Input value={editForm.phone} onChange={e => setEditForm(f => ({...f, phone: e.target.value}))} /></div>
            <div><Label>Email</Label><Input value={editForm.email} onChange={e => setEditForm(f => ({...f, email: e.target.value}))} /></div>
            <div><Label>Property Address</Label><Input value={editForm.property_address} onChange={e => setEditForm(f => ({...f, property_address: e.target.value}))} /></div>
            <div><Label>Moving To</Label><Input value={editForm.moving_to} onChange={e => setEditForm(f => ({...f, moving_to: e.target.value}))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOwner(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}