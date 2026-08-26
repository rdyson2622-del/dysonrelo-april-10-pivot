// BroadcastShow — public full-screen DNN Charlie Desk Studio hero.
// LOCKED: PRIMARY STILL ONLY (0f55cd52a_DNNStudioLandingPage.png).
// Full-bleed 16:9, object-contain, black background (NO white bars),
// NO scale>1, NO PiP box, NO code overlay, NO 56c7 MP4 as live hero.
import React from 'react';
import { X } from 'lucide-react';

const GOLD = '#D4AF37';
const HERO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

export default function BroadcastShow() {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: '#000', overflow: 'hidden' }}
    >
      {/* Close */}
      <button
        onClick={() => { window.location.href = '/'; }}
        aria-label="Close"
        className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}
      >
        <X className="w-6 h-6" />
      </button>

      {/* DNN bug */}
      <div
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}
      >
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          DNN Studio
        </span>
      </div>

      {/* LOCKED hero: PRIMARY STILL only, full-bleed contain on black */}
      <div className="absolute inset-0 z-10" style={{ background: '#000' }}>
        <img
          src={HERO_STILL}
          alt="DNN Charlie Desk Studio"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ background: '#000', transform: 'none' }}
        />
      </div>
    </div>
  );
}