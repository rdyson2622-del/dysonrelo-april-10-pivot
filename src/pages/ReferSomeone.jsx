import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const EMPTY = { referred_name: '', referred_email: '', referred_phone: '', destination_city: '', destination_state: '', referrer_name: '', referrer_email: '', notes: '' };

export default function ReferSomeone() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.referred_name.trim() && form.referred_email.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await base44.entities.ReferralLead.create({
      referred_name: form.referred_name.trim(),
      referred_email: form.referred_email.trim(),
      referred_phone: form.referred_phone.trim(),
      destination_city: form.destination_city.trim(),
      destination_state: form.destination_state.trim(),
      referrer_name: form.referrer_name.trim() || 'Anonymous',
      referrer_email: form.referrer_email.trim(),
      notes: form.notes.trim(),
      source: 'Referral Page',
      status: 'new',
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ border: `2px solid ${GOLD}` }}>
        <div className="px-6 py-5 text-center" style={{ background: GOLD }}>
          <p className="font-black text-xl tracking-wide" style={{ color: '#000' }}>Refer Someone Relocating</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.65)' }}>We'll take great care of them.</p>
        </div>

        {done ? (
          <div className="px-6 py-14 text-center" style={{ background: '#111' }}>
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#10b981' }} />
            <p className="font-black text-xl text-white mb-2">Thank You!</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              We'll reach out to {form.referred_name} directly to help with their move.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => { setForm(EMPTY); setDone(false); }} className="text-xs font-bold" style={{ color: GOLD }}>
                Refer Another
              </button>
              <button onClick={() => navigate('/portal')} className="text-xs font-bold text-white/60">
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4" style={{ background: '#111' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Know someone relocating? Tell us who they are and we'll take it from there.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input required placeholder="Their name *" value={form.referred_name} onChange={e => set('referred_name', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
              <input required type="email" placeholder="Their email *" value={form.referred_email} onChange={e => set('referred_email', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
            </div>
            <input placeholder="Their phone (optional)" value={form.referred_phone} onChange={e => set('referred_phone', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Destination city" value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
              <input placeholder="State" value={form.destination_state} onChange={e => set('destination_state', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Your name (optional)" value={form.referrer_name} onChange={e => set('referrer_name', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
              <input placeholder="Your email (optional)" value={form.referrer_email} onChange={e => set('referrer_email', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
            </div>
            <textarea rows={3} placeholder="Anything else we should know? (optional)" value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }} />
            <button type="submit" disabled={!canSubmit || submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-black tracking-wide disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {submitting ? 'Sending…' : 'Send Referral'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white/50 pt-1">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}