import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import LayoutToggleButton from './LayoutToggleButton';
import { useLayout } from '@/lib/LayoutContext';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { landscape } = useLayout();
  return (
    <div className="flex min-h-screen" style={{ background: '#808080' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto relative" style={{ background: '#808080' }}>
        {/* Toggle fixed in top-right corner */}
        <div className="fixed top-3 right-3 z-50">
          <LayoutToggleButton />
        </div>
        <div className={`mx-auto ${landscape ? 'max-w-5xl' : 'max-w-2xl'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}