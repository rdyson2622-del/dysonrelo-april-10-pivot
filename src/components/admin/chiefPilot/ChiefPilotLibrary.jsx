import React from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';

const STEPS = ['Save a discussion or property context to the private vault.', 'Return through Library to reopen saved work.', 'Keep client material separate from general news delivery.'];

export default function ChiefPilotLibrary({ items, isExample, onHideExample, onSearchOwn }) {
  const examples = ['Calle Pavana property search', 'Calle Pavana audit questions', 'San Diego move road map'];
  const rows = isExample ? examples.map((title, index) => ({ id: `example-${index}`, title, example: true })) : items;
  return (
    <div><p className="text-xs tracking-wide text-dyson-gold">PREFERRED CLIENT PRIVATE VAULT</p><h2 className="mt-2 text-2xl font-normal text-dyson-text">My Library</h2>
      <ChiefPilotExampleFrame isExample={isExample} purpose="Keep your work together in one private place." benefit="A Private Vault for searches, audits, road maps, and saved discussions." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={<div className="divide-y divide-white/10 border-y border-white/10">{rows.length ? rows.map((item, index) => <div key={item.id || index} className="py-4"><p className="text-sm text-dyson-text">{item.example && <span className="mr-2 text-[10px] text-dyson-gold">EXAMPLE</span>}{item.title || 'Saved discussion'}</p>{item.propertyAddress && <p className="mt-1 text-xs text-dyson-taupe">{item.propertyAddress}</p>}</div>) : <p className="py-6 text-sm text-dyson-taupe">No saved items yet.</p>}</div>} next={<p>Claim Preferred Client status to keep your own Library.</p>} />
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}