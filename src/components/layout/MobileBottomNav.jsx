import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Newspaper, MessageCircle, Map } from 'lucide-react';

const GOLD = '#D4AF37';

const NAV_ITEMS = [
  { label: 'Home',      path: '/',          icon: Home },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Roadmap',   path: '/RelocationRoadmap', icon: Map },
  { label: 'DNN News',  path: '/dnn-news',  icon: Newspaper },
  { label: 'Messages',  path: '/communications-explainer', icon: MessageCircle },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 safe-area-bottom"
      style={{
        background: '#0d0d0d',
        borderTop: '1px solid rgba(212,175,55,0.25)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const active = location.pathname === path ||
          (path !== '/' && location.pathname.startsWith(path));
        return (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            style={{ color: active ? GOLD : 'rgba(255,255,255,0.45)' }}
          >
            <Icon className="w-5 h-5" style={{ strokeWidth: active ? 2.5 : 1.8 }} />
            <span className="text-[10px] font-semibold tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}