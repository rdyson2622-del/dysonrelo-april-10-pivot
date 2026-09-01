import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import LockedPageSourceViewer from '@/components/dnn/LockedPageSourceViewer';
import DnnStudioComposite from '@/components/dnn/DnnStudioComposite';

const GOLD = '#D4AF37';

// Plain black-background solo clips — QA Duo pattern (roadmapQARender /
// vettingDeskQARender). These already exist, no fresh HeyGen render needed
// to review this layout.
const CHARLIE_PLAIN_CLIP = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/2201470a5_roadmap_6a52cbc75ead5c9873240ccf_charlie.mp4';
const BOB_PLAIN_CLIP = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/198c52f99_vetdesk_6a52839606e00cdc06b05e2d_bob.mp4';

// ✅ FINAL APPROVED LOOK — locked 8/29. Do not swap the backdrop image or
// resize the boxes without the builder's explicit sign-off again.
const LOCKED_BACKDROP_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/16260cf0d_generated_image.png';
const LOCKED_BOX_WIDTH_PCT = '19.5%'; // 15% base size + 30% bump, approved 8/29

// ✅ Latest real finished show produced through the Creatomate pipeline using
// this locked look — San Diego, locked 9/1.
const LATEST_FINISHED_SHOW_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/75165cedb_san-diego-housing-inventory-remains-constrained-amid-sustained-price-resilience.mp4';
const LATEST_FINISHED_SHOW_HEADLINE = 'San Diego Housing Inventory Remains Constrained Amid Sustained Price Resilience';

const COMPOSITE_CODE_SAMPLE = `// DnnStudioComposite.jsx — the ONLY place the studio look is assembled
// 1. HeyGen renders Charlie and Bob as two separate solo clips,
//    solid black background only — never a studio image, never both
//    people in one render.
// 2. The studio backdrop is a static EMPTY image (no Charlie/Bob painted
//    into it) — locked URL: ${LOCKED_BACKDROP_URL}
// 3. Each box is ${LOCKED_BOX_WIDTH_PCT} wide, positioned lower-left (Charlie)
//    and lower-right (Bob), object-cover on a 9:16 container — zero pillarboxing.

<div className="relative w-full aspect-video">
  <img src="${LOCKED_BACKDROP_URL}" className="absolute inset-0 object-cover" />
  <video src={charlieVideoUrl} className="absolute ... object-cover" style={{ width: '${LOCKED_BOX_WIDTH_PCT}', bottom: '4%', left: '3%' }} />
  <video src={bobVideoUrl} className="absolute ... object-cover" style={{ width: '${LOCKED_BOX_WIDTH_PCT}', bottom: '4%', right: '3%' }} />
</div>`;

export default function AdminDnnCharlieStudioSolution() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <div className="max-w-5xl mx-auto pt-10 px-6 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Locked Approved Studio Look
          </p>
        </div>

        <div>

          <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <h2 className="text-white font-bold mb-3">Answering the question: is the studio backdrop done by us, or by HeyGen?</h2>
            <p className="text-sm mb-3" style={{ color: '#ddd' }}>
              <strong>Done entirely on our side.</strong> HeyGen never sees, renders, or knows about the studio image at all.
              HeyGen's only job is to render Charlie and Bob as two separate, simple, solo talking clips on a plain solid
              black background — the exact "QA Duo" method already proven on the Roadmap and Vetting Desk pages, used
              successfully for over two months. The studio backdrop image is a plain static picture we place full-frame
              behind both of them, and each of their boxes is placed with ordinary CSS positioning on top of it — no
              canvas tricks, no chroma-key, no transparency layering, no HeyGen "background" parameter.
            </p>
            <p className="text-sm" style={{ color: '#ddd' }}>
              That's the whole point of going back to this method: the less HeyGen has to do beyond "one person talking
              on a black background," the fewer chances it has to get something wrong. Everything you're seeing below —
              the studio, the box positions, the black fill behind each of them — is 100% our code, so it will look
              identical every single time, regardless of what HeyGen does or doesn't get right that day.
            </p>
          </div>

          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
            ✅ LOCKED FINAL LOOK — Approved 8/29, do not change without sign-off
          </p>
          <DnnStudioComposite charlieVideoUrl={CHARLIE_PLAIN_CLIP} bobVideoUrl={BOB_PLAIN_CLIP} />
          <p className="text-[11px] text-gray-500 mt-2 mb-2">
            Both clips above are existing plain black-background solo renders (no new HeyGen render was needed to build
            this preview) — proof the box/backdrop layout works with whatever solo clips the daily pipeline produces.
          </p>
          <div className="rounded-xl p-4 mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}` }}>
            <p className="text-xs font-black tracking-[0.15em] uppercase mb-2" style={{ color: GOLD }}>Locked Spec — reference this, don't re-derive it</p>
            <ul className="space-y-1 text-xs" style={{ color: '#ddd' }}>
              <li>• Backdrop image (empty, no people): <code style={{ color: GOLD }}>{LOCKED_BACKDROP_URL}</code></li>
              <li>• Box width: <code style={{ color: GOLD }}>{LOCKED_BOX_WIDTH_PCT}</code> each, positioned lower-left (Charlie) / lower-right (Bob), 9:16 portrait boxes</li>
              <li>• Lives in: <code style={{ color: GOLD }}>src/components/dnn/DnnStudioComposite.jsx</code> — the single shared component used everywhere this look is needed</li>
            </ul>
          </div>

          <LockedPageSourceViewer
            title="Locked Code: Studio Composite (src/components/dnn/DnnStudioComposite.jsx)"
            filePath="src/components/dnn/DnnStudioComposite.jsx"
            code={COMPOSITE_CODE_SAMPLE}
          />

          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3 mt-8" style={{ color: GOLD }}>
            ✅ Latest Finished Show Using This Locked Format — San Diego, locked 9/1
          </p>
          <div className="rounded-xl overflow-hidden mb-2" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
            <video src={LATEST_FINISHED_SHOW_URL} controls className="w-full" style={{ display: 'block' }} />
          </div>
          <p className="text-[11px] text-gray-500 mb-8">{LATEST_FINISHED_SHOW_HEADLINE}</p>
        </div>
      </div>
    </div>
  );
}