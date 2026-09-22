import React, { useState } from 'react';
import ChiefPilotExplainerVideoStack from './ChiefPilotExplainerVideoStack';
import ChiefPilotMilestoneMap from './ChiefPilotMilestoneMap';
import ChiefPilotConversation from './ChiefPilotConversation';
import { SUBJECT_EXPLAINER_CONTENT } from './chiefPilotExplainerContent';

export default function ChiefPilotExplainers({ subject, onBack, isLiveObjective = false, onSend, messages = [], loading = false, error = '' }) {
  const content = SUBJECT_EXPLAINER_CONTENT[subject.id] || SUBJECT_EXPLAINER_CONTENT['real-estate-solutions'];
  const explainers = content.explainers;
  const [query, setQuery] = useState('');
  const submit = async event => {
    event.preventDefault();
    if (!query.trim() || loading || !onSend) return;
    const sent = await onSend(query);
    if (sent) setQuery('');
  };
  return (
    <section className="min-h-full rounded-xl bg-dyson-cream p-4 text-dyson-text-dark sm:p-5">
      <button type="button" onClick={onBack} className="inline-flex items-center rounded-full border border-dyson-gold-deep bg-dyson-warm-paper px-4 py-2 text-xs font-semibold text-dyson-gold-deep shadow-sm">← Back to ask/search</button>
      <h2 className="mt-3 text-[0.9375rem] font-normal leading-snug">
        {(() => {
          const splitAt = subject.title.indexOf('. ');
          if (splitAt === -1) return subject.title;
          return <><span className="text-[1.172rem]">{subject.title.slice(0, splitAt + 1)}</span><br />{subject.title.slice(splitAt + 2)}</>;
        })()}
      </h2>
      {content.byline && <p className="mt-1.5 max-w-2xl text-sm leading-5 text-dyson-text-dark/80">{content.byline}</p>}
      <div className="mt-3 grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(160px,180px)]">
        <div>
          {content.preface && (
            <div className="mb-4 border-b border-black/10 pb-4">
              <p className="max-w-2xl text-sm leading-5">{content.preface}</p>
              <ol className="mt-2 space-y-1">{content.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-5"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dyson-gold-deep text-xs">{index + 1}</span>{step}</li>)}</ol>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[['Realtor.com', 'https://www.realtor.com'], ['Homes.com', 'https://www.homes.com'], ['Redfin.com', 'https://www.redfin.com'], ['Zillow', 'https://www.zillow.com']].map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-black/20 bg-dyson-warm-paper px-3 py-1 text-xs font-semibold hover:border-dyson-gold-deep">{label}</a>)}
                <span className="flex items-center gap-1.5 rounded-full border border-black/20 bg-dyson-warm-paper px-3 py-1 text-xs font-semibold text-dyson-text-dark/60">DysonCoPilot <span className="text-[10px] font-normal text-dyson-gold-deep">coming soon</span></span>
              </div>
            </div>
          )}
          <p className="max-w-2xl text-sm leading-5">{content.intro}</p>
          <ul className="mt-3 space-y-1.5">{content.bullets.map(point => <li key={point} className="flex gap-3 text-sm leading-5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dyson-gold-deep" />{point}</li>)}</ul>
          {onSend && <form onSubmit={submit} className="mt-10 max-w-md border-t border-black/10 pt-5"><label htmlFor="chief-explainer-query" className="mb-1.5 block text-xs text-dyson-text-dark/70">Ask about {subject.title} without leaving this explainer</label><div className="flex items-center rounded-full border border-black/20 bg-dyson-warm-paper p-1 pl-4 focus-within:border-dyson-gold-deep"><input id="chief-explainer-query" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Ask about ${subject.title}…`} className="min-w-0 flex-1 bg-transparent text-sm text-dyson-text-dark outline-none placeholder:text-dyson-text-dark/45" /><button type="submit" disabled={!query.trim() || loading} className="rounded-full border border-dyson-gold-deep/60 bg-dyson-cream px-4 py-2 text-xs font-semibold text-dyson-gold-deep disabled:opacity-40">{loading ? 'Searching…' : 'Send →'}</button></div></form>}
          <div className="mt-3 min-h-40 max-w-2xl rounded-xl border border-white/15 bg-dyson-black p-6">
            {(messages.length || loading || error) ? <ChiefPilotConversation messages={messages} loading={loading} error={error} /> : <p className="text-sm text-dyson-taupe">Your answer and work product will appear here.</p>}
          </div>
        </div>
        <ChiefPilotExplainerVideoStack explainers={explainers} />
      </div>
      <ChiefPilotMilestoneMap milestones={content.milestones} isLiveObjective={isLiveObjective} />
    </section>
  );
}