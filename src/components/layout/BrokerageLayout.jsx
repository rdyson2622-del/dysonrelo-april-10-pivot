import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Home, Building2, Users, Megaphone, Star, ArrowLeft } from 'lucide-react';

const GOLD = '#D4AF37';

const NAV = [
  { to: '/brokerage', label: 'Dashboard', icon: Home, end: true },
  { to: '/brokerage/escrow', label: 'Escrow', icon: Shield },
  { to: '/brokerage/listings', label: 'Listings', icon: Building2 },
  { to: '/brokerage/agents', label: 'Agents', icon: Users },
  { to: '/brokerage/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/brokerage/luxury', label: 'Luxury', icon: Star },
];

export default function BrokerageLayout() {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ['authMe'],
    queryFn: () => base44.auth.me().catch(() => null),
  });
  const { data: brokerage } = useQuery({
    queryKey: ['myBrokerage'],
    queryFn: async () => {
      const list = await base44.entities.Brokerage.list();
      return list[0] || null;
    },
  });

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      <aside className="w-60 border-r flex flex-col shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#080808' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Broker/Agent Portal</p>
          <p className="text-sm font-serif text-white mt-1">{brokerage?.name || '—'}</p>
          {brokerage?.plan_tier === 'founder' && (
            <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}40`, color: GOLD }}>
              Founder Tier
            </span>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}30` }
                    : { border: '1px solid transparent' }
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Admin (Build)
            </button>
          )}
          <button
            onClick={() => base44.auth.logout('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}