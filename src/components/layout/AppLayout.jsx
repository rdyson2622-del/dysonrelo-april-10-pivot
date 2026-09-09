import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import TalkToUsPill from '../portal/TalkToUsPill';
import ReferralFloatingPill from '../portal/ReferralFloatingPill';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';
import PageNumberBadge from '../PageNumberBadge';
import { ArrowLeft } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import CommandPills from './CommandPills';
import PortalHomeButton from './PortalHomeButton';
import PortalAccessGuard from './PortalAccessGuard';
import LayoutToggleButton from './LayoutToggleButton';
import StudioAmbiencePlayer from '../charlie/StudioAmbiencePlayer';
import { useLayout } from '@/lib/LayoutContext';

const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { landscape } = useLayout();
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [portalRole, setPortalRole] = useState(() => sessionStorage.getItem('dyson_role'));

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    base44.auth.me().then(u => { if (u?.role === 'admin') setIsAdmin(true); }).catch(() => {});
  }, []);

  useEffect(() => {
    const onRoleChange = () => setPortalRole(sessionStorage.getItem('dyson_role'));
    window.addEventListener('dyson_role_change', onRoleChange);
    return () => window.removeEventListener('dyson_role_change', onRoleChange);
  }, []);

  // "Talk to us" pill is now the universal floating widget — every portal,
  // every page, with no exceptions, since it may become the primary
  // talking/voice entry point.

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
    <div className={`flex flex-col h-screen overflow-hidden ${landscape ? 'force-landscape' : ''}`} style={{ background: '#ede0cc' }}>
      {/* Top bar: Clean header with DysonRelo black pill & Concierge Music */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3" style={{ background: '#0d0d0d', borderBottom: '1.5px solid rgba(212,175,55,0.4)' }}>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile sidebar toggle button */}
          <div className="md:hidden">
            <PortalHomeButton
              onClick={toggleSidebar}
              label="STUDIO"
            />
          </div>

          {/* DYSONRELO PILL IN SOLID BLACK */}
          <div 
            onClick={() => navigate('/portal')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-2xl shadow-sm border border-[#D4AF37]/80 bg-black cursor-pointer hover:border-[#D4AF37] transition-all shrink-0"
            title="Return to DysonRelo Front Door"
          >
            <img
              src={DYSON_LOGO}
              alt="Dyson & Dyson"
              className="h-5 sm:h-6 w-auto object-contain shrink-0 drop-shadow"
            />
            <div className="leading-tight">
              <span
                className="font-bold text-xs sm:text-sm tracking-wide text-white block leading-tight whitespace-nowrap"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DysonRelo.com
              </span>
              <span className="hidden sm:block text-[8px] text-[#D4AF37] tracking-wider uppercase font-sans font-semibold leading-tight whitespace-nowrap">
                Nationwide Relocation Concierge
              </span>
            </div>
          </div>
        </div>

        {/* Right side tools: Concierge Music + Landscape Toggle + Back + Admin tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <StudioAmbiencePlayer />

          <LayoutToggleButton />

          <button
            onClick={() => {
              if (window.history?.state?.idx > 0) {
                navigate(-1);
              } else {
                navigate('/portal');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all hover:opacity-80 cursor-pointer"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {/* ── ADMIN-ONLY COMMAND PILLS ── */}
          {isAdmin && <CommandPills />}
        </div>
      </div>

      {/* Content area — sidebar is permanently docked on desktop */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile slide-out drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-xs" 
              onClick={toggleSidebar}
            />
            <div className="relative z-10 h-full max-w-[85vw] animate-in slide-in-from-left duration-200">
              <ClientSidebar onToggle={toggleSidebar} />
            </div>
          </div>
        )}

        {/* Sidebar — permanently docked on desktop as universal directory */}
        <div className="hidden md:block shrink-0 h-full">
          <ClientSidebar onToggle={undefined} />
        </div>
        {/* Main content */}
        <div className="flex-1 w-full overflow-auto pb-16 md:pb-0">
          <PortalAccessGuard>
            <Outlet />
          </PortalAccessGuard>
        </div>
      </div>
      <MobileBottomNav />
      <PageNumberBadge />
      <TalkToUsPill />
      <ReferralFloatingPill />
      <PWAInstallPrompt />
    </div>
  );
}