// BroadcastShow — public broadcast player page (no auth required)
// Supports two modes:
//   1. ?b=<broadcastId> → plays the composited DnnBroadcast video directly
//   2. No param → loads DnnNewsClip segments (legacy clip-based player)
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';
import SubscribeCTA from '@/components/dnn/SubscribeCTA';

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
  const [broadcast, setBroadcast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const broadcastId = urlParams.get('b');

    if (broadcastId) {
      // Mode 1: Play specific composited DnnBroadcast video
      base44.entities.DnnBroadcast.filter({ id: broadcastId })
        .then((rows) => {
          if (rows?.[0]?.videoUrl) {
            setBroadcast(rows[0]);
          }
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
      return;
    }

    // Mode 2: Legacy clip-based player
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

  // Mode 1: Composited broadcast video player
  if (broadcast) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#000' }}>
        <div className="w-full max-w-5xl px-4">
          <div className="text-center mb-4">
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              {broadcast.show_name || 'DNN Broadcast'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {new Date(broadcast.broadcast_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <video
            src={broadcast.videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full rounded-lg"
            style={{ border: `1px solid rgba(212,175,55,0.2)` }}
          />
          {broadcast.headlines?.length > 0 && (
            <div className="mt-4 text-center">
              {broadcast.headlines.map((h, i) => (
                <p key={i} className="text-sm text-slate-300 mb-1">{h}</p>
              ))}
            </div>
          )}
          <div className="mt-6 w-full max-w-md mx-auto">
            <SubscribeCTA variant="endcard" />
          </div>
          <button onClick={() => window.location.href = '/'} className="mt-4 text-xs underline" style={{ color: GOLD }}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Mode 2: Legacy clip-based player
  if (segments.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6" style={{ background: '#000' }}>
        <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
          DNN Intelligence Bureau
        </p>
        <p className="text-xs text-slate-500">No broadcast available at this time.</p>
        <div className="w-full max-w-md">
          <SubscribeCTA variant="endcard" />
        </div>
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