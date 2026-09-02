import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Phone, Mail, MapPin, BadgeCheck, Loader2 } from 'lucide-react';
import AgentOpportunityPitch from '@/components/referral/AgentOpportunityPitch';
import ClientExperiencePreview from '@/components/referral/ClientExperiencePreview';

const GOLD = '#D4AF37';

export default function ReferralAgentPortal() {
  const { slug } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    base44.entities.ActiveRelocationAgent.filter({ portal_slug: slug }, '-created_date', 1)
      .then((res) => setAgent(res?.[0] || null))
      .finally(() => setLoading(false));
  }, [slug]);

  const confirmLicense = async () => {
    if (!agent) return;
    setConfirming(true);
    const updated = await base44.entities.ActiveRelocationAgent.update(agent.id, {
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
    <div className="min-h-screen px-6 py-12" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
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
            <p className="text-sm text-gray-400 mt-1">{agent.brokerage || 'Wisdom Properties'} {agent.city ? `· ${agent.city}` : ''}</p>
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
      </div>
    </div>
  );
}