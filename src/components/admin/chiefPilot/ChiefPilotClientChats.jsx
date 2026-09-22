import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Search, HelpCircle, Send, Pencil, Trash2, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ChiefPilotChatExplainer from './ChiefPilotChatExplainer';

export default function ChiefPilotClientChats() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [editText, setEditText] = useState('');
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['chief-pilot-client-chats'] });

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    const text = reply.trim();
    try {
      await base44.entities.ChatMessage.create({ client_id: selected.client?.id || undefined, role: 'user', content: text });
      const history = [...selected.messages.map(message => ({ role: message.role === 'user' ? 'user' : 'charlie', content: message.content })), { role: 'user', content: text }];
      const res = await base44.functions.invoke('copilotAsk', { messages: history });
      const answer = (res.data?.reply || 'I could not verify an answer from known data.').replace('[HANDOFF]', '').trim();
      await base44.entities.ChatMessage.create({ client_id: selected.client?.id || undefined, role: 'charlie', content: answer });
      setReply('');
      invalidate();
    } finally { setSending(false); }
  };

  const startEdit = message => { setEditingId(message.id); setEditText(message.content); };
  const saveEdit = async () => {
    const id = editingId;
    setEditingId('');
    await base44.entities.ChatMessage.update(id, { content: editText.trim() });
    invalidate();
  };
  const deleteMessage = async message => {
    await base44.entities.ChatMessage.delete(message.id);
    invalidate();
  };
  const deleteThread = async (event, thread) => {
    event.stopPropagation();
    if (!window.confirm('Delete this entire conversation?')) return;
    await Promise.all(thread.messages.map(message => base44.entities.ChatMessage.delete(message.id)));
    if (selectedId === thread.id) setSelectedId('');
    invalidate();
  };

  if (showExplainer) return <div className="flex h-full min-h-[560px] overflow-hidden rounded-xl border border-black/10 bg-dyson-cream"><ChiefPilotChatExplainer onBack={() => setShowExplainer(false)} /></div>;

  return <div className="flex h-full min-h-[560px] overflow-hidden rounded-xl border border-black/10 bg-dyson-cream text-dyson-text-dark">
    <aside className="w-80 shrink-0 border-r border-black/10 bg-dyson-warm-paper">
      <div className="border-b border-black/10 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dyson-gold-deep">Client conversations</p>
          <button type="button" onClick={() => setShowExplainer(true)} className="flex items-center gap-1 rounded-full border border-black/15 px-2.5 py-1 text-[10px] font-semibold text-dyson-text-dark/70 hover:border-dyson-gold-deep hover:text-dyson-gold-deep"><HelpCircle className="h-3 w-3" />How chat works</button>
        </div>
        <h2 className="mt-1 text-2xl font-semibold">Past &amp; current chats</h2>
        <p className="mt-1 text-xs text-dyson-text-dark/70">This is home for all your chats, requests, our responses, options and suggestions discussed.</p>
        <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-dyson-text-dark/50"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search clients" className="w-full rounded-full border border-black/15 bg-dyson-cream py-2.5 pl-10 pr-4 text-sm text-dyson-text-dark outline-none focus:border-dyson-gold-deep"/></div>
      </div>
      <div className="h-[440px] overflow-y-auto">{isLoading ? <p className="p-5 text-sm text-dyson-text-dark/60">Loading conversations…</p> : filtered.length === 0 ? <p className="p-5 text-sm text-dyson-text-dark/60">No client chats found.</p> : filtered.map(thread => { const name = thread.client?.full_name || thread.client?.email || 'Unknown client'; const latest = thread.messages.at(-1); return <button key={thread.id} type="button" onClick={() => setSelectedId(thread.id)} className={`group relative block w-full border-b border-black/10 p-4 text-left ${selectedId === thread.id ? 'bg-black/5' : 'hover:bg-black/[0.03]'}`}><span className="font-medium">{name}</span><span className="mt-1 block truncate pr-6 text-xs text-dyson-text-dark/60">{latest?.content}</span><span className="mt-2 flex items-center gap-2 text-[10px] text-dyson-gold-deep">{thread.messages.length} messages · {latest?.created_date ? new Date(latest.created_date).toLocaleDateString() : ''}{isSavedClient(thread.client) && <span className="rounded-full bg-dyson-gold-deep/15 px-1.5 py-0.5 text-dyson-gold-deep">Saved · Preferred Client</span>}</span><span onClick={event => deleteThread(event, thread)} className="absolute right-3 top-4 rounded-full p-1.5 text-red-500 opacity-0 hover:bg-black/5 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></span></button>; })}</div>
    </aside>
    <section className="flex min-w-0 flex-1 flex-col">
      {selected ? <>
        <header className="border-b border-black/10 px-6 py-5"><h3 className="text-lg font-semibold">{selected.client?.full_name || selected.client?.email || 'Unknown client'}</h3><p className="text-xs text-dyson-text-dark/60">Complete conversation history</p></header>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">{selected.messages.map(message => <div key={message.id} className={`group flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
          <div className={`relative max-w-[75%] rounded-2xl border px-4 py-3 text-sm ${message.role === 'user' ? 'border-black/10 bg-white' : 'border-dyson-gold-deep/30 bg-dyson-gold-deep/10'}`}>
            <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {editingId !== message.id && <button type="button" onClick={() => startEdit(message)} className="rounded-full bg-black/5 p-1 text-dyson-text-dark/60 hover:bg-black/10"><Pencil className="h-3 w-3" /></button>}
              <button type="button" onClick={() => deleteMessage(message)} className="rounded-full bg-black/5 p-1 text-red-500 hover:bg-black/10"><Trash2 className="h-3 w-3" /></button>
            </div>
            {editingId === message.id ? (
              <div className="pr-10">
                <textarea autoFocus value={editText} onChange={event => setEditText(event.target.value)} className="w-full resize-none rounded border border-black/15 bg-white p-2 text-sm text-dyson-text-dark outline-none" rows={3} />
                <div className="mt-1 flex items-center gap-2">
                  <button type="button" onClick={saveEdit} className="flex items-center gap-1 rounded-full bg-dyson-gold-deep px-2 py-1 text-[10px] font-semibold text-white"><Check className="h-3 w-3" />Save</button>
                  <button type="button" onClick={() => setEditingId('')} className="flex items-center gap-1 rounded-full border border-black/15 px-2 py-1 text-[10px] font-semibold text-dyson-text-dark/70"><X className="h-3 w-3" />Cancel</button>
                </div>
              </div>
            ) : <p className="pr-8">{message.content}</p>}
            <p className="mt-2 text-[10px] text-dyson-text-dark/50">{message.role === 'user' ? 'Client' : 'CoPilot'} · {new Date(message.created_date).toLocaleString()}</p>
          </div>
        </div>)}</div>
      </> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div><MessageCircle className="mx-auto h-10 w-10 text-dyson-gold-deep"/><h3 className="mt-4 text-lg font-semibold">Select a client conversation</h3><p className="mt-2 text-sm text-dyson-text-dark/60">Choose any past or current chat to see the full history.</p></div></div>}
      <div className="border-t border-black/10 p-4">
        <div className="flex items-center gap-2">
          <input value={reply} onChange={event => setReply(event.target.value)} onKeyDown={event => event.key === 'Enter' && sendReply()} disabled={!selected} placeholder={selected ? 'Continue this request…' : 'Select a conversation to continue a request'} className="flex-1 rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm text-dyson-text-dark outline-none focus:border-dyson-gold-deep disabled:opacity-50"/>
          <button type="button" onClick={sendReply} disabled={!selected || !reply.trim() || sending} className="flex items-center gap-1.5 rounded-full bg-dyson-gold-deep px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"><Send className="h-4 w-4"/>Send</button>
        </div>
      </div>
    </section>
  </div>;
}