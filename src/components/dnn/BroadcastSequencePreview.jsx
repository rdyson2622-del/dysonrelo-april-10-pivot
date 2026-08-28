import React, { useState, useRef } from 'react';
import { PlayCircle } from 'lucide-react';

const GOLD = '#D4AF37';
const CHARLIE_CACHE_KEY = 'dnn_charlie_desk_test_last_video';
const BOB_CACHE_KEY = 'dnn_bob_desk_test_last_video';

// Same confirmed clean render used as the default in BobStandingTestRender —
// so the sequence preview works even before a fresh Bob test has been run.
const BOB_KNOWN_GOOD_VIDEO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/198c52f99_vetdesk_6a52839606e00cdc06b05e2d_bob.mp4';

// Plays Charlie's desk clip, then automatically cuts to Bob's box clip —
// a quick preview of the toss: Charlie alone at the desk, Bob entering
// right after for his own segment.
export default function BroadcastSequencePreview() {
  const charlieUrl = (() => { try { return JSON.parse(localStorage.getItem(CHARLIE_CACHE_KEY))?.videoUrl; } catch (_) { return null; } })();
  const bobUrl = (() => { try { return JSON.parse(localStorage.getItem(BOB_CACHE_KEY))?.videoUrl; } catch (_) { return null; } })() || BOB_KNOWN_GOOD_VIDEO_URL;
  const [playing, setPlaying] = useState(null); // null | 'charlie' | 'bob'
  const videoRef = useRef(null);

  if (!charlieUrl || !bobUrl) {
    return (
      <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
        <h2 className="text-white font-bold mb-2">Full Sequence Preview — Charlie Tosses to Bob</h2>
        <p className="text-sm" style={{ color: '#ddd' }}>Run both test renders above at least once to preview the toss here.</p>
      </div>
    );
  }

  const start = () => setPlaying('charlie');

  const handleEnded = () => {
    if (playing === 'charlie') setPlaying('bob');
    else setPlaying(null);
  };

  const src = playing === 'bob' ? bobUrl : charlieUrl;

  return (
    <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <h2 className="text-white font-bold mb-2">Full Sequence Preview — Charlie Tosses to Bob</h2>
      <p className="text-sm mb-4" style={{ color: '#ddd' }}>
        Charlie alone at the desk, then cuts straight to Bob in his outside casual box the moment Charlie finishes.
      </p>

      {playing === 'bob' ? (
        // Bob's toss — shown inside a smaller boxed frame (not full-frame like
        // Charlie's desk shot) so the handoff visually reads as "cutting to
        // Bob in his box", the way a real broadcast cuts to a remote guest.
        <div className="rounded-xl mb-3 flex items-center justify-center p-6" style={{ background: '#000', border: `1px solid ${GOLD}`, minHeight: '360px' }}>
          <div className="relative" style={{ width: '60%' }}>
            <div className="absolute -top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase z-10"
              style={{ background: GOLD, color: '#000' }}>
              Bob Dyson
            </div>
            <video
              key={src}
              ref={videoRef}
              src={src}
              autoPlay
              controls
              onEnded={handleEnded}
              className="w-full rounded-lg"
              style={{ border: '2px solid #fff', background: '#000' }}
            />
          </div>
        </div>
      ) : playing === 'charlie' ? (
        <video
          key={src}
          ref={videoRef}
          src={src}
          autoPlay
          controls
          onEnded={handleEnded}
          className="w-full rounded-xl mb-3"
          style={{ border: `1px solid ${GOLD}`, background: '#000', maxHeight: '70vh' }}
        />
      ) : (
        <button
          onClick={start}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: GOLD, color: '#000' }}
        >
          <PlayCircle className="w-4 h-4" /> Play Sequence
        </button>
      )}
    </div>
  );
}