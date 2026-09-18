import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const MILESTONES = ['Escrow opened', 'Deposit and disclosures', 'Inspections and contingencies', 'Loan and appraisal', 'Final review and close'];
const STEPS = ['Load the active escrow file and important dates.', 'Track milestones alongside the buyer and agent.', 'Flag questions, missing items, and issues needing human review.', 'Call or connect with Bob when the AI reaches a hard stop.'];

export default function ChiefPilotEscrowWatch({ title }) {
  return (
    <div>
      <h2 className="text-2xl font-normal text-dyson-text">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-dyson-taupe">Stay alongside the buyer and agent through escrow, flag issues, and call Bob when the AI hits a wall.</p>
      <p className="mt-8 text-sm text-dyson-taupe">No open escrow file yet.</p>
      <ol className="mt-7 space-y-3 border-l border-white/15 pl-5 text-sm text-dyson-text">{MILESTONES.map((item, index) => <li key={item}><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{item}</li>)}</ol>
      <div className="mt-8 flex flex-wrap gap-3 text-sm"><a href="tel:8583531200" className="rounded-md border border-white/20 px-4 py-2 text-dyson-text">Call Bob</a><a href="mailto:bob@dysonrelo.com" className="px-4 py-2 text-dyson-taupe underline underline-offset-4">Connect with Bob</a></div>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}