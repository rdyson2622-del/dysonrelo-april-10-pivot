import React from 'react';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * ScriptStudioPreview — visual teleprompter-style preview of the studio
 * backdrop with the open/close script text overlaid in a gold-bordered card.
 * Shows what the anchor will actually say on camera.
 */
export default function ScriptStudioPreview({ label, script, date, speaker = 'charlie' }) {
  const speakerColor = speaker === 'bob' ? '#A78BFA' : GOLD;
  const speakerLabel = speaker === 'bob' ? 'BOB DYSON' : 'CHARLIE SIMMONS';

  return (
    <div className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: '16/9', background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}>
      {/* Studio backdrop */}
      <img src={STUDIO_BG} alt="DNN Studio" className="absolute inset-0 w-full h-full object-cover opacity-60" />

      {/* DNN bug */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.3)` }}>
        <img src={DNN_LOGO} alt="DNN" className="h-3.5 w-auto" />
        <span className="text-[7px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>DNN</span>
      </div>

      {/* Speaker label */}
      <div className="absolute top-3 right-3 px-2 py-1 rounded-md"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${speakerColor}55` }}>
        <span className="text-[7px] font-black tracking-[0.2em] uppercase" style={{ color: speakerColor }}>
          {speakerLabel}
        </span>
      </div>

      {/* Teleprompter overlay — gold-bordered card with script text */}
      <div className="absolute inset-x-4 bottom-4 top-12 flex flex-col">
        {label && (
          <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-1.5" style={{ color: GOLD }}>
            {label} {date && <span className="opacity-50">· {date}</span>}
          </p>
        )}
        <div className="flex-1 rounded-lg p-3 overflow-y-auto"
          style={{
            background: 'rgba(0,0,0,0.75)',
            border: `1px solid ${GOLD}55`,
            backdropFilter: 'blur(4px)',
          }}>
          {script ? (
            <p className="text-[11px] leading-relaxed text-white whitespace-pre-wrap font-mono">
              {script}
            </p>
          ) : (
            <p className="text-[11px] text-slate-600 italic text-center mt-8">
              No script yet. Generate or edit the template to see the preview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}