import React from 'react';
import ReferralSectionExplainer from '@/components/referral/ReferralSectionExplainer';

const GOLD = '#D4AF37';
const FALLBACK_STEPS = [
  'You introduce us to your client before they leave — one text or email is all it takes.',
  'We match them with a vetted, full-time relocation agent in their destination market.',
  'Your client gets full concierge support: agent matching, city guides, and move coordination.',
  'When they close, your referral fee is paid — no listing work or liability on your end.',
];

export default function ReferralProcessExplainer() {
  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-center" style={{ color: GOLD }}>
          Referral Agent Network
        </p>
        <ReferralSectionExplainer sectionKey="process" fallbackHeadline="The Referral Process" fallbackItems={FALLBACK_STEPS} />
      </div>
    </div>
  );
}