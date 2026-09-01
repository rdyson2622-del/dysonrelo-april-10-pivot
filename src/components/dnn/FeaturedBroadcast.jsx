import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';

const GOLD = '#D4AF37';
// Exact same studio background used by DnnNewsBroadcastPlayer (Preview Studio Show)
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/80129619f_Screenshot2026-08-01at31026PM.png';
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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Direct-render pipeline (Show Production Pipeline) finishes shows as
  // DnnArticle records, not DnnBroadcast — fall back to the newest completed
  // one so a finished show actually appears here instead of nothing/stale.
  const { data: completedArticles = [] } = useQuery({
    queryKey: ['featuredNewsArticle'],
    queryFn: () => base44.entities.DnnArticle.filter({ production_status: 'complete' }, '-updated_date', 5),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Lock the featured broadcast on FIRST resolve. A background refetch (e.g.
  // the Creatomate composite finishing ~60s later) swaps compositedVideoUrl
  // from a pending placeholder to a real URL, which changes the playUrl prop
  // and triggers a delayed "second run" of the audio. By freezing the
  // selection (id + url + layout) for the entire page session, the player
  // props never change mid-playback — no remount, no src swap, no duplicate.
  const lockedRef = useRef(null);
  if (!lockedRef.current) {
    const f = broadcasts.find(b =>
      (b.compositedVideoUrl || b.videoUrl) &&
      (b.distribution || []).some(d => d.channel === 'in_app_news' && d.status === 'sent')
    );
    if (f) {
      const compUrl = f.compositedVideoUrl;
      const playUrl = (compUrl && !String(compUrl).startsWith('creatomate:pending:')) ? compUrl : f.videoUrl;
      if (playUrl) {
        lockedRef.current = {
          id: f.id,
          playUrl,
          showName: f.show_name,
          composited: !!f.compositedVideoUrl && playUrl === f.compositedVideoUrl,
          headline: f.headlines?.[0],
        };
      }
    }
    if (!lockedRef.current) {
      const a = completedArticles.find(a => a.video_url && !a.video_url.startsWith('heygen:pending:'));
      if (a) {
        lockedRef.current = {
          id: a.id,
          playUrl: a.video_url,
          showName: null,
          composited: true, // the stitched MP4 already has the studio backdrop baked in
          headline: a.headline,
        };
      }
    }
  }

  const featured = lockedRef.current;
  if (!featured) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4" style={{ color: GOLD }} />
        <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Featured Broadcast</span>
      </div>
      <InlineStudioPlayer
        key={featured.id}
        videoUrl={featured.playUrl}
        showName={featured.showName}
        composited={featured.composited}
      />
      {featured.headline && (
        <p className="text-sm font-bold mt-3" style={{ color: '#1a1a1a' }}>{featured.headline}</p>
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
  // Lock the layout (composited vs charlie-box) at play time so a mid-playback
  // refetch (Creatomate finishing) can't flip the branch and orphan the playing
  // <video> (orphan audio) while mounting a second (paused) one.
  const lockedCompositedRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const activeUrl = lockedUrlRef.current || videoUrl;
  // Freeze the layout for the whole playback session once started.
  const useComposited = lockedCompositedRef.current !== null ? lockedCompositedRef.current : composited;

  // Set the video src via ref assignment — NOT via a React prop. If the src
  // is a React prop, any re-render (e.g. the parent query refetching after the
  // composite finishes) can cause React to touch the DOM `src` attribute, which
  // makes the browser reload the media element and start a SECOND audio stream
  // while the first one is still playing → "double/triple audio" bug. By setting
  // src imperatively in this one-shot effect, the <video> element's src is
  // written exactly once for the component's entire lifetime and can never be
  // touched by a re-render.
  useEffect(() => {
    if (videoRef.current && activeUrl) {
      videoRef.current.src = activeUrl;
      videoRef.current.load();
    }
  }, [activeUrl]);

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
    // Pause every other <video> on the page so two broadcasts can't run at once
    document.querySelectorAll('video').forEach(v => { try { if (!v.paused) v.pause(); } catch (_) {} });
    playInitiatedRef.current = true;
    lockedUrlRef.current = videoUrl; // freeze src for this playback session
    lockedCompositedRef.current = composited; // freeze layout for this session
    setStarted(true);
    // Play directly — no setTimeout. The <video> is already mounted (always
    // mounted), so we can call play() immediately. The muted-then-unmute dance
    // satisfies browser autoplay policies: start muted (always allowed), then
    // unmute once playback is confirmed.
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
      {/* Network studio background — for the raw (non-composited) video it's the
          permanent backdrop behind the boxed clip. For a composited video (studio
          already baked in) it's shown ONLY before playback starts, as a placeholder
          poster instead of a plain black box — the video itself covers it once
          playing (it's on a higher z-index), so there's no "doubled" studio look. */}
      {(!useComposited || !started) && (
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

      {/* Video — ALWAYS mounted (never conditionally rendered). This is the
          bulletproof fix for the duplicate-audio bug: if the <video> is
          created/destroyed on a state toggle, a mid-playback re-render can
          orphan the playing element while React mounts a fresh one — giving
          you a "second run" of the audio near the end of long videos. By
          keeping a single <video> alive for the component's entire lifetime
          and only toggling the play-button overlay, it is impossible for
          React to create a second video element. */}
      <div className={useComposited ? "absolute inset-0 z-10" : "absolute overflow-hidden"}
        style={useComposited
          ? { background: started ? '#000' : 'transparent' }
          : {
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
        <video
          ref={videoRef}
          playsInline
          preload="auto"
          loop={false}
          onEnded={handleEnded}
          onPlay={e => { document.querySelectorAll('video').forEach(v => { try { if (v !== e.currentTarget && !v.paused) v.pause(); } catch (_) {} }); }}
          className={`w-full h-full object-cover pointer-events-none ${started ? 'opacity-100' : 'opacity-0'}`}
          style={useComposited ? {} : { transform: 'scale(1.18)' }}
        />
        {!started && (
          <button onClick={startPlay} aria-label="Play studio show"
            className="absolute inset-0 w-full h-full flex items-center justify-center group"
            style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className={`rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${useComposited ? 'w-16 h-16' : 'w-14 h-14'}`}
              style={{ background: GOLD, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
              <Play className={useComposited ? 'w-7 h-7 ml-1' : 'w-6 h-6 ml-1'} fill="black" style={{ color: '#000' }} />
            </div>
          </button>
        )}
      </div>

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