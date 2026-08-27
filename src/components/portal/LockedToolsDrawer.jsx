import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X, ChevronLeft, Bot, MapPin, ClipboardList, Newspaper, Home, Users } from 'lucide-react';

const GOLD = '#D4AF37';

const LOCKED_TOOLS = [
  { icon: ClipboardList, label: 'Relocation Roadmap', desc: 'Your personalized step-by-step move plan' },
  { icon: Bot, label: 'AI Assistants', desc: '24/7 Charlie concierge for every question' },
  { icon: MapPin, label: 'City Guides', desc: 'Deep-dive research on your destination' },
  { icon: Users, label: 'My Agent', desc: 'Your hand-picked, vetted local agent' },
  { icon: Newspaper, label: 'DNN Broadcast Archive', desc: 'Full real estate news library' },
  { icon: Home, label: 'Property Comparison Tool', desc: 'Compare listings side-by-side' },
];

export default function LockedToolsDrawer() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Docked tab */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex fixed z-40 items-center gap-2 px-3 py-4 rounded-l-xl transition-all hover:pr-4"
        style={{
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          background: '#0a0a0a',
          border: `1.5px solid ${GOLD}`,
          borderRight: 'none',
          color: GOLD,
          writingMode: 'vertical-rl',
        }}
      >
        <Lock className="w-3.5 h-3.5" style={{ writingMode: 'horizontal-tb' }} />
        <span className="text-[10px] font-black tracking-[0.2em]">MORE TOOLS</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[380px] overflow-y-auto transition-transform duration-300"
        style={{
          background: '#0a0a0a',
          borderLeft: `2px solid ${GOLD}`,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" style={{ color: GOLD }} />
            <p className="text-xs font-black tracking-[0.2em]" style={{ color: GOLD }}>YOUR FULL TOOLKIT</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="px-5 pt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          These tools unlock the moment you subscribe — free, no card required.
        </p>

        <div className="px-5 py-5 space-y-3">
          {LOCKED_TOOLS.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-60"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.1)' }}>
                <Icon className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
              <Lock className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
            </div>
          ))}
        </div>

        <div className="px-5 pb-8">
          <button
            onClick={() => navigate('/subscribe')}
            className="w-full py-3.5 rounded-full font-black text-sm tracking-wide transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            Sign Up Free to Unlock
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full mt-2 py-2 flex items-center justify-center gap-1 text-xs font-bold"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </div>
    </>
  );
}