import React from 'react';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2dc0b99dd_DNN.png';

/**
 * TagTeamStudioSample — visual mockup of the DNN master studio template.
 *
 * Shows Charlie (left, seated behind the curved desk) and Bob (right, standing)
 * positioned over the permanent HeyGen studio background. This is the sample
 * layout the render pipeline will produce once the template is built in HeyGen
 * and the daily scripts are injected.
 *
 * Display only — no drag, no video. A pre-render reference for the studio look.
 */
export default function TagTeamStudioSample() {
  return (
    <div className="w-full">
      {/* Label bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
          <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            DNN Master Studio · Sample
          </p>
        </div>
        <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(212,175,55,0.5)' }}>
          Charlie &amp; Bob · Tag-Team
        </span>
      </div>

      {/* Studio canvas */}
      <div
        className="relative w-full overflow-hidden select-none rounded-xl"
        style={{
          aspectRatio: '16/9',
          backgroundImage: `url('${STUDIO_BG}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(212,175,55,0.3)',
          boxShadow: '0 10px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top title bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-5 py-1.5 rounded-full flex items-center gap-2"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.5)`, backdropFilter: 'blur(6px)' }}>
          <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>
            DNN Real Estate News
          </span>
        </div>

        {/* Charlie — left, seated behind desk (lower-left region) */}
        <div
          className="absolute flex flex-col items-center justify-end"
          style={{
            left: '4%',
            top: '32%',
            width: '26%',
            height: '52%',
            zIndex: 20,
          }}
        >
          <div className="w-full h-full rounded-lg flex items-end justify-center"
            style={{ border: '1px dashed rgba(212,175,55,0.45)', background: 'rgba(212,175,55,0.04)' }}>
            <div className="w-full text-center pb-2">
              <p className="text-[11px] md:text-sm font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                Charlie
              </p>
              <p className="text-[8px] md:text-[10px] tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.6)' }}>
                Seated · Left Desk
              </p>
            </div>
          </div>
        </div>

        {/* Bob — right, standing (full-height right region) */}
        <div
          className="absolute flex flex-col items-center justify-end"
          style={{
            left: '62%',
            top: '18%',
            width: '24%',
            height: '70%',
            zIndex: 20,
          }}
        >
          <div className="w-full h-full rounded-lg flex items-end justify-center"
            style={{ border: '1px dashed rgba(212,175,55,0.45)', background: 'rgba(212,175,55,0.04)' }}>
            <div className="w-full text-center pb-2">
              <p className="text-[11px] md:text-sm font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                Bob
              </p>
              <p className="text-[8px] md:text-[10px] tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.6)' }}>
                Standing · Right
              </p>
            </div>
          </div>
        </div>

        {/* Script flow chips */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 md:gap-2 px-2">
          {['Charlie · Open', 'Bob · Strategy', 'Charlie · Close'].map((seg, i) => (
            <React.Fragment key={seg}>
              <span
                className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase whitespace-nowrap px-2 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(212,175,55,0.4)`, color: GOLD }}
              >
                {seg}
              </span>
              {i < 2 && <span className="text-[8px] md:text-[10px]" style={{ color: 'rgba(212,175,55,0.5)' }}>→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Sample watermark */}
        <div className="absolute top-3 right-3 z-30 px-2 py-0.5 rounded-md"
          style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <span className="text-[8px] font-black tracking-[0.25em] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
            Sample
          </span>
        </div>
      </div>

      <p className="text-[10px] text-center mt-3" style={{ color: 'rgba(212,175,55,0.5)' }}>
        Background, presenters &amp; voices are locked in the HeyGen master template — Base44 injects the daily script to produce one MP4.
      </p>
    </div>
  );
}