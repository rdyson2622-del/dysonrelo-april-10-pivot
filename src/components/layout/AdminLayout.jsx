import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import LayoutToggleButton from './LayoutToggleButton';
import PageNumberBadge from '../PageNumberBadge';
import { useLayout } from '@/lib/LayoutContext';
import { ArrowLeft, Menu, X } from 'lucide-react';
import AdminCharliePanel from '../admin/AdminCharliePanel';

export default function AdminLayout() {
  const { landscape } = useLayout();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#808080' }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="fixed left-0 top-0 h-full w-56 z-50">
            <AdminSidebar />
          </div>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <main className="flex-1 overflow-auto relative" style={{ background: '#808080' }}>
        {/* Top Controls */}
        <div className="fixed top-3 left-3 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)' }}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
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
          <div className="px-4 pt-16 md:pt-4">
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
        <AdminCharliePanel />
      </main>
    </div>
  );
}