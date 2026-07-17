import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, Building2, Handshake, Briefcase, Shield } from 'lucide-react';

const GOLD = '#D4AF37';

const PORTAL_DIRECTORIES = [
  { label: 'Studio Home', desc: '3-pillar studio selector', icon: Home, dest: '/?choose=1', external: true },
  { label: 'Client Portal', desc: 'Relocation concierge dashboard', icon: Users, dest: '/dashboard' },
  { label: 'Relocation Agent Network', desc: 'Vetted destination agents', icon: Building2, dest: '/find-agent' },
  { label: 'Referral Agent Network', desc: 'Sending agent partner portal', icon: Handshake, dest: '/partner-benefits' },
  { label: 'Vendor Portal', desc: 'Lenders & service vendors', icon: Briefcase, dest: '/financial-services' },
  { label: 'Admin Dashboard', desc: 'Master admin control center', icon: Shield, dest: '/admin' },
];

/**
 * AdminPortalSwitcher — a multi-portal navigation dropdown.
 *
 * SECURITY: Rendered ONLY inside AdminLayout. Authenticated administrators use
 * it to jump between portals. It must never appear on client-facing pages.
 */
export default function AdminPortalSwitcher() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const go = (item) => {
    setMenuOpen(false);
    if (item.external) {
      window.location.href = item.dest;
    } else {
      navigate(item.dest);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Portal directory menu"
        aria-expanded={menuOpen}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-105"
        style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(212,175,55,0.08)' }}
      >
        {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden shadow-2xl"
          style={{ background: '#111', border: `1px solid rgba(212,175,55,0.35)`, zIndex: 100 }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
              Dyson Relo Portals
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Admin · Select a destination corridor
            </p>
          </div>
          <ul className="py-1">
            {PORTAL_DIRECTORIES.map((item) => {
              const Icon = item.icon;
              const isStudio = item.label === 'Studio Home';
              return (
                <li key={item.label}>
                  <button
                    onClick={() => go(item)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[rgba(212,175,55,0.1)]"
                    style={isStudio ? { background: 'rgba(212,175,55,0.08)' } : {}}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: GOLD }} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold" style={{ color: isStudio ? GOLD : '#fff' }}>
                        {item.label}
                      </span>
                      <span className="block text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {item.desc}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}