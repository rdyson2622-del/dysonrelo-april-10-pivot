import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, RefreshCw, Mail, Webhook, Database, AlertTriangle, CheckCircle2, Clock, Building2, Loader2 } from 'lucide-react';
import BrokerageCommPill from '@/components/brokerage/BrokerageCommPill';

const GOLD = '#D4AF37';

const SOURCES = [
  { id: 'boldtrail_api', label: 'BoldTrail API', icon: Database, fn: 'boldtrailSyncEscrow', desc: 'Direct Deals API pull' },
  { id: 'gmail', label: 'Gmail Parsing', icon: Mail, fn: 'gmailEscrowSync', desc: 'Parse transaction emails' },
  { id: 'apination', label: 'API Nation Webhook', icon: Webhook, fn: null, desc: 'Real-time push (passive)' },
];

export default function EscrowManagement() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(null);
  const [syncResult, setSyncResult] = useState(null);

  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['escrowMilestones'],
    queryFn: () => base44.entities.EscrowMilestone.list('-due_date', 200),
    refetchInterval: 30000,
  });

  const runSync = async (sourceId, fnName) => {
    if (!fnName) return;
    setSyncing(sourceId);
    setSyncResult(null);
    try {
      const res = await base44.functions.invoke(fnName, {});
      setSyncResult({ source: sourceId, ok: true, data: res.data });
      queryClient.invalidateQueries(['escrowMilestones']);
    } catch (e) {
      setSyncResult({ source: sourceId, ok: false, error: e.message });
    }
    setSyncing(null);
  };

  // Group milestones by escrow_number
  const escrows = {};
  milestones.forEach(m => {
    const key = m.escrow_number || m.property_address || 'unknown';
    if (!escrows[key]) escrows[key] = { address: m.property_address, company: m.escrow_company, number: m.escrow_number, milestones: [] };
    escrows[key].milestones.push(m);
  });
  const escrowList = Object.values(escrows);

  // At-risk: overdue or due within 3 days and not completed
  const today = new Date();
  const atRisk = milestones.filter(m => {
    if (m.status === 'completed' || m.status === 'waived') return false;
    if (!m.due_date) return false;
    const days = Math.ceil((new Date(m.due_date) - today) / (1000 * 60 * 60 * 24));
    return days <= 3;
  });

  return (
    <div className="p-6 md:p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>
          <Shield className="w-6 h-6" style={{ color: GOLD }} />
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Broker/Agent Portal</p>
          <h1 className="text-3xl font-serif text-white">Escrow Management</h1>
        </div>
      </div>

      {/* Communication pill — first thing under the heading */}
      <BrokerageCommPill />

      {/* Integration sources */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {SOURCES.map(src => {
          const Icon = src.icon;
          const isSyncing = syncing === src.id;
          return (
            <div key={src.id} className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: GOLD }} />
                <span className="text-sm font-serif text-white">{src.label}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{src.desc}</p>
              {src.fn ? (
                <button
                  onClick={() => runSync(src.id, src.fn)}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', color: GOLD }}
                >
                  {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {isSyncing ? 'Syncing…' : 'Sync Now'}
                </button>
              ) : (
                <div className="w-full text-center px-3 py-2 rounded-lg text-xs text-gray-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Listening for webhooks…
                </div>
              )}
              {syncResult && syncResult.source === src.id && (
                <p className="text-[10px] mt-2" style={{ color: syncResult.ok ? '#22c55e' : '#ef4444' }}>
                  {syncResult.ok ? `✓ ${syncResult.data.milestones_created || syncResult.data.milestones_upserted || 0} upserted` : `✗ ${syncResult.error}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatBox label="Active Escrows" value={escrowList.length} color={GOLD} />
        <StatBox label="Total Milestones" value={milestones.length} color="#fff" />
        <StatBox label="At Risk (≤3 days)" value={atRisk.length} color="#ef4444" />
        <StatBox label="Completed" value={milestones.filter(m => m.status === 'completed').length} color="#22c55e" />
      </div>

      {/* At-risk banner */}
      {atRisk.length > 0 && (
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-sm text-white">
            <span className="font-bold">{atRisk.length}</span> milestone{atRisk.length !== 1 ? 's' : ''} due within 3 days or overdue — review below.
          </p>
        </div>
      )}

      {/* Escrow list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
        </div>
      ) : escrowList.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 text-sm mb-2">No escrow data yet.</p>
          <p className="text-gray-600 text-xs">Run a sync above (BoldTrail API or Gmail) to pull live transactions. API Nation webhooks will populate automatically once configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {escrowList.map((esc, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-serif text-white">{esc.address || 'Unknown address'}</h3>
                  <p className="text-xs text-gray-500">{esc.company} · Escrow #{esc.number || '—'}</p>
                </div>
                <span className="text-xs text-gray-500">{esc.milestones.length} milestones</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {esc.milestones.sort((a,b) => new Date(a.due_date) - new Date(b.due_date)).map(m => (
                  <MilestoneChip key={m.id} milestone={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-2xl font-serif" style={{ color }}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function MilestoneChip({ milestone }) {
  const statusColors = {
    pending: '#888', in_progress: GOLD, completed: '#22c55e',
    waived: '#666', at_risk: '#ef4444', failed: '#ef4444',
  };
  const color = statusColors[milestone.status] || '#888';
  const days = milestone.days_until_due;
  const Icon = milestone.status === 'completed' ? CheckCircle2 : milestone.status === 'at_risk' || days < 0 ? AlertTriangle : Clock;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}40` }}>
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      <div>
        <p className="text-xs text-white">{milestone.milestone_name || milestone.milestone_type}</p>
        <p className="text-[10px] text-gray-500">
          {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          {days !== null && days !== undefined && milestone.status !== 'completed' && (
            <span style={{ color: days < 0 ? '#ef4444' : days <= 3 ? GOLD : '#666' }}>
              {' '}· {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}