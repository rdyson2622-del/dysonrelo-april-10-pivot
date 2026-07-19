import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Move } from 'lucide-react';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

const DEFAULT_BOB = { x: 4, y: 35, w: 22, h: 60, label: 'Bob', sub: 'Transparent · Lower Left' };
const DEFAULT_PANEL = { x: 16, y: 3, w: 46, h: 40 };
const DEFAULT_PILLS = [
  { x: 15, y: 78, w: 14, h: 6, label: 'NEWS', sub: "Today's Clips" },
  { x: 43, y: 78, w: 14, h: 6, label: 'RELOCATION', sub: 'Free Access' },
  { x: 71, y: 78, w: 14, h: 6, label: 'INTELLIGENCE', sub: 'Tell Your Story' },
];

const DEFAULT_STATE = { bob: DEFAULT_BOB, panel: DEFAULT_PANEL, pills: DEFAULT_PILLS };

/**
 * StudioLayoutPreview — display-only render of the studio backdrop with
 * Bob, the wall map billboard, and the 3 floor pills positioned from saved
 * LayoutTemplate coordinates. No drag controls — just a large visual.
 */
export default function StudioLayoutPreview() {
  const [layout, setLayout] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID }).then(arr => {
      const t = arr?.[0];
      if (t?.layout_coordinates) {
        setLayout({ ...DEFAULT_STATE, ...t.layout_coordinates });
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-slate-700 rounded-full animate-spin" style={{ borderTopColor: GOLD }} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Label bar */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <Move className="w-3.5 h-3.5" style={{ color: GOLD }} />
        <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>DNN Studio — Layout Preview</p>
        <span className="text-[9px] text-slate-500">— placeholder while content & positioning are finalized</span>
      </div>

      {/* Studio canvas */}
      <div
        className="relative w-full overflow-hidden select-none rounded-xl"
        style={{
          aspectRatio: '16/9',
          backgroundImage: `url('${STUDIO_BG}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(212,175,55,0.25)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Bob — transparent lower-left presenter */}
        <div
          className="absolute"
          style={{
            left: `${layout.bob.x}%`,
            top: `${layout.bob.y}%`,
            width: `${layout.bob.w}%`,
            height: `${layout.bob.h}%`,
          }}
        >
          <div className="w-full h-full flex items-end justify-center">
            <div className="w-[60%] h-[90%] rounded-t-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(180deg, rgba(100,120,140,0.3) 0%, rgba(40,50,60,0.5) 100%)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderTop: '2px solid rgba(212,175,55,0.5)',
              }}>
              <div className="w-[70%] h-[25%] rounded-full mb-1" style={{ background: 'rgba(180,160,140,0.5)' }} />
            </div>
          </div>
        </div>

        {/* White wall map billboard — laid-in screen over the back-wall map */}
        <div
          className="absolute"
          style={{
            left: `${layout.panel.x}%`,
            top: `${layout.panel.y}%`,
            width: `${layout.panel.w}%`,
            height: `${layout.panel.h}%`,
            background: 'rgba(255,255,255,0.92)',
            border: '2px solid #D4AF37',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-center" style={{ color: '#1a1a1a' }}>
              Today's Top Story
            </p>
            <div className="w-[60%] h-[2px] rounded-full" style={{ background: '#1a1a1a' }} />
            <div className="w-[80%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
            <div className="w-[70%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
            <div className="w-[75%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
            <div className="w-[65%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
          </div>
        </div>

        {/* 3 floor pills */}
        {layout.pills.map((pill, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: `${pill.x}%`,
              top: `${pill.y}%`,
              width: `${pill.w}%`,
              height: `${pill.h}%`,
              background: 'linear-gradient(135deg, rgba(212,180,106,0.12) 0%, rgba(212,180,106,0.04) 100%)',
              border: '1px solid rgba(212,180,106,0.45)',
              borderRadius: '9999px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
            }}
          >
            <span className="uppercase whitespace-nowrap leading-none" style={{ color: '#d4b46a', fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, letterSpacing: '0.15em', fontSize: 'clamp(0.5rem, 1vw, 0.75rem)' }}>{pill.label}</span>
            <span className="text-[6px] tracking-[0.15em] uppercase opacity-60 mt-0.5" style={{ color: '#d4b46a' }}>{pill.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}