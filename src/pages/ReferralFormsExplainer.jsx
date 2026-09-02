import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ReferralSectionExplainer from '@/components/referral/ReferralSectionExplainer';

const GOLD = '#D4AF37';
const FALLBACK_ITEMS = [
  'Independent Contractor Agreement with The Dyson & Dyson Companies, Inc — signed once at onboarding.',
  'DRE license number and expiration confirmed by you on your personal portal page.',
  'No MLS paperwork, no listing agreements — you never take on transaction liability.',
  'All forms are kept on file and available any time by contacting our team.',
];

export default function ReferralFormsExplainer() {
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
          <ReferralSectionExplainer sectionKey="forms" fallbackHeadline="Your Referral Forms" fallbackItems={FALLBACK_ITEMS} />
        </div>
      </div>
    </div>
  );
}