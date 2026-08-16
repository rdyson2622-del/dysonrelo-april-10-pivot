import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Shield, Building2, Users, Megaphone, Star, ArrowRight,
  Database, Mail, Webhook, AlertTriangle, CheckCircle2, Loader2,
} from 'lucide-react';

const GOLD = '#D4AF37';

const SOURCES = [
  { id: 'boldtrail_api', label: 'BoldTrail API', icon: Database, desc: 'Direct Deals API pull', route: '/brokerage/escrow' },
  { id: 'gmail', label: 'Gmail Parsing', icon: Mail, desc: 'Parse transaction emails', route: '/brokerage/escrow' },
  { id: 'apination', label: 'API Nation Webhook', icon: Webhook, desc: 'Real-time push (passive)', route: '/brokerage/escrow' },
];

const SECTIONS = [
  { label: 'Escrow', icon: Shield, route: '/brokerage/escrow', desc: 'Transaction milestones & sync', color: GOLD },
  { label: 'Listings', icon: Building2, route: '/brokerage/listings', desc: 'Active & sold listings', color: '#38bdf8' },
  { label: 'Agents', icon: Users, route: '/brokerage/agents', desc: 'Agent roster & profiles', color: '#10b981' },
  { label: 'Marketing', icon: Megaphone, route: '/brokerage/marketing', desc: 'Campaigns & outreach', color: '#a78bfa' },
  { label: 'Luxury', icon: Star, route: '/brokerage/luxury', desc: 'Luxury presence tier', color: '#f59e0b' },
];

export default function BrokerageDashboard() {
  const navigate = useNavigate();
  const { data: brokerage } = useQuery({
    queryKey: ['myBrokerage'],
    queryFn: async () => {
      const list = await base44.entities.Brokerage.list();
      return list[0] || null;
    },
  });
  const { data: milestones = [] } = useQuery({
    queryKey: ['escrowMilestones'],
    queryFn: () => base44.entities.EscrowMilestone.list('-due_date', 200),
    refetchInterval: 30000,
  });

  const today = new Date();
  const atRisk = milestones.filter((m) => {
    if (m.status === 'completed' || m.status === 'waived' || !m.due_date) return false;
    const days = Math.ceil((new Date(m.due_date) - today) / (1000 * 60 * 60 * 24));
    return days <= 3;
  });
  const completed = milestones.filter((m) => m.status === 'completed').length;
  const escrowCount = new Set(milestones.map((m) => m.escrow_number).filter(Boolean)).size;

  return (
    <div className="p-6 md:p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>
          Broker/Agent Portal
        </p>
        <h1 className="text-3xl font-serif text-white">{brokerage?.name || '—'}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Subscriber #{brokerage?.id?.slice(-4) || '—'} · {brokerage?.plan_tier || '—'} tier · {brokerage?.status || '—'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatBox label="Active Escrows" value={escrowCount} color={GOLD} />
        <StatBox label="Total Milestones" value={milestones.length} color="#fff" />
        <StatBox label="At Risk (≤3 days)" value={atRisk.length} color="#ef4444" />
        <StatBox label="Completed" value={completed} color="#22c55e" />
      </div>

      {/* Connectivity — test all integrations here */}
      <div className="mb-8">
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Connectivity & Data Sources
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {SOURCES.map((src) => {
            const Icon = src.icon;
            return (
              <button
                key={src.id}
                onClick={() => navigate(src.route)}
                className="text-left rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                  <span className="text-sm font-serif text-white">{src.label}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{src.desc}</p>
                <p className="text-[10px] flex items-center gap-1" style={{ color: GOLD }}>
                  Test in Escrow <ArrowRight className="w-2.5 h-2.5" />
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* At-risk banner */}
      {atRisk.length > 0 && (
        <div
          className="rounded-xl p-4 mb-8 flex items-center gap-3 cursor-pointer"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}
          onClick={() => navigate('/brokerage/escrow')}
        >
          <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-sm text-white">
            <span className="font-bold">{atRisk.length}</span> milestone{atRisk.length !== 1 ? 's' : ''} due within 3 days or overdue — review in Escrow.
          </p>
        </div>
      )}

      {/* Portal sections */}
      <div>
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Portal Sections
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.label}
                onClick={() => navigate(sec.route)}
                className="text-left rounded-xl p-5 transition-all hover:scale-[1.02]"
                style={{ background: '#111', border: `1px solid ${sec.color}25` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${sec.color}15`, border: `1px solid ${sec.color}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: sec.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif text-white">{sec.label}</h3>
                    <p className="text-[10px] text-gray-500">{sec.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
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