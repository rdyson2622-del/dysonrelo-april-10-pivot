import React, { useState } from 'react';

export default function ChiefPilotExampleFrame({ isExample, purpose, benefit, onHide, onSearchOwn, sample, next }) {
  const [explaining, setExplaining] = useState(false);
  return (
    <div>
      {isExample && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-dyson-gold/30 py-3 text-xs"><span className="text-dyson-gold">Example</span><div className="flex gap-4"><button type="button" onClick={onHide} className="text-dyson-taupe underline underline-offset-4">Hide example</button><button type="button" onClick={onSearchOwn} className="text-dyson-text underline underline-offset-4">Search my own property</button></div></div>}
      <div className="space-y-6">
        <section><p className="text-[11px] uppercase tracking-wide text-dyson-taupe">Purpose</p><p className="mt-2 text-sm leading-6 text-dyson-text">{purpose}</p></section>
        <section><p className="text-[11px] uppercase tracking-wide text-dyson-taupe">Benefit</p><p className="mt-2 text-sm leading-6 text-dyson-text">{benefit}</p></section>
        <section><p className="text-[11px] uppercase tracking-wide text-dyson-taupe">{isExample ? 'Sample output · Example' : 'Current output'}</p><div className="mt-3">{sample}</div></section>
        <section><p className="text-[11px] uppercase tracking-wide text-dyson-taupe">Next step</p><div className="mt-3 text-sm text-dyson-text">{next}</div></section>
      </div>
      <button type="button" onClick={() => setExplaining(value => !value)} className="mt-7 text-xs text-dyson-taupe underline underline-offset-4">Explain this section</button>
      {explaining && <p className="mt-3 border-l border-white/15 pl-4 text-sm leading-6 text-dyson-taupe">{purpose} {benefit}</p>}
    </div>
  );
}