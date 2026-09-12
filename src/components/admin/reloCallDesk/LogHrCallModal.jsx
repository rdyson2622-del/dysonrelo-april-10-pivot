import React, { useState } from 'react';
import { Building2, X, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function LogHrCallModal({ isOpen, onClose, onSaveSuccess, callerName = 'Lisa Hurt' }) {
  const [form, setForm] = useState({
    company: '',
    contact_name: '',
    title: 'Director of Human Resources',
    phone: '',
    outcome: 'connected',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) {
      setError('Company name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const record = await base44.entities.HrProspectCall.create({
        company: form.company.trim(),
        contact_name: form.contact_name.trim() || undefined,
        title: form.title.trim() || undefined,
        phone: form.phone.trim() || undefined,
        outcome: form.outcome,
        notes: form.notes.trim() || undefined,
        called_by: callerName,
        called_at: new Date().toISOString(),
      });

      onSaveSuccess(record);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to log HR call');
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                STAGE 3 CORPORATE CALL DESK
              </span>
              <h3 className="text-lg font-bold text-white">
                Log HR Prospect Call (HrProspectCall)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Qualcomm, Illumina, Apple"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                HR Contact Name
              </label>
              <input
                type="text"
                value={form.contact_name}
                onChange={e => setForm({ ...form, contact_name: e.target.value })}
                placeholder="e.g. Jennifer Walsh"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Title / Position
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. VP People & Culture"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Direct Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. (858) 555-0199"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              Call Result / Outcome
            </label>
            <select
              value={form.outcome}
              onChange={e => setForm({ ...form, outcome: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="connected">Connected • Spoke with Decision Maker</option>
              <option value="interested_reviewing">Interested • Reviewing Corporate Relo Suite</option>
              <option value="scheduled_demo">Scheduled Executive Concierge Demo</option>
              <option value="voicemail">Left Voicemail</option>
              <option value="gatekeeper_screened">Gatekeeper Screened</option>
              <option value="not_relocating">No Active Transfers Currently</option>
              <option value="in_house_provider">Already Contracted with National Van Line</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
              Discussion Notes &amp; Transfer Context
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Incoming talent count, executive move requirements, timeline..."
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
            />
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
              {loading ? 'Saving...' : 'Record HR Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}