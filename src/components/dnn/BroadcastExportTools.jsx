import React, { useState } from 'react';
import { Download, Link2, Copy, Check, Share2, Linkedin, Facebook } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_POSTER = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/fe0a2ddb0_dnn_studio_1200x627.png";

/**
 * BroadcastExportTools — raw MP4 export + social share-copy generator.
 *
 * Strict copy format:
 *   Line 1: absolute live-show URL
 *   Line 2+: compelling market-brief summary
 *
 * Props:
 *   show: { videoUrl, headlines, broadcast_date, show_name, script }
 */
export default function BroadcastExportTools({ show }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLi, setCopiedLi] = useState(false);
  const [copiedFb, setCopiedFb] = useState(false);

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
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setter(true); setTimeout(() => setter(false), 2500); } catch (_) {}
      document.body.removeChild(ta);
    }
  };

  const downloadMp4 = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `DNN_${show?.broadcast_date || 'broadcast'}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}30` }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>
        Source Export & Share Copy
      </p>

      {/* MP4 export row */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={downloadMp4}
          disabled={!videoUrl}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold text-black transition-all disabled:opacity-40"
          style={{ background: GOLD }}
        >
          <Download className="w-3 h-3" /> Download MP4
        </button>
        <button
          onClick={() => copyToClipboard(videoUrl, setCopiedLink)}
          disabled={!videoUrl}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold text-white transition-all disabled:opacity-40"
          style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${GOLD}40` }}
        >
          {copiedLink ? <Check className="w-3 h-3 text-green-400" /> : <Link2 className="w-3 h-3" style={{ color: GOLD }} />}
          {copiedLink ? 'Copied!' : 'Copy Video Link'}
        </button>
      </div>
      {videoUrl && (
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

      <p className="text-[9px] text-slate-600 mt-2 italic">
        Line 1 = live show URL · Line 2+ = market brief summary. Paste directly into LinkedIn or Facebook.
      </p>
    </div>
  );
}