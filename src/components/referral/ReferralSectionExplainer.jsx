import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';

// Card-only explainer block (no page background) — reusable both as a
// standalone page (wrapped by the caller) and embedded inline in the
// agent's personal portal.
export default function ReferralSectionExplainer({ sectionKey, fallbackHeadline, fallbackItems }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ReferralAgentSectionContent.filter({ section_key: sectionKey }, '-created_date', 1)
      .then((res) => setContent(res?.[0] || null))
      .finally(() => setLoading(false));
  }, [sectionKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const items = content?.items?.length ? content.items : fallbackItems || [];

  return (
    <div>
      <h2 className="text-2xl font-serif text-white text-center mb-2">
        {content?.headline || fallbackHeadline}
      </h2>
      {content?.subheadline && (
        <p className="text-sm text-gray-400 text-center mb-6">{content.subheadline}</p>
      )}

      {content?.video_url && (
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: `2px solid ${GOLD}` }}>
          <video src={content.video_url} controls className="w-full" style={{ display: 'block' }} />
        </div>
      )}

      <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{ background: `${GOLD}20`, color: GOLD }}>
                {sectionKey === 'process' ? i + 1 : <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
              <p className="text-sm text-gray-200 leading-relaxed">{item}</p>
            </div>
          ))}
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
  );
}