import React, { useState } from 'react';
import { PhoneCall, X, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function OutcomeModal({ isOpen, onClose, lead, onSaveSuccess, callerName = 'Admin / Relocation Desk' }) {
  const [outcomeForm, setOutcomeForm] = useState({
    outcome: 'connected',
    notes: '',
    follow_up_date: '',
    open_referral: false,
    update_status: 'called',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const outcome = await base44.entities.CallOutcome.create({
        pending_lead: lead.id,
        called_by: callerName,
        called_at: new Date().toISOString(),
        outcome: outcomeForm.outcome,
        notes: outcomeForm.notes.trim() || undefined,
        follow_up_date: outcomeForm.follow_up_date || undefined,
        open_referral: outcomeForm.open_referral,
      });

      if (outcomeForm.update_status) {
        await base44.entities.PendingLead.update(lead.id, {
          status: outcomeForm.update_status,
        });
      }

      onSaveSuccess(outcome);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save outcome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-6 shadow-2xl text-left space-y-4">
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              Record Call Outcome (CallOutcome)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {lead.address}
            </h3>
            <p className="text-xs text-white/60">
              {lead.city} • {lead.listing_agent_name || 'Listing Agent'} ({lead.listing_office || 'Brokerage'})
            </p>
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
              Call Outcome *
            </label>
            <select
              value={outcomeForm.outcome}
              onChange={e => setOutcomeForm({ ...outcomeForm, outcome: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="connected">Connected / Spoke with Listing Agent</option>
              <option value="voicemail">Left Voicemail</option>
              <option value="callback">Scheduled Callback</option>
              <option value="no_answer">No Answer</option>
              <option value="wrong_number">Wrong Number</option>
              <option value="do_not_call">Do Not Call</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              Lead Status Update
            </label>
            <select
              value={outcomeForm.update_status}
              onChange={e => setOutcomeForm({ ...outcomeForm, update_status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="called">Called</option>
              <option value="yes_moving">Yes - Confirmed Moving / Relocating</option>
              <option value="callback">Callback Scheduled</option>
              <option value="no">Not Relocating / Closed</option>
              <option value="wrong_number">Wrong Number</option>
              <option value="do_not_call">Do Not Call</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              Call Discussion Notes
            </label>
            <textarea
              rows={3}
              value={outcomeForm.notes}
              onChange={e => setOutcomeForm({ ...outcomeForm, notes: e.target.value })}
              placeholder="Relocation destination, moving timeframe, client situation..."
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Follow-Up Date
              </label>
              <input
                type="date"
                value={outcomeForm.follow_up_date}
                onChange={e => setOutcomeForm({ ...outcomeForm, follow_up_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="modal_open_referral_check"
                checked={outcomeForm.open_referral}
                onChange={e => setOutcomeForm({ ...outcomeForm, open_referral: e.target.checked })}
                className="w-4 h-4 accent-[#D4AF37]"
              />
              <label htmlFor="modal_open_referral_check" className="text-white font-semibold cursor-pointer">
                Open Referral Opportunity
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
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
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Call Outcome'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}