import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Sparkles, Loader2, CheckCircle2, Zap } from 'lucide-react';

const GOLD = '#D4AF37';

const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#6b7280' },
  { id: 'normal', label: 'Normal', color: '#9ca3af' },
  { id: 'high', label: 'High', color: '#D4AF37' },
  { id: 'urgent', label: 'Urgent', color: '#ef4444' },
];

const TIMEFRAMES = ['ASAP', 'This week', 'This month', 'Flexible'];

/**
 * OrderFlowModal — the "order desk" for subscribers.
 * Pre-fills with the flow they clicked, lets them describe their specific need,
 * and creates a real SubscriberRoadmap record (status = requested).
 * The real record replaces dummies on the show sheet automatically.
 */
export default function OrderFlowModal({ prefill, onClose, onOrdered }) {
  const [title, setTitle] = useState(prefill?.title || '');
  const [requestText, setRequestText] = useState('');
  const [priority, setPriority] = useState(prefill?.priority || 'normal');
  const [timeframe, setTimeframe] = useState('This week');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !requestText.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const me = await base44.auth.me();
      await base44.entities.SubscriberRoadmap.create({
        subscriber_id: me.id,
        subscriber_name: me.full_name || me.email,
        subscriber_type: 'relocation_client',
        title: title.trim(),
        desk_id: prefill?.desk_id || 'knowledge',
        desk_name: prefill?.desk_name || 'Knowledge & Research',
        request_text: `${requestText.trim()}\n\nTimeframe: ${timeframe}`,
        status: 'requested',
        priority,
        requested_at: new Date().toISOString(),
        period: 'weekly',
      });
      setSuccess(true);
      setTimeout(() => {
        onOrdered?.();
        onClose();
      }, 1500);
    } catch (e) {
      setError(e.message || 'Failed to submit request');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#111', border: `1px solid ${GOLD}40` }} onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#22c55e' }} />
            <h3 className="text-xl font-serif text-white mb-1">Request Submitted!</h3>
            <p className="text-sm text-gray-400">Your Solution Map item has been ordered. An AGI agent will pick it up shortly.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40` }}>
                  <Zap className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Order Desk</p>
                  <h3 className="text-lg font-serif text-white">Request This Flow</h3>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {prefill?.desk_name && (
              <div className="rounded-lg px-3 py-2 mb-4 text-xs flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-gray-500">Department:</span>
                <span style={{ color: GOLD }}>{prefill.desk_name}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>What do you need?</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Nashville City Guide"
                  className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#1a1a1a', border: `1px solid ${GOLD}25` }}
                />
              </div>

              <div>
                <label className="text-[10px] font-black tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Tell us the details</label>
                <textarea
                  value={requestText}
                  onChange={e => setRequestText(e.target.value)}
                  placeholder="Describe your request — where, when, what you're looking for..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none resize-none"
                  style={{ background: '#1a1a1a', border: `1px solid ${GOLD}25` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Priority</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRIORITIES.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className="text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all"
                        style={{
                          background: priority === p.id ? `${p.color}18` : 'transparent',
                          border: `1px solid ${priority === p.id ? p.color : 'rgba(255,255,255,0.12)'}`,
                          color: priority === p.id ? p.color : '#888',
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Timeframe</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIMEFRAMES.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeframe(t)}
                        className="text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-all"
                        style={{
                          background: timeframe === t ? `${GOLD}18` : 'transparent',
                          border: `1px solid ${timeframe === t ? GOLD : 'rgba(255,255,255,0.12)'}`,
                          color: timeframe === t ? GOLD : '#888',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !requestText.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-black transition-all disabled:opacity-40"
                style={{ background: GOLD }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <p className="text-[10px] text-gray-500 text-center">We'll route this to the right AGI agent and add it to your Solution Map.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}