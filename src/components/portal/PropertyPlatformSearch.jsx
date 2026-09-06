import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const GOLD = '#D4AF37';

const HOMEPAGES = {
  zillow: 'https://www.zillow.com/',
  realtor: 'https://www.realtor.com/',
  redfin: 'https://www.redfin.com/',
};

/**
 * PropertyPlatformSearch — "search across all platforms" widget (Zillow /
 * Realtor / Redfin). Lives in the Client Portal scroll.
 */
export default function PropertyPlatformSearch() {
  const handleSearch = (platform) => {
    window.open(HOMEPAGES[platform] || '#', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto text-center"
    >
      <p className="text-sm mb-6" style={{ color: '#fff' }}>SEARCH ACROSS ALL PLATFORMS:</p>
      <h2 className="display-heading mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.3rem)', color: '#fff', letterSpacing: '0.08em', fontWeight: '500' }}>Where does your lifestyle take you next?</h2>
      <p className="text-lg mb-8" style={{ color: GOLD, letterSpacing: '0.05em' }}>Enter your destination.</p>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleSearch('zillow')}
            className="py-3 px-4 rounded-lg font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: GOLD, color: '#000' }}
          >
            Zillow <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSearch('realtor')}
            className="py-3 px-4 rounded-lg font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: GOLD, color: '#000' }}
          >
            Realtor <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSearch('redfin')}
            className="py-3 px-4 rounded-lg font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: GOLD, color: '#000' }}
          >
            Redfin <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto text-xs tracking-widest font-bold uppercase" style={{ color: '#888' }}>
        <div className="flex items-center justify-between mb-2">
          <div>100% FREE FOR BUYERS</div>
          <div>•</div>
          <div>HUMAN-MANAGED</div>
        </div>
        <div className="text-center">•</div>
        <div className="text-center">NATIONWIDE NETWORK</div>
      </div>
    </motion.div>
  );
}