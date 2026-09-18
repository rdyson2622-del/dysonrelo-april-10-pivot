import React from 'react';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';

const CHECKS = [['Local buyer-side experience', 'Recent work in the active property market.'], ['Offer and diligence fit', 'Comfort pressing on pricing, disclosures, title, and inspections.'], ['Communication fit', 'Availability and working style for this purchase.'], ['References and support', 'Evidence, references, and transaction-team depth.']];

export default function ChiefPilotAgentVetting({ title, activeProperty, isExample, selectedAgentName, onOpenListing, introStatus, onRequestIntro }) {
  if (!activeProperty) return <ChiefPilotActivePropertyHeader property={null} onOpenListing={onOpenListing} />;
  const market = [activeProperty?.address?.city || activeProperty?.city?.split(',')[0], activeProperty?.address?.state].filter(Boolean).join(', ');
  return (
    <div>
      <ChiefPilotActivePropertyHeader property={activeProperty} agentName={selectedAgentName} onOpenListing={onOpenListing} />
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-normal text-dyson-text">{title}</h2>{isExample && <span className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</span>}</div>
      {activeProperty && <article className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5"><p className="text-xs text-dyson-taupe">Agent-fit card · {market || 'Market pending'}</p><h3 className="mt-2 text-lg text-dyson-text">Fit for this buy</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{CHECKS.map(([label, note]) => <div key={label} className="border-l border-dyson-gold/40 pl-3"><p className="text-sm text-dyson-text">{label}</p><p className="mt-1 text-xs leading-5 text-dyson-taupe">{note}</p></div>)}</div></article>}
      <button type="button" onClick={onRequestIntro} disabled={!activeProperty || introStatus === 'saving' || introStatus === 'saved'} className="mt-6 rounded-full border border-dyson-gold/50 px-4 py-2 text-sm text-dyson-text disabled:opacity-40">{introStatus === 'saving' ? 'Saving intent…' : introStatus === 'saved' ? 'Vetted intro intent saved' : 'Request vetted intro'}</button>
      {introStatus === 'saved' && <p className="mt-3 text-xs text-dyson-taupe">Intent recorded for review. No email or text was sent.</p>}
    </div>
  );
}