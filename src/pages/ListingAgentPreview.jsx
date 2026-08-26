import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import AgentRoadmapSandbox from '@/components/guestpass/AgentRoadmapSandbox';
import SoftGateModal from '@/components/guestpass/SoftGateModal';
import AskCharliePill from '@/components/guestpass/AskCharliePill';
import ListingDetailsCard from '@/components/guestpass/ListingDetailsCard';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

/**
 * ListingAgentPreview — the personalized "guest pass" page sent/shown to a
 * listing agent on a fresh MLS listing. Pre-filled with their name, listing,
 * brokerage and city; shows a sample of what their Agent Portal looks like;
 * mentions the referral fee; and asks where their client is moving so the
 * follow-up call already has that context.
 */
export default function ListingAgentPreview() {
  const { token } = useParams();
  const [prospect, setProspect] = useState(null);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    base44.functions.invoke('listingProspectPreview', { action: 'get', token })
      .then(res => {
        if (res.data?.success) setProspect(res.data.prospect);
        else setError('This preview link is no longer valid.');
      })
      .catch(() => setError('This preview link is no longer valid.'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim() || submitting) return;
    setSubmitting(true);
    await base44.functions.invoke('listingProspectPreview', { action: 'submit_destination', token, client_destination: destination.trim() });
    setSubmitted(true);
    setSubmitting(false);
  };

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

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 mx-auto mb-8" />

        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-center mb-2" style={{ color: GOLD }}>
          Your Agent Portal Preview
        </p>
        <h1 className="text-3xl font-serif text-white text-center mb-2">
          Congrats on the New Listing, {prospect.agent_name.split(' ')[0]}!
        </h1>
        <p className="text-center text-white/60 mb-8 max-w-xl mx-auto">
          Your local business is always 100% yours — we only step in on the out-of-area side, when a client is
          relocating outside {prospect.city || 'your market'}. In those cases, we connect them with a vetted agent in
          their new city{prospect.referral_fee_offered ? <> and protect your <strong style={{ color: GOLD }}>{prospect.referral_fee_offered}</strong></> : ''}, so
          it's a win for your client and for you.
        </p>

        <ListingDetailsCard prospect={prospect} />

        <AgentRoadmapSandbox city={prospect.city} onGate={() => setGateOpen(true)} />

        <div className="rounded-2xl p-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
          {submitted ? (
            <p className="text-sm text-white/80">Thanks — we've got that noted and will follow up with a call shortly.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm font-semibold text-white mb-1">Only if your client is leaving the area — where are they headed?</p>
              <p className="text-xs text-white/40 mb-2">If they're staying local, there's nothing to send — that business is all yours.</p>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Moving from Austin to Palo Alto"
                className="w-full bg-transparent text-sm text-white outline-none rounded-lg p-3 placeholder-stone-500 mb-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
              />
              <button
                type="submit"
                disabled={submitting || !destination.trim()}
                className="w-full px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
              >
                {submitting ? 'Sending…' : "Send — We'll Follow Up"}
              </button>
            </form>
          )}
        </div>
      </div>

      <SoftGateModal open={gateOpen} onClose={() => setGateOpen(false)} claimUrl="/agent-subscribe" />
      <AskCharliePill agentName={prospect.agent_name} city={prospect.city} />
    </div>
  );
}