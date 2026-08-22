import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Check, X, Trash2, UserCheck } from 'lucide-react';

const GOLD = '#D4AF37';
const BLANK = { name: '', brokerage: '', phone: '', email: '', status: 'Relocation Agent Subscriber', notes: '', joined_at: '' };

function AgentForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  return (
    <tr style={{ background: 'rgba(212,175,55,0.06)' }}>
      {['name', 'brokerage', 'phone', 'email', 'status'].map((field) => (
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
        <textarea
          value={form.notes || ''}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full text-xs px-2 py-1 rounded-lg outline-none resize-none"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}`, color: '#1a1a1a' }}
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="date"
          value={form.joined_at || ''}
          onChange={(e) => setForm((f) => ({ ...f, joined_at: e.target.value }))}
          className="text-xs px-2 py-1 rounded-lg outline-none"
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

export default function AdminActiveRelocationAgents() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['activeRelocationAgents'],
    queryFn: () => base44.entities.ActiveRelocationAgent.list('-joined_at', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ActiveRelocationAgent.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['activeRelocationAgents'] }); setAdding(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ActiveRelocationAgent.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['activeRelocationAgents'] }); setEditingId(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ActiveRelocationAgent.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['activeRelocationAgents'] }),
  });

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN ADMIN</p>
            <h1 className="font-black text-2xl flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
              <UserCheck className="w-6 h-6" style={{ color: GOLD }} /> Active Relocation Agents
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b5c45' }}>{agents.length} joined affiliates</p>
          </div>
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            <Plus className="w-4 h-4" /> Add Agent
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
          <div style={{ background: '#fff8ee', overflowX: 'auto' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Name', 'Brokerage', 'Phone', 'Email', 'Status', 'Notes', 'Joined', ''].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-black tracking-wide" style={{ color: GOLD, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adding && (
                  <AgentForm initial={BLANK} onCancel={() => setAdding(false)} onSave={(data) => createMutation.mutate(data)} />
                )}
                {isLoading ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center" style={{ color: GOLD }}>Loading…</td></tr>
                ) : agents.length === 0 && !adding ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center" style={{ color: '#6b5c45' }}>No active relocation agents yet.</td></tr>
                ) : (
                  agents.map((agent) =>
                    editingId === agent.id ? (
                      <AgentForm key={agent.id} initial={agent} onCancel={() => setEditingId(null)}
                        onSave={(data) => updateMutation.mutate({ id: agent.id, data })} />
                    ) : (
                      <tr key={agent.id} className="border-b text-sm" style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                        <td className="px-3 py-3 font-bold" style={{ color: '#1a1a1a' }}>{agent.name}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.brokerage || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.phone || '—'}</td>
                        <td className="px-3 py-3" style={{ color: '#4a3a28' }}>{agent.email || '—'}</td>
                        <td className="px-3 py-3">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.35)' }}>
                            {agent.status || '—'}
                          </span>
                        </td>
                        <td className="px-3 py-3 max-w-[220px]" style={{ color: '#6b5c45' }}>{agent.notes || '—'}</td>
                        <td className="px-3 py-3 whitespace-nowrap" style={{ color: '#4a3a28' }}>{agent.joined_at || '—'}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
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