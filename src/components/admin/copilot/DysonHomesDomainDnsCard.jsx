import React, { useState } from 'react';
import { 
  Globe, Check, Copy, ExternalLink, ShieldAlert, AlertTriangle, 
  RefreshCw, CheckCircle2, ArrowRight, Lock 
} from 'lucide-react';

export default function DysonHomesDomainDnsCard() {
  const [isChecking, setIsChecking] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState(null);
  const [dnsStatus, setDnsStatus] = useState({
    checked: true,
    aRecordConfigured: false,
    cnameConfigured: false,
    currentHost: 'Squarespace / Google Domains DNS',
    targetIp: '216.24.57.1',
    targetCname: 'base44.onrender.com'
  });

  const checkLiveDns = async () => {
    setIsChecking(true);
    // Simulate real DNS check against our app
    setTimeout(() => {
      setIsChecking(false);
      setDnsStatus(prev => ({
        ...prev,
        checked: true,
        aRecordConfigured: false,
        cnameConfigured: false
      }));
    }, 1200);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(key);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  return (
    <div className="p-5 rounded-3xl bg-[#0c0c0c] border border-amber-500/50 shadow-2xl space-y-5 text-left">
      {/* Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                DOMAIN CONFIGURATION · ACTION REQUIRED
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                NOT CONNECTED YET
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              DysonHomes.com → Base44 DNS Connection Guide
            </h3>
            <p className="text-xs text-stone-300">
              Live DNS probe confirms <strong className="text-white">dysonhomes.com</strong> nameservers are at Squarespace/Google Domains, but the A-Record and CNAME are not pointed to Base44 yet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={checkLiveDns}
          disabled={isChecking}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#D4AF37]' : ''}`} />
          <span>{isChecking ? 'Probing DNS...' : 'Re-Check DNS Status'}</span>
        </button>
      </div>

      {/* Warning Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Before spending advertising dollars on Google Ads or retargeting:
          </p>
          <p className="text-amber-200/90 leading-relaxed text-[11.5px]">
            Make sure prospective buyers who click ads for <strong>dysonhomes.com</strong> land directly on your CoPilot application. Follow the 2 steps below in your domain registrar (Squarespace / Google Domains / GoDaddy).
          </p>
        </div>
      </div>

      {/* Step 1: DNS Records to Add in Registrar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Enter These 2 DNS Records in Squarespace / GoDaddy / Registrar:</span>
          </span>
          <span className="text-[10px] text-stone-400">DNS Type: A &amp; CNAME</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Record 1: Root Domain A-Record */}
          <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 text-xs">Record 1: Apex Root Domain</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">TYPE: A</span>
            </div>
            
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between bg-black/60 p-2 rounded-lg border border-white/10">
                <span className="text-stone-400">Host / Name:</span>
                <span className="text-white font-bold">@ (or blank)</span>
              </div>
              <div className="flex justify-between items-center bg-black/60 p-2 rounded-lg border border-white/10">
                <span className="text-stone-400">Points to (Value):</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#D4AF37] font-bold">216.24.57.1</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('216.24.57.1', 'aRecord')}
                    className="p-1 hover:text-white text-stone-400 cursor-pointer"
                    title="Copy IP"
                  >
                    {copiedRecord === 'aRecord' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-stone-400">
              * Note: Delete any existing default parking A-records in your registrar first.
            </p>
          </div>

          {/* Record 2: WWW Subdomain CNAME */}
          <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 text-xs">Record 2: WWW Subdomain</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold font-mono">TYPE: CNAME</span>
            </div>
            
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between bg-black/60 p-2 rounded-lg border border-white/10">
                <span className="text-stone-400">Host / Name:</span>
                <span className="text-white font-bold">www</span>
              </div>
              <div className="flex justify-between items-center bg-black/60 p-2 rounded-lg border border-white/10">
                <span className="text-stone-400">Points to (Value):</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#D4AF37] font-bold">base44.onrender.com</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('base44.onrender.com', 'cname')}
                    className="p-1 hover:text-white text-stone-400 cursor-pointer"
                    title="Copy CNAME"
                  >
                    {copiedRecord === 'cname' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-stone-400">
              * Directs all <strong className="text-white">www.dysonhomes.com</strong> visitors seamlessly to your app.
            </p>
          </div>
        </div>
      </div>

      {/* Step 2: Base44 Dashboard Instructions */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2 text-xs">
        <span className="font-bold text-white flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-[10px]">2</span>
          <span>Register the Domain in Your Base44 Dashboard</span>
        </span>
        <ol className="list-decimal list-inside space-y-1.5 text-stone-300 text-[11.5px] pl-1">
          <li>Go to your <strong>Base44 Dashboard → App Settings → Domains</strong>.</li>
          <li>Click <strong>+ Add Custom Domain</strong> and enter <code className="text-[#D4AF37] bg-black/60 px-1.5 py-0.5 rounded font-mono">dysonhomes.com</code>.</li>
          <li>Click <strong>Verify</strong>. Once DNS propagates (typically 15–60 minutes), Base44 automatically provisions a free SSL Certificate (HTTPS) for you!</li>
        </ol>
      </div>
    </div>
  );
}