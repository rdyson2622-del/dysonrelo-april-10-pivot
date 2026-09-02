import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Trash2, Phone, Mail, X } from 'lucide-react';

const GOLD = '#D4AF37';
const STATUS_OPTIONS = ['not_invited', 'invited', 'subscribed', 'declined'];
const STATUS_COLORS = { not_invited: '#888', invited: '#D4AF37', subscribed: '#22c55e', declined: '#dc2626' };
const FEE_OPTIONS = ['not_applicable', 'pending', 'owed', 'paid'];
const FEE_COLORS = { not_applicable: '#888', pending: '#D4AF37', owed: '#dc2626', paid: '#22c55e' };

export default function AdminReferralAgentContacts() {
  const qc = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const agentIdFilter = urlParams.get('agent_id');

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['referralAgentContacts'],
    queryFn: () => base44.entities.ReferralAgentContact.list('-created_date', 500),
  });

  const filtered = agentIdFilter ? contacts.filter((c) => c.referral_agent_id === agentIdFilter) : contacts;
  const filteredAgentName = agentIdFilter ? filtered[0]?.referral_agent_name : null;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ReferralAgentContact.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['referralAgentContacts'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ReferralAgentContact.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['referralAgentContacts'] }),
  });

  const setStatus = (contact, status) => {
    const data = { invite_status: status };
    if (status === 'invited') data.invited_at = new Date().toISOString();
    if (status === 'subscribed') data.subscribed_at = new Date().toISOString();
    updateMutation.mutate({ id: contact.id, data });
  };

  const setFeeStatus = (contact, referral_fee_status) => {
    const data = { referral_fee_status };
    if (referral_fee_status !== 'not_applicable' && !contact.became_client_at) data.became_client_at = new Date().toISOString();
    updateMutation.mutate({ id: contact.id, data });
  };

  const setFeeAmount = (contact, value) => {
    updateMutation.mutate({ id: contact.id, data: { referral_fee_amount: value === '' ? null : Number(value) } });
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN ADMIN</p>
        <h1 className="font-black text-2xl flex items-center gap-2 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
          <Users className="w-6 h-6" style={{ color: GOLD }} /> Referral Agent Contact List
        </h1>
        <p className="text-sm mb-4" style={{ color: '#6b5c45' }}>
          Friends & clients each referral agent has asked us to invite as their reserved subscribers — this is the same file used for mailing outreach and tracking referral fee payouts.
        </p>

        {agentIdFilter && (
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
              Showing only: {filteredAgentName || 'this agent'}
            </span>
            <a href="/admin/referral-agent-contacts" className="flex items-center gap-1 text-xs font-bold" style={{ color: GOLD }}>
              <X className="w-3.5 h-3.5" /> Clear filter
            </a>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
          <div style={{ background: '#fff8ee', overflowX: 'auto' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Referred By', 'Contact', 'Phone', 'Email', 'Notes', 'Status', 'Referral Fee', ''].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-black tracking-wide" style={{ color: GOLD, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center" style={{ color: GOLD }}>Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center" style={{ color: '#6b5c45' }}>No contacts submitted yet.</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b text-sm" style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
                      <td className="px-3 py-3 font-bold" style={{ color: '#1a1a1a' }}>{c.referral_agent_name || '—'}</td>
                      <td className="px-3 py-3" style={{ color: '#1a1a1a' }}>{c.contact_name}</td>
                      <td className="px-3 py-3" style={{ color: '#4a3a28' }}>
                        {c.contact_phone ? (
                          <a href={`tel:${c.contact_phone}`} className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: GOLD }} />{c.contact_phone}</a>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#4a3a28' }}>
                        {c.contact_email ? (
                          <a href={`mailto:${c.contact_email}`} className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: GOLD }} />{c.contact_email}</a>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-3 max-w-[200px]" style={{ color: '#6b5c45' }}>{c.relationship_notes || '—'}</td>
                      <td className="px-3 py-3">
                        <select value={c.invite_status || 'not_invited'} onChange={(e) => setStatus(c, e.target.value)}
                          className="text-[11px] font-bold px-2 py-1 rounded-full outline-none"
                          style={{ background: `${STATUS_COLORS[c.invite_status || 'not_invited']}15`, border: `1px solid ${STATUS_COLORS[c.invite_status || 'not_invited']}60`, color: STATUS_COLORS[c.invite_status || 'not_invited'] }}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <select value={c.referral_fee_status || 'not_applicable'} onChange={(e) => setFeeStatus(c, e.target.value)}
                            className="text-[11px] font-bold px-2 py-1 rounded-full outline-none"
                            style={{ background: `${FEE_COLORS[c.referral_fee_status || 'not_applicable']}15`, border: `1px solid ${FEE_COLORS[c.referral_fee_status || 'not_applicable']}60`, color: FEE_COLORS[c.referral_fee_status || 'not_applicable'] }}>
                            {FEE_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                          </select>
                          <input type="number" placeholder="$" defaultValue={c.referral_fee_amount ?? ''}
                            onBlur={(e) => setFeeAmount(c, e.target.value)}
                            className="w-16 text-[11px] px-1.5 py-1 rounded-lg outline-none"
                            style={{ background: '#fff', border: `1px solid ${GOLD}40`, color: '#1a1a1a' }} />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <button onClick={() => { if (window.confirm(`Remove ${c.contact_name}?`)) deleteMutation.mutate(c.id); }}>
                          <Trash2 className="w-3.5 h-3.5" style={{ color: '#dc2626' }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}