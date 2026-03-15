import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone, Calendar, MapPin, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  bounced: 'bg-orange-100 text-orange-800',
  opened: 'bg-purple-100 text-purple-800',
};

const STATUS_ICONS = {
  sent: Clock,
  delivered: CheckCircle2,
  failed: AlertCircle,
  bounced: AlertCircle,
  opened: CheckCircle2,
};

export default function AdminCommunications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['communications'],
    queryFn: () => base44.entities.Communication.list('-sent_date', 500),
    initialData: [],
  });

  const filtered = communications.filter((comm) => {
    const matchSearch =
      !searchTerm ||
      comm.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.listing_agent_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || comm.communication_type === typeFilter;
    const matchStatus = statusFilter === 'all' || comm.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="px-6 py-4">
          <Link to="/Admin">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">Communication Log</h1>
            <p className="text-xs text-slate-500 mt-1">All SMS and email communications with property owners</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name, property, or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="opened">Opened</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="bounced">Bounced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-lg bg-white border border-slate-200">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-medium text-slate-900">No communications found</p>
            <p className="text-sm text-slate-500 mt-1">Communications will appear here as SMS and emails are sent</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((comm, idx) => {
              const StatusIcon = STATUS_ICONS[comm.status];
              const sentDate = new Date(comm.sent_date);
              const timeAgo = getTimeAgo(sentDate);

              return (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Type & Status */}
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-lg bg-slate-100">
                        {comm.communication_type === 'sms' ? (
                          <Phone className="w-4 h-4 text-slate-600" />
                        ) : (
                          <Mail className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">{comm.communication_type}</p>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1 ${STATUS_COLORS[comm.status]}`}>
                          {comm.status}
                        </span>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Recipient</p>
                      <p className="font-medium text-sm text-slate-900">{comm.recipient_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {comm.communication_type === 'sms' ? comm.recipient_phone : comm.recipient_email}
                      </p>
                    </div>

                    {/* Property */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property</p>
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-900">{comm.property_address}</p>
                      </div>
                      {comm.listing_agent_name && (
                        <p className="text-xs text-slate-500 mt-1">Agent: {comm.listing_agent_name}</p>
                      )}
                    </div>

                    {/* Message Preview */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</p>
                      <p className="text-sm text-slate-700 line-clamp-2">{comm.message_content}</p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500">{sentDate.toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{timeAgo}</p>
                      <div className="flex gap-1 mt-3">
                        {comm.notes && (
                          <Button variant="ghost" size="sm" title={comm.notes} className="h-7 text-xs">
                            📝
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

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