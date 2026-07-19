import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';

const GOLD = '#D4AF37';

/**
 * DnnNewsPresenter — SINGLE-SCENE broadcast trigger.
 *
 * Loads the latest completed DnnBroadcast and exposes a preview thumbnail.
 * On click, opens the full-screen player with the single master MP4.
 */
export default function DnnNewsPresenter() {
  const [broadcast, setBroadcast] = useState(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    // Auto-open when arriving from the landing page News pill
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoplay') === '1') {
      setOpen(true);
    }

    // Fetch the latest completed broadcast with a master videoUrl
    base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 5)
      .then((broadcasts) => {
        const show = broadcasts?.find(b => b.videoUrl);
        if (show) setBroadcast(show);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Pause & mute the preview video whenever the full-screen player is open
  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    if (open) {
      v.pause();
      v.muted = true;
    } else {
      v.muted = true;
      v.currentTime = 1.5;
    }
  }, [open]);

  if (!loaded) return null;
  if (!broadcast?.videoUrl) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          data-dnn-news-trigger
          aria-label="Watch today's DNN broadcast"
          className="relative w-16 h-16 md:w-20 md:h-20 transition-all hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
            style={{ background: '#0d0d0d', border: `2px solid ${GOLD}` }}>
            <video
              ref={previewRef}
              src={broadcast.videoUrl}
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => { e.target.muted = true; e.target.currentTime = 1.5; e.target.pause(); }}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          </span>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
            style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
            <Play className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5" style={{ color: '#000' }} />
          </span>
        </button>
      )}

      {open && createPortal(
        <DnnNewsBroadcastPlayer
          videoUrl={broadcast.videoUrl}
          presenter={broadcast.presenter}
          title={broadcast.show_name}
          headlines={broadcast.headlines}
          onClose={() => { window.location.replace('/?choose=1'); }}
        />,
        document.body
      )}
    </>
  );
}