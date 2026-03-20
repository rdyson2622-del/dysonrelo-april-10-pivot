import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, MapPin, Home, Zap, Settings } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'My Dashboard',     path: '/Dashboard',   icon: LayoutDashboard },
  { label: 'Chat with Charlie', path: '/Chat',        icon: MessageCircle },
  { label: 'City Guide',        path: '/CityGuide',   icon: MapPin },
  { label: 'Search Homes',      path: '/Search',      icon: Home },
  { label: 'Gemini Session',    path: '/GeminiSession', icon: Zap },
];

export default function ClientSidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 shrink-0 flex flex-col min-h-screen"
      style={{ background: '#0d0d0d', borderRight: `1px solid rgba(212,175,55,0.15)` }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        </Link>
        <p className="text-xs mt-2 tracking-widest font-semibold" style={{ color: 'rgba(212,175,55,0.6)' }}>
          CLIENT PORTAL
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'text-black' : 'hover:bg-white/5'}`}
                style={{
                  background: active ? GOLD : 'transparent',
                  color: active ? '#000' : 'rgba(255,255,255,0.75)',
                }}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
        <Link to="/Admin">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-all"
            style={{ color: 'rgba(212,175,55,0.6)' }}>
            <Settings className="w-4 h-4 shrink-0" />
            Admin Panel
          </div>
        </Link>
      </div>
    </aside>
  );
}