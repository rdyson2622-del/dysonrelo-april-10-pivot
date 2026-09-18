import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const CHECKS = ['Local market experience', 'Recent buyer-side performance', 'Communication and availability', 'References, fit, and transaction support'];
const STEPS = ['Understand the buyer’s location, property, and working preferences.', 'Review local experience, performance, and references.', 'Introduce a vetted local agent under the referral agreement.', 'CoPilot stays alongside the buyer and agent as a supportive partner.'];

export default function ChiefPilotAgentVetting({ title }) {
  return (
    <div>
      <h2 className="text-2xl font-normal text-dyson-text">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-dyson-taupe">We help you choose and stay with a vetted local agent under the referral agreement. CoPilot is a supportive partner, not the decision-maker or compliance officer.</p>
      <p className="mt-8 text-xs text-dyson-taupe">What we check</p>
      <ul className="mt-4 space-y-3 text-sm text-dyson-text">{CHECKS.map(item => <li key={item}>— {item}</li>)}</ul>
      <button type="button" disabled className="mt-8 rounded-md border border-white/20 px-4 py-2 text-sm text-dyson-taupe">Request vetted intro</button>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}