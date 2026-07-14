import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import QADuoPresenter from '@/components/charlie/QADuoPresenter';
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
    base44.entities.DnnNewsClip.list('faqIndex')
      .then((clips) => {
        const segs = [];
        // DNN logo sting opens the broadcast
        segs.push({ src: DNN_STING_URL, speaker: 'charlie' });
        for (const c of clips) {
          if (c.charlieVideoUrl && c.charlieStatus === 'completed') {
            segs.push({ src: c.charlieVideoUrl, speaker: 'charlie' });
          }
          if (c.bobVideoUrl && c.bobStatus === 'completed') {
            segs.push({ src: c.bobVideoUrl, speaker: 'bob' });
          }
        }
        // DNN logo sting closes the broadcast
        segs.push({ src: DNN_STING_URL, speaker: 'charlie' });
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
        className="relative w-12 h-12 md:w-14 md:h-14 transition-all hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
          style={{ background: '#0d0d0d', border: `2px solid ${GOLD}` }}>
          <video
            src={segments[0].src}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => { e.target.currentTime = 1.5; }}
            className="w-full h-full object-cover pointer-events-none"
          />
        </span>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
          <Play className="w-2.5 h-2.5 ml-0.5" style={{ color: '#000' }} />
        </span>
      </button>

      {open && <QADuoPresenter segments={segments} onClose={() => setOpen(false)} />}
    </>
  );
}