import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Shield, Building2, Users, Megaphone, Star, ArrowRight,
  AlertTriangle, CheckCircle2, Clock, Database, Mail, Webhook,
  Loader2
} from 'lucide-react';

const GOLD = '#D4AF37';

const SECTIONS = [
  { id: 'escrow',    label: 'Escrow Management', icon: Shield,     path: '/brokerage/escrow',    desc: 'Track every transaction milestone', color: GOLD },
  { id: 'listings',  label: 'Listings',          icon: Building2,  path: '/brokerage/listings',  desc: 'Active and sold property inventory', color: '#38bdf8' },
  { id: 'agents',    label: 'Agent Records',     icon: Users,      path: '/brokerage/agents',    desc: 'Your agents and their performance',  color: '#10b981' },
  { id: 'marketing', label: 'Marketing',        icon: Megaphone,  path: '/brokerage/marketing', desc: 'Campaigns and lead generation',      color: '#a78bfa' },
  { id: 'luxury',    label: 'Luxury Presence',  icon: Star,       path: '/brokerage/luxury',    desc: 'Prestige portfolio and concierge',  color: '#f59e0b' },
];

const SYNC_SOURCES = [
  { id: 'boldtrail_api', label: 'BoldTrail API',  icon: Database, fn: 'boldtrailSyncEscrow', desc: 'Direct Deals API pull' },
  { id: 'gmail',         label: 'Gmail Parsing',  icon: Mail,     fn: 'gmailEscrowSync',     desc: 'Parse transaction emails' },
  { id: 'apination',     label: 'API Nation',     icon: Webhook,  fn: null,                   desc: 'Real-time webhook (passive)' },
];

export default function BrokerageDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;
  const { data: brokerage } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) {
        return await base44.entities.Brokerage.get(userBrokerageId);
      }
      return null;
    },
    enabled: !!user,
  });

  const { data: milestones = [], isLoading: milesLoading } = useQuery({
    queryKey: ['brokerageEscrowMilestones'],
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
    } catch (e) {
      setSyncResult({ source: sourceId, ok: false, error: e.message });
    }
    setSyncing(null);
  };

  const today = new Date();
  const atRisk = milestones.filter(m => {
    if (m.status === 'completed' || m.status === 'waived') return false;
    if (!m.due_date) return false;
    const days = Math.ceil((new Date(m.due_date) - today) / (1000 * 60 * 60 * 24));
    return days <= 3;
  });
  const completed = milestones.filter(m => m.status === 'completed').length;

  return (
    <div className="p-6 md:p-8">
      {/* ── Brokerage header ── */}
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          {brokerage?.plan_tier === 'founder' ? 'Founder Subscriber · Pilot Brokerage' : 'Brokerage Subscriber'}
        </p>
        <h1 className="text-4xl font-serif text-white mb-2">{brokerage?.name || '—'}</h1>
        <p className="text-sm text-gray-500">
          {brokerage?.status === 'active' ? 'Subscription active' : brokerage?.status || 'Loading…'}
          {brokerage?.subscribed_at && ` · Subscribed ${new Date(brokerage.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        </p>
      </div>

      {/* ── Escrow summary strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <SummaryStat label="Active Escrows" value={milesLoading ? '—' : new Set(milestones.map(m => m.escrow_number)).size} color={GOLD} icon={Shield} />
        <SummaryStat label="Total Milestones" value={milesLoading ? '—' : milestones.length} color="#fff" icon={Clock} />
        <SummaryStat label="At Risk (≤3d)" value={milesLoading ? '—' : atRisk.length} color="#ef4444" icon={AlertTriangle} />
        <SummaryStat label="Completed" value={milesLoading ? '—' : completed} color="#22c55e" icon={CheckCircle2} />
      </div>

      {/* ── Connectivity testing panel ── */}
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>
          Connectivity — Test Your Integrations
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {SYNC_SOURCES.map(src => {
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
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    {isSyncing ? 'Testing…' : 'Test Sync'}
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
      </div>

      {/* ── Section cards ── */}
      <div>
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>
          Your Portal Sections
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTIONS.map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => navigate(sec.path)}
                className="group rounded-xl p-5 text-left transition-all hover:scale-[1.02]"
                style={{ background: '#111', border: `1px solid ${sec.color}30` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${sec.color}15`, border: `1px solid ${sec.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: sec.color }} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-serif text-white mb-1">{sec.label}</h3>
                <p className="text-xs text-gray-500">{sec.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color, icon: Icon }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-2xl font-serif" style={{ color }}>{value}</p>
        <Icon className="w-4 h-4" style={{ color: `${color}80` }} />
      </div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}