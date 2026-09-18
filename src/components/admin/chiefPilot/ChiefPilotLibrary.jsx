import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';
import ChiefPilotPreferredClientExplainer from './ChiefPilotPreferredClientExplainer';

const STEPS = ['Save a discussion or property context to the private vault.', 'Search your chats and saved items any time from this page.', 'Keep client material separate from general news delivery.'];

export default function ChiefPilotLibrary({ items, isExample, onHideExample, onSearchOwn }) {
  const [search, setSearch] = useState('');
  const [showExplainer, setShowExplainer] = useState(false);
  const examples = [{ id: 'calle-pavana-story', title: '6228 Calle Pavana — Complete CoPilot Story', propertyAddress: '6228 Calle Pavana, San Diego, CA 92139', example: true }];
  const rows = isExample ? [...examples, ...items] : items;
  const filtered = rows.filter(item => (item.title || '').toLowerCase().includes(search.toLowerCase()) || (item.propertyAddress || '').toLowerCase().includes(search.toLowerCase()));

  if (showExplainer) return <ChiefPilotPreferredClientExplainer items={rows} onBack={() => setShowExplainer(false)} />;

  return (
    <div>
      <p className="text-xs tracking-wide text-dyson-gold">PREFERRED CLIENT PRIVATE VAULT</p>
      <h2 className="mt-2 text-2xl font-normal text-dyson-text-dark">My Library</h2>

      <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-dyson-text-dark/50"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your chats and saved items" className="w-full rounded-full border border-black/20 bg-dyson-warm-paper py-2.5 pl-10 pr-4 text-sm text-dyson-text-dark outline-none focus:border-dyson-gold-deep"/></div>

      <ChiefPilotExampleFrame isExample={isExample} purpose="Keep your work together in one private place." benefit="A Private Vault for searches, audits, road maps, and saved discussions." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={<div className="mt-1 flex flex-wrap gap-3">{filtered.length ? filtered.map((item, index) => <div key={item.id || index} className="min-w-[220px] flex-1 rounded-xl border border-black/20 bg-dyson-charcoal px-5 py-4"><p className="text-sm text-dyson-text">{item.example && <span className="mr-2 text-[10px] text-dyson-gold">EXAMPLE · PUBLISHED</span>}{item.title || 'Saved discussion'}</p>{item.propertyAddress && <p className="mt-1 text-xs text-dyson-taupe">{item.propertyAddress}</p>}</div>) : <p className="py-6 text-sm text-dyson-taupe">No saved items yet.</p>}</div>} next={<><p>Claim Preferred Client status to keep your own Library.</p><button type="button" onClick={() => setShowExplainer(true)} className="mt-2 text-xs text-dyson-gold-deep underline underline-offset-4">What happens once I'm a Preferred Client?</button></>} />
      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}