import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
      <FloatingCharlie />
    </div>
  );
}