import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

const MAIN_TARGETS = [['property-search', 'Chats'], ['dnn-news', 'News'], ['library', 'Library']];

export default function ChiefPilotSearchEntry({ workspace, messages }) {
  const [query, setQuery] = useState('');
  const latestAnswer = [...messages].reverse().find(message => message.role === 'charlie');
  const choose = id => workspace.selectEntryTarget(id);
  const submit = async event => {
    event.preventDefault();
    if (!query.trim() || workspace.loading) return;
    await workspace.sendEntry(query.trim());
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center py-10 text-dyson-text">
      <div className="mb-10 text-center"><CopilotWordmark bold className="mx-auto h-12 w-32 text-3xl" /><h1 className="mt-5 font-serif text-3xl font-semibold">What are you working on?</h1></div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">{MAIN_TARGETS.map(([id, label]) => <button key={id} type="button" disabled={id === 'library' && !workspace.preferredClientActive} onClick={() => choose(id)} className={`rounded-full border px-4 py-2 text-xs ${workspace.activeSubject?.id === id ? 'border-dyson-gold bg-dyson-gold/10 text-dyson-gold-light' : 'border-white/15 text-dyson-taupe'} disabled:cursor-not-allowed disabled:opacity-40`}>{label}{id === 'library' ? ' · For Preferred Clients' : ''}</button>)}</div>
      <div className="mb-7 flex flex-wrap justify-center gap-2">{workspace.subjects.map(subject => <button key={subject.id} type="button" onClick={() => choose(subject.id)} className={`rounded-full px-3 py-1.5 text-[11px] ${workspace.activeSubject?.id === subject.id ? 'bg-white/15 text-white' : 'text-dyson-taupe hover:bg-white/10'}`}>{subject.title}</button>)}</div>
      <form onSubmit={submit} className="rounded-2xl border border-white/20 bg-white/5 p-3 focus-within:border-dyson-gold"><textarea value={query} onChange={event => setQuery(event.target.value)} placeholder={`Ask CoPilot about ${workspace.activeSubject?.title || 'your move'}…`} rows={3} className="w-full resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/40" /><div className="flex items-center justify-between"><span className="text-[11px] text-dyson-taupe">Searching in {workspace.activeSubject?.title}</span><button type="submit" disabled={!query.trim() || workspace.loading} className="flex items-center gap-2 rounded-full bg-dyson-gold px-4 py-2 text-xs font-semibold text-dyson-black disabled:opacity-40"><Search className="h-3.5 w-3.5" />{workspace.loading ? 'Searching…' : 'Search'}</button></div></form>
      {latestAnswer && <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5"><p className="text-sm leading-7 text-white/90">{latestAnswer.content}</p><button type="button" onClick={workspace.closeEntry} className="mt-5 flex items-center gap-2 text-xs font-semibold text-dyson-gold-light">Open {workspace.activeSubject?.title}<ArrowRight className="h-4 w-4" /></button></div>}
      {workspace.error && <p className="mt-4 text-center text-xs text-white/70">{workspace.error}</p>}
    </div>
  );
}