import React from 'react';

export default function ChiefPilotConversation({ messages, loading, error }) {
  if (!messages.length && !loading && !error) return null;
  return (
    <section className="mt-10 border-t border-black/10 pt-6">
      <p className="mb-5 text-xs text-dyson-text-dark/70">Discussion</p>
      <div className="space-y-5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`}>
            <p className="mb-1 text-[11px] text-dyson-text-dark/60">{message.role === 'user' ? 'You' : 'Chief Pilot'}</p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-dyson-text-dark">{message.content}</p>
            {message.handoff && <div className="mt-3 flex items-center gap-4 text-xs"><a href="tel:8583531200" className="text-dyson-gold-deep underline underline-offset-4">Call Bob</a><span className="text-dyson-text-dark/70">Connect with Bob · (858) 353-1200</span></div>}
          </div>
        ))}
        {loading && <p className="text-xs text-dyson-text-dark/70">Thinking…</p>}
        {error && <p className="text-xs text-status-stop">{error}</p>}
      </div>
    </section>
  );
}