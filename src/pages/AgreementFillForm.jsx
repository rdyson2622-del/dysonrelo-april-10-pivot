import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, FileText, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';

const ROLE_CONFIG = {
  referring: {
    label: 'Referring Broker / Agent',
    fields: [
      { key: 'referring_broker_name', label: 'Referring Broker — Full Name' },
      { key: 'referring_broker_license', label: 'Referring Broker — License No.' },
      { key: 'referring_agent_name', label: 'Referring Agent — Full Name' },
      { key: 'referring_agent_license', label: 'Referring Agent — License No.' },
      { key: 'referring_company', label: 'Brokerage / Company' },
      { key: 'referring_email', label: 'Email' },
      { key: 'referring_phone', label: 'Phone' },
    ],
  },
  receiving: {
    label: 'Receiving Broker / Agent',
    fields: [
      { key: 'receiving_broker_name', label: 'Receiving Broker — Full Name' },
      { key: 'receiving_broker_license', label: 'Receiving Broker — License No.' },
      { key: 'receiving_agent_name', label: 'Receiving Agent — Full Name' },
      { key: 'receiving_agent_license', label: 'Receiving Agent — License No.' },
      { key: 'receiving_company', label: 'Brokerage / Company' },
      { key: 'receiving_email', label: 'Email' },
      { key: 'receiving_phone', label: 'Phone' },
    ],
  },
};

export default function AgreementFillForm() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const role = params.get('role');
  const config = ROLE_CONFIG[role];

  const [status, setStatus] = useState('loading'); // loading | ready | invalid | submitted | already_done
  const [record, setRecord] = useState(null);
  const [fields, setFields] = useState({});
  const [signatureName, setSignatureName] = useState('');
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !config) { setStatus('invalid'); return; }
    base44.functions.invoke('agreementSubmission', { action: 'getByToken', token, role })
      .then(res => {
        const rec = res.data?.record;
        if (!rec) { setStatus('invalid'); return; }
        setRecord(rec);
        if (rec[`${role}_completed`]) { setStatus('already_done'); return; }
        const initial = {};
        config.fields.forEach(f => { initial[f.key] = rec[f.key] || ''; });
        setFields(initial);
        setStatus('ready');
      })
      .catch(() => setStatus('invalid'));
  }, [token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signatureName.trim() || !agree || saving) return;
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('agreementSubmission', {
        action: 'submit', token, role, fields, signature_name: signatureName.trim(),
      });
      setStatus('submitted');
    } catch (err) {
      setError('Something went wrong submitting your information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a0a0a' }}>
        <p className="text-white text-center">This link is invalid or has expired. Please contact the sender for a new link.</p>
      </div>
    );
  }

  if (status === 'already_done' || status === 'submitted') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-md text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: GOLD }} />
          <h1 className="text-xl font-bold text-white mb-2">
            {status === 'submitted' ? 'Thank you — you\'re all set.' : 'Already submitted'}
          </h1>
          <p className="text-white/70 text-sm">
            Your information has been recorded on the Master Referral &amp; Relocation Management Agreement for
            {record?.client_name ? ` ${record.client_name}` : ' this client'}. No further action is needed on your part.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#0a0a0a' }}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
            <FileText className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Master Referral &amp; Relocation Agreement</h1>
            <p className="text-xs text-white/60">Complete your section as the {config.label}</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-5 text-sm text-white/80" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
          <p><strong className="text-white">Client:</strong> {record.client_name || '—'}</p>
          {record.corporate_sponsor && <p><strong className="text-white">Corporate Sponsor:</strong> {record.corporate_sponsor}</p>}
          <p><strong className="text-white">Effective Date:</strong> {record.effective_date || '—'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-white/70 mb-1">{f.label}</label>
              <input
                type="text"
                value={fields[f.key] || ''}
                onChange={(e) => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 outline-none"
                style={{ border: '1px solid rgba(212,175,55,0.3)' }}
              />
            </div>
          ))}

          <div className="pt-2">
            <label className="block text-xs font-semibold text-white/70 mb-1">Type your full name as your electronic signature</label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              required
              placeholder="Full legal name"
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 outline-none italic"
              style={{ border: `1px solid ${GOLD}` }}
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-white/70">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" required />
            I agree that typing my name above constitutes my electronic signature and acceptance of this Agreement.
          </label>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving || !signatureName.trim() || !agree}
            className="w-full py-3 rounded-full font-black text-sm transition-all hover:scale-[1.01] disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            {saving ? 'Submitting…' : 'Submit & Sign'}
          </button>
        </form>
      </div>
    </div>
  );
}