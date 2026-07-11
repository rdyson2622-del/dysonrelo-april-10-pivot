import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play } from 'lucide-react';
import { playNewsSting } from '@/components/dnn/newsSting';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

export default function DnnMorningBroadcast() {
  const [playing, setPlaying] = useState(false);
  const [intro, setIntro] = useState(false);

  const startBroadcast = () => {
    playNewsSting();
    setIntro(true);
    setTimeout(() => {
      setIntro(false);
      setPlaying(true);
    }, 3200);
  };

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['dnnMorningBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 1),
  });

  const broadcast = broadcasts[0];
  if (!broadcast?.videoUrl) return null;

  const dateLabel = new Date(broadcast.broadcast_date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 pt-10 max-w-5xl mx-auto">
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid rgba(212,175,55,0.4)`, boxShadow: '0 16px 60px rgba(0,0,0,0.35)' }}>
        {/* Player */}
        <div className="relative w-full aspect-video" style={{ background: '#000' }}>
          {playing ? (
            <video src={broadcast.videoUrl} controls autoPlay playsInline className="w-full h-full object-cover" />
          ) : intro ? (
            <div className="w-full h-full relative overflow-hidden">
              <img src={STUDIO_BG} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.4)' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="px-6 py-2 animate-pulse" style={{ background: '#b91c1c' }}>
                  <span className="text-white font-black text-sm tracking-[0.4em] uppercase">● Broadcast</span>
                </div>
                <p className="font-black text-3xl md:text-5xl tracking-[0.2em] uppercase" style={{ color: GOLD, textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
                  DNN NEWS
                </p>
                <p className="text-white text-xs font-bold tracking-[0.35em] uppercase">Morning Broadcast · Bob Dyson</p>
              </div>
            </div>
          ) : (
            <button onClick={startBroadcast} className="group w-full h-full block relative">
              <img src={STUDIO_BG} alt="DNN Real Estate News studio" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(212,175,55,0.95)', boxShadow: '0 0 60px rgba(212,175,55,0.4)' }}>
                  <Play className="w-9 h-9 ml-1" style={{ color: '#000' }} fill="#000" />
                </span>
              </div>
              {/* LIVE badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.4)', backdropFilter: 'blur(4px)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>LIVE DAILY 6AM</span>
              </div>
            </button>
          )}
          {/* Lower third */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>DNN Real Estate News · Morning Broadcast</p>
            <p className="text-white font-bold text-sm">{dateLabel} · Bob Dyson, Anchor</p>
          </div>
        </div>
      </div>
    </div>
  );
}