import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GOLD = '#D4AF37';

const PORTAL_PILLS = [
  { label: 'ADMIN', emoji: '⚙️', role: 'admin', path: '/admin', isAdmin: true },
  { label: 'FIRST-TIME VISITOR', emoji: '👋', role: 'first_time_visitor', path: '/broadcast-show' },
  { label: 'CORP RELO HR', emoji: '🏢', role: 'hr', path: '/corporate-relo' },
  { label: 'CLIENT', emoji: '🏠', role: 'client', path: '/home' },
  { label: 'RELO AGENT', emoji: '⭐', role: 'agent', path: '/find-agent' },
  { label: 'REFERRAL AGENT', emoji: '🤝', role: 'referral_agent', path: '/partner-benefits' },
  { label: 'VENDOR', emoji: '🔧', role: 'vendor', path: '/search' },
];

export default function CommandPills() {
  const navigate = useNavigate();
  const location = useLocation();
  const onAdmin = location.pathname.startsWith('/admin');
  const [activeRole, setActiveRole] = useState(() => sessionStorage.getItem('dyson_role') || 'client');

  const switchRole = (role, path) => {
    sessionStorage.setItem('dyson_role', role);
    setActiveRole(role);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(path);
  };

  return (
    <div className="flex items-center gap-1" style={{ marginRight: '180px' }}>
      {PORTAL_PILLS.map(({ label, emoji, role, path, isAdmin }) => {
        const isActive = isAdmin ? onAdmin : (!onAdmin && activeRole === role);
        return (
          <button
            key={role}
            onClick={() => isAdmin ? navigate(path) : switchRole(role, path)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-[0.06em] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: isActive ? '#000' : 'rgba(0,0,0,0.45)',
              border: `1px solid ${isActive ? '#000' : 'rgba(212,175,55,0.35)'}`,
              color: isActive ? '#fff' : 'rgba(212,175,55,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
            }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}