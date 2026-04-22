import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Newspaper, Home, DollarSign, MessageCircle } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const PILLARS = [
  {
    icon: Newspaper,
    title: 'Real Estate News',
    subtitle: '100% Free for Buyers',
    description: 'Market intelligence curated daily',
    href: '/dnn-news',
    color: '#60a5fa',
  },
  {
    icon: Home,
    title: 'Relocation Management',
    subtitle: 'Human-Managed · AI-Assisted',
    description: 'Your personal concierge',
    href: '/dashboard',
    color: GOLD,
  },
  {
    icon: DollarSign,
    title: 'Financial Services',
    subtitle: 'International · Local Expert',
    description: 'Vetted lender network',
    href: '/financial-services',
    color: '#4ade80',
  },
];

export default function AdminNewLandingPage() {
  const [destination, setDestination] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      // TODO: Route to search results or relocation intake
      console.log('Search for:', destination);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <div
        className="px-6 py-8 text-center border-b"
        style={{
          borderColor: 'rgba(212,175,55,0.15)',
          background: 'linear-gradient(180deg, #0d0d0d, #080808)',
        }}
      >
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto mx-auto mb-4" />
        <h1 className="display-heading text-4xl font-black tracking-[0.3em] uppercase text-white mb-2">
          Concierge
        </h1>
        <p className="text-sm tracking-[0.15em] font-bold uppercase mb-1" style={{ color: GOLD }}>
          Real Estate News and Management
        </p>
        <p className="text-sm text-white max-w-2xl mx-auto leading-relaxed italic">
          At Dyson & Dyson Companies: We don't sell real estate. We manage your entire move.
        </p>
      </div>

      {/* Search Hero */}
      <div className="px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.15em] font-bold text-white mb-4">
            Where does your lifestyle take you next?
          </p>
          <form onSubmit={handleSearch}>
            <div
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all"
              style={{
                borderColor: searchFocused ? GOLD : 'rgba(212,175,55,0.25)',
                background: searchFocused ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
              }}
            >
              <Search className="w-4 h-4" style={{ color: GOLD }} />
              <input
                type="text"
                placeholder="Enter your destination & include City, State or Zip Code"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pillars */}
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.title}
                  to={pillar.href}
                  className="group relative rounded-2xl p-6 transition-all hover:shadow-lg"
                  style={{
                    background: '#2a2a2a',
                    border: `1px solid rgba(212,175,55,0.15)`,
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all"
                      style={{
                        background: `${pillar.color}18`,
                        border: `1px solid ${pillar.color}30`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="serif-heading text-lg font-bold text-white mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: pillar.color }}>
                      {pillar.subtitle}
                    </p>
                    <p className="text-sm text-white flex-1 mb-4">{pillar.description}</p>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: pillar.color }}>
                      Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charlie CTA */}
      <div
        className="mx-6 mb-12 rounded-2xl p-6 border"
        style={{
          background: 'rgba(99,102,241,0.08)',
          borderColor: 'rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-bold mb-1">Questions about relocation?</p>
            <p className="text-sm text-white">
              Chat with Charlie, our AI concierge—available 24/7 to guide your entire move.
            </p>
          </div>
          <Link
            to="/chat"
            className="ml-4 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
            style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <MessageCircle className="w-4 h-4" />
            Chat Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center py-6 border-t"
        style={{ borderColor: 'rgba(212,175,55,0.1)' }}
      >
        <p className="text-xs text-slate-400">
          Dyson & Dyson Real Estate Concierge · CA DRE #02303118
        </p>
      </div>
    </div>
  );
}