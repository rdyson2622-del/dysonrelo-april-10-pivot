import React from 'react';
import { Move, User, Layers } from 'lucide-react';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

/**
 * DualBoxLayoutMockup — visual wireframe overlay on the 3-pill studio background.
 * Shows exactly where Charlie (lower-left), Bob (lower-right), and the wall text frame sit.
 * Matches the positioning constants from TagTeamBroadcastPlayer.jsx.
 */
export default function DualBoxLayoutMockup() {
  return (
    <div className="px-6 py-5" style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase"
          style={{ background: GOLD, color: '#000' }}>
          ◆ Dual-Box Layout Mockup
        </span>
        <p className="text-sm font-black text-white">Golden Master Positioning — Visual Reference</p>
        <span className="text-[10px] text-slate-500">3-pill studio backdrop · Charlie lower-left · Bob lower-right · Wall text frame upper-center</span>
      </div>

      {/* The mockup canvas */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9', background: '#000' }}>
        {/* 3-pill studio background */}
        <img src={STUDIO_BG} alt="DNN Studio 3-pill backdrop" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />

        {/* Wall text frame — upper center (dynamic headline/bullet overlay zone) */}
        <div className="absolute"
          style={{
            top: '8%', left: '25%', width: '50%', height: '22%',
            border: `2px dashed ${GOLD}`,
            background: 'rgba(212,175,55,0.08)',
            borderRadius: '6px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
          <Layers className="w-5 h-5" style={{ color: GOLD }} />
          <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
            Wall Text Frame
          </span>
          <span className="text-[8px] text-slate-300">Dynamic headline + bullet overlay</span>
        </div>

        {/* Charlie box — lower LEFT */}
        <div className="absolute group"
          style={{
            bottom: '3%', left: '2%', width: '22%', aspectRatio: '3 / 4',
          }}>
          <div className="w-full h-full rounded-lg flex flex-col items-center justify-center gap-2 transition-all"
            style={{
              border: `3px solid ${GOLD}`,
              background: 'rgba(212,175,55,0.12)',
              boxShadow: '0 0 30px rgba(212,175,55,0.3)',
            }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
              <User className="w-5 h-5 text-black" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-center" style={{ color: GOLD }}>
              Charlie<br/>Simmons
            </span>
            <span className="text-[7px] text-slate-300">Lower-Left Box</span>
          </div>
          {/* Anchor label bar */}
          <div className="mt-1 px-2 py-1 rounded flex items-center gap-1.5 justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #000)', borderTop: `1px solid rgba(212,175,55,0.5)` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
            <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: GOLD }}>DNN News Desk</span>
          </div>
        </div>

        {/* Bob box — lower RIGHT */}
        <div className="absolute group"
          style={{
            bottom: '3%', right: '2%', width: '22%', aspectRatio: '3 / 4',
          }}>
          <div className="w-full h-full rounded-lg flex flex-col items-center justify-center gap-2 transition-all"
            style={{
              border: `3px solid ${GOLD}`,
              background: 'rgba(96,165,250,0.12)',
              boxShadow: '0 0 30px rgba(96,165,250,0.3)',
            }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#60a5fa' }}>
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-center" style={{ color: '#60a5fa' }}>
              Bob<br/>Dyson
            </span>
            <span className="text-[7px] text-slate-300">Lower-Right Box</span>
          </div>
          {/* Remote correspondent label bar */}
          <div className="mt-1 px-2 py-1 rounded flex items-center gap-1.5 justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #000)', borderTop: `1px solid rgba(96,165,250,0.5)` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
            <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: '#60a5fa' }}>Reporting</span>
          </div>
        </div>

        {/* Dimension annotations */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg flex items-center gap-1.5"
          style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid rgba(212,175,55,0.4)` }}>
          <Move className="w-3 h-3" style={{ color: GOLD }} />
          <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: GOLD }}>16:9 · 1920×1080</span>
        </div>
      </div>

      {/* Positioning key */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Charlie Box</span>
          </div>
          <p className="text-[9px] text-slate-400">Bottom: 3% · Left: 2% · Width: 22% · Aspect: 3:4</p>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: '#60a5fa' }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#60a5fa' }}>Bob Box</span>
          </div>
          <p className="text-[9px] text-slate-400">Bottom: 3% · Right: 2% · Width: 22% · Aspect: 3:4</p>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: GOLD, opacity: 0.6 }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Wall Text Frame</span>
          </div>
          <p className="text-[9px] text-slate-400">Top: 8% · Left: 25% · Width: 50% · Height: 22%</p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-500 text-center">
        This mockup mirrors the exact positioning constants from TagTeamBroadcastPlayer.jsx.
        The 3-pill studio background is the permanent HeyGen template canvas — Charlie and Bob boxes are baked into the template, not overlaid in-browser.
      </p>
    </div>
  );
}