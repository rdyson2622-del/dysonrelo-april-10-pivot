import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const CHECKS = ['Comparable sales and pricing context', 'Property and location risk flags', 'Permit, title, and disclosure questions', 'Closing-cost insights where allowed'];
const STEPS = ['Start with a property selected in Property Search.', 'CoPilot organizes available facts, comps, and risk questions.', 'Human review identifies what requires direct verification.', 'Use the dossier alongside your buyer agent before deciding.'];

export default function ChiefPilotPropertyAudit({ title, currentProperty, onSelectSearch, onSend }) {
  return (
    <div>
      <h2 className="text-2xl font-normal text-dyson-text">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-dyson-taupe">Review comps, risks, and closing-cost insights where allowed.</p>
      {currentProperty ? (
        <div className="mt-8">
          <p className="text-xs text-dyson-taupe">Current property</p>
          <p className="mt-1 text-lg text-dyson-text">{currentProperty}</p>
          <button type="button" onClick={() => onSend(`Run a property audit for ${currentProperty}`)} className="mt-4 rounded-md bg-dyson-gold px-4 py-2 text-sm text-dyson-text-dark">Start Property Audit</button>
        </div>
      ) : (
        <div className="mt-8"><p className="text-sm text-dyson-taupe">Run Property Search first.</p><button type="button" onClick={onSelectSearch} className="mt-2 text-sm text-dyson-gold underline underline-offset-4">Open Property Search</button></div>
      )}
      <ul className="mt-8 space-y-3 text-sm text-dyson-text">{CHECKS.map(item => <li key={item}>— {item}</li>)}</ul>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}