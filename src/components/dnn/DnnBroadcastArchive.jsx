import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Play, Trash2, Pencil, X, Radio, Calendar, ChevronRight, Share2 } from 'lucide-react';
import DnnBroadcastShare from '@/components/dnn/DnnBroadcastShare';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; }
}

/**
 * DnnBroadcastArchive — grid of past + current completed DNN studio shows.
 * Click a card to play the composited studio MP4 in a modal. Admins get
 * edit (show name / headlines) and delete controls on each card.
 *
 * Props:
 *   limit       — cap the number of cards (used for the news-page preview)
 *   showViewAll — show a "View All" link to /dnn-archive
 */
export default function DnnBroadcastArchive({ limit, showViewAll }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => { if (u?.role === 'admin') setIsAdmin(true); }).catch(() => {});
  }, []);

  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['dnnBroadcastArchive'],
    queryFn: () => base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-show_number', 80),
    staleTime: 0,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const withVideo = broadcasts.filter(b => {
    const c = b.compositedVideoUrl;
    return (c && !String(c).startsWith('creatomate:pending:')) || (b.videoUrl && !String(b.videoUrl).startsWith('heygen:pending:'));
  });
  const urlOf = (b) => {
    const c = b.compositedVideoUrl;
    return (c && !String(c).startsWith('creatomate:pending:')) ? c : b.videoUrl;
  };
  const shown = limit ? withVideo.slice(0, limit) : withVideo;

  const handleDelete = async (id) => {
    if (!confirm('Delete this broadcast? It will be removed from the archive and the database.')) return;
    await base44.entities.DnnBroadcast.delete(id);
    queryClient.invalidateQueries({ queryKey: ['dnnBroadcastArchive'] });
    queryClient.invalidateQueries({ queryKey: ['featuredNewsBroadcast'] });
  };

  const startEdit = (b) => {
    setEditing(b);
    setEditForm({ show_name: b.show_name || '', headlines: (b.headlines || []).join('\n') });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await base44.entities.DnnBroadcast.update(editing.id, {
        show_name: editForm.show_name,
        headlines: editForm.headlines.split('\n').map(h => h.trim()).filter(Boolean),
      });
      queryClient.invalidateQueries({ queryKey: ['dnnBroadcastArchive'] });
      queryClient.invalidateQueries({ queryKey: ['featuredNewsBroadcast'] });
      setEditing(null);
    } finally { setSaving(false); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5" style={{ color: GOLD }} />
          <div>
            <h2 className="display-heading" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '0.2em', color: '#1a1a1a' }}>BROADCAST ARCHIVE</h2>
            <p className="text-xs" style={{ color: 'rgba(26,26,26,0.5)' }}>Past & current DNN studio shows</p>
          </div>
        </div>
        {showViewAll && (
          <Link to="/dnn-archive" className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-yellow-600 rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && shown.length === 0 && (
        <div className="text-center py-16">
          <Radio className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(212,175,55,0.3)' }} />
          <p className="text-sm" style={{ color: 'rgba(26,26,26,0.4)' }}>No broadcasts in the archive yet.</p>
        </div>
      )}

      {!isLoading && shown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map(b => {
            const u = urlOf(b);
            return (
              <div key={b.id} className="rounded-xl overflow-hidden group" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
                {/* Thumbnail */}
                <div className="relative w-full aspect-video cursor-pointer" onClick={() => setPlaying(b)} style={{ background: '#000' }}>
                  <img src={STUDIO_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: GOLD, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}>
                      <Play className="w-6 h-6 ml-1 text-black" fill="black" />
                    </div>
                  </div>
                  {/* Show bug */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.65)' }}>
                    <img src={DNN_LOGO} alt="DNN" className="h-4 w-auto" />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>{b.show_name || 'DNN'}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); setSharing(b); }} className="p-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.5)' }} title="Share"><Share2 className="w-3.5 h-3.5" style={{ color: GOLD }} /></button>
                    {isAdmin && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); startEdit(b); }} className="p-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #00ccff' }} title="Edit"><Pencil className="w-3.5 h-3.5" style={{ color: '#00ccff' }} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }} className="p-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #ff3333' }} title="Delete"><Trash2 className="w-3.5 h-3.5" style={{ color: '#ff3333' }} /></button>
                      </>
                    )}
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3 h-3" style={{ color: GOLD }} />
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{fmtDate(b.broadcast_date || b.published_at || b.created_date)}</span>
                  </div>
                  <p className="text-sm font-bold leading-snug line-clamp-2" style={{ color: '#fff' }}>{b.headlines?.[0] || b.show_name || 'DNN Broadcast'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Player modal — composited studio MP4 full-frame */}
      {playing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setPlaying(null)}>
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>{playing.show_name || 'DNN Broadcast'}</p>
                <p className="text-sm font-bold text-white">{playing.headlines?.[0] || ''}</p>
              </div>
              <button onClick={() => setPlaying(null)} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
              <video src={urlOf(playing)} controls autoPlay playsInline className="w-full h-full object-contain"
                onPlay={e => { document.querySelectorAll('video').forEach(v => { try { if (v !== e.currentTarget && !v.paused) v.pause(); } catch (_) {} }); }} />
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {sharing && (
        <DnnBroadcastShare broadcast={sharing} url={urlOf(sharing)} isAdmin={isAdmin} onClose={() => setSharing(null)} />
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setEditing(null)}>
          <div className="rounded-xl p-6 max-w-lg w-full" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Edit Broadcast</h3>
              <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 block mb-1 uppercase">Show Name</label>
                <input value={editForm.show_name} onChange={e => setEditForm({ ...editForm, show_name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)' }} />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 block mb-1 uppercase">Headlines (one per line)</label>
                <textarea value={editForm.headlines} onChange={e => setEditForm({ ...editForm, headlines: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg text-sm text-white resize-none focus:outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.2)' }} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={saveEdit} disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-black disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => setEditing(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-white/60" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}