import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const STEPS = ['Collect timely real estate and relocation developments.', 'Distill what may affect the active move or property.', 'Separate useful intelligence from general market noise.', 'Open media only when the user chooses to play it.'];

export default function ChiefPilotDnnNews({ title, activeProperty }) {
  const city = activeProperty?.address?.city || activeProperty?.city?.split(',')[0];
  const state = activeProperty?.address?.state;
  const market = [city, state].filter(Boolean).join(', ') || 'Market';
  const briefs = [`${market} housing brief — News when ready`, `${market} relocation brief — News when ready`, `${market} property intelligence — News when ready`];
  return (
    <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><p className="mt-3 text-sm leading-6 text-dyson-taupe">Real estate intelligence that matters for a move.</p><div className="mt-9 divide-y divide-white/10 border-y border-white/10">{briefs.map((brief, index) => <div key={brief} className="py-5"><p className="text-xs text-dyson-taupe">0{index + 1}</p><p className="mt-2 text-sm text-dyson-text">{brief}</p></div>)}</div><ChiefPilotHowItWorks items={STEPS} /></div>
  );
}