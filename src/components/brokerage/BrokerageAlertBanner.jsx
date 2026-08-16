import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, X, ChevronDown, ChevronUp, Bell, CheckCircle2,
  Loader2, ShieldCheck, Eye, EyeOff, Siren, ArrowUpCircle
} from 'lucide-react';
import EscrowIssueResolver from '@/components/brokerage/EscrowIssueResolver';

const GOLD = '#D4AF37';

/**
 * BrokerageAlertBanner — two-tier real-time alert system.
 * Tier 1 (Internal): Agent / TC / Compliance Officer see alerts first to fix
 *   before stressing the client. Actions: Acknowledge → Mitigate → Resolve.
 * Tier 2 (Client): if not resolved internally, escalate to notify buyer/seller.
 */
export default function BrokerageAlertBanner() {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [resolver, setResolver] = useState(null);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;
  const { data: brokerage } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) return await base44.entities.Brokerage.get(userBrokerageId);
      return null;
    },
    enabled: !!user,
  });

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
  if (isLoading || alerts.length === 0) return null;

  // Split into tiers
  const internalAlerts = alerts.filter(a => a.alert_status !== 'escalated_to_client' && !a.client_notified);
  const clientAlerts = alerts.filter(a => a.alert_status === 'escalated_to_client' || a.client_notified);
  const count = alerts.length;

  const overdue = alerts.filter(a => a.severity === 'overdue');
  const topColor = overdue.length > 0 ? '#ef4444' : GOLD;

  const patch = async (id, payload) => {
    setBusyId(id);
    try {
      await base44.entities.EscrowMilestone.update(id, payload);
      queryClient.invalidateQueries({ queryKey: ['brokerageCriticalAlerts'] });
    } catch (e) { /* bubble */ }
    setBusyId(null);
  };

  const acknowledge = (a) => patch(a.id, {
    alert_status: 'acknowledged',
    acknowledged_by_name: user?.full_name || user?.email || 'Portal User',
    acknowledged_at: new Date().toISOString(),
  });

  const resolveInternal = (a) => patch(a.id, {
    alert_status: 'resolved_internal',
    mitigation_notes: (a.mitigation_notes || '') + ' \n[Resolved internally — client not notified]',
  });

  const escalate = (a) => patch(a.id, {
    alert_tier: 'client',
    alert_status: 'escalated_to_client',
    client_notified: true,
    client_notified_at: new Date().toISOString(),
  });

  const startMitigation = (a) => {
    setExpanded(true);
    setResolver({
      escrow: { number: a.escrow_number, address: a.address, company: a.company },
      milestone: { milestone_name: a.milestone, milestone_type: a.milestone },
      alertId: a.id,
    });
    patch(a.id, { alert_status: 'mitigating' });
  };

  return (
    <>
      <div
        className="mx-6 mt-3 rounded-xl overflow-hidden transition-all"
        style={{
          background: `linear-gradient(135deg, ${topColor}12, ${topColor}06)`,
          border: `1px solid ${topColor}50`,
        }}
      >
        {/* Header */}
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
              {internalAlerts.length > 0 && `${internalAlerts.length} internal (Agent/TC) · `}
              {clientAlerts.length > 0 && `${clientAlerts.length} client-facing · `}
              {overdue.length > 0 && `${overdue.length} overdue`}
            </p>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#888' }}>
            <EyeOff className="w-2.5 h-2.5" /> 2-TIER
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
        </button>

        {expanded && (
          <div className="px-4 pb-3 space-y-3 max-h-[420px] overflow-y-auto">
            {/* ── TIER 1: INTERNAL (Agent/TC) ── */}
            {internalAlerts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: GOLD }} />
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
                    Internal — Agent / TC Only
                  </p>
                  <span className="text-[9px] text-stone-500">Fix before notifying client</span>
                </div>
                <div className="space-y-1.5">
                  {internalAlerts.map((a, i) => (
                    <AlertRow
                      key={i} a={a} busy={busyId === a.id}
                      tier="internal"
                      onAcknowledge={() => acknowledge(a)}
                      onMitigate={() => startMitigation(a)}
                      onResolve={() => resolveInternal(a)}
                      onEscalate={() => escalate(a)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── TIER 2: CLIENT-FACING ── */}
            {clientAlerts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <Eye className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#ef4444' }}>
                    Client-Facing — Buyer/Seller Notified
                  </p>
                </div>
                <div className="space-y-1.5">
                  {clientAlerts.map((a, i) => (
                    <AlertRow key={i} a={a} busy={busyId === a.id} tier="client" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline issue resolver for mitigation */}
      {resolver && (
        <EscrowIssueResolver
          escrow={resolver.escrow}
          milestone={resolver.milestone}
          brokerageId={brokerage?.id}
          onClose={() => setResolver(null)}
          onApplied={() => {
            if (resolver.alertId) patch(resolver.alertId, { alert_status: 'mitigating' });
            setResolver(null);
          }}
        />
      )}
    </>
  );
}

function AlertRow({ a, busy, tier, onAcknowledge, onMitigate, onResolve, onEscalate }) {
  const sevColor = a.severity === 'overdue' ? '#ef4444' : a.severity === 'critical' ? '#f59e0b' : GOLD;
  const sevLabel = a.severity === 'overdue' ? 'OVERDUE' : a.severity === 'critical' ? 'AT RISK' : 'DUE SOON';
  const statusBadge = {
    raised: { label: 'NEW', color: '#ef4444' },
    acknowledged: { label: 'ACKNOWLEDGED', color: GOLD },
    mitigating: { label: 'MITIGATING', color: '#38bdf8' },
    resolved_internal: { label: 'RESOLVED', color: '#22c55e' },
    escalated_to_client: { label: 'CLIENT NOTIFIED', color: '#ef4444' },
  }[a.alert_status] || { label: a.alert_status?.toUpperCase(), color: '#888' };

  return (
    <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${sevColor}30` }}>
      <div className="flex items-start gap-2">
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: `${sevColor}20`, color: sevColor }}>
          {sevLabel}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white truncate">{a.address || `Escrow #${a.escrow_number || '—'}`}</p>
          <p className="text-[10px] text-stone-400">
            {a.milestone} · due {a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            <span style={{ color: sevColor }}> · {a.days < 0 ? `${Math.abs(a.days)}d overdue` : `${a.days}d left`}</span>
          </p>
          {a.acknowledged_by_name && a.alert_status === 'acknowledged' && (
            <p className="text-[9px] text-stone-500 mt-0.5">↳ Acknowledged by {a.acknowledged_by_name}</p>
          )}
          {a.alert_status === 'mitigating' && (
            <p className="text-[9px] mt-0.5" style={{ color: '#38bdf8' }}>↳ Agent/TC working on a fix…</p>
          )}
        </div>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${statusBadge.color}20`, border: `1px solid ${statusBadge.color}40`, color: statusBadge.color }}>
          {statusBadge.label}
        </span>
      </div>

      {/* Actions — internal tier only */}
      {tier === 'internal' && a.alert_status !== 'resolved_internal' && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/5">
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: GOLD }} />
          ) : (
            <>
              {a.alert_status === 'raised' && (
                <ActionBtn onClick={onAcknowledge} icon={CheckCircle2} label="Acknowledge" color={GOLD} />
              )}
              <ActionBtn onClick={onMitigate} icon={Siren} label="Mitigate (AI)" color="#38bdf8" />
              {a.alert_status !== 'raised' && (
                <ActionBtn onClick={onResolve} icon={ShieldCheck} label="Resolve" color="#22c55e" />
              )}
              <ActionBtn onClick={onEscalate} icon={ArrowUpCircle} label="Escalate to Client" color="#ef4444" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, icon: Icon, label, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all hover:scale-[1.03]"
      style={{ background: `${color}12`, border: `1px solid ${color}40`, color }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}