import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';
const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' };

const SERVICE_TYPES = [
  { value: 'title_company', label: 'Title Company' },
  { value: 'lender', label: 'Lender' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'mover', label: 'Mover' },
  { value: 'stager', label: 'Stager' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'other', label: 'Other' },
];

export default function VendorAreaVettingForm() {
  const [form, setForm] = useState({ vendor_name: '', company: '', service_type: 'other', areas_served: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.VendorInterest.create(form);
    setDone(true);
    setSubmitting(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl mt-8" style={{ border: `2px solid ${GOLD}` }}>
      <div className="px-6 py-4 text-center" style={{ background: GOLD }}>
        <p className="font-black text-lg tracking-wide" style={{ color: '#000' }}>Coming Soon: Enroll by Service Area</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.65)' }}>
          Tell us the areas you serve now to get on the fast-track vetting list before enrollment opens.
        </p>
      </div>

      {done ? (
        <div className="px-6 py-10 text-center" style={{ background: '#111' }}>
          <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#10b981' }} />
          <p className="font-black text-lg text-white mb-1">You're On The List!</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            We'll reach out for rapid vetting and let you know as soon as service-area enrollment opens.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" style={{ background: '#111' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Your Name *</label>
              <input required value={form.vendor_name} onChange={(e) => set('vendor_name', e.target.value)}
                placeholder="Your full name" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Company</label>
              <input value={form.company} onChange={(e) => set('company', e.target.value)}
                placeholder="Company name" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Service Type *</label>
              <select required value={form.service_type} onChange={(e) => set('service_type', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                {SERVICE_TYPES.map((s) => (
                  <option key={s.value} value={s.value} style={{ background: '#111' }}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Areas / Towns Served *</label>
              <input required value={form.areas_served} onChange={(e) => set('areas_served', e.target.value)}
                placeholder="e.g. Nashville, Franklin, Brentwood" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder="you@company.com" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
                placeholder="(555) 555-5555" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-full font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            <ArrowRight className="w-4 h-4" />
            {submitting ? 'Submitting…' : 'Get Fast-Tracked for Vetting'}
          </button>
        </form>
      )}
    </div>
  );
}