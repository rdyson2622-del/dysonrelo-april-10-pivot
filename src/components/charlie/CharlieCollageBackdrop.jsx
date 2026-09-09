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
      {/* Single shot of Charlie next to the DNN logo */}
      <img
        src={CHARLIE_PHOTOS[0].url}
        alt="Charlie Simmons at the DNN News Desk"
        className="w-full h-full object-cover object-top sm:object-center brightness-105 saturate-105"
      />
      {/* Crisp studio border */}
      <div className="absolute inset-0 border border-[#D4AF37]/50 pointer-events-none rounded-3xl" />
    </div>
  );
}