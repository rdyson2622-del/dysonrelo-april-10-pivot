import React from 'react';

const STEPS = [
  { number: 1, title: 'Anyone can chat', description: 'Every visitor can ask CoPilot questions — no sign-up required. Each conversation is logged here as it happens.' },
  { number: 2, title: 'Verified clients get saved history', description: 'Once someone leaves their complete name, phone, and email, their chats are kept permanently in their private client record.' },
  { number: 3, title: 'Charlie answers from known data only', description: 'CoPilot never invents facts. If a request needs data we have not verified, it is flagged for a human hand-off to Bob.' },
  { number: 4, title: 'You can continue any thread', description: 'Open a conversation and use the reply bar to pick up an open request right where the client left it.' },
];

export default function ChiefPilotChatExplainer({ onBack }) {
  return (
    <section className="min-h-full rounded-xl bg-dyson-ink p-4 text-white sm:p-6">
      <button type="button" onClick={onBack} className="inline-flex items-center rounded-full border border-dyson-gold px-4 py-2 text-xs font-semibold text-dyson-gold">← Back to chats</button>
      <p className="mt-4 text-xs tracking-widest text-dyson-gold">LEVEL 3 · HOW THIS WORKS</p>
      <h2 className="mt-1 text-xl font-normal">How Client Chat Works</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
        {STEPS.map(step => (
          <div key={step.number}>
            <p className="flex items-center gap-3 text-sm font-semibold"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dyson-gold text-xs text-dyson-gold">{step.number}</span>{step.title}</p>
            <p className="mt-1.5 pl-8 text-sm leading-5 text-dyson-taupe">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}