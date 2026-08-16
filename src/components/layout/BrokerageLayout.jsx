import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Shield, Building2, Users, Megaphone, Star,
  ArrowLeft, Loader2, Home
} from 'lucide-react';
import BrokerageOnboarding from '@/components/brokerage/BrokerageOnboarding';

const GOLD = '#D4AF37';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, path: '/brokerage' },
  { id: 'escrow',     label: 'Escrow',      icon: Shield,          path: '/brokerage/escrow' },
  { id: 'listings',   label: 'Listings',    icon: Building2,      path: '/brokerage/listings' },
  { id: 'agents',     label: 'Agents',      icon: Users,          path: '/brokerage/agents' },
  { id: 'marketing',  label: 'Marketing',   icon: Megaphone,      path: '/brokerage/marketing' },
  { id: 'luxury',     label: 'Luxury',      icon: Star,           path: '/brokerage/luxury' },
];

export default function BrokerageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

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
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-white/5 flex flex-col" style={{ background: '#080808' }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/5">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: GOLD }} />
              <span className="text-xs text-gray-500">Loading…</span>
            </div>
          ) : brokerage ? (
            <div>
              <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                {brokerage.plan_tier === 'founder' ? 'Founder Subscriber' : 'Brokerage Portal'}
              </p>
              <h2 className="text-base font-serif text-white leading-tight">{brokerage.name}</h2>
              <p className="text-[10px] text-gray-600 mt-1">
                {brokerage.status === 'active' ? '● Active' : brokerage.status}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500">No brokerage assigned</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
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
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer — role switch */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Front Door</span>
          </button>
          {isPlatformAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#aaa' }}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Admin</span>
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

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}