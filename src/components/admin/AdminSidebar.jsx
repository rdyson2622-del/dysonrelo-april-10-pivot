import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, Settings, ArrowLeft, Search, SendHorizontal } from 'lucide-react';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const navItems = [
  { label: 'Overview', path: '/Admin', icon: LayoutDashboard },
  { label: 'Find Listings', path: '/AdminListingSearch', icon: Search },
  { label: 'Listing Owners', path: '/AdminOwners', icon: Home },
  { label: 'Outreach Campaigns', path: '/AdminOutreachCampaigns', icon: SendHorizontal },
  { label: 'Clients', path: '/AdminClients', icon: UserCheck },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex flex-col min-h-screen shrink-0 frosted-dark" style={{ borderRight: '1px solid rgba(212,175,55,0.12)' }}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3" style={{ background: '#000', borderBottom: '1px solid #D4AF3733' }}>
        <Link to="/Home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
        <div>
          <h1 className="font-black text-sm tracking-tight" style={{ color: '#fff' }}>CONCIERGE</h1>
          <p className="text-xs tracking-widest font-light" style={{ color: '#555' }}>ADMIN PANEL</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: isActive ? '#D4AF37' : '#fff',
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to App */}
      <div className="p-3" style={{ borderTop: '1px solid #1a1a1a' }}>
        <Link
          to="/Dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
          onMouseLeave={e => e.currentTarget.style.color = '#fff'}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
      </div>
    </aside>
  );
}