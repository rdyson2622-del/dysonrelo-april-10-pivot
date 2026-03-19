import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ExternalLink, MoreHorizontal, MessageSquare, User, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';
import SendCampaignButton from './SendCampaignButton';

const statusColors = {
  not_contacted: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-100 text-blue-700',
  in_conversation: 'bg-amber-100 text-amber-700',
  interested: 'bg-emerald-100 text-emerald-700',
  not_interested: 'bg-red-100 text-red-700',
  converted: 'bg-purple-100 text-purple-700',
};

export default function ContactTable({ owners, onRefresh }) {
  const [updating, setUpdating] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const openEdit = (owner) => {
    setEditOwner(owner);
    setEditForm({
      owner_name: owner.owner_name || '',
      email: owner.email || '',
      phone: owner.phone || '',
      property_address: owner.property_address || '',
      property_city: owner.property_city || '',
      property_state: owner.property_state || '',
      listing_price: owner.listing_price || '',
      moving_to: owner.moving_to || '',
      notes: owner.notes || '',
    });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    await base44.entities.ListingOwner.update(editOwner.id, {
      ...editForm,
      listing_price: editForm.listing_price ? parseFloat(editForm.listing_price) : undefined,
    });
    setSaving(false);
    setEditOwner(null);
    onRefresh?.();
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    await base44.entities.ListingOwner.update(id, {
      contact_status: newStatus,
      last_contacted: new Date().toISOString().split('T')[0],
    });
    setUpdating(null);
    onRefresh?.();
  };

  const handleDelete = async (id) => {
    await base44.entities.ListingOwner.delete(id);
    setConfirmDelete(null);
    onRefresh?.();
  };

  if (!owners || owners.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No listing owners yet</p>
        <p className="text-sm mt-1">Add owners who are moving to start outreach</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Owner</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Property</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Moving To</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Price</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Status</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner, i) => (
            <motion.tr
              key={owner.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors relative"
            >
              <td className="py-3 px-3">
                <Link to={`/AdminOwners/${owner.id}`} className="cursor-pointer hover:opacity-70 transition block">
                  <p className="font-medium text-sm text-slate-800">{owner.owner_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {owner.email && (
                      <a href={`mailto:${owner.email}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Mail className="w-3 h-3" />
                        {owner.email}
                      </a>
                    )}
                  </div>
                  {owner.phone && (
                    <a href={`tel:${owner.phone}`} className="text-xs text-slate-400 flex items-center gap-1 mt-0.5" onClick={(e) => e.stopPropagation()}>
                      <Phone className="w-3 h-3" />
                      {owner.phone}
                    </a>
                  )}
                </Link>
              </td>
              <td className="py-3 px-3">
                <p className="text-sm text-slate-700">{owner.property_address}</p>
                <p className="text-xs text-slate-400">{owner.property_city}{owner.property_state ? `, ${owner.property_state}` : ''}</p>
              </td>
              <td className="py-3 px-3">
                <p className="text-sm text-slate-600">{owner.moving_to || '—'}</p>
              </td>
              <td className="py-3 px-3">
                <p className="text-sm font-medium text-slate-800">
                  {owner.listing_price ? `$${owner.listing_price.toLocaleString()}` : '—'}
                </p>
              </td>
              <td className="py-3 px-3">
                <Badge className={`${statusColors[owner.contact_status] || statusColors.not_contacted} border-0 text-xs`}>
                  {(owner.contact_status || 'not_contacted').replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="py-3 px-3 text-right">
               <div className="flex items-center gap-2 justify-end">
                 <SendCampaignButton owner={owner} />
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(owner)} title="Edit owner">
                   <Edit2 className="w-4 h-4" />
                 </Button>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                       <MoreHorizontal className="w-4 h-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'contacted')}>
                       <Phone className="w-4 h-4 mr-2" /> Mark Contacted
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'in_conversation')}>
                       <MessageSquare className="w-4 h-4 mr-2" /> In Conversation
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'interested')}>
                       <Mail className="w-4 h-4 mr-2" /> Mark Interested
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'converted')}>
                       <ExternalLink className="w-4 h-4 mr-2" /> Mark Converted
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'not_interested')} className="text-red-600">
                       Not Interested
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setConfirmDelete(owner.id)} className="text-red-600 font-semibold">
                       <Trash2 className="w-4 h-4 mr-2" /> Delete Owner
                     </DropdownMenuItem>
                     </DropdownMenuContent>
                     </DropdownMenu>
                     </div>
                     {confirmDelete === owner.id && (
                     <div className="absolute right-0 top-10 z-50 bg-white rounded-xl shadow-xl border border-red-100 p-3 w-52 text-center">
                     <p className="text-xs font-semibold text-red-700 mb-2">Delete this owner?</p>
                     <div className="flex gap-2 justify-center">
                     <button onClick={() => handleDelete(owner.id)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700">Delete</button>
                     <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 rounded-lg border text-xs font-bold hover:bg-slate-50">Cancel</button>
                     </div>
                     </div>
                     )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      <Dialog open={!!editOwner} onOpenChange={() => setEditOwner(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Owner</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name *</Label><Input value={editForm.owner_name} onChange={e => setEditForm(f => ({...f, owner_name: e.target.value}))} /></div>
              <div><Label>Phone</Label><Input value={editForm.phone} onChange={e => setEditForm(f => ({...f, phone: e.target.value}))} /></div>
            </div>
            <div><Label>Email</Label><Input value={editForm.email} onChange={e => setEditForm(f => ({...f, email: e.target.value}))} /></div>
            <div><Label>Property Address</Label><Input value={editForm.property_address} onChange={e => setEditForm(f => ({...f, property_address: e.target.value}))} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2"><Label>City</Label><Input value={editForm.property_city} onChange={e => setEditForm(f => ({...f, property_city: e.target.value}))} /></div>
              <div><Label>State</Label><Input value={editForm.property_state} onChange={e => setEditForm(f => ({...f, property_state: e.target.value}))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Listing Price</Label><Input type="number" value={editForm.listing_price} onChange={e => setEditForm(f => ({...f, listing_price: e.target.value}))} /></div>
              <div><Label>Moving To</Label><Input value={editForm.moving_to} onChange={e => setEditForm(f => ({...f, moving_to: e.target.value}))} /></div>
            </div>
            <div><Label>Notes</Label><textarea value={editForm.notes} onChange={e => setEditForm(f => ({...f, notes: e.target.value}))} rows={2} className="w-full rounded-md border border-input px-3 py-2 text-sm" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOwner(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editForm.owner_name || saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}