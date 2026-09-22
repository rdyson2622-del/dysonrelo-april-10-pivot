import React, { useState } from 'react';
import ChiefPilotConversation from './ChiefPilotConversation';

// Ask/response box for the DNN News player — lets a visitor ask about the
// broadcast or market and see Chief Pilot's answer inline, mirroring the
// search + response pattern used on the subject explainer pages.
export default function ChiefPilotDnnNewsAsk({ onSend, messages = [], loading = false, error = '' }) {
  const [query, setQuery] = useState('');

  const submit = async event => {
    event.preventDefault();
    if (!query.trim() || loading || !onSend) return;
    const sent = await onSend(query);
    if (sent) setQuery('');
  };

  return (
    <div className="mt-8 text-left">
      <form onSubmit={submit} className="flex items-center rounded-full border border-black/20 bg-dyson-warm-paper p-1 pl-4 focus-within:border-dyson-gold-deep">
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ask about today's DNN News…" className="min-w-0 flex-1 bg-transparent text-sm text-dyson-text-dark outline-none placeholder:text-dyson-text-dark/45" />
        <button type="submit" disabled={!query.trim() || loading} className="rounded-full border border-dyson-gold-deep/60 bg-dyson-cream px-4 py-2 text-xs font-semibold text-dyson-gold-deep disabled:opacity-40">{loading ? 'Searching…' : 'Send →'}</button>
      </form>
      {(messages.length > 0 || loading || error) && (
        <div className="mt-4 rounded-xl border border-white/15 bg-dyson-black p-6">
          <ChiefPilotConversation messages={messages} loading={loading} error={error} dark />
        </div>
      )}
    </div>
  );
}