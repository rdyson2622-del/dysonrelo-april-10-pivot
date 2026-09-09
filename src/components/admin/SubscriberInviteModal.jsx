import React from 'react';
import { X } from 'lucide-react';
import SubscriberInviteConsole from './subscriber-invite/SubscriberInviteConsole';

export default function SubscriberInviteModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/50 shadow-2xl bg-[#0a0a0a]"
        style={{
          boxShadow: '0 25px 60px -15px rgba(212,175,55,0.3)',
        }}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#181818] hover:bg-[#D4AF37] hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          title="Close Invite Suite"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Console Container */}
        <SubscriberInviteConsole onSentSuccess={() => {}} />
      </div>
    </div>
  );
}