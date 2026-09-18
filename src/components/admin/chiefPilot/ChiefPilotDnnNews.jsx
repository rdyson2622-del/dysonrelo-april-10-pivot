import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';

const STEPS = ['Collect timely real estate and relocation developments.', 'Distill what may affect the active move or property.', 'Separate useful intelligence from general market noise.', 'Open media only when the user chooses to play it.'];

export default function ChiefPilotDnnNews({ title, activeProperty, isExample, onHideExample, onSearchOwn, onSend }) {
  const city = activeProperty?.address?.city || activeProperty?.city?.split(',')[0];
  const state = activeProperty?.address?.state;
  const market = [city, state].filter(Boolean).join(', ') || 'Market';
  const briefs = isExample ? [`${market} housing signals to watch`, `${market} relocation outlook`, `${market} property intelligence brief`] : [`${market} housing brief — News when ready`, `${market} relocation brief — News when ready`, `${market} property intelligence — News when ready`];
  return (
    <div><h2 className="text-2xl font-normal text-dyson-text-dark">{title}</h2><ChiefPilotExampleFrame isExample={isExample} purpose="Deliver intelligence that matters for a move." benefit="Signal over noise, organized around the market you care about." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={<div className="divide-y divide-white/10 rounded-xl border border-black/20 bg-dyson-charcoal px-5">{briefs.map((brief, index) => <button type="button" onClick={() => onSend?.(`Open the DNN brief: ${brief}`)} key={brief} className="block w-full py-5 text-left"><p className="text-xs text-dyson-taupe">{isExample ? 'EXAMPLE' : `0${index + 1}`}</p><p className="mt-2 text-sm text-dyson-text">{brief}</p><span className="mt-2 block text-xs text-dyson-taupe">Open brief</span></button>)}</div>} next={<p>Open a brief. Media appears only when a real playable file exists.</p>} /><ChiefPilotHowItWorks items={STEPS} /></div>
  );
}