import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

export default function ChiefPilotPreferredClientExplainer({ items = [], onBack }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter(item => (item.title || '').toLowerCase().includes(search.toLowerCase()) || (item.propertyAddress || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <p className="text-xs tracking-wide text-dyson-gold">PREFERRED CLIENT PRIVATE VAULT</p>
      <h2 className="mt-2 text-2xl font-normal text-dyson-text-dark">Once You Become a Preferred Client</h2>
      <p className="mt-4 text-sm leading-6 text-dyson-text-dark/80">
        All your prior discussions and solutions will be stored here automatically — every property search, audit, agent vetting, and road map you've worked through with CoPilot, kept together in one private file. Nothing in your record is shared outside your file, and you'll never have to repeat yourself: Charlie and Bob reference your history the moment you return, so every new conversation picks up exactly where the last one left off.
      </p>

      <div className="relative mt-6"><Search className="absolute left-3 top-3 h-4 w-4 text-dyson-text-dark/50"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your chats and saved items" className="w-full rounded-full border border-black/20 bg-dyson-warm-paper py-2.5 pl-10 pr-4 text-sm text-dyson-text-dark outline-none focus:border-dyson-gold-deep"/></div>
      <div className="mt-4 space-y-2">
        {filtered.length ? filtered.map((item, index) => (
          <div key={item.id || index} className="rounded-lg border border-black/15 bg-dyson-warm-paper px-4 py-3">
            <p className="text-sm text-dyson-text-dark">{item.title || 'Saved discussion'}</p>
            {item.propertyAddress && <p className="mt-0.5 text-xs text-dyson-text-dark/60">{item.propertyAddress}</p>}
          </div>
        )) : <p className="text-sm text-dyson-text-dark/60">No saved items yet — they'll show up here once you start saving.</p>}
      </div>

      <button type="button" onClick={onBack} className="mt-7 inline-flex items-center gap-2 rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-4 py-2 text-xs font-semibold text-dyson-gold-deep"><ArrowLeft className="h-3 w-3"/>Back to My Library</button>
    </div>
  );
}