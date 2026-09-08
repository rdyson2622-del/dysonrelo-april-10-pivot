import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Radio } from 'lucide-react';

const GOLD = '#D4AF37';

// Canonical approved MP4 show currently running in news (from AdminDnnCharlieStudioSolution)
const DEFAULT_SHOW_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/75165cedb_san-diego-housing-inventory-remains-constrained-amid-sustained-price-resilience.mp4';
const DEFAULT_SHOW_HEADLINE = 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience';
const DEFAULT_SHOW_NAME = 'DNN Daily Broadcast';

// Canonical studio poster — used as the video poster so playback never opens on a black screen
const STUDIO_POSTER_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/80129619f_Screenshot2026-08-01at31026PM.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * FeaturedBroadcast — Full-frame 16:9 MP4 daily broadcast embedded on the News page.
 * Replaces the legacy static stage photo and floating box with the full, unified MP4 daily news.
 */
export default function FeaturedBroadcast() {
  const { data: broadcasts = [] } = useQuery({
    queryKey: ['featuredNewsBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 10),
    staleTime: 60 * 1000,
  });

  const { data: completedArticles = [] } = useQuery({
    queryKey: ['featuredNewsArticle'],
    queryFn: () => base44.entities.DnnArticle.filter({ production_status: 'complete' }, '-updated_date', 5),
    staleTime: 60 * 1000,
  });

  // Determine the active broadcast: prefer the latest completed article with video,
  // then any completed broadcast, or fallback to the locked approved show URL.
  const bestArticle = completedArticles.find(a =>
    a.video_url &&
    !a.video_url.startsWith('heygen:pending:') &&
    (a.video_url.includes('.mp4') || a.video_url.includes('.webm'))
  );

  const bestBroadcast = broadcasts.find(b =>
    (b.compositedVideoUrl || b.videoUrl) &&
    !String(b.compositedVideoUrl || b.videoUrl).startsWith('creatomate:pending:')
  );

  const articleTime = bestArticle ? new Date(bestArticle.updated_date || bestArticle.created_date).getTime() : -1;
  const broadcastTime = bestBroadcast ? new Date(bestBroadcast.updated_date || bestBroadcast.created_date).getTime() : -1;

  let playUrl = DEFAULT_SHOW_URL;
  let headline = DEFAULT_SHOW_HEADLINE;
  let showName = DEFAULT_SHOW_NAME;

  if (bestArticle && articleTime >= broadcastTime) {
    playUrl = bestArticle.video_url;
    headline = bestArticle.headline || DEFAULT_SHOW_HEADLINE;
    showName = 'DNN Daily Broadcast';
  } else if (bestBroadcast) {
    const compUrl = bestBroadcast.compositedVideoUrl;
    playUrl = (compUrl && !String(compUrl).startsWith('creatomate:pending:')) ? compUrl : (bestBroadcast.videoUrl || DEFAULT_SHOW_URL);
    headline = bestBroadcast.headlines?.[0] || bestBroadcast.show_name || DEFAULT_SHOW_HEADLINE;
    showName = bestBroadcast.show_name || DEFAULT_SHOW_NAME;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4" style={{ color: GOLD }} />
        <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          Featured Broadcast
        </span>
      </div>

      <InlineStudioPlayer
        videoUrl={playUrl}
        showName={showName}
      />

      {headline && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-bold text-[#1a1a1a]">{headline}</p>
          <span className="text-[10px] font-mono text-[#666] tracking-wider uppercase">
            1080p MP4 Broadcast
          </span>
        </div>
      )}
    </div>
  );
}

function InlineStudioPlayer({ videoUrl, showName }) {
  const videoRef = useRef(null);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
      style={{
        aspectRatio: '16/9',
        background: '#000',
        border: `2px solid ${GOLD}`,
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
      }}
    >
      {/* DNN LIVE bug */}
      <div
        className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid rgba(212,175,55,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          LIVE
        </span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {/* Show name badge */}
      {showName && (
        <div
          className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(212,175,55,0.3)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
            {showName}
          </span>
        </div>
      )}

      {/* Full-bleed 16:9 MP4 Video Player */}
      <video
        ref={videoRef}
        key={videoUrl}
        src={videoUrl}
        poster={STUDIO_POSTER_URL}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        style={{ display: 'block', background: '#000' }}
      />
    </div>
  );
}