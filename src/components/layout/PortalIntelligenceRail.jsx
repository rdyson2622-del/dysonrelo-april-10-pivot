import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Newspaper, MapPinned, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';

// Persistent 3-box rail — mirrors the pre-login landing page's 3 pills so
// every logged-in portal keeps the same "daily anchor" entry points
// (News / Relocation / Intelligence) regardless of that portal's own
// primary task. Lives in AppLayout so it renders on every logged-in page.
const BOXES = [
  { label: 'NEWS', path: '/dnn-news', icon: Newspaper },
  { label: 'RELOCATION', path: '/relocation-intake', icon: MapPinned },
  { label: 'INTELLIGENCE', path: '/solutions', icon: Sparkles },
];

export default function PortalIntelligenceRail() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="fixed z-40 flex items-center justify-end gap-1.5 px-2 py-1.5 rounded-full"
      style={{
        top: '60px',
        right: '12px',
        width: '15%',
        background: 'rgba(10,10,10,0.85)',
        border: `1px solid ${GOLD}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {BOXES.map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname.toLowerCase() === path.toLowerCase();
        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            title={label}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              background: isActive ? 'rgba(212,175,55,0.22)' : 'rgba(212,175,55,0.1)',
              border: `1px solid ${isActive ? GOLD : 'rgba(212,175,55,0.35)'}`,
              color: GOLD,
            }}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black tracking-[0.12em] hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}