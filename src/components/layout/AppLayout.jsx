import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';
import PageNumberBadge from '../PageNumberBadge';
import { ArrowLeft, PanelLeft } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import CommandPills from './CommandPills';
import PortalHomeButton from './PortalHomeButton';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => sessionStorage.getItem('dyson_sidebar_expanded') === 'true');
  const [portalRole, setPortalRole] = useState(() => sessionStorage.getItem('dyson_role') || 'client');

  useEffect(() => {
    const onRoleChange = () => setPortalRole(sessionStorage.getItem('dyson_role') || 'client');
    window.addEventListener('dyson_role_change', onRoleChange);
    return () => window.removeEventListener('dyson_role_change', onRoleChange);
  }, []);

  const PORTAL_LABELS = {
    client: 'CLIENT PORTAL',
    agent: 'RELOCATION AGENT PORTAL',
    referral_agent: 'REFERRAL AGENT PORTAL',
    vendor: 'VENDOR PORTAL',
    hr: 'CORPORATE HR PORTAL',
  };

  const PORTAL_HOMES = {
    client: '/home',
    agent: '/find-agent',
    referral_agent: '/partner-benefits',
    vendor: '/search',
    hr: '/corporate-relo',
  };

  const routePortalRole = {
    '/find-agent': 'agent',
    '/partner-benefits': 'referral_agent',
    '/search': 'vendor',
    '/corporate-relo': 'hr',
  }[location.pathname];
  const currentPortalRole = routePortalRole || portalRole;

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      sessionStorage.setItem('dyson_sidebar_expanded', String(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    base44.auth.me().then(u => { if (u?.role === 'admin') setIsAdmin(true); }).catch(() => {});
  }, []);
  
  // Don't show FloatingCharlie on pages that already have embedded chat
  const hideFloatingCharlie = ['/Chat', '/Dashboard', '/dnn-news'].some(path => 
     location.pathname.startsWith(path)
   );

  // Video pipeline mode: strip ALL portal chrome and render only the page.
  const isVideoMode = new URLSearchParams(location.search).get('videoMode') === 'true';
  if (isVideoMode) {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ background: '#0d0d0d' }}>
        <Outlet />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#A9A9A9' }}>
      {/* Top bar spanning full width */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#0d0d0d' }}>
        <PortalHomeButton
          onClick={() => navigate(PORTAL_HOMES[currentPortalRole] || '/home')}
          label={PORTAL_LABELS[currentPortalRole] || 'CLIENT PORTAL'}
        />

        {/* Portal box toggles the sidebar */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 text-xs font-black tracking-[0.15em] px-4 py-2 rounded-lg transition-all hover:opacity-90"
          style={{ background: '#0d0d0d', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.5)' }}
        >
          <PanelLeft className="w-4 h-4" />
          {PORTAL_LABELS[currentPortalRole] || 'CLIENT PORTAL'}
        </button>

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
      </div>
      {/* Content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — desktop only, toggled by the Client Portal box */}
        {sidebarOpen && (
          <div className="hidden md:flex">
            <ClientSidebar />
          </div>
        )}
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