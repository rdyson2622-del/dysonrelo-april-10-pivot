import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Radio } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * FeaturedBroadcast — shows the latest broadcast that has been published
 * to the in-app News section (distribution channel 'in_app_news') as the
 * first featured item on the /dnn-news page.
 */
export default function FeaturedBroadcast() {
  const [playing, setPlaying] = useState(false);

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['featuredNewsBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-show_number', 20),
  });

  const featured = broadcasts.find(b =>
    b.videoUrl && (b.distribution || []).some(d => d.channel === 'in_app_news' && d.status === 'sent')
  );

  if (!featured) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4" style={{ color: GOLD }} />
        <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Featured Broadcast</span>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
        {playing ? (
          <video src={featured.videoUrl} controls autoPlay playsInline className="w-full" />
        ) : (
          <button onClick={() => setPlaying(true)} className="w-full aspect-video relative flex items-center justify-center group">
            <video src={featured.videoUrl} muted playsInline preload="metadata"
              onLoadedMetadata={(e) => { e.target.currentTime = 1; }}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: GOLD }}>
                  <Play className="w-7 h-7 ml-1 text-black" fill="black" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.4)' }}>
                  <img src={DNN_LOGO} alt="DNN" className="h-4 w-auto" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                    {featured.show_name || 'DNN Broadcast'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        )}
      </div>
      {featured.headlines?.length > 0 && (
        <p className="text-sm font-bold mt-3" style={{ color: '#1a1a1a' }}>{featured.headlines[0]}</p>
      )}
    </div>
  );
}