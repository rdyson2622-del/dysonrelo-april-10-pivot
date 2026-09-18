import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const STEPS = ['Start with a verified property in Property Search.', 'Review only returned pricing, property, and risk fields.', 'Label unavailable diligence items as pending data.', 'Use the audit alongside the buyer agent and human specialists.'];

export default function ChiefPilotPropertyAudit({ title, activeProperty, onSelectSearch }) {
  if (!activeProperty) return <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><p className="mt-3 text-sm text-dyson-taupe">Review comps, risks, and closing-cost insights where allowed.</p><div className="mt-8"><p className="text-sm text-dyson-taupe">Run Property Search first.</p><button type="button" onClick={onSelectSearch} className="mt-2 text-sm text-dyson-gold underline underline-offset-4">Open Property Search</button></div><ChiefPilotHowItWorks items={STEPS} /></div>;
  const sections = [
    ['Comps / pricing context', activeProperty.comps?.length ? activeProperty.comps.map(comp => `${comp.address} — ${comp.soldPrice}`).join('\n') : 'Verified property request; comps unavailable.'],
    ['Risk flags', activeProperty.risks?.length ? activeProperty.risks.map(risk => `${risk.title}: ${risk.desc}`).join('\n') : 'Pending data — no verified risk flags were returned.'],
    ['Permit / title / disclosure questions', 'Pending data — direct permit, title, and seller disclosure review is required.'],
    ['Closing-cost insights where allowed', 'Pending data — transaction and state-specific review is required; no amount has been assumed.']
  ];
  return <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><p className="mt-2 text-lg text-dyson-text">{activeProperty.fullAddress}</p><p className="mt-3 text-sm text-dyson-taupe">Live audit using the verified Active Property session.</p><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{sections.map(([heading, body]) => <section key={heading} className="py-5"><h3 className="text-sm text-dyson-text">{heading}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-dyson-taupe">{body}</p></section>)}</div><ChiefPilotHowItWorks items={STEPS} /></div>;
}