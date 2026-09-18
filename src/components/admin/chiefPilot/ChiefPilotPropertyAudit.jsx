import React from 'react';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';

export default function ChiefPilotPropertyAudit({ title, activeProperty, isExample, onOpenListing, onSend, onSaveProperty, saveStatus }) {
  if (!activeProperty) return <ChiefPilotActivePropertyHeader property={null} onOpenListing={onOpenListing} />;
  const comps = activeProperty.comps || [];
  const risks = activeProperty?.risks || [];
  return (
    <div>
      <ChiefPilotActivePropertyHeader property={activeProperty} onOpenListing={onOpenListing} />
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-normal text-dyson-text">{title}</h2>{isExample && <span className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</span>}</div>
      {activeProperty && <div className="mt-6 divide-y divide-white/10 border-y border-white/10"><section className="py-5"><h3 className="text-sm text-dyson-text">Pricing context</h3><p className="mt-2 text-sm leading-6 text-dyson-taupe">{comps.length ? activeProperty.compsSummary || `${comps.length} comparable records returned.` : 'Comparable sales were not returned. Pending data.'}</p>{comps.map(comp => <p key={comp.address} className="mt-2 text-xs text-dyson-taupe">{comp.address} · {comp.soldPrice || 'Sale price pending'} · {comp.adjPrice || 'Adjustment pending'}</p>)}</section><section className="py-5"><h3 className="text-sm text-dyson-text">Risks and open issues</h3>{risks.length ? risks.map(risk => <p key={risk.id || risk.title} className="mt-2 text-sm leading-6 text-dyson-taupe"><span className="text-dyson-text">{risk.title}:</span> {risk.desc}</p>) : <p className="mt-2 text-sm text-dyson-taupe">No verified risk flags returned. Pending disclosure review.</p>}</section><section className="py-5"><h3 className="text-sm text-dyson-text">Questions for this buy</h3><p className="mt-2 text-sm leading-6 text-dyson-taupe">Confirm permit history, title exceptions, seller disclosures, drainage, repair history, and unresolved inspection items.</p></section></div>}
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => onSend?.(`What should I ask next about ${activeProperty?.fullAddress || 'this property'}?`)} className="rounded-full border border-white/20 px-4 py-2 text-sm">Ask</button><button type="button" onClick={onSaveProperty} className="rounded-full border border-white/20 px-4 py-2 text-sm">{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save'}</button><button type="button" onClick={onOpenListing} className="rounded-full border border-dyson-gold/50 px-4 py-2 text-sm text-dyson-gold">Back to listing card</button></div>
    </div>
  );
}