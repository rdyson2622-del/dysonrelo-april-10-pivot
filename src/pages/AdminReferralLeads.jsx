import React, { useEffect, useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { UserPlus, CheckCircle, XCircle, Clock, TrendingUp, Users } from 'lucide-react';

const GOLD = '#D4AF37';

const STATUS_STYLE = {
  new: { label: 'New', color: '#D4AF37', bg: 'rgba(212,175,55,0.12)' },
  accepted: { label: 'Accepted', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  declined: { label: 'Declined', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export default function AdminReferralLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => base44.entities.ReferralLead.list('-created_date', 200).then(setLeads).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'new').length;
    const accepted = leads.filter(l => l.status === 'accepted').length;
    const declined = leads.filter(l => l.status === 'declined').length;
    const conversionRate = total ? Math.round((accepted / total) * 100) : 0;

    const byReferrer = {};
    leads.forEach(l => {
      const key = l.referrer_email || l.referrer_name || 'Anonymous';
      if (!byReferrer[key]) byReferrer[key] = { name: l.referrer_name || 'Anonymous', email: l.referrer_email || '', count: 0 };
      byReferrer[key].count += 1;
    });
    const topReferrers = Object.values(byReferrer).sort((a, b) => b.count - a.count).slice(0, 5);

    return { total, newCount, accepted, declined, conversionRate, topReferrers };
  }, [leads]);

  const updateStatus = async (lead, status) => {
    setBusyId(lead.id);
    const me = await base44.auth.me().catch(() => null);
    await base44.entities.ReferralLead.update(lead.id, {
      status,
      accepted_at: status === 'accepted' ? new Date().toISOString() : lead.accepted_at,
      accepted_by: status === 'accepted' ? (me?.email || 'admin') : lead.accepted_by,
    });
    await load();
    setBusyId(null);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading referral leads…</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-6 h-6" style={{ color: GOLD }} />
        <h1 className="text-2xl font-black text-white">Referral Leads</h1>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <StatCard label="Total Referrals" value={stats.total} icon={Users} />
        <StatCard label="New" value={stats.newCount} icon={Clock} color="#D4AF37" />
        <StatCard label="Accepted" value={stats.accepted} icon={CheckCircle} color="#22c55e" />
        <StatCard label="Declined" value={stats.declined} icon={XCircle} color="#ef4444" />
        <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} icon={TrendingUp} />
      </div>

      {/* Top Referrers */}
      {stats.topReferrers.length > 0 && (
        <div className="mb-8 rounded-xl p-5" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>Top Referrers</p>
          <div className="space-y-2">
            {stats.topReferrers.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-white">{r.name} {r.email && <span className="text-white/40">({r.email})</span>}</span>
                <span className="font-black" style={{ color: GOLD }}>{r.count} referral{r.count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead List */}
      <div className="space-y-3">
        {leads.length === 0 && <p className="text-white/50">No referral leads yet.</p>}
        {leads.map(lead => {
          const st = STATUS_STYLE[lead.status] || STATUS_STYLE.new;
          return (
            <div key={lead.id} className="rounded-xl p-5" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-white">{lead.referred_name}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide" style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-white/60">{lead.referred_email}{lead.referred_phone ? ` · ${lead.referred_phone}` : ''}</p>
                  {(lead.destination_city || lead.destination_state) && (
                    <p className="text-sm text-white/60">Destination: {[lead.destination_city, lead.destination_state].filter(Boolean).join(', ')}</p>
                  )}
                  <p className="text-sm mt-2" style={{ color: GOLD }}>
                    Referred by: {lead.referrer_name || 'Anonymous'}{lead.referrer_email ? ` (${lead.referrer_email})` : ''}
                  </p>
                  {lead.notes && <p className="text-xs text-white/40 mt-1 italic">"{lead.notes}"</p>}
                  {lead.status === 'accepted' && lead.accepted_by && (
                    <p className="text-xs text-white/40 mt-2">Accepted by {lead.accepted_by} on {new Date(lead.accepted_at).toLocaleDateString()}</p>
                  )}
                </div>
                {lead.status === 'new' && (
                  <div className="flex gap-2 shrink-0">
                    <button disabled={busyId === lead.id} onClick={() => updateStatus(lead, 'accepted')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black disabled:opacity-40"
                      style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.4)' }}>
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button disabled={busyId === lead.id} onClick={() => updateStatus(lead, 'declined')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black disabled:opacity-40"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}>
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = GOLD }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
      <Icon className="w-4 h-4 mb-2" style={{ color }} />
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
    </div>
  );
}