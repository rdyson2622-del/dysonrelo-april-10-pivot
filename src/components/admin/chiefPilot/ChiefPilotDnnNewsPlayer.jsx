import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Radio } from 'lucide-react';
import ChiefPilotDnnNewsLibrary from './ChiefPilotDnnNewsLibrary';
import ChiefPilotDnnNewsAsk from './ChiefPilotDnnNewsAsk';

// Canonical studio poster — Charlie at desk + DNN center screen + Bob Dyson standing.
// Shown as the placeholder frame whenever no broadcast is currently running.
const STUDIO_POSTER_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/cd821f5a9_Screenshot2026-09-09at110438AM.png';

export default function ChiefPilotDnnNewsPlayer({ title, onSend, messages = [], loading = false, error = '' }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const { data: broadcasts = [] } = useQuery({
    queryKey: ['chiefPilotDnnBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 10),
    staleTime: 60 * 1000,
  });
  const { data: articles = [] } = useQuery({
    queryKey: ['chiefPilotDnnArticle'],
    queryFn: () => base44.entities.DnnArticle.filter({ production_status: 'complete' }, '-updated_date', 10),
    staleTime: 60 * 1000,
  });

  const validArticles = articles.filter(a => a.video_url && !a.video_url.startsWith('heygen:pending:') && (a.video_url.includes('.mp4') || a.video_url.includes('.webm')));
  const validBroadcasts = broadcasts.filter(b => (b.compositedVideoUrl || b.videoUrl) && !String(b.compositedVideoUrl || b.videoUrl).startsWith('creatomate:pending:'));

  const bestArticle = validArticles[0];
  const bestBroadcast = validBroadcasts[0];
  const articleTime = bestArticle ? new Date(bestArticle.updated_date || bestArticle.created_date).getTime() : -1;
  const broadcastTime = bestBroadcast ? new Date(bestBroadcast.updated_date || bestBroadcast.created_date).getTime() : -1;

  let playUrl = null; let headline = '';
  if (bestArticle && articleTime >= broadcastTime) {
    playUrl = bestArticle.video_url; headline = bestArticle.headline || '';
  } else if (bestBroadcast) {
    const compUrl = bestBroadcast.compositedVideoUrl;
    playUrl = (compUrl && !String(compUrl).startsWith('creatomate:pending:')) ? compUrl : bestBroadcast.videoUrl;
    headline = bestBroadcast.headlines?.[0] || bestBroadcast.show_name || '';
  }

  const stories = [
    ...validArticles.map(a => ({ id: a.id, url: a.video_url, headline: a.headline || 'DNN News Story' })),
    ...validBroadcasts.map(b => ({ id: b.id, url: b.compositedVideoUrl && !String(b.compositedVideoUrl).startsWith('creatomate:pending:') ? b.compositedVideoUrl : b.videoUrl, headline: b.headlines?.[0] || b.show_name || 'DNN Broadcast' })),
  ];

  if (showLibrary) return <ChiefPilotDnnNewsLibrary stories={stories} onBack={() => setShowLibrary(false)} />;

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <div className="flex items-center justify-center gap-2"><Radio className="h-4 w-4 text-dyson-gold" /><h2 className="text-2xl font-normal text-dyson-text-dark">{title}</h2></div>
      <div className="relative mx-auto mt-6 w-full overflow-hidden rounded-2xl border-2 border-dyson-gold-deep bg-black" style={{ aspectRatio: '16/9' }}>
        {playUrl ? (
          <video key={playUrl} src={playUrl} poster={STUDIO_POSTER_URL} controls playsInline preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <>
            <img src={STUDIO_POSTER_URL} alt="DNN studio — no broadcast currently running" className="h-full w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2"><p className="text-xs text-dyson-taupe">No broadcast currently running. Charlie and Bob are ready in the DNN studio.</p></div>
          </>
        )}
      </div>
      {playUrl && headline && <p className="mt-3 text-sm font-semibold text-dyson-text-dark">{headline}</p>}
      <button type="button" onClick={() => setShowLibrary(true)} className="mt-6 rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-5 py-2.5 text-sm font-semibold text-dyson-gold-deep shadow-sm">Browse all DNN video stories →</button>
      <ChiefPilotDnnNewsAsk onSend={onSend} messages={messages} loading={loading} error={error} />
    </div>
  );
}