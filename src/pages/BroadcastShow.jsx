import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';

const GOLD = '#D4AF37';

function extractBullets(script) {
  if (!script) return [];
  const sentences = script.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+/g) || [script];
  const cleaned = sentences
    .map(s => s.trim())
    .filter(s => s.length > 25 && !/^(so|well|you know|now|okay|great|thanks|absolutely)[,.\s]/i.test(s));
  return cleaned.slice(0, 5).map(s => s.replace(/[.!?]+$/, ''));
}

export default function BroadcastShow() {
  const [segments, setSegments] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.entities.DnnNewsClip.list(undefined, 200)
      .then((clips) => {
        const byArticle = {};
        for (const c of clips) {
          const key = c.question || 'Other';
          if (!byArticle[key]) byArticle[key] = [];
          byArticle[key].push(c);
        }
        const contentSegs = [];
        for (const headline of Object.keys(byArticle)) {
          const articleClips = byArticle[headline].sort((a, b) => (a.faqIndex || 0) - (b.faqIndex || 0));
          const allReady = articleClips.every(c =>
            c.charlieVideoUrl && (!c.bobScript || c.bobVideoUrl)
          );
          if (!allReady) continue;
          for (const c of articleClips) {
            if (c.kind === 'qa') {
              if (c.bobVideoUrl) {
                contentSegs.push({
                  src: c.bobVideoUrl,
                  speaker: 'bob',
                  title: c.question,
                  bullets: extractBullets(c.bobScript),
                });
              }
            } else {
              contentSegs.push({ src: c.charlieVideoUrl, speaker: 'charlie' });
            }
          }
        }
        if (contentSegs.length > 0) {
          setSegments(contentSegs);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (segments.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
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
    <div className="fixed inset-0" style={{ background: '#000' }}>
      <DnnNewsBroadcastPlayer segments={segments} onClose={() => window.location.href = '/'} />
    </div>
  );
}