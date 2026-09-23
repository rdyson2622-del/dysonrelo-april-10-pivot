import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import CopilotWordmark from '@/components/brand/CopilotWordmark';
import ChiefPilotHowCopilotWorksExplainer from './ChiefPilotHowCopilotWorksExplainer';

const HERO_IMAGE = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/efdc69af3_hero-evening-luxury-clean.png';
const DD_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0c42dcd7c_DYSONDYSONLOGO2026.png';
const TESTIMONIAL_VIDEO_URL = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/bf489a37c_a_true_story_of_a_cross_country_real_estate_move.mp4';
const SCROLL_COPY = 'Real Estate Solutions... We execute most all real estate steps in the buying, selling and relocation process for our clients at no expense to them.';

export default function ChiefPilotOpeningDoor({ workspace }) {
  const [address, setAddress] = useState('');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  if (showHowItWorks) return <ChiefPilotHowCopilotWorksExplainer onBack={() => setShowHowItWorks(false)} />;
  const search = async value => {
    const query = (value || address).trim();
    if (!query || workspace.searchLoading) return;
    await workspace.askAnything(query);
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
        {[['buy', 'Buy'], ['relocation-management', 'Relocation Management'], ['sell', 'Sell']].map(([id, label]) => (
          <button key={id} type="button" onClick={() => workspace.selectMode(id)} className="rounded-full border border-black bg-dyson-black px-6 py-2.5 text-sm font-medium text-dyson-gold-light hover:border-dyson-gold-deep">{label}</button>
        ))}
      </div>
      <div className="mt-6 text-2xl font-medium leading-tight text-dyson-text-dark sm:text-3xl md:text-[2.7rem]">
        <p className="text-center -translate-x-[15%]">We Don't Sell Real Estate...</p>
        <p className="text-center text-[1.275rem] translate-x-[3.234rem] sm:text-[1.59rem] sm:translate-x-[5.391rem] md:text-[2.295rem] md:translate-x-[7.547rem]">We Reduce <em className="italic">Stress</em>!</p>
      </div>
      <div className="mt-6 flex flex-col items-start gap-2 text-left">
        <p className="text-lg text-dyson-text-dark">• We vet, in any city or state, the top local agents with & for you</p>
        <p className="text-lg text-dyson-text-dark">• Our Relocation Process saves you significant closing costs</p>
        <p className="text-lg text-dyson-text-dark">• Together, we orchestrate your entire move and reduce stress all along the way</p>
      </div>
      <div className="w-full pt-6">
        <p className="mb-3 text-sm text-dyson-text-dark">Tell us about your real estate need or issue right here and we'll provide some options to consider</p>
        <form onSubmit={event => { event.preventDefault(); search(); }} className="w-full flex justify-center"><div className="flex w-full max-w-xl items-center rounded-full border border-white/25 bg-dyson-black p-1.5 pl-5 focus-within:border-dyson-gold"><div className="relative min-w-0 flex-1"><input value={address} onChange={event => setAddress(event.target.value)} placeholder="" className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55" />{!address && <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"><div className="inline-flex animate-marquee whitespace-nowrap text-sm text-white/55"><span className="mr-12">{SCROLL_COPY}</span><span className="mr-12">{SCROLL_COPY}</span></div></div>}</div><button type="submit" disabled={!address.trim() || workspace.searchLoading} className="rounded-full border border-white/30 bg-dyson-charcoal px-6 py-2.5 text-sm font-semibold text-dyson-gold-light disabled:opacity-40">{workspace.searchLoading ? 'Searching…' : 'Send →'}</button></div></form>
        <p className="mt-6 text-center text-3xl font-semibold text-dyson-text-dark">INTERVIEW US!<br className="landscape:hidden lg:hidden" /><span className="landscape:ml-2 lg:ml-2">(858) 353 1200</span></p>
        {workspace.searchError && <p className="mt-4 text-sm text-dyson-text-dark">{workspace.searchError}</p>}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-dyson-text-dark">
          <span className="text-dyson-text-dark">Testimonial:</span>
          <a href={TESTIMONIAL_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="rounded-md border border-black/20 bg-white/40 px-3 py-1 text-xs text-dyson-text-dark hover:border-dyson-gold-deep">Windean Strattons — Arizona to Arkansas Move</a>
        </div>
        <div className="mt-3 flex w-full items-center gap-2 text-xs text-dyson-text-dark">
          <ShieldCheck className="h-4 w-4" />
          <span>A Independent research entity— no spam calls or agent involvement.</span>
        </div>
      </div>
    </div>
  );
}