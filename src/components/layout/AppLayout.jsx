import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import ClientSidebar from './ClientSidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Left sidebar — desktop only */}
      <div className="hidden md:flex">
        <ClientSidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <FloatingCharlie />
      <PWAInstallPrompt />
    </div>
  );
}