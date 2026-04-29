import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const EXODUS_CITIES = ['Los Angeles', 'San Francisco', 'Seattle', 'Chicago', 'New York', 'San Diego', 'Oakland', 'Portland'];

export default function SendingAgentModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', brokerage: '',
    seller_city: '', destination_city: '', notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.DnnSubscriber.create({
      full_name: form.name,
      email: form.email,
      phone: form.phone,
      source: 'Sending Agent Portal',
      notes: `SENDING AGENT REQUEST — Brokerage: ${form.brokerage} | Seller in: ${form.seller_city} | Destination: ${form.destination_city} | Notes: ${form.notes}`,
      tier: 'tier3',
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}
        style={{ background: '#fff8ee', border: `2px solid ${GOLD}` }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between" style={{ background: '#0d0d0d' }}>
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>DYSON NATIONAL VETTING DESK</p>
            <p className="text-white font-bold text-sm mt-0.5">Sending Agent Referral Request</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>We'll vet the best destination agent and protect your 25% fee.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {submitted ? (
          <div className="px-8 py-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-black text-lg mb-2" style={{ color: '#1a1a1a' }}>Request Received</p>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#3a2f1e', fontFamily: 'Georgia, serif' }}>
              A Dyson relocation specialist will contact you within 24 hours with a vetted destination agent match and logistics plan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Pitch blurb */}
            <div className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#3a2f1e', fontFamily: 'Georgia, serif' }}>
              Don't send your client to a random referral. Tell us their destination and we'll vet the top boots-on-the-ground — so your fee is secured and your client is handled with elite care.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Your Full Name"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="col-span-2 w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }} />
              <input required placeholder="Email Address"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }} />
              <input placeholder="Phone Number"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }} />
            </div>
            <input placeholder="Your Brokerage"
              value={form.brokerage} onChange={e => setForm(f => ({ ...f, brokerage: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Seller's Current City</label>
                <select required value={form.seller_city} onChange={e => setForm(f => ({ ...f, seller_city: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }}>
                  <option value="">Select city…</option>
                  {EXODUS_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Destination City</label>
                <input required placeholder="e.g. Nashville, Boise…"
                  value={form.destination_city} onChange={e => setForm(f => ({ ...f, destination_city: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }} />
              </div>
            </div>
            <textarea placeholder="Additional context (timeline, price range, client situation…)" rows={3}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#1a1a1a' }} />
            <button type="submit"
              className="w-full py-3 rounded-full font-black text-sm tracking-wide transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
              Submit to Dyson Vetting Desk →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}