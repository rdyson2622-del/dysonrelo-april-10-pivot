import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

const DEFAULT_BULLETS = [
  'Every milestone in your transaction is visible in real time — not just to you, but to every participant who touches it: agents, brokers, lenders, title, escrow.',
  "What's live today: your Dyson & Dyson team and agents keep this roadmap current on every assignment we take on.",
  "What we're building toward: lenders, title, and escrow are invited to view — and, as integrations mature, to update — so nothing waits on a phone call.",
  'Every friction point we uncover along the way is logged and reused, so the next move benefits from lessons learned on the last one.',
];

export default function Transparency() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    base44.entities.TransparencyContent.list().then(rows => {
      const rec = rows.find(r => r.is_live !== false) || rows[0];
      if (rec) setContent(rec);
    }).catch(() => {});
  }, []);

  const bullets = content?.bullets?.length ? content.bullets : DEFAULT_BULLETS;

  return (
    <div className="min-h-screen px-6 py-16" style={{ background: '#0A0B0F' }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-8 h-8" style={{ color: GOLD }} />
          <h1 className="text-3xl sm:text-4xl font-black tracking-widest uppercase" style={{ color: GOLD }}>
            {content?.headline || 'Transparency'}
          </h1>
        </div>
        <p className="text-white/80 text-lg mb-8">
          {content?.subheadline || 'The one thing missing in real estate — a live, shared roadmap for you and everyone working your move.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-4">
          <div className="rounded-xl overflow-hidden shrink-0 relative" style={{ border: '1px solid rgba(212,175,55,0.3)', background: '#000', width: '180px', height: '180px' }}>
            {content?.video_url ? (
              <video src={content.video_url} controls className="w-full h-full object-cover" />
            ) : (
              <>
                <img
                  src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a0f097ef2_generated_image.png"
                  alt="Charlie — Dyson AI Concierge"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 left-0 right-0 py-1 text-center text-[10px] text-white/70 bg-black/70">
                  Explainer video coming soon
                </span>
              </>
            )}
          </div>

          <ul className="flex-1 space-y-4">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-white/90">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}