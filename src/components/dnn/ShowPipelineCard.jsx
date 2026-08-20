import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  RefreshCw, Play, CheckCircle, XCircle, Clock, Edit3, Sparkles,
  Film, Clapperboard, Layers, FileText, ChevronDown, ChevronRight,
  Send, Trash2, Download
} from 'lucide-react';
import DistributionPanel from '@/components/dnn/DistributionPanel';
import AgentDistributionModal from '@/components/dnn/AgentDistributionModal';
import DistributionTracker from '@/components/dnn/DistributionTracker';
import SocialAnalyticsPanel from '@/components/dnn/SocialAnalyticsPanel';
import DnnNewsBroadcastPlayer from '@/components/dnn/DnnNewsBroadcastPlayer';
import WhiteboardBulletsEditor from '@/components/dnn/WhiteboardBulletsEditor';

function extractBullets(script) {
  if (!script) return [];
  const sentences = script.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+/g) || [script];
  const cleaned = sentences
    .map(s => s.trim())
    .filter(s => s.length > 25 && !/^(so|well|you know|now|okay|great|thanks|absolutely)[,.\s]/i.test(s));
  return cleaned.slice(0, 5).map(s => s.replace(/[.!?]+$/, ''));
}

const GOLD = '#D4AF37';

const STAGES = [
  { key: 'content', label: 'Content & Stories', icon: FileText, desc: 'Articles accumulated + stories selected', producer: 'Base44 Daily News Library' },
  { key: 'script', label: 'Script Generation', icon: Sparkles, desc: 'Charlie open → Bob answer → Charlie close', producer: 'Base44 Script Review' },
  { key: 'render', label: 'Clip Rendering', icon: Clapperboard, desc: 'Render pipeline renders the video', producer: 'Higgsfield + ElevenLabs' },
  { key: 'stitch', label: 'Stitching', icon: Film, desc: 'Clips combined into one MP4', producer: 'n8n' },
  { key: 'ready', label: 'Studio Preview', icon: Layers, desc: 'Preview full show with DNN background + whiteboard bullets', producer: 'Base44 /broadcast-show' },
  { key: 'distribution', label: 'Distribution', icon: Send, desc: 'Post to social, subscribers, agents', producer: 'Communications Hub (off for practice)' },
];

function getShowStage(show) {
  // If any distribution has been done, we're in distribution stage
  const dists = show.distribution || [];
  if (dists.length > 0 && dists.some(d => d.status === 'sent')) return 'distribution';
  // Stitched video exists but nothing distributed yet → Studio Preview step
  if (show.videoUrl) return 'ready';
  if (show.heygenId && show.status === 'completed') return 'stitch';
  if (show.status === 'completed') return 'stitch';
  if (show.status === 'processing') return 'render';
  if (show.status === 'rendering') return 'render';
  if (show.status === 'script_ready') return 'script';
  if (show.status === 'failed') return 'render';
  return 'content';
}

function getStageIndex(stage) {
  return STAGES.findIndex(s => s.key === stage);
}

export default function ShowPipelineCard({ show, onEditScript, onRefresh }) {
  const [expanded, setExpanded] = useState(true);
  const [busy, setBusy] = useState(null);
  const [result, setResult] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showStudioPreview, setShowStudioPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Download the finished MP4 as a clean, properly-named .mp4 file so it opens
  // in any player and uploads to YouTube / social schedulers without rejection.
  // (The stored file is valid H.264+AAC+faststart — the issue is delivery/filename,
  //  not the codec. This forces a proper .mp4 download.)
  const handleDownloadMp4 = async () => {
    setDownloading(true);
    const url = (show.compositedVideoUrl && !String(show.compositedVideoUrl).startsWith('creatomate:pending:'))
      ? show.compositedVideoUrl : show.videoUrl;
    if (!url) { setDownloading(false); return; }
    const rawName = (show.show_name || `show-${show.show_number || ''}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const filename = `${rawName || 'dnn-broadcast'}.mp4`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback: open the direct URL in a new tab so the user can save it manually
      window.open(url, '_blank');
      setResult({ success: false, error: `Auto-download blocked (${e.message}). Opened in a new tab — right-click the video → Save Video As "${filename}"` });
    }
    setDownloading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${show.show_name || 'Show ' + (show.show_number || '?')} permanently?\n\nBroadcast date: ${show.broadcast_date}\n\nThis cannot be undone.`)) return;
    setDeleting(true);
    try {
      await base44.entities.DnnBroadcast.delete(show.id);
      onRefresh();
    } catch (e) {
      setResult({ success: false, error: e.message });
    }
    setDeleting(false);
  };

  const currentStage = getShowStage(show);
  const stageIndex = getStageIndex(currentStage);
  // Friction/STOP indicator — same red light used across other roadmaps on the
  // site to flag where a SOP/human needs to step in before the show can advance.
  const hasFriction = show.status === 'failed' || someClipsFailed || !!show.errorMessage;

  // Open the full-screen studio preview — always stop the inline preview
  // video first so we don't get two audio tracks playing simultaneously.
  const openStudioPreview = () => {
    setPlaying(false);
    setShowStudioPreview(true);
  };

  const handleAction = async (action, label) => {
    setBusy(action);
    setResult(null);
    try {
      let res;
      if (action === 'generate') {
        res = await base44.functions.invoke('dnnMorningBroadcast', { action: 'generate' });
      } else if (action === 'render') {
        res = await base44.functions.invoke('dnnMorningBroadcast', { action: 'render' });
      } else if (action === 'check') {
        res = await base44.functions.invoke('dnnMorningBroadcast', { action: 'check' });
      } else if (action === 'stitch') {
        res = await base44.functions.invoke('dnnStitchBroadcast', { action: 'start', broadcastId: show.id });
      } else if (action === 'checkStitch') {
        res = await base44.functions.invoke('dnnStitchBroadcast', { action: 'check' });
      } else if (action === 'rerun') {
        res = await base44.functions.invoke('dnnRerunShow', { broadcast_id: show.id });
      }
      setResult({ success: !res?.data?.error, data: res?.data });
      onRefresh();
    } catch (e) {
      setResult({ success: false, error: e.message });
    }
    setBusy(null);
  };

  const clips = show.clips || [];
  const allClipsRendered = clips.length > 0 && clips.every(c => c.videoUrl);
  const someClipsRendering = clips.some(c => c.status === 'rendering');
  const someClipsFailed = clips.some(c => c.status === 'failed');

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Show header */}
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="w-4 h-4" style={{ color: GOLD }} /> : <ChevronRight className="w-4 h-4" style={{ color: GOLD }} />}
          <div>
            <p className="text-sm font-black text-white">
              {show.show_name || `Show ${show.show_number || '?'}`}
              <span className="ml-2 text-xs font-normal text-slate-500">{show.broadcast_date}</span>
            </p>
            <p className="text-[10px] text-slate-500">
              {clips.length} clips · {show.headlines?.length || 0} headlines · {show.format || 'solo'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Rerun button — re-dispatch through n8n with corrected scene order */}
          <button onClick={() => {
            if (!confirm(`Rerun ${show.show_name || 'Show ' + (show.show_number || '?')}?\n\nThis will clear the current video and re-dispatch through n8n with corrected scene ordering (intro → content → outro).`)) return;
            handleAction('rerun', 'Rerun');
          }} disabled={busy === 'rerun'}
            title="Re-dispatch this show through n8n with corrected scene order"
            className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full text-white transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
            {busy === 'rerun' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {busy === 'rerun' ? 'Rerunning…' : '↻ Rerun'}
          </button>
          {/* Distribution tracker */}
          {show.videoUrl && <DistributionTracker show={show} />}
          {/* Pipeline badge — shows which render pipeline produced this show */}
          {show.pipeline === 'higgsfield_11labs' && (
            <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
              ⚡ HIGGSFIELD + 11 LABS
            </span>
          )}
          {/* Stage badge */}
          <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{
              background: show.status === 'failed' ? 'rgba(239,68,68,0.15)' : show.status === 'completed' ? 'rgba(74,222,128,0.15)' : 'rgba(212,175,55,0.15)',
              color: show.status === 'failed' ? '#ef4444' : show.status === 'completed' ? '#4ade80' : GOLD,
            }}>
            {show.status?.toUpperCase() || 'DRAFT'}
          </span>
          {show.videoUrl && (
            <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
              ✓ STITCHED
            </span>
          )}
          <button onClick={handleDelete} disabled={deleting}
            aria-label="Delete show"
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            {deleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 py-4">
          {/* Pipeline steps */}
          <div className="flex items-center gap-1 mb-5 overflow-x-auto">
            {STAGES.map((stage, i) => {
              const StageIcon = stage.icon;
              const isDone = i < stageIndex;
              const isActive = i === stageIndex;
              const isStuck = isActive && hasFriction;
              return (
                <React.Fragment key={stage.key}>
                  <div className="flex flex-col items-center shrink-0" style={{ minWidth: '90px' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: isStuck ? 'rgba(239,68,68,0.18)' : isDone ? 'rgba(74,222,128,0.15)' : isActive ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${isStuck ? '#ef4444' : isDone ? 'rgba(74,222,128,0.4)' : isActive ? GOLD : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: isStuck ? '0 0 10px #ef4444' : 'none',
                      }}>
                      {isStuck ? <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} /> : isDone ? <CheckCircle className="w-4 h-4 text-green-400" /> : <StageIcon className="w-4 h-4" style={{ color: isActive ? GOLD : '#666' }} />}
                    </div>
                    <p className="text-[8px] font-bold tracking-wide uppercase mt-1.5 text-center leading-tight"
                      style={{ color: isStuck ? '#ef4444' : isDone ? '#4ade80' : isActive ? GOLD : '#555' }}>
                      {isStuck ? 'STOP' : stage.label}
                    </p>
                    <p className="text-[7px] text-center leading-tight mt-0.5 text-slate-500">
                      {stage.producer}
                    </p>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className="h-0.5 flex-1 mt-[-20px] rounded-full" style={{ minWidth: '20px', background: i < stageIndex ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Action buttons based on current stage */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentStage === 'content' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                n8n generates script & dispatches render automatically
              </div>
            )}

            {currentStage === 'script' && (
              <button onClick={onEditScript}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all"
                style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Edit3 className="w-3.5 h-3.5" /> Edit Script
              </button>
            )}

            {currentStage === 'render' && show.status === 'processing' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Processing in n8n…
              </div>
            )}

            {currentStage === 'render' && show.status === 'rendering' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Rendering in Higgsfield + 11 Labs — n8n will callback automatically
              </div>
            )}

            {currentStage === 'stitch' && (
              <>
                <button onClick={() => handleAction('stitch', 'Stitch')} disabled={busy === 'stitch'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-50"
                  style={{ background: busy === 'stitch' ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                  {busy === 'stitch' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Film className="w-3.5 h-3.5" />}
                  {busy === 'stitch' ? 'Stitching…' : 'Start Stitching'}
                </button>
                <button onClick={() => handleAction('checkStitch', 'CheckStitch')} disabled={busy === 'checkStitch'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all"
                  style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
                  {busy === 'checkStitch' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Check Stitch Status
                </button>
              </>
            )}

            {currentStage === 'ready' && (
              <>
                <button onClick={openStudioPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition-all"
                  style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                  <Play className="w-3.5 h-3.5" /> Preview Studio Show
                </button>
                <a href="/admin/dnn/video-preview"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all"
                  style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <Layers className="w-3.5 h-3.5" /> Video Preview Studio
                </a>
              </>
            )}

            {currentStage === 'distribution' && (
              <a href="/admin/dnn/video-preview"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition-all"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                <Layers className="w-3.5 h-3.5" /> Go to Video Preview Studio
              </a>
            )}
          </div>

          {/* Clip status details */}
          {clips.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Clip Status:</p>
              <div className="flex gap-2 flex-wrap">
                {clips.map((clip, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {clip.status === 'completed' ? <CheckCircle className="w-3 h-3 text-green-400" /> :
                     clip.status === 'rendering' ? <Clock className="w-3 h-3 text-yellow-400" /> :
                     clip.status === 'failed' ? <XCircle className="w-3 h-3 text-red-400" /> :
                     <Clock className="w-3 h-3 text-slate-500" />}
                    <span className="text-[10px] font-bold uppercase text-slate-400">{clip.role}</span>
                    <span className="text-[9px] text-slate-600">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video preview */}
          {show.videoUrl && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Composited Video:</p>
                <div className="flex gap-2">
                  <button onClick={openStudioPreview}
                    className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg text-black transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                    <Play className="w-3 h-3" /> Preview Studio Show
                  </button>
                  <button onClick={handleDownloadMp4} disabled={downloading}
                    title="Download a clean .mp4 file (opens everywhere, uploads to YouTube)"
                    className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
                    {downloading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    {downloading ? 'Preparing…' : 'Download MP4'}
                  </button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ background: '#000', border: '1px solid rgba(212,175,55,0.15)' }}>
                {playing ? (
                  <video src={show.videoUrl} controls autoPlay playsInline className="w-full" />
                ) : (
                  <button onClick={() => setPlaying(true)} className="w-full aspect-video relative flex items-center justify-center group">
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
                )}
              </div>
            </div>
          )}

          {/* Whiteboard bullets editor — manual short bullets for the studio overlay */}
          {show.videoUrl && (
            <WhiteboardBulletsEditor show={show} onRefresh={onRefresh} />
          )}

          {/* Script preview */}
          {show.script && !show.videoUrl && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Script Preview:</p>
                <button onClick={onEditScript} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="rounded-lg p-3 max-h-48 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[11px] text-slate-400 whitespace-pre-wrap">{show.script}</p>
              </div>
            </div>
          )}

          {/* Distribution panel — shown when video is ready */}
          {show.videoUrl && (
            <div className="mb-4">
              <DistributionPanel
                show={show}
                onRefresh={onRefresh}
                onAgentDistribute={() => setShowAgentModal(true)}
              />
            </div>
          )}

          {/* Social analytics — shown when posts have been distributed */}
          {show.videoUrl && (show.distribution || []).some(d => d.status === 'sent' && d.post_id) && (
            <div className="mb-4">
              <SocialAnalyticsPanel show={show} onRefresh={onRefresh} />
            </div>
          )}

          {/* Agent distribution modal */}
          {showAgentModal && (
            <AgentDistributionModal
              show={show}
              onClose={() => setShowAgentModal(false)}
              onRefresh={onRefresh}
            />
          )}

          {/* Studio preview — composited broadcast.
              Single-MP4 pipeline shows use videoUrl mode (studio bg + framed avatar box).
              Legacy tag-team shows fall back to segment mode. */}
          {showStudioPreview && (() => {
            const compUrl = show.compositedVideoUrl;
            const isComp = compUrl && !String(compUrl).startsWith('creatomate:pending:');
            const playUrl = isComp ? compUrl : show.videoUrl;
            if (playUrl) {
              return (
                <div className="fixed inset-0 z-[200]">
                  <DnnNewsBroadcastPlayer
                    videoUrl={playUrl}
                    status="ready"
                    composited={!!isComp}
                    onClose={() => setShowStudioPreview(false)}
                  />
                </div>
              );
            }
            const clips = show.clips || [];
            const segments = [];
            for (const clip of clips) {
              if (!clip.videoUrl) continue;
              if (clip.role === 'bob') {
                segments.push({
                  src: clip.videoUrl,
                  speaker: 'bob',
                  title: clip.question || show.headlines?.[clips.indexOf(clip)] || null,
                  bullets: extractBullets(clip.script),
                });
              } else {
                segments.push({ src: clip.videoUrl, speaker: 'charlie' });
              }
            }
            if (segments.length === 0) return null;
            return (
              <div className="fixed inset-0 z-[200]">
                <DnnNewsBroadcastPlayer
                  segments={segments}
                  onClose={() => setShowStudioPreview(false)}
                />
              </div>
            );
          })()}

          {/* Error message */}
          {show.errorMessage && (
            <div className="rounded-lg p-2.5 mb-2 flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-300">{show.errorMessage}</p>
            </div>
          )}

          {/* Action result */}
          {result && (
            <div className="rounded-lg p-2.5" style={{
              background: result.success ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${result.success ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              {result.success ? (
                <p className="text-[10px] text-green-400">✓ {JSON.stringify(result.data).slice(0, 200)}</p>
              ) : (
                <p className="text-[10px] text-red-400">✗ {result.error || 'Unknown error'}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}