import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';

const PHASES = ['Discovery', 'Property Search', 'Agent Match', 'Offer', 'Escrow', 'Move', 'Close'];
const STEPS = ['Set the destination, timing, property, and people involved.', 'Organize milestones in a single working sequence.', 'Keep owners and next actions visible as the move changes.', 'Use the roadmap with the client, agent, and transaction team.'];

export default function ChiefPilotRelocationRoadmaps({ title, activeProperty, escrowStub, isExample, onHideExample, onSearchOwn, onSend }) {
  const current = escrowStub ? 'Escrow' : 'Property Search';
  const destination = activeProperty ? [activeProperty.address?.city || activeProperty.city?.split(',')[0], activeProperty.address?.state].filter(Boolean).join(', ') : '';
  const sample = activeProperty ? <div><p className="text-sm text-dyson-text">Move involving {activeProperty.fullAddress}</p><p className="mt-1 text-xs text-dyson-taupe">Destination: {destination || 'not available in example'}</p><ol className="mt-5 space-y-3 border-l border-white/15 pl-5">{PHASES.map((phase, index) => <li key={phase} className={phase === current ? 'text-dyson-gold' : 'text-dyson-text'}><span className="mr-3 text-dyson-taupe">{index + 1}.</span>{phase}<span className="ml-3 text-[10px] text-dyson-taupe">{isExample ? 'EXAMPLE' : phase === current ? 'Current' : 'Planned'}</span></li>)}</ol></div> : <p className="text-sm text-dyson-taupe">Search a property to start the road map.</p>;
  const next = <button type="button" onClick={() => activeProperty ? onSend?.('Start my relocation road map using this property and explain the next milestone.') : onSearchOwn()} className="rounded-md border border-white/20 px-4 py-2 text-sm">Start my road map</button>;
  return <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><ChiefPilotExampleFrame isExample={isExample} purpose="See the whole move, not just the house." benefit="Milestones and what comes next in plain language." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={sample} next={next} /><ChiefPilotHowItWorks items={STEPS} /></div>;
}