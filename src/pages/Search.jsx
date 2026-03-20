import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search as SearchIcon, Plus, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import ChatInterface from '../components/charlie/ChatInterface';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

export default function Search() {
  const [searchMode, setSearchMode] = useState('charlie'); // 'charlie' or 'browse'
  const [showCharlie, setShowCharlie] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleSearch = (platform) => {
    const location = searchParams.location || 'United States';
    let url;
    
    if (platform === 'zillow') {
      const params = new URLSearchParams();
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
      url = `https://www.zillow.com/homes/for_sale/${location}/?${params.toString()}`;
    } else if (platform === 'realtor') {
      const params = new URLSearchParams({ location });
      if (searchParams.minPrice) params.append('price_min', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('price_max', searchParams.maxPrice);
      url = `https://www.realtor.com/homes/for_sale/${location}?${params.toString()}`;
    } else if (platform === 'redfin') {
      const params = new URLSearchParams();
      if (searchParams.minPrice) params.append('min_price', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('max_price', searchParams.maxPrice);
      url = `https://www.redfin.com/homes/for_sale/${location}?${params.toString()}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080808' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-3 flex items-center gap-3 frosted-dark" style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <Link to="/Dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: '#D4AF37' }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/Home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
        <div>
          <h1 className="text-base font-black" style={{ color: '#ffffff' }}>Property Search</h1>
          <p className="text-xs" style={{ color: '#D4AF37' }}>Find your new home</p>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-3"
        >
          <button
            onClick={() => setSearchMode('charlie')}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all ${
              searchMode === 'charlie'
                ? 'gold-btn'
                : 'border'
            }`}
            style={{
              borderColor: searchMode === 'charlie' ? 'transparent' : 'rgba(212,175,55,0.3)',
              color: searchMode === 'charlie' ? '#000' : '#D4AF37',
            }}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Ask Charlie
          </button>
          <button
            onClick={() => setSearchMode('browse')}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all ${
              searchMode === 'browse'
                ? 'gold-btn'
                : 'border'
            }`}
            style={{
              borderColor: searchMode === 'browse' ? 'transparent' : 'rgba(212,175,55,0.3)',
              color: searchMode === 'browse' ? '#000' : '#D4AF37',
            }}
          >
            <SearchIcon className="w-4 h-4 inline mr-2" />
            Browse Listings
          </button>
        </motion.div>

        {/* Charlie Mode */}
        {searchMode === 'charlie' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="rounded-3xl p-8 mb-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#fff' }}>AI-Powered Property Search</h2>
              <p className="text-sm mb-6" style={{ color: '#888' }}>
                Tell Charlie exactly what you're looking for — neighborhood vibe, price range, school district, commute time. He'll match you with listings and explain why each property fits your needs.
              </p>
              <button
                onClick={() => setShowCharlie(!showCharlie)}
                className="gold-btn px-6 py-3 rounded-xl text-sm font-bold"
              >
                Start Conversation with Charlie
              </button>
            </div>

            {showCharlie && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[600px] rounded-2xl overflow-hidden"
              >
                <ChatInterface />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Browse Mode */}
        {searchMode === 'browse' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Filters */}
            <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid #222' }}>
              <h3 className="font-bold mb-4" style={{ color: '#fff' }}>Quick Search</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold mb-2 block" style={{ color: '#888' }}>LOCATION</label>
                  <Input
                    placeholder="City or zip code"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    style={{ background: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold mb-2 block" style={{ color: '#888' }}>MIN PRICE</label>
                  <Input
                    placeholder="$200,000"
                    value={searchParams.minPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                    style={{ background: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold mb-2 block" style={{ color: '#888' }}>MAX PRICE</label>
                  <Input
                    placeholder="$1,000,000"
                    value={searchParams.maxPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                    style={{ background: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                  />
                </div>
              </div>
              <p className="text-xs font-bold mb-3 tracking-widest" style={{ color: '#D4AF37' }}>CHOOSE YOUR PREFERRED PLATFORM</p>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => handleSearch('zillow')}
                  className="p-4 rounded-xl font-bold text-sm transition-all border-2 flex flex-col items-center gap-2"
                  style={{ borderColor: '#0074E4', background: 'rgba(0,116,228,0.05)', color: '#0074E4' }}
                >
                  <span className="text-lg">🏠</span>
                  Zillow
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSearch('realtor')}
                  className="p-4 rounded-xl font-bold text-sm transition-all border-2 flex flex-col items-center gap-2"
                  style={{ borderColor: '#D4145A', background: 'rgba(212,20,90,0.05)', color: '#D4145A' }}
                >
                  <span className="text-lg">🔑</span>
                  Realtor.com
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSearch('redfin')}
                  className="p-4 rounded-xl font-bold text-sm transition-all border-2 flex flex-col items-center gap-2"
                  style={{ borderColor: '#C41E3A', background: 'rgba(196,30,58,0.05)', color: '#C41E3A' }}
                >
                  <span className="text-lg">🔴</span>
                  Redfin
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs" style={{ color: '#666' }}>
                ⚠️ Opens your choice in a new tab. Soon: Direct MLS access — everything stays with us.
              </p>
            </div>

            {/* Placeholder Info */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex gap-3">
                <Home className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: GOLD }}>Coming Soon: Direct MLS Integration</h4>
                  <p className="text-xs" style={{ color: '#999' }}>
                    Once we integrate our broker MLS account, you'll search live listings directly here — no third-party redirects, full control, everything stays with us.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}