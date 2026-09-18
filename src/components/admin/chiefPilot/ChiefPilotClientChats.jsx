import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ChiefPilotClientChats() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
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

  const filtered = threads.filter(thread => (thread.client?.full_name || thread.client?.email || 'Unknown client').toLowerCase().includes(search.toLowerCase()));
  const selected = threads.find(thread => thread.id === selectedId);

  return <div className="flex h-full min-h-[560px] overflow-hidden rounded-xl border border-white/10 bg-dyson-black text-white">
    <aside className="w-80 shrink-0 border-r border-white/10 bg-dyson-ink">
      <div className="border-b border-white/10 p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-dyson-gold">Client conversations</p><h2 className="mt-1 text-2xl font-semibold">Past & current chats</h2><div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-dyson-taupe"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search clients" className="w-full rounded-full border border-white/15 bg-dyson-black py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-dyson-gold"/></div></div>
      <div className="h-[440px] overflow-y-auto">{isLoading ? <p className="p-5 text-sm text-dyson-taupe">Loading conversations…</p> : filtered.length === 0 ? <p className="p-5 text-sm text-dyson-taupe">No client chats found.</p> : filtered.map(thread => { const name = thread.client?.full_name || thread.client?.email || 'Unknown client'; const latest = thread.messages.at(-1); return <button key={thread.id} type="button" onClick={() => setSelectedId(thread.id)} className={`block w-full border-b border-white/10 p-4 text-left ${selectedId === thread.id ? 'bg-white/10' : 'hover:bg-white/5'}`}><span className="font-medium">{name}</span><span className="mt-1 block truncate text-xs text-dyson-taupe">{latest?.content}</span><span className="mt-2 block text-[10px] text-dyson-gold">{thread.messages.length} messages · {latest?.created_date ? new Date(latest.created_date).toLocaleDateString() : ''}</span></button>; })}</div>
    </aside>
    <section className="flex min-w-0 flex-1 flex-col">{selected ? <><header className="border-b border-white/10 px-6 py-5"><h3 className="text-lg font-semibold">{selected.client?.full_name || selected.client?.email || 'Unknown client'}</h3><p className="text-xs text-dyson-taupe">Complete conversation history</p></header><div className="flex-1 space-y-3 overflow-y-auto p-6">{selected.messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[75%] rounded-2xl border px-4 py-3 text-sm ${message.role === 'user' ? 'border-white/10 bg-white/5' : 'border-dyson-gold/30 bg-dyson-gold/10'}`}><p>{message.content}</p><p className="mt-2 text-[10px] text-dyson-taupe">{message.role === 'user' ? 'Client' : 'CoPilot'} · {new Date(message.created_date).toLocaleString()}</p></div></div>)}</div></> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div><MessageCircle className="mx-auto h-10 w-10 text-dyson-gold"/><h3 className="mt-4 text-lg font-semibold">Select a client conversation</h3><p className="mt-2 text-sm text-dyson-taupe">Choose any past or current chat to see the full history.</p></div></div>}</section>
  </div>;
}