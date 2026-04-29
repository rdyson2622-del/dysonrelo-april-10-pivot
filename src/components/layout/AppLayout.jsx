import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';
import PageNumberBadge from '../PageNumberBadge';
import { ArrowLeft } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';

const PORTAL_PILLS = [
  { label: 'CLIENT', emoji: '🏠', role: 'client' },
  { label: 'AGENT',  emoji: '⭐', role: 'agent'  },
  { label: 'VENDOR', emoji: '🔧', role: 'vendor'  },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeRole, setActiveRole] = useState(() => sessionStorage.getItem('dyson_role') || 'client');

  useEffect(() => {
    base44.auth.me().then(u => { if (u?.role === 'admin') setIsAdmin(true); }).catch(() => {});
  }, []);

  const switchRole = (role) => {
    sessionStorage.setItem('dyson_role', role);
    setActiveRole(role);
    // Broadcast so ClientSidebar re-reads sessionStorage
    window.dispatchEvent(new Event('dyson_role_change'));
  };
  
  // Don't show FloatingCharlie on pages that already have embedded chat
  const hideFloatingCharlie = ['/Chat', '/Dashboard'].some(path => 
    location.pathname.startsWith(path)
  );
  
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#A9A9A9' }}>
      {/* Top bar spanning full width */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#A9A9A9' }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
          style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex-1" />

        {/* ── ADMIN-ONLY COMMAND PILLS ── */}
        {isAdmin && (
          <div className="flex items-center gap-1.5">
            {PORTAL_PILLS.map(({ label, emoji, role }) => {
              const isActive = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: isActive
                      ? 'rgba(212,175,55,0.25)'
                      : 'rgba(0,0,0,0.45)',
                    border: `1px solid ${isActive ? '#D4AF37' : 'rgba(212,175,55,0.35)'}`,
                    color: isActive ? '#D4AF37' : 'rgba(212,175,55,0.7)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: isActive ? '0 0 10px rgba(212,175,55,0.2)' : 'none',
                  }}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              );
            })}
            {/* Admin pill — navigates directly */}
            <Link
              to="/admin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(212,175,55,0.35)',
                color: 'rgba(212,175,55,0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <span>⚙️</span><span>ADMIN</span>
            </Link>
          </div>
        )}

        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          Dashboard
        </Link>
      </div>
      {/* Content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — desktop only */}
        <div className="hidden md:flex">
          <ClientSidebar />
        </div>
        {/* Main content */}
        <div className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </div>
      </div>
      <MobileBottomNav />
      <PageNumberBadge />
      {!hideFloatingCharlie && <FloatingCharlie />}
      <PWAInstallPrompt />
    </div>
  );
}