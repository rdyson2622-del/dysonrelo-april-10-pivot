import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Building2, Handshake, Briefcase, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const PORTALS = [
  { label: 'Studio', icon: Home, dest: '/?choose=1', external: true },
  { label: 'Client', icon: Users, dest: '/dashboard' },
  { label: 'Relo Agent', icon: Building2, dest: '/find-agent' },
  { label: 'Referral Agent', icon: Handshake, dest: '/partner-benefits' },
  { label: 'Vendor', icon: Briefcase, dest: '/financial-services' },
  { label: 'Admin', icon: Shield, dest: '/admin' },
];

/**
 * AdminPortalBar — inline horizontal bar of portal pills visible across the
 * top of the admin layout. Replaces the dropdown switcher so all portals are
 * immediately accessible without a click.
 *
 * SECURITY: Rendered ONLY inside AdminLayout (admin-only).
 */
export default function AdminPortalBar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // ── HARD SECURITY GUARD ──
  // This component renders cross-portal navigation including the Admin link.
  // It must NEVER be visible to non-admins, subscribers, visitors, or
  // unauthenticated users. Even though callers also guard, this internal
  // check ensures defense-in-depth — if someone accidentally renders
  // <AdminPortalBar /> in a public layout, it returns null.
  useEffect(() => {
    base44.auth.me()
      .then(u => { if (u?.role === 'admin') setIsAdmin(true); })
      .catch(() => setIsAdmin(false));
  }, []);

  if (!isAdmin) return null;

  const go = (item) => {
    if (item.external) {
      window.location.href = item.dest;
    } else {
      navigate(item.dest);
    }
  };

  return (
    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
      {PORTALS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => go(item)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-[0.1em] uppercase transition-all hover:scale-[1.05]"
            style={{ color: GOLD, border: '1px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}50`; e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon className="w-3 h-3" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}