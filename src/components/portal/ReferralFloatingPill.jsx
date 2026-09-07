import React, { useState } from 'react';
import { UserPlus, X, CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const EMPTY = { person_name: '', person_email: '', destination_city: '', destination_state: '', referrer_name: '', referrer_email: '', notes: '' };

/**
 * ReferralFloatingPill — a persistent, bottom-right reminder on every page
 * that any visitor or subscriber can refer someone who's relocating.
 * Completely separate from the "Talk to us" / Ask Anything pill — this one
 * has a single purpose: capture a relocation referral lead.
 */
export default function ReferralFloatingPill() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.person_name.trim() && form.person_email.trim();

  const close = () => { setOpen(false); setDone(false); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await base44.entities.DnnSubscriber.create({
      full_name: form.person_name.trim(),
      email: form.person_email.trim(),
      source: 'Referral Pill',
      referral_status: 'new',
      notes: `Referred by: ${form.referrer_name || 'Anonymous'} (${form.referrer_email || 'no email given'}) | Destination: ${form.destination_city}, ${form.destination_state} | Notes: ${form.notes}`,
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black tracking-wide transition-all hover:scale-105 active:scale-95"
          style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000', boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}
        >
          <UserPlus className="w-4 h-4" /> Refer Someone
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={close}>
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#0d0d0d', border: `2px solid ${GOLD}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
              <p className="text-sm font-black tracking-widest uppercase flex items-center gap-2" style={{ color: GOLD }}>
                <UserPlus className="w-4 h-4" /> Refer Someone Relocating
              </p>
              <button onClick={close} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10" style={{ color: GOLD }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {done ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#22c55e' }} />
                <p className="text-white font-bold mb-1">Thank you!</p>
                <p className="text-sm text-gray-400">We'll reach out to them directly to help with their move.</p>
                <button onClick={close} className="mt-5 text-xs font-bold" style={{ color: GOLD }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
                <p className="text-xs text-gray-400 leading-relaxed">Know someone relocating? Tell us who they are and we'll take great care of them.</p>
                <input required placeholder="Their name *" value={form.person_name} onChange={e => set('person_name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                <input required type="email" placeholder="Their email *" value={form.person_email} onChange={e => set('person_email', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Destination city" value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                  <input placeholder="State" value={form.destination_state} onChange={e => set('destination_state', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Your name (optional)" value={form.referrer_name} onChange={e => set('referrer_name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                  <input placeholder="Your email (optional)" value={form.referrer_email} onChange={e => set('referrer_email', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                </div>
                <textarea rows={2} placeholder="Anything else we should know? (optional)" value={form.notes} onChange={e => set('notes', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-transparent text-white placeholder-gray-500 resize-none" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                <button type="submit" disabled={!canSubmit || submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {submitting ? 'Sending…' : 'Send Referral'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}