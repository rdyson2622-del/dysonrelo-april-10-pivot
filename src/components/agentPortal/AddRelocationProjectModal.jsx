import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { GOLD } from './relocationProjectStatus';

const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' };

export default function AddRelocationProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    clientName: '', originAddress: '', destinationMetro: '', targetMoveDate: '', projectedReferralFee: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const user = await base44.auth.me();
    await base44.entities.RelocationProject.create({
      clientName: form.clientName,
      originAddress: form.originAddress,
      destinationMetro: form.destinationMetro,
      targetMoveDate: form.targetMoveDate || undefined,
      projectedReferralFee: form.projectedReferralFee ? Number(form.projectedReferralFee) : undefined,
      sendingAgentId: user.id,
    });
    setSaving(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-lg text-white">Add New Relocation Client</p>
          <button onClick={onClose}><X className="w-5 h-5 text-white/60" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Client name" value={form.clientName} onChange={e => set('clientName', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input placeholder="Origin listing address" value={form.originAddress} onChange={e => set('originAddress', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input placeholder="Destination metro / city" value={form.destinationMetro} onChange={e => set('destinationMetro', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.targetMoveDate} onChange={e => set('targetMoveDate', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            <input type="number" placeholder="Projected fee $" value={form.projectedReferralFee} onChange={e => set('projectedReferralFee', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-full font-black text-sm mt-2 disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            {saving ? 'Adding…' : 'Add Client'}
          </button>
        </form>
      </div>
    </div>
  );
}