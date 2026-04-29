import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';
import PageNumberBadge from '../PageNumberBadge';
import { ArrowLeft } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import CommandPills from './CommandPills';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => { if (u?.role === 'admin') setIsAdmin(true); }).catch(() => {});
  }, []);
  
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
        {isAdmin && <CommandPills />}

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