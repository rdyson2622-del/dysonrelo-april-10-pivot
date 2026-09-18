import React from 'react';

export default function ChiefPilotConversation({ messages, loading, error }) {
  if (!messages.length && !loading && !error) return null;
  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <p className="mb-5 text-xs text-dyson-taupe">Discussion</p>
      <div className="space-y-5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`}>
            <p className="mb-1 text-[11px] text-dyson-taupe">{message.role === 'user' ? 'You' : 'Chief Pilot'}</p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-dyson-text">{message.content}</p>
          </div>
        ))}
        {loading && <p className="text-xs text-dyson-taupe">Thinking…</p>}
        {error && <p className="text-xs text-status-stop">{error}</p>}
      </div>
    </section>
  );
}