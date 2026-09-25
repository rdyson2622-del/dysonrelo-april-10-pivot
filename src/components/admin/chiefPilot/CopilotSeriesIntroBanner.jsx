import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';

// First-visit intro strip shown above the opening door screen so ad-driven
// visitors get context on the CoPilot before they start chatting.
// Picks today's story from the Perpetual 7-Day Loop (loopDay 1-7, cycling by day of week).
export default function CopilotSeriesIntroBanner({ onDismiss }) {
  const { data: releases = [] } = useQuery({
    queryKey: ['copilotSeriesIntroBanner'],
    queryFn: () => base44.entities.PrRelease.filter({ status: 'Distributed' }, '-updated_date', 20),
    staleTime: 60 * 1000,
  });

  const withVideo = releases.filter(r => r.mediaAssetUrl && r.loopDay);
  if (!withVideo.length) return null;

  const todayLoopDay = (new Date().getDay() % 7) + 1; // Sun=0 -> day 1 ... Sat=6 -> day 7
  const todayStory = withVideo.find(r => r.loopDay === todayLoopDay)
    || [...withVideo].sort((a, b) => a.loopDay - b.loopDay)[0];

  if (!todayStory) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-dyson-gold-deep bg-dyson-black p-3 text-left sm:flex-row sm:items-center sm:gap-4">
      <div className="w-full shrink-0 overflow-hidden rounded-xl border border-white/10 sm:w-40" style={{ aspectRatio: '16/9' }}>
        <video src={todayStory.mediaAssetUrl} controls playsInline preload="metadata" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-dyson-gold-light">Meet Your CoPilot</p>
        <p className="mt-1 text-sm text-white">{todayStory.bannerHook || todayStory.title}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 self-start rounded-full border border-white/20 p-1.5 text-white/70 hover:border-dyson-gold-deep hover:text-dyson-gold-light sm:self-center"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}