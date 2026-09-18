import React from 'react';
import { Search, ShieldCheck, UserCheck, Milestone, ListChecks } from 'lucide-react';
import ChiefPilotRoadMapStrip from './ChiefPilotRoadMapStrip';

const FRAMES = [
  ['property-search', '1 Search', Search, 'The Calle Pavana listing becomes the active property.'],
  ['property-audit', '2 Audit', ShieldCheck, 'Known facts, gaps, and questions are called out.'],
  ['agent-vetting', '3 Agent Vetting', UserCheck, 'A vetted San Diego partner path is prepared.'],
  ['move-roadmap', '4 Road Map', Milestone, 'The Calle plan runs from Discovery through Close.'],
  ['escrow-watch', '5 Escrow Watch', ListChecks, 'Example milestones stay visible without invented dates.']
];

export default function ChiefPilotStoryboard({ onSelectSubject }) {
  return (
    <section className="mt-10 border-t border-white/10 pt-8 text-left">
      <p className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE · 6228 CALLE PAVANA</p>
      <h2 className="mt-2 text-lg text-dyson-text">See the full CoPilot journey</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{FRAMES.map(([id, label, Icon, line]) => <button key={id} type="button" onClick={() => onSelectSubject(id)} className="min-h-40 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left hover:border-dyson-gold/50"><div className="flex h-16 items-center justify-center rounded-md bg-black/20"><Icon className="h-6 w-6 text-dyson-gold" /></div><p className="mt-3 text-xs text-dyson-text">{label}</p><p className="mt-2 text-[11px] leading-5 text-dyson-taupe">{line}</p>{id === 'move-roadmap' && <ChiefPilotRoadMapStrip compact />}</button>)}</div>
    </section>
  );
}