import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, TrendingUp, Clock, Home } from 'lucide-react';
import RelocationProjectCard from '@/components/agentPortal/RelocationProjectCard';
import AddRelocationProjectModal from '@/components/agentPortal/AddRelocationProjectModal';
import { GOLD } from '@/components/agentPortal/relocationProjectStatus';

/**
 * AgentCommandCenter — the Relo Agent Portal's daily command center: KPI
 * banner + pipeline of active RelocationProject records for the logged-in
 * sending/relo agent.
 */
export default function AgentCommandCenter() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['relocationProjects'],
    queryFn: () => base44.entities.RelocationProject.list('-created_date', 200),
  });

  const active = projects.filter(p => p.status !== 'closed');
  const pendingEscrows = projects.filter(p => p.status === 'in_escrow');
  const projectedIncome = active.reduce((sum, p) => sum + (Number(p.projectedReferralFee) || 0), 0);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['relocationProjects'] });

  const KPI_CARDS = [
    { label: 'Active Relocations', value: active.length, icon: Home },
    { label: 'Pending Escrows', value: pendingEscrows.length, icon: Clock },
    { label: 'Projected Referral Income', value: `$${projectedIncome.toLocaleString()}`, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0A0B0F' }}>
      <div className="px-6 md:px-10 pt-10 pb-6 max-w-6xl mx-auto">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>RELO AGENT PORTAL</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <h1 className="text-2xl font-serif text-white">Agent Command Center</h1>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            <Plus className="w-4 h-4" /> Add New Relocation Client
          </button>
        </div>

        {/* KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {KPI_CARDS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-[10px] font-black tracking-[0.15em] uppercase text-white/60">{label}</p>
              </div>
              <p className="text-2xl font-black" style={{ color: GOLD }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        {isLoading ? (
          <p className="text-sm text-white/50">Loading pipeline…</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Home className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: GOLD }} />
            <p className="text-white font-bold mb-1">No relocation clients yet</p>
            <p className="text-sm text-white/50 mb-5">Add your first client to start tracking the pipeline.</p>
            <button onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 rounded-full font-black text-sm"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
              Add New Relocation Client →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <RelocationProjectCard key={p.id} project={p} onClick={() => navigate(`/agent-workfile/${p.id}`)} />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddRelocationProjectModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => { setShowAddModal(false); refresh(); }}
        />
      )}
    </div>
  );
}