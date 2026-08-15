import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const EMPTY = {
  full_name: '', first_name: '', last_name: '', email: '', phone: '',
  company: '', title: '', city: '', state: '', notes: '', status: 'active',
};

export default function BobDysonContactModal({ contact, onClose, onSaved }) {
  const isEdit = !!contact;
  const [form, setForm] = useState({ ...EMPTY, ...contact });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (!payload.first_name && payload.full_name) {
      const parts = payload.full_name.split(' ');
      payload.first_name = parts[0];
      payload.last_name = parts.slice(1).join(' ');
    }
    if (payload.phone) payload.phones = [payload.phone];
    if (payload.email) payload.emails = [payload.email];
    try {
      if (isEdit) {
        await base44.entities.BobDysonContact.update(contact.id, payload);
      } else {
        await base44.entities.BobDysonContact.create(payload);
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key] || ''}
        onChange={e => set(key, e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)', color: '#fff' }} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}
        style={{ background: '#0a0a0a', border: `2px solid ${GOLD}`, maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="px-6 py-4 flex items-center justify-between sticky top-0" style={{ background: '#0d0d0d', borderBottom: `1px solid rgba(212,175,55,0.3)` }}>
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>BOB DYSON CONTACTS</p>
            <p className="text-white font-bold text-sm mt-0.5">{isEdit ? 'Edit Contact' : 'Add Contact Manually'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">{field('Full Name *', 'full_name', 'text', 'Jane Smith')}</div>
            {field('First Name', 'first_name', 'text', 'Jane')}
            {field('Last Name', 'last_name', 'text', 'Smith')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Email', 'email', 'email', 'jane@email.com')}
            {field('Phone', 'phone', 'tel', '(555) 000-0000')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Company', 'company', 'text', 'Company name')}
            {field('Title', 'title', 'text', 'Job title')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('City', 'city', 'text', 'San Diego')}
            {field('State', 'state', 'text', 'CA')}
          </div>
          <div>
            <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)', color: '#fff' }}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Notes</label>
            <textarea rows={2} value={form.notes || ''} onChange={e => set('notes', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)', color: '#fff' }} />
          </div>
          <button type="submit" disabled={!form.full_name || saving}
            className="w-full py-3 rounded-full font-black text-sm tracking-wide transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            {saving ? 'Saving…' : (isEdit ? 'Save Changes →' : 'Add Contact →')}
          </button>
        </form>
      </div>
    </div>
  );
}