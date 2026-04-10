import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChatInterface from '../components/charlie/ChatInterface';

const GOLD = '#D4AF37';

export default function Search() {
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      // Navigate to intake or roadmap with location
      window.location.href = `/relocation-intake?city=${encodeURIComponent(location)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000' }}>
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl text-center"
        >
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png" alt="Dyson & Dyson" className="w-auto mx-auto mb-8" style={{ height: '60px' }} />
          
          <h1 className="display-heading mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', letterSpacing: '0.15em' }}>CONCIERGE</h1>
          <p className="display-heading mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', color: GOLD, letterSpacing: '0.15em' }}>RELOCATION MANAGEMENT</p>
          
          <p className="text-base mb-10" style={{ color: '#aaa' }}>54 Years of Expertise. AI-Powered Precision.</p>
          
          <form onSubmit={handleSearch} className="mb-16 max-w-xl mx-auto">
            <div className="flex items-center rounded-full border-2 px-6 py-4" style={{ borderColor: GOLD, background: '#1a1a1a' }}>
              <span className="text-lg mr-3" style={{ color: GOLD }}>🔍</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Zip Code"
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
              />
              <button
                type="submit"
                className="ml-3 p-2 rounded-full transition-all hover:scale-110"
                style={{ background: GOLD, color: '#000' }}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto text-xs tracking-widest font-bold uppercase" style={{ color: '#888' }}>
            <div>100% FREE FOR BUYERS</div>
            <div>•</div>
            <div>HUMAN-MANAGED</div>
            <div colSpan="3" style={{ color: '#888' }}>•</div>
            <div colSpan="3">NATIONWIDE NETWORK</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}