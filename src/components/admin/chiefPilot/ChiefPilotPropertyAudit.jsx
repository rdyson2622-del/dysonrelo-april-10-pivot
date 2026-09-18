import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';

const STEPS = ['Start with a verified property in Property Search.', 'Review only returned pricing, property, and risk fields.', 'Label unavailable diligence items as pending data.', 'Use the audit alongside the buyer agent and human specialists.'];

export default function ChiefPilotPropertyAudit({ title, activeProperty, isExample, onHideExample, onSearchOwn, onSend }) {
  const missing = isExample ? 'not available in example' : 'Pending data';
  const sections = [
    ['Comparable sales context', activeProperty?.comps?.length ? activeProperty.comps.map(comp => `${comp.address} — ${comp.soldPrice || 'sale price not available in example'}`).join('\n') : `Comparable sales: ${missing}.`],
    ['Risk flags', activeProperty?.risks?.length ? activeProperty.risks.map(risk => `${risk.title}: ${risk.desc}`).join('\n') : `Verified risk flags: ${missing}.`],
    ['Questions to ask', 'Confirm permits, title exceptions, seller disclosures, drainage, and repair history with the appropriate professionals.'],
    ['Closing-cost insights', 'Transaction-specific review is required; no amount or eligibility has been assumed.']
  ];
  const sample = activeProperty ? <div><p className="mb-4 text-sm text-dyson-text">{activeProperty.fullAddress}</p><div className="divide-y divide-white/10 border-y border-white/10">{sections.map(([heading, body]) => <section key={heading} className="py-4"><h3 className="text-sm text-dyson-text">{heading}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-dyson-taupe">{body}</p></section>)}</div></div> : <p className="text-sm text-dyson-taupe">Run Property Search first.</p>;
  const next = <div className="flex flex-wrap gap-3"><button type="button" onClick={() => onSend?.('Open the full property audit and explain the known gaps.')} className="rounded-md border border-white/20 px-3 py-2 text-xs">Open full audit</button><button type="button" onClick={() => onSend?.('Charlie, explain this property audit example in plain English.')} className="rounded-md border border-white/20 px-3 py-2 text-xs">Ask Charlie</button><button type="button" onClick={onSearchOwn} className="text-xs text-dyson-gold underline underline-offset-4">Search my own</button></div>;
  return <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><ChiefPilotExampleFrame isExample={isExample} purpose="Stress-test the property before you commit." benefit="Comparable-sales context, risk questions, and closing-cost insights where allowed." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={sample} next={next} /><ChiefPilotHowItWorks items={STEPS} /></div>;
}