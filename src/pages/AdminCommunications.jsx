import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone, Send, Trash2, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const STATUS_COLORS = {
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  bounced: 'bg-orange-100 text-orange-800',
  opened: 'bg-purple-100 text-purple-800',
};

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

// Group communications by recipient name
function groupByRecipient(communications) {
  const groups = {};
  communications.forEach(c => {
    const key = c.recipient_name;
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  });
  // Sort each thread by sent_date ascending
  Object.values(groups).forEach(thread =>
    thread.sort((a, b) => new Date(a.sent_date) - new Date(b.sent_date))
  );
  return groups;
}

export default function AdminCommunications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['communications'],
    queryFn: () => base44.entities.Communication.list('-sent_date', 500),
    initialData: [],
  });

  const sendMutation = useMutation({
    mutationFn: (data) => base44.entities.Communication.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communications'] });
      setNewMessage('');
      toast.success('Message sent');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Communication.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communications'] });
      toast.success('Message deleted');
    }
  });

  const filtered = communications.filter((c) => {
    const matchSearch =
      !searchTerm ||
      c.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.property_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.listing_agent_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || c.communication_type === typeFilter;
    return matchSearch && matchType;
  });

  const grouped = groupByRecipient(filtered);
  const recipients = Object.keys(grouped).sort();

  const thread = selectedRecipient ? (grouped[selectedRecipient] || []) : [];
  const threadContact = thread[0];

  const handleSend = () => {
    if (!newMessage.trim() || !threadContact) return;
    sendMutation.mutate({
      communication_type: threadContact.communication_type,
      recipient_name: threadContact.recipient_name,
      recipient_phone: threadContact.recipient_phone,
      recipient_email: threadContact.recipient_email,
      property_address: threadContact.property_address,
      listing_agent_name: threadContact.listing_agent_name,
      message_content: newMessage.trim(),
      sent_date: new Date().toISOString(),
      status: 'sent',
    });
  };

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 48px)' }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/Admin">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">Communication Log</h1>
            <p className="text-xs text-slate-500 mt-0.5">Click a contact to open their thread</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 h-8 text-sm"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Body: Two-column */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Contact List */}
        <div className="w-72 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
            </div>
          ) : recipients.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No communications yet
            </div>
          ) : (
            recipients.map(name => {
              const msgs = grouped[name];
              const latest = msgs[msgs.length - 1];
              const isSelected = selectedRecipient === name;
              return (
                <div
                  key={name}
                  onClick={() => setSelectedRecipient(name)}
                  className={`p-4 cursor-pointer border-b border-slate-100 flex items-start gap-3 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-amber-50 border-l-4 border-l-amber-400' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm text-slate-900 truncate">{name}</p>
                      <span className="text-xs text-slate-400 shrink-0 ml-1">{getTimeAgo(new Date(latest.sent_date))}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{latest.message_content}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${STATUS_COLORS[latest.status]}`}>{latest.status}</span>
                      <span className="text-xs text-slate-400">{msgs.length} msg{msgs.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-1" />
                </div>
              );
            })
          )}
        </div>

        {/* Right: Thread View */}
        {selectedRecipient ? (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* Thread Header */}
            <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div>
                <p className="font-bold text-slate-900">{selectedRecipient}</p>
                <p className="text-xs text-slate-500">
                  {threadContact?.communication_type === 'sms' ? threadContact.recipient_phone : threadContact?.recipient_email}
                  {threadContact?.property_address ? ` · ${threadContact.property_address}` : ''}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRecipient(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {thread.map((msg) => {
                const isOutbound = msg.role !== 'inbound';
                return (
                  <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`relative max-w-sm rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isOutbound ? 'bg-slate-800 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message_content}</p>
                      <div className={`flex items-center justify-between gap-3 mt-1 ${isOutbound ? 'text-slate-400' : 'text-slate-400'}`}>
                        <span className="text-xs">{getTimeAgo(new Date(msg.sent_date))}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${STATUS_COLORS[msg.status]}`}>{msg.status}</span>
                      </div>
                      {/* Delete button on hover */}
                      <button
                        onClick={() => {
                          if (confirm('Delete this message?')) deleteMutation.mutate(msg.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-600"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compose */}
            <div className="bg-white border-t border-slate-200 px-5 py-3 flex gap-2 shrink-0">
              <Textarea
                placeholder={`Send ${threadContact?.communication_type === 'sms' ? 'SMS' : 'email'} to ${selectedRecipient}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1 min-h-[60px] max-h-32 resize-none text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sendMutation.isPending}
                className="self-end gap-2 bg-slate-900 hover:bg-slate-800"
              >
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center text-slate-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">Select a contact to view their thread</p>
              <p className="text-sm mt-1">Click any name on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}