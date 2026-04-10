import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '../components/charlie/ChatInterface';

const GOLD = '#D4AF37';

export default function Search() {


  const handleSearch = (platform) => {
    const urls = {
      zillow: 'https://www.zillow.com/homes/for_sale/',
      realtor: 'https://www.realtor.com/homes/for_sale/',
      redfin: 'https://www.redfin.com/homes/'
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#808080' }}>
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>SEARCH HOMES</p>
          <h1 className="display-heading mb-4 whitespace-nowrap" style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2.2rem)', color: '#fff' }}>Find Your New Home</h1>
          <p className="text-sm mb-3" style={{ color: '#fff' }}>Pick your platform and start browsing listings</p>
          <p className="text-xs mb-10 leading-relaxed" style={{ color: '#ccc' }}>⚠️ These links open external websites. Click the back arrow at the top left of your browser to return to our site.</p>
          
          <div className="space-y-2">
            <button
              onClick={() => handleSearch('zillow')}
              className="w-full p-3 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 hover:scale-105"
              style={{ borderColor: '#D4AF37', background: '#1a1a1a', color: '#D4AF37' }}
            >
              <span className="text-xl">🏠</span>
              Zillow
            </button>
            <button
              onClick={() => handleSearch('realtor')}
              className="w-full p-3 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 hover:scale-105"
              style={{ borderColor: '#D4AF37', background: '#1a1a1a', color: '#D4AF37' }}
            >
              <span className="text-xl">🔑</span>
              Realtor.com
            </button>
            <button
              onClick={() => handleSearch('redfin')}
              className="w-full p-3 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 hover:scale-105"
              style={{ borderColor: '#D4AF37', background: '#1a1a1a', color: '#D4AF37' }}
            >
              <span className="text-xl">🔴</span>
              Redfin
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}