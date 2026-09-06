import React from 'react';

const GOLD = '#D4AF37';
const STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const STUDIO_LOOP_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';

/**
 * MOCKUP — new client portal front page, placed ABOVE the existing
 * StudioHeroBanner/SolutionMapEntry stack in Home.jsx so nothing is lost.
 * Tan background, headline copy on the left, DNN studio video shrunk to
 * ~50% size on the right.
 */
export default function ClientHeroMockup() {
  return (
    <div className="w-full px-6 sm:px-10 py-14" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Header copy — left */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>
            Your Client Portal
          </p>
          <p
            className="italic font-semibold leading-snug"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
              color: '#1a1a1a',
            }}
          >
            "We provide a Real Time, lifetime workspace designed to maximize your real estate opportunities.
          </p>
          <p
            className="italic font-semibold leading-snug mt-3"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
              color: GOLD,
            }}
          >
            No sales pitches, just real-time solutions and a clear path to execute results."
          </p>
          <p className="mt-4 text-sm italic" style={{ color: '#4a4a4a' }}>— Bob Dyson</p>
        </div>

        {/* Studio video — right, ~50% size */}
        <div className="w-full md:w-1/2 shrink-0">
          <div className="relative rounded-2xl overflow-hidden mx-auto" style={{ border: `2px solid ${GOLD}`, background: '#000', maxWidth: '420px' }}>
            <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #ef4444', color: '#ef4444' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
            </span>
            <video
              src={STUDIO_LOOP_VIDEO}
              poster={STUDIO_STILL}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}