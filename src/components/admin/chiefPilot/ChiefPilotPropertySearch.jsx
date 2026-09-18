import React, { useState } from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotPropertySummary from './ChiefPilotPropertySummary';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';

const LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/20230d875_Screenshot2026-09-18at80532AM.png';
const STEPS = ['Browse a property on Realtor, Homes, Redfin, or Zillow.', 'Paste the address or listing number into Property Search.', 'AI and human intelligence organize the property facts.', 'Review the resulting intelligence and open questions.', 'Use the clearer picture to make better decisions.'];
const SAMPLES = ['6228 Calle Pavana, San Diego, CA 92139'];
const MLS_LINKS = [['Realtor.com', 'https://www.realtor.com/'], ['Homes.com', 'https://www.homes.com/'], ['Redfin', 'https://www.redfin.com/'], ['Zillow', 'https://www.zillow.com/']];

export default function ChiefPilotPropertySearch({ title, activeProperty, isExample, exampleLoading, onHideExample, onSearchOwn, searchLoading, searchError, onSearch, onClear }) {
  const [query, setQuery] = useState('');
  const submit = event => { event.preventDefault(); if (query.trim() && !searchLoading) onSearch(query.trim()); };
  return (
    <div className="flex min-h-full flex-col">
      <header className="text-center"><p className="mb-3 text-xs text-dyson-taupe">{title}</p><img src={LOGO} alt="Dyson CoPilot" className="mx-auto mb-3 w-28 object-contain opacity-80" /><h2 className="text-2xl font-normal text-dyson-text">Meet CoPilot</h2><p className="mt-2 text-sm text-dyson-taupe">Private real estate intelligence, organized around the property.</p></header>
      <div className="flex flex-1 flex-col py-8">
        <ChiefPilotExampleFrame isExample={isExample} purpose="Start with the home you are already looking at." benefit="Private intelligence around that address — not agent spam." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={activeProperty ? <ChiefPilotPropertySummary property={activeProperty} onClear={onClear} isExample={isExample} /> : <p className="text-sm text-dyson-taupe">{exampleLoading ? 'Loading verified example property data…' : 'Property data is not available in example.'}</p>} next={<div><button type="button" onClick={() => { setQuery(SAMPLES[0]); onSearch(SAMPLES[0]); }} className="mb-4 rounded-full border border-dyson-gold/40 px-3 py-1.5 text-xs text-dyson-gold">Try this example address</button><form onSubmit={submit} className="w-full max-w-2xl">
          <label htmlFor="property-search" className="mb-3 block text-center text-sm text-dyson-taupe">Paste an address or listing number from Realtor, Homes, Redfin, or Zillow.</label>
          <div className="flex rounded-full border border-white/20 p-1.5 focus-within:border-dyson-gold"><input id="property-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Property address or listing number" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-dyson-text outline-none placeholder:text-dyson-taupe/60" /><button type="submit" disabled={!query.trim() || searchLoading} className="rounded-full bg-dyson-gold px-5 py-2 text-sm text-dyson-text-dark disabled:opacity-40">{searchLoading ? 'Searching…' : 'Send'}</button></div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">{SAMPLES.map(sample => <button key={sample} type="button" onClick={() => setQuery(sample)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-dyson-taupe hover:text-dyson-text">{sample}</button>)}</div>
          {searchError && <div className="mt-5 text-center text-sm leading-6 text-dyson-taupe"><p>{searchError}</p><p className="mt-1 text-dyson-text">Try another complete address or MLS#.</p></div>}
        </form></div>} />
      </div>
      <ChiefPilotHowItWorks title="How search works" items={STEPS}><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4">{MLS_LINKS.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener" className="text-xs text-dyson-taupe underline underline-offset-4 hover:text-dyson-text">{label}</a>)}</div></ChiefPilotHowItWorks>
      <p className="mt-5 text-xs text-dyson-taupe/70">No agent spam. CoPilot keeps the search focused on your questions and decisions.</p>
    </div>
  );
}