import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Save, RefreshCw, Sparkles, Eye, FileText, Clapperboard,
  AlertCircle, Loader, Edit3, Trash2
} from 'lucide-react';
import ScriptStudioPreview from '@/components/dnn/ScriptStudioPreview';
import NationalNewsScriptBox from '@/components/dnn/NationalNewsScriptBox';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

export default function AdminScriptStudio() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);

  // Template editor state
  const [template, setTemplate] = useState(null);
  const [templateDirty, setTemplateDirty] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateMsg, setTemplateMsg] = useState(null);

  // Per-broadcast clip editing
  const [editingClips, setEditingClips] = useState(null);
  const [savingClips, setSavingClips] = useState(false);
  const [clipMsg, setClipMsg] = useState(null);

  // Generating
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role !== 'admin') {
        window.location.href = '/';
      } else {
        setIsAdmin(true);
      }
    }).catch(() => window.location.href = '/');
  }, []);

  // Fetch active template
  const { data: templates = [], isLoading: tplLoading } = useQuery({
    queryKey: ['broadcastTemplates'],
    queryFn: () => base44.entities.BroadcastTemplate.list('-version', 20),
    enabled: isAdmin,
  });

  // Fetch latest broadcast
  const { data: broadcasts = [], isLoading: bcLoading } = useQuery({
    queryKey: ['studioLatestBroadcast'],
    queryFn: () => base44.entities.DnnBroadcast.list('-broadcast_date', 5),
    refetchInterval: 30000,
    enabled: isAdmin,
  });

  const activeTemplate = templates.find(t => t.is_active) || templates[0];
  const latestBroadcast = broadcasts[0];

  // Sync template into editor when loaded
  useEffect(() => {
    if (activeTemplate && !template) {
      setTemplate({ ...activeTemplate });
    }
  }, [activeTemplate, template]);

  const todayDate = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles', weekday: 'long', month: 'long', day: 'numeric',
  });

  // Build a live preview of the open script with placeholders filled
  const storyTeasers = latestBroadcast?.headlines
    ? latestBroadcast.headlines.slice(0, 4).map((h, i) => `Story ${i + 1}: ${h}`).join('. ')
    : 'Story 1: [Today top headline]. Story 2: [Second headline]. Story 3: [Third headline].';

  const previewOpen = template?.open_script_template
    ? template.open_script_template.replace(/{DATE}/g, todayDate).replace(/{STORY_TEASERS}/g, storyTeasers)
    : '';
  const previewClose = template?.close_script_template
    ? template.close_script_template.replace(/{DATE}/g, todayDate)
    : '';

  const handleTemplateField = (field, value) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
    setTemplateDirty(true);
  };

  const handleSaveTemplate = async () => {
    setSavingTemplate(true);
    setTemplateMsg(null);
    try {
      await base44.entities.BroadcastTemplate.update(template.id, {
        open_script_template: template.open_script_template,
        close_script_template: template.close_script_template,
        bob_tone_guidelines: template.bob_tone_guidelines,
        open_word_count: template.open_word_count,
        close_word_count: template.close_word_count,
        notes: template.notes,
      });
      setTemplateDirty(false);
      setTemplateMsg({ type: 'success', text: 'Template saved. All future broadcasts will use this open/close.' });
      queryClient.invalidateQueries({ queryKey: ['broadcastTemplates'] });
    } catch (e) {
      setTemplateMsg({ type: 'error', text: e.message });
    }
    setSavingTemplate(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg(null);
    try {
      const res = await base44.functions.invoke('dnnMorningBroadcast', { action: 'generate' });
      if (res.data?.error) {
        setGenMsg({ type: 'error', text: res.data.error });
      } else {
        setGenMsg({ type: 'success', text: 'Script generated for today. Scroll down to review the clips.' });
        queryClient.invalidateQueries({ queryKey: ['studioLatestBroadcast'] });
      }
    } catch (e) {
      setGenMsg({ type: 'error', text: e.message });
    }
    setGenerating(false);
  };

  const startEditClips = () => {
    if (!latestBroadcast?.clips) return;
    setEditingClips(JSON.parse(JSON.stringify(latestBroadcast.clips)));
    setClipMsg(null);
  };

  const handleClipChange = (index, value) => {
    const updated = [...editingClips];
    updated[index] = { ...updated[index], script: value };
    setEditingClips(updated);
  };

  const handleSaveClips = async () => {
    setSavingClips(true);
    setClipMsg(null);
    try {
      await base44.entities.DnnBroadcast.update(latestBroadcast.id, { clips: editingClips });
      setClipMsg({ type: 'success', text: 'Clips updated. Re-render to produce the new video.' });
      setEditingClips(null);
      queryClient.invalidateQueries({ queryKey: ['studioLatestBroadcast'] });
    } catch (e) {
      setClipMsg({ type: 'error', text: e.message });
    }
    setSavingClips(false);
  };

  const [deletingBroadcast, setDeletingBroadcast] = useState(false);

  const handleDeleteBroadcast = async () => {
    if (!latestBroadcast) return;
    if (!confirm(`Delete ${latestBroadcast.show_name || 'this broadcast'} permanently?\n\nDate: ${latestBroadcast.broadcast_date}\n\nThis will remove all clips and scripts. This cannot be undone.`)) return;
    setDeletingBroadcast(true);
    try {
      await base44.entities.DnnBroadcast.delete(latestBroadcast.id);
      queryClient.invalidateQueries({ queryKey: ['studioLatestBroadcast'] });
    } catch (e) {
      setClipMsg({ type: 'error', text: e.message });
    }
    setDeletingBroadcast(false);
  };

  if (!isAdmin) return null;

  const clips = latestBroadcast?.clips || [];
  const hasRenderedVideo = clips.some(c => c.videoUrl);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(13,13,13,0.97)', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-4">
          <Link to="/admin/dnn/studio">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          </Link>
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Script Studio</p>
            <p className="text-[10px] tracking-widest uppercase text-slate-600">Edit open/close template + preview today broadcast</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/dnn/show-pipeline"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            <Clapperboard className="w-3 h-3" /> Show Pipeline
          </Link>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-4 space-y-4">
        {/* ── Row 0: Today's National Stories — script box for tonight's edits ── */}
        <NationalNewsScriptBox />

        {/* ── Row 1: Visual Previews — horizontal across the top ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4" style={{ color: GOLD }} />
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Visual Preview</p>
            <span className="text-[10px] text-slate-600">· {todayDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">OPEN — Charlie at desk</p>
              <ScriptStudioPreview label="OPEN" script={previewOpen} date={todayDate} speaker="charlie" />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">CLOSE — Charlie signs off</p>
              <ScriptStudioPreview label="CLOSE" script={previewClose} date={todayDate} speaker="charlie" />
            </div>
          </div>
        </div>

        {/* ── Row 2: Template Editor — 3 columns horizontal ── */}
        <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                {template?.is_active ? 'Active Template' : 'Template'}
              </p>
              {template?.template_name && (
                <span className="text-[10px] text-slate-500">v{template.version} · {template.template_name}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {templateMsg && (
                <p className="text-[10px]" style={{ color: templateMsg.type === 'success' ? '#4ade80' : '#f87171' }}>
                  {templateMsg.type === 'success' ? '✓ ' : '✗ '}{templateMsg.text}
                </p>
              )}
              {templateDirty && <span className="text-[9px] font-bold text-yellow-400 animate-pulse">● UNSAVED</span>}
              <button onClick={handleSaveTemplate} disabled={!templateDirty || savingTemplate}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-40"
                style={{ background: savingTemplate ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                {savingTemplate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {savingTemplate ? 'Saving…' : 'Save Template (Permanent)'}
              </button>
            </div>
          </div>

          {tplLoading || !template ? (
            <div className="flex justify-center py-8"><Loader className="w-5 h-5 animate-spin" style={{ color: GOLD }} /></div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 block">
                  Open Script <span className="text-yellow-600">{'{DATE}'} {'{STORY_TEASERS}'}</span>
                </label>
                <textarea
                  value={template.open_script_template || ''}
                  onChange={(e) => handleTemplateField('open_script_template', e.target.value)}
                  rows={10}
                  className="w-full rounded-lg p-3 text-[11px] text-white font-mono resize-y leading-relaxed"
                  style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', outline: 'none' }}
                  placeholder="Good day from the DNN news desk..."
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 block">
                  Close Script <span className="text-yellow-600">{'{DATE}'}</span>
                </label>
                <textarea
                  value={template.close_script_template || ''}
                  onChange={(e) => handleTemplateField('close_script_template', e.target.value)}
                  rows={10}
                  className="w-full rounded-lg p-3 text-[11px] text-white font-mono resize-y leading-relaxed"
                  style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', outline: 'none' }}
                  placeholder="That's your DNN brief..."
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 block">
                  Bob Tone Guidelines
                </label>
                <textarea
                  value={template.bob_tone_guidelines || ''}
                  onChange={(e) => handleTemplateField('bob_tone_guidelines', e.target.value)}
                  rows={10}
                  className="w-full rounded-lg p-3 text-[11px] text-white resize-y leading-relaxed"
                  style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', outline: 'none' }}
                  placeholder="Kinder, softer. Frame as suggestions..."
                />
                <p className="text-[9px] text-slate-600 leading-relaxed mt-2">
                  Saving updates the master template for all <b className="text-slate-400">future</b> broadcasts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Row 3: Today Broadcast Clips — horizontal scroll ── */}
        <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                Today Broadcast Clips
              </p>
              {latestBroadcast && (
                <span className="text-[10px] text-slate-500">
                  {latestBroadcast.broadcast_date} · {latestBroadcast.show_name || 'Show'} · {clips.length} clips
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!latestBroadcast && (
                <button onClick={handleGenerate} disabled={generating}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-50"
                  style={{ background: generating ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {generating ? 'Generating…' : 'Generate Today Script'}
                </button>
              )}
              {latestBroadcast && !editingClips && clips.length > 0 && (
                <button onClick={startEditClips}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                  style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <Edit3 className="w-3 h-3" /> Edit Clips (On-the-Fly)
                </button>
              )}
              {latestBroadcast && !editingClips && (
                <button onClick={handleDeleteBroadcast} disabled={deletingBroadcast}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                  {deletingBroadcast ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete Broadcast
                </button>
              )}
            </div>
          </div>

          {genMsg && (
            <div className="mb-3 rounded-lg p-2.5 text-[10px]"
              style={{
                background: genMsg.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${genMsg.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
                color: genMsg.type === 'success' ? '#4ade80' : '#f87171',
              }}>
              {genMsg.type === 'success' ? '✓ ' : '✗ '}{genMsg.text}
            </div>
          )}

          {bcLoading ? (
            <div className="flex justify-center py-8"><Loader className="w-5 h-5 animate-spin" style={{ color: GOLD }} /></div>
          ) : !latestBroadcast ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-600">No broadcast for today yet. Click "Generate Today Script" to create one.</p>
            </div>
          ) : clips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-600">No clips on this broadcast. Generate a script first.</p>
            </div>
          ) : editingClips ? (
            /* ── Edit mode — horizontal columns ── */
            <div>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {editingClips.map((clip, i) => (
                  <div key={i} className="rounded-xl p-3 shrink-0" style={{ width: '380px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: clip.role === 'charlie' ? 'rgba(212,175,55,0.15)' : 'rgba(147,112,219,0.15)',
                          color: clip.role === 'charlie' ? GOLD : '#A78BFA',
                        }}>
                        {clip.role}
                      </span>
                      <span className="text-[10px] text-slate-500">Clip #{i + 1}</span>
                      {clip.videoUrl && <span className="text-[9px] text-green-400">✓ rendered</span>}
                    </div>
                    <textarea
                      value={clip.script || ''}
                      onChange={(e) => handleClipChange(i, e.target.value)}
                      rows={12}
                      className="w-full rounded-lg p-3 text-[11px] text-white font-mono resize-y leading-relaxed"
                      style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {clipMsg && (
                  <p className="text-[10px]" style={{ color: clipMsg.type === 'success' ? '#4ade80' : '#f87171' }}>
                    {clipMsg.type === 'success' ? '✓ ' : '✗ '}{clipMsg.text}
                  </p>
                )}
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setEditingClips(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ background: '#333', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cancel
                  </button>
                  <button onClick={handleSaveClips} disabled={savingClips}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-50"
                    style={{ background: savingClips ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                    {savingClips ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    {savingClips ? 'Saving…' : 'Save Clips'}
                  </button>
                </div>
              </div>
              {hasRenderedVideo && (
                <div className="flex items-start gap-2 rounded-lg p-2.5 mt-2"
                  style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-yellow-300 leading-relaxed">
                    Some clips are already rendered. After saving, you will need to re-render the changed clips
                    from the Show Pipeline (extra HeyGen cost applies).
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ── Read-only clip view — horizontal columns ── */
            <div className="flex gap-4 overflow-x-auto pb-3">
              {clips.map((clip, i) => (
                <div key={i} className="rounded-xl p-3 shrink-0" style={{ width: '380px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: clip.role === 'charlie' ? 'rgba(212,175,55,0.15)' : 'rgba(147,112,219,0.15)',
                        color: clip.role === 'charlie' ? GOLD : '#A78BFA',
                      }}>
                      {clip.role}
                    </span>
                    <span className="text-[10px] text-slate-500">Clip #{i + 1}</span>
                    {clip.status === 'completed' && <span className="text-[9px] text-green-400">✓ rendered</span>}
                    {clip.status === 'rendering' && <span className="text-[9px] text-yellow-400">⏳ rendering</span>}
                    {clip.status === 'failed' && <span className="text-[9px] text-red-400">✗ failed</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap font-mono"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {clip.script || '(empty)'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}