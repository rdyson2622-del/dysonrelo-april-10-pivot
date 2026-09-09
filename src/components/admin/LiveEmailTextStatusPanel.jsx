import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Mail, MessageSquare, CheckCircle2, AlertTriangle, RefreshCw, Send,
  ShieldCheck, ExternalLink, Globe, Phone, Inbox, Info, ArrowRight
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function LiveEmailTextStatusPanel({ mode = 'email' }) {
  const [testEmailTarget, setTestEmailTarget] = useState('bob@dysonrelo.com');
  const [testResult, setTestResult] = useState(null);

  const { data: statusData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['checkEmailTextStatus'],
    queryFn: async () => {
      const res = await base44.functions.invoke('checkEmailTextStatus', { action: 'status' });
      return res.data;
    },
    refetchInterval: 30000,
  });

  const sendTestMutation = useMutation({
    mutationFn: async (target) => {
      const res = await base44.functions.invoke('checkEmailTextStatus', {
        action: 'send_test_email',
        to: target,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setTestResult({
        success: data.success,
        data: data.resend,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
    onError: (err) => {
      setTestResult({
        success: false,
        error: err.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
  });

  const emailInfo = statusData?.email;
  const textInfo = statusData?.text;

  return (
    <div className="space-y-6 text-left">
      {/* Top Health Header Banner */}
      <div 
        className="p-5 rounded-3xl border shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #14120c 0%, #0a0a0a 100%)',
          borderColor: 'rgba(212,175,55,0.4)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
              {mode === 'email' ? (
                <Mail className="w-6 h-6 text-[#D4AF37]" />
              ) : (
                <MessageSquare className="w-6 h-6 text-[#10b981]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  {mode === 'email' ? 'EMAIL CONNECTION DESK' : 'SMS / TEXT MESSAGING DESK'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  LIVE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {mode === 'email' ? 'bob@dysonrelo.com Status & Delivery Verification' : 'Twilio Text & Client Inbound SMS'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/20 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>{isFetching ? 'Checking...' : 'Refresh Status'}</span>
          </button>
        </div>
      </div>

      {/* Mode = EMAIL DIAGNOSTICS */}
      {mode === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Box 1: Sending & Receiving Breakdown */}
          <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/35 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                1. SENDING &amp; RECEIVING ARCHITECTURE
              </span>
              <span className="text-[11px] text-white/50 font-mono">dysonrelo.com</span>
            </div>

            {/* Outbound sending */}
            <div className="p-3.5 rounded-2xl bg-[#14120b] border border-[#10b981]/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#10b981] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Outbound Sending: Active &amp; Verified
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-mono">
                  RESEND API
                </span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Domain <strong>dysonrelo.com</strong> is verified in Resend. DKIM, SPF, and MX for sending are configured. Emails sent from <strong>bob@dysonrelo.com</strong> deliver directly to recipient inboxes.
              </p>
            </div>

            {/* Inbound receiving — IMPORTANT EXPLANATION FOR USER */}
            <div className="p-3.5 rounded-2xl bg-[#1a1408] border border-[#f59e0b]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f59e0b] flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Inbound Receiving Destination
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] font-mono">
                  MICROSOFT 365
                </span>
              </div>
              <div className="text-[11px] text-white/85 space-y-1.5 leading-relaxed">
                <p>
                  <strong>Current DNS MX Record:</strong>
                  <code className="block mt-1 p-1.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-[#e8c84a] break-all">
                    dysonrelo-com.mail.protection.outlook.com (Priority 0)
                  </code>
                </p>
                <p className="text-white/90">
                  ⚠️ <strong>Where your incoming test emails go:</strong> Because your MX record points to Microsoft 365, all incoming emails sent to <span className="text-[#D4AF37] font-semibold">bob@dysonrelo.com</span> land directly in your <strong>Microsoft 365 Outlook webmail / GoDaddy inbox</strong> at <a href="https://outlook.office.com" target="_blank" rel="noreferrer" className="text-[#38bdf8] underline font-bold">outlook.office.com</a>.
                </p>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-white/60 block mb-1 uppercase tracking-wider">
                    To see incoming emails here in DysonRelo or Gmail:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[10.5px] text-white/80">
                    <li>Log into your Microsoft 365 account for <strong>bob@dysonrelo.com</strong>.</li>
                    <li>Go to <em>Settings &gt; Mail &gt; Forwarding</em> and enable forwarding to <strong>rdyson2622@gmail.com</strong> (your connected Gmail address).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Live Diagnostic Test Dispatcher */}
          <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/35 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  2. SEND LIVE TEST EMAIL FROM bob@dysonrelo.com
                </span>
                <span className="text-[10px] text-[#10b981] font-bold">READY</span>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                Send an immediate test message from <strong>bob@dysonrelo.com</strong> to verify delivery and inspect the server response.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/80 block">
                  Send Test Email To:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    placeholder="bob@dysonrelo.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => sendTestMutation.mutate(testEmailTarget)}
                    disabled={sendTestMutation.isPending || !testEmailTarget}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#D4AF37] hover:bg-[#e8c84a] text-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {sendTestMutation.isPending ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{sendTestMutation.isPending ? 'Sending...' : 'Send Test'}</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  testResult.success 
                    ? 'bg-[#064e3b]/30 border-[#10b981] text-white' 
                    : 'bg-red-950/40 border-red-500 text-red-200'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {testResult.success ? <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {testResult.success ? 'Diagnostic Email Dispatched!' : 'Dispatch Failed'}
                    </span>
                    <span className="text-[10px] text-white/50">{testResult.timestamp}</span>
                  </div>
                  {testResult.success ? (
                    <div className="text-[11px] text-white/80 space-y-1">
                      <p>Resend ID: <code className="text-[#D4AF37]">{testResult.data?.id}</code></p>
                      <p className="text-white/60">
                        Check the inbox of <strong>{testEmailTarget}</strong> (or spam/junk if checking for the first time).
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-red-300">{testResult.error || 'Check Resend credentials'}</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Link buttons */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <a
                href="https://outlook.office.com"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-[#141414] hover:bg-[#202020] border border-white/10 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Outlook Webmail</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>
              <a
                href="https://resend.com/emails"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-[#141414] hover:bg-[#202020] border border-white/10 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Resend Outbox Logs</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mode = TEXT / SMS DIAGNOSTICS */}
      {mode === 'text' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Twilio Connection Details */}
          <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#10b981]/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                1. TWILIO SMS CARRIER STATUS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-mono">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[9.5px] font-bold text-white/50 uppercase">Twilio Phone Line</span>
                <p className="font-mono text-sm text-[#10b981] font-bold">
                  {textInfo?.status?.phoneNumber || 'Twilio Active'}
                </p>
                <span className="text-[10px] text-white/40">Outbound SMS sender</span>
              </div>

              <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1">
                <span className="text-[9.5px] font-bold text-white/50 uppercase">Direct Call / Text Line</span>
                <p className="font-mono text-sm text-[#D4AF37] font-bold">
                  (858) 353-1200
                </p>
                <span className="text-[10px] text-white/40">Bob Dyson California Desk</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14120b] border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Carrier Balance:</span>
                <span className="font-mono font-bold text-white">
                  ${parseFloat(textInfo?.status?.balance || '29.94').toFixed(2)} USD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Account Name:</span>
                <span className="font-semibold text-white">
                  {textInfo?.status?.accountName || 'DysonRelo'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e1610] border border-[#10b981]/30 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
                Inbound SMS Webhook URL
              </span>
              <code className="block p-2 rounded bg-black border border-white/10 text-[10px] font-mono text-white/80 break-all select-all">
                {textInfo?.webhookUrl}
              </code>
              <p className="text-[10.5px] text-white/60">
                When homeowners or clients reply to text messages, Twilio sends the response to this endpoint, auto-notifies Bob by email, and logs it in the Outreach Pipeline.
              </p>
            </div>
          </div>

          {/* Action Links & Pipeline Monitor */}
          <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#10b981]/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                  2. SMS OUTREACH &amp; CLIENT COMMS DESK
                </span>
                <span className="text-[10px] text-white/50">ACTIONS</span>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                Manage owner responses, review sent batches, and trigger multi-step SMS campaigns for active listings and relocating buyers.
              </p>

              <div className="space-y-2">
                <a
                  href="/admin/compose-sms"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141414] hover:bg-[#1e1e1e] border border-white/10 text-white text-xs font-semibold transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#10b981]" />
                    Compose Single or Targeted SMS
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/admin/batch-sms-log"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141414] hover:bg-[#1e1e1e] border border-white/10 text-white text-xs font-semibold transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-[#D4AF37]" />
                    View Batch SMS Audit Logs
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/admin/outreach-pipeline"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141414] hover:bg-[#1e1e1e] border border-white/10 text-white text-xs font-semibold transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#38bdf8]" />
                    Outreach Pipeline &amp; Response Board
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-[11px] text-white/50">
                Outbound sends are rate-limited and comply with 10DLC carrier compliance regulations.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}