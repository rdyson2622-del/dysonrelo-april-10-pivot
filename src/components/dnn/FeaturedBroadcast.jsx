import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';

const GOLD = '#D4AF37';
// Exact same studio background used by DnnNewsBroadcastPlayer (Preview Studio Show)
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * FeaturedBroadcast — the composited DNN studio show, embedded inline on
 * the News page. Uses the EXACT same studio background + Charlie box layout
 * as the "Preview Studio Show" (DnnNewsBroadcastPlayer). Click-to-play only —
 * no autoplay, so no double audio.
 */
export default function FeaturedBroadcast() {
  const { data: broadcasts = [] } = useQuery({
    queryKey: ['featuredNewsBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-show_number', 20),
    // Prevent window-focus refetches from changing the video URL mid-playback,
    // which was causing the duplicate "second run" over the news section.
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const featured = broadcasts.find(b =>
    (b.compositedVideoUrl || b.videoUrl) && (b.distribution || []).some(d => d.channel === 'in_app_news' && d.status === 'sent')
  );

  if (!featured) return null;

  // Prioritize composited (studio backdrop baked in). Filter out pending placeholders.
  const compUrl = featured.compositedVideoUrl;
  const playUrl = (compUrl && !String(compUrl).startsWith('creatomate:pending:')) ? compUrl : featured.videoUrl;
  if (!playUrl) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4" style={{ color: GOLD }} />
        <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Featured Broadcast</span>
      </div>
      {/* key={playUrl} forces a FULL remount when the URL changes — the old
          <video> unmounts (audio stops) and a fresh player mounts. This
          eliminates the race condition where a query refetch reset the
          play guard mid-playback and caused a duplicate "second run". */}
      <InlineStudioPlayer key={featured.id} videoUrl={playUrl} showName={featured.show_name} composited={!!featured.compositedVideoUrl && playUrl === featured.compositedVideoUrl} />
      {featured.headlines?.length > 0 && (
        <p className="text-sm font-bold mt-3" style={{ color: '#1a1a1a' }}>{featured.headlines[0]}</p>
      )}
    </div>
  );
}

function InlineStudioPlayer({ videoUrl, showName, composited }) {
  const videoRef = useRef(null);
  const playInitiatedRef = useRef(false);
  // Lock the URL once playback starts so a query refetch (e.g. the
  // Creatomate composite finishing mid-show) can't swap/reload the src
  // and trigger a "second run" of the audio.
  const lockedUrlRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const activeUrl = lockedUrlRef.current || videoUrl;

  // Pause on unmount so audio never lingers. Capture the element in the
  // effect closure (not via ref at cleanup time) because React clears refs
  // before passive-effect cleanups run — using videoRef.current directly
  // would find null and leave a detached <video> playing orphan audio.
  useEffect(() => {
    if (!started) return;
    const v = videoRef.current;
    return () => { try { v?.pause(); } catch (_) {} };
  }, [started]);

  const startPlay = () => {
    if (playInitiatedRef.current) return; // prevent double-play
    // Hard guard: if a video is somehow already playing, don't start another
    const existing = videoRef.current;
    if (existing && !existing.paused && !existing.ended) return;
    playInitiatedRef.current = true;
    lockedUrlRef.current = videoUrl; // freeze src for this playback session
    setStarted(true);
    // wait for next tick so the <video> mounts
    setTimeout(() => {
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
    }, 50);
  };

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

  // Hard stop on end — never loop, never restart
  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
      {/* Network studio background — only for the raw (non-composited) video.
          The composited MP4 already has the studio set baked in, so we play it
          full-frame instead of overlaying a second background (which caused the
          "doubled" studio look on the news page). */}
      {!composited && (
        <img src={STUDIO_BG_URL} alt="DNN Studio" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
      )}

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
          {showName || 'DNN Broadcast'}
        </span>
      </div>

      {/* Video — full-frame when the composited MP4 is used (studio set is
          baked in), otherwise the raw avatar in a gold-bordered Charlie box
          over the studio background. */}
      {composited ? (
        <div className="absolute inset-0 z-10" style={{ background: '#000' }}>
          {started ? (
            <video
              ref={videoRef}
              src={activeUrl}
              playsInline
              preload="auto"
              loop={false}
              onEnded={handleEnded}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <button onClick={startPlay} aria-label="Play studio show"
              className="w-full h-full flex items-center justify-center group"
              style={{ background: '#000' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: GOLD, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
                <Play className="w-7 h-7 ml-1 text-black" fill="black" />
              </div>
            </button>
          )}
        </div>
      ) : (
        <div className="absolute overflow-hidden"
          style={{
            width: 'clamp(200px, 34%, 380px)',
            aspectRatio: '16/9',
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '12px',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 14px 40px rgba(0,0,0,0.7)',
            background: '#000',
            zIndex: 10,
          }}>
          {started ? (
            <video
              ref={videoRef}
              src={activeUrl}
              playsInline
              preload="auto"
              loop={false}
              onEnded={handleEnded}
              className="w-full h-full object-cover pointer-events-none"
              style={{ transform: 'scale(1.18)' }}
            />
          ) : (
            <button onClick={startPlay} aria-label="Play studio show"
              className="w-full h-full flex items-center justify-center group"
              style={{ background: '#000' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: GOLD, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
                <Play className="w-6 h-6 ml-1 text-black" fill="black" />
              </div>
            </button>
          )}
        </div>
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

      {/* Bottom controls — only after started */}
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