import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Zap, Settings, Phone, Map, GitCompare, Users, Search, ExternalLink } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'My Dashboard',     path: '/',                 icon: LayoutDashboard },
  { label: 'My Roadmap',       path: '/RelocationRoadmap',   icon: Map },
  { label: 'City Guide',       path: '/CityGuide',           icon: MapPin },
  { label: 'Gemini Session',   path: '/GeminiSession',    icon: Zap },
];

const authorityLinks = [
  { label: '54-Year Legacy', to: '/bob-dyson' },
  { label: 'The 1927 Parallel', to: '/Explainers#1927' },
  { label: '21 AI Assistants', to: '/ai-assistants' },
];

export default function ClientSidebar() {
  const location = useLocation();
  const [searchLocation, setSearchLocation] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const openSearchPlatform = (platform) => {
    if (!searchLocation.trim()) return;
    const query = encodeURIComponent(searchLocation);
    const urls = {
      zillow: `https://www.zillow.com/homes/for_sale/?searchQueryState={%22usersSearchTerm%22:%22${query}%22}`,
      realtor: `https://www.realtor.com/homes/search/${query}`,
      redfin: `https://www.redfin.com/search?utf8=%E2%9C%93&market=${query}`
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col min-h-screen"
      style={{ background: '#0d0d0d', borderRight: '1px solid rgba(212,175,55,0.15)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        </Link>
        <p className="text-xs mt-2 tracking-widest font-semibold" style={{ color: GOLD }}>
          CLIENT PORTAL
        </p>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1">
        {/* My Dashboard */}
        {(() => {
          const item = navItems[0];
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link to={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'text-black' : 'hover:bg-white/5'}`}
                style={{
                  background: active ? GOLD : 'transparent',
                  color: active ? '#000' : '#fff',
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          );
        })()}
      </nav>

      {/* Quick Links */}
      <div className="px-3 py-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[2px] px-2 font-bold" style={{ color: GOLD }}>
          Quick Links
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowSearchModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10 w-full text-left" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <Search className="w-3.5 h-3.5" /> Search Homes
          </button>
          <Link to="/FindAgent" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <Users className="w-3.5 h-3.5" /> Find Agent
          </Link>
          <Link to="/PropertyComparison" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <GitCompare className="w-3.5 h-3.5" /> Compare
          </Link>
        </div>
      </div>

      {/* Rest of Nav */}
      <nav className="px-3 space-y-1">
        {navItems.slice(1).map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'text-black' : 'hover:bg-white/5'}`}
                style={{
                  background: active ? GOLD : 'transparent',
                  color: active ? '#000' : '#fff',
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Heritage & Authority */}
      <div className="pt-4 border-t mx-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="text-[10px] uppercase tracking-[2px] mb-3 px-2 font-bold" style={{ color: GOLD }}>
          Our Authority
        </div>
        <nav className="space-y-1">
          {authorityLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="block px-2 py-1 text-sm transition-colors hover:text-[#D4AF37]"
              style={{ color: '#fff' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Human Help */}
      <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <p className="text-xs font-bold tracking-widest mb-1" style={{ color: GOLD }}>NEED A HUMAN?</p>
        <p className="text-xs mb-2" style={{ color: '#fff' }}>We're here Mon–Sat, 9am–7pm PT</p>
        <a href="tel:+18583531200" className="flex items-center gap-2 group">
          <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
          <span className="text-sm font-bold tracking-wide group-hover:underline" style={{ color: '#fff' }}>
            (858) 353-1200
          </span>
        </a>
        <p className="text-xs mt-1" style={{ color: '#fff' }}>Dyson Relo Direct Line</p>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 pb-8 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
        <Link to="/admin">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-all"
            style={{ color: '#fff' }}>
            <Settings className="w-4 h-4 shrink-0" />
            Admin Panel
          </div>
        </Link>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSearchModal(false)}>
          <div className="bg-black rounded-2xl p-8 max-w-sm w-full mx-4 border" style={{ borderColor: 'rgba(212,175,55,0.3)' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl mb-4" style={{ color: '#fff' }}>Search Homes</h3>
            <input
              type="text"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && searchLocation.trim() && openSearchPlatform('zillow')}
              placeholder="City, State or Zip Code"
              className="w-full rounded-lg px-4 py-2 mb-4 text-sm" 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              autoFocus
            />
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => openSearchPlatform('zillow')} disabled={!searchLocation.trim()} className="py-2 rounded-lg font-bold text-xs transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1" style={{ background: '#D4AF37', color: '#000' }}>
                Zillow <ExternalLink className="w-3 h-3" />
              </button>
              <button onClick={() => openSearchPlatform('realtor')} disabled={!searchLocation.trim()} className="py-2 rounded-lg font-bold text-xs transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1" style={{ background: '#D4AF37', color: '#000' }}>
                Realtor <ExternalLink className="w-3 h-3" />
              </button>
              <button onClick={() => openSearchPlatform('redfin')} disabled={!searchLocation.trim()} className="py-2 rounded-lg font-bold text-xs transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1" style={{ background: '#D4AF37', color: '#000' }}>
                Redfin <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <button onClick={() => setShowSearchModal(false)} className="w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}