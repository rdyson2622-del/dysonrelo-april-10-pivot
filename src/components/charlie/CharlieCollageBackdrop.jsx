import React, { useState } from 'react';

export const CHARLIE_PHOTOS = [
  {
    id: 'desk_anchor',
    title: 'DNN News Desk',
    label: 'Anchor Desk',
    url: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png',
    position: 'object-center',
  },
  {
    id: 'studio_wide',
    title: 'DNN Broadcast Stage',
    label: 'Studio Stage',
    url: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/8d6b4672f_Screenshot2026-08-24at1.59.35PM.png',
    position: 'object-center',
  },
  {
    id: 'solo_world',
    title: 'DNN World Desk',
    label: 'Executive Solo',
    url: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a0e52087b_Screenshot2026-09-09at23409PM.png',
    position: 'object-center',
  },
  {
    id: 'desk_portrait',
    title: 'Concierge Advisory',
    label: 'Advisory Desk',
    url: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/17085d0f8_Screenshot2026-08-30at93052AM.png',
    position: 'object-top',
  },
  {
    id: 'live_broadcast',
    title: 'Live Morning Show',
    label: 'Live Broadcast',
    url: 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a0e22e6c9_Screenshot2026-09-09at23439PM.png',
    position: 'object-center',
  },
];

export default function CharlieCollageBackdrop({ activeIndex = null, onSelectPhoto }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 4-Panel Dynamic Studio Collage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 w-full h-full gap-0.5 opacity-55 transition-opacity duration-500">
        {/* Panel 1: Main Anchor Desk Close-up */}
        <div className="relative h-full overflow-hidden">
          <img
            src={CHARLIE_PHOTOS[0].url}
            alt={CHARLIE_PHOTOS[0].title}
            className="w-full h-full object-cover object-top scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        </div>

        {/* Panel 2: Solo Anchor at World Map Desk */}
        <div className="relative h-full overflow-hidden">
          <img
            src={CHARLIE_PHOTOS[2].url}
            alt={CHARLIE_PHOTOS[2].title}
            className="w-full h-full object-cover object-center scale-105"
          />
        </div>

        {/* Panel 3: Live Broadcast Studio Set */}
        <div className="relative h-full overflow-hidden hidden md:block">
          <img
            src={CHARLIE_PHOTOS[4].url}
            alt={CHARLIE_PHOTOS[4].title}
            className="w-full h-full object-cover object-center scale-105"
          />
        </div>

        {/* Panel 4: Executive Advisory Desk Portrait */}
        <div className="relative h-full overflow-hidden">
          <img
            src={CHARLIE_PHOTOS[3].url}
            alt={CHARLIE_PHOTOS[3].title}
            className="w-full h-full object-cover object-top scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
        </div>
      </div>

      {/* Cinematic Studio Scrim & Vignette Overlay — preserves high contrast for the Mic Button */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.85) 60%, rgba(5,5,5,0.96) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-[#0a0a0a]/80" />
      <div className="absolute inset-0 border border-[#D4AF37]/30 pointer-events-none rounded-3xl" />
    </div>
  );
}