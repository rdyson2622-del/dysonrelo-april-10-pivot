import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Check, X, Trash2, Handshake, ExternalLink, Upload, Phone, MessageSquare, Mail, Video } from 'lucide-react';

const GOLD = '#D4AF37';
const BLANK = {
  name: '', preferred_name: '', portal_slug: '', photo_url: '', brokerage: 'The Dyson & Dyson Companies, Inc', city: '',
  phone: '', email: '', dre_license_number: '', license_exp_date: '',
  status: 'Referral Agent Subscriber', notes: '', joined_at: '',
};

function AgentForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((f) => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  return (
    <tr style={{ background: 'rgba(212,175,55,0.06)' }}>
      <td className="px-3 py-2">
        <div className="flex flex-col gap-1 items-start">
          {form.photo_url && <img src={form.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />}
          <label className="flex items-center gap-1 text-[10px] cursor-pointer" style={{ color: GOLD }}>
            <Upload className="w-3 h-3" /> {uploading ? 'Uploading…' : 'Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>
      </td>
      {['name', 'preferred_name', 'portal_slug', 'brokerage', 'phone', 'email', 'dre_license_number'].map((field) => (
        <td key={field} className="px-3 py-2">
          <input
            value={form[field] || ''}
            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            className="w-full text-xs px-2 py-1 rounded-lg outline-none"
            style={{ background: '#fff8ee', border: `1px solid ${GOLD}`, color: '#1a1a1a' }}
          />
        </td>
      ))}
      <td className="px-3 py-2">
        <input
          type="date"
          value={form.license_exp_date || ''}
          onChange={(e) => setForm((f) => ({ ...f, license_exp_date: e.target.value }))}
          className="text-xs px-2 py-1 rounded-lg outline-none"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}`, color: '#1a1a1a' }}
        />
      </td>
      <td className="px-3 py-2">
        <textarea
          value={form.notes || ''}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full text-xs px-2 py-1 rounded-lg outline-none resize-none"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}`, color: '#1a1a1a' }}
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-1">
          <button onClick={() => onSave(form)}><Check className="w-4 h-4 text-green-600" /></button>
          <button onClick={onCancel}><X className="w-4 h-4 text-red-500" /></button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminReferralAgents() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['referralAgents'],
    queryFn: () => base44.entities.ReferralAgent.list('-joined_at', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ReferralAgent.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['referralAgents'] }); setAdding(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ReferralAgent.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['referralAgents'] }); setEditingId(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ReferralAgent.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['referralAgents'] }),
  });

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN ADMIN</p>
            <h1 className="font-black text-2xl flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
              <Handshake className="w-6 h-6" style={{ color: GOLD }} /> Referral Agents (Refer-Only)
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b5c45' }}>
              {agents.length} referral-only affiliates — they don't list or sell, they only refer buyers/sellers to our full-time affiliate agents for a referral fee. Click "Portal" to preview each agent's individual page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin/referral-agent-explainer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
              <Video className="w-4 h-4" style={{ color: GOLD }} /> Edit Explainer
            </a>
            <button onClick={() => setAdding(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
              <Plus className="w-4 h-4" /> Add Referral Agent
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
          <div style={{ background: '#fff8ee', overflowX: 'auto' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Photo', 'Name', 'Preferred', 'Portal Slug', 'Brokerage', 'Phone', 'Email', 'DRE #', 'License Exp', 'Notes', ''].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-black tracking-wide" style={{ color: GOLD, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adding && (
                  <AgentForm initial={BLANK} onCancel={() => setAdding(false)} onSave={(data) => createMutation.mutate(data)} />
                )}
                {isLoading ? (
                  <tr><td colSpan={11} className="px-3 py-6 text-center" style={{ color: GOLD }}>Loading…</td></tr>
                ) : agents.length === 0 && !adding ? (
                  <tr><td colSpan={11} className="px-3 py-6 text-center" style={{ color: '#6b5c45' }}>No referral agents yet.</td></tr>
                ) : (
                  agents.map((agent) =>
                    editingId === agent.id ? (
                      <AgentForm key={agent.id} initial={agent} onCancel={() => setEditingId(null)}
                        onSave={(data) => updateMutation.mutate({ id: agent.id, data })} />
                    ) : (
                      <tr key={agent.id} className="border-b text-sm" style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                        <td className="px-3 py-3">
                          {agent.photo_url ? (
                            <img src={agent.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{ background: `${GOLD}20`, color: GOLD }}>{agent.name?.[0] || '?'}</div>
                          )}
                        </td>
                        <td className="px-3 py-3 font-bold" style={{ color: '#1a1a1a' }}>{agent.name}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.preferred_name || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.portal_slug || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.brokerage || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.phone || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.email || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.dre_license_number || '—'}</td>
                        <td className="px-3 py-3 whitespace-nowrap" style={{ color: '#4a3a28' }}>{agent.license_exp_date || '—'}</td>
                        <td className="px-3 py-3 max-w-[180px]" style={{ color: '#6b5c45' }}>{agent.notes || '—'}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1.5 items-center">
                            {agent.portal_slug && (
                              <a href={`/referral-agent/${agent.portal_slug}`} target="_blank" rel="noreferrer" title="View their portal"
                                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                                style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
                                <ExternalLink className="w-3 h-3" /> Portal
                              </a>
                            )}
                            {agent.phone && (
                              <>
                                <a href={`tel:${agent.phone}`} title="Call">
                                  <Phone className="w-3.5 h-3.5" style={{ color: '#2563eb' }} />
                                </a>
                                <a href={`sms:${agent.phone}`} title="Text">
                                  <MessageSquare className="w-3.5 h-3.5" style={{ color: '#16a34a' }} />
                                </a>
                              </>
                            )}
                            {agent.email && (
                              <a href={`mailto:${agent.email}`} title="Email">
                                <Mail className="w-3.5 h-3.5" style={{ color: '#9333ea' }} />
                              </a>
                            )}
                            <button onClick={() => setEditingId(agent.id)}><Edit2 className="w-3.5 h-3.5" style={{ color: GOLD }} /></button>
                            <button onClick={() => { if (window.confirm(`Delete ${agent.name}?`)) deleteMutation.mutate(agent.id); }}>
                              <Trash2 className="w-3.5 h-3.5" style={{ color: '#dc2626' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}