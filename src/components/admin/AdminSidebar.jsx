import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, UserCheck, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import CharlieAvatar from '../charlie/CharlieAvatar';

const navItems = [
  { label: 'Overview', path: '/Admin', icon: LayoutDashboard },
  { label: 'Listing Owners', path: '/AdminOwners', icon: Home },
  { label: 'Clients', path: '/AdminClients', icon: UserCheck },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
        <CharlieAvatar size="sm" />
        <div>
          <h1 className="font-bold text-base">ReloCharlie</h1>
          <p className="text-xs text-slate-400">Admin Panel</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to App */}
      <div className="p-3 border-t border-slate-700/50">
        <Link
          to="/Dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
      </div>
    </aside>
  );
}