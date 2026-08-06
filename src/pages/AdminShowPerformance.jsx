import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3, Linkedin, Facebook, Instagram, Mail, Send, Users, Eye,
  ThumbsUp, MessageCircle, Share2, PlayCircle, TrendingUp, CheckCircle2,
  XCircle, Newspaper, Clock, Trash2, Loader2
} from 'lucide-react';

const GOLD = '#D4AF37';

const CHANNEL_META = {
  linkedin:              { label: 'LinkedIn',      icon: Linkedin,   color: '#0a66c2' },
  facebook:              { label: 'Facebook',      icon: Facebook,   color: '#1877f2' },
  instagram:             { label: 'Instagram',     icon: Instagram,  color: '#e1306c' },
  subscriber_email:      { label: 'Email',         icon: Mail,       color: '#D4AF37' },
  agent_private_label:   { label: 'Agent Label',   icon: Users,      color: '#10b981' },
  in_app_news:           { label: 'In-App News',   icon: Newspaper,  color: '#a78bfa' },
};

export default function AdminShowPerformance() {
  const [range, setRange] = useState(20);

  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['show-performance-broadcasts', range],
    queryFn: () => base44.entities.DnnBroadcast.list('-created_date', range),
  });

  const { data: opens = [] } = useQuery({
    queryKey: ['email-opens-recent'],
    queryFn: () => base44.entities.EmailOpen.list('-opened_at', 500),
  });

  const opensByBroadcast = useMemo(() => {
    const map = {};
    for (const o of opens) {
      if (!o.broadcast_id) continue;
      map[o.broadcast_id] = (map[o.broadcast_id] || 0) + 1;
    }
    return map;
  }, [opens]);

  // Only shows that have any distribution or a finished video
  const shows = useMemo(() => {
    return broadcasts.filter(b => (b.distribution && b.distribution.length > 0) || b.compositedVideoUrl || b.videoUrl);
  }, [broadcasts]);

  // Aggregate totals across all loaded shows
  const totals = useMemo(() => {
    const t = { socialPosts: 0, emailsSent: 0, emailsOpened: 0, smsSent: 0, agentLabels: 0, inApp: 0, impressions: 0, videoViews: 0, likes: 0, comments: 0, shares: 0, failed: 0 };
    for (const b of shows) {
      for (const d of (b.distribution || [])) {
        if (d.status === 'sent') {
          if (d.channel === 'subscriber_email') t.emailsSent += 1;
          else if (d.channel === 'agent_private_label') t.agentLabels += 1;
          else if (d.channel === 'in_app_news') t.inApp += 1;
          else t.socialPosts += 1;
        } else if (d.status === 'failed') {
          t.failed += 1;
        }
        if (d.analytics) {
          t.impressions += d.analytics.impressions || 0;
          t.videoViews += d.analytics.video_views || 0;
          t.likes += d.analytics.likes || 0;
          t.comments += d.analytics.comments || 0;
          t.shares += d.analytics.shares || 0;
        }
      }
      t.emailsOpened += opensByBroadcast[b.id] || 0;
    }
    return t;
  }, [shows, opensByBroadcast]);

  return (
    <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b sticky top-0 z-10" style={{ borderColor: '#333', background: '#1a1a1a' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: '#fff' }}>
              <BarChart3 className="w-7 h-7" style={{ color: GOLD }} />
              Show Performance
            </h1>
            <p style={{ color: '#888' }}>Distribution counts, email opens, and social engagement across every DNN broadcast</p>
          </div>
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="rounded-lg px-3 py-2 text-sm"
            style={{ background: '#2a2a2a', color: '#fff', border: `1px solid ${GOLD}55` }}
          >
            <option value={10}>Last 10 shows</option>
            <option value={20}>Last 20 shows</option>
            <option value={50}>Last 50 shows</option>
          </select>
        </div>
      </div>

      {/* Totals strip */}
      <div className="px-6 pt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <TotalStat label="Social Posts" value={totals.socialPosts} icon={Send} />
          <TotalStat label="Emails Sent" value={totals.emailsSent} icon={Mail} />
          <TotalStat label="Email Opens" value={totals.emailsOpened} icon={Eye} accent />
          <TotalStat label="Impressions" value={totals.impressions} icon={TrendingUp} />
          <TotalStat label="Video Views" value={totals.videoViews} icon={PlayCircle} />
          <TotalStat label="Engagement" value={totals.likes + totals.comments + totals.shares} icon={ThumbsUp} />
          <TotalStat label="Failed" value={totals.failed} icon={XCircle} danger />
        </div>
      </div>

      {/* Show list */}
      <div className="p-6 space-y-4 max-w-[1600px]">
        {isLoading ? (
          <p style={{ color: '#888' }}>Loading…</p>
        ) : shows.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: '#2a2a2a', border: '1px dashed #444' }}>
            <BarChart3 className="w-10 h-10 mx-auto mb-3" style={{ color: '#555' }} />
            <p style={{ color: '#888' }}>No distributed shows yet.</p>
            <p style={{ color: '#666', fontSize: 13 }} className="mt-1">Once a show is posted or emailed, its stats appear here.</p>
          </div>
        ) : (
          shows.map(show => (
            <ShowCard key={show.id} show={show} openCount={opensByBroadcast[show.id] || 0} range={range} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Show Card ──────────────────────────────────────────────────────────────
function ShowCard({ show, openCount, range }) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const dist = show.distribution || [];

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${show.show_name || `Show ${show.show_number || ''}`}"? This removes the broadcast and all its performance data. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await base44.entities.DnnBroadcast.delete(show.id);
      queryClient.invalidateQueries({ queryKey: ['show-performance-broadcasts', range] });
      queryClient.invalidateQueries({ queryKey: ['email-opens-recent'] });
    } catch (e) {
      alert(e.message || 'Failed to delete broadcast');
    } finally {
      setDeleting(false);
    }
  };

  // Group distribution by channel
  const byChannel = useMemo(() => {
    const map = {};
    for (const d of dist) {
      if (!map[d.channel]) map[d.channel] = { sent: 0, failed: 0, pending: 0, analytics: null, recipients: [] };
      if (d.status === 'sent') map[d.channel].sent += 1;
      else if (d.status === 'failed') map[d.channel].failed += 1;
      else map[d.channel].pending += 1;
      if (d.analytics && (!map[d.channel].analytics || (d.analytics.impressions || 0) > (map[d.channel].analytics?.impressions || 0))) {
        map[d.channel].analytics = d.analytics;
      }
      if (d.recipient) map[d.channel].recipients.push(d.recipient);
    }
    return map;
  }, [dist]);

  const emailSent = byChannel.subscriber_email?.sent || 0;
  const openRate = emailSent > 0 ? Math.round((openCount / emailSent) * 100) : 0;

  const showName = show.show_name || `Show ${show.show_number || ''}`;
  const date = show.broadcast_date || (show.published_at ? new Date(show.published_at).toLocaleDateString() : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden" style={{ background: '#2a2a2a', border: `1px solid ${GOLD}33` }}
    >
      {/* Show header */}
      <div className="p-5 border-b flex items-start justify-between gap-4" style={{ borderColor: '#333' }}>
        <div className="min-w-0">
          <h2 className="text-lg font-bold truncate" style={{ color: '#fff' }}>{showName}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#888' }}>
            {date} · Status: <span style={{ color: GOLD }}>{show.status}</span>
          </p>
          {show.headlines?.length > 0 && (
            <p className="text-xs mt-1 truncate" style={{ color: '#666' }}>{show.headlines.slice(0, 2).join(' · ')}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          {emailSent > 0 && (
            <div className="text-center px-3 py-1.5 rounded-lg" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}44` }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#888' }}>Open Rate</p>
              <p className="font-bold text-sm" style={{ color: openRate > 20 ? '#10b981' : GOLD }}>{openRate}%</p>
              <p className="text-[10px]" style={{ color: '#666' }}>{openCount}/{emailSent}</p>
            </div>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete this report"
            className="p-2 rounded-lg transition-all hover:bg-red-500/20 disabled:opacity-50"
            style={{ border: '1px solid #ef444455', color: '#ef4444' }}
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="p-5">
        {dist.length === 0 ? (
          <p style={{ color: '#666', fontSize: 13 }}>No distribution records yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(byChannel).map(([channel, info]) => (
              <ChannelBlock key={channel} channel={channel} info={info} />
            ))}
          </div>
        )}

        {/* Failed recipients */}
        {dist.some(d => d.status === 'failed') && (
          <div className="mt-4 rounded-lg p-3" style={{ background: '#ef444411', border: '1px solid #ef444444' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#ef4444' }}>
              <XCircle className="w-3.5 h-3.5" /> Failed Sends
            </p>
            <div className="space-y-1">
              {dist.filter(d => d.status === 'failed').slice(0, 5).map((d, i) => (
                <p key={i} className="text-xs" style={{ color: '#bbb' }}>
                  <span style={{ color: '#fff' }}>{CHANNEL_META[d.channel]?.label || d.channel}</span>
                  {d.recipient ? ` → ${d.recipient}` : ''}
                  {d.error ? <span style={{ color: '#ef4444' }}> — {d.error}</span> : ''}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Channel Block ─────────────────────────────────────────────────────────
function ChannelBlock({ channel, info }) {
  const meta = CHANNEL_META[channel] || { label: channel, icon: Send, color: '#888' };
  const Icon = meta.icon;
  const a = info.analytics;

  return (
    <div className="rounded-lg p-3" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: meta.color }} />
          <span className="text-sm font-semibold" style={{ color: '#fff' }}>{meta.label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-0.5" style={{ color: '#10b981' }}>
            <CheckCircle2 className="w-3 h-3" />{info.sent}
          </span>
          {info.failed > 0 && (
            <span className="flex items-center gap-0.5" style={{ color: '#ef4444' }}>
              <XCircle className="w-3 h-3" />{info.failed}
            </span>
          )}
        </div>
      </div>

      {a ? (
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <Metric icon={TrendingUp} label="Impr" value={a.impressions} />
          <Metric icon={PlayCircle} label="Views" value={a.video_views} />
          <Metric icon={ThumbsUp} label="Likes" value={a.likes} />
          <Metric icon={MessageCircle} label="Cmmts" value={a.comments} />
          <Metric icon={Share2} label="Shares" value={a.shares} />
          <Metric icon={BarChart3} label="Eng%" value={a.engagement_rate ? Number(a.engagement_rate).toFixed(1) : '—'} />
        </div>
      ) : (
        <p className="text-xs" style={{ color: '#666' }}>
          {info.sent > 0 ? 'No engagement data polled yet.' : 'Not sent.'}
        </p>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="py-1 rounded" style={{ background: '#222' }}>
      <Icon className="w-3 h-3 mx-auto mb-0.5" style={{ color: GOLD }} />
      <p className="text-xs font-bold" style={{ color: '#fff' }}>{value ?? '—'}</p>
      <p className="text-[9px] uppercase" style={{ color: '#666' }}>{label}</p>
    </div>
  );
}

// ─── Total Stat ─────────────────────────────────────────────────────────────
function TotalStat({ label, value, icon: Icon, accent, danger }) {
  const color = danger ? '#ef4444' : (accent ? '#10b981' : GOLD);
  return (
    <div className="rounded-xl p-3" style={{ background: '#2a2a2a', border: `1px solid ${color}33` }}>
      <Icon className="w-4 h-4 mb-1" style={{ color }} />
      <p className="text-xl font-bold" style={{ color: '#fff' }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider" style={{ color: '#888' }}>{label}</p>
    </div>
  );
}