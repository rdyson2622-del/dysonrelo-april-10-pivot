import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Phone, Mail, MapPin, BadgeCheck, Loader2, Users, Send, Megaphone, CalendarClock } from 'lucide-react';
import AgentOpportunityPitch from '@/components/referral/AgentOpportunityPitch';
import ClientExperiencePreview from '@/components/referral/ClientExperiencePreview';
import ReferralSectionExplainer from '@/components/referral/ReferralSectionExplainer';
import ReferralAgentSidebar from '@/components/referral/ReferralAgentSidebar';

const GOLD = '#D4AF37';
const PROCESS_FALLBACK = [
  'You introduce us to your client before they leave — one text or email is all it takes.',
  'We match them with a vetted, full-time relocation agent in their destination market.',
  'Your client gets full concierge support: agent matching, city guides, and move coordination.',
  'When they close, your referral fee is paid — no listing work or liability on your end.',
];
const FORMS_FALLBACK = [
  'Independent Contractor Agreement with The Dyson & Dyson Companies, Inc — signed once at onboarding.',
  'DRE license number and expiration confirmed by you above.',
  'No MLS paperwork, no listing agreements — you never take on transaction liability.',
];

const STATUS_COLORS = { not_invited: '#888', invited: GOLD, subscribed: '#22c55e', declined: '#dc2626' };

function ContactSubmitForm({ agent, slug }) {
  const [form, setForm] = useState({ contact_name: '', contact_phone: '', contact_email: '', relationship_notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const loadContacts = () => {
    base44.functions.invoke('getReferralAgentContacts', { referral_agent_id: agent.id })
      .then((res) => setContacts(res.data?.contacts || []))
      .finally(() => setLoadingContacts(false));
  };

  useEffect(() => { loadContacts(); }, [agent.id]);

  const submit = async () => {
    if (!form.contact_name) return;
    setSubmitting(true);
    await base44.entities.ReferralAgentContact.create({
      ...form,
      referral_agent_id: agent.id,
      referral_agent_name: agent.name,
      referral_agent_slug: slug,
    });
    setForm({ contact_name: '', contact_phone: '', contact_email: '', relationship_notes: '' });
    setSubmitting(false);
    setSubmitted(true);
    loadContacts();
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
      <p className="text-sm text-gray-300 mb-4">
        Give us the names of friends or clients you'd like invited as your reserved subscribers — they can receive daily real estate news personally delivered by you, on your own branded D&D agent page.
      </p>
      {submitted && (
        <p className="text-xs mb-3" style={{ color: '#22c55e' }}>✓ Thank you — we'll reach out to them on your behalf.</p>
      )}
      <div className="grid gap-2 mb-3">
        <input placeholder="Contact name" value={form.contact_name} onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none bg-black/30 text-white" style={{ border: `1px solid ${GOLD}40` }} />
        <input placeholder="Phone" value={form.contact_phone} onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none bg-black/30 text-white" style={{ border: `1px solid ${GOLD}40` }} />
        <input placeholder="Email" value={form.contact_email} onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none bg-black/30 text-white" style={{ border: `1px solid ${GOLD}40` }} />
        <textarea placeholder="Who are they? (optional)" value={form.relationship_notes} onChange={(e) => setForm((f) => ({ ...f, relationship_notes: e.target.value }))}
          rows={2} className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none bg-black/30 text-white" style={{ border: `1px solid ${GOLD}40` }} />
      </div>
      <button onClick={submit} disabled={submitting || !form.contact_name}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
        style={{ background: GOLD, color: '#000' }}>
        <Send className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit Contact'}
      </button>

      <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${GOLD}25` }}>
        <p className="text-xs font-black tracking-wide uppercase mb-3" style={{ color: GOLD }}>
          Your Referred Contacts {contacts.length > 0 ? `(${contacts.length})` : ''}
        </p>
        {loadingContacts ? (
          <p className="text-xs text-gray-500">Loading…</p>
        ) : contacts.length === 0 ? (
          <p className="text-xs text-gray-500">You haven't referred anyone yet — add your first contact above.</p>
        ) : (
          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{c.contact_name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{c.contact_phone || c.contact_email || '—'}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
                  style={{ background: `${STATUS_COLORS[c.invite_status || 'not_invited']}15`, border: `1px solid ${STATUS_COLORS[c.invite_status || 'not_invited']}60`, color: STATUS_COLORS[c.invite_status || 'not_invited'] }}>
                  {(c.invite_status || 'not_invited').replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReferralAgentPortal() {
  const { slug } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    base44.entities.ReferralAgent.filter({ portal_slug: slug }, '-created_date', 1)
      .then((res) => setAgent(res?.[0] || null))
      .finally(() => setLoading(false));
  }, [slug]);

  const confirmLicense = async () => {
    if (!agent) return;
    setConfirming(true);
    const updated = await base44.entities.ReferralAgent.update(agent.id, {
      license_confirmed_by_agent_at: new Date().toISOString(),
      license_status: 'active',
    });
    setAgent((a) => ({ ...a, ...updated }));
    setConfirming(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <p className="text-white text-sm">This referral agent portal could not be found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 md:pl-64" style={{ background: '#0a0a0a' }}>
      <ReferralAgentSidebar slug={slug} />
      <div className="max-w-2xl mx-auto">
        <div id="opportunity" className="rounded-2xl overflow-hidden" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
          <div className="p-8 text-center" style={{ borderBottom: `1px solid ${GOLD}30` }}>
            {agent.photo_url ? (
              <img src={agent.photo_url} alt={agent.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4"
                style={{ border: `2px solid ${GOLD}` }} />
            ) : (
              <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-serif"
                style={{ background: `${GOLD}15`, border: `2px solid ${GOLD}`, color: GOLD }}>
                {agent.name?.[0] || '?'}
              </div>
            )}
            <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>Referral Agent Portal</p>
            <h1 className="text-2xl font-serif text-white">{agent.preferred_name || agent.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{agent.brokerage || 'The Dyson & Dyson Companies, Inc'} {agent.city ? `· ${agent.city}` : ''}</p>
          </div>

          <div className="p-8 space-y-5">
            <AgentOpportunityPitch preferredName={agent.preferred_name || agent.name} />
            <ClientExperiencePreview />

            <div className="grid gap-2">
              {agent.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" style={{ color: GOLD }} /> {agent.phone}
                </div>
              )}
              {agent.email && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" style={{ color: GOLD }} /> {agent.email}
                </div>
              )}
              {agent.target_territories && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" style={{ color: GOLD }} /> {agent.target_territories}
                </div>
              )}
            </div>

            <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}30` }}>
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-xs font-black tracking-wide uppercase" style={{ color: GOLD }}>DRE License On File</p>
              </div>
              <p className="text-sm text-white">CA DRE # {agent.dre_license_number || '—'}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Expiration on file: {agent.license_exp_date ? new Date(agent.license_exp_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
              </p>

              {agent.license_confirmed_by_agent_at ? (
                <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: '#22c55e' }}>
                  <ShieldCheck className="w-4 h-4" /> Confirmed accurate by you on {new Date(agent.license_confirmed_by_agent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Please confirm this license number and expiration date are accurate.</p>
                  <button onClick={confirmLicense} disabled={confirming}
                    className="px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    style={{ background: GOLD, color: '#000' }}>
                    {confirming ? 'Confirming…' : 'Confirm This Is Accurate'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="process" className="mt-8 pt-2">
          <ReferralSectionExplainer sectionKey="process" fallbackHeadline="The Referral Process" fallbackItems={PROCESS_FALLBACK} />
        </div>

        <div id="forms" className="mt-8 pt-2">
          <ReferralSectionExplainer sectionKey="forms" fallbackHeadline="Your Referral Forms" fallbackItems={FORMS_FALLBACK} />
        </div>

        <div id="contacts" className="mt-8 pt-2">
          <h2 className="text-2xl font-serif text-white text-center mb-2 flex items-center justify-center gap-2">
            <Users className="w-5 h-5" style={{ color: GOLD }} /> Refer Your Contacts
          </h2>
          <ContactSubmitForm agent={agent} slug={slug} />
        </div>

        <div id="campaign" className="mt-8 pt-2">
          <h2 className="text-2xl font-serif text-white text-center mb-2 flex items-center justify-center gap-2">
            <Megaphone className="w-5 h-5" style={{ color: GOLD }} /> Weekly Invite Campaign
          </h2>
          <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
            <div className="flex items-start gap-2 mb-3">
              <CalendarClock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p className="text-sm text-gray-300 leading-relaxed">
                Turn in your contacts above by <span className="font-bold text-white">every Thursday</span> — we send them a personalized invitation to your branded D&D news page over the weekend, growing your subscriber base every week.
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Every contact you refer is logged to your name. If any of them becomes a client, you'll be paid your referral fee — no extra paperwork on your end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}