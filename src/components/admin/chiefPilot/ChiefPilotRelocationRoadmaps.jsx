import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const PHASES = ['Discovery', 'Property Search', 'Agent Match', 'Offer', 'Escrow', 'Move', 'Close'];
const STEPS = ['Set the destination, timing, property, and people involved.', 'Organize milestones in a single working sequence.', 'Keep owners and next actions visible as the move changes.', 'Use the roadmap with the client, agent, and transaction team.'];

export default function ChiefPilotRelocationRoadmaps({ title, currentProperty, onSelectSearch }) {
  return (
    <div>
      <h2 className="text-2xl font-normal text-dyson-text">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-dyson-taupe">Navigate the move — milestones, owners, and what’s next.</p>
      {!currentProperty && <div className="mt-8 text-sm text-dyson-taupe"><p>Start with Property Search or tell Charlie your destination city.</p><button type="button" onClick={onSelectSearch} className="mt-2 text-dyson-gold underline underline-offset-4">Open Property Search</button></div>}
      {currentProperty && <p className="mt-8 text-sm text-dyson-text">Active property: {currentProperty}</p>}
      <ol className="mt-8 space-y-3 border-l border-white/15 pl-5 text-sm text-dyson-text">{PHASES.map((phase, index) => <li key={phase}><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{phase}</li>)}</ol>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}