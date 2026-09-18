import React from 'react';

const STUDIO_POSTER_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/cd821f5a9_Screenshot2026-09-09at110438AM.png';

export default function ChiefPilotDnnNewsLibrary({ stories, onBack }) {
  return (
    <div className="mx-auto w-full max-w-4xl text-center">
      <button type="button" onClick={onBack} className="inline-flex items-center rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-4 py-2 text-xs font-semibold text-dyson-gold-deep shadow-sm">← Back to DNN News</button>
      <p className="mt-8 text-xs tracking-widest text-dyson-gold-deep">LEVEL 3 · DNN VIDEO LIBRARY</p>
      <h2 className="mt-2 text-3xl font-normal text-dyson-text-dark">Real Estate News Stories</h2>
      {stories.length === 0 ? (
        <p className="mt-8 text-sm text-dyson-text-dark/60">No video stories are available yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
          {stories.map(story => (
            <article key={story.id} className="overflow-hidden rounded-xl border border-black/15 bg-dyson-warm-paper shadow-sm">
              <video controls preload="metadata" poster={STUDIO_POSTER_URL} src={story.url} className="aspect-video w-full bg-black" aria-label={story.headline} />
              <div className="p-4"><p className="text-sm font-semibold text-dyson-text-dark">{story.headline}</p></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}