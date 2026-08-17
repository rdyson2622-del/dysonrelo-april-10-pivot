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

/**
 * OrderFlowModal — compact "order desk" for subscribers.
 * Creates a real SubscriberRoadmap record (status = requested).
 */
export default function OrderFlowModal({ prefill, onClose, onOrdered }) {
  const [title, setTitle] = useState(prefill?.title || '');
  const [requestText, setRequestText] = useState('');
  const [priority, setPriority] = useState(prefill?.priority || 'normal');
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
        request_text: requestText.trim(),
        status: 'requested',
        priority,
        requested_at: new Date().toISOString(),
        period: 'weekly',
      });
      setSuccess(true);
      setTimeout(() => {
        onOrdered?.();
        onClose();
      }, 1200);
    } catch (e) {
      setError(e.message || 'Failed to submit request');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl p-4" style={{ background: '#111', border: `1px solid ${GOLD}40` }} onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: '#22c55e' }} />
            <h3 className="text-base font-serif text-white mb-1">Request Submitted</h3>
            <p className="text-xs text-gray-400">An AGI agent will pick it up shortly.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40` }}>
                  <Zap className="w-3.5 h-3.5" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Order Desk</p>
                  <h3 className="text-sm font-serif text-white leading-tight">Find A Solution</h3>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {prefill?.desk_name && (
              <div className="rounded-md px-2 py-1 mb-2.5 text-[10px] flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-gray-500">Dept:</span>
                <span style={{ color: GOLD }}>{prefill.desk_name}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <div>
                <label className="text-[9px] font-black tracking-widest uppercase mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>What do you need?</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Nashville City Guide"
                  className="w-full px-3 py-2 rounded-md text-sm text-white outline-none"
                  style={{ background: '#1a1a1a', border: `1px solid ${GOLD}25` }}
                />
              </div>

              <div>
                <label className="text-[9px] font-black tracking-widest uppercase mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Details</label>
                <textarea
                  value={requestText}
                  onChange={e => setRequestText(e.target.value)}
                  placeholder="Where, when, what you're looking for..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md text-sm text-white outline-none resize-none"
                  style={{ background: '#1a1a1a', border: `1px solid ${GOLD}25` }}
                />
              </div>

              <div>
                <label className="text-[9px] font-black tracking-widest uppercase mb-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>Priority</label>
                <div className="flex flex-wrap gap-1">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className="text-[10px] px-2 py-1 rounded-md font-bold transition-all"
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

              {error && <p className="text-[11px]" style={{ color: '#ef4444' }}>{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !requestText.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold text-black transition-all disabled:opacity-40"
                style={{ background: GOLD }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <p className="text-[9px] text-gray-500 text-center">We'll route this to the right AGI agent.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}