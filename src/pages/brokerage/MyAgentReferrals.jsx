import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Handshake, Plus, ArrowDownToLine, ArrowUpFromLine, Loader2, X, DollarSign } from 'lucide-react';
import BrokerageCommPill from '@/components/brokerage/BrokerageCommPill';

const GOLD = '#D4AF37';

const STATUS_COLORS = {
  pending: '#888', sent: GOLD, accepted: '#38bdf8', in_progress: GOLD,
  closed: '#22c55e', rejected: '#ef4444', withdrawn: '#666',
};

const EMPTY_FORM = {
  referral_type: 'outgoing',
  agent_name: '',
  agent_email: '',
  destination_city: '',
  destination_state: '',
  client_name: '',
  status: 'pending',
  referral_fee_percent: 25,
};

export default function MyAgentReferrals() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;

  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['brokerageReferrals', userBrokerageId],
    queryFn: () => base44.entities.Referral.filter(
      userBrokerageId ? { brokerage_id: userBrokerageId } : {},
      '-created_date', 200
    ),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Referral.create({ ...data, brokerage_id: userBrokerageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brokerageReferrals'] });
      setShowForm(false);
      setForm(EMPTY_FORM);
    },
  });

  const incoming = referrals.filter(r => r.referral_type === 'incoming');
  const outgoing = referrals.filter(r => r.referral_type === 'outgoing');
  const closedCount = referrals.filter(r => r.status === 'closed').length;
  const feesOwed = referrals.filter(r => r.status === 'closed' && !r.fees_paid).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agent_name || !form.destination_city || !form.destination_state) return;
    createMutation.mutate(form);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>
            <Handshake className="w-6 h-6" style={{ color: GOLD }} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Broker/Agent Portal</p>
            <h1 className="text-3xl font-serif text-white">My Agent Referrals</h1>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold gold-btn"
        >
          <Plus className="w-4 h-4" /> Log Referral
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6 max-w-2xl">
        Track referral business flowing to and from your roster — incoming relocation clients matched to your agents, and outgoing referrals your agents send to destination agents nationally, with fees tracked on every file.
      </p>

      <BrokerageCommPill />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatBox label="Incoming" value={incoming.length} color="#38bdf8" />
        <StatBox label="Outgoing" value={outgoing.length} color="#a78bfa" />
        <StatBox label="Closed" value={closedCount} color="#22c55e" />
        <StatBox label="Fees Owed" value={feesOwed} color={feesOwed > 0 ? '#ef4444' : '#888'} />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
        </div>
      ) : referrals.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Handshake className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 text-sm mb-2">No referrals logged yet.</p>
          <p className="text-gray-600 text-xs">Click "Log Referral" above to track your first incoming or outgoing agent referral.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {referrals.map((r) => (
            <ReferralRow key={r.id} referral={r} />
          ))}
        </div>
      )}

      {/* Add Referral modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 relative" style={{ background: '#111', border: `1px solid ${GOLD}44` }}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-serif text-white mb-4">Log a Referral</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, referral_type: 'incoming' }))}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{ background: form.referral_type === 'incoming' ? 'rgba(56,189,248,0.15)' : 'transparent', border: `1px solid ${form.referral_type === 'incoming' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}`, color: form.referral_type === 'incoming' ? '#38bdf8' : '#888' }}>
                  <ArrowDownToLine className="w-3.5 h-3.5" /> Incoming
                </button>
                <button type="button" onClick={() => setForm(f => ({ ...f, referral_type: 'outgoing' }))}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{ background: form.referral_type === 'outgoing' ? 'rgba(167,139,250,0.15)' : 'transparent', border: `1px solid ${form.referral_type === 'outgoing' ? '#a78bfa' : 'rgba(255,255,255,0.15)'}`, color: form.referral_type === 'outgoing' ? '#a78bfa' : '#888' }}>
                  <ArrowUpFromLine className="w-3.5 h-3.5" /> Outgoing
                </button>
              </div>
              <Input placeholder="Agent name *" value={form.agent_name} onChange={v => setForm(f => ({ ...f, agent_name: v }))} />
              <Input placeholder="Agent email" value={form.agent_email} onChange={v => setForm(f => ({ ...f, agent_email: v }))} />
              <Input placeholder="Client name" value={form.client_name} onChange={v => setForm(f => ({ ...f, client_name: v }))} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Destination city *" value={form.destination_city} onChange={v => setForm(f => ({ ...f, destination_city: v }))} />
                <Input placeholder="State *" value={form.destination_state} onChange={v => setForm(f => ({ ...f, destination_state: v }))} />
              </div>
              <Input placeholder="Referral fee %" type="number" value={form.referral_fee_percent} onChange={v => setForm(f => ({ ...f, referral_fee_percent: Number(v) }))} />
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold gold-btn disabled:opacity-50"
              >
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Referral
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg text-sm bg-transparent text-white placeholder-gray-500"
      style={{ border: '1px solid rgba(255,255,255,0.15)' }}
    />
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

function ReferralRow({ referral: r }) {
  const DirIcon = r.referral_type === 'incoming' ? ArrowDownToLine : ArrowUpFromLine;
  const dirColor = r.referral_type === 'incoming' ? '#38bdf8' : '#a78bfa';
  const statusColor = STATUS_COLORS[r.status] || '#888';
  return (
    <div className="rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${dirColor}18`, border: `1px solid ${dirColor}44` }}>
          <DirIcon className="w-4 h-4" style={{ color: dirColor }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-white truncate">{r.agent_name}{r.client_name ? ` · ${r.client_name}` : ''}</p>
          <p className="text-[11px] text-gray-500">{r.destination_city}, {r.destination_state} · {r.referral_fee_percent || 25}% fee</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {r.fees_paid && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e' }}>
            <DollarSign className="w-3 h-3" /> Paid
          </span>
        )}
        <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider" style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}44`, color: statusColor }}>
          {r.status.replace(/_/g, ' ')}
        </span>
      </div>
    </div>
  );
}