import React, { useState } from 'react';
import { Copy, CheckCheck, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

function buildScripts(owner) {
  const firstName = owner?.owner_name ? owner.owner_name.split(' ')[0] : 'there';
  const appLink = 'https://dysonrelo.com';

  return [
    {
      label: 'SMS #1',
      tag: 'Initial Outreach',
      dayLabel: 'Send immediately',
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      message: `Hi ${firstName}, this is Dyson & Dyson Concierge Relocation. We noticed your home is listed — are you planning to relocate? We offer a FREE concierge service to find your next home & manage your entire move. Learn more: ${appLink} — Reply YES or call Bob at (858) 353-1200. Reply STOP to opt out.`,
    },
    {
      label: 'SMS #2',
      tag: 'Day 3 Follow-Up',
      dayLabel: 'Send on Day 3 if no reply',
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
      message: `Hi ${firstName} — just following up! Dyson & Dyson Concierge Relocation here. Our AI concierge Charlie can research your destination city, build a move plan, and match you with a top local agent — all FREE. Thousands of families have used us. Interested? Reply YES or visit ${appLink}. Reply STOP to opt out.`,
    },
    {
      label: 'SMS #3',
      tag: 'Day 7 Last Touch',
      dayLabel: 'Send on Day 7 if still no reply',
      color: 'bg-slate-700',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200',
      bgColor: 'bg-slate-50',
      message: `Hi ${firstName}, last message from us — Dyson & Dyson Relocation. If your plans change and you need help finding your next home, our concierge service is completely FREE to you. We'd love to help. Visit ${appLink} or call Bob at (858) 353-1200 anytime. Best of luck with the sale! Reply STOP to opt out.`,
    },
  ];
}

export default function OwnerSMSScriptModal({ owner, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const scripts = buildScripts(owner);
  const script = scripts[activeIdx];

  const copy = () => {
    navigator.clipboard.writeText(script.message);
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
              <p className="font-bold text-slate-900 text-sm">SMS Scripts — 3-Touch Sequence</p>
              <p className="text-xs text-slate-500">{owner?.owner_name} · {owner?.phone}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {scripts.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); setCopied(false); }}
              className={`flex-1 py-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                i === activeIdx
                  ? `border-slate-900 text-slate-900 bg-slate-50`
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {s.label}
              <span className={`block text-[10px] font-normal mt-0.5 ${i === activeIdx ? 'text-slate-500' : 'text-slate-300'}`}>
                {s.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Day label */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${script.bgColor} ${script.textColor} border ${script.borderColor}`}>
            ⏱ {script.dayLabel}
          </div>

          {/* Message bubble */}
          <div className="rounded-2xl bg-slate-900 text-white text-sm leading-relaxed p-5 whitespace-pre-wrap font-mono">
            {script.message}
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span>{script.message.length} characters</span>
            <span>{Math.ceil(script.message.length / 160)} SMS segment{Math.ceil(script.message.length / 160) > 1 ? 's' : ''}</span>
          </div>

          <div className={`mt-4 rounded-xl px-4 py-3 text-sm border ${script.bgColor} ${script.borderColor} ${script.textColor}`}>
            <span className="font-bold">Link included:</span> <span className="font-mono">dysonrelo.com</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button onClick={copy} className="flex-1 gap-2 bg-slate-900 hover:bg-slate-700 text-white">
            {copied ? <><CheckCheck className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy {script.label}</>}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
        </div>
      </div>
    </div>
  );
}