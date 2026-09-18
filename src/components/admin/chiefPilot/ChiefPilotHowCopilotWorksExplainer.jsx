import React from 'react';

const MLS_SITES = [['Realtor.com', 'https://www.realtor.com'], ['Homes.com', 'https://www.homes.com'], ['Redfin.com', 'https://www.redfin.com'], ['Zillow', 'https://www.zillow.com']];
const STEPS = [
  { number: 2, title: 'Paste Address', description: 'Share the property details.' },
  { number: 3, title: 'AI + Human Analysis', description: 'CoPilot analyzes with AI precision and human expertise.' },
  { number: 4, title: 'Intelligence Delivered', description: 'Comps, risks, and rebate insights in one private report.' },
  { number: 5, title: 'Better Decisions', description: 'Close with confidence. Keep more wealth.' },
];

export default function ChiefPilotHowCopilotWorksExplainer({ onBack }) {
  return (
    <section className="min-h-full rounded-xl bg-dyson-cream p-4 text-dyson-text-dark sm:p-5">
      <button type="button" onClick={onBack} className="inline-flex items-center rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-4 py-2 text-xs font-semibold text-dyson-gold-deep shadow-sm">← Back to CoPilot home</button>
      <p className="mt-3 text-xs tracking-widest text-dyson-gold-deep">LEVEL 3 · OPTIONAL EXPLAINERS</p>
      <h2 className="mt-1 text-xl font-normal">How Dyson Homes CoPilot Works</h2>

      <div className="mt-6 border-t border-black/10 pt-5">
        <p className="flex items-center gap-3 text-sm font-semibold"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dyson-gold-deep text-xs">1</span>First of all browse your preferred MLS and copy the MLS# or address:</p>
        <div className="mt-3 flex flex-wrap gap-2 pl-8">
          {MLS_SITES.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-black/20 bg-dyson-warm-paper px-4 py-1.5 text-sm font-semibold hover:border-dyson-gold-deep">{label}</a>)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 border-t border-black/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(step => (
          <div key={step.number}>
            <p className="flex items-center gap-3 text-sm font-semibold"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dyson-gold-deep text-xs">{step.number}</span>{step.title}</p>
            <p className="mt-1.5 pl-8 text-sm leading-5 text-dyson-text-dark/70">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}