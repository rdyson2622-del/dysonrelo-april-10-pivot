import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroMinimal = () => {
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim() || scanning) return;
    setScanning(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!scanning) return;
    const start = Date.now();
    const duration = 3000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        navigate(`/RelocationRoadmap?city=${encodeURIComponent(query.trim())}`);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [scanning]);

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

      <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, State or Zip Code"
            disabled={scanning}
            className="w-full bg-[#1A1A1A] border-2 border-[#D4AF37]/30 text-white rounded-full py-5 px-8 pl-14 text-xl focus:outline-none focus:border-[#D4AF37] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] disabled:opacity-70"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] w-6 h-6" />
          <button type="submit" disabled={scanning} className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#D4AF37] p-3 rounded-full hover:bg-[#B8962E] transition-colors disabled:opacity-50">
            <ChevronRight className="text-black w-6 h-6" />
          </button>
        </div>

        {scanning && (
          <div className="mt-4 px-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <p className="text-sm font-semibold tracking-wide" style={{ color: '#D4AF37' }}>
                Charlie is vetting local agents against the Dyson 54-year standard...
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #b8920a, #D4AF37, #e8c84a)',
                  boxShadow: '0 0 10px rgba(212,175,55,0.6)'
                }}
              />
            </div>
          </div>
        )}
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