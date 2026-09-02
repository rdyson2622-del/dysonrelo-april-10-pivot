import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ReferralSectionExplainer from '@/components/referral/ReferralSectionExplainer';

const GOLD = '#D4AF37';
const FALLBACK_STEPS = [
  'You introduce us to your client before they leave — one text or email is all it takes.',
  'We match them with a vetted, full-time relocation agent in their destination market.',
  'Your client gets full concierge support: agent matching, city guides, and move coordination.',
  'When they close, your referral fee is paid — no listing work or liability on your end.',
];

export default function ReferralProcessExplainer() {
  const navigate = useNavigate();
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
            Referral Agent Network
          </p>
          <ReferralSectionExplainer sectionKey="process" fallbackHeadline="The Referral Process" fallbackItems={FALLBACK_STEPS} />
        </div>
      </div>
    </div>
  );
}