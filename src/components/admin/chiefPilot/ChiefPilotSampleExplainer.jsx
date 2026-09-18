import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ChiefPilotSampleExplainer({ property, onBack }) {
  const example = property.level3Example;
  return (
    <section className="min-h-full rounded-xl bg-dyson-cream p-6 text-dyson-text-dark sm:p-9">
      <button type="button" onClick={onBack} className="text-xs font-semibold text-dyson-gold-deep underline underline-offset-4">← Back to property search</button>
      <p className="mt-8 text-xs tracking-widest text-dyson-gold-deep">LEVEL 3 · DEMONSTRATION EXPLAINER</p>
      <h2 className="mt-2 text-3xl font-normal">{example.focus}</h2>
      <p className="mt-2 text-sm font-semibold">{property.fullAddress}</p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-dyson-text-dark/70">{example.summary}</p>
      <div className="mt-8 rounded-xl border border-black/15 bg-dyson-warm-paper p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-dyson-gold-deep">Illustrative checkpoints</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">{example.checkpoints.map(item => <div key={item} className="flex gap-3 text-sm leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-dyson-gold-deep" /><span>{item}</span></div>)}</div>
      </div>
      <div className="mt-6 rounded-xl border border-black/15 bg-dyson-warm-paper p-6"><p className="text-xs font-semibold uppercase tracking-wider text-dyson-gold-deep">Sample work product</p><p className="mt-3 text-sm leading-6">{example.workProduct}</p></div>
      <p className="mt-6 text-xs text-dyson-text-dark/60">Dummy example only. No live property facts or risk findings are represented.</p>
    </section>
  );
}