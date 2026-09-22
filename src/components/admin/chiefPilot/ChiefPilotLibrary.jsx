import React, { useEffect, useState } from 'react';
import { Search, Pencil, Trash2, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ChiefPilotHowItWorks from './ChiefPilotHowItWorks';
import ChiefPilotExampleFrame from './ChiefPilotExampleFrame';
import ChiefPilotPreferredClientExplainer from './ChiefPilotPreferredClientExplainer';

const STEPS = ['Save a discussion or property context to the private vault.', 'Search your chats and saved items any time from this page.', 'Keep client material separate from general news delivery.'];

export default function ChiefPilotLibrary({ items, onDeleteItem, onRenameItem, visitorId, isExample, onHideExample, onSearchOwn }) {
  const [search, setSearch] = useState('');
  const [showExplainer, setShowExplainer] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (!visitorId) return;
    let current = true;
    base44.functions.invoke('getVisitorChatHistory', { visitor_id: visitorId }).then(res => {
      if (!current) return;
      const raw = res.data?.messages || [];
      const pairs = [];
      for (let i = 0; i < raw.length; i++) {
        if (raw[i].data?.role === 'charlie' && raw[i + 1]?.data?.role === 'user') {
          pairs.push({ id: raw[i].id, userMessageId: raw[i + 1].id, title: raw[i + 1].data.content, answer: raw[i].data.content, createdAt: raw[i].created_date });
        }
      }
      setChatHistory(pairs);
    }).catch(() => {});
    return () => { current = false; };
  }, [visitorId]);

  const deleteChatHistoryEntry = async entry => {
    setChatHistory(current => current.filter(item => item.id !== entry.id));
    try {
      await Promise.all([base44.entities.ChatMessage.delete(entry.id), entry.userMessageId && base44.entities.ChatMessage.delete(entry.userMessageId)].filter(Boolean));
    } catch (_) {}
  };

  const startEdit = item => { setEditingId(item.id); setEditTitle(item.title || ''); };
  const saveEdit = () => { onRenameItem?.(editingId, editTitle.trim() || 'Saved discussion'); setEditingId(''); };

  const examples = [{ id: 'calle-pavana-story', title: '6228 Calle Pavana — Complete CoPilot Story', propertyAddress: '6228 Calle Pavana, San Diego, CA 92139', example: true }];
  const rows = isExample ? [...examples, ...items] : items;
  const filtered = rows.filter(item => (item.title || '').toLowerCase().includes(search.toLowerCase()) || (item.propertyAddress || '').toLowerCase().includes(search.toLowerCase()));

  if (showExplainer) return <ChiefPilotPreferredClientExplainer items={rows} onBack={() => setShowExplainer(false)} />;

  return (
    <div>
      <p className="text-xs tracking-wide text-dyson-gold">PREFERRED CLIENT PRIVATE VAULT</p>
      <h2 className="mt-2 text-2xl font-normal text-dyson-text-dark">My Library</h2>

      <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-dyson-text-dark/50"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your chats and saved items" className="w-full rounded-full border border-black/20 bg-dyson-warm-paper py-2.5 pl-10 pr-4 text-sm text-dyson-text-dark outline-none focus:border-dyson-gold-deep"/></div>

      <ChiefPilotExampleFrame isExample={isExample} purpose="Keep your work together in one private place." benefit="A Private Vault for searches, audits, road maps, and saved discussions." onHide={onHideExample} onSearchOwn={onSearchOwn} sample={<div className="mt-1 flex flex-wrap gap-3">{filtered.length ? filtered.map((item, index) => <div key={item.id || index} className="group relative min-w-[220px] flex-1 rounded-xl border border-black/20 bg-dyson-charcoal px-5 py-4">
        {!item.example && <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={() => startEdit(item)} className="rounded-full bg-white/10 p-1.5 text-dyson-gold hover:bg-white/20"><Pencil className="h-3 w-3" /></button>
          <button type="button" onClick={() => onDeleteItem?.(item.id)} className="rounded-full bg-white/10 p-1.5 text-red-400 hover:bg-white/20"><Trash2 className="h-3 w-3" /></button>
        </div>}
        {editingId === item.id ? (
          <div className="flex items-center gap-2 pr-14">
            <input autoFocus value={editTitle} onChange={event => setEditTitle(event.target.value)} onKeyDown={event => event.key === 'Enter' && saveEdit()} className="min-w-0 flex-1 rounded border border-white/20 bg-black/30 px-2 py-1 text-sm text-dyson-text outline-none" />
            <button type="button" onClick={saveEdit} className="text-dyson-gold"><Check className="h-4 w-4" /></button>
            <button type="button" onClick={() => setEditingId('')} className="text-dyson-taupe"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <p className="pr-14 text-sm text-dyson-text">{item.example && <span className="mr-2 text-[10px] text-dyson-gold">EXAMPLE · PUBLISHED</span>}{item.title || 'Saved discussion'}</p>
        )}
        {item.propertyAddress && <p className="mt-1 text-xs text-dyson-taupe">{item.propertyAddress}</p>}
      </div>) : <p className="py-6 text-sm text-dyson-taupe">No saved items yet.</p>}</div>} next={<><p>Claim Preferred Client status to keep your own Library.</p><button type="button" onClick={() => setShowExplainer(true)} className="mt-2 text-xs text-dyson-gold-deep underline underline-offset-4">What happens once I'm a Preferred Client?</button></>} />

      {chatHistory.length > 0 && (
        <div className="mt-8">
          <p className="text-xs tracking-wide text-dyson-text-dark/60">RECENT CHIEF PILOT CHATS</p>
          <div className="mt-2 space-y-3">
            {chatHistory.map(entry => (
              <div key={entry.id} className="group relative rounded-xl border border-black/15 bg-dyson-warm-paper px-4 py-3">
                <button type="button" onClick={() => deleteChatHistoryEntry(entry)} className="absolute right-3 top-3 rounded-full bg-black/5 p-1.5 text-red-500 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"><Trash2 className="h-3 w-3" /></button>
                <p className="pr-8 text-sm font-medium text-dyson-text-dark">{entry.title}</p>
                <p className="mt-1 text-xs leading-5 text-dyson-text-dark/70">{entry.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChiefPilotHowItWorks items={STEPS} />
    </div>
  );
}