import React, { useState } from 'react';

export default function ChiefPilotExampleFrame({ isExample, purpose, benefit, onHide, onSearchOwn, sample, next }) {
  const [explaining, setExplaining] = useState(false);
  return (
    <div className="mt-5">
      {isExample && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-dyson-gold/30 py-3 text-xs"><span className="text-dyson-gold">EXAMPLE</span><div className="flex gap-4"><button type="button" onClick={onHide} className="text-dyson-taupe underline underline-offset-4">Hide example</button><button type="button" onClick={onSearchOwn} className="text-dyson-text underline underline-offset-4">Search my own property</button></div></div>}
      <div>{sample}</div>
      {next && <div className="mt-6 text-sm text-dyson-text">{next}</div>}
      <button type="button" onClick={() => setExplaining(value => !value)} className="mt-7 text-xs text-dyson-taupe underline underline-offset-4">Explain this section</button>
      {explaining && <p className="mt-3 border-l border-white/15 pl-4 text-sm leading-6 text-dyson-taupe">{purpose} {benefit}</p>}
    </div>
  );
}