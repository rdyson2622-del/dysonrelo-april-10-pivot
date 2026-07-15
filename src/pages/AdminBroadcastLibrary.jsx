import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Play, Download, RefreshCw, Radio, Calendar, Clock, FileText,
  CheckCircle, XCircle, ExternalLink, Volume2
} from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = "https://qtrypzzcjebvfcihihnt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const StatusBadge = ({ status }) => {
  const map = {
    draft: { label: 'Draft', color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
    script_ready: { label: 'Script Ready', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    rendering: { label: 'Rendering', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
    completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  };
  const s = map[status] || map.draft;
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}30` }}>
      {s.label}
    </span>
  );
};

const ShowLibraryCard = ({ show }) => {
  const [playing, setPlaying] = useState(false);
  const videoUrl = show.videoUrl;
  const showLabel = show.show_name || `Show ${show.show_number}`;
  const showNum = show.show_number || '?';

  return (
    <div className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
      style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)' }}>
      {/* Show number banner */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)', color: '#000' }}>
            {showNum}
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">{showLabel}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Calendar className="w-2.5 h-2.5 text-slate-500" />
              <p className="text-[10px] text-slate-500">{show.broadcast_date}</p>
            </div>
          </div>
        </div>
        <StatusBadge status={show.status} />
      </div>

      {/* Video player / placeholder */}
      <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
        {videoUrl ? (
          playing ? (
            <video src={videoUrl} controls autoPlay className="w-full h-full" />
          ) : (
            <button onClick={() => setPlaying(true)}
              className="w-full h-full flex items-center justify-center group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(212,175,55,0.9)' }}>
                  <Play className="w-6 h-6 text-black" fill="black" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Click to play</p>
              </div>
            </button>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Radio className="w-8 h-8 text-slate-700" />
            <p className="text-[10px] text-slate-600">No video available yet</p>
          </div>
        )}
      </div>

      {/* Headlines */}
      {show.headlines && show.headlines.length > 0 && (
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-600 mb-2 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" /> Headlines
          </p>
          <ul className="space-y-1">
            {show.headlines.slice(0, 3).map((h, i) => (
              <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span style={{ color: GOLD }}>•</span>
                <span className="line-clamp-2">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2.5 flex items-center gap-2">
        {videoUrl && (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" download
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-black transition-all hover:opacity-80"
            style={{ background: GOLD }}>
            <Download className="w-3 h-3" /> MP4
          </a>
        )}
        {videoUrl && (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-slate-300 transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <ExternalLink className="w-3 h-3" /> Open
          </a>
        )}
        {show.duration_seconds && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
            <Clock className="w-2.5 h-2.5" />
            {Math.floor(show.duration_seconds / 60)}:{String(Math.floor(show.duration_seconds % 60)).padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  );
};

export default function AdminBroadcastLibrary() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);

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
    queryKey: ['broadcastLibrary'],
    queryFn: () => base44.entities.DnnBroadcast.list('-show_number', 50),
    enabled: isAdmin,
  });

  const { data: libEntries = [] } = useQuery({
    queryKey: ['broadcastLibraryVideoLib'],
    queryFn: () => base44.entities.VideoLibrary.filter({ category: 'broadcast' }),
    enabled: isAdmin,
  });

  const completedShows = broadcasts.filter(b => b.videoUrl);
  const pendingShows = broadcasts.filter(b => !b.videoUrl);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Broadcast Library</p>
            <p className="text-[10px] text-slate-500">All shows organized by name and number — video, headlines, and downloads</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['broadcastLibrary'] })}
            className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-opacity"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-6 py-3 flex items-center gap-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
        <div>
          <p className="text-[9px] font-black tracking-widest uppercase text-slate-500">Total Shows</p>
          <p className="text-lg font-black" style={{ color: GOLD, fontFamily: 'Cormorant Garamond, serif' }}>{broadcasts.length}</p>
        </div>
        <div>
          <p className="text-[9px] font-black tracking-widest uppercase text-slate-500">Completed</p>
          <p className="text-lg font-black text-green-400" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{completedShows.length}</p>
        </div>
        <div>
          <p className="text-[9px] font-black tracking-widest uppercase text-slate-500">In Progress</p>
          <p className="text-lg font-black text-slate-300" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{pendingShows.length}</p>
        </div>
      </div>

      {/* Library grid */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-20">
            <Radio className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No shows yet. The library will populate as shows are produced.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {broadcasts.map(show => (
              <ShowLibraryCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}