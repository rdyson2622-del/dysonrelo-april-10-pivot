import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import LayoutToggleButton from './LayoutToggleButton';
import { useLayout } from '@/lib/LayoutContext';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { landscape } = useLayout();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen" style={{ background: '#808080' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto relative" style={{ background: '#808080' }}>
        {/* Toggle fixed in top-right corner */}
        <div className="fixed top-3 right-3 z-50">
          <LayoutToggleButton />
        </div>
        {/* Back button */}
        <div className="px-6 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: '#D4AF37', color: '#000' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        <div className={`mx-auto px-6 py-4 ${landscape ? 'max-w-5xl' : 'max-w-2xl'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}