import React, { useState } from 'react';
import { Download, Link2, Copy, Check, Share2, Linkedin, Facebook, RefreshCw } from 'lucide-react';
import { ensureFreshRender, getRenderStatus, RENDER_STATUS_CONFIG } from '@/components/dnn/renderGuard';

const GOLD = '#D4AF37';

/**
 * BroadcastExportTools — raw MP4 export + social share-copy generator.
 *
 * Render Invalidation Pipeline:
 *   Download MP4 / Copy Video Link are guarded by ensureFreshRender().
 *   If needsReRender is true, a fresh HeyGen render is triggered and polled
 *   to completion before the asset is used.
 *
 * Props:
 *   show: broadcast record
 *   onRefresh: parent callback to re-fetch the show after a re-render
 */
export default function BroadcastExportTools({ show, onRefresh }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLi, setCopiedLi] = useState(false);
  const [copiedFb, setCopiedFb] = useState(false);
  const [ensuring, setEnsuring] = useState(false);
  const [error, setError] = useState(null);

  const liveUrl = `${window.location.origin}/broadcast-show`;
  const videoUrl = show?.videoUrl || '';
  const summary = show?.headlines?.length
    ? show.headlines.slice(0, 3).join(' · ')
    : show?.script?.slice(0, 180) || "Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence.";
  const showLabel = show?.show_name || `Show ${show?.show_number || ''}`.trim() || 'DNN Broadcast';

  const linkedinCopy = `${liveUrl}

${showLabel} — ${summary}

Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence. Solutions, not just headlines.

#DNN #RealEstateNews #Relocation #HousingMarket`;

  const facebookCopy = `${liveUrl}

${showLabel} — ${summary}

Watch Charlie Simmons and Bob Dyson deliver today's market intelligence with solutions, not just headlines.

#DNN #RealEstateNews #Relocation`;

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2500);
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setter(true); setTimeout(() => setter(false), 2500); } catch (_) {}
      document.body.removeChild(ta);
    }
  };

  // ── GUARDED DOWNLOAD ──
  const downloadMp4 = async () => {
    setError(null);
    if (!show) return;
    setEnsuring(true);
    try {
      const freshShow = await ensureFreshRender(show);
      if (onRefresh) onRefresh();
      const url = freshShow.videoUrl || videoUrl;
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = `DNN_${show?.broadcast_date || 'broadcast'}.mp4`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnsuring(false);
    }
  };

  // ── GUARDED COPY LINK ──
  const copyVideoLink = async () => {
    setError(null);
    if (!show) return;
    setEnsuring(true);
    try {
      const freshShow = await ensureFreshRender(show);
      if (onRefresh) onRefresh();
      const url = freshShow.videoUrl || videoUrl;
      if (!url) return;
      await copyToClipboard(url, setCopiedLink);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnsuring(false);
    }
  };

  const renderStatus = ensuring ? 'rendering' : getRenderStatus(show);
  const statusConfig = RENDER_STATUS_CONFIG[renderStatus];

  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}30` }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
        Source Export & Share Copy
      </p>

      {/* Render status badge */}
      <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-md"
        style={{ background: statusConfig.bgColor, border: `1px solid ${statusConfig.color}30` }}>
        {ensuring
          ? <RefreshCw className="w-3 h-3 animate-spin" style={{ color: statusConfig.color }} />
          : <span className="text-[11px]">{statusConfig.icon}</span>}
        <span className="text-[10px] font-bold" style={{ color: statusConfig.color }}>
          {statusConfig.label}
        </span>
      </div>

      {/* MP4 export row */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={downloadMp4}
          disabled={ensuring || (!videoUrl && renderStatus !== 'stale')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold text-black transition-all disabled:opacity-40"
          style={{ background: GOLD }}
        >
          {ensuring ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
          {ensuring ? 'Re-rendering...' : 'Download MP4'}
        </button>
        <button
          onClick={copyVideoLink}
          disabled={ensuring || (!videoUrl && renderStatus !== 'stale')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold text-white transition-all disabled:opacity-40"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${GOLD}40` }}
        >
          {ensuring ? <RefreshCw className="w-3 h-3 animate-spin" style={{ color: GOLD }} /> : copiedLink ? <Check className="w-3 h-3 text-green-400" /> : <Link2 className="w-3 h-3" style={{ color: GOLD }} />}
          {ensuring ? 'Re-rendering...' : copiedLink ? 'Copied!' : 'Copy Video Link'}
        </button>
      </div>
      {videoUrl && !ensuring && (
        <p className="text-[9px] text-slate-500 mb-3 truncate break-all" style={{ maxWidth: '100%' }}>
          {videoUrl}
        </p>
      )}

      {/* Share copy generator */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Share2 className="w-3 h-3" style={{ color: GOLD }} />
          <span className="text-[10px] font-bold text-white">Pre-formatted Post Copy</span>
        </div>

        {/* LinkedIn */}
        <div className="rounded-md p-2.5" style={{ background: 'rgba(10,102,194,0.06)', border: '1px solid rgba(10,102,194,0.2)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white">
              <Linkedin className="w-3 h-3" style={{ color: '#0a66c2' }} /> LinkedIn
            </span>
            <button
              onClick={() => copyToClipboard(linkedinCopy, setCopiedLi)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold text-black transition-all"
              style={{ background: copiedLi ? 'rgba(74,222,128,0.3)' : GOLD }}
            >
              {copiedLi ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
              {copiedLi ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="text-[9px] text-slate-300 whitespace-pre-wrap break-words leading-relaxed" style={{ fontFamily: 'monospace' }}>
{linkedinCopy}
          </pre>
        </div>

        {/* Facebook */}
        <div className="rounded-md p-2.5" style={{ background: 'rgba(24,119,242,0.06)', border: '1px solid rgba(24,119,242,0.2)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white">
              <Facebook className="w-3 h-3" style={{ color: '#1877f2' }} /> Facebook
            </span>
            <button
              onClick={() => copyToClipboard(facebookCopy, setCopiedFb)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold text-black transition-all"
              style={{ background: copiedFb ? 'rgba(74,222,128,0.3)' : GOLD }}
            >
              {copiedFb ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
              {copiedFb ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="text-[9px] text-slate-300 whitespace-pre-wrap break-words leading-relaxed" style={{ fontFamily: 'monospace' }}>
{facebookCopy}
          </pre>
        </div>
      </div>

      {error && (
        <p className="text-[9px] text-red-400 mt-2">{error}</p>
      )}

      <p className="text-[9px] text-slate-600 mt-2 italic">
        Line 1 = live show URL · Line 2+ = market brief summary. Paste directly into LinkedIn or Facebook.
      </p>
    </div>
  );
}