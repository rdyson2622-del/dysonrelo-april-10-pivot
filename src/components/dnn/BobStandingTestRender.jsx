import React, { useState, useRef, useEffect } from 'react';
import { Loader2, PlayCircle, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const CACHE_KEY = 'dnn_bob_desk_test_last_video';

// Confirmed clean render on this exact talking-photo + voice combo — Bob
// framed edge-to-edge in the box, no side bars. Used as the default shown
// until a fresh test is run, so the card never opens on a stale/bad take.
const KNOWN_GOOD_VIDEO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/198c52f99_vetdesk_6a52839606e00cdc06b05e2d_bob.mp4';

// Shows the LAST completed test render instantly on load (cached to a
// permanent URL by the backend) — no click-and-wait required to see it.
// "Re-render" kicks off a fresh proof render in the background.
export default function BobStandingTestRender() {
  const cached = (() => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (_) { return null; } })();
  const [state, setState] = useState('completed'); // idle | dispatching | polling | completed | failed
  const [videoUrl, setVideoUrl] = useState(cached?.videoUrl || KNOWN_GOOD_VIDEO_URL);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);

  const runTest = async () => {
    setState('dispatching');
    setError(null);
    try {
      const res = await base44.functions.invoke('heygenBobDeskTest', { action: 'dispatch' });
      const videoId = res.data.video_id;
      setState('polling');
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await base44.functions.invoke('heygenBobDeskTest', { action: 'status', video_id: videoId });
          const { status, videoUrl: url, error: err } = statusRes.data;
          if (status === 'completed' && url) {
            clearInterval(pollRef.current);
            setVideoUrl(url);
            setState('completed');
            localStorage.setItem(CACHE_KEY, JSON.stringify({ videoUrl: url, completedAt: Date.now() }));
          } else if (status === 'failed') {
            clearInterval(pollRef.current);
            setError(err || 'Render failed');
            setState('failed');
          }
        } catch (e) {
          clearInterval(pollRef.current);
          setError(e.message);
          setState('failed');
        }
      }, 5000);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
      setState('failed');
    }
  };

  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <h2 className="text-white font-bold mb-2">Bob — Outside Casual Box (proven explainer look)</h2>
      <p className="text-sm mb-4" style={{ color: '#ddd' }}>
        Bob's own segment, cut in separately from Charlie's desk shots — same talking-photo look already proven across the explainer videos. No studio background, no pillarboxing.
      </p>

      {videoUrl && (
        <div className="relative mb-3">
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            className="w-full rounded-xl"
            style={{ border: `1px solid ${GOLD}`, background: '#000', maxHeight: '70vh', opacity: (state === 'dispatching' || state === 'polling') ? 0.35 : 1 }}
          />
          {(state === 'dispatching' || state === 'polling') && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#000', color: GOLD, border: `1px solid ${GOLD}` }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Old take shown — rendering fresh video...
              </span>
            </div>
          )}
        </div>
      )}

      {state === 'idle' && !videoUrl && (
        <button
          onClick={runTest}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: GOLD, color: '#000' }}
        >
          <PlayCircle className="w-4 h-4" /> Run Bob Test Render
        </button>
      )}

      {(state === 'dispatching' || state === 'polling') && (
        <div className="flex items-center gap-2 text-sm" style={{ color: GOLD }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          {state === 'dispatching' ? 'Dispatching to HeyGen...' : 'Rendering a fresh take — the clip above will update when it\'s done...'}
        </div>
      )}

      {state === 'failed' && (
        <div>
          <p className="text-sm mb-3" style={{ color: '#ef4444' }}>Test render failed: {error}</p>
          <button onClick={runTest} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#000' }}>
            Retry Test
          </button>
        </div>
      )}

      {state === 'completed' && (
        <button
          onClick={runTest}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-render
        </button>
      )}
    </div>
  );
}