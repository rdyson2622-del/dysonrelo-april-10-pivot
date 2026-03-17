import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingCharlie from '../charlie/FloatingCharlie';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import LayoutToggleButton from './LayoutToggleButton';
import { useLayout } from '@/lib/LayoutContext';

export default function AppLayout() {
  const { landscape } = useLayout();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toggle fixed in top-right corner */}
      <div className="fixed top-3 right-3 z-50">
        <LayoutToggleButton />
      </div>
      <div className={`mx-auto ${landscape ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <Outlet />
      </div>
      <FloatingCharlie />
      <PWAInstallPrompt />
    </div>
  );
}