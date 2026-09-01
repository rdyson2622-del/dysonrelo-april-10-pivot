import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send, FileText, Video, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const GOLD = '#D4AF37';

// Curated list of shareable public pages
const SHARE_PAGES = [
  { title: 'Transparency', path: '/transparency' },
  { title: 'Relocation Intake & Roadmap', path: '/relocation-intake' },
  { title: 'Intelligence (Solution Map)', path: '/solutions' },
  { title: 'DNN Real Estate News', path: '/dnn-news' },
  { title: 'Broadcast Show (Live)', path: '/broadcast-show' },
  { title: 'Corporate Relo / HR', path: '/corporate-relo' },
  { title: 'National Vetted Directory', path: '/national-directory' },
  { title: 'My Agent', path: '/my-agent' },
];

export default function AdminQuickSend() {
  const [contentType, setContentType] = useState('page'); // 'page' | 'video'
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sendSms, setSendSms] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);

  const { data: explainers = [] } = useQuery({
    queryKey: ['quickSendExplainers'],
    queryFn: () => base44.entities.CharliePageExplainer.filter({ renderStatus: 'completed' }, '-updated_date', 100),
  });

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['quickSendBroadcasts'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 100),
  });

  const videoOptions = useMemo(() => {
    const fromExplainers = explainers
      .filter(e => e.presenterVideoUrl)
      .map(e => ({ title: `Charlie Explainer — ${e.pageTitle}`, url: e.presenterVideoUrl }));
    const fromBroadcasts = broadcasts
      .filter(b => b.videoUrl)
      .map(b => ({ title: `Broadcast — ${b.show_name || b.broadcast_date}`, url: b.videoUrl }));
    return [...fromExplainers, ...fromBroadcasts];
  }, [explainers, broadcasts]);

  const link = contentType === 'page'
    ? (selectedPath ? `${window.location.origin}${selectedPath}` : '')
    : selectedVideo;

  const selectedTitle = contentType === 'page'
    ? SHARE_PAGES.find(p => p.path === selectedPath)?.title
    : videoOptions.find(v => v.url === selectedVideo)?.title;

  useEffect(() => {
    if (!link) { setMessage(''); return; }
    const greeting = recipientName ? `Hi ${recipientName}, ` : 'Hi, ';
    setMessage(`${greeting}here's the ${contentType === 'page' ? 'page' : 'video'} I mentioned — ${selectedTitle || ''}:\n\n${link}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link, recipientName]);

  const canSend = message.trim() && ((sendSms && phone) || (sendEmail && email)) && (sendSms || sendEmail);

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setResults(null);
    const outcomes = [];

    if (sendSms && phone) {
      try {
        await base44.functions.invoke('adminQuickSend', { channel: 'sms', to: phone, recipient_name: recipientName, message });
        outcomes.push({ channel: 'SMS', success: true });
      } catch (e) {
        outcomes.push({ channel: 'SMS', success: false, error: e.response?.data?.error || e.message });
      }
    }
    if (sendEmail && email) {
      try {
        await base44.functions.invoke('adminQuickSend', {
          channel: 'email', to: email, recipient_name: recipientName,
          subject: `${selectedTitle || 'A link'} — Dyson & Dyson`, message,
        });
        outcomes.push({ channel: 'Email', success: true });
      } catch (e) {
        outcomes.push({ channel: 'Email', success: false, error: e.response?.data?.error || e.message });
      }
    }

    setResults(outcomes);
    setSending(false);
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Quick Send</h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Pick a page or video and send just that link to one person, by text or email.
        </p>

        {/* Step 1: content type */}
        <div className="rounded-xl p-4 mb-4" style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>1. What are you sending?</p>
          <div className="flex gap-2 mb-4">
            <button onClick={() => { setContentType('page'); setSelectedVideo(''); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: contentType === 'page' ? GOLD : 'rgba(255,255,255,0.06)', color: contentType === 'page' ? '#000' : '#fff' }}>
              <FileText className="w-4 h-4" /> A Page
            </button>
            <button onClick={() => { setContentType('video'); setSelectedPath(''); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: contentType === 'video' ? GOLD : 'rgba(255,255,255,0.06)', color: contentType === 'video' ? '#000' : '#fff' }}>
              <Video className="w-4 h-4" /> A Video
            </button>
          </div>

          {contentType === 'page' ? (
            <select value={selectedPath} onChange={e => setSelectedPath(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
              <option value="">Select a page…</option>
              {SHARE_PAGES.map(p => <option key={p.path} value={p.path}>{p.title}</option>)}
            </select>
          ) : (
            <select value={selectedVideo} onChange={e => setSelectedVideo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
              <option value="">Select a video…</option>
              {videoOptions.map(v => <option key={v.url} value={v.url}>{v.title}</option>)}
              {videoOptions.length === 0 && <option disabled>No completed videos found</option>}
            </select>
          )}
        </div>

        {/* Step 2: recipient */}
        <div className="rounded-xl p-4 mb-4" style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>2. Who's it going to?</p>
          <input placeholder="Recipient name (optional)" value={recipientName} onChange={e => setRecipientName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm mb-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />

          <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
            <input type="checkbox" checked={sendSms} onChange={e => setSendSms(e.target.checked)} />
            <span className="text-sm text-white">Send via Text</span>
          </label>
          {sendSms && (
            <input placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm mb-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
          )}

          <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
            <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />
            <span className="text-sm text-white">Send via Email</span>
          </label>
          {sendEmail && (
            <input placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
          )}
        </div>

        {/* Step 3: message */}
        <div className="rounded-xl p-4 mb-4" style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>3. Message</p>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
            placeholder="Select a page or video above to auto-fill a message…"
            className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
        </div>

        <button onClick={handleSend} disabled={!canSend || sending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
          style={{ background: GOLD, color: '#000' }}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Sending…' : 'Send'}
        </button>

        {results && (
          <div className="mt-4 space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
                style={{ background: r.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${r.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                {r.success ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <span style={{ color: r.success ? '#4ade80' : '#f87171' }}>
                  {r.success ? `${r.channel} sent successfully.` : `${r.channel} failed: ${r.error}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}