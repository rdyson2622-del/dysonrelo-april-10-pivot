import React from 'react';
import { motion } from 'framer-motion';
import PortalLeadInDuo from '@/components/portal/PortalLeadInDuo';
import VendorBenefits from '@/components/portal/VendorBenefits';
import VendorAreaVettingForm from '@/components/portal/VendorAreaVettingForm';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';

export default function Search() {
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
          <PortalLeadInDuo />
          <VendorBenefits />

          <div className="max-w-xl mx-auto text-left mt-12">
            <VendorAreaVettingForm />
          </div>
        </motion.div>
      </main>
    </div>
  );
}