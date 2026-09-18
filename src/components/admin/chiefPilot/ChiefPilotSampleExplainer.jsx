import React from 'react';
import ChiefPilotExplainerVideoStack from './ChiefPilotExplainerVideoStack';
import ChiefPilotMilestoneMap from './ChiefPilotMilestoneMap';
import { SUBJECT_EXPLAINER_CONTENT } from './chiefPilotExplainerContent';

export default function ChiefPilotSampleExplainer({ property, onBack }) {
  const example = property.level3Example;
  const subjectContent = SUBJECT_EXPLAINER_CONTENT['property-search'];
  const explainers = subjectContent.explainers;
  return (
    <section className="min-h-full rounded-xl bg-dyson-cream p-6 text-dyson-text-dark sm:p-9">
      <button type="button" onClick={onBack} className="inline-flex items-center rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-4 py-2 text-xs font-semibold text-dyson-gold-deep shadow-sm">← Back to property search</button>
      <p className="mt-8 text-xs tracking-widest text-dyson-gold-deep">LEVEL 3 · DEMONSTRATION EXPLAINER</p>
      <h2 className="mt-2 text-3xl font-normal">{example.focus}</h2>
      <p className="mt-2 text-sm font-semibold">{property.fullAddress}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(180px,1fr)]">
        <div><p className="max-w-2xl text-base leading-7">{example.summary}</p><ul className="mt-6 space-y-4">{example.checkpoints.map(point => <li key={point} className="flex gap-3 text-sm leading-6"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dyson-gold-deep" />{point}</li>)}</ul><div className="mt-7 rounded-xl border border-black/15 bg-dyson-warm-paper p-5"><p className="text-xs font-semibold uppercase tracking-wider text-dyson-gold-deep">Sample work product</p><p className="mt-3 text-sm leading-6">{example.workProduct}</p></div></div>
        <ChiefPilotExplainerVideoStack explainers={explainers} />
      </div>
      <ChiefPilotMilestoneMap milestones={subjectContent.milestones} />
      <p className="mt-6 text-xs text-dyson-text-dark/60">Dummy example only. No live property facts or risk findings are represented.</p>
    </section>
  );
}