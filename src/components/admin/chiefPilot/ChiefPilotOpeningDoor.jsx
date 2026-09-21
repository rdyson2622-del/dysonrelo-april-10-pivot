import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotWordmark from '@/components/brand/CopilotWordmark';
import ChiefPilotHowCopilotWorksExplainer from './ChiefPilotHowCopilotWorksExplainer';

const HERO_IMAGE = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/efdc69af3_hero-evening-luxury-clean.png';
const SAMPLES = ['742 Vista Del Mar, La Jolla, CA 92037', '1844 Mountain Shadow Way, Scottsdale, AZ 85253'];

export default function ChiefPilotOpeningDoor({ workspace }) {
  const [address, setAddress] = useState('');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  if (showHowItWorks) return <ChiefPilotHowCopilotWorksExplainer onBack={() => setShowHowItWorks(false)} />;
  const search = async value => {
    const query = (value || address).trim();
    if (!query || workspace.searchLoading) return;
    const found = await workspace.runPropertySearch(query);
    if (found) workspace.closeEntry();
  };

  return (
    <div className="grid min-h-full items-center gap-10 py-8 text-left text-dyson-text-dark lg:grid-cols-[1.2fr_0.8fr]" style={{ transform: 'translateY(-12%)' }}>
      <div>
        <div className="flex items-end gap-3"><span className="pb-2 font-serif text-4xl font-light">meet</span><div className="flex flex-col items-center"><DysonVerticalBadge height={82} className="mb-2" /><CopilotWordmark bold className="h-16 w-52" /></div></div>
        <p className="mt-5 text-lg tracking-wide text-dyson-text-dark">Your Private Real Estate Copilot.</p>
        <form onSubmit={event => { event.preventDefault(); search(); }} className="mt-8"><div className="flex w-full max-w-xl items-center rounded-full border border-black/25 bg-dyson-black p-1.5 pl-5 focus-within:border-dyson-gold"><input value={address} onChange={event => setAddress(event.target.value)} placeholder="Paste an address or listing number" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55" /><button type="submit" disabled={!address.trim() || workspace.searchLoading} className="rounded-full border border-white/30 bg-dyson-charcoal px-6 py-2.5 text-sm font-semibold text-dyson-gold-light disabled:opacity-40">{workspace.searchLoading ? 'Searching…' : 'Send →'}</button></div></form>
        <p className="mt-3 text-xs text-dyson-text-dark/70">Paste an address for comps, risks, and property insights where allowed.</p>
        <div className="mt-6 flex flex-wrap items-center gap-2"><span className="text-xs text-dyson-gold-deep">Sample Lookups:</span>{SAMPLES.map(sample => <button key={sample} type="button" onClick={() => { setAddress(sample); search(sample); }} className="rounded-md border border-black/20 bg-black/5 px-3 py-1 text-xs text-dyson-text-dark hover:border-dyson-gold-deep">{sample.split(',')[0]}</button>)}</div>
        {workspace.searchError && <p className="mt-4 text-sm text-dyson-text-dark/70">{workspace.searchError}</p>}
        <p className="mt-7 flex items-center gap-2 text-xs text-dyson-gold-deep"><ShieldCheck className="h-4 w-4" />Independent research — no spam calls or agent involvement.</p>
        <button type="button" onClick={() => setShowHowItWorks(true)} className="mt-6 rounded-full border border-black/20 px-5 py-2.5 text-sm text-dyson-text-dark/75 hover:border-dyson-gold-deep hover:text-dyson-gold-deep">Watch how this works · Explainers</button>
      </div>
      <div className="overflow-hidden rounded-2xl shadow-2xl"><img src={HERO_IMAGE} alt="Luxury home at evening" className="aspect-[16/11] h-full w-full object-cover" /></div>
    </div>
  );
}