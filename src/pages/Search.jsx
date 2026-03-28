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
    <div className="min-h-screen flex flex-col" style={{ background: '#080808' }}>
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>SEARCH HOMES</p>
          <h1 className="display-heading text-5xl md:text-6xl mb-4" style={{ color: '#fff' }}>Find Your New Home</h1>
          <p className="text-sm mb-10" style={{ color: '#999' }}>Pick your platform and start browsing listings</p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleSearch('zillow')}
              className="w-full p-6 rounded-2xl font-bold text-lg transition-all border-2 flex flex-col items-center gap-3 hover:scale-105"
              style={{ borderColor: '#D4AF37', background: '#1a1a1a', color: '#D4AF37' }}
            >
              <span className="text-4xl">🏠</span>
              Zillow
            </button>
            <button
              onClick={() => handleSearch('realtor')}
              className="w-full p-6 rounded-2xl font-bold text-lg transition-all border-2 flex flex-col items-center gap-3 hover:scale-105"
              style={{ borderColor: '#D4AF37', background: '#1a1a1a', color: '#D4AF37' }}
            >
              <span className="text-4xl">🔑</span>
              Realtor.com
            </button>
            <button
              onClick={() => handleSearch('redfin')}
              className="w-full p-6 rounded-2xl font-bold text-lg transition-all border-2 flex flex-col items-center gap-3 hover:scale-105"
              style={{ borderColor: '#D4AF37', background: '#1a1a1a', color: '#D4AF37' }}
            >
              <span className="text-4xl">🔴</span>
              Redfin
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}