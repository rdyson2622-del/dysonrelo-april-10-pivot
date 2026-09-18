import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const STEPS = ['Save a discussion or property context to the private vault.', 'Return through Library to reopen saved work.', 'Keep client material separate from general news delivery.'];

export default function ChiefPilotLibrary({ items }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-dyson-gold">PREFERRED CLIENT PRIVATE VAULT</p>
      <h2 className="mt-2 text-2xl font-normal text-dyson-text">My Library</h2>
      <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {items.length ? items.map((item, index) => <div key={item.id || index} className="py-4"><p className="text-sm text-dyson-text">{item.title || 'Saved discussion'}</p>{(item.address || item.property) && <p className="mt-1 text-xs text-dyson-taupe">{item.address || item.property}</p>}</div>) : <p className="py-6 text-sm text-dyson-taupe">No saved items yet.</p>}
      </div>
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}