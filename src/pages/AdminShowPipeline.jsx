import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  RefreshCw, Play, ChevronDown, ChevronRight,
  FileText, Clapperboard, Film, CheckCircle, XCircle, Clock, Edit3,
  Sparkles, Layers, Plus, Loader2
} from 'lucide-react';
import ShowPipelineCard from '@/components/dnn/ShowPipelineCard';
import ScriptEditorModal from '@/components/dnn/ScriptEditorModal';

const GOLD = '#D4AF37';
const DNN_LOGO = "https://qtrypzzcjebvfcihihnt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

export default function AdminShowPipeline() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setRefreshMsg(null);
    try {
      const res = await base44.functions.invoke('dnnMorningBroadcast', { action: 'run' });
      if (res.data?.success) {
        setRefreshMsg('✓ HeyGen show dispatched — rendering');
      } else {
        setRefreshMsg(`✗ ${res.data?.error || 'Dispatch failed'}`);
      }
      queryClient.invalidateQueries({ queryKey: ['showPipelineBroadcasts'] });
    } catch (e) {
      setRefreshMsg(`✗ ${e.message}`);
    }
    setGenerating(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg(null);
    try {
      // 1. Poll HeyGen for clip render completions
      let renderMsg = '';
      try {
        const renderRes = await base44.functions.invoke('dnnMorningBroadcast', { action: 'check' });
        renderMsg = renderRes.data?.checked?.length ? `Renders: ${renderRes.data.checked.length} checked` : '';
      } catch (e) { renderMsg = `Render check: ${e.message}`; }

      // 2. Poll HeyGen for stitching completions
      let stitchMsg = '';
      try {
        const stitchRes = await base44.functions.invoke('dnnStitchBroadcast', { action: 'check' });
        stitchMsg = stitchRes.data?.checked?.length ? `Stitch: ${stitchRes.data.checked.length} checked` : '';
      } catch (e) { stitchMsg = `Stitch check: ${e.message}`; }

      // 3. Invalidate all cached queries so the UI picks up DB changes
      queryClient.invalidateQueries({ queryKey: ['showPipelineBroadcasts'] });
      queryClient.invalidateQueries({ queryKey: ['heygenQuota'] });

      setRefreshMsg(`${renderMsg}${renderMsg && stitchMsg ? ' · ' : ''}${stitchMsg}`.trim() || 'All queries refreshed');
    } catch (error) {
      setRefreshMsg(`Error: ${error.message}`);
    }
    setRefreshing(false);
  };

  // Fetch all broadcasts (newest first)
  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['showPipelineBroadcasts'],
    queryFn: () => base44.entities.DnnBroadcast.list('-broadcast_date', 50),
    refetchInterval: 15000,
    enabled: isAdmin,
  });

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Show Production Pipeline</p>
            <p className="text-[10px] text-slate-500">Step through each show — accumulate, select, script, render, stitch, preview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {refreshMsg && (
            <span className="text-[10px] text-slate-400 max-w-xs truncate">{refreshMsg}</span>
          )}
          <div className="flex items-center gap-2">
            <button onClick={handleGenerate} disabled={generating}
              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}
              title="Generate a new daily show using the HeyGen pipeline">
              {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              {generating ? 'Dispatching…' : '⚡ Generate Daily Show'}
            </button>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-white transition-opacity disabled:opacity-50"
              style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline shows */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">No shows yet. Run the morning broadcast to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {broadcasts.map(show => (
              <ShowPipelineCard
                key={show.id}
                show={show}
                onEditScript={() => setEditingShow(show)}
                onRefresh={() => queryClient.invalidateQueries({ queryKey: ['showPipelineBroadcasts'] })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Script Editor Modal */}
      {editingShow && (
        <ScriptEditorModal
          show={editingShow}
          onClose={() => setEditingShow(null)}
          onSaved={() => {
            setEditingShow(null);
            queryClient.invalidateQueries({ queryKey: ['showPipelineBroadcasts'] });
          }}
        />
      )}
    </div>
  );
}