import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import LockedPageSourceViewer from '@/components/dnn/LockedPageSourceViewer';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════
// ✅ PERMANENT RECORD — DNN Studio Broadcast: Charlie-in-a-Box, SOLVED.
// This page exists so this solution is NEVER "rediscovered" or redone.
// If Charlie's studio look is ever questioned again, send them HERE.
// ══════════════════════════════════════════════════════════════════════
const TEST_RENDER_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/985182147_charlie-studio-test-render.mp4';
const TALKING_PHOTO_ID = '72730cc3f5774167811efc2dbda1d1d6';

const CODE_SAMPLE = `// HeyGen dispatch — Charlie segment (studio background baked into the photo)
const payload = {
  video_inputs: [
    {
      character: {
        type: "talking_photo",
        talking_photo_id: "${TALKING_PHOTO_ID}", // Charlie, seated at DNN desk, studio bg baked in
      },
      voice: {
        type: "text",
        input_text: charlieScriptText,
        voice_id: CHARLIE_VOICE_ID,
      },
    },
  ],
  dimension: { width: 1920, height: 1080 },
};

const res = await fetch("https://api.heygen.com/v2/video/generate", {
  method: "POST",
  headers: { "X-Api-Key": HEYGEN_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
// -> returns video_id, then poll /v1/video_status.get?video_id=... until "completed"`;

export default function AdminDnnCharlieStudioSolution() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <div className="max-w-5xl mx-auto pt-10 px-6 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Page #3 — DNN Charlie Studio Broadcast: SOLVED (Permanent Record)
          </p>
        </div>

        {/* ── Plain English explanation ── */}
        <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <h2 className="text-white font-bold mb-3">In Plain English — What We Do and Why It Works</h2>
          <ul className="space-y-2 text-sm" style={{ color: '#ddd' }}>
            <li>• Charlie's DNN studio broadcasts do NOT use transparent/alpha video layering. HeyGen's "talking photo" avatars do not support real-time transparency compositing — that path was tried and abandoned.</li>
            <li>• Instead, we use a "talking photo" asset where the DNN studio desk background is already baked directly into the source photo of Charlie. HeyGen just animates (lip-syncs) that still photo — there is nothing to composite at render time.</li>
            <li>• The verified working asset ID is <code style={{ color: GOLD }}>{TALKING_PHOTO_ID}</code>. This is the ONLY Charlie asset that should be used for studio broadcasts.</li>
            <li>• This is the exact same "Charlie-in-a-box" method already used successfully across the explainer video library — we did not invent anything new, we located and reused the proven asset.</li>
            <li>• The test render below was dispatched straight to the HeyGen API using this asset and came back "completed" — proof this method works end-to-end.</li>
          </ul>
        </div>

        {/* ── Proof: working test render ── */}
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
          Proof — Working Test Render
        </p>
        <div className="w-full aspect-video rounded-xl mb-2 overflow-hidden relative" style={{ border: '1px solid rgba(212,175,55,0.3)', background: '#000' }}>
          <video
            src={TEST_RENDER_VIDEO}
            controls
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scale(1.4)' }}
          />
        </div>
        <p className="text-[11px] text-gray-500 mb-8">
          Rendered via HeyGen talking_photo_id {TALKING_PHOTO_ID} — studio background baked into the source photo, no transparency required.
        </p>

        {/* ── Code record ── */}
        <LockedPageSourceViewer
          title="Locked Code: HeyGen Dispatch Method for Charlie Studio Segments"
          filePath="base44/functions/dnnDirectDispatch/entry.ts (Charlie block)"
          code={CODE_SAMPLE}
        />
      </div>
    </div>
  );
}