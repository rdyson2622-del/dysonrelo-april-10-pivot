import React from 'react';

export default function ChiefPilotDossier({ subject, messages, loading, error }) {
  if (!subject) {
    return (
      <div className="flex min-h-[460px] w-full items-center justify-center">
        <img
          src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/20230d875_Screenshot2026-09-18at80532AM.png"
          alt="Dyson CoPilot"
          className="w-full max-w-[280px] object-contain opacity-80"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="border-b border-white/10 pb-7">
        <p className="mb-3 text-xs text-dyson-taupe">Focused dossier</p>
        <h2 className="text-2xl font-normal text-dyson-text">{subject.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-dyson-taupe">{subject.placeholder}</p>
      </div>
      {messages.length > 0 && (
        <div className="space-y-5 py-7">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className="border-b border-white/5 pb-5">
              <p className="mb-2 text-[11px] text-dyson-taupe">{message.role === 'user' ? 'You' : 'Chief Pilot'}</p>
              <p className="whitespace-pre-wrap text-sm leading-7 text-dyson-text">{message.content}</p>
            </div>
          ))}
        </div>
      )}
      {loading && <p className="pt-5 text-xs text-dyson-taupe">Thinking…</p>}
      {error && <p className="pt-5 text-xs text-status-stop">{error}</p>}
    </div>
  );
}