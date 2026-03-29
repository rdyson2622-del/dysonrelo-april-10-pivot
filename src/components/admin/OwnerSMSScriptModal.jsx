import React, { useState } from 'react';
import { Copy, CheckCheck, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OwnerSMSScriptModal({ owner, onClose }) {
  const [copied, setCopied] = React.useState(false);

  const firstName = owner?.owner_name ? owner.owner_name.split(' ')[0] : 'there';
  const appLink = 'https://dysonrelo.com';

  const message = `Hi ${firstName}, this is Dyson & Dyson Concierge Relocation. We noticed your home is listed — are you planning to relocate? We offer a FREE concierge service to find your next home & manage your entire move. Learn more: ${appLink} — Reply YES or call Bob at (858) 353-1200. Reply STOP to opt out.`;

  const copy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-bold text-slate-900 text-sm">SMS Script</p>
              <p className="text-xs text-slate-500">{owner?.owner_name} · {owner?.phone}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Message Preview */}
        <div className="p-6">
          <div className="rounded-2xl bg-slate-900 text-white text-sm leading-relaxed p-5 whitespace-pre-wrap font-mono">
            {message}
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span>{message.length} characters</span>
            <span>{Math.ceil(message.length / 160)} SMS segment{Math.ceil(message.length / 160) > 1 ? 's' : ''}</span>
          </div>

          {/* Link callout */}
          <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
            <span className="font-bold">App link included:</span> <span className="font-mono">{appLink}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button onClick={copy} className="flex-1 gap-2 bg-slate-900 hover:bg-slate-700 text-white">
            {copied ? <><CheckCheck className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Script</>}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
        </div>
      </div>
    </div>
  );
}