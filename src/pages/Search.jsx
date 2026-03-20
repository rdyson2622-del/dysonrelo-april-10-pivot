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

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-2 tracking-wide" style={{ color: '#fff' }}>Where do you prefer to search?</h2>
          <p className="text-sm mb-8" style={{ color: '#999' }}>Pick your platform and start browsing listings</p>
          
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