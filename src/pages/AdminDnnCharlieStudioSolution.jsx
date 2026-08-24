import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import LockedPageSourceViewer from '@/components/dnn/LockedPageSourceViewer';
import CharlieDeskTestRender from '@/components/dnn/CharlieDeskTestRender';

const GOLD = '#D4AF37';

// ══════════════════════════════════════════════════════════════════════
// ✅ LOCKED — DNN_CHARLIE_DESK_STUDIO (the ONLY approved studio look)
// Full 16:9 desk broadcast: Charlie seated in-frame at the curved DNN
// desk, US map wall behind him, gold DNN branding, side walls in frame.
// This page exists so this exact look is NEVER "rediscovered" or redone.
// ══════════════════════════════════════════════════════════════════════
const DNN_CHARLIE_DESK_STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
// idle_wide_1080 — true desk-in-frame MP4 master. Not yet located/uploaded.
// Do NOT substitute 56c7 for this slot — it is REJECTED (see below).
const DNN_CHARLIE_DESK_STUDIO_IDLE_WIDE_1080 = null;

const CODE_SAMPLE = `// HeyGen dispatch — Charlie segment (DNN_CHARLIE_DESK_STUDIO look)
// Charlie fills the full 16:9 frame, seated at the curved DNN desk,
// US map wall + gold DNN branding behind him. Studio is baked into
// the source still/MP4 — nothing composited at render time.
const payload = {
  video_inputs: [
    {
      character: {
        type: "talking_photo",
        talking_photo_id: CHARLIE_DESK_STUDIO_TALKING_PHOTO_ID, // desk-in-frame look, NOT the bookshelf PiP asset
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
            Page #3 — DNN_CHARLIE_DESK_STUDIO: LOCKED (Permanent Record)
          </p>
        </div>

        {/* ── Plain English explanation ── */}
        <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <h2 className="text-white font-bold mb-3">In Plain English — The ONE Approved Studio Look</h2>
          <ul className="space-y-2 text-sm" style={{ color: '#ddd' }}>
            <li>• The only approved look is <strong style={{ color: GOLD }}>DNN Charlie Desk Studio</strong>: full 16:9 frame, Charlie seated in-frame at the curved DNN desk, US map wall behind him, gold DNN branding, side walls visible.</li>
            <li>• Locked master: the still <code style={{ color: GOLD }}>0f55…png</code> below — full-bleed, no letterboxing.</li>
            <li>• This is the ONLY version allowed on the public landing page and Page #3. It is full-bleed only — never inset in a box.</li>
            <li>• Production plan: the next DNN news show render must match this still exactly — same desk-in-frame composition, US map wall, and gold branding — with no PiP box and no bookshelf set.</li>
          </ul>
        </div>

        {/* ── Locked master: still (ONLY confirmed desk-in-frame asset) ── */}
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
          Locked Master — Primary Still (0f55…png)
        </p>
        <img
          src={DNN_CHARLIE_DESK_STUDIO_STILL}
          alt="DNN Charlie Desk Studio — locked master still"
          className="w-full aspect-video rounded-xl mb-2 object-contain"
          style={{ border: '1px solid rgba(212,175,55,0.3)', background: '#000' }}
        />
        <p className="text-[11px] text-gray-500 mb-8">
          DNN_CHARLIE_DESK_STUDIO — Charlie in-frame at the curved desk, full 16:9. This is the ONLY confirmed LOCKED master until a true desk-in-frame MP4 (idle_wide_1080) is located.
        </p>



        {/* ── LOCKED — idle_wide_1080 (second locked asset in this section) ── */}
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
          Locked Master — idle_wide_1080 (1920x1080)
        </p>
        <div className="rounded-xl p-4 mb-8" style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.04)' }}>
          <p className="text-[12px]" style={{ color: '#ddd' }}>
            <code style={{ color: GOLD }}>idle_wide_1080.png</code> — 1920x1080 desk-in-frame wide idle plate.
            Part of DNN_CHARLIE_DESK_STUDIO. Source of record:{' '}
            <code style={{ color: GOLD }}>/workspace/dnn-articles/2026-08-21-tampa-sample/idle_wide_1080.png</code>.
            Upload to media.base44 when needed; use for full-bleed landing.
          </p>
        </div>

        {/* ── REJECTED ARCHIVE — never label any of these LOCKED MASTER ── */}
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#ef4444' }}>
          Rejected Archive — NOT DNN_CHARLIE_DESK_STUDIO
        </p>
        <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.35)' }}>
          <ul className="space-y-2 text-sm" style={{ color: '#ddd' }}>
            <li>• <strong style={{ color: '#ef4444' }}>Empty plate + PiP Charlie</strong> (bookshelf / other sets) — the Charlie-in-a-box trail. REJECTED.</li>
            <li>• <strong style={{ color: '#ef4444' }}>talking_photo_id</strong> <code>72730cc3f5774167811efc2dbda1d1d6</code> — REJECTED avatar asset.</li>
            <li>• <strong style={{ color: '#ef4444' }}>56c7 MP4</strong> (<code>56c7be606_test-heygen-single-mp4-format-studio.mp4</code>) — 1920x1080 but PiP Charlie / empty-plate trail. This is a PiP trail artifact, <strong>NOT the locked master</strong>. Never used as live hero.</li>
            <li>• <strong style={{ color: '#ef4444' }}>Ultrawide 47405</strong> (<code>47405e279_DNNSTUDIOANDLANDINGPAGE00.png</code>) — wrong aspect. REJECTED.</li>
          </ul>
          <p className="text-[11px] mt-3" style={{ color: '#999' }}>
            No LOCKED MASTER label may appear on any PiP or 56c7 design.
          </p>
        </div>

        {/* ── 10-second proof render, before a full show dispatch ── */}
        <CharlieDeskTestRender />

        {/* REJECTED archive */}
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#ef4444' }}>
          REJECTED Archive — Do NOT Use As Locked Master
        </p>
        <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm mb-3" style={{ color: '#ddd' }}>
            Empty plate + PiP Charlie (bookshelf / other sets) — the Charlie-in-a-box trail. Archived for the record only. NEVER the Broadcast Show hero/background and NEVER a LOCKED MASTER.
          </p>
          <ul className="space-y-2 text-sm" style={{ color: '#ddd' }}>
            <li>• <strong style={{ color: '#ef4444' }}>REJECTED_PIP_TRAIL_MP4</strong>: <code>56c7be606_test-heygen-single-mp4-format-studio.mp4</code> — 1920x1080 but PiP Charlie / empty-plate trail. NOT DNN_CHARLIE_DESK_STUDIO.</li>
            <li>• <strong style={{ color: '#ef4444' }}>REJECTED_TALKING_PHOTO_ID</strong>: <code>72730cc3f5774167811efc2dbda1d1d6</code></li>
            <li>• <strong style={{ color: '#ef4444' }}>REJECTED empty-plate PiP composite</strong> — Charlie inset in a picture-in-picture box over an empty studio plate.</li>
            <li>• <strong style={{ color: '#ef4444' }}>REJECTED_ULTRAWIDE</strong>: <code>47405e279_DNNSTUDIOANDLANDINGPAGE00.png</code></li>
          </ul>
        </div>

        {/* ── Code record ── */}
        <LockedPageSourceViewer
          title="Locked Code: HeyGen Dispatch Method for DNN_CHARLIE_DESK_STUDIO"
          filePath="base44/functions/dnnDirectDispatch/entry.ts (Charlie block)"
          code={CODE_SAMPLE}
        />
      </div>
    </div>
  );
}