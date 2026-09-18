import React from 'react';

export default function ChiefPilotHowItWorks({ title = 'How this works', items, children }) {
  return (
    <details className="mt-8 border-t border-black/10 pt-4 text-sm text-dyson-text-dark/70">
      <summary className="cursor-pointer select-none text-dyson-text-dark">{title}</summary>
      <ol className="mt-4 space-y-3 pl-5 text-sm leading-6">
        {items.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
      </ol>
      {children}
    </details>
  );
}