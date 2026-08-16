import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Shield, Building2, Users, Megaphone, Star,
  ArrowLeft, Loader2, Home, PanelLeftClose, PanelLeftOpen, FileSearch
} from 'lucide-react';
import BrokerageOnboarding from '@/components/brokerage/BrokerageOnboarding';
import BrokerageAlertBanner from '@/components/brokerage/BrokerageAlertBanner';

const GOLD = '#D4AF37';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, path: '/brokerage' },
  { id: 'escrow',     label: 'Escrow',      icon: Shield,          path: '/brokerage/escrow' },
  { id: 'audit',      label: 'Doc Audit',   icon: FileSearch,     path: '/brokerage/audit' },
  { id: 'listings',   label: 'Listings',    icon: Building2,      path: '/brokerage/listings' },
  { id: 'agents',     label: 'Agents',      icon: Users,          path: '/brokerage/agents' },
  { id: 'marketing',  label: 'Marketing',   icon: Megaphone,      path: '/brokerage/marketing' },
  { id: 'luxury',     label: 'Luxury',      icon: Star,           path: '/brokerage/luxury' },
];

export default function BrokerageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('brokerage_sidebar_collapsed')) || false; }
    catch { return false; }
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      // Not authenticated — send to login, return here after
      base44.auth.redirectToLogin(window.location.pathname);
    });
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('brokerage_sidebar_collapsed', JSON.stringify(next));
      return next;
    });
  };

  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;

  // Fetch the brokerage record — admin sees the first (Wisdom), brokerage users see their own
  const { data: brokerage, isLoading } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) {
        return await base44.entities.Brokerage.get(userBrokerageId);
      }
      return null;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const isPlatformAdmin = user.role === 'admin';

  // Gate: non-admin users without a brokerage_id must complete onboarding first
  if (!isPlatformAdmin && !userBrokerageId) {
    return <BrokerageOnboarding />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* ── Sidebar (collapsible) ── */}
      <aside
        className="shrink-0 border-r border-white/5 flex flex-col transition-all duration-300"
        style={{ background: '#080808', width: collapsed ? 64 : 240 }}
      >
        {/* Brand + collapse toggle */}
        <div className="px-3 py-4 border-b border-white/5">
          <div className="flex items-center justify-between gap-2">
            {!collapsed && (
              isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: GOLD }} />
                  <span className="text-xs text-gray-500">Loading…</span>
                </div>
              ) : brokerage ? (
                <div className="min-w-0">
                  <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                    {brokerage.plan_tier === 'founder' ? 'Founder Subscriber' : 'Brokerage Portal'}
                  </p>
                  <h2 className="text-base font-serif text-white leading-tight truncate">{brokerage.name}</h2>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {brokerage.status === 'active' ? '● Active' : brokerage.status}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No brokerage</p>
              )
            )}
            <button
              onClick={toggleSidebar}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888' }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                  color: isActive ? GOLD : '#888',
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer — role switch */}
        <div className="px-2 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white transition-colors"
            title={collapsed ? 'Front Door' : undefined}
          >
            <Home className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Front Door</span>}
          </button>
          {isPlatformAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#aaa' }}
              title={collapsed ? 'Back to Admin' : undefined}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Back to Admin</span>}
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 sticky top-0 z-10" style={{ background: '#0a0a0a' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
              Broker/Agent Portal
            </span>
            {isPlatformAdmin && (
              <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}>
                Admin View
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>

        {/* Real-time critical alerts — live across all portal pages */}
        <BrokerageAlertBanner />

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}