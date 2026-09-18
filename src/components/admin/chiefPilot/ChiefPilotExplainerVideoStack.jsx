import React from 'react';

export default function ChiefPilotExplainerVideoStack({ explainers }) {
  return (
    <aside className="space-y-2">
      {explainers.map(item => (
        <article key={item.id} className="overflow-hidden rounded-lg border border-black/15 bg-dyson-warm-paper shadow-sm">
          <video controls preload="metadata" src={item.videoUrl} className="aspect-video w-full bg-dyson-black" aria-label={`${item.speakerName}: ${item.label}`} />
          <div className="p-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-dyson-gold-deep">{item.speakerName}</p>
            <h3 className="mt-0.5 text-xs font-semibold leading-4">{item.label}</h3>
          </div>
        </article>
      ))}
    </aside>
  );
}