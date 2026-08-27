import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, MapPin, ArrowRight, UserCheck, Phone, Mail } from 'lucide-react';
import LiveActionLedgerPlaceholder from '@/components/agentPortal/LiveActionLedgerPlaceholder';
import RelocationMilestoneRoadmap from '@/components/agentPortal/RelocationMilestoneRoadmap';
import { GOLD, STATUS_CONFIG, statusConfig } from '@/components/agentPortal/relocationProjectStatus';

/**
 * AgentWorkfile — the Client Workfile detail view for a single
 * RelocationProject: origin/destination dossier + assigned destination
 * agent on the left, the Live Action Ledger placeholder on the right.
 */
export default function AgentWorkfile() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['relocationProject', id],
    queryFn: () => base44.entities.RelocationProject.get(id),
  });

  const updateStatus = useMutation({
    mutationFn: (status) => base44.entities.RelocationProject.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['relocationProject', id] }),
  });

  if (isLoading) return <div className="min-h-screen p-10" style={{ background: '#0A0B0F', color: '#fff' }}>Loading workfile…</div>;
  if (!project) return <div className="min-h-screen p-10" style={{ background: '#0A0B0F', color: '#fff' }}>Client file not found.</div>;

  const cfg = statusConfig(project.status);

  return (
    <div className="min-h-screen" style={{ background: '#0A0B0F' }}>
      <div className="px-6 md:px-10 pt-10 pb-10 max-w-6xl mx-auto">
        <Link to="/agent-command-center" className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Command Center
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>CLIENT WORKFILE</p>
            <h1 className="text-2xl font-serif text-white">{project.clientName}</h1>
          </div>
          <select
            value={project.status}
            onChange={e => updateStatus.mutate(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-full outline-none"
            style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}55` }}
          >
            {Object.entries(STATUS_CONFIG).map(([key, c]) => (
              <option key={key} value={key} style={{ background: '#111', color: '#fff' }}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <RelocationMilestoneRoadmap status={project.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Dossier */}
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                <MapPin className="w-3.5 h-3.5" /> Origin → Destination
              </p>
              <p className="text-sm text-white mb-1"><span className="text-white/50">Origin listing:</span> {project.originAddress || '—'}</p>
              {project.originListingPrice && <p className="text-sm text-white mb-1"><span className="text-white/50">List price:</span> {project.originListingPrice}</p>}
              <div className="flex items-center gap-2 my-2 text-sm" style={{ color: GOLD }}>
                <ArrowRight className="w-4 h-4" /> {project.destinationMetro || 'Destination TBD'}
              </div>
              <p className="text-sm text-white mb-1"><span className="text-white/50">Destination criteria:</span> {project.destinationCriteria || '—'}</p>
              <p className="text-sm text-white"><span className="text-white/50">Target move date:</span> {project.targetMoveDate ? new Date(project.targetMoveDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</p>
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                <UserCheck className="w-3.5 h-3.5" /> Assigned Destination Agent
              </p>
              {project.destinationAgentName ? (
                <>
                  <p className="text-sm text-white font-semibold mb-1">{project.destinationAgentName}</p>
                  {project.destinationAgentPhone && <a href={`tel:${project.destinationAgentPhone}`} className="flex items-center gap-1.5 text-xs mb-1" style={{ color: GOLD }}><Phone className="w-3 h-3" /> {project.destinationAgentPhone}</a>}
                  {project.destinationAgentEmail && <a href={`mailto:${project.destinationAgentEmail}`} className="flex items-center gap-1.5 text-xs" style={{ color: GOLD }}><Mail className="w-3 h-3" /> {project.destinationAgentEmail}</a>}
                </>
              ) : (
                <p className="text-sm text-white/50">No destination agent assigned yet — Dyson National Vetting Desk is on it.</p>
              )}
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                <UserCheck className="w-3.5 h-3.5" /> Transaction Coordinator
              </p>
              {project.tcName ? (
                <>
                  <p className="text-sm text-white font-semibold mb-1">{project.tcName}</p>
                  {project.tcPhone && <a href={`tel:${project.tcPhone}`} className="flex items-center gap-1.5 text-xs mb-1" style={{ color: GOLD }}><Phone className="w-3 h-3" /> {project.tcPhone}</a>}
                  {project.tcEmail && <a href={`mailto:${project.tcEmail}`} className="flex items-center gap-1.5 text-xs" style={{ color: GOLD }}><Mail className="w-3 h-3" /> {project.tcEmail}</a>}
                </>
              ) : (
                <p className="text-sm text-white/50">No Transaction Coordinator assigned yet.</p>
              )}
            </div>

            {project.projectedReferralFee > 0 && (
              <div className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>Projected Referral Fee</p>
                <p className="text-xl font-black" style={{ color: GOLD }}>${Number(project.projectedReferralFee).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Right: Live Action Ledger */}
          <LiveActionLedgerPlaceholder />
        </div>
      </div>
    </div>
  );
}