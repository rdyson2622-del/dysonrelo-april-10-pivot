import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function LatestDnnBroadcastVideo() {
  const { data: broadcasts = [] } = useQuery({
    queryKey: ['latestCompletedBobSoloDnnBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter(
      { status: 'completed', presenter: 'bob', format: 'solo' },
      '-broadcast_date',
      10
    ),
  });

  const broadcast = broadcasts.find((item) => item.videoUrl);
  if (!broadcast?.videoUrl) return null;

  return (
    <video
      src={broadcast.videoUrl}
      controls
      playsInline
      preload="metadata"
      className="block w-full h-auto bg-black"
      aria-label={broadcast.show_name || 'DNN Real Estate News broadcast'}
    />
  );
}