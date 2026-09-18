import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const HEADLINES = ['Housing and mortgage brief — News when ready', 'Relocation and migration brief — News when ready', 'Local market intelligence — News when ready'];
const STEPS = ['Collect timely real estate and relocation developments.', 'Distill what may affect the active move or property.', 'Separate useful intelligence from general market noise.', 'Open media only when the user chooses to play it.'];

export default function ChiefPilotDnnNews({ title }) {
  return (
    <div>
      <h2 className="text-2xl font-normal text-dyson-text">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-dyson-taupe">Real estate intelligence that matters for a move.</p>
      <div className="mt-9 divide-y divide-white/10 border-y border-white/10">{HEADLINES.map((headline, index) => <div key={headline} className="py-5"><p className="text-xs text-dyson-taupe">0{index + 1}</p><p className="mt-2 text-sm text-dyson-text">{headline}</p></div>)}</div>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}