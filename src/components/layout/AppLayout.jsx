import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';
import PageNumberBadge from '../PageNumberBadge';
import { ArrowLeft } from 'lucide-react';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show FloatingCharlie on pages that already have embedded chat
  const hideFloatingCharlie = ['/Chat', '/Dashboard'].some(path => 
    location.pathname.startsWith(path)
  );
  
  return (
    <div className="flex min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Left sidebar — desktop only */}
      <div className="hidden md:flex">
        <ClientSidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Back button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        <Outlet />
      </div>
      <PageNumberBadge />
      {!hideFloatingCharlie && <FloatingCharlie />}
      <PWAInstallPrompt />
    </div>
  );
}