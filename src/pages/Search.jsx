import React from 'react';
import { motion } from 'framer-motion';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';
import PortalLeadInDuo from '@/components/portal/PortalLeadInDuo';
import StudioHeroBanner from '@/components/dnn/StudioHeroBanner';
import VendorBenefits from '@/components/portal/VendorBenefits';
import VendorAreaVettingForm from '@/components/portal/VendorAreaVettingForm';
import PropertyPlatformSearch from '@/components/portal/PropertyPlatformSearch';
import FindAProWidget from '@/components/portal/FindAProWidget';

const GOLD = '#D4AF37';

export default function Search() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000' }}>
      <StudioHeroBanner />
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl text-center"
        >
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png" alt="Dyson & Dyson" className="w-auto mx-auto mb-8" style={{ height: '60px' }} />

          <h1 className="display-heading mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#fff', letterSpacing: '0.08em', fontWeight: '500' }}>Vendor Portal</h1>
          <p className="text-lg mb-10" style={{ color: GOLD, letterSpacing: '0.05em' }}>Your vendor resources and utilities.</p>

          {/* Charlie & Bob — DNN strategy lead-in */}
          <PortalLeadInDuo />

          <VendorBenefits />

          <div className="rounded-2xl px-6 py-8 mb-10" style={{ background: '#0d0d0d' }}>
            <PropertyPlatformSearch />
          </div>

          <div className="rounded-2xl px-6 py-8 mb-10" style={{ background: '#0d0d0d' }}>
            <FindAProWidget
              label="National Vendor Utilities"
              subtitle="This is where your business gets placed once vetted — visible to clients across every portal."
            />
          </div>

          <div className="max-w-xl mx-auto text-left">
            <VendorAreaVettingForm />
          </div>

          <div className="mt-12 max-w-xl mx-auto text-left">
            <PortalSubscribeForm portalName="Vendor Utility" source="Vendor Portal" roleKey="vendor" dest="/search" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}