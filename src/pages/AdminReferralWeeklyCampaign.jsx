import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Megaphone, Send, Loader2, CheckCircle2 } from 'lucide-react';

const GOLD = '#D4AF37';
const DEFAULT_SUBJECT = "You're invited — daily real estate intelligence, delivered personally";
const DEFAULT_BODY = `Hi {{contact_name}},

{{referral_agent_name}} thought you'd want early access to Dyson & Dyson's daily real estate intelligence brief — market news, relocation tips, and local insight, delivered straight to your inbox.

Reply to this email or click below to get started.

— The Dyson & Dyson Companies, Inc`;

export default function AdminReferralWeeklyCampaign() {
  const qc = useQueryClient();
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const [done, setDone] = useState(false);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['referralAgentContactsNotInvited'],
    queryFn: () => base44.entities.ReferralAgentContact.filter({ invite_status: 'not_invited' }, '-created_date', 500),
  });

  const emailable = contacts.filter((c) => c.contact_email);

  const sendCampaign = async () => {
    setSending(true);
    setDone(false);
    setProgress({ sent: 0, total: emailable.length });

    for (let i = 0; i < emailable.length; i += 5) {
      const batch = emailable.slice(i, i + 5);
      await Promise.all(batch.map(async (c) => {
        const personalized = body
          .replaceAll('{{contact_name}}', c.contact_name || 'there')
          .replaceAll('{{referral_agent_name}}', c.referral_agent_name || 'Your referring agent');
        await base44.integrations.Core.SendEmail({ to: c.contact_email, subject, body: personalized });
        await base44.entities.ReferralAgentContact.update(c.id, { invite_status: 'invited', invited_at: new Date().toISOString() });
      }));
      setProgress((p) => ({ ...p, sent: Math.min(p.total, i + batch.length) }));
      if (i + 5 < emailable.length) await new Promise((r) => setTimeout(r, 5000));
    }

    setSending(false);
    setDone(true);
    qc.invalidateQueries({ queryKey: ['referralAgentContactsNotInvited'] });
    qc.invalidateQueries({ queryKey: ['referralAgentContacts'] });
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-black tracking-[0.3em] mb-1" style={{ color: GOLD }}>PRN ADMIN</p>
        <h1 className="font-black text-2xl flex items-center gap-2 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
          <Megaphone className="w-6 h-6" style={{ color: GOLD }} /> Weekly Invite Campaign
        </h1>
        <p className="text-sm mb-6" style={{ color: '#6b5c45' }}>
          Contacts referral agents have turned in that haven't been invited yet — compose one message and send it to all of them to grow the subscriber base.
        </p>

        <div className="rounded-2xl p-5 mb-5" style={{ background: '#fff8ee', border: `1px solid ${GOLD}40` }}>
          <p className="text-xs font-black tracking-wide uppercase mb-3" style={{ color: GOLD }}>
            {isLoading ? 'Loading…' : `${emailable.length} contact${emailable.length !== 1 ? 's' : ''} ready to invite`}
            {contacts.length > emailable.length && ` (${contacts.length - emailable.length} missing an email address, skipped)`}
          </p>
          <input value={subject} onChange={(e) => setSubject(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none mb-2" placeholder="Subject"
            style={{ background: '#fff', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none" placeholder="Message"
            style={{ background: '#fff', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }} />
          <p className="text-[11px] mt-1.5" style={{ color: '#6b5c45' }}>Placeholders: {'{{contact_name}}'}, {'{{referral_agent_name}}'}</p>
        </div>

        <button onClick={sendCampaign} disabled={sending || isLoading || emailable.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          style={{ background: GOLD, color: '#000' }}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? `Sending… (${progress.sent}/${progress.total})` : `Send to ${emailable.length} Contact${emailable.length !== 1 ? 's' : ''}`}
        </button>

        {done && (
          <p className="flex items-center gap-2 text-sm mt-3" style={{ color: '#22c55e' }}>
            <CheckCircle2 className="w-4 h-4" /> Campaign sent — all contacts marked as invited.
          </p>
        )}
      </div>
    </div>
  );
}