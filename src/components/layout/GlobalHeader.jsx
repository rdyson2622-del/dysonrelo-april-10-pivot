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
 * GlobalHeader — the unified top navigation bar for all Dyson Relo portals.
 *
 * Features:
 *   - "Studio Home" escape-hatch link (upper-left, routes to /?choose=1)
 *   - D&D logo mark
 *   - Hamburger dropdown with the 5-portal directory map
 *   - Responsive: sleek on desktop, collapses to hamburger on mobile
 */
export default function GlobalHeader({ portalLabel }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click / Escape
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

  const goStudioHome = () => { window.location.href = '/?choose=1'; };

  return (
    <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
      {/* D&D Logo mark + Studio Home link */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={goStudioHome}
          title="Dyson & Dyson Relocation"
        >
          <span
            className="text-lg font-black tracking-[0.2em]"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: GOLD }}
          >
            D<span style={{ color: '#fff' }}>&amp;</span>D
          </span>
        </div>
        <button
          onClick={goStudioHome}
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full transition-all hover:scale-[1.03]"
          style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(212,175,55,0.08)' }}
        >
          <Home className="w-3.5 h-3.5" />
          Studio Home
        </button>
      </div>

      {/* Current portal label (desktop) */}
      {portalLabel && (
        <span
          className="hidden lg:inline text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg"
          style={{ color: '#fff', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          {portalLabel}
        </span>
      )}

      <div className="flex-1" />

      {/* Hamburger dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Portal directory menu"
          aria-expanded={menuOpen}
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-105"
          style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(212,175,55,0.08)' }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                Select a destination corridor
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
    </div>
  );
}