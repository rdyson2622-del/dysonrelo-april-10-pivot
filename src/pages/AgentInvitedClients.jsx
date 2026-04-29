import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const TAN = '#ede0cc';

const PHASE_LABELS = {
  new_lead:           { label: 'Phase 1 — New Lead',         color: '#6b7280' },
  in_consultation:    { label: 'Phase 2 — In Consultation',  color: '#3b82f6' },
  actively_searching: { label: 'Phase 3 — Actively Searching', color: '#8b5cf6' },
  under_contract:     { label: 'Phase 4 — Under Contract',   color: '#f59e0b' },
  moved:              { label: 'Phase 5 — Moved',            color: '#10b981' },
  closed:             { label: 'Phase 6 — Closed',           color: '#059669' },
  inactive:           { label: 'Inactive',                   color: '#9ca3af' },
};

function PhaseTag({ status }) {
  const p = PHASE_LABELS[status] || { label: status, color: '#9ca3af' };
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }}>
      {p.label}
    </span>
  );
}

export default function AgentInvitedClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentEmail, setAgentEmail] = useState('');

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user?.email) return;
      setAgentEmail(user.email);
      base44.entities.RelocationClient.filter({ assigned_agent: user.email }, '-created_date', 50)
        .then(data => { setClients(data); setLoading(false); });
    });
  }, []);

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: TAN }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN AGENT PORTAL</p>
          <h1 className="font-black text-3xl mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
            My Invited Clients
          </h1>
          <p className="text-sm" style={{ color: '#6b5c45' }}>
            Every client you've referred into the Dyson ecosystem — with live phase tracking.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-4 border-yellow-300 border-t-yellow-600 rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.3)' }}>
            <p className="text-4xl mb-3">🤝</p>
            <p className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>No invited clients yet.</p>
            <p className="text-sm" style={{ color: '#6b5c45' }}>
              Clients you refer will appear here once assigned to your email:<br />
              <span className="font-black" style={{ color: GOLD }}>{agentEmail}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map(client => (
              <div key={client.id} className="rounded-2xl px-5 py-4" style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.3)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base truncate" style={{ color: '#1a1a1a' }}>{client.full_name}</p>
                    {client.current_city && client.destination_city && (
                      <p className="text-xs mt-0.5" style={{ color: '#6b5c45' }}>
                        {client.current_city} → {client.destination_city}
                      </p>
                    )}
                    {client.email && (
                      <p className="text-xs mt-0.5" style={{ color: '#9b8a70' }}>{client.email}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <PhaseTag status={client.status} />
                    {client.buyer_broker_signed && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' }}>
                        ✓ Broker Agreement Signed
                      </span>
                    )}
                  </div>
                </div>

                {/* Lender-solve status */}
                <div className="mt-3 pt-3 flex items-center gap-3 flex-wrap" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: client.assigned_agent ? GOLD : '#4b5563' }} />
                    <span className="text-[10px] font-semibold" style={{ color: client.assigned_agent ? GOLD : '#9ca3af' }}>
                      {client.agent_name ? `Agent: ${client.agent_name}` : 'Agent: Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: client.budget ? '#10b981' : '#4b5563' }} />
                    <span className="text-[10px] font-semibold" style={{ color: client.budget ? '#10b981' : '#9ca3af' }}>
                      {client.budget ? `Budget: ${client.budget.replace(/_/g, ' ')}` : 'Financing: Not Set'}
                    </span>
                  </div>
                  {client.target_close_of_escrow && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                      <span className="text-[10px] font-semibold" style={{ color: '#f59e0b' }}>
                        Target Close: {new Date(client.target_close_of_escrow).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-12" />
      </div>
    </div>
  );
}