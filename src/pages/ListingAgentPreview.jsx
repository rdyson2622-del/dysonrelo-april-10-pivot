import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, Sparkles, MapPin, TrendingUp } from 'lucide-react';

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
          Hi {prospect.agent_name.split(' ')[0]}, congrats on the new listing
        </h1>
        {prospect.listing_address && (
          <p className="text-center text-white/60 mb-8 flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4" /> {prospect.listing_address}{prospect.city ? `, ${prospect.city}` : ''}
            {prospect.listing_value ? ` · $${Number(prospect.listing_value).toLocaleString()}` : ''}
          </p>
        )}

        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}>
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            We manage the entire relocation for buyers moving in or out of {prospect.city || 'your market'} —
            keeping you, and your commission timeline, completely in the loop while we handle the logistics.
            Here's a preview of what your Agent Portal tracks the moment you're on board:
          </p>
          <div className="space-y-2">
            {['Live relocation roadmap for your client', 'Milestone alerts (escrow, movers, closing)', 'Direct messaging with our team, no back-and-forth calls'].map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} /> {line}
              </div>
            ))}
          </div>
        </div>

        {prospect.referral_fee_offered && (
          <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}` }}>
            <TrendingUp className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <p className="text-sm text-white">As a preferred partner on this deal, we're offering a <strong style={{ color: GOLD }}>{prospect.referral_fee_offered}</strong>.</p>
          </div>
        )}

        <div className="rounded-2xl p-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
          {submitted ? (
            <p className="text-sm text-white/80">Thanks — we've got that noted and will follow up with a call shortly.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm font-semibold text-white mb-2">Where is your client moving?</p>
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
    </div>
  );
}