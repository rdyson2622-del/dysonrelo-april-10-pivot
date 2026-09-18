import React, { useState } from 'react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotListingCard from './ChiefPilotListingCard';
import ChiefPilotTextDeepDive from './ChiefPilotTextDeepDive';
import ChiefPilotStoryboard from './ChiefPilotStoryboard';
import ChiefPilotPreferredDoor from './ChiefPilotPreferredDoor';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';
import CopilotWordmark from '@/components/brand/CopilotWordmark';
const STEPS = ['Paste a complete property address or listing number.', 'CoPilot loads verified property fields when available.', 'The active property replaces the Calle Pavana example.'];
const MLS_LINKS = [['Realtor.com', 'https://www.realtor.com/'], ['Homes.com', 'https://www.homes.com/'], ['Redfin', 'https://www.redfin.com/'], ['Zillow', 'https://www.zillow.com/']];

export default function ChiefPilotPropertySearch({ title, activeProperty, isExample, onHideExample, searchLoading, searchError, onSearch, onClear, onSelectSubject, onSend, preferredClientActive, onPreferredClaim, onSaveProperty, saveStatus, selectedAgentName }) {
  const [query, setQuery] = useState('');
  const [gateMessage, setGateMessage] = useState('');
  const submit = event => { event.preventDefault(); if (query.trim() && !searchLoading) onSearch(query.trim()); };
  const protectedAction = action => {
    if (!preferredClientActive) {
      setGateMessage(action === 'save' ? 'Claim Preferred Client status to save this property.' : 'Claim Preferred Client status to keep this private conversation.');
      requestAnimationFrame(() => document.getElementById('preferred-client-door')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }
    if (action === 'save') onSaveProperty?.();
    else onSend?.(`What should I know about ${activeProperty?.fullAddress || 'this property'}?`);
  };
  return (
    <div className="flex min-h-full flex-col">
      <ChiefPilotActivePropertyHeader property={activeProperty} agentName={selectedAgentName} onOpenListing={() => document.getElementById('chief-pilot-listing-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
      <header className="mb-8 text-center"><p className="mb-3 text-xs text-dyson-text-dark/70">{title}</p><CopilotWordmark className="mx-auto h-14 w-36" /><p className="mt-3 text-sm text-dyson-text-dark/70">Private real estate intelligence, organized around the property.</p></header>
      <div id="chief-pilot-listing-card"><ChiefPilotListingCard property={activeProperty} isExample={isExample} onHideExample={onHideExample} onClear={onClear} onAudit={() => onSelectSubject('property-audit')} onSave={() => protectedAction('save')} onAsk={() => protectedAction('ask')} saveStatus={saveStatus}>{activeProperty && <ChiefPilotTextDeepDive property={activeProperty} isExample={isExample} />}</ChiefPilotListingCard></div>
      <ChiefPilotStoryboard property={activeProperty} agentName={selectedAgentName} onSelectSubject={onSelectSubject} />
      <ChiefPilotPreferredDoor active={preferredClientActive} message={gateMessage} onClaimSuccess={onPreferredClaim} />
      <form onSubmit={submit} className="mt-10 border-t border-black/10 pt-8"><label htmlFor="property-search" className="mb-3 block text-sm text-dyson-text-dark/70">Search another property</label><div className="flex rounded-full border border-black/20 p-1.5 focus-within:border-dyson-gold"><input id="property-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Property address or listing number" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-dyson-text-dark outline-none placeholder:text-dyson-text-dark/50" /><button type="submit" disabled={!query.trim() || searchLoading} className="rounded-full bg-dyson-gold px-5 py-2 text-sm text-dyson-text-dark disabled:opacity-40">{searchLoading ? 'Searching…' : 'Search'}</button></div>{searchError && <p className="mt-4 text-sm text-dyson-text-dark/70">{searchError}</p>}</form>
      <ChiefPilotHowItWorks title="How search works" items={STEPS}><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/10 pt-4">{MLS_LINKS.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener" className="text-xs text-dyson-text-dark/70 underline underline-offset-4 hover:text-dyson-text-dark">{label}</a>)}</div></ChiefPilotHowItWorks>
    </div>
  );
}