import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Home, Zap, Settings, Phone, Map, GitCompare, Users, Search } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'My Dashboard',     path: '/',                 icon: LayoutDashboard },
  { label: 'My Roadmap',       path: '/RelocationRoadmap',   icon: Map },
  { label: 'Property Compare', path: '/PropertyComparison', icon: GitCompare },
  { label: 'City Guide',       path: '/CityGuide',           icon: MapPin },
  { label: 'Search Homes',     path: '/Search',           icon: Home },
  { label: 'Gemini Session',   path: '/GeminiSession',    icon: Zap },
];

const authorityLinks = [
  { label: '54-Year Legacy', to: '/bob-dyson' },
  { label: 'The 1927 Parallel', to: '/Explainers#1927' },
  { label: '21 AI Assistants', to: '/ai-assistants' },
];

export default function ClientSidebar() {
  const location = useLocation();

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
        {navItems.map(({ label, path, icon: Icon }) => {
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

      {/* Quick Access */}
      <div className="px-3 py-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[2px] px-2 font-bold" style={{ color: GOLD }}>
          Quick Links
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/CityGuide" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <MapPin className="w-3.5 h-3.5" /> City Guide
          </Link>
          <Link to="/Chat" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <Users className="w-3.5 h-3.5" /> Find Agent
          </Link>
          <Link to="/Search" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <Home className="w-3.5 h-3.5" /> Search Homes
          </Link>
        </div>
      </div>

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
    </aside>
  );
}