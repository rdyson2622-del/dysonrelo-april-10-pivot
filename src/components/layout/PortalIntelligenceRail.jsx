import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Newspaper, MapPinned, Sparkles, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

// Persistent 4-box callout — mirrors the pre-login landing page's pills so
// every logged-in portal keeps the same "daily anchor" entry points
// (News / Relocation / Intelligence / Transparency) regardless of that
// portal's own primary task. Lives in AppLayout so it renders on every
// logged-in page. Deliberately styled as separate sharp-edged tiles (not a
// connected pill bar) so it reads as a distinct callout, not standard nav.
const BOXES = [
  { label: 'NEWS', path: '/dnn-news', icon: Newspaper },
  { label: 'RELOCATION', path: '/relocation-intake', icon: MapPinned },
  { label: 'INTELLIGENCE', path: '/solutions', icon: Sparkles },
  { label: 'TRANSPARENCY', path: '/transparency', icon: ShieldCheck },
];

export default function PortalIntelligenceRail() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="fixed z-40 flex items-start justify-end gap-2 flex-wrap"
      style={{ top: '60px', right: '12px', width: '17%' }}
    >
      {BOXES.map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname.toLowerCase() === path.toLowerCase();
        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            title={label}
            className="flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95"
            style={{
              width: '56px',
              height: '52px',
              background: isActive ? 'rgba(212,175,55,0.25)' : '#0a0a0a',
              border: `2px solid ${GOLD}`,
              borderRadius: '2px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
            <span className="text-[7.5px] font-black tracking-[0.06em] leading-tight text-center" style={{ color: GOLD }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}