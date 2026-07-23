import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function LatestDnnBroadcastVideo() {
  const { data: broadcasts = [] } = useQuery({
    queryKey: ['latestFinishedDnnBroadcastMp4'],
    queryFn: () => base44.entities.VideoLibrary.filter(
      { category: 'broadcast', source_type: 'upload', is_active: true },
      '-broadcast_date',
      10
    ),
  });

  const broadcast = broadcasts.find((item) => item.file_url);
  if (!broadcast?.file_url) return null;

  return (
    <video
      src={broadcast.file_url}
      controls
      playsInline
      preload="metadata"
      className="block w-full h-auto bg-black"
      aria-label={broadcast.title || 'DNN Real Estate News broadcast'}
    />
  );
}