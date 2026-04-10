import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroMinimal = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    navigate('/RelocationIntake');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png"
            alt="Dyson & Dyson"
            className="h-24 w-auto"
          />
        </div>
        <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.15 }}>
          <span className="text-white block">CONCIERGE</span>
          <span className="gold-text-gradient block">RELOCATION MANAGEMENT</span>
        </h1>
        <p className="text-gray-400 text-base mt-2">54 Years of Expertise. AI-Powered Precision.</p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Considering a move? Where are you going?"
            className="w-full bg-[#1A1A1A] border-2 border-[#D4AF37]/30 text-white rounded-full py-5 px-8 pl-14 text-xl focus:outline-none focus:border-[#D4AF37] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] w-6 h-6" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#D4AF37] p-3 rounded-full hover:bg-[#B8962E] transition-colors">
            <ChevronRight className="text-black w-6 h-6" />
          </button>
        </div>
      </form>

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