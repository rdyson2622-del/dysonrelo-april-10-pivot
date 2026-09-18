import React, { useState } from 'react';

export default function ChiefPilotChatComposer({ disabled, loading, onSend }) {
  const [input, setInput] = useState('');

  const submit = async event => {
    event.preventDefault();
    if (!input.trim() || disabled || loading) return;
    const sent = await onSend(input);
    if (sent) setInput('');
  };

  return (
    <form onSubmit={submit} className="mt-5 border-t border-white/10 pt-4">
      <label htmlFor="chief-pilot-chat" className="sr-only">Message Chief Pilot</label>
      <textarea id="chief-pilot-chat" rows={3} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => {
        if (event.key === 'Enter' && !event.shiftKey) submit(event);
      }} disabled={disabled || loading} placeholder={disabled ? 'Select a subject first' : 'Ask about this subject'} className="w-full resize-none rounded-lg border border-white/15 bg-transparent px-3 py-2.5 text-sm text-dyson-text outline-none placeholder:text-dyson-taupe/60 focus:border-white/30 disabled:opacity-60" />
      <div className="mt-2 flex justify-end">
        <button type="submit" disabled={disabled || loading || !input.trim()} className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-dyson-text hover:bg-white/5 disabled:opacity-30">
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  );
}