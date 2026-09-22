import React from 'react';

export default function ChiefPilotConversation({ messages, loading, error, dark = false }) {
  if (!messages.length && !loading && !error) return null;
  return (
    <section className={`${dark ? '' : 'mt-10 border-t border-black/10 pt-6'}`}>
      <p className={`mb-5 text-xs ${dark ? 'text-white/55' : 'text-dyson-text-dark/70'}`}>Results</p>
      <div className="space-y-5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`}>
            <p className={`mb-1 text-[11px] ${dark ? 'text-white/45' : 'text-dyson-text-dark/60'}`}>{message.role === 'user' ? 'You' : 'Chief Pilot'}</p>
            <p className={`whitespace-pre-wrap text-sm leading-7 ${dark ? 'text-white' : 'text-dyson-text-dark'}`}>{message.content}</p>
            {message.audioUrl && <audio controls src={message.audioUrl} className="mt-2 h-8 max-w-xs" />}
            {message.handoff && <div className="mt-3 flex items-center gap-4 text-xs"><a href="tel:8583531200" className={`${dark ? 'text-dyson-gold-light' : 'text-dyson-gold-deep'} underline underline-offset-4`}>Call Bob</a><span className={dark ? 'text-white/65' : 'text-dyson-text-dark/70'}>Connect with Bob · (858) 353-1200</span></div>}
          </div>
        ))}
        {loading && <p className={`text-xs ${dark ? 'text-white/55' : 'text-dyson-text-dark/70'}`}>Thinking…</p>}
        {error && <p className="text-xs text-status-stop">{error}</p>}
      </div>
    </section>
  );
}