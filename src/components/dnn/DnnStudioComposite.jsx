import React from 'react';
// Empty DNN studio backdrop — NO people baked in. The 0f55cd52a still used
// elsewhere in the app (landing page hero) already has Charlie and Bob
// painted into it, which double-exposes them once the live video boxes are
// layered on top — never reuse that asset here.
const DNN_STUDIO_BACKGROUND_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/16260cf0d_generated_image.png';

const GOLD = '#D4AF37';

/**
 * DnnStudioComposite — LOCKED layout for Daily News production.
 *
 * How it works (read this before touching anything):
 * 1. HeyGen renders Charlie and Bob as two SEPARATE, simple, single-character
 *    clips — solid black background only (the "QA Duo" pattern already
 *    proven across roadmapQARender / vettingDeskQARender / lenderRender).
 *    HeyGen is NEVER asked to composite a studio background or a second
 *    person into the same render.
 * 2. The studio backdrop image below is a static asset placed full-frame
 *    behind both boxes, entirely in the browser. It never touches HeyGen.
 * 3. Each presenter box is a plain black box (no chroma-key, no alpha
 *    layering) with the video filling it edge-to-edge via object-cover —
 *    since the source render is already 16:9 solid black behind the
 *    presenter, there are no pillarbox side bars.
 *
 * Props:
 *   charlieVideoUrl, bobVideoUrl — video sources for each box (either can be omitted)
 *   activeSpeaker — 'charlie' | 'bob' | null — adds a live-mic highlight ring
 */
export default function DnnStudioComposite({ charlieVideoUrl, bobVideoUrl, activeSpeaker }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl" style={{ background: '#000' }}>
      {/* Studio backdrop — static image, composited on our side only */}
      <img src={DNN_STUDIO_BACKGROUND_URL} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Charlie box — lower left, black background behind him only */}
      {charlieVideoUrl && (
        <div className="absolute" style={{ bottom: '4%', left: '3%', width: '19.5%' }}>
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: `2px solid ${activeSpeaker === 'charlie' ? GOLD : 'rgba(212,175,55,0.4)'}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
              background: '#000',
            }}
          >
            <div className="w-full overflow-hidden" style={{ aspectRatio: '9 / 16', background: '#000' }}>
              <video
                src={charlieVideoUrl}
                autoPlay
                playsInline
                muted={activeSpeaker !== 'charlie'}
                className="w-full h-full block object-cover"
              />
            </div>
            <div className="px-2 py-1" style={{ background: '#0d0d0d', borderTop: `1px solid rgba(212,175,55,0.3)` }}>
              <span className="text-[9px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                CHARLIE SIMMONS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bob box — lower right, black background behind him only */}
      {bobVideoUrl && (
        <div className="absolute" style={{ bottom: '4%', right: '3%', width: '19.5%' }}>
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: `2px solid ${activeSpeaker === 'bob' ? GOLD : 'rgba(212,175,55,0.4)'}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
              background: '#000',
            }}
          >
            <div className="w-full overflow-hidden" style={{ aspectRatio: '9 / 16', background: '#000' }}>
              <video
                src={bobVideoUrl}
                autoPlay
                playsInline
                muted={activeSpeaker !== 'bob'}
                className="w-full h-full block object-cover"
              />
            </div>
            <div className="px-2 py-1" style={{ background: '#0d0d0d', borderTop: `1px solid rgba(212,175,55,0.3)` }}>
              <span className="text-[9px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                BOB DYSON
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}