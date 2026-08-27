import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, Phone, Mail, BadgeCheck } from 'lucide-react';
import ListingDetailsCard from '@/components/guestpass/ListingDetailsCard';
import ValuePropList from '@/components/guestpass/ValuePropList';
import ClaimPortalModal from '@/components/guestpass/ClaimPortalModal';
import AskCharliePill from '@/components/guestpass/AskCharliePill';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

/**
 * ListingAgentPreview — the personalized, no-login "Magic Link" preview
 * sent to a listing agent on a fresh MLS listing. Shows only their own
 * name/DRE/contact info and the listing being discussed, pitches the free
 * destination-vetting service, and offers a single frictionless CTA to
 * claim a permanent Relo Agent portal (progressive profiling: password +
 * email code only — everything else is already on file).
 */
export default function ListingAgentPreview() {
  const { token } = useParams();
  const [prospect, setProspect] = useState(null);
  const [error, setError] = useState('');
  const [claimOpen, setClaimOpen] = useState(false);

  useEffect(() => {
    base44.functions.invoke('listingProspectPreview', { action: 'get', token })
      .then(res => {
        if (res.data?.success) setProspect(res.data.prospect);
        else setError('This preview link is no longer valid.');
      })
      .catch(() => setError('This preview link is no longer valid.'));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <p className="text-white/60 text-sm">{error}</p>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const listingLabel = [prospect.listing_address, prospect.city].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen pb-28" style={{ background: '#0a0a0a' }}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-8 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          Exclusive Agent Preview
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10">
        {/* Hero: The Personalization Hook */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>
            Prepared Exclusively For
          </p>
          <h1 className="text-3xl font-serif text-white mb-2">{prospect.agent_name}</h1>
          <p className="text-sm text-white/60 mb-3">
            {prospect.brokerage}
            {prospect.dre_number && <> · DRE #{prospect.dre_number}</>}
          </p>
          <div className="flex items-center justify-center gap-5 text-sm">
            {prospect.agent_phone && (
              <span className="flex items-center gap-1.5 text-white/70">
                <Phone className="w-3.5 h-3.5" style={{ color: GOLD }} /> {prospect.agent_phone}
              </span>
            )}
            {prospect.agent_email && (
              <span className="flex items-center gap-1.5 text-white/70">
                <Mail className="w-3.5 h-3.5" style={{ color: GOLD }} /> {prospect.agent_email}
              </span>
            )}
          </div>
        </div>

        {/* The Listing Context Box */}
        <div className="rounded-2xl p-4 mb-2" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}40` }}>
          <p className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
            <BadgeCheck className="w-4 h-4" style={{ color: GOLD }} /> New Listing Detected{listingLabel ? `: ${listingLabel}` : ''}
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            <span style={{ color: GOLD }} className="font-semibold">The Strategy:</span> Your client is selling. Where are they moving next?
            Don't let them guess on their destination agent. Let us vet the top talent in their new city, at absolutely
            zero cost to you or your client. We work for you to ensure their transition is seamless.
          </p>
        </div>

        <ListingDetailsCard prospect={prospect} />

        {/* The Value Prop: The "We Work For You" Pitch */}
        <ValuePropList />
      </div>

      {/* Conversion Mechanism: sticky frictionless ask */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4" style={{ background: 'rgba(10,10,10,0.95)', borderTop: `1px solid ${GOLD}40`, backdropFilter: 'blur(8px)' }}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/80 text-center sm:text-left">
            Ready to secure a destination agent for the {prospect.listing_address ? <span style={{ color: GOLD }}>{prospect.listing_address.split(',')[0]}</span> : 'this'} listing?
          </p>
          <button
            onClick={() => setClaimOpen(true)}
            className="shrink-0 px-6 py-3 rounded-full text-sm font-black tracking-wide transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            Activate My Free Relo Portal
          </button>
        </div>
      </div>

      <ClaimPortalModal open={claimOpen} onClose={() => setClaimOpen(false)} prospect={prospect} token={token} />
      <AskCharliePill agentName={prospect.agent_name} city={prospect.city} />
    </div>
  );
}