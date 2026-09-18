import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';

const STEPS = ['Load or start an escrow watch for the Active Property.', 'Track five milestones without assuming dates.', 'Keep each step pending until real status is recorded.', 'Call Bob when the AI reaches a hard stop.'];

export default function ChiefPilotEscrowWatch({ title, activeProperty, hasOwnProperty, escrowStub, isExample, onHideExample, onSearchOwn, onStartEscrow }) {
  const exampleSteps = ['Escrow opened', 'Deposit and disclosures', 'Inspections and contingencies', 'Loan and appraisal', 'Final review and close'].map(label => ({ label, status: 'EXAMPLE' }));
  const watch = escrowStub || (isExample && activeProperty ? { propertyAddress: activeProperty.fullAddress, steps: exampleSteps } : null);
  const sample = watch ? <div><p className="text-sm text-dyson-text">{watch.propertyAddress}</p><ol className="mt-5 divide-y divide-white/10 border-y border-white/10">{watch.steps.map((step, index) => <li key={step.label} className="flex items-center justify-between py-4 text-sm"><span><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{step.label}</span><span className="text-xs text-dyson-taupe">{step.status}</span></li>)}</ol></div> : <p className="text-sm text-dyson-taupe">No open escrow watch yet.</p>;
  const next = <div className="flex flex-wrap items-center gap-4"><button type="button" onClick={hasOwnProperty ? onStartEscrow : onSearchOwn} className="rounded-md border border-white/20 px-4 py-2 text-sm">Start Escrow Watch for my property</button><a href="tel:8583531200" className="text-sm text-dyson-gold underline underline-offset-4">Call Bob</a></div>;
  return <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><ChiefPilotExampleFrame isExample={isExample} purpose="Stay alongside the buyer and agent through escrow, with a direct path to Bob when something gets stuck." benefit="A simple watch list so important steps do not fail silently." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={sample} next={next} /><ChiefPilotHowItWorks items={STEPS} /></div>;
}