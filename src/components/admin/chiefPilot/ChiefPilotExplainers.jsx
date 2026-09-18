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
      <p className="mt-3 text-xs tracking-widest text-dyson-gold-deep">LEVEL 3 · OPTIONAL EXPLAINERS</p>
      <h2 className="mt-1 text-xl font-normal">{subject.title}</h2>
      <div className="mt-3 grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div>
          <p className="max-w-2xl text-sm leading-5">{content.intro}</p>
          <ul className="mt-3 space-y-1.5">{content.bullets.map(point => <li key={point} className="flex gap-3 text-sm leading-5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dyson-gold-deep" />{point}</li>)}</ul>
          {onSend && <form onSubmit={submit} className="mt-5 max-w-md"><label htmlFor="chief-explainer-query" className="mb-1.5 block text-xs text-dyson-text-dark/70">Ask about {subject.title} without leaving this explainer</label><div className="flex items-center rounded-full border border-black/20 bg-dyson-warm-paper p-1 pl-4 focus-within:border-dyson-gold-deep"><input id="chief-explainer-query" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Ask about ${subject.title}…`} className="min-w-0 flex-1 bg-transparent text-sm text-dyson-text-dark outline-none placeholder:text-dyson-text-dark/45" /><button type="submit" disabled={!query.trim() || loading} className="rounded-full border border-dyson-gold-deep/60 bg-dyson-cream px-4 py-2 text-xs font-semibold text-dyson-gold-deep disabled:opacity-40">{loading ? 'Searching…' : 'Send →'}</button></div></form>}
          {(messages.length || loading || error) ? <div className="mt-3 max-w-md rounded-xl border border-black/10 bg-dyson-warm-paper p-3"><ChiefPilotConversation messages={messages} loading={loading} error={error} /></div> : null}
        </div>
        <ChiefPilotExplainerVideoStack explainers={explainers} />
      </div>
      <ChiefPilotMilestoneMap milestones={content.milestones} isLiveObjective={isLiveObjective} />
    </section>
  );
}