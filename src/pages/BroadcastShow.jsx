// BroadcastShow — public full-screen broadcast player (no auth required).
// Renders the composited DNN studio show (DnnNewsBroadcastPlayer) for the
// latest ready broadcast. Shows a "Processing..." indicator while n8n renders.
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const STUDIO_WITH_ANCHORS = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a25febb8d_Screenshot2026-08-01at31026PM.png';

// Cloudinary 4K broadcast videos are huge (40MB+) and the audio track buffers
// long before the video frames can decode, so viewers hear voice over a black
// screen. Downscale to 1280px on Cloudinary URLs so the video loads fast.
function optimizeVideoUrl(url) {
  if (!url || !url.includes('res.cloudinary.com/video/upload/')) return url;
  return url.replace('/video/upload/', '/video/upload/c_scale,w_1280,q_auto,f_auto/');
}

export default function BroadcastShow() {
  const [broadcast, setBroadcast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch the latest ready broadcast ONCE on mount. No realtime subscription —
  // the subscription was re-triggering the autoplay effect on every entity
  // update (poller writing compositedVideoUrl, distribution, etc.), causing
  // the audio to echo / play identically twice. A single fetch is enough.
  useEffect(() => {
    (async () => {
      try {
        const broadcasts = await base44.entities.DnnBroadcast.list('-updated_date', 20);
        const ready = broadcasts.find(b =>
          (b.status === 'ready' || b.status === 'completed') &&
          b.videoUrl &&
          !String(b.videoUrl).startsWith('heygen:pending:')
        );
        if (ready) {
          setBroadcast(ready);
        } else {
          window.location.href = '/dnn-news';
          return;
        }
      } catch (_) {
        window.location.href = '/dnn-news';
        return;
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const isProcessing = broadcast?.status === 'processing';
  const videoUrl = broadcast?.videoUrl ? optimizeVideoUrl(broadcast.videoUrl) : null;
  const canPlay = (broadcast?.status === 'ready' || broadcast?.status === 'completed') && videoUrl;

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Processing state — clean background indicator
  if (isProcessing && !canPlay) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6" style={{ background: '#000' }}>
        <button
          onClick={() => window.location.href = '/'}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}` }}
          aria-label="Close broadcast"
        >
          <X className="w-5 h-5" style={{ color: GOLD }} />
        </button>

        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}>
          <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>DNN</span>
        </div>

        <img src={STUDIO_WITH_ANCHORS} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
          <img src={DNN_LOGO} alt="DNN" className="h-14 w-auto opacity-90" />
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: GOLD }} />
            <p className="text-sm font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>
              Processing Broadcast in Background...
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            The DNN studio is rendering your daily broadcast. This page will update
            automatically the moment the video is ready.
          </p>
        </div>
      </div>
    );
  }

  if (!canPlay) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-12 w-auto opacity-80" />
        <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          DNN Intelligence Bureau
        </p>
        <p className="text-xs text-slate-500">No broadcast available at this time.</p>
        <button onClick={() => window.location.href = '/'} className="text-xs underline" style={{ color: GOLD }}>
          Return Home
        </button>
      </div>
    );
  }

  // key={videoUrl} forces a FULL remount if the URL ever changes — the old
  // <video> unmounts (audio stops immediately) and a fresh player mounts.
  // This eliminates any possibility of overlapping audio / echo.
  return (
    <DnnNewsBroadcastPlayer
      key={videoUrl}
      videoUrl={videoUrl}
      status="ready"
      onClose={() => window.location.href = '/'}
    />
  );
}