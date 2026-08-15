import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const EMPTY = {
  agent_name: '', list_name: '', email: '', phone: '',
  dre_license_number: '', dre_license_state: 'CA',
  license_type: '', license_status: '', license_expiration_date: '',
  city: '', state: '', zip_code: '', county_name: '',
  agent_communications: '', ic_agreement_signed: '', status: 'pending',
};

export default function ReferralAgentModal({ agent, defaultListName, onClose, onSaved }) {
  const isEdit = !!agent;
  const [form, setForm] = useState({ ...EMPTY, list_name: defaultListName || '', ...agent });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await base44.entities.ReferralAgentList.update(agent.id, form);
      } else {
        await base44.entities.ReferralAgentList.create(form);
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key] || ''}
        onChange={e => set(key, e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)', color: '#fff' }} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}
        style={{ background: '#0a0a0a', border: `2px solid ${GOLD}`, maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="px-6 py-4 flex items-center justify-between sticky top-0" style={{ background: '#0d0d0d', borderBottom: `1px solid rgba(212,175,55,0.3)` }}>
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>REFERRAL AGENT LIST</p>
            <p className="text-white font-bold text-sm mt-0.5">{isEdit ? 'Edit Agent' : 'Add Agent Manually'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">{field('Agent Name *', 'agent_name', 'text', 'Jane Smith')}</div>
            <div className="col-span-2">{field('List Name *', 'list_name', 'text', 'e.g. DD Master Roster')}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Email', 'email', 'email', 'agent@email.com')}
            {field('Phone', 'phone', 'tel', '(555) 000-0000')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('DRE License #', 'dre_license_number', 'text', '01234567')}
            {field('License State', 'dre_license_state', 'text', 'CA')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('License Type', 'license_type', 'text', 'Salesperson')}
            {field('License Status', 'license_status', 'text', 'Licensed')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('License Expiration', 'license_expiration_date', 'text', '2027-01-01')}
            {field('County', 'county_name', 'text', 'San Diego')}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {field('City', 'city', 'text', 'San Diego')}
            {field('State', 'state', 'text', 'CA')}
            {field('ZIP', 'zip_code', 'text', '92101')}
          </div>
          <div>
            <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)', color: '#fff' }}>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Communications Notes</label>
            <textarea rows={2} value={form.agent_communications || ''} onChange={e => set('agent_communications', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)', color: '#fff' }} />
          </div>
          <button type="submit" disabled={!form.agent_name || !form.list_name || saving}
            className="w-full py-3 rounded-full font-black text-sm tracking-wide transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            {saving ? 'Saving…' : (isEdit ? 'Save Changes →' : 'Add Agent →')}
          </button>
        </form>
      </div>
    </div>
  );
}