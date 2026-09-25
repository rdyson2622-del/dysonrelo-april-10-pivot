import React, { useRef, useState } from 'react';

const OVERLAY_SECONDS = 3;

export default function CopilotSeriesVideoCard({ story, posterUrl }) {
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef(null);

  const handleTimeUpdate = (e) => {
    setShowOverlay(e.target.currentTime < OVERLAY_SECONDS);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-black/15 bg-dyson-warm-paper shadow-sm">
      <div className="relative">
        <video
          ref={videoRef}
          controls
          preload="metadata"
          poster={posterUrl}
          src={story.url}
          onTimeUpdate={handleTimeUpdate}
          className="aspect-video w-full bg-black"
          aria-label={story.headline}
        />
        {story.titleOverlay && showOverlay && (
          <p className="pointer-events-none absolute bottom-10 left-0 right-0 px-4 text-center text-sm font-bold uppercase tracking-wide text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
            {story.titleOverlay}
          </p>
        )}
      </div>
      <div className="p-2"><p className="text-xs font-semibold text-dyson-text-dark">{story.headline}</p></div>
    </article>
  );
}