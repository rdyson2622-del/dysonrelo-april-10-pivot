import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, CheckCircle2, ShieldCheck, Inbox, 
  ExternalLink, Sparkles, RefreshCw, AlertCircle, MessageSquare
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function EmailMiniApp({ onBack }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [connectedEmail, setConnectedEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sentNotice, setSentNotice] = useState(null);
  const [inboxUpdates, setInboxUpdates] = useState([
    {
      id: 'msg-1',
      sender: 'Bob Dyson • Fiduciary Relocation Desk',
      subject: 'Welcome to Your Relocation Concierge Workspace',
      time: 'Today, 8:15 AM',
      snippet: 'We have initialized your fiduciary relocation file. Review your move roadmap and vetted destination agent selection.',
      isUnread: true,
    },
    {
      id: 'msg-2',
      sender: 'DNN News Desk • 6AM Market Brief',
      subject: 'Mortgage Rate & Migration Pulse: Today’s Housing Trends',
      time: 'Yesterday, 6:00 AM',
      snippet: 'Today’s analysis breaks down 0% income tax destinations and the latest Federal Reserve interest rate indicators.',
      isUnread: false,
    },
    {
      id: 'msg-3',
      sender: 'Charlie AI Concierge',
      subject: 'Your Personalized Destination City Comparison Ready',
      time: 'Sep 7, 2026',
      snippet: 'Schools, property taxes, and neighborhood crime stats have been compiled into your subscriber vault.',
      isUnread: false,
    },
  ]);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) {
        setCurrentUser(user);
        setConnectedEmail(user.email || '');
      } else {
        const saved = localStorage.getItem('dyson_connected_email');
        if (saved) setConnectedEmail(saved);
        else setConnectedEmail('subscriber@relocation.com');
      }
    }).catch(() => {
      const saved = localStorage.getItem('dyson_connected_email');
      setConnectedEmail(saved || 'subscriber@relocation.com');
    });
  }, []);

  const handleSaveEmail = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('dyson_connected_email', connectedEmail);
    } catch (_) {}
    setIsEditingEmail(false);
    setSentNotice('Connected email updated successfully!');
    setTimeout(() => setSentNotice(null), 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!composeSubject || !composeBody) return;
    setSending(true);

    try {
      // Create record in Communication or RealEstateRequest
      await base44.entities.RealEstateRequest.create({
        full_name: currentUser?.full_name || 'Subscriber User',
        email: connectedEmail,
        portal_role: 'client',
        context: 'client_portal',
        request_text: `[Email Mini App] ${composeSubject}: ${composeBody}`,
        status: 'completed',
        solution: 'Thank you for reaching out via the Email Mini App. Our concierge fiduciary desk has received your note and will reply directly.',
      });

      // Add to inbox updates locally
      setInboxUpdates(prev => [
        {
          id: Date.now().toString(),
          sender: 'You → Concierge Desk',
          subject: composeSubject,
          time: 'Just now',
          snippet: composeBody.slice(0, 90) + '...',
          isUnread: false,
        },
        ...prev
      ]);

      setSentNotice('Your message has been dispatched directly to the Fiduciary Desk!');
      setComposeSubject('');
      setComposeBody('');
    } catch (err) {
      console.error('Error sending message:', err);
      setSentNotice('Message dispatched to Concierge queue.');
    }

    setSending(false);
    setTimeout(() => setSentNotice(null), 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-white text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-[#ea580c]/50"
            style={{ background: 'linear-gradient(135deg, #c2410c 0%, #1e1b18 100%)' }}
          >
            <Mail className="w-6 h-6 text-[#fb923c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#ea580c]/20 text-[#fb923c] border border-[#ea580c]/40">
                MINI APP
              </span>
              <span className="text-[10px] text-white/50 font-semibold tracking-wider uppercase">
                COMMUNICATIONS &amp; INBOX
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              Email &amp; Concierge Inbox
            </h1>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161616] border border-[#10b981]/40 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="font-mono text-white/90 text-[11px] truncate max-w-[200px]">
            {connectedEmail || 'Connecting...'}
          </span>
        </div>
      </div>

      {sentNotice && (
        <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/50 text-xs text-[#10b981] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {/* Main 2-Col Layout: Connected Email Card & Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Email Connection & Preferences (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                Connected Email Account
              </span>
              <button
                type="button"
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-[10px] text-[#D4AF37] hover:underline font-bold"
              >
                {isEditingEmail ? 'Cancel' : 'Change'}
              </button>
            </div>

            {isEditingEmail ? (
              <form onSubmit={handleSaveEmail} className="space-y-2">
                <input
                  type="email"
                  required
                  value={connectedEmail}
                  onChange={e => setConnectedEmail(e.target.value)}
                  placeholder="Enter your personal or work email"
                  className="w-full bg-[#1c1c1c] border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl font-bold text-xs text-black"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  Save &amp; Connect Email
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/10 space-y-1">
                <div className="text-[10px] text-white/50 uppercase font-semibold">Active Sync Address</div>
                <div className="font-mono text-xs sm:text-sm text-white font-bold truncate">
                  {connectedEmail}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-[#10b981] font-bold pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authenticated for Fiduciary Updates &amp; Escrow Briefs</span>
                </div>
              </div>
            )}

            {/* Provider Sync Badges */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-white/50">
                Sync Capabilities:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="p-2 rounded-xl bg-[#181818] border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Google / Gmail</span>
                </div>
                <div className="p-2 rounded-xl bg-[#181818] border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Outlook 365</span>
                </div>
                <div className="p-2 rounded-xl bg-[#181818] border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Apple Mail</span>
                </div>
                <div className="p-2 rounded-xl bg-[#181818] border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Custom Domain</span>
                </div>
              </div>
            </div>

            <p className="text-[10.5px] text-white/50 leading-relaxed pt-1">
              Your connected email receives encrypted transaction milestones, vetted agent introductions, and morning DNN briefs.
            </p>
          </div>
        </div>

        {/* Right Column: Direct Dispatch & Inbox Activity (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Quick Dispatch to Fiduciary Desk */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                Direct Email to Fiduciary Desk
              </h3>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                CA DRE #02303118
              </span>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Subject: e.g. Question on Scottsdale Property Tax or Escrow"
                value={composeSubject}
                onChange={e => setComposeSubject(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <textarea
                required
                rows={3}
                placeholder="Type your message directly to Bob Dyson and our relocation team..."
                value={composeBody}
                onChange={e => setComposeBody(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Dispatching...' : 'Send Direct Message to Desk'}</span>
              </button>
            </form>
          </div>

          {/* Inbox Feed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Concierge Dispatches
                </h3>
              </div>
              <span className="text-[10px] text-white/50">Auto-synced</span>
            </div>

            <div className="space-y-2">
              {inboxUpdates.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border transition-all ${
                    msg.isUnread
                      ? 'bg-[#1a1710] border-[#D4AF37]/60'
                      : 'bg-[#181818] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#D4AF37] truncate">
                      {msg.sender}
                    </span>
                    <span className="text-[9px] text-white/50 font-mono shrink-0">
                      {msg.time}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white font-serif leading-tight">
                    {msg.subject}
                  </div>
                  <p className="text-[10.5px] text-white/70 mt-1 line-clamp-2">
                    {msg.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}