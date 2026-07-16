import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Linkedin, Facebook, Instagram, Mail, Users, CheckCircle, XCircle, Clock,
  RefreshCw, Send, DollarSign, ChevronRight, RotateCcw, X, AlertTriangle, Scissors
} from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_STUDIO_IMAGE = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/fe0a2ddb0_dnn_studio_1200x627.png";

export default function DistributionPanel({ show, onRefresh, onAgentDistribute }) {
  const queryClient = useQueryClient();
  const [posting, setPosting] = useState(null);
  const [result, setResult] = useState(null);
  const [confirmChannel, setConfirmChannel] = useState(null);
  const [generatingTeaser, setGeneratingTeaser] = useState(false);
  const [editableCaption, setEditableCaption] = useState('');

  const getPostPreview = (channelKey) => {
    const headline = show.headlines?.[0] || 'Daily Real Estate News Broadcast';
    const dateSpoken = new Date(show.broadcast_date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    if (channelKey === 'linkedin') {
      return `${headline}

DNN Intelligence Bureau — ${dateSpoken}
Real estate news WITH solutions. We don't just report — we tell you exactly what to do about it.

Watch the full show: https://1dnn.com/dnn-news

#RealEstateNews #Relocation #DNN`;
    }
    if (channelKey === 'facebook') {
      return `${headline}

DNN Intelligence Bureau — ${dateSpoken}
Real estate news WITH solutions.

Watch the full show: https://1dnn.com/dnn-news`;
    }
    if (channelKey === 'subscriber_email') {
      return `DNN Daily Broadcast — ${show.show_name || 'Show'} for ${show.broadcast_date}\n\nHeadline: ${headline}\n\nAll subscribers will receive the broadcast video link.`;
    }
    return `Post to ${channelKey}`;
  };

  const openConfirm = (channel) => {
    setEditableCaption(getPostPreview(channel.key));
    setConfirmChannel(channel);
  };

  const handleConfirmPost = () => {
    if (!confirmChannel) return;
    const action = confirmChannel.action;
    const caption = editableCaption;
    setConfirmChannel(null);
    action(caption);
  };

  const distribution = show.distribution || [];

  const getDist = (channel) => distribution.find(d => d.channel === channel);

  const updateDistribution = async (newRecord) => {
    const existing = [...(show.distribution || [])];
    const idx = existing.findIndex(d => d.channel === newRecord.channel);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...newRecord };
    } else {
      existing.push(newRecord);
    }
    await base44.entities.DnnBroadcast.update(show.id, { distribution: existing });
    onRefresh();
  };

  const handleGenerateTeaser = async () => {
    setGeneratingTeaser(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('creatomateComposite', {
        action: 'generateTeaser',
        broadcastId: show.id,
      });
      if (res.data?.success) {
        setResult({ success: true, msg: 'Teaser render started — check back in ~1 min' });
      } else {
        setResult({ success: false, msg: res.data?.error || 'Teaser generation failed' });
      }
    } catch (e) {
      setResult({ success: false, msg: e.message });
    }
    setGeneratingTeaser(false);
  };

  const handleTeaserPost = async (channelKey, caption) => {
    setPosting(channelKey);
    setResult(null);
    try {
      const res = await base44.functions.invoke('dnnPostTeaserWithComment', {
        broadcastId: show.id,
        channels: [channelKey],
        caption: caption || undefined,
      });
      const chResult = res.data?.results?.[channelKey];
      if (chResult?.success) {
        await updateDistribution({
          channel: channelKey,
          status: 'sent',
          recipient: chResult.posted_as || chResult.page_name || `DNN ${channelKey}`,
          post_id: chResult.post_id || '',
          comment_id: chResult.comment_id || '',
          posted_at: new Date().toISOString(),
        });
        setResult({ success: true, msg: `Teaser posted to ${channelKey} with link comment` });
      } else {
        await updateDistribution({ channel: channelKey, status: 'failed', error: chResult?.error || 'Unknown error' });
        setResult({ success: false, msg: chResult?.error || `${channelKey} post failed` });
      }
    } catch (e) {
      setResult({ success: false, msg: e.message });
    }
    setPosting(null);
  };

  const handleLinkedIn = (caption) => handleTeaserPost('linkedin', caption);

  const handleFacebook = (caption) => handleTeaserPost('facebook', caption);

  const handleEmailBlast = async () => {
    setPosting('email');
    setResult(null);
    try {
      const res = await base44.functions.invoke('dnnMorningEmailBlast', {});
      await updateDistribution({
        channel: 'subscriber_email',
        status: 'sent',
        recipient: 'All Subscribers',
        posted_at: new Date().toISOString(),
        recipient_count: res.data?.sent || res.data?.total_sent || 0,
      });
      setResult({ success: true, msg: `Email sent to ${res.data?.sent || res.data?.total_sent || '?'} subscribers` });
    } catch (e) {
      setResult({ success: false, msg: e.message });
    }
    setPosting(null);
  };

  const channels = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: '#0a66c2',
      bgColor: 'rgba(10,102,194,0.1)',
      dist: getDist('linkedin'),
      action: handleLinkedIn,
      busy: posting === 'linkedin',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: '#1877f2',
      bgColor: 'rgba(24,119,242,0.1)',
      dist: getDist('facebook'),
      action: handleFacebook,
      busy: posting === 'facebook',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: '#E1306C',
      bgColor: 'rgba(225,48,108,0.1)',
      dist: getDist('instagram'),
      action: () => setResult({ success: false, msg: 'Instagram not connected — connect the Instagram Business connector to enable posting' }),
      busy: posting === 'instagram',
    },
    {
      key: 'subscriber_email',
      label: 'Subscriber Email',
      icon: Mail,
      color: GOLD,
      bgColor: 'rgba(212,175,55,0.1)',
      dist: getDist('subscriber_email'),
      action: handleEmailBlast,
      busy: posting === 'email',
    },
    {
      key: 'agent_private_label',
      label: 'Agent Private-Label',
      icon: Users,
      color: '#A78BFA',
      bgColor: 'rgba(167,139,250,0.1)',
      dist: null, // handled separately
      action: onAgentDistribute,
      busy: false,
      isAgent: true,
    },
  ];

  const resetDistribution = async () => {
    if (!confirm('Clear ALL distribution records for this show? This removes LinkedIn/Facebook post tracking so you can re-post.')) return;
    await base44.entities.DnnBroadcast.update(show.id, { distribution: [] });
    setResult({ success: true, msg: 'Distribution records cleared — ready to re-post' });
    onRefresh();
  };

  const hasDistribution = distribution.length > 0;

  return (
    <div>
      {/* Teaser Generation Bar */}
      <div className="mb-3 rounded-lg p-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-white">Teaser Clip</p>
              <p className="text-[9px] text-slate-500">5-second clip for algorithm-friendly native posting</p>
            </div>
          </div>
          {show.teaserUrl ? (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-green-400 font-bold">✓ Ready</span>
              <a href={show.teaserUrl} target="_blank" className="text-[9px] text-slate-400 hover:text-white underline">Preview</a>
            </div>
          ) : (
            <button onClick={handleGenerateTeaser} disabled={generatingTeaser || !show.videoUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold text-black transition-all disabled:opacity-50"
              style={{ background: generatingTeaser ? '#666' : GOLD }}>
              {generatingTeaser ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Scissors className="w-3 h-3" />}
              {generatingTeaser ? 'Generating…' : 'Generate Teaser'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Distribution & Posting Progress:</p>
        {hasDistribution && (
          <button onClick={resetDistribution}
            className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded text-red-400 transition-all hover:bg-red-500/10"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            <RotateCcw className="w-2.5 h-2.5" /> Reset
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {channels.map(ch => {
          const Icon = ch.icon;
          const isSent = ch.dist?.status === 'sent';
          const isFailed = ch.dist?.status === 'failed';
          return (
            <div key={ch.key} className="rounded-lg p-3" style={{ background: ch.bgColor, border: `1px solid ${ch.color}30` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: ch.color }} />
                  <span className="text-xs font-bold text-white">{ch.label}</span>
                </div>
                {isSent && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                {isFailed && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                {!isSent && !isFailed && ch.dist && <Clock className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
              {ch.isAgent ? (
                <button onClick={ch.action}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold text-white transition-all"
                  style={{ background: ch.color }}>
                  <Users className="w-3 h-3" /> Select Agents
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <button onClick={() => openConfirm(ch)} disabled={ch.busy || isSent}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold text-black transition-all disabled:opacity-50"
                  style={{ background: ch.busy ? '#666' : isSent ? 'rgba(74,222,128,0.2)' : GOLD }}>
                  {ch.busy ? <RefreshCw className="w-3 h-3 animate-spin" /> : isSent ? <CheckCircle className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                  {ch.busy ? 'Posting…' : isSent ? 'Posted' : `Post Now`}
                </button>
              )}
              {isSent && ch.dist?.posted_at && (
                <p className="text-[9px] text-slate-500 mt-1.5">
                  {ch.dist.recipient_count ? `${ch.dist.recipient_count} recipients · ` : ''}
                  {new Date(ch.dist.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
              {isFailed && ch.dist?.error && (
                <p className="text-[9px] text-red-400 mt-1.5 truncate">{ch.dist.error}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Agent distributions summary */}
      {distribution.filter(d => d.channel === 'agent_private_label').length > 0 && (
        <div className="mt-3 rounded-lg p-3" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#A78BFA' }}>Agent Private-Label Delivery</p>
            <span className="text-[10px] font-bold text-purple-300">
              {distribution.filter(d => d.channel === 'agent_private_label').length} agents
            </span>
          </div>
          <div className="space-y-1.5">
            {distribution.filter(d => d.channel === 'agent_private_label').map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  {d.status === 'sent' ? <CheckCircle className="w-3 h-3 text-green-400" /> :
                   d.status === 'failed' ? <XCircle className="w-3 h-3 text-red-400" /> :
                   <Clock className="w-3 h-3 text-yellow-400" />}
                  <span className="text-white">{d.recipient || 'Agent'}</span>
                </div>
                <div className="flex items-center gap-3">
                  {d.fee > 0 && <span className="text-green-400 font-bold"><DollarSign className="w-2.5 h-2.5 inline" />{d.fee}</span>}
                  <span className="text-slate-500">{d.recipient_count || 0} contacts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result message */}
      {result && (
        <div className="mt-3 rounded-lg p-2.5" style={{
          background: result.success ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${result.success ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          <p className="text-[10px]" style={{ color: result.success ? '#4ade80' : '#ef4444' }}>
            {result.success ? '✓ ' : '✗ '}{result.msg}
          </p>
        </div>
      )}

      {/* Confirmation modal — review post before sending */}
      {confirmChannel && !confirmChannel.isAgent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setConfirmChannel(null)}>
          <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)' }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-sm font-black text-white">Confirm Post to {confirmChannel.label}</p>
              </div>
              <button onClick={() => setConfirmChannel(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <confirmChannel.icon className="w-4 h-4" style={{ color: confirmChannel.color }} />
                <span className="text-[11px] font-bold text-white">Target: {confirmChannel.dist?.recipient || (confirmChannel.key === 'linkedin' ? 'DNN LinkedIn Page' : confirmChannel.key === 'facebook' ? 'DNN Facebook Page' : confirmChannel.key === 'subscriber_email' ? 'All Subscribers' : 'Channel')}</span>
              </div>

              {/* Video preview */}
              {show.videoUrl && (
                <div className="mb-3">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Video Being Posted:</p>
                  <video src={show.videoUrl} muted playsInline preload="metadata" className="w-full rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    onLoadedMetadata={e => { e.target.currentTime = 1; }} />
                </div>
              )}

              {/* Editable post caption */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500">Post Caption (editable):</p>
                  <button onClick={() => setEditableCaption(getPostPreview(confirmChannel.key))}
                    className="text-[9px] font-bold text-slate-400 hover:text-white flex items-center gap-1">
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                </div>
                <textarea
                  value={editableCaption}
                  onChange={e => setEditableCaption(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg p-3 text-[11px] text-slate-200 resize-y focus:outline-none focus:ring-1 focus:ring-yellow-500/30"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'inherit' }}
                />
                <p className="text-[8px] text-slate-600 mt-1">{editableCaption.length} characters</p>
              </div>

              {/* Show info */}
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <p><span className="text-slate-600">Show:</span> {show.show_name || `Show ${show.show_number || '?'}`}</p>
                <p><span className="text-slate-600">Date:</span> {show.broadcast_date}</p>
                <p><span className="text-slate-600">Headlines:</span> {show.headlines?.length || 0} stories</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setConfirmChannel(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 transition-all hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                Cancel
              </button>
              <button onClick={handleConfirmPost}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black text-black transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                <Send className="w-3.5 h-3.5" /> Confirm & Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}