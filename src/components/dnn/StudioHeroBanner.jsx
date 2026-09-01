import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, MapPin, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';

const PILLS = [
  { label: 'NEWS', path: '/dnn-news', icon: Newspaper },
  { label: 'RELOCATION', path: '/relocation-intake', icon: MapPin },
  { label: 'INTELLIGENCE', path: '/solutions', icon: Sparkles },
];

// ══════════════════════════════════════════════════════════════════════════
// ⚠️ CANONICAL DNN STUDIO ASSETS — DO NOT REPLACE, DO NOT REGENERATE ⚠️
// Same still/loop used on DnnStudioLanding.jsx, BroadcastShow.jsx, RoleSelector.jsx.
// ══════════════════════════════════════════════════════════════════════════
const STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const STUDIO_LOOP_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';

/**
 * StudioHeroBanner — the shared DNN Studio hero (looping Charlie-at-desk
 * video) reused at the top of every portal's home page, above that portal's
 * own custom content. The News/Relocation/Intelligence/Transparency nav
 * already lives in the global PortalIntelligenceRail (AppLayout), so it is
 * NOT duplicated here.
 */
export default function StudioHeroBanner() {
  const navigate = useNavigate();
  return (
    <div className="w-full px-4 sm:px-6 pt-6 pb-8" style={{ background: '#0A0B0F' }}>
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #ef4444', color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
          </span>
          <video
            src={STUDIO_LOOP_VIDEO}
            poster={STUDIO_STILL}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-center mt-6 text-base sm:text-lg italic font-semibold tracking-wide" style={{ color: GOLD }}>
          "We provide a lifetime workspace designed to maximize your real estate opportunities.
        </p>
        <p className="text-center mt-1 text-base sm:text-lg italic font-semibold tracking-wide" style={{ color: GOLD }}>
          No sales pitches, just real-time solutions and a clear path to execute results."
        </p>
        <p className="text-center mt-2 text-sm italic" style={{ color: GOLD }}>
          — Bob Dyson
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          {PILLS.map(({ label, path, icon: Icon }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black tracking-widest transition-all hover:scale-105 active:scale-95"
              style={{ background: '#0a0a0a', border: `1.5px solid ${GOLD}`, color: GOLD }}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}