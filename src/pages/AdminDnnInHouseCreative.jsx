import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, CheckCircle2, Clapperboard, Layers, Radio, Trash2, XCircle, Zap
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import InHouseMorningShowPlayer from '@/components/dnn/InHouseMorningShowPlayer';

const GOLD = '#D4AF37';

const DEFAULT_INTRO = `You're watching DNN — Dyson News Network. I'm Charlie Simmons. Today's real estate intelligence moves markets, and we'll tell you exactly what it means for your move.`;
const DEFAULT_CONTENT = `Across the country, relocation demand is concentrating in a handful of destination markets. Families who wait for perfect timing are losing inventory. The solution is managed relocation — vetted agents on both sides, escrow coordination, and a single team accountable for the whole move.`;
const DEFAULT_OUTRO = `That's your DNN Intelligence Brief. I'm Charlie Simmons. Moving? Don't guess — get managed. Start your free relocation plan at 1dnn.com.`;
const DEFAULT_BULLETS = [
  'White-label national intel into DNN solutions voice',
  'Charlie opens and closes from the news desk',
  'Bob delivers the relocation answer in the remote box',
  'No HeyGen · no Creatomate · Google TTS + owned studio',
];

const KILL = [
  { name: 'ElevenLabs', status: 'already gone', detail: 'Zero code usage. Confirm billing cancelled.' },
  { name: 'HeyGen', status: 'eliminate for daily', detail: 'Replace daily avatar renders with host plates + Google TTS. Keep functions as manual fallback only.' },
  { name: 'Creatomate', status: 'eliminate for daily', detail: 'Studio is assembled in-app. Social can deep-link until we add a bake step.' },
  { name: 'Epidemic Sound', status: 'eliminate', detail: 'Unused in render path. Owned DNN sting already ships.' },
  { name: 'n8n creative W1–W3', status: 'eliminate', detail: 'M2M already blocked. Base44 owns orchestration.' },
];

const KEEP = [
  { name: 'Gemini + Google TTS', detail: 'National white-label rewrite, script parameters, dual-host voice.' },
  { name: 'DnnNewsSource → Article → Script', detail: 'Existing research + approval surface stays the control plane.' },
  { name: 'Studio BG + dual host UI', detail: 'Charlie lower-left, Bob lower-right — owned layout.' },
  { name: 'Twilio / social connectors', detail: 'Distribution only — not creative cost.' },
];

export default function AdminDnnInHouseCreative() {
  const [playing, setPlaying] = useState(false);

  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['inhouse-latest-broadcast'],
    queryFn: () => base44.entities.DnnBroadcast.list('-created_date', 10).catch(() => []),
  });

  const latest = broadcasts[0];

  const show = useMemo(() => {
    const intro = latest?.intro_script || latest?.script || DEFAULT_INTRO;
    const content = latest?.content_script || DEFAULT_CONTENT;
    const outro = latest?.outro_script || DEFAULT_OUTRO;
    const bullets = Array.isArray(latest?.content_bullets) && latest.content_bullets.length
      ? latest.content_bullets
      : DEFAULT_BULLETS;
    const headline = latest?.show_name
      || latest?.headlines?.[0]
      || 'DNN Morning Intelligence — In-House Creative';
    return { intro, content, outro, bullets, headline };
  }, [latest]);

  return (
    <div className="min-h-screen p-6 pb-16" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/admin/dnn/show-pipeline" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4" style={{ color: GOLD }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Show Pipeline
        </Link>

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>MORNING NEWS · PRIORITY</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">In-House DNN Creative</h1>
          <p className="text-sm max-w-3xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Reimagine the daily brief: national sources → white-label rewrite → parameterised script →
            owned studio with Charlie Simmons + Bob Dyson. Eliminate HeyGen and Creatomate from the
            morning creative path. Voice stays on Google TTS.
          </p>
        </div>

        {/* Decision boards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5" style={{ background: '#000', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
              <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: '#EF4444' }}>Eliminate</h2>
            </div>
            <div className="space-y-3">
              {KILL.map((item) => (
                <div key={item.name} className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#FCA5A5' }}>{item.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#000', border: '1px solid rgba(34,197,94,0.25)' }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
              <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: '#22C55E' }}>Keep / build in-house</h2>
            </div>
            <div className="space-y-3">
              {KEEP.map((item) => (
                <div key={item.name} className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-sm font-bold text-white mb-1">{item.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: '#000', border: `1px solid ${GOLD}33` }}>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Morning creative flow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {[
              'National sources',
              'White-label rewrite',
              'Script parameters',
              'Google TTS dual-host',
              'Owned studio assemble',
            ].map((step, i) => (
              <div key={step} className="rounded-xl p-3 text-center" style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}33` }}>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>0{i + 1}</p>
                <p className="text-xs font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Full write-up: <code style={{ color: GOLD }}>DNN_INHOUSE_CREATIVE.md</code>
          </p>
        </div>

        {/* Prototype player */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: '#000', border: `1px solid ${GOLD}44` }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4" style={{ color: GOLD }} />
              <div>
                <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Live prototype</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {isLoading
                    ? 'Loading latest broadcast scripts…'
                    : latest
                      ? `Using scripts from ${latest.show_name || latest.id}`
                      : 'No broadcast found — playing default DNN sample scripts'}
                </p>
              </div>
            </div>
            {!playing ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full"
                style={{ background: GOLD, color: '#000' }}
              >
                <Radio className="w-3.5 h-3.5" /> Run in-house show
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <XCircle className="w-3.5 h-3.5" /> Reset player
              </button>
            )}
          </div>

          {playing ? (
            <InHouseMorningShowPlayer
              key={`${latest?.id || 'sample'}-${playing}`}
              introScript={show.intro}
              contentScript={show.content}
              outroScript={show.outro}
              bullets={show.bullets}
              headline={show.headline}
              onEnded={() => setPlaying(false)}
            />
          ) : (
            <div className="rounded-2xl flex items-center justify-center" style={{ aspectRatio: '16 / 9', background: '#111', border: '1px dashed rgba(212,175,55,0.25)' }}>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Press Run to assemble studio + dual hosts + Google TTS — zero HeyGen credits.
              </p>
            </div>
          )}
        </div>

        {/* Next actions */}
        <div className="rounded-2xl p-5" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Next build steps</h2>
          </div>
          <ol className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <li>1. Run this prototype against tomorrow’s approved Daily News Library scripts.</li>
            <li>2. Point `/dnn-news` playback at the in-house player when scripts are approved (HeyGen becomes fallback only).</li>
            <li>3. Change social posts to prefer the 1dnn.com watch link instead of Creatomate-baked MP4.</li>
            <li>4. After one clean week of mornings, disable `dnnAutoRender` HeyGen dispatch by default.</li>
          </ol>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/admin/dnn/daily-library" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: `1px solid ${GOLD}44` }}>
              Daily News Library →
            </Link>
            <Link to="/admin/dnn/script-studio" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Script Studio →
            </Link>
            <Link to="/admin/heygen-credits" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Credit Monitor →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
