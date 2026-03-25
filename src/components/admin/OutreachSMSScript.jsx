import React, { useState } from 'react';
import { Copy, Check, MessageSquare, ExternalLink, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// The app's public URL for consumer landing page
const HOME_PAGE = window.location.origin + '/Home';

function buildScript(ownerName, propertyAddress) {
  const firstName = ownerName?.split(' ')[0] || 'there';
  return `Hi ${firstName} — We see you've listed ${propertyAddress}. Congrats!

We're Dyson & Dyson Corporate Relocation — 50 years helping executives navigate the ENTIRE move, not just the sale. Our AI concierge "Charlie" handles destination research, agent matching, schools, utilities & timing — at no cost to you.

Where are you planning to move? Charlie can pull a full AI report on your destination city — no obligation.

${APP_URL}/Home`;
}

function buildFollowUp(ownerName) {
  const firstName = ownerName?.split(' ')[0] || 'there';
  return `Hi ${firstName} — just following up from my earlier message! Moving out of the area can feel overwhelming, but that's exactly what we're here for.

Our relocation team + AI concierge Charlie handles everything on the destination side so you can focus on your sale. We've helped families relocate to dozens of cities across the country.

If you're heading out of state (or even across California), we'd love to help. Where are you planning to land?`;
}

export default function OutreachSMSScript({ campaign }) {
  const [copied, setCopied] = useState(null);
  const [activeScript, setActiveScript] = useState('initial');

  const ownerName = campaign?.owner_name || 'Owner';
  const propertyAddress = campaign?.property_address || 'your property';
  const ownerPhone = campaign?.owner_phone || '';

  const scripts = {
    initial: {
      label: 'Initial Outreach',
      text: buildScript(ownerName, propertyAddress),
    },
    followup: {
      label: 'Follow-Up (3 days)',
      text: buildFollowUp(ownerName),
    },
  };

  const currentText = scripts[activeScript].text;

  const handleCopy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const smsLink = ownerPhone
    ? `sms:${ownerPhone.replace(/\D/g, '')}?body=${encodeURIComponent(currentText)}`
    : null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-bold text-white">Outreach Script</span>
        <span className="ml-auto text-xs text-slate-400 font-mono">{ownerPhone || 'No phone on file'}</span>
      </div>

      {/* Script Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {Object.entries(scripts).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setActiveScript(key)}
            className={`flex-1 py-2 text-xs font-semibold transition-all ${
              activeScript === key
                ? 'bg-white border-b-2 border-amber-500 text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Script Body */}
      <div className="relative bg-white">
        <pre className="p-4 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
          {currentText}
        </pre>

        {/* Copy button */}
        <button
          onClick={() => handleCopy(currentText, 'script')}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
          title="Copy script"
        >
          {copied === 'script' ? (
            <Check className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
        {/* Open SMS app with pre-filled message */}
        {smsLink && (
          <a
            href={smsLink}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold text-sm text-black transition-all hover:opacity-90"
            style={{ background: '#D4AF37' }}
          >
            <Smartphone className="w-4 h-4" />
            Open in SMS App →
          </a>
        )}

        {/* Copy app link */}
        <button
          onClick={() => handleCopy(`${APP_URL}/Home`, 'link')}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold text-xs border border-slate-300 bg-white hover:bg-slate-50 transition-all text-slate-700"
        >
          {copied === 'link' ? (
            <><Check className="w-3.5 h-3.5 text-green-600" /> Link Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy App Link Only</>
          )}
        </button>

        <p className="text-xs text-center text-slate-400 mt-1">
          Script asks where they're relocating — qualifying out-of-area leads
        </p>
      </div>
    </div>
  );
}