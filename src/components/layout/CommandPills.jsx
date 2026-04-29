import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GOLD = '#D4AF37';

const PORTAL_PILLS = [
  { label: 'CLIENT', emoji: '🏠', role: 'client', path: '/dashboard' },
  { label: 'AGENT',  emoji: '⭐', role: 'agent',  path: '/dashboard' },
  { label: 'VENDOR', emoji: '🔧', role: 'vendor', path: '/dashboard' },
];

export default function CommandPills() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(() => sessionStorage.getItem('dyson_role') || 'client');

  const switchRole = (role, path) => {
    sessionStorage.setItem('dyson_role', role);
    setActiveRole(role);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(path);
  };

  return (
    <div className="flex items-center gap-1.5">
      {PORTAL_PILLS.map(({ label, emoji, role, path }) => {
        const isActive = activeRole === role;
        return (
          <button
            key={role}
            onClick={() => switchRole(role, path)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] transition-all hover:scale-105 active:scale-95"
            style={{
              background: isActive ? 'rgba(212,175,55,0.25)' : 'rgba(0,0,0,0.45)',
              border: `1px solid ${isActive ? GOLD : 'rgba(212,175,55,0.35)'}`,
              color: isActive ? GOLD : 'rgba(212,175,55,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: isActive ? '0 0 10px rgba(212,175,55,0.2)' : 'none',
            }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}

      {/* ADMIN pill — highlights when on admin routes */}
      <Link
        to="/admin"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(212,175,55,0.35)',
          color: 'rgba(212,175,55,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span>⚙️</span><span>ADMIN</span>
      </Link>
    </div>
  );
}