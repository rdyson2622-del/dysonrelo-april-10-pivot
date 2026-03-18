import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { User, Sparkles, MessageCircle, CheckSquare, Phone, Mic } from 'lucide-react';

import ClientHeader from '@/components/admin/client-detail/ClientHeader';
import ClientProfileTab from '@/components/admin/client-detail/ClientProfileTab';
import ClientGeminiTab from '@/components/admin/client-detail/ClientGeminiTab';
import ClientChatTab from '@/components/admin/client-detail/ClientChatTab';
import ClientTasksTab from '@/components/admin/client-detail/ClientTasksTab';
import ClientQuickContact from '@/components/admin/client-detail/ClientQuickContact';
import ClientSessionMonitor from '@/components/admin/client-detail/ClientSessionMonitor';

const GOLD = '#D4AF37';

const TABS = [
  { id: 'profile',  label: 'Profile',        icon: User },
  { id: 'gemini',   label: 'AI / Gemini',    icon: Sparkles },
  { id: 'session',  label: 'Live Session',   icon: Mic },
  { id: 'chat',     label: 'Chat History',   icon: MessageCircle },
  { id: 'tasks',    label: 'Move Tasks',     icon: CheckSquare },
  { id: 'contact',  label: 'Quick Contact',  icon: Phone },
];

export default function AdminClientDetail() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');

  const { data: client, isLoading } = useQuery({
    queryKey: ['relocation-client', clientId],
    queryFn: () => base44.entities.RelocationClient.filter({ id: clientId }),
    select: (data) => data[0],
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center" style={{ background: '#A9A9A9' }}>
        <div className="w-8 h-8 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 min-h-screen" style={{ background: '#A9A9A9' }}>
        <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.85)' }}>
          <p className="font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Client not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: '#A9A9A9' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header card with contact info + status */}
        <ClientHeader client={client} />

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.12)' }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#000' : 'rgba(0,0,0,0.55)',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: active ? GOLD : 'inherit' }} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
          {activeTab === 'profile'  && <ClientProfileTab client={client} />}
          {activeTab === 'gemini'   && <ClientGeminiTab client={client} />}
          {activeTab === 'session'  && <ClientSessionMonitor client={client} />}
          {activeTab === 'chat'     && <ClientChatTab client={client} />}
          {activeTab === 'tasks'    && <ClientTasksTab client={client} />}
          {activeTab === 'contact'  && <ClientQuickContact client={client} />}
        </motion.div>
      </motion.div>
    </div>
  );
}