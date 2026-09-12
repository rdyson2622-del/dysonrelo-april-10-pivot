import React, { useState } from 'react';
import { UserCheck, X, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AssignBatchModal({ isOpen, onClose, onAssignSuccess, agents = [] }) {
  const [batchLabel, setBatchLabel] = useState(`$2M+ California Relocation Batch - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
  const [selectedAgentId, setSelectedAgentId] = useState(() => {
    const lisa = agents.find(a => a.email === 'lisa@lisahurt.com');
    return lisa?.id || (agents[0]?.id || '');
  });
  const [market, setMarket] = useState('SD, LA, SF_Bay');
  const [minPrice, setMinPrice] = useState(2000000);
  const [pendingWindowDays, setPendingWindowDays] = useState(7);
  const [assignUnassignedLeads, setAssignUnassignedLeads] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgentId) {
      setError('Please select a relocation agent.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Create LeadListBatch
      const batch = await base44.entities.LeadListBatch.create({
        label: batchLabel,
        market,
        min_price: Number(minPrice) || 2000000,
        pending_window_days: Number(pendingWindowDays) || 7,
        list_date: new Date().toISOString().slice(0, 10),
        assigned_relocation_agent: selectedAgentId,
        created_by: 'Admin',
        notes: `Allocated to relocation agent ${agents.find(a => a.id === selectedAgentId)?.name || 'Lisa Hurt'}`
      });

      // 2. If assignUnassignedLeads is checked, update unassigned PendingLead records
      let updatedCount = 0;
      if (assignUnassignedLeads) {
        const unassigned = await base44.entities.PendingLead.list('-created_date', 100);
        const toUpdate = unassigned.filter(l => !l.assigned_relocation_agent);
        if (toUpdate.length > 0) {
          await base44.entities.PendingLead.bulkUpdate(
            toUpdate.map(l => ({ id: l.id, assigned_relocation_agent: selectedAgentId }))
          );
          updatedCount = toUpdate.length;
        }
      }

      onAssignSuccess({ batch, updatedCount });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create batch and assign leads');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-6 shadow-2xl text-left space-y-4">
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                STAGE 3 BATCH ASSIGNMENT
              </span>
              <h3 className="text-lg font-bold text-white">
                Assign Batch to Relocation Agent
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              Select Relocation Agent
            </label>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email}) {a.email === 'lisa@lisahurt.com' ? '• Primary Assigned' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              Batch Label / Description
            </label>
            <input
              type="text"
              value={batchLabel}
              onChange={e => setBatchLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Target Market(s)
              </label>
              <input
                type="text"
                value={market}
                onChange={e => setMarket(e.target.value)}
                placeholder="e.g. SD, LA, SF_Bay"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Min Price Threshold ($)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                step={100000}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="assignUnassignedCheck"
                checked={assignUnassignedLeads}
                onChange={e => setAssignUnassignedLeads(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37]"
              />
              <label htmlFor="assignUnassignedCheck" className="text-white font-semibold cursor-pointer">
                Allocate all currently unassigned pending leads to this agent
              </label>
            </div>
            <p className="text-[10px] text-white/50 pl-6">
              Ensures Lisa Hurt sees these leads immediately on her Relocation Agent Desk board.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Create & Assign Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}