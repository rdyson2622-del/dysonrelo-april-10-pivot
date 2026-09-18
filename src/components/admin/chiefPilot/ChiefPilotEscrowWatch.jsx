import React from 'react';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';

const EXAMPLE_STEPS = ['Escrow opened', 'Deposit and disclosures', 'Inspections and contingencies', 'Loan and appraisal', 'Final review and close'];

export default function ChiefPilotEscrowWatch({ title, activeProperty, escrowStub, isExample, selectedAgentName, onOpenListing, onStartEscrow }) {
  if (!activeProperty) return <ChiefPilotActivePropertyHeader property={null} onOpenListing={onOpenListing} />;
  const watch = escrowStub || (activeProperty ? { propertyAddress: activeProperty.fullAddress, steps: EXAMPLE_STEPS.map(label => ({ label, status: isExample ? 'EXAMPLE' : 'pending' })) } : null);
  return (
    <div>
      <ChiefPilotActivePropertyHeader property={activeProperty} agentName={selectedAgentName} onOpenListing={onOpenListing} />
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-normal text-dyson-text">{title}</h2>{isExample && <span className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</span>}</div>
      {watch && <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">{watch.steps.map((step, index) => <li key={step.label} className="flex items-center justify-between gap-4 py-4 text-sm"><span className="text-dyson-text"><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{step.label}</span><span className="text-xs uppercase text-dyson-taupe">{step.status}</span></li>)}</ol>}
      <div className="mt-6 flex flex-wrap items-center gap-4"><a href="tel:8583531200" className="rounded-full border border-dyson-gold/50 px-4 py-2 text-sm text-dyson-gold">Call Bob</a><button type="button" onClick={onStartEscrow} disabled={!activeProperty} className="rounded-full border border-white/20 px-4 py-2 text-sm text-dyson-text disabled:opacity-40">Start watch</button></div>
    </div>
  );
}