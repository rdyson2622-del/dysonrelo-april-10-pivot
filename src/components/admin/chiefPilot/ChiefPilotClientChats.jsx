import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Search, HelpCircle, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ChiefPilotChatExplainer from './ChiefPilotChatExplainer';

export default function ChiefPilotClientChats() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({ queryKey: ['chief-pilot-client-chats'], queryFn: () => base44.entities.ChatMessage.list('-created_date', 500) });
  const { data: clients = [] } = useQuery({ queryKey: ['chief-pilot-chat-clients'], queryFn: () => base44.entities.RelocationClient.list('-created_date', 300) });

  useEffect(() => base44.entities.ChatMessage.subscribe(() => queryClient.invalidateQueries({ queryKey: ['chief-pilot-client-chats'] })), [queryClient]);

  const threads = useMemo(() => {
    const clientMap = Object.fromEntries(clients.map(client => [client.id, client]));
    const grouped = messages.reduce((result, message) => {
      const id = message.client_id || message.created_by_id || 'unknown';
      if (!result[id]) result[id] = { id, client: clientMap[message.client_id], messages: [] };
      result[id].messages.push(message);
      return result;
    }, {});
    return Object.values(grouped).map(thread => ({ ...thread, messages: thread.messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)) })).sort((a, b) => new Date(b.messages.at(-1)?.created_date) - new Date(a.messages.at(-1)?.created_date));
  }, [clients, messages]);

  const isSavedClient = client => Boolean(client?.full_name && (client?.email || client?.phone));
  const filtered = threads.filter(thread => (thread.client?.full_name || thread.client?.email || 'Unknown client').toLowerCase().includes(search.toLowerCase()));
  const selected = threads.find(thread => thread.id === selectedId);

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    try {
      await base44.entities.ChatMessage.create({ client_id: selected.client?.id || undefined, role: 'charlie', content: reply.trim() });
      setReply('');
      queryClient.invalidateQueries({ queryKey: ['chief-pilot-client-chats'] });
    } finally { setSending(false); }
  };

  if (showExplainer) return <div className="flex h-full min-h-[560px] overflow-hidden rounded-xl border border-white/10 bg-dyson-black"><ChiefPilotChatExplainer onBack={() => setShowExplainer(false)} /></div>;

  return <div className="flex h-full min-h-[560px] overflow-hidden rounded-xl border border-white/10 bg-dyson-black text-white">
    <aside className="w-80 shrink-0 border-r border-white/10 bg-dyson-ink">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dyson-gold">Client conversations</p>
          <button type="button" onClick={() => setShowExplainer(true)} className="flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-dyson-taupe hover:border-dyson-gold hover:text-dyson-gold"><HelpCircle className="h-3 w-3" />How chat works</button>
        </div>
        <h2 className="mt-1 text-2xl font-semibold">Past &amp; current chats</h2>
        <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-dyson-taupe"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search clients" className="w-full rounded-full border border-white/15 bg-dyson-black py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-dyson-gold"/></div>
      </div>
      <div className="h-[440px] overflow-y-auto">{isLoading ? <p className="p-5 text-sm text-dyson-taupe">Loading conversations…</p> : filtered.length === 0 ? <p className="p-5 text-sm text-dyson-taupe">No client chats found.</p> : filtered.map(thread => { const name = thread.client?.full_name || thread.client?.email || 'Unknown client'; const latest = thread.messages.at(-1); return <button key={thread.id} type="button" onClick={() => setSelectedId(thread.id)} className={`block w-full border-b border-white/10 p-4 text-left ${selectedId === thread.id ? 'bg-white/10' : 'hover:bg-white/5'}`}><span className="font-medium">{name}</span><span className="mt-1 block truncate text-xs text-dyson-taupe">{latest?.content}</span><span className="mt-2 flex items-center gap-2 text-[10px] text-dyson-gold">{thread.messages.length} messages · {latest?.created_date ? new Date(latest.created_date).toLocaleDateString() : ''}{isSavedClient(thread.client) && <span className="rounded-full bg-dyson-gold/15 px-1.5 py-0.5 text-dyson-gold">Saved · Preferred Client</span>}</span></button>; })}</div>
    </aside>
    <section className="flex min-w-0 flex-1 flex-col">
      {selected ? <>
        <header className="border-b border-white/10 px-6 py-5"><h3 className="text-lg font-semibold">{selected.client?.full_name || selected.client?.email || 'Unknown client'}</h3><p className="text-xs text-dyson-taupe">Complete conversation history</p></header>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">{selected.messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[75%] rounded-2xl border px-4 py-3 text-sm ${message.role === 'user' ? 'border-white/10 bg-white/5' : 'border-dyson-gold/30 bg-dyson-gold/10'}`}><p>{message.content}</p><p className="mt-2 text-[10px] text-dyson-taupe">{message.role === 'user' ? 'Client' : 'CoPilot'} · {new Date(message.created_date).toLocaleString()}</p></div></div>)}</div>
      </> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div><MessageCircle className="mx-auto h-10 w-10 text-dyson-gold"/><h3 className="mt-4 text-lg font-semibold">Select a client conversation</h3><p className="mt-2 text-sm text-dyson-taupe">Choose any past or current chat to see the full history.</p></div></div>}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2">
          <input value={reply} onChange={event => setReply(event.target.value)} onKeyDown={event => event.key === 'Enter' && sendReply()} disabled={!selected} placeholder={selected ? 'Continue this request…' : 'Select a conversation to continue a request'} className="flex-1 rounded-full border border-white/15 bg-dyson-ink px-4 py-2.5 text-sm text-white outline-none focus:border-dyson-gold disabled:opacity-50"/>
          <button type="button" onClick={sendReply} disabled={!selected || !reply.trim() || sending} className="flex items-center gap-1.5 rounded-full bg-dyson-gold px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40"><Send className="h-4 w-4"/>Send</button>
        </div>
      </div>
    </section>
  </div>;
}