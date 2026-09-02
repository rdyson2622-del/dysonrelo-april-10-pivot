import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2, DollarSign, X } from 'lucide-react';

const GOLD = '#D4AF37';

const DEFAULT_BULLETS = [
  'Keep your relationship — you stay the trusted advisor, we handle the destination side.',
  'We match your client with a vetted, full-time relocation agent wherever they are moving.',
  'Your client gets a full concierge experience: agent matching, city guides, and move support.',
  'You earn a referral fee on closing — no listing work, no showings, no liability.',
];

export default function ReferralAgentExplainer() {
  const navigate = useNavigate();
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
    <div className="min-h-screen px-6 py-12" style={{ background: '#ede0cc' }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/admin/referral-agents'))}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full mb-4"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
          <X className="w-3.5 h-3.5" /> Exit
        </button>

        <div className="rounded-2xl p-6 md:p-8" style={{ background: '#0a0a0a', border: `1px solid ${GOLD}40` }}>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-center" style={{ color: GOLD }}>
            Referral Agent Opportunity
          </p>
          <h1 className="text-3xl font-serif text-white text-center mb-2">
            {content?.headline || 'Your Referral Opportunity'}
          </h1>
          {content?.subheadline && (
            <p className="text-sm text-gray-400 text-center mb-8">{content.subheadline}</p>
          )}

          {content?.video_url ? (
            <div className="rounded-xl overflow-hidden mb-8" style={{ border: `2px solid ${GOLD}` }}>
              <video src={content.video_url} controls className="w-full" style={{ display: 'block' }} />
            </div>
          ) : (
            <div className="rounded-xl mb-8 flex items-center justify-center py-16" style={{ background: '#111', border: `1px dashed ${GOLD}40` }}>
              <p className="text-xs text-gray-500">Explainer video coming soon.</p>
            </div>
          )}

          <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
            <div className="space-y-3 mb-5">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <p className="text-sm text-gray-200 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}30` }}>
              <DollarSign className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
              <p className="text-sm text-white leading-relaxed">
                {content?.fee_summary || 'You earn a referral fee when your referred client closes on a home — paid directly to you, no work required beyond the introduction.'}
              </p>
            </div>

            {content?.cta_label && content?.cta_url && (
              <a href={content.cta_url}
                className="block text-center mt-5 px-4 py-3 rounded-lg text-sm font-bold transition-all"
                style={{ background: GOLD, color: '#000' }}>
                {content.cta_label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}