import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone, Send, Trash2, X, ChevronRight, Bell, User, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const GOLD = '#D4AF37';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Merge Communications + ChatMessages into unified threads keyed by contact name/id
function buildThreads(comms, chatMessages, clients) {
  const clientMap = {};
  clients.forEach(c => { clientMap[c.id] = c; });

  const threads = {};

  // Communications (SMS/email from admin → client or inbound)
  comms.forEach(c => {
    const key = c.recipient_name || 'Unknown';
    if (!threads[key]) threads[key] = { name: key, phone: c.recipient_phone, email: c.recipient_email, messages: [], source: 'comm', clientId: c.listing_owner_id };
    threads[key].messages.push({
      id: c.id,
      content: c.message_content,
      date: c.sent_date,
      type: c.communication_type,
      direction: c.role === 'inbound' ? 'inbound' : 'outbound',
      status: c.status,
      source: 'comm',
    });
  });

  // ChatMessages (client ↔ Charlie)
  chatMessages.forEach(m => {
    const client = clientMap[m.client_id];
    const key = client ? client.full_name : (m.client_id ? `Client ${m.client_id.slice(0, 6)}` : 'Unknown');
    if (!threads[key]) threads[key] = { name: key, phone: client?.phone, email: client?.email, messages: [], source: 'chat', clientId: m.client_id };
    threads[key].messages.push({
      id: m.id,
      content: m.content,
      date: m.created_date,
      type: 'chat',
      direction: m.role === 'user' ? 'inbound' : 'outbound',
      status: 'delivered',
      source: 'chat',
    });
  });

  // Sort messages within each thread
  Object.values(threads).forEach(t => t.messages.sort((a, b) => new Date(a.date) - new Date(b.date)));

  return threads;
}

export default function AdminCommunications() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: comms = [] } = useQuery({
    queryKey: ['comms-all'],
    queryFn: () => base44.entities.Communication.list('-sent_date', 500),
  });

  const { data: chatMessages = [] } = useQuery({
    queryKey: ['chat-messages-all'],
    queryFn: () => base44.entities.ChatMessage.list('-created_date', 500),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['all-clients-comm'],
    queryFn: () => base44.entities.RelocationClient.list('-created_date', 200),
  });

  // Real-time new message alerts
  useEffect(() => {
    const unsub = base44.entities.ChatMessage.subscribe((event) => {
      if (event.type === 'create' && event.data?.role === 'user') {
        queryClient.invalidateQueries({ queryKey: ['chat-messages-all'] });
        toast({ title: '💬 New client message!', description: event.data.content?.slice(0, 80) });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = base44.entities.Communication.subscribe((event) => {
      if (event.type === 'create') {
        queryClient.invalidateQueries({ queryKey: ['comms-all'] });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected, comms, chatMessages]);

  const threads = buildThreads(comms, chatMessages, clients);

  const filteredKeys = Object.keys(threads).filter(key => {
    const t = threads[key];
    const matchSearch = !search || key.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all'
      || (typeFilter === 'sms' && t.messages.some(m => m.type === 'sms'))
      || (typeFilter === 'email' && t.messages.some(m => m.type === 'email'))
      || (typeFilter === 'chat' && t.messages.some(m => m.type === 'chat'));
    return matchSearch && matchType;
  }).sort((a, b) => {
    const aLast = threads[a].messages[threads[a].messages.length - 1]?.date || '';
    const bLast = threads[b].messages[threads[b].messages.length - 1]?.date || '';
    return new Date(bLast) - new Date(aLast);
  });

  const thread = selected ? threads[selected] : null;

  const handleSend = async () => {
    if (!newMessage.trim() || !thread) return;
    setSending(true);
    try {
      const isSMS = thread.phone && (thread.source === 'comm' || typeFilter === 'sms');

      if (isSMS && thread.phone) {
        // Send real SMS via Twilio
        await base44.functions.invoke('sendOwnerOutreachSMS', {
          phone: thread.phone,
          message: newMessage,
          owner_name: thread.name,
        });
      } else if (thread.email) {
        // Send email
        await base44.integrations.Core.SendEmail({
          to: thread.email,
          subject: `Message from Dyson & Dyson Relocation`,
          body: newMessage,
          from_name: 'Bob Dyson — Dyson & Dyson Relocation',
        });
      }

      // If this is a chat thread, also post reply as admin role so client sees it
      if (thread.source === 'chat' && thread.clientId) {
        await base44.entities.ChatMessage.create({
          client_id: thread.clientId,
          role: 'admin',
          content: newMessage,
          message_type: 'text',
        });
      }

      // Log it
      await base44.entities.Communication.create({
        communication_type: isSMS && thread.phone ? 'sms' : 'email',
        recipient_name: thread.name,
        recipient_phone: thread.phone,
        recipient_email: thread.email,
        property_address: 'Relocation Client',
        listing_owner_id: thread.clientId,
        message_content: newMessage,
        sent_date: new Date().toISOString(),
        status: 'sent',
      });

      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['comms-all'] });
      toast({ title: 'Message sent!' });
    } catch (e) {
      toast({ title: 'Send failed', description: e.message, variant: 'destructive' });
    }
    setSending(false);
  };

  const inboundCount = Object.values(threads).reduce((n, t) => n + t.messages.filter(m => m.direction === 'inbound').length, 0);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 48px)', background: '#0a0a0a' }}>

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0"
        style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <Link to="/admin">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white">Communication Hub</h1>
              {inboundCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                  {inboundCount} inbound
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              SMS · Email · Charlie Chat — all in one place · Real-time alerts active
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-40 h-8 rounded-full px-3 text-xs"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="h-8 rounded-full px-3 text-xs"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}>
            <option value="all">All</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="chat">Chat</option>
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: contact list */}
        <div className="w-72 shrink-0 overflow-y-auto" style={{ borderRight: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d' }}>
          {filteredKeys.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No conversations yet</p>
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Messages from clients will appear here in real-time
              </p>
            </div>
          ) : filteredKeys.map(key => {
            const t = threads[key];
            const last = t.messages[t.messages.length - 1];
            const unread = t.messages.filter(m => m.direction === 'inbound').length;
            const isSelected = selected === key;
            return (
              <div key={key} onClick={() => setSelected(key)}
                className="p-4 cursor-pointer flex items-start gap-3 transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${GOLD}` : '3px solid transparent',
                }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background: 'rgba(255,255,255,0.08)', color: isSelected ? GOLD : 'rgba(255,255,255,0.5)' }}>
                  {key.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate" style={{ color: isSelected ? GOLD : '#fff' }}>{key}</p>
                    <span className="text-[10px] shrink-0 ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {last ? timeAgo(last.date) : ''}
                    </span>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {last?.content?.slice(0, 50) || 'No messages'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {/* Type badges */}
                    {[...new Set(t.messages.map(m => m.type))].map(typ => (
                      <span key={typ} className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                        style={{
                          background: typ === 'sms' ? 'rgba(34,197,94,0.15)' : typ === 'email' ? 'rgba(96,165,250,0.15)' : 'rgba(167,139,250,0.15)',
                          color: typ === 'sms' ? '#22c55e' : typ === 'email' ? '#60a5fa' : '#a78bfa',
                        }}>
                        {typ}
                      </span>
                    ))}
                    {unread > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black ml-auto"
                        style={{ background: '#ef4444', color: '#fff' }}>
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: thread */}
        {thread ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Thread header */}
            <div className="px-5 py-3 flex items-center justify-between shrink-0"
              style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="font-bold text-white">{thread.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {thread.phone && (
                    <a href={`tel:${thread.phone}`} className="flex items-center gap-1 text-xs hover:underline" style={{ color: '#22c55e' }}>
                      <Phone className="w-3 h-3" /> {thread.phone}
                    </a>
                  )}
                  {thread.email && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#60a5fa' }}>
                      <Mail className="w-3 h-3" /> {thread.email}
                    </span>
                  )}
                  {thread.clientId && (
                    <Link to={`/admin/client-detail?id=${thread.clientId}`}
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(212,175,55,0.15)', color: GOLD }}>
                      View Full Profile →
                    </Link>
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ background: '#0a0a0a' }}>
              {thread.messages.map(msg => {
                const isOut = msg.direction === 'outbound';
                return (
                  <div key={msg.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-sm">
                      {/* Direction label */}
                      <div className={`flex items-center gap-1 mb-1 ${isOut ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[9px] font-bold uppercase"
                          style={{ color: msg.type === 'sms' ? '#22c55e' : msg.type === 'email' ? '#60a5fa' : '#a78bfa' }}>
                          {msg.type}
                        </span>
                        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>· {timeAgo(msg.date)}</span>
                      </div>
                      <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                        style={{
                          background: isOut ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.07)',
                          border: isOut ? `1px solid rgba(212,175,55,0.3)` : '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          borderBottomRightRadius: isOut ? 4 : undefined,
                          borderBottomLeftRadius: !isOut ? 4 : undefined,
                        }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Compose */}
            <div className="px-5 py-3 flex gap-3 items-end shrink-0"
              style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Reply to ${thread.name} via ${thread.phone ? 'SMS' : 'email'}...`}
                rows={2}
                className="flex-1 rounded-xl px-4 py-3 text-sm resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              />
              <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-40 shrink-0"
                style={{ background: GOLD, color: '#000' }}>
                <Send className="w-4 h-4" />
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <div className="text-center max-w-sm">
              <MessageCircle className="w-14 h-14 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.1)' }} />
              <p className="font-bold text-white mb-2">Communication Hub</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                All SMS, email, and Charlie chat conversations in one place. Select a contact to reply instantly.
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <span className="text-xs" style={{ color: '#22c55e' }}>Real-time alerts active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}