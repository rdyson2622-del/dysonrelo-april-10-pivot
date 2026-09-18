import React, { useEffect, useState } from 'react';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';
import ChiefPilotConversation from './ChiefPilotConversation';
import ChiefPilotExplainers from './ChiefPilotExplainers';

export default function ChiefPilotSubjectSearch({ subject, activeProperty, selectedAgentName, onOpenEntry, onSend, messages, loading, error }) {
  const [query, setQuery] = useState('');
  const [showExplainers, setShowExplainers] = useState(false);
  useEffect(() => { setQuery(''); setShowExplainers(false); }, [subject.id]);
  if (showExplainers) return <ChiefPilotExplainers subject={subject} onBack={() => setShowExplainers(false)} />;
  const submit = async event => {
    event.preventDefault();
    if (!query.trim() || loading) return;
    const sent = await onSend(query);
    if (sent) setQuery('');
  };
  return (
    <section className="min-h-full bg-dyson-black text-dyson-text">
      <ChiefPilotActivePropertyHeader property={activeProperty} agentName={selectedAgentName} onOpenListing={onOpenEntry} dark />
      <p className="text-xs tracking-widest text-dyson-gold-light">LEVEL 2 · ASK ABOUT THIS MILESTONE</p>
      <h2 className="mt-2 text-3xl font-normal text-white">{subject.title}</h2>
      <form onSubmit={submit} className="mt-8"><label htmlFor="chief-subject-query" className="mb-3 block text-sm text-white/70">Type a specific request or question</label><div className="flex items-center rounded-full border border-white/25 bg-dyson-ink p-1.5 pl-5 focus-within:border-dyson-gold"><input id="chief-subject-query" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Ask about ${subject.title}…`} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45" /><button type="submit" disabled={!query.trim() || loading} className="rounded-full border border-dyson-gold/60 bg-dyson-charcoal px-6 py-2.5 text-sm font-semibold text-dyson-gold-light disabled:opacity-40">{loading ? 'Searching…' : 'Send →'}</button></div></form>
      <div className="mt-8 min-h-40 rounded-xl border border-white/10 bg-dyson-ink p-6">{messages.length || loading || error ? <ChiefPilotConversation messages={messages} loading={loading} error={error} dark /> : <p className="text-sm text-white/45">Your answer and work product will appear here.</p>}</div>
      <button type="button" onClick={() => setShowExplainers(true)} className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/75 hover:border-dyson-gold hover:text-dyson-gold-light">Watch how this works · Explainers</button>
    </section>
  );
}