import React, { useState, useRef, useEffect } from 'react';
import { Loader2, PlayCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

// 10-second proof render before dispatching a full show — see
// heygenCharlieDeskTest backend function for details.
export default function CharlieDeskTestRender() {
  const [state, setState] = useState('idle'); // idle | dispatching | polling | completed | failed
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);

  const runTest = async () => {
    setState('dispatching');
    setError(null);
    setVideoUrl(null);
    try {
      const res = await base44.functions.invoke('heygenCharlieDeskTest', { action: 'dispatch' });
      const videoId = res.data.video_id;
      setState('polling');
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await base44.functions.invoke('heygenCharlieDeskTest', { action: 'status', video_id: videoId });
          const { status, videoUrl: url, error: err } = statusRes.data;
          if (status === 'completed' && url) {
            clearInterval(pollRef.current);
            setVideoUrl(url);
            setState('completed');
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
    <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <h2 className="text-white font-bold mb-2">10-Second Proof Render — Charlie Speaking at the Desk</h2>
      <p className="text-sm mb-4" style={{ color: '#ddd' }}>
        Uploads the locked DNN Charlie Desk Studio still to HeyGen as a fresh talking photo and renders one test line, before committing to a full show dispatch.
      </p>

      {state === 'idle' && (
        <button
          onClick={runTest}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: GOLD, color: '#000' }}
        >
          <PlayCircle className="w-4 h-4" /> Run 10-Second Test Render
        </button>
      )}

      {(state === 'dispatching' || state === 'polling') && (
        <div className="flex items-center gap-2 text-sm" style={{ color: GOLD }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          {state === 'dispatching' ? 'Uploading still & dispatching to HeyGen...' : 'Rendering — polling HeyGen for completion...'}
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

      {state === 'completed' && videoUrl && (
        <div>
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video rounded-xl mb-2 object-contain"
            style={{ border: `1px solid ${GOLD}`, background: '#000' }}
          />
          <p className="text-[11px] text-gray-500 mb-3">
            Review lipsync and confirm no letterboxing before dispatching the full show.
          </p>
          <button onClick={runTest} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#000' }}>
            Run Again
          </button>
        </div>
      )}
    </div>
  );
}