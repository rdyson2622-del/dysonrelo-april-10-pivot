import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, MessageCircle, Map, Home } from 'lucide-react';

const GOLD = '#D4AF37';

export default function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-11 flex items-center gap-3 px-4"
        style={{ background: '#0a0a0a', borderBottom: `1px solid ${GOLD}30` }}>
        <button onClick={() => setOpen(!open)} style={{ color: GOLD }}>
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/dashboard" style={{ color: GOLD, marginLeft: 'auto' }}>
          <LayoutDashboard className="w-5 h-5" />
        </Link>
      </div>

      {/* Menu drawer */}
      {open && (
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-64 h-screen flex flex-col" style={{ background: '#0d0d0d', borderRight: `1px solid ${GOLD}30` }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${GOLD}20` }}>
              <span style={{ color: GOLD, fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em' }}>MENU</span>
              <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.6)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {[
                { icon: Home, label: 'Home', path: '/' },
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: Map, label: 'Roadmap', path: '/RelocationRoadmap' },
                { icon: MessageCircle, label: 'Chat', path: '/chat' },
              ].map(({ icon: Icon, label, path }) => (
                <Link key={path} to={path} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10"
                  style={{ color: '#fff' }}>
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}