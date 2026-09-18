import React, { useState } from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';

const LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/20230d875_Screenshot2026-09-18at80532AM.png';
const STEPS = ['Browse an MLS property on Realtor, Homes, Redfin, or Zillow.', 'Paste the address or MLS number into Property Search.', 'AI and human intelligence organize the property facts.', 'Review the resulting intelligence and open questions.', 'Use the clearer picture to make better decisions.'];
const SAMPLES = ['742 Vista Del Mar', 'MLS #240001'];

export default function ChiefPilotPropertySearch({ title, currentProperty, onSearch }) {
  const [query, setQuery] = useState('');
  const submit = event => {
    event.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };
  return (
    <div className="flex min-h-full flex-col">
      <header className="text-center">
        <p className="mb-3 text-xs text-dyson-taupe">{title}</p>
        <img src={LOGO} alt="Dyson CoPilot" className="mx-auto mb-3 w-28 object-contain opacity-80" />
        <h2 className="text-2xl font-normal text-dyson-text">Meet CoPilot</h2>
        <p className="mt-2 text-sm text-dyson-taupe">Private real estate intelligence, organized around the property.</p>
      </header>
      <div className="flex flex-1 flex-col justify-center py-10">
        <form onSubmit={submit} className="mx-auto w-full max-w-2xl">
          <label htmlFor="property-search" className="mb-3 block text-center text-sm text-dyson-taupe">Paste an address or MLS# from Realtor, Homes, Redfin, or Zillow.</label>
          <div className="flex rounded-full border border-white/20 p-1.5 focus-within:border-dyson-gold">
            <input id="property-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Property address or MLS#" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-dyson-text outline-none placeholder:text-dyson-taupe/60" />
            <button type="submit" disabled={!query.trim()} className="rounded-full bg-dyson-gold px-5 py-2 text-sm text-dyson-text-dark disabled:opacity-40">Send</button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">{SAMPLES.map(sample => <button key={sample} type="button" onClick={() => setQuery(sample)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-dyson-taupe hover:text-dyson-text">{sample}</button>)}</div>
          {currentProperty && <p className="mt-4 text-center text-xs text-dyson-gold">Current property: {currentProperty}</p>}
        </form>
      </div>
      <ChiefPilotHowItWorks title="How search works" items={STEPS} />
      <p className="mt-5 text-xs text-dyson-taupe/70">No agent spam. CoPilot keeps the search focused on your questions and decisions.</p>
    </div>
  );
}