import React from 'react';
import ChiefPilotStoryboardFrame from './ChiefPilotStoryboardFrame';

const FRAMES = [
  ['property-search', 'search', '1 Search', 'Open the active Calle listing.'],
  ['property-audit', 'audit', '2 Audit', 'See the deeper evaluation work.'],
  ['agent-vetting', 'vetting', '3 Agent Vetting', 'Review the fit for this buy.'],
  ['move-roadmap', 'roadmap', '4 Road Map', 'Follow Discovery through Close.'],
  ['escrow-watch', 'escrow', '5 Escrow Watch', 'Track the open milestones.'],
  ['team-thread', 'team', '6 Team Thread', 'Keep Client, Agent, and Dyson together.']
];

export default function ChiefPilotStoryboard({ property, agentName, onSelectSubject }) {
  return (
    <section className="mt-10 border-t border-white/10 pt-8 text-left">
      <p className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE · 6228 CALLE PAVANA</p>
      <h2 className="mt-2 text-lg text-dyson-text">See the full CoPilot journey</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{FRAMES.map(([id, type, label, line]) => <button key={id} type="button" onClick={() => onSelectSubject(id)} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left hover:border-dyson-gold/50"><div className="min-h-28 rounded-md bg-black/20 p-3"><ChiefPilotStoryboardFrame type={type} property={property} agentName={agentName} /></div><p className="mt-3 text-xs text-dyson-text">{label}</p><p className="mt-1 text-[11px] text-dyson-taupe">{line}</p></button>)}</div>
    </section>
  );
}