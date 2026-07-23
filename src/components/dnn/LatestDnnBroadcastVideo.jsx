import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function LatestDnnBroadcastVideo() {
  const { data: clips = [] } = useQuery({
    queryKey: ['latestCompletedBobNewsMp4'],
    queryFn: () => base44.entities.DnnNewsClip.filter(
      { bobStatus: 'completed' },
      '-updated_date',
      10
    ),
  });

  const clip = clips.find((item) => item.bobVideoUrl);
  if (!clip?.bobVideoUrl) return null;

  return (
    <video
      src={clip.bobVideoUrl}
      controls
      playsInline
      preload="metadata"
      className="block w-full h-auto bg-black"
      aria-label="Bob Dyson DNN Real Estate News broadcast"
    />
  );
}