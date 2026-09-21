import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import CopilotWordmark from '@/components/brand/CopilotWordmark';
import ChiefPilotHowCopilotWorksExplainer from './ChiefPilotHowCopilotWorksExplainer';

const HERO_IMAGE = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/efdc69af3_hero-evening-luxury-clean.png';
const DD_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0c42dcd7c_DYSONDYSONLOGO2026.png';
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
    <div className="flex flex-col items-center text-center">
      <div className="w-full rounded-3xl border border-white/10 bg-dyson-black p-6 sm:p-8">
        <div className="grid min-h-full items-center gap-10 text-white lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col items-center text-center">
            <img src={DD_LOGO} alt="Dyson & Dyson" className="mx-auto mb-2 h-24 w-auto" />
            <div className="flex items-end gap-3"><span className="pb-2 font-serif text-3xl font-light text-white">meet</span><CopilotWordmark bold className="h-16 w-52" /></div>
            <p className="mt-5 text-lg tracking-wide text-white">Your Private AI Real Estate Assistants</p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl"><img src={HERO_IMAGE} alt="Luxury home at evening" className="aspect-[16/11] w-full object-cover" /></div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {['Buy', 'Relocation Management', 'Sell'].map(label => (
          <button key={label} type="button" className="rounded-full border border-black bg-dyson-black px-6 py-2.5 text-sm font-medium text-dyson-gold-light hover:border-dyson-gold-deep">{label}</button>
        ))}
      </div>
      <p className="mt-6 text-[2.7rem] font-medium leading-tight text-dyson-text-dark">We Don't Sell Real Estate...We Reduce Stress!</p>
      <div className="mt-6 flex flex-col items-start gap-2 text-left">
        <p className="text-lg text-dyson-text-dark">• In any city or state, we vet the top local agents with you</p>
        <p className="text-lg text-dyson-text-dark">• You save significant closing costs in the process</p>
        <p className="text-lg text-dyson-text-dark">• Together, we orchestrate your entire move and reduce stress all along the way</p>
      </div>
      <div className="w-full pt-6">
        <form onSubmit={event => { event.preventDefault(); search(); }} className="w-full flex justify-center"><div className="flex w-full max-w-xl items-center rounded-full border border-white/25 bg-dyson-black p-1.5 pl-5 focus-within:border-dyson-gold"><input value={address} onChange={event => setAddress(event.target.value)} placeholder="Paste an address or listing number" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55" /><button type="submit" disabled={!address.trim() || workspace.searchLoading} className="rounded-full border border-white/30 bg-dyson-charcoal px-6 py-2.5 text-sm font-semibold text-dyson-gold-light disabled:opacity-40">{workspace.searchLoading ? 'Searching…' : 'Send →'}</button></div></form>
        <p className="mt-3 text-xs text-dyson-text-dark">Paste an address for comps, risks, and property insights where allowed.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2"><span className="text-xs text-dyson-gold-light">Sample Lookups:</span>{SAMPLES.map(sample => <button key={sample} type="button" onClick={() => { setAddress(sample); search(sample); }} className="rounded-md border border-white/20 bg-white/5 px-3 py-1 text-xs text-white hover:border-dyson-gold-light">{sample.split(',')[0]}</button>)}</div>
        {workspace.searchError && <p className="mt-4 text-sm text-dyson-text-dark">{workspace.searchError}</p>}
        <p className="mt-7 flex items-center gap-2 text-xs text-dyson-gold-light"><ShieldCheck className="h-4 w-4" />Independent research — no spam calls or agent involvement.</p>
        <button type="button" onClick={() => setShowHowItWorks(true)} className="mt-6 rounded-full border border-black/20 px-5 py-2.5 text-sm text-dyson-text-dark hover:border-dyson-gold-deep hover:text-dyson-gold-deep">Watch how this works · Explainers</button>
      </div>
    </div>
  );
}