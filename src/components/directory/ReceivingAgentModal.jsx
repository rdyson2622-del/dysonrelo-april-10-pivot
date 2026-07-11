import React from 'react';
import { X, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * ReceivingAgentModal — placeholder for the "I Am a Referral Receiving Agent" path.
 * Content to be filled in later.
 */
export default function ReceivingAgentModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
            Referral Receiving Agent
          </p>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:opacity-70" style={{ color: GOLD }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-10 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
            <ArrowRight className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <p className="text-sm font-bold text-white mb-2">Details coming soon</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Information for referral receiving agents will be added here shortly.
          </p>
        </div>
      </div>
    </div>
  );
}