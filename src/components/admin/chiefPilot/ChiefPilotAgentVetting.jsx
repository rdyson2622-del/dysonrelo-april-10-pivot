import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const CHECKS = ['Local market experience', 'Recent buyer-side performance', 'Communication and availability', 'References, fit, and transaction support'];
const STEPS = ['Understand the buyer’s location, property, and working preferences.', 'Review local experience, performance, and references.', 'Save a vetted-introduction intent under the Preferred Client record.', 'CoPilot stays alongside the buyer and agent as a supportive partner.'];

export default function ChiefPilotAgentVetting({ title, activeProperty, introStatus, onRequestIntro }) {
  const market = activeProperty ? [activeProperty.address?.city || activeProperty.city?.split(',')[0], activeProperty.address?.state].filter(Boolean).join(', ') : '';
  return (
    <div><h2 className="text-2xl font-normal text-dyson-text">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-dyson-taupe">We help you choose and stay with a vetted local agent under the referral agreement. CoPilot is a supportive partner, not the decision-maker or compliance officer.</p>
      {market ? <p className="mt-6 text-sm text-dyson-text">Destination market: {market}</p> : <p className="mt-6 text-sm text-dyson-taupe">Search a property to target the local market.</p>}
      <p className="mt-8 text-xs text-dyson-taupe">What we check</p><ul className="mt-4 space-y-3 text-sm text-dyson-text">{CHECKS.map(item => <li key={item}>— {item}</li>)}</ul>
      <button type="button" onClick={onRequestIntro} disabled={!activeProperty || introStatus === 'saving' || introStatus === 'saved'} className="mt-8 rounded-md border border-white/20 px-4 py-2 text-sm text-dyson-text disabled:opacity-40">{introStatus === 'saving' ? 'Saving…' : introStatus === 'saved' ? 'Intent saved' : 'Request vetted intro'}</button>
      {introStatus === 'gate' && <p className="mt-3 text-sm text-dyson-taupe">Claim Preferred Client status to save this private introduction intent.</p>}{introStatus === 'saved' && <p className="mt-3 text-sm text-dyson-taupe">Saved for review. No email or SMS was sent.</p>}{introStatus === 'error' && <p className="mt-3 text-sm text-status-stop">The intent could not be saved. Please try again.</p>}
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}