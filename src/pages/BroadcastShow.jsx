// BroadcastShow — public full-screen broadcast player (no auth required)
// Plays the latest completed DnnBroadcast.videoUrl as a full-screen 4K MP4.
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

export default function BroadcastShow() {
  const [broadcast, setBroadcast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-created_date', 20)
      .then((broadcasts) => {
        const latest = broadcasts.find(b => b.videoUrl);
        if (latest) setBroadcast(latest);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!broadcast?.videoUrl) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-12 w-auto opacity-80" />
        <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          DNN Intelligence Bureau
        </p>
        <p className="text-xs text-slate-500">No broadcast available at this time.</p>
        <button onClick={() => window.location.href = '/'} className="text-xs underline" style={{ color: GOLD }}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}` }}
        aria-label="Close broadcast"
      >
        <X className="w-5 h-5" style={{ color: GOLD }} />
      </button>

      {/* DNN LIVE bug */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.4)` }}>
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {/* Full-screen 4K MP4 */}
      <video
        src={broadcast.videoUrl}
        autoPlay
        controls
        playsInline
        preload="auto"
        className="w-full h-full object-contain bg-black"
      />
    </div>
  );
}