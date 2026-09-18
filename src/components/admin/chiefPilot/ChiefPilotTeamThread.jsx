import React, { useState } from 'react';
import ChiefPilotActivePropertyHeader from './ChiefPilotActivePropertyHeader';

export default function ChiefPilotTeamThread({ title, activeProperty, isExample, agentName, escrowStub, messages, preferredClientActive, onSendMessage, onOpenListing }) {
  const [text, setText] = useState('');
  if (!activeProperty) return <ChiefPilotActivePropertyHeader property={null} onOpenListing={onOpenListing} />;
  const risks = activeProperty.risks || [];
  const openItems = [['Audit flags', risks.length ? risks.slice(0, 2).map(item => item.title).join(', ') : 'Disclosure review pending'], ['Road Map', escrowStub ? 'Escrow phase is active' : 'Property Search is active'], ['Escrow Watch', escrowStub ? 'Milestones attached' : 'Watch not started']];
  const submit = event => { event.preventDefault(); if (!text.trim()) return; onSendMessage(text.trim()); setText(''); };
  return (
    <div>
      <ChiefPilotActivePropertyHeader property={activeProperty} agentName={agentName} onOpenListing={onOpenListing} />
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-normal text-dyson-text">{title}</h2>{isExample && <span className="text-[10px] tracking-[0.18em] text-dyson-gold">EXAMPLE</span>}</div>
      <div className="mt-6 grid grid-cols-3 gap-3">{[['Client', 'Buyer'], ['Agent', agentName || 'Selected after Vetting'], ['Dyson CoPilot', 'Monitor · assistant · deep-dive']].map(([role, name]) => <div key={role} className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><p className="text-[10px] text-dyson-taupe">{role}</p><p className="mt-2 text-xs text-dyson-text">{name}</p></div>)}</div>
      <p className="mt-4 text-xs leading-5 text-dyson-taupe">Dyson combines AI with 55 years of human industry input to monitor, assist, suggest, and flag—not make the decision.</p>
      <div className="mt-6 divide-y divide-white/10 border-y border-white/10">{openItems.map(([label, item]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[120px_1fr]"><p className="text-xs text-dyson-text">{label}</p><p className="text-xs text-dyson-taupe">{item}</p></div>)}</div>
      {messages?.length > 0 && <div className="mt-5 space-y-2">{messages.map(message => <div key={message.id} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-dyson-text"><span className="mr-2 text-dyson-gold">Client</span>{message.text}</div>)}</div>}
      <form onSubmit={submit} className="mt-5 flex gap-2"><input disabled={!preferredClientActive} value={text} onChange={event => setText(event.target.value)} placeholder="Private team thread" className="min-w-0 flex-1 rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm text-dyson-text outline-none disabled:opacity-40" /><button type="submit" disabled={!preferredClientActive || !text.trim()} className="rounded-full bg-dyson-gold px-4 py-2 text-sm text-dyson-text-dark disabled:opacity-40">Send</button></form>
      <a href="tel:8583531200" className="mt-5 inline-block text-sm text-dyson-gold underline underline-offset-4">Call / Connect with Bob</a>
    </div>
  );
}