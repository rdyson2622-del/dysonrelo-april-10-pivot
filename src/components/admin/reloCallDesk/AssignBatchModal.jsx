import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCheck, X, AlertCircle, CheckCircle2, Calendar, Layers, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const SEEDED_LISA_HURT = {
  id: '6aa4839c2132a56a0f71b39d',
  name: 'Lisa Hurt',
  email: 'lisa@lisahurt.com',
  brokerage: 'Dyson & Dyson Relocation Network',
  city: 'San Diego / Los Angeles',
  status: 'Relocation Agent'
};

export default function AssignBatchModal({ isOpen, onClose, onAssignSuccess, agents = [] }) {
  const today = new Date().toISOString().slice(0, 10);

  // Fetch recent LeadListBatch records
  const { data: batches = [], isLoading: isLoadingBatches, refetch: refetchBatches } = useQuery({
    queryKey: ['assignBatchModalBatches'],
    queryFn: async () => {
      return await base44.entities.LeadListBatch.list('-created_date', 50).catch(() => []);
    },
    enabled: isOpen,
  });

  // Fetch pending leads to display batch count
  const { data: allPendingLeads = [], refetch: refetchLeads } = useQuery({
    queryKey: ['assignBatchModalPendingLeads'],
    queryFn: async () => {
      return await base44.entities.PendingLead.list('-created_date', 200).catch(() => []);
    },
    enabled: isOpen,
  });

  // Sort batches: today first, then descending
  const sortedBatches = useMemo(() => {
    return [...batches].sort((a, b) => {
      const aIsToday = a.list_date === today || a.created_date?.startsWith(today);
      const bIsToday = b.list_date === today || b.created_date?.startsWith(today);
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;
      return new Date(b.created_date || b.list_date || 0) - new Date(a.created_date || a.list_date || 0);
    });
  }, [batches, today]);

  // Selected state
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedAgentEmail, setSelectedAgentEmail] = useState('lisa@lisahurt.com');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignedBanner, setAssignedBanner] = useState(null);

  // Pre-select first batch (today first) when loaded
  useEffect(() => {
    if (sortedBatches.length > 0 && !selectedBatchId) {
      setSelectedBatchId(sortedBatches[0].id);
    }
  }, [sortedBatches, selectedBatchId]);

  // Seeded agents list ensuring Lisa Hurt is present and primary
  const availableAgents = useMemo(() => {
    const list = [...agents];
    const hasLisa = list.some(a => a.email?.toLowerCase() === 'lisa@lisahurt.com');
    if (!hasLisa) {
      list.unshift(SEEDED_LISA_HURT);
    }
    return list;
  }, [agents]);

  if (!isOpen) return null;

  const currentBatch = sortedBatches.find(b => b.id === selectedBatchId) || sortedBatches[0] || null;
  const currentAgent = availableAgents.find(a => a.email === selectedAgentEmail) || availableAgents[0] || SEEDED_LISA_HURT;

  // Compute how many leads belong to this batch
  const batchLeads = allPendingLeads.filter(l => l.batch_id === currentBatch?.id);
  const unassignedLeads = allPendingLeads.filter(l => !l.assigned_agent && !l.assigned_relocation_agent);
  const effectiveLeadsCount = batchLeads.length > 0 ? batchLeads.length : unassignedLeads.length;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!currentBatch) {
      setError('Please select a LeadListBatch to assign.');
      return;
    }
    if (!currentAgent) {
      setError('Please select a RelocationAgent.');
      return;
    }

    setLoading(true);
    setError(null);
    setAssignedBanner(null);

    try {
      // 1. Determine leads to assign
      let leadsToUpdate = allPendingLeads.filter(l => l.batch_id === currentBatch.id);
      
      // If batch has no explicitly linked leads yet, assign all unassigned leads to this batch
      if (leadsToUpdate.length === 0) {
        leadsToUpdate = allPendingLeads.filter(l => !l.assigned_agent && !l.assigned_relocation_agent);
      }

      // If still none, check all leads matching batch market or take the latest batch's leads
      if (leadsToUpdate.length === 0 && allPendingLeads.length > 0) {
        leadsToUpdate = allPendingLeads.slice(0, 10);
      }

      // 2. Set batch.assigned_agent and batch.assigned_relocation_agent
      await base44.entities.LeadListBatch.update(currentBatch.id, {
        assigned_agent: currentAgent.name,
        assigned_relocation_agent: currentAgent.id || SEEDED_LISA_HURT.id,
      });

      // 3. Set every PendingLead.assigned_agent and PendingLead.assigned_email to Lisa
      if (leadsToUpdate.length > 0) {
        await base44.entities.PendingLead.bulkUpdate(
          leadsToUpdate.map(lead => ({
            id: lead.id,
            assigned_agent: currentAgent.name,
            assigned_email: currentAgent.email,
            assigned_relocation_agent: currentAgent.id || SEEDED_LISA_HURT.id,
            batch_id: currentBatch.id,
          }))
        );
      }

      const count = leadsToUpdate.length;
      const bannerText = `Assigned ${count} leads to ${currentAgent.name}.`;
      setAssignedBanner(bannerText);

      await refetchBatches();
      await refetchLeads();

      if (onAssignSuccess) {
        onAssignSuccess({
          agentName: currentAgent.name,
          count,
          batch: currentBatch,
          bannerText,
        });
      }
    } catch (err) {
      console.error('Failed to assign batch:', err);
      setError(err.message || 'Failed to assign batch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-5 sm:p-6 shadow-2xl text-left space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                STAGE 4 BATCH ASSIGNMENT
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Assign Lead List Batch to Agent
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROMINENT ASSIGNED BANNER */}
        {assignedBanner && (
          <div className="p-4 rounded-2xl bg-[#10b981]/15 border-2 border-[#10b981] text-emerald-300 font-black text-sm flex items-center gap-3 animate-in zoom-in-95 duration-200 shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
            <span>{assignedBanner}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-4 text-xs">
          
          {/* 1. RECENT LEADLISTBATCH DROPDOWN (TODAY FIRST) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Recent Lead List Batch (Today First) *</span>
              </label>
              <span className="text-[10px] text-white/50">
                {sortedBatches.length} batch{sortedBatches.length === 1 ? '' : 'es'} available
              </span>
            </div>

            {isLoadingBatches ? (
              <div className="p-3 rounded-xl bg-black border border-white/20 text-white/50 text-xs">
                Loading recent batches...
              </div>
            ) : sortedBatches.length === 0 ? (
              <div className="p-3 rounded-xl bg-black border border-white/20 text-amber-400 text-xs">
                No batches found. Please import a batch first via "Import Today's List".
              </div>
            ) : (
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/20 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
                required
              >
                {sortedBatches.map(batch => {
                  const isToday = batch.list_date === today || batch.created_date?.startsWith(today);
                  return (
                    <option key={batch.id} value={batch.id}>
                      {isToday ? '🌟 [TODAY] ' : '📅 '}
                      {batch.label} — {batch.market} ({batch.list_date || 'No Date'})
                      {batch.assigned_agent ? ` [Assigned: ${batch.assigned_agent}]` : ' [Unassigned]'}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* BATCH DETAIL CARD */}
          {currentBatch && (
            <div className="p-3.5 rounded-2xl bg-[#14120b] border border-[#D4AF37]/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                  Selected Batch Details
                </span>
                {currentBatch.list_date === today && (
                  <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-[9.5px] font-bold">
                    Today's Batch
                  </span>
                )}
              </div>

              <div className="font-bold text-white text-sm">
                {currentBatch.label}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-white/70">
                <div>
                  <span className="text-white/40 block text-[9.5px] uppercase font-bold">Market</span>
                  <strong className="text-white">{currentBatch.market}</strong>
                </div>
                <div>
                  <span className="text-white/40 block text-[9.5px] uppercase font-bold">Min Price</span>
                  <strong className="text-white">${Number(currentBatch.min_price || 2000000).toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-white/40 block text-[9.5px] uppercase font-bold">Window</span>
                  <strong className="text-white">{currentBatch.pending_window_days || 2} days</strong>
                </div>
                <div>
                  <span className="text-white/40 block text-[9.5px] uppercase font-bold">Leads in Queue</span>
                  <strong className="text-emerald-400">{effectiveLeadsCount} Leads</strong>
                </div>
              </div>

              {currentBatch.assigned_agent && (
                <div className="text-[11px] text-white/50 pt-1 border-t border-white/10 flex items-center justify-between">
                  <span>Currently Assigned To:</span>
                  <span className="font-bold text-[#D4AF37]">{currentBatch.assigned_agent}</span>
                </div>
              )}
            </div>
          )}

          {/* 2. RELOCATIONAGENT DROPDOWN WITH SEEDED LISA HURT */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Relocation Agent (Seeded Lisa Hurt) *</span>
              </label>
              <span className="text-[10px] text-[#10b981] font-bold">
                ✓ Primary Affiliate
              </span>
            </div>

            <select
              value={selectedAgentEmail}
              onChange={e => setSelectedAgentEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/20 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
              required
            >
              {availableAgents.map(agent => (
                <option key={agent.id || agent.email} value={agent.email}>
                  {agent.name} ({agent.email}) {agent.email === 'lisa@lisahurt.com' ? '• [Primary Relocation Agent]' : ''}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-white/40 mt-1 block">
              Directly routes lead call queue and telemetry to Lisa Hurt's working board.
            </span>
          </div>

          {/* ASSIGNMENT TELEMETRY SUMMARY */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-xs space-y-1">
            <div className="flex justify-between items-center text-white/80 font-medium">
              <span>Target Leads to Allocate:</span>
              <span className="font-bold text-white">{effectiveLeadsCount} Leads</span>
            </div>
            <div className="flex justify-between items-center text-white/60 text-[11px]">
              <span>Will set <code className="text-[#D4AF37]">batch.assigned_agent</code>:</span>
              <span className="text-white font-semibold">{currentAgent?.name}</span>
            </div>
            <div className="flex justify-between items-center text-white/60 text-[11px]">
              <span>Will set <code className="text-[#D4AF37]">PendingLead.assigned_agent</code>:</span>
              <span className="text-white font-semibold">{currentAgent?.name}</span>
            </div>
            <div className="flex justify-between items-center text-white/60 text-[11px]">
              <span>Will set <code className="text-[#D4AF37]">PendingLead.assigned_email</code>:</span>
              <span className="text-white font-semibold font-mono">{currentAgent?.email}</span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !currentBatch}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50 shadow-md transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Assigning Leads...</span>
              ) : (
                <span>Assign Leads to {currentAgent?.name || 'Lisa Hurt'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}