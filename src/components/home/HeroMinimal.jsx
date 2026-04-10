import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroMinimal = () => {

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4" style={{ paddingTop: '0.5rem', paddingBottom: '3rem' }}>
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png"
            alt="Dyson & Dyson"
            className="h-[5rem] w-auto"
          />
        </div>
        <p className="text-xs font-medium tracking-widest text-gray-500 mb-4">DO THIS INSTEAD OF TRYING TO THINK:</p>
        <h1 className="display-heading mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#fff', letterSpacing: '0.08em', fontWeight: '500' }}>
          Where does your lifestyle take you next?
        </h1>
        <p className="text-lg mb-6" style={{ color: '#D4AF37', letterSpacing: '0.05em' }}>Enter your destination.</p>
      </div>

      <Link to="/Search">
        <button className="px-8 py-3 rounded-full font-bold text-base tracking-wide" style={{ background: '#D4AF37', color: '#000' }} className="inline-flex items-center gap-2">
          Start Your Search <ArrowRight className="w-4 h-4" />
        </button>
      </Link>

      <div className="mt-20 flex gap-8 text-xs uppercase tracking-widest text-gray-500 font-medium">
        <span>100% Free for Buyers</span>
        <span className="text-[#D4AF37]/50">•</span>
        <span>Human-Managed</span>
        <span className="text-[#D4AF37]/50">•</span>
        <span>Nationwide Network</span>
      </div>
    </div>
  );
};

export default HeroMinimal;