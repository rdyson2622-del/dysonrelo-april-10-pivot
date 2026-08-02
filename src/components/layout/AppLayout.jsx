import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';
import PageNumberBadge from '../PageNumberBadge';
import { ArrowLeft } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import CommandPills from './CommandPills';
import PortalHomeButton from './PortalHomeButton';
import PortalAccessGuard from './PortalAccessGuard';
import LayoutToggleButton from './LayoutToggleButton';
import { useLayout } from '@/lib/LayoutContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { landscape } = useLayout();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

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
    <div className={`flex flex-col h-screen overflow-hidden ${landscape ? 'force-landscape' : ''}`} style={{ background: '#A9A9A9' }}>
      {/* Top bar spanning full width */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#0d0d0d' }}>
        <PortalHomeButton
          onClick={toggleSidebar}
          label="STUDIO"
        />

        {/* Landscape / Portrait toggle */}
        <LayoutToggleButton />

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
      {/* Content area — sidebar overlays content, never takes layout space */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main content — always full width */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar pb-16 md:pb-0">
          <PortalAccessGuard>
            <Outlet />
          </PortalAccessGuard>
        </div>
        {/* Sidebar overlay — slides over content when toggled, hidden on mobile */}
        {sidebarOpen && (
          <div className="absolute top-0 left-0 h-full z-40 hidden md:block shadow-2xl">
            <ClientSidebar />
          </div>
        )}
      </div>
      <MobileBottomNav />
      <PageNumberBadge />
      {!hideFloatingCharlie && <FloatingCharlie />}
      <PWAInstallPrompt />
    </div>
  );
}