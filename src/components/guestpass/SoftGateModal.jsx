import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * SoftGateModal — the "claim your portal" hook shown when a prospect clicks
 * a live action inside a Guest Pass sandbox. claimUrl is where "Claim My
 * Portal" sends them.
 */
export default function SoftGateModal({ open, onClose, claimUrl = '/agent-subscribe' }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-base">
            <Lock className="w-4 h-4" style={{ color: GOLD }} /> Preview Environment
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-white/70 leading-relaxed">
          This is a preview environment. To submit a live referral and activate your fee protection guarantee, claim your free Agent Portal.
        </p>
        <a
          href={claimUrl}
          className="block text-center mt-2 px-4 py-3 rounded-xl text-sm font-bold"
          style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
        >
          Claim My Portal
        </a>
      </DialogContent>
    </Dialog>
  );
}