import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Radio } from 'lucide-react';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';

const GOLD = '#D4AF37';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * FeaturedBroadcast — shows the latest broadcast published to the in-app
 * News section. The poster is the DNN studio background (the "studio look"),
 * and clicking opens the full composited studio player (studio bg + framed
 * video box) — not the raw isolated avatar MP4.
 */
export default function FeaturedBroadcast() {
  const [open, setOpen] = useState(false);

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

      {/* Studio-look poster — click to play the composited studio show */}
      <button onClick={() => setOpen(true)}
        className="relative w-full overflow-hidden rounded-2xl group block text-left"
        style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
        <img src={STUDIO_BG_URL} alt="DNN Studio" className="absolute inset-0 w-full h-full object-cover" />

        {/* DNN LIVE bug */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}>
          <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
        </div>

        {/* Show name badge */}
        <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
            {featured.show_name || 'DNN Broadcast'}
          </span>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: GOLD, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
            <Play className="w-7 h-7 ml-1 text-black" fill="black" />
          </div>
        </div>
      </button>

      {featured.headlines?.length > 0 && (
        <p className="text-sm font-bold mt-3" style={{ color: '#1a1a1a' }}>{featured.headlines[0]}</p>
      )}

      {/* Full composited studio player */}
      {open && (
        <DnnNewsBroadcastPlayer
          videoUrl={featured.videoUrl}
          status="ready"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}