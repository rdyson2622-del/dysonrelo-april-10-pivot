import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const STATUS_STYLE = {
  proposal_sent: { label: 'Proposal Sent', color: '#F59E0B' },
  agreed: { label: 'Agreed', color: '#3B82F6' },
  in_process: { label: 'In Process', color: '#A78BFA' },
  closed: { label: 'Closed', color: '#22C55E' },
  rejected: { label: 'Rejected', color: '#EF4444' },
};

export default function AdminReferrals() {
  const [statusFilter, setStatusFilter] = useState('open');

  const { data: referrals = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-referrals-live'],
    queryFn: () => base44.entities.AgentReferral.list('-created_date', 500),
    refetchInterval: 30000,
  });

  const openStatuses = new Set(['proposal_sent', 'agreed', 'in_process']);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return referrals;
    if (statusFilter === 'open') return referrals.filter((r) => openStatuses.has(r.referral_status));
    return referrals.filter((r) => r.referral_status === statusFilter);
  }, [referrals, statusFilter]);

  const counts = useMemo(() => {
    const base = { open: 0, all: referrals.length };
    Object.keys(STATUS_STYLE).forEach((k) => { base[k] = 0; });
    referrals.forEach((r) => {
      const status = r.referral_status || 'proposal_sent';
      base[status] = (base[status] || 0) + 1;
      if (openStatuses.has(status)) base.open += 1;
    });
    return base;
  }, [referrals]);

  const estimatedFees = filtered.reduce(
    (sum, r) => sum + (Number(r.estimated_referral_fee) || 0) + (Number(r.estimated_mgmt_fee) || 0),
    0
  );

  return (
    <div className="min-h-screen p-6 pb-16" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold mb-3"
              style={{ color: GOLD }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin
            </Link>
            <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>
              REFERRAL OVERSIGHT
            </p>
            <h1 className="text-2xl font-bold text-white mb-1">Agent Referrals</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Live AgentReferral pipeline — proposal through close. Estimated fees for the current filter: ${estimatedFees.toLocaleString()}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.35)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'open', label: `Open (${counts.open})` },
            { id: 'all', label: `All (${counts.all})` },
            ...Object.entries(STATUS_STYLE).map(([id, cfg]) => ({
              id,
              label: `${cfg.label} (${counts[id] || 0})`,
            })),
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
              style={{
                background: statusFilter === tab.id ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                color: statusFilter === tab.id ? GOLD : 'rgba(255,255,255,0.65)',
                border: `1px solid ${statusFilter === tab.id ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="rounded-2xl p-8" style={{ background: '#000', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Loading referrals…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-8" style={{ background: '#000', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-sm font-semibold text-white">No referrals in this view</p>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              New referrals appear here as AgentReferral records are created from outreach and PRN flows.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const style = STATUS_STYLE[r.referral_status] || STATUS_STYLE.proposal_sent;
              const fee = (Number(r.estimated_referral_fee) || 0) + (Number(r.estimated_mgmt_fee) || 0);
              return (
                <div
                  key={r.id}
                  className="rounded-2xl p-4"
                  style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">{r.list_agent_name || 'Unnamed listing agent'}</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {[r.broker_name, r.list_agent_email, r.list_agent_phone].filter(Boolean).join(' · ') || 'No contact details'}
                      </p>
                      {r.receiving_broker && (
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          Receiving: {r.receiving_broker}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className="inline-flex text-[10px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                        style={{ background: `${style.color}22`, color: style.color, border: `1px solid ${style.color}44` }}
                      >
                        {style.label}
                      </span>
                      {fee > 0 && (
                        <p className="text-sm font-bold mt-2" style={{ color: GOLD }}>
                          ${fee.toLocaleString()} est.
                        </p>
                      )}
                    </div>
                  </div>
                  {(r.commission_notes || r.close_date) && (
                    <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {[r.close_date && `Close ${r.close_date}`, r.commission_notes].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
