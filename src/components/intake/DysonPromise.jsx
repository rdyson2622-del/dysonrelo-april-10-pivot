import React from 'react';
import { motion } from 'framer-motion';

const GOLD = '#D4AF37';

export default function DysonPromise() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl px-6 md:px-12 py-12 mb-10 text-center"
      style={{ background: '#ece3d5' }}
    >
      <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>
        THE DYSON PROMISE
      </p>

      <h2 className="display-heading mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', letterSpacing: '0.12em', color: '#1a1a1a' }}>
        WE DON'T SEND YOU A MAP.
      </h2>
      <h2 className="display-heading mb-6" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', letterSpacing: '0.12em', color: GOLD }}>
        WE MAKE THE JOURNEY WITH YOU.
      </h2>

      <p className="max-w-2xl mx-auto text-base leading-relaxed mb-5" style={{ color: '#333333' }}>
        We are <span style={{ color: GOLD, fontWeight: 600 }}>Relocation Managers</span>. Not Agents. Not a listing service. We help families and professionals sell their current home and find their next one, anywhere in the country. Every step below is something Charlie and your Dyson team actively execute on your behalf, all the way through close of escrow and beyond.
      </p>

      <p className="max-w-2xl mx-auto text-base leading-relaxed italic" style={{ color: '#333333' }}>
        We intentionally work with a limited number of families at any given time. This isn't exclusivity — it's commitment. Real relocation management requires deep local focus, market expertise, timeline coordination, and relentless attention to detail. We're not scaling a service. We're delivering one.
      </p>
    </motion.div>
  );
}