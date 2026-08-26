import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const DEAL_FIELDS = [
  { key: 'client_name', label: 'Client Name' },
  { key: 'corporate_sponsor', label: 'Corporate Sponsor (optional)' },
  { key: 'effective_date', label: 'Effective Date', type: 'date' },
  { key: 'origin_market', label: 'Origin Market' },
  { key: 'destination_market', label: 'Destination Market' },
];

function RoleSendCard({ label, role, submission, onSent }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const sentAt = submission[`sent_${role}_at`];
  const completed = submission[`${role}_completed`];

  const send = async () => {
    if (!email.trim() || sending) return;
    setSending(true);
    try {
      await base44.functions.invoke('agreementSubmission', { action: 'send', id: submission.id, role, email: email.trim(), name: name.trim() });
      onSent();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.25)' }}>
      <p className="text-xs font-bold uppercase tracking-wide text-white mb-2">{label}</p>
      {completed ? (
        <p className="text-xs flex items-center gap-1.5" style={{ color: '#22c55e' }}><CheckCircle2 className="w-3.5 h-3.5" /> Completed &amp; signed</p>
      ) : sentAt ? (
        <p className="text-xs text-white/60">Sent — awaiting completion. <button onClick={() => { setName(''); setEmail(''); }} className="underline" style={{ color: GOLD }}>Resend?</button></p>
      ) : null}
      {!completed && (
        <div className="mt-2 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Recipient name"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs text-white bg-white/5 outline-none" style={{ border: '1px solid rgba(212,175,55,0.3)' }} />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Recipient email" type="email"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs text-white bg-white/5 outline-none" style={{ border: '1px solid rgba(212,175,55,0.3)' }} />
          <button onClick={send} disabled={!email.trim() || sending}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-bold disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            <Send className="w-3 h-3" /> {sending ? 'Sending…' : sentAt ? 'Resend Link' : 'Send for Signature'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SendAgreementModal({ onClose }) {
  const [deal, setDeal] = useState({ client_name: '', corporate_sponsor: '', effective_date: '', origin_market: '', destination_market: '' });
  const [submission, setSubmission] = useState(null);
  const [creating, setCreating] = useState(false);

  const createSubmission = async () => {
    if (!deal.client_name.trim() || creating) return;
    setCreating(true);
    try {
      const res = await base44.functions.invoke('agreementSubmission', { action: 'create', ...deal });
      setSubmission(res.data.record);
    } finally {
      setCreating(false);
    }
  };

  const refresh = async () => {
    const res = await base44.functions.invoke('agreementSubmission', { action: 'getByToken', token: submission.token, role: 'referring' });
    setSubmission(prev => ({ ...prev, ...res.data.record }));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#111', border: `1px solid ${GOLD}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="font-black text-sm text-white">Send Agreement to Fill Out &amp; Sign</p>
          <button onClick={onClose}><X className="w-4 h-4 text-white" /></button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {!submission ? (
            <>
              {DEAL_FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-white/70 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={deal[f.key]}
                    onChange={e => setDeal(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 outline-none"
                    style={{ border: '1px solid rgba(212,175,55,0.3)' }}
                  />
                </div>
              ))}
              <button onClick={createSubmission} disabled={!deal.client_name.trim() || creating}
                className="w-full py-2.5 rounded-full font-black text-sm disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
                {creating ? 'Creating…' : 'Create Agreement Link'}
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-white/60">
                Deal info saved for <strong className="text-white">{submission.client_name}</strong>. Now send each party their own link
                — they'll fill in only their information, sign, and submit online. No printing, no manual return.
              </p>
              <RoleSendCard label="Referring Broker / Agent" role="referring" submission={submission} onSent={refresh} />
              <RoleSendCard label="Receiving Broker / Agent" role="receiving" submission={submission} onSent={refresh} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}