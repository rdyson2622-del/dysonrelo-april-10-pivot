import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';
import { DNN_STING_URL } from '@/components/dnn/DnnStingVideo';

const GOLD = '#D4AF37';

/**
 * DnnNewsPresenter — Charlie + Bob duo presentation for the DNN National Desk.
 *
 * Charlie opens by introducing the national real estate news service,
 * then hands off to Bob who explains the unique "News + Solution" model.
 */
export default function DnnNewsPresenter() {
  const [segments, setSegments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Auto-open when arriving from the landing page News pill
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoplay') === '1') {
      setOpen(true);
    }
    base44.entities.DnnNewsClip.list(undefined, 200)
      .then((clips) => {
        // Group by article headline, sort each group by faqIndex
        const byArticle = {};
        for (const c of clips) {
          const key = c.question || 'Other';
          if (!byArticle[key]) byArticle[key] = [];
          byArticle[key].push(c);
        }
        // Only keep articles where all clips have completed video
        const segs = [];
        segs.push({ src: DNN_STING_URL, speaker: 'sting' });
        for (const headline of Object.keys(byArticle)) {
          const articleClips = byArticle[headline].sort((a, b) => (a.faqIndex || 0) - (b.faqIndex || 0));
          const allDone = articleClips.every(c =>
            c.charlieStatus === 'completed' && (!c.bobScript || c.bobStatus === 'completed')
          );
          if (!allDone) continue;
          for (const c of articleClips) {
            if (c.charlieVideoUrl) segs.push({ src: c.charlieVideoUrl, speaker: 'charlie' });
            if (c.bobVideoUrl) segs.push({ src: c.bobVideoUrl, speaker: 'bob' });
          }
        }
        segs.push({ src: DNN_STING_URL, speaker: 'sting' });
        setSegments(segs);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;
  if (segments.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Hear Charlie explain DNN National Desk"
        className="relative w-16 h-16 md:w-20 md:h-20 transition-all hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
          style={{ background: '#0d0d0d', border: `2px solid ${GOLD}` }}>
          <video
            src={segments[0].src}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => { e.target.currentTime = 1.5; }}
            className="w-full h-full object-cover object-center pointer-events-none"
          />
        </span>
        <span className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
          style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
          <Play className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5" style={{ color: '#000' }} />
        </span>
      </button>

      {open && <DnnNewsBroadcastPlayer segments={segments} onClose={() => setOpen(false)} />}
    </>
  );
}