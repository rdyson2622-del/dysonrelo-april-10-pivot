import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, X, ChevronDown, ChevronUp, Bell } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * BrokerageAlertBanner — real-time critical alert banner.
 * Polls the brokerageCriticalAlerts function every 60s and shows a live
 * count of overdue / due-soon / at-risk escrow milestones across the portal.
 */
export default function BrokerageAlertBanner() {
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['brokerageCriticalAlerts'],
    queryFn: async () => {
      const res = await base44.functions.invoke('brokerageCriticalAlerts', {});
      return res.data;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  const alerts = data?.alerts || [];
  const count = alerts.length;
  if (isLoading || count === 0) return null;

  const overdue = alerts.filter(a => a.severity === 'overdue');
  const critical = alerts.filter(a => a.severity === 'critical');
  const dueSoon = alerts.filter(a => a.severity === 'due_soon');

  const topColor = overdue.length > 0 ? '#ef4444' : critical.length > 0 ? '#f59e0b' : GOLD;

  return (
    <div
      className="mx-6 mt-3 rounded-xl overflow-hidden transition-all"
      style={{
        background: `linear-gradient(135deg, ${topColor}12, ${topColor}06)`,
        border: `1px solid ${topColor}50`,
      }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-2.5"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 animate-pulse" style={{ background: `${topColor}20`, border: `1px solid ${topColor}` }}>
          <AlertTriangle className="w-3.5 h-3.5" style={{ color: topColor }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-bold" style={{ color: topColor }}>
            {count} Critical Alert{count !== 1 ? 's' : ''} — Real Time
          </p>
          <p className="text-[10px] text-stone-400">
            {overdue.length > 0 && `${overdue.length} overdue · `}
            {critical.length > 0 && `${critical.length} at-risk · `}
            {dueSoon.length > 0 && `${dueSoon.length} due ≤3d`}
          </p>
        </div>
        <Bell className="w-4 h-4" style={{ color: `${topColor}80` }} />
        {expanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-1.5 max-h-64 overflow-y-auto">
          {alerts.map((a, i) => {
            const sevColor = a.severity === 'overdue' ? '#ef4444' : a.severity === 'critical' ? '#f59e0b' : GOLD;
            const sevLabel = a.severity === 'overdue' ? 'OVERDUE' : a.severity === 'critical' ? 'AT RISK' : 'DUE SOON';
            return (
              <div key={i} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${sevColor}30` }}>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: `${sevColor}20`, color: sevColor }}>
                  {sevLabel}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{a.address || `Escrow #${a.escrow_number || '—'}`}</p>
                  <p className="text-[10px] text-stone-400">
                    {a.milestone} · due {a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    <span style={{ color: sevColor }}> · {a.days < 0 ? `${Math.abs(a.days)}d overdue` : `${a.days}d left`}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}