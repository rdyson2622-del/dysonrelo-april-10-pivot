import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import VendorBenefits from '@/components/portal/VendorBenefits';
import VendorAreaVettingForm from '@/components/portal/VendorAreaVettingForm';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';
import CharliePagePresenter from '@/components/charlie/CharliePagePresenter';

export default function Search() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    base44.auth.me().then((user) => {
      if (!user?.email) { setChecked(true); return; }
      base44.entities.VendorInterest.filter({ email: user.email }, '-created_date', 1).then((recs) => {
        setIsSubscribed(recs.length > 0);
        setChecked(true);
      }).catch(() => setChecked(true));
    }).catch(() => setChecked(true));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#ede0cc' }}>
      <ClientHeroMockup
        label="Your Vendor Portal"
        quoteLine1='"We connect relocating clients with the vetted professionals who make every move happen —'
        quoteLine2="title, escrow, lending, inspection, appraisal, moving, and more."
        attribution="— Bob Dyson"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <VendorBenefits />

          {checked && !isSubscribed && (
            <div className="max-w-xl mx-auto text-left mt-12">
              <VendorAreaVettingForm />
            </div>
          )}
        </motion.div>
      </main>

      {/* Charlie — page-specific explainer for the Vendor Portal, pinned right */}
      <CharliePagePresenter pageKey="portal-vendor" />
    </div>
  );
}