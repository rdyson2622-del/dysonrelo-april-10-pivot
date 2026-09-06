import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send } from 'lucide-react';

const GOLD = '#D4AF37';

const STATUS_LABELS = {
  processing: 'Working On It',
  completed: 'Answered',
  failed: 'Needs Follow-Up',
};

/**
 * Reusable "store & act on a request" widget for subscriber dashboards.
 * Lets a subscribed user submit a question/request and see prior ones
 * with their status/solution, tied to their own user id.
 */
export default function RequestInfoWidget({ portalRole = 'client', context = 'general' }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ['dashboardRequests', portalRole, context],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.RealEstateRequest.filter({ user_id: user.id, context }, '-created_date', 5);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    const user = await base44.auth.me();
    await base44.entities.RealEstateRequest.create({
      full_name: user.full_name,
      email: user.email,
      user_id: user.id,
      portal_role: portalRole,
      context,
      request_text: text.trim(),
      status: 'processing',
    });
    setText('');
    setSubmitting(false);
    queryClient.invalidateQueries({ queryKey: ['dashboardRequests', portalRole, context] });
  };

  return (
    <div className="rounded-2xl px-6 py-5 mb-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
      <p className="text-xs font-black tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>
        Request Info / Ask a Question
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need help with?"
          className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-black tracking-wide disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </form>

      {requests.length === 0 ? (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          No requests yet — submit one above and we'll respond here.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((r) => (
            <div key={r.id} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-sm text-white truncate">{r.request_text}</span>
                <span className="text-[10px] font-black tracking-wide uppercase shrink-0 px-2 py-0.5 rounded-full"
                  style={{ color: GOLD, border: `1px solid rgba(212,175,55,0.3)` }}>
                  {STATUS_LABELS[r.status] || r.status}
                </span>
              </div>
              {r.solution && (
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.solution}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}