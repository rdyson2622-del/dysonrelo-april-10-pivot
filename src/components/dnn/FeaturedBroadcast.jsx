import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Radio, X, Pause, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * FeaturedBroadcast — shows the latest broadcast published to the in-app
 * News section, composited over the DNN studio background (matching the
 * Studio Preview look) as the first featured item on /dnn-news.
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
      <CompositedPlayer broadcast={featured} autoPlay={playing} onPlay={() => setPlaying(true)} />
      {featured.headlines?.length > 0 && (
        <p className="text-sm font-bold mt-3" style={{ color: '#1a1a1a' }}>{featured.headlines[0]}</p>
      )}
    </div>
  );
}

function CompositedPlayer({ broadcast, autoPlay, onPlay }) {
  const videoRef = React.useRef(null);
  const [started, setStarted] = useState(autoPlay);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  React.useEffect(() => {
    if (!started) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => {
      setPlaying(true);
      v.muted = false;
      setMuted(false);
    }).catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().then(() => setPlaying(true)).catch(() => {});
    });
  }, [started]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
      {/* Studio background */}
      <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />

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
          {broadcast.show_name || 'DNN Broadcast'}
        </span>
      </div>

      {/* Avatar video box — centered horizontally, lower area, over studio bg */}
      {started ? (
        <div className="absolute overflow-hidden cursor-pointer"
          onClick={togglePlay}
          style={{
            width: 'clamp(180px, 36%, 360px)',
            aspectRatio: '16/9',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '12px',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 14px 40px rgba(0,0,0,0.7)',
            background: '#000',
            zIndex: 10,
          }}>
          <video
            ref={videoRef}
            src={broadcast.videoUrl}
            playsInline
            preload="auto"
            onClick={togglePlay}
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.18)' }}
          />
        </div>
      ) : (
        <button onClick={() => { setStarted(true); onPlay(); }}
          className="absolute inset-0 flex items-center justify-center z-10 group">
          <div className="absolute" style={{
            width: 'clamp(180px, 36%, 360px)',
            aspectRatio: '16/9',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '12px',
            border: `2px solid ${GOLD}`,
            background: '#000',
          }} />
          <div className="relative z-20 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: GOLD }}>
              <Play className="w-7 h-7 ml-1 text-black" fill="black" />
            </div>
          </div>
        </button>
      )}

      {/* Tap for sound */}
      {started && playing && muted && (
        <button onClick={toggleMute} aria-label="Tap for sound"
          className="absolute inset-0 flex items-center justify-center z-30">
          <span className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD}` }}>
            <VolumeX className="w-8 h-8" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: GOLD }}>Tap for Sound</span>
          </span>
        </button>
      )}

      {/* Bottom controls */}
      {started && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-6 py-3 z-20"
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: GOLD }}>
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: GOLD }}>
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  );
}