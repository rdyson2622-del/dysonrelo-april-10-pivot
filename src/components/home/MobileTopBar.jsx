import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, MessageCircle, Newspaper, Map, UserCircle, Home, DollarSign, Users } from 'lucide-react';

const GOLD = '#D4AF37';

const NAV_ITEMS = [
  { label: 'Home', path: '/', Icon: Home },
  { label: 'Client Dashboard', path: '/dashboard', Icon: LayoutDashboard },
  { label: 'My Relocation Roadmap', path: '/RelocationRoadmap', Icon: Map },
  { label: 'Chat with Charlie', path: '/chat', Icon: MessageCircle },
  { label: 'DNN News', path: '/dnn-news', Icon: Newspaper },
  { label: 'My Agent', path: '/my-agent', Icon: Users },
  { label: 'Financial Services', path: '/financial-services', Icon: DollarSign },
  { label: 'My Profile', path: '/dashboard', Icon: UserCircle },
];

export default function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Slim top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-11"
        style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        
        {/* Hamburger */}
        <button onClick={() => setOpen(true)} className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: GOLD }}>
          <Menu className="w-5 h-5" />
        </button>

        {/* Portal link */}
        <Link to="/dashboard"
          className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
          style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
          Portal
        </Link>
      </div>

      {/* Overlay + Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          {/* Drawer */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full flex flex-col"
            style={{ background: '#0d0d0d', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
            
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>Menu</p>
              <button onClick={() => setOpen(false)} className="transition-colors hover:bg-white/5 p-1 rounded"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Label */}
            <p className="px-5 pt-5 pb-2 text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>
              Client Portal
            </p>

            {/* Nav links */}
            <nav className="flex-1 px-3 space-y-1">
              {NAV_ITEMS.map(({ label, path, Icon }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-white/5 active:bg-white/10"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-5 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Dyson & Dyson · 55 Years of Relocation Management
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}