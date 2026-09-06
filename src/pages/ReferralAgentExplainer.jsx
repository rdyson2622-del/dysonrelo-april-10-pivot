import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import ReferralAgentSidebar from '@/components/referral/ReferralAgentSidebar';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';

const GOLD = '#D4AF37';

const DEFAULT_BULLETS = [
  'Keep your relationship — you stay the trusted advisor, we handle the destination side.',
  'We match your client with a vetted, full-time relocation agent wherever they are moving.',
  'Your client gets a full concierge experience: agent matching, city guides, and move support.',
  'You earn a referral fee on closing — no listing work, no showings, no liability.',
];

export default function ReferralAgentExplainer() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ReferralAgentExplainerContent.list('-created_date', 1)
      .then((res) => setContent(res?.[0] || null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#ede0cc' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const bullets = content?.bullets?.length ? content.bullets : DEFAULT_BULLETS;

  return (
    <div className="min-h-screen md:pl-56" style={{ background: '#ede0cc' }}>
      <ReferralAgentSidebar />

      <ClientHeroMockup
        label="Your Referral Agent Portal"
        quoteLine1='"You do not have to let go of the relationship just because a client is leaving your market.'
        quoteLine2="Refer them to us, stay the trusted face, and get paid when they close."
        attribution="— Bob Dyson"
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>
            Referral Agent Opportunity
          </p>
          <h1 className="display-heading mb-4" style={{ fontSize: '2.25rem', letterSpacing: '0.08em' }}>
            <span style={{ color: '#1a1a1a' }}>{content?.headline || 'Your Referral Opportunity'}</span>
          </h1>
          {content?.subheadline && (
            <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(26,26,26,0.7)' }}>
              {content.subheadline}
            </p>
          )}
        </motion.div>

        {content?.video_url ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden mb-8" style={{ border: `2px solid ${GOLD}` }}>
            <video src={content.video_url} controls className="w-full" style={{ display: 'block' }} />
          </motion.div>
        ) : (
          <div className="rounded-2xl mb-8 flex items-center justify-center py-16" style={{ background: '#fff8ee', border: `1px dashed ${GOLD}` }}>
            <p className="text-xs" style={{ color: 'rgba(26,26,26,0.5)' }}>Explainer video coming soon.</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-8" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="space-y-3 mb-6">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                <p className="text-sm text-white leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}40` }}>
            <DollarSign className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <p className="text-sm text-white leading-relaxed">
              {content?.fee_summary || 'You earn a referral fee when your referred client closes on a home — paid directly to you, no work required beyond the introduction.'}
            </p>
          </div>

          {content?.cta_label && content?.cta_url && (
            <a href={content.cta_url}
              className="block text-center mt-6 px-4 py-3 rounded-lg text-sm font-bold transition-all"
              style={{ background: GOLD, color: '#000' }}>
              {content.cta_label}
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}