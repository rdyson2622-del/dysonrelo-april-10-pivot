import React from 'react';
import SubscriberInviteConsole from '@/components/admin/subscriber-invite/SubscriberInviteConsole';

export default function AdminSubscriberInvite() {
  return (
    <div className="w-full min-h-screen bg-[#070707] text-white">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="rounded-2xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden bg-[#0a0a0a]">
          <SubscriberInviteConsole />
        </div>
      </div>
    </div>
  );
}