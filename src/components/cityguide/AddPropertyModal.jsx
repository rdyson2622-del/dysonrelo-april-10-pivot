import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Plus, Star } from 'lucide-react';

const GOLD = '#D4AF37';

export default function AddPropertyModal({ clientId, onClose, onAdded }) {
  const [form, setForm] = useState({
    address: '', city: '', state: '', price: '', bedrooms: '', bathrooms: '',
    sqft: '', listing_url: '', photo_url: '', client_notes: '', client_rating: 0,
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.address || !form.city || !form.state) return;
    setSaving(true);
    await base44.entities.PropertyCandidate.create({
      client_id: clientId,
      address: form.address,
      city: form.city,
      state: form.state,
      price: form.price ? parseFloat(form.price) : undefined,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : undefined,
      sqft: form.sqft ? parseInt(form.sqft) : undefined,
      listing_url: form.listing_url,
      photo_url: form.photo_url,
      client_notes: form.client_notes,
      client_rating: form.client_rating || undefined,
      status: 'considering',
    });
    setSaving(false);
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#111', border: `1px solid ${GOLD}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <div>
            <p className="text-xs font-bold tracking-widest" style={{ color: GOLD }}>ADD A PROPERTY</p>
            <h2 className="text-lg font-bold" style={{ color: '#fff' }}>From Today's Tour</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Property Address *" value={form.address} onChange={v => set('address', v)} placeholder="123 Oak Street" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City *" value={form.city} onChange={v => set('city', v)} placeholder="Austin" />
            <Field label="State *" value={form.state} onChange={v => set('state', v)} placeholder="TX" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Beds" value={form.bedrooms} onChange={v => set('bedrooms', v)} placeholder="4" type="number" />
            <Field label="Baths" value={form.bathrooms} onChange={v => set('bathrooms', v)} placeholder="3" type="number" />
            <Field label="Sq Ft" value={form.sqft} onChange={v => set('sqft', v)} placeholder="2400" type="number" />
          </div>
          <Field label="List Price" value={form.price} onChange={v => set('price', v)} placeholder="750000" type="number" />
          <Field label="Listing URL (Zillow, Redfin, etc.)" value={form.listing_url} onChange={v => set('listing_url', v)} placeholder="https://..." />
          <Field label="Photo URL (optional)" value={form.photo_url} onChange={v => set('photo_url', v)} placeholder="https://..." />

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold tracking-wider mb-1.5" style={{ color: GOLD }}>Your Notes From the Tour</label>
            <textarea
              value={form.client_notes}
              onChange={e => set('client_notes', e.target.value)}
              rows={3}
              placeholder="What did you love? What concerned you? First impressions..."
              className="w-full rounded-xl px-4 py-3 text-sm resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: GOLD }}>Your Gut Feeling</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => set('client_rating', n)}>
                  <Star className="w-7 h-7 transition-all" style={{
                    color: n <= form.client_rating ? GOLD : 'rgba(255,255,255,0.2)',
                    fill: n <= form.client_rating ? GOLD : 'transparent',
                  }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.address || !form.city || !form.state || saving}
            className="px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 disabled:opacity-40"
            style={{ background: GOLD, color: '#000' }}>
            <Plus className="w-4 h-4" />
            {saving ? 'Saving...' : 'Add to My Comparison'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-wider mb-1.5" style={{ color: GOLD }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 text-sm"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
      />
    </div>
  );
}