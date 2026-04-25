import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const BUDGET_OPTIONS = [
  { value: 'under_200k', label: 'Under $200k' },
  { value: '200k_400k', label: '$200k – $400k' },
  { value: '400k_600k', label: '$400k – $600k' },
  { value: '600k_800k', label: '$600k – $800k' },
  { value: '800k_1m',   label: '$800k – $1M' },
  { value: 'over_1m',   label: 'Over $1M' },
];

const PRIORITY_OPTIONS = [
  'schools', 'commute', 'nightlife', 'walkability', 'safety',
  'nature', 'healthcare', 'religious_community', 'shopping', 'dining',
  'arts_culture', 'sports_recreation'
];

const ENGAGEMENT_OPTIONS = [
  { value: 'hands_on', label: 'Hands-On (daily digests)' },
  { value: 'full_access', label: 'Full Access (real-time)' },
  { value: 'delegate', label: 'Delegate (expert-led)' },
];

export default function AddClientModal({ isOpen, onClose, onCreated }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_city: '',
    destination_city: '',
    move_date: '',
    budget: '',
    family_size: '',
    priorities: [],
    engagement_preference: 'hands_on',
    notes: '',
    status: 'new_lead',
  });

  if (!isOpen) return null;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const togglePriority = (p) => {
    setForm(f => ({
      ...f,
      priorities: f.priorities.includes(p)
        ? f.priorities.filter(x => x !== p)
        : [...f.priorities, p],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      family_size: form.family_size ? parseInt(form.family_size) : undefined,
    };
    // Remove empty strings
    Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k]; });
    const created = await base44.entities.RelocationClient.create(payload);
    setSaving(false);
    onCreated(created);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#111', border: '1px solid rgba(212,175,55,0.3)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: GOLD }}>Admin Panel</p>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Add New Client</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Scrollable form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/* Contact Info */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>Contact Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Full Name *</label>
                  <input required value={form.full_name} onChange={e => set('full_name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Email *</label>
                  <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Family Size</label>
                  <input type="number" min="1" value={form.family_size} onChange={e => set('family_size', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
              </div>
            </div>

            {/* Relocation Details */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>Relocation Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Moving From</label>
                  <input value={form.current_city} onChange={e => set('current_city', e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Moving To *</label>
                  <input required value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Target Move Date</label>
                  <input type="date" value={form.move_date} onChange={e => set('move_date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Budget Range</label>
                  <select value={form.budget} onChange={e => set('budget', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <option value="">Select budget</option>
                    {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Status & Engagement */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>Pipeline & Engagement</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Initial Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <option value="new_lead">New Lead</option>
                    <option value="in_consultation">In Consultation</option>
                    <option value="actively_searching">Actively Searching</option>
                    <option value="under_contract">Under Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">Engagement Preference</label>
                  <select value={form.engagement_preference} onChange={e => set('engagement_preference', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {ENGAGEMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Priorities */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>Client Priorities</p>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map(p => (
                  <button key={p} type="button" onClick={() => togglePriority(p)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize"
                    style={{
                      background: form.priorities.includes(p) ? GOLD : 'rgba(255,255,255,0.06)',
                      color: form.priorities.includes(p) ? '#000' : 'rgba(255,255,255,0.6)',
                      border: form.priorities.includes(p) ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    }}>
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-white">Internal Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                rows={3}
                placeholder="Any notes about this client..."
                className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
            </div>

          </form>

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 flex justify-end gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
              {saving ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}