import React from 'react';

export default function ChiefPilotTextDeepDive({ property, isExample }) {
  const comps = property?.comps || [];
  const risks = property?.risks || [];
  const valuation = property?.valuation || {};
  const pricing = comps.length ? `${comps.length} verified comparable record${comps.length === 1 ? '' : 's'} returned for review.` : 'Comparable sales were not returned. We will not invent them.';
  const riskText = risks.length ? risks.slice(0, 3).map(risk => `${risk.title}: ${risk.desc}`).join(' ') : 'No verified risk flags were returned; disclosures and specialist review remain open.';
  const rows = [
    ['Pricing context', valuation.estimatedValue ? `${pricing} Returned estimate: $${Number(valuation.estimatedValue).toLocaleString()}.` : pricing],
    ['Issues spotted', riskText],
    ['What the listing did not answer', 'Permit history, title exceptions, seller disclosures, drainage, and repair history still need direct answers.'],
    ['Closing-cost notes', 'Property-specific costs are pending transaction details; no amount or credit is assumed.']
  ];
  return (
    <section className="mt-8 text-left">
      <div className="flex items-center justify-between gap-3"><h2 className="text-lg text-dyson-text">CoPilot evaluation</h2>{isExample && <span className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</span>}</div>
      <div className="mt-4 divide-y divide-white/10 border-y border-white/10">{rows.map(([title, answer]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]"><h3 className="text-sm text-dyson-text">{title}</h3><p className="text-sm leading-6 text-dyson-taupe">{answer}</p></div>)}</div>
      <p className="mt-4 text-sm leading-6 text-dyson-text">If you choose one of our vetted agents, their referral arrangement pays us. We stay alongside you and help attack the open issues as a supportive partner.</p>
    </section>
  );
}