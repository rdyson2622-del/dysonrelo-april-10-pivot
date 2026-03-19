import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function AddOwnerDialog({ open, onClose, onAdded }) {
  const [form, setForm] = useState({
    owner_name: '',
    email: '',
    phone: '',
    property_address: '',
    property_city: '',
    property_state: '',
    listing_price: '',
    moving_to: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.ListingOwner.create({
      ...form,
      listing_price: form.listing_price ? parseFloat(form.listing_price) : undefined,
    });
    setSaving(false);
    setForm({
      owner_name: '', email: '', phone: '', property_address: '',
      property_city: '', property_state: '', listing_price: '', moving_to: '', notes: '',
    });
    onAdded?.();
    onClose();
  };

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Listing Owner</DialogTitle>
        </DialogHeader>
        <form autoComplete="off" className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Owner Name *</Label>
              <Input autoComplete="off" value={form.owner_name} onChange={(e) => update('owner_name', e.target.value)} placeholder="John Smith" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input autoComplete="off" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 123-4567" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input autoComplete="off" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="john@email.com" />
          </div>
          <div>
            <Label>Property Address *</Label>
            <Input autoComplete="off" value={form.property_address} onChange={(e) => update('property_address', e.target.value)} placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>City</Label>
              <Input autoComplete="off" value={form.property_city} onChange={(e) => update('property_city', e.target.value)} placeholder="Austin" />
            </div>
            <div>
              <Label>State</Label>
              <Input autoComplete="off" value={form.property_state} onChange={(e) => update('property_state', e.target.value)} placeholder="TX" />
            </div>
            <div>
              <Label>Listing Price</Label>
              <Input autoComplete="off" type="number" value={form.listing_price} onChange={(e) => update('listing_price', e.target.value)} placeholder="450000" />
            </div>
          </div>
          <div>
            <Label>Moving To</Label>
            <Input autoComplete="off" value={form.moving_to} onChange={(e) => update('moving_to', e.target.value)} placeholder="Where are they relocating?" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Any additional notes..." rows={2} />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.owner_name || !form.property_address || saving} className="bg-slate-900 hover:bg-slate-800">
            {saving ? 'Saving...' : 'Add Owner'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}