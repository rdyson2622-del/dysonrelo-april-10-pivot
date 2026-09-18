import React from 'react';
import { COPILOT_EXPLAINERS } from '@/components/copilot/copilotExplainers';

const SUBJECT_ASSETS = {
  'real-estate-solutions': COPILOT_EXPLAINERS.map(item => item.id),
  'property-search': ['hidden_risks'],
  'property-audit': ['closing_rebate', 'hidden_risks'],
  'escrow-watch': ['bob_solutions_traps']
};

export default function ChiefPilotExplainers({ subject, onBack }) {
  const explainers = COPILOT_EXPLAINERS.filter(item => (SUBJECT_ASSETS[subject.id] || []).includes(item.id));
  return (
    <section className="min-h-full rounded-xl bg-dyson-cream p-6 text-dyson-text-dark sm:p-9">
      <button type="button" onClick={onBack} className="inline-flex items-center rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-4 py-2 text-xs font-semibold text-dyson-gold-deep shadow-sm">← Back to ask/search</button>
      <p className="mt-8 text-xs tracking-widest text-dyson-gold-deep">LEVEL 3 · OPTIONAL EXPLAINERS</p>
      <h2 className="mt-2 text-3xl font-normal">{subject.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-dyson-text-dark/70">Watch or read only when you want more context. Videos never play automatically.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">{explainers.length ? explainers.map(item => <article key={item.id} className="overflow-hidden rounded-xl border border-black/15 bg-dyson-warm-paper"><video controls preload="metadata" src={item.videoUrl} className="aspect-video w-full bg-dyson-black" aria-label={`${item.speakerName}: ${item.label}`} /><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-dyson-gold-deep">{item.speakerName}</p><h3 className="mt-2 text-lg font-semibold">{item.label}</h3><p className="mt-3 text-sm leading-6 text-dyson-text-dark/70">{item.textAnswer}</p></div></article>) : <div className="rounded-xl border border-black/15 bg-dyson-warm-paper p-6"><p className="text-xs font-semibold uppercase tracking-wider text-dyson-gold-deep">Coming soon</p><p className="mt-2 text-sm text-dyson-text-dark/70">A Bob or Charlie explainer for this subject is being prepared.</p></div>}</div>
    </section>
  );
}