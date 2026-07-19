import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Layers, Plus, RefreshCw, Lock, AlertTriangle, Film, Zap } from 'lucide-react';
import LayoutTemplateCard from '@/components/dnn/LayoutTemplateCard';
import LayoutEditor from '@/components/dnn/LayoutEditor';

const GOLD = '#D4AF37';

/**
 * AdminLayoutLibrary — the centralized "Layout Library" where all visual
 * parameters for DNN broadcasts are managed.
 *
 * This is the single source of truth for:
 *   - Studio backdrop images/videos
 *   - Presenter (Charlie/Bob) positions, scale, alignment
 *   - Solution panel dimensions, colors, fonts, text alignment
 *   - Output video dimensions
 *
 * dnnStitchBroadcast pulls from the "approved" template here for every render,
 * ensuring visual consistency across all shows and affiliate agent campaigns.
 *
 * Golden Master workflow:
 *   1. Capture a reference video that looks perfect
 *   2. Create a LayoutTemplate record with the exact coordinates
 *   3. Click "Set as Golden Master" to mark it approved
 *   4. All future renders use these exact parameters
 */
export default function AdminLayoutLibrary() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role !== 'admin') {
        window.location.href = '/';
      } else {
        setIsAdmin(true);
      }
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['layoutTemplates'],
    queryFn: () => base44.entities.LayoutTemplate.list('-created_date', 50),
    enabled: isAdmin,
  });

  const approvedCount = templates.filter(t => t.status === 'approved').length;
  const goldenMaster = templates.find(t => t.status === 'approved');

  const handleCreate = async () => {
    setCreating(true);
    try {
      await base44.entities.LayoutTemplate.create({
        template_name: 'New Layout Template',
        status: 'draft',
        reference_video_url: '',
        background: { type: 'image', url: '', description: '' },
        presenter_1: {
          label: 'Charlie', type: 'avatar', heygen_id: '', voice_id: '',
          scale: 0.55, offset_x: -0.25, offset_y: 0.2, alignment: 'left',
        },
        presenter_2: {
          label: 'Bob', type: 'talking_photo', heygen_id: '', voice_id: '',
          scale: 0.55, offset_x: 0.25, offset_y: 0.2, alignment: 'right',
        },
        dual_presenter_mode: true,
        solution_panel: {
          enabled: true, background_color: '#ffffff', border_color: '#D4AF37',
          border_width_px: 2, border_radius_px: 14, position: 'upper_center',
          width_percent: 50, title_color: '#1a1a1a', title_font_family: 'Cormorant Garamond, serif',
          title_font_weight: 'bold', bullet_color: '#2a2a2a', bullet_marker_color: '#D4AF37',
          text_alignment: 'center',
        },
        video_dimensions: { width: 1280, height: 720 },
        notes: 'New template — configure all parameters then set as Golden Master.',
      });
      queryClient.invalidateQueries({ queryKey: ['layoutTemplates'] });
    } catch (e) {
      setRefreshMsg(`Error: ${e.message}`);
    }
    setCreating(false);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['layoutTemplates'] });
    setRefreshMsg('Layout library refreshed');
    setTimeout(() => setRefreshMsg(null), 2000);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Layers className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Layout Library</p>
            <p className="text-[10px] text-slate-500">Centralized visual parameters — the single source of truth for all broadcast layouts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {refreshMsg && <span className="text-[10px] text-slate-400">{refreshMsg}</span>}
          <button onClick={handleRefresh}
            className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-white transition-all"
            style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={handleCreate} disabled={creating}
            className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            New Layout
          </button>
        </div>
      </div>

      {/* Golden Master Banner */}
      {goldenMaster ? (
        <div className="px-6 py-3 flex items-center gap-3"
          style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
          <Lock className="w-4 h-4" style={{ color: GOLD }} />
          <p className="text-xs text-slate-300">
            <span className="font-bold" style={{ color: GOLD }}>{goldenMaster.template_name}</span>
            {' is the active Golden Master — all renders pull from this template.'}
          </p>
          {goldenMaster.reference_video_url && (
            <a href={goldenMaster.reference_video_url} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
              <Film className="w-3 h-3" /> View Reference
            </a>
          )}
        </div>
      ) : (
        <div className="px-6 py-3 flex items-center gap-3"
          style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-xs text-red-300">
            <span className="font-bold">No Golden Master approved.</span>
            {' Approve a layout template to lock visual consistency for all renders.'}
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-6 text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" style={{ color: GOLD }} /> Renders pull from approved template</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" style={{ color: GOLD }} /> Only one Golden Master at a time</span>
          <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" style={{ color: GOLD }} /> Changes here update all future shows</span>
        </div>
      </div>

      {/* Visual Layout Editor — drag & drop positioning for Jay Chavez */}
      <LayoutEditor />

      {/* Template cards */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <Layers className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No layout templates yet.</p>
            <p className="text-slate-600 text-xs mt-1">Click "New Layout" to create your first template.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map(t => (
              <LayoutTemplateCard
                key={t.id}
                template={t}
                onSave={() => queryClient.invalidateQueries({ queryKey: ['layoutTemplates'] })}
                onStatusChange={() => queryClient.invalidateQueries({ queryKey: ['layoutTemplates'] })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}