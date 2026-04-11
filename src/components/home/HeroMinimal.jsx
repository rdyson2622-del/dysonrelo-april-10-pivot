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
        navigate(`/Search?city=${encodeURIComponent(query.trim())}`);
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
        <p className="display-heading" style={{ fontSize: '3.325rem', color: '#fff', marginBottom: '0.5rem' }}>Concierge</p>
        <p className="display-heading" style={{ fontSize: '2.275rem', color: '#D4AF37', marginBottom: '6rem' }}>Relocation Management</p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
        <div className="relative group rounded-full px-8 py-6" style={{ background: '#1A1A1A', border: '2px solid rgba(212,175,55,0.3)' }}>
          <div className="mb-4 text-center">
            <p className="text-sm font-medium mb-1.5" style={{ color: '#fff', letterSpacing: '0.08em' }}>WHERE DOES YOUR LIFESTYLE TAKE YOU NEXT?</p>
            <p className="text-xs" style={{ color: '#D4AF37', letterSpacing: '0.05em' }}>Enter your destination.</p>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, State or Zip Code"
            disabled={scanning}
            className="w-full bg-transparent text-white py-2 px-8 pl-10 text-xl focus:outline-none disabled:opacity-70 placeholder-gray-500"
          />
          <Search className="absolute left-5 bottom-6 text-[#D4AF37] w-6 h-6" />
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