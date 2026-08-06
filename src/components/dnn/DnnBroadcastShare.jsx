import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Copy, Check, Mail, MessageSquare, Share2, Send } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * DnnBroadcastShare — modal to share a finished DNN studio broadcast.
 * Public options (everyone): copy MP4 link, copy share text, email, SMS, native share.
 * Admin-only: internal email of the MP4 link to a registered app user.
 *
 * Props:
 *   broadcast — the DnnBroadcast record
 *   url       — the playable MP4 URL (composited preferred)
 *   isAdmin   — show the internal admin send section
 *   onClose   — close handler
 */
export default function DnnBroadcastShare({ broadcast, url, isAdmin, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [sendTo, setSendTo] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const title = broadcast.headlines?.[0] || broadcast.show_name || 'DNN Broadcast';
  const showName = broadcast.show_name || 'DNN Broadcast';

  const shareText = `📡 ${showName} — DNN Intelligence Bureau\n\n${title}\n\nWatch the full studio broadcast:\n${url}\n\n— Dyson & Dyson Real Estate Concierge`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const emailShare = () => {
    const subject = encodeURIComponent(`${showName} — DNN Intelligence Bureau`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const smsShare = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`);
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${showName} — DNN`, text: shareText, url });
    }
  };

  const internalSend = async () => {
    if (!sendTo.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      await base44.integrations.Core.SendEmail({
        to: sendTo.trim(),
        subject: `${showName} — DNN Studio Broadcast`,
        body: `${shareText}\n\n(Delivered internally via Dyson & Dyson admin.)`,
      });
      setSendResult({ ok: true, msg: `Sent to ${sendTo.trim()}` });
      setSendTo('');
    } catch (e) {
      setSendResult({ ok: false, msg: e?.message || 'Send failed (recipient may not be a registered app user)' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="rounded-xl p-6 max-w-lg w-full" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Share Broadcast</p>
            <p className="text-sm font-bold text-white mt-0.5 line-clamp-1">{title}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* MP4 link */}
        <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>Studio MP4</p>
          <p className="text-xs text-white/70 break-all leading-relaxed">{url}</p>
        </div>

        {/* Public share buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button onClick={copyLink} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: copiedLink ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: copiedLink ? '#4ade80' : '#fff' }}>
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied' : 'Copy Link'}
          </button>
          <button onClick={copyText} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: copiedText ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: copiedText ? '#4ade80' : '#fff' }}>
            {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedText ? 'Text Copied' : 'Copy Share Text'}
          </button>
          <button onClick={emailShare} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button onClick={smsShare} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
            <MessageSquare className="w-3.5 h-3.5" /> Text
          </button>
          {navigator.share && (
            <button onClick={nativeShare} className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', color: GOLD }}>
              <Share2 className="w-3.5 h-3.5" /> More Share Options
            </button>
          )}
        </div>

        {/* Admin-only internal send */}
        {isAdmin && (
          <div className="rounded-lg p-3 mt-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-3.5 h-3.5" style={{ color: GOLD }} />
              <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Internal Admin Send</p>
            </div>
            <p className="text-[10px] text-white/40 mb-2 leading-relaxed">Emails the MP4 link to a registered app user (agent, client, or team member).</p>
            <div className="flex gap-2">
              <input type="email" value={sendTo} onChange={e => setSendTo(e.target.value)} placeholder="recipient@example.com"
                className="flex-1 px-3 py-2 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)' }} />
              <button onClick={internalSend} disabled={sending || !sendTo.trim()}
                className="px-4 py-2 rounded-lg text-xs font-bold text-black disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                {sending ? '...' : 'Send'}
              </button>
            </div>
            {sendResult && (
              <p className="text-[10px] mt-2" style={{ color: sendResult.ok ? '#4ade80' : '#f87171' }}>{sendResult.msg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}