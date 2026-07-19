import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, RefreshCw, Send, CheckCircle, XCircle, Clock, Linkedin, Film, X } from 'lucide-react';
import DualBoxLayoutMockup from '@/components/dnn/DualBoxLayoutMockup';

const GOLD = '#D4AF37';
const DNN_LOGO = "https://qtrypzzcjebvfcihihnt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const DNN_STUDIO_IMAGE = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/fe0a2ddb0_dnn_studio_1200x627.png";

function BroadcastCard({ show, onPosted }) {
  const [playing, setPlaying] = useState(false);
  const [liPosting, setLiPosting] = useState(false);
  const [liResult, setLiResult] = useState(null);
  const [fbPosting, setFbPosting] = useState(false);
  const [fbResult, setFbResult] = useState(null);

  const hasVideo = !!show.videoUrl;
  const isStitched = hasVideo;
  const dist = show.distribution || [];
  const liDist = dist.find(d => d.channel === 'linkedin');
  const fbDist = dist.find(d => d.channel === 'facebook');

  const updateDistribution = async (newRecord) => {
    const existing = [...(show.distribution || [])];
    const idx = existing.findIndex(d => d.channel === newRecord.channel);
    if (idx >= 0) existing[idx] = { ...existing[idx], ...newRecord };
    else existing.push(newRecord);
    await base44.entities.DnnBroadcast.update(show.id, { distribution: existing });
    onPosted();
  };

  const handleLinkedIn = async () => {
    setLiPosting(true);
    setLiResult(null);
    try {
      const res = await base44.functions.invoke('postToLinkedInV2', {
        text: `📡 DNN Intelligence Bureau\n\n${show.headlines?.[0] || 'Daily Real Estate News Broadcast'}\n\nCharlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.\n\n🔔 Watch the full broadcast: https://1dnn.com/dnn-news?autoplay=1\nSubscribe for free: https://1dnn.com/subscribe`,
        videoUrl: show.videoUrl,
        imageUrl: DNN_STUDIO_IMAGE,
        title: `${show.show_name || 'DNN Broadcast'} — ${show.broadcast_date || ''}`,
        description: "Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.",
        organizationName: 'DNN',
      });
      if (res.data?.success) {
        await updateDistribution({
          channel: 'linkedin',
          status: 'sent',
          recipient: res.data.posted_as || 'DNN LinkedIn Page',
          post_id: res.data.post_id || '',
          posted_at: new Date().toISOString(),
        });
        setLiResult({ success: true, msg: `Posted to ${res.data.posted_as}` });
      } else {
        await updateDistribution({ channel: 'linkedin', status: 'failed', error: res.data?.error || 'Unknown error' });
        setLiResult({ success: false, msg: res.data?.error || 'LinkedIn post failed' });
      }
    } catch (e) {
      setLiResult({ success: false, msg: e.message });
    }
    setLiPosting(false);
  };

  const handleFacebook = async () => {
    setFbPosting(true);
    setFbResult(null);
    try {
      const res = await base44.functions.invoke('dnnSocialBlast', {});
      if (res.data?.facebook?.success || res.data?.success) {
        await updateDistribution({
          channel: 'facebook',
          status: 'sent',
          recipient: 'DNN Facebook Page',
          post_id: res.data?.facebook?.post_id || res.data?.post_id || '',
          posted_at: new Date().toISOString(),
        });
        setFbResult({ success: true, msg: 'Posted to Facebook' });
      } else {
        setFbResult({ success: false, msg: res.data?.error || 'Facebook post failed' });
      }
    } catch (e) {
      setFbResult({ success: false, msg: e.message });
    }
    setFbPosting(false);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex flex-col md:flex-row">
        {/* Left: Video */}
        <div className="md:w-[420px] md:flex-shrink-0">
          {/* Status bar */}
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <Film className="w-3 h-3" style={{ color: GOLD }} />
              <span className="text-xs font-black text-white">{show.show_name || `Show ${show.show_number || '?'}`}</span>
              <span className="text-[10px] text-slate-500">{show.broadcast_date}</span>
            </div>
            <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: isStitched ? 'rgba(74,222,128,0.15)' : 'rgba(212,175,55,0.15)', color: isStitched ? '#4ade80' : GOLD }}>
              {isStitched ? '✓ STITCHED' : show.status?.toUpperCase() || 'DRAFT'}
            </span>
          </div>

          {/* Video */}
          <div className="relative aspect-video bg-black">
            {hasVideo ? (
              playing ? (
                <video src={show.videoUrl} controls autoPlay playsInline className="w-full h-full" />
              ) : (
                <button onClick={() => setPlaying(true)} className="w-full h-full flex items-center justify-center group">
                  <video src={show.videoUrl} muted playsInline preload="metadata"
                    onLoadedMetadata={(e) => { e.target.currentTime = 1; }}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: GOLD }}>
                      <Play className="w-6 h-6 ml-1 text-black" fill="black" />
                    </div>
                  </div>
                </button>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Not Stitched Yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Headlines + Actions */}
        <div className="flex-1 flex flex-col p-4">
          {/* Headlines */}
          {show.headlines?.length > 0 && (
            <div className="flex-1">
              {show.headlines.slice(0, 4).map((h, i) => (
                <p key={i} className="text-xs text-slate-300 leading-snug mb-1">• {h}</p>
              ))}
              {show.headlines.length > 4 && <p className="text-[10px] text-slate-600">+{show.headlines.length - 4} more</p>}
            </div>
          )}

          {/* Posting buttons */}
          {hasVideo ? (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* LinkedIn */}
              <button onClick={handleLinkedIn} disabled={liPosting || liDist?.status === 'sent'}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
                style={{ background: liPosting ? '#666' : liDist?.status === 'sent' ? 'rgba(10,102,194,0.3)' : '#0a66c2' }}>
                {liPosting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : liDist?.status === 'sent' ? <CheckCircle className="w-3.5 h-3.5" /> : <Linkedin className="w-3.5 h-3.5" />}
                {liPosting ? 'Posting...' : liDist?.status === 'sent' ? '✓ Posted to LinkedIn' : 'Post Show to LinkedIn'}
              </button>

              {/* Facebook */}
              <button onClick={handleFacebook} disabled={fbPosting || fbDist?.status === 'sent'}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-50"
                style={{ background: fbPosting ? '#666' : fbDist?.status === 'sent' ? 'rgba(74,222,128,0.2)' : 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                {fbPosting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : fbDist?.status === 'sent' ? <CheckCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                {fbPosting ? 'Posting...' : fbDist?.status === 'sent' ? '✓ Posted to Facebook' : 'Post Show to Facebook'}
              </button>

              {/* Results */}
              {liResult && (
                <p className={`text-[10px] ${liResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {liResult.success ? '✓' : '✗'} {liResult.msg}
                </p>
              )}
              {fbResult && (
                <p className={`text-[10px] ${fbResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {fbResult.success ? '✓' : '✗'} {fbResult.msg}
                </p>
              )}

              {liDist?.status === 'sent' && !liResult && (
                <p className="text-[9px] text-slate-500 ml-auto">
                  LinkedIn: {new Date(liDist.posted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[10px] text-slate-600 py-2">
              Show must be stitched before posting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DnnVideoPreview() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [goldenPlaying, setGoldenPlaying] = useState(false);
  const [goldenVideoUrl, setGoldenVideoUrl] = useState(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dnnVideoPreviewBroadcasts'] }),
      queryClient.invalidateQueries({ queryKey: ['goldenMasterLayout'] }),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role !== 'admin') {
        window.location.href = '/';
      } else {
        setIsAdmin(true);
      }
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['dnnVideoPreviewBroadcasts'],
    queryFn: () => base44.entities.DnnBroadcast.list('-broadcast_date', 100),
    refetchInterval: 30000,
  });

  const { data: goldenMaster } = useQuery({
    queryKey: ['goldenMasterLayout'],
    queryFn: () => base44.entities.LayoutTemplate.filter({ id: '6a5bc2a88cc89dc9b84ec199' }),
    refetchInterval: 60000,
  });
  const goldenLayout = goldenMaster?.[0];
  const goldenTemplateName = goldenLayout?.template_name || 'DNN Master Base Layout';
  const goldenHeygenTemplateId = goldenLayout?.heygen_template_id;

  // Video Library broadcasts — older completed MP4s stored outside DnnBroadcast
  const { data: videoLibrary = [] } = useQuery({
    queryKey: ['videoLibraryBroadcasts'],
    queryFn: () => base44.entities.VideoLibrary.filter({ category: 'broadcast' }, '-broadcast_date', 50),
    refetchInterval: 60000,
  });

  // FILTER: July 15 shows only — remove all others
  const TARGET_DATE = '2026-07-15';
  const stitched = broadcasts.filter(b => b.videoUrl && b.broadcast_date === TARGET_DATE);
  const notStitched = broadcasts.filter(b => !b.videoUrl && b.status === 'completed' && b.broadcast_date === TARGET_DATE);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Video Preview Studio</p>
            <p className="text-[10px] text-slate-500">July 15 broadcasts only — review & post</p>
          </div>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-opacity disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Stats bar */}
      <div className="px-6 py-4 flex gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-green-400">{stitched.length} Ready</span>
        </div>
        {notStitched.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">{notStitched.length} Awaiting Stitch</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg ml-auto" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD }}>July 15 Broadcasts Only — No Individual Clips</span>
        </div>
      </div>

      {/* Dual-Box Layout Mockup — visual positioning reference */}
      <DualBoxLayoutMockup />

      {/* Golden Master Reference — Candidate Selection */}
      <div className="px-6 py-5" style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase"
            style={{ background: GOLD, color: '#000' }}>
            ★ Golden Master Candidates
          </span>
          <p className="text-sm font-black text-white">Find the show with the dual-box layout</p>
          <span className="text-[10px] text-slate-500">— Charlie lower-left · Bob lower-right · 3 pills lower center</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Play each video below to find the one showing Charlie in the lower-left box, Bob in the lower-right box,
          and 3 pills across the lower center background. Once you identify it, tell me which show number it is.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {broadcasts.filter(b => b.broadcast_date === TARGET_DATE && (b.videoUrl || (b.clips || []).some(c => c.videoUrl))).map(show => {
            const playUrl = show.videoUrl || (show.clips || []).find(c => c.videoUrl)?.videoUrl;
            const isCurrentGolden = goldenLayout?.reference_broadcast_id === show.id;
            return (
              <div key={show.id} className="rounded-lg overflow-hidden" style={{ background: '#1a1a1a', border: isCurrentGolden ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.08)' }}>
                <div className="relative aspect-video bg-black">
                  <button onClick={() => { setGoldenVideoUrl(playUrl); setGoldenPlaying(true); }}
                    className="w-full h-full flex items-center justify-center group relative">
                    <video src={playUrl} muted playsInline preload="metadata"
                      onLoadedMetadata={(e) => { e.target.currentTime = 2; }}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: GOLD }}>
                        <Play className="w-5 h-5 ml-0.5 text-black" fill="black" />
                      </div>
                    </div>
                  </button>
                  {isCurrentGolden && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase"
                      style={{ background: GOLD, color: '#000' }}>
                      ★ Current Reference
                    </span>
                  )}
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-black text-white">{show.show_name || `Show ${show.show_number}`}</p>
                  <p className="text-[10px] text-slate-500">{show.broadcast_date} · {show.format}</p>
                  <p className="text-[9px] text-slate-600 mt-1">Clips: {(show.clips || []).map(c => c.role).join(' → ')}</p>
                </div>
              </div>
            );
          })}
          {/* Video Library broadcasts — July 15 only */}
          {videoLibrary.filter(v => v.broadcast_date === TARGET_DATE).map(vid => {
            const playUrl = vid.video_url || vid.file_url;
            if (!playUrl) return null;
            return (
              <div key={vid.id} className="rounded-lg overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(96,165,250,0.3)' }}>
                <div className="relative aspect-video bg-black">
                  <button onClick={() => { setGoldenVideoUrl(playUrl); setGoldenPlaying(true); }}
                    className="w-full h-full flex items-center justify-center group relative">
                    <video src={playUrl} muted playsInline preload="metadata"
                      onLoadedMetadata={(e) => { e.target.currentTime = 2; }}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: '#60a5fa' }}>
                        <Play className="w-5 h-5 ml-0.5 text-black" fill="black" />
                      </div>
                    </div>
                  </button>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase"
                    style={{ background: '#60a5fa', color: '#000' }}>
                    Video Library
                  </span>
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-black text-white">{vid.title}</p>
                  <p className="text-[10px] text-slate-500">{vid.broadcast_date || 'No date'}</p>
                  <p className="text-[9px] text-slate-600 mt-1">Archived broadcast MP4</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning banner */}
      <div className="px-6 py-3" style={{ background: 'rgba(251,191,36,0.06)' }}>
        <p className="text-xs text-center" style={{ color: '#fbbf24' }}>
          ⚠️ This page posts the <strong>full stitched show</strong> to LinkedIn and Facebook — not individual article clips.
          Only post shows that have been stitched and reviewed.
        </p>
      </div>

      {/* Grid */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : stitched.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Film className="w-10 h-10 text-slate-600" />
            <p className="text-sm text-slate-500">No stitched shows ready for posting.</p>
            <p className="text-xs text-slate-600">Complete the stitching step in the Show Pipeline first.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {stitched.map(show => (
              <BroadcastCard key={show.id} show={show} onPosted={handleRefresh} />
            ))}
          </div>
        )}
      </div>

      {/* Golden Master candidate fullscreen player */}
      {goldenPlaying && goldenVideoUrl && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: '#000' }}>
          <video src={goldenVideoUrl} controls autoPlay playsInline className="max-w-full max-h-full" />
          <button onClick={() => { setGoldenPlaying(false); setGoldenVideoUrl(null); }} aria-label="Close"
            className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      </div>
      );
      }