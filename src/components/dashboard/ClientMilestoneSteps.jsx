import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Circle, AlertTriangle, Clock } from 'lucide-react';

const GOLD = '#D4AF37';

const STATUS_STYLE = {
  pending: { icon: Circle, color: 'rgba(255,255,255,0.5)', label: 'Pending' },
  in_progress: { icon: Clock, color: GOLD, label: 'In Progress' },
  completed: { icon: CheckCircle2, color: '#10b981', label: 'Completed' },
  waived: { icon: CheckCircle2, color: 'rgba(255,255,255,0.5)', label: 'Waived' },
  at_risk: { icon: AlertTriangle, color: '#f59e0b', label: 'At Risk' },
  failed: { icon: AlertTriangle, color: '#ef4444', label: 'Needs Attention' },
};

/**
 * Client-facing "action steps" list for their move — pulls EscrowMilestone
 * records tied to their RelocationClient id, sorted by due date.
 */
export default function ClientMilestoneSteps({ clientId }) {
  const { data: milestones = [] } = useQuery({
    queryKey: ['clientMilestoneSteps', clientId],
    queryFn: () => base44.entities.EscrowMilestone.filter({ client_id: clientId }, 'due_date', 25),
    enabled: !!clientId,
  });

  return (
    <div className="rounded-2xl px-6 py-5 mb-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
      <p className="text-xs font-black tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>
        Action Steps On Your Move
      </p>
      {milestones.length === 0 ? (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          No action steps yet — once your transaction opens, milestones and next steps will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {milestones.map((m) => {
            const s = STATUS_STYLE[m.status] || STATUS_STYLE.pending;
            const Icon = s.icon;
            return (
              <div key={m.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{m.milestone_name || m.milestone_type?.replace(/_/g, ' ')}</p>
                  {m.due_date && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Due {m.due_date}</p>}
                </div>
                <span className="text-[10px] font-black tracking-wide uppercase shrink-0 px-2 py-0.5 rounded-full"
                  style={{ color: s.color, border: `1px solid ${s.color}` }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}