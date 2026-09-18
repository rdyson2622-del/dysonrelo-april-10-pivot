import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const STEPS = ['Load or start an escrow watch for the Active Property.', 'Track five milestones without assuming dates.', 'Keep each step pending until real status is recorded.', 'Call Bob when the AI reaches a hard stop.'];

export default function ChiefPilotEscrowWatch({ title, activeProperty, escrowStub, onStartEscrow }) {
  return (
    <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><p className="mt-3 text-sm leading-6 text-dyson-taupe">Stay alongside the buyer and agent through escrow, flag issues, and call Bob when the AI hits a wall.</p>
      {!escrowStub && <div className="mt-8"><p className="text-sm text-dyson-taupe">No open escrow file yet.</p>{activeProperty && <button type="button" onClick={onStartEscrow} className="mt-4 rounded-md border border-white/20 px-4 py-2 text-sm text-dyson-text">Start Escrow Watch for {activeProperty.shortAddress}</button>}</div>}
      {escrowStub && <div className="mt-8"><p className="text-sm text-dyson-text">{escrowStub.propertyAddress}</p><ol className="mt-6 divide-y divide-white/10 border-y border-white/10">{escrowStub.steps.map((step, index) => <li key={step.label} className="flex items-center justify-between py-4 text-sm"><span className="text-dyson-text"><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{step.label}</span><span className="text-xs text-dyson-taupe">{step.status}</span></li>)}</ol></div>}
      <div className="mt-8 flex items-center gap-4 text-sm"><a href="tel:8583531200" className="rounded-md border border-white/20 px-4 py-2 text-dyson-text">Call Bob</a><span className="text-dyson-taupe">Connect with Bob · (858) 353-1200</span></div>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}