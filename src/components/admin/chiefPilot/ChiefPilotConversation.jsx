import React from 'react';

export default function ChiefPilotConversation({ messages, loading, error, dark = false }) {
  if (!messages.length && !loading && !error) return null;
  return (
    <section className={`${dark ? '' : 'mt-10 border-t border-black/10 pt-6'}`}>
      <p className={`mb-5 text-xs ${dark ? 'text-white/55' : 'text-dyson-text-dark/70'}`}>Conversation</p>
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          return (
            <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-dyson-gold-deep text-black' : dark ? 'bg-white/10 text-white' : 'bg-black/5 text-dyson-text-dark'}`}>
                <p className={`mb-1 text-[11px] font-semibold ${isUser ? 'text-black/60' : dark ? 'text-white/45' : 'text-dyson-text-dark/60'}`}>{isUser ? 'You' : 'Chief Pilot'}</p>
                <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                {message.audioUrl && <audio controls src={message.audioUrl} className="mt-2 h-8 max-w-xs" />}
                {message.handoff && <div className="mt-3 flex items-center gap-4 text-xs"><a href="tel:8583531200" className={dark ? 'text-dyson-gold-light underline underline-offset-4' : 'text-dyson-gold-deep underline underline-offset-4'}>Call Bob</a><span className={dark ? 'text-white/65' : 'text-dyson-text-dark/70'}>Connect with Bob · (858) 353-1200</span></div>}
              </div>
            </div>
          );
        })}
        {loading && <div className="flex justify-start"><p className={`rounded-2xl px-4 py-3 text-xs ${dark ? 'bg-white/10 text-white/55' : 'bg-black/5 text-dyson-text-dark/70'}`}>Thinking…</p></div>}
        {error && <p className="text-xs text-status-stop">{error}</p>}
      </div>
    </section>
  );
}