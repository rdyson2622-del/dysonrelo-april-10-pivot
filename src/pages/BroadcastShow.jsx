// BroadcastShow — public full-screen broadcast player (no auth required)
// Plays the latest completed DnnBroadcast.videoUrl as a full-screen 4K MP4.
// Falls back to the latest published DnnArticle.video_url (production_status === 'complete').
import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

// Cloudinary 4K broadcast videos are huge (40MB+) and the audio track buffers
// long before the video frames can decode, so viewers hear voice over a black
// screen. Downscale to 1280px on Cloudinary URLs so the video loads fast.
function optimizeVideoUrl(url) {
  if (!url || !url.includes('res.cloudinary.com/video/upload/')) return url;
  return url.replace('/video/upload/', '/video/upload/c_scale,w_1280,q_auto/');
}

export default function BroadcastShow() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  // Ensure the video stops when the page unmounts so audio never lingers.
  useEffect(() => {
    return () => { try { videoRef.current?.pause(); } catch (_) {} };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // 1. Try latest completed DnnBroadcast with a valid videoUrl
        const broadcasts = await base44.entities.DnnBroadcast.list('-updated_date', 20);
        const latestBroadcast = broadcasts.find(b =>
          b.status === 'completed' &&
          b.videoUrl &&
          !String(b.videoUrl).startsWith('heygen:pending:')
        );
        if (latestBroadcast?.videoUrl) {
          setVideoUrl(optimizeVideoUrl(latestBroadcast.videoUrl));
          return;
        }

        // 2. Fallback: latest published DnnArticle with a completed video
        const articles = await base44.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 50);
        const latestArticle = articles.find(a =>
          a.production_status === 'complete' &&
          a.video_url &&
          !String(a.video_url).startsWith('heygen:pending:')
        );
        if (latestArticle?.video_url) {
          setVideoUrl(optimizeVideoUrl(latestArticle.video_url));
        }
      } catch (_) {
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!videoUrl) {
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

  return (
    <div className="fixed inset-0 bg-black">
      {/* Close button */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}` }}
        aria-label="Close broadcast"
      >
        <X className="w-5 h-5" style={{ color: GOLD }} />
      </button>

      {/* DNN LIVE bug */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.4)` }}>
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {/* Full-screen 4K MP4 */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={STUDIO_BG}
        autoPlay
        controls
        playsInline
        preload="auto"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          background: '#000',
        }}
      />
    </div>
  );
}