import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageCircle, Clock, Mail, User } from 'lucide-react';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';

const GOLD = '#D4AF37';
const PORTAL_FILTERS = ['all', 'client', 'agent', 'referral_agent', 'vendor', 'hr', 'brokerage_admin', 'general'];

function stagesToStatuses(stages) {
  const statuses = {};
  (stages || []).forEach(s => { statuses[s.id] = { status: s.status }; });
  return statuses;
}

/**
 * AdminTalkToUsRequests — the admin-side library of every "Talk to us"
 * submission across every portal, so our team can recall and revisit any
 * client/agent/vendor/HR request and the roadmap Charlie generated for it.
 * Mirrors the visitor-facing history list inside the pill itself.
 */
export default function AdminTalkToUsRequests() {
  const [portalFilter, setPortalFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['allRealEstateRequests'],
    queryFn: () => base44.entities.RealEstateRequest.list('-created_date', 200),
  });

  const filtered = portalFilter === 'all' ? requests : requests.filter(r => r.portal_role === portalFilter);
  const selected = filtered.find(r => r.id === selectedId) || filtered[0] || null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1 flex items-center gap-2" style={{ color: GOLD }}>
        <MessageCircle className="w-3.5 h-3.5" /> Talk To Us — Request Library
      </p>
      <h1 className="text-2xl font-serif text-white mb-4">Every request, saved for recall</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2">
        {PORTAL_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setPortalFilter(f)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize"
            style={{
              background: portalFilter === f ? `${GOLD}20` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${portalFilter === f ? GOLD : 'rgba(255,255,255,0.1)'}`,
              color: portalFilter === f ? GOLD : 'rgba(255,255,255,0.6)',
            }}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-white/50">Loading…</p>}
      {!isLoading && filtered.length === 0 && <p className="text-sm text-white/50">No requests for this portal yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4">
        {/* List */}
        <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className="w-full text-left p-3 rounded-xl transition-all"
              style={{
                background: selected?.id === r.id ? `${GOLD}15` : '#161616',
                border: `1px solid ${selected?.id === r.id ? GOLD : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <p className="text-xs text-white font-semibold line-clamp-2">{r.request_text}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: GOLD }}>{r.portal_role}</span>
                <span className="text-[10px] text-white/40">
                  {r.created_date ? new Date(r.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="rounded-2xl p-5" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}30` }}>
            <div className="flex items-center gap-4 mb-3 text-xs text-white/60">
              {selected.full_name && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selected.full_name}</span>}
              {selected.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</span>}
              {selected.duration_ms != null && (
                <span className="flex items-center gap-1" style={{ color: GOLD }}><Clock className="w-3 h-3" /> {(selected.duration_ms / 1000).toFixed(1)}s</span>
              )}
            </div>
            <p className="text-sm text-white font-semibold mb-4">{selected.request_text}</p>
            {selected.roadmap_stages?.length > 0 && (
              <FlowRoadmapLine
                stages={selected.roadmap_stages.map(s => ({ id: s.id, title: s.title }))}
                stageStatuses={stagesToStatuses(selected.roadmap_stages)}
                color={GOLD}
                onSelect={() => {}}
                compact
              />
            )}
            {selected.solution && <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{selected.solution}</p>}
            {selected.action_steps?.length > 0 && (
              <ul className="mt-3 space-y-1">
                {selected.action_steps.map((step, i) => (
                  <li key={i} className="text-xs text-white/60 flex gap-2"><span style={{ color: GOLD }}>•</span>{step}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}