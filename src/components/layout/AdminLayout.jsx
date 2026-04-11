import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import LayoutToggleButton from './LayoutToggleButton';
import PageNumberBadge from '../PageNumberBadge';
import { useLayout } from '@/lib/LayoutContext';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { landscape } = useLayout();
  const navigate = useNavigate();
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#D8C4A8' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto relative" style={{ background: '#D8C4A8' }}>
        {/* Top-right controls */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)' }}
          >
            Client View
          </Link>
          <LayoutToggleButton />
        </div>
        <div className={`mx-auto ${landscape ? 'max-w-5xl' : 'max-w-2xl'}`}>
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
      </main>
    </div>
  );
}