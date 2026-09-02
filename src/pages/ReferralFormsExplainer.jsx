import React from 'react';
import ReferralSectionExplainer from '@/components/referral/ReferralSectionExplainer';

const GOLD = '#D4AF37';
const FALLBACK_ITEMS = [
  'Independent Contractor Agreement with The Dyson & Dyson Companies, Inc — signed once at onboarding.',
  'DRE license number and expiration confirmed by you on your personal portal page.',
  'No MLS paperwork, no listing agreements — you never take on transaction liability.',
  'All forms are kept on file and available any time by contacting our team.',
];

export default function ReferralFormsExplainer() {
  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-center" style={{ color: GOLD }}>
          Referral Agent Network
        </p>
        <ReferralSectionExplainer sectionKey="forms" fallbackHeadline="Your Referral Forms" fallbackItems={FALLBACK_ITEMS} />
      </div>
    </div>
  );
}