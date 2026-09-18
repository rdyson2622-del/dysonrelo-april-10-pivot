import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const PHASES = ['Discovery', 'Property Search', 'Agent Match', 'Offer', 'Escrow', 'Move', 'Close'];
const STEPS = ['Set the destination, timing, property, and people involved.', 'Organize milestones in a single working sequence.', 'Keep owners and next actions visible as the move changes.', 'Use the roadmap with the client, agent, and transaction team.'];

export default function ChiefPilotRelocationRoadmaps({ title, activeProperty, escrowStub, onSelectSearch }) {
  const current = escrowStub ? 'Escrow' : 'Property Search';
  const destination = activeProperty ? [activeProperty.address?.city || activeProperty.city?.split(',')[0], activeProperty.address?.state].filter(Boolean).join(', ') : '';
  return (
    <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><p className="mt-3 text-sm leading-6 text-dyson-taupe">Navigate the move — milestones, owners, and what’s next.</p>
      {!activeProperty && <div className="mt-8 text-sm text-dyson-taupe"><p>Start with Property Search or tell Charlie your destination city.</p><button type="button" onClick={onSelectSearch} className="mt-2 text-dyson-gold underline underline-offset-4">Open Property Search</button></div>}
      {activeProperty && <div className="mt-8"><p className="text-sm text-dyson-text">Destination: {destination || 'Pending data'}</p><p className="mt-1 text-xs text-dyson-taupe">Active property: {activeProperty.fullAddress}</p></div>}
      <ol className="mt-8 space-y-3 border-l border-white/15 pl-5 text-sm">{PHASES.map((phase, index) => <li key={phase} className={activeProperty && phase === current ? 'text-dyson-gold' : 'text-dyson-text'}><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{phase}{activeProperty && phase === current && <span className="ml-3 text-xs">Current</span>}</li>)}</ol>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}