import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw, Eye, FileText, Clapperboard, Loader } from 'lucide-react';
import ScriptStudioPreview from '@/components/dnn/ScriptStudioPreview';
import ScriptSequenceFlow from '@/components/dnn/ScriptSequenceFlow';

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

  // Build a live preview of the open/close script with placeholders filled —
  // reflects whatever is currently saved on today's broadcast sequence.
  const previewOpen = latestBroadcast?.intro_script || (template?.open_script_template
    ? template.open_script_template.replace(/{DATE}/g, todayDate).replace(/{STORY_TEASERS}/g, '[selected story headline]')
    : '');
  const previewContent = latestBroadcast?.content_script || '';
  const previewClose = latestBroadcast?.outro_script || (template?.close_script_template
    ? template.close_script_template.replace(/{DATE}/g, todayDate)
    : '');

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

  if (!isAdmin) return null;

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
            <p className="text-[10px] tracking-widest uppercase text-slate-600">Select today's story → build the show in order</p>
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

      <div className="max-w-[1200px] mx-auto px-4 py-4 space-y-4">
        {/* ── Step 1 & 2: pick today's story, build the sequence in order ── */}
        {bcLoading || tplLoading ? (
          <div className="flex justify-center py-8"><Loader className="w-5 h-5 animate-spin" style={{ color: GOLD }} /></div>
        ) : (
          <ScriptSequenceFlow
            template={template}
            latestBroadcast={latestBroadcast}
            todayDate={todayDate}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ['studioLatestBroadcast'] })}
          />
        )}

        {/* ── Visual Preview — shows the saved sequence exactly in broadcast order ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4" style={{ color: GOLD }} />
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Visual Preview — In Order</p>
            <span className="text-[10px] text-slate-600">· {todayDate}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">1. Opening — Charlie</p>
              <ScriptStudioPreview label="OPEN" script={previewOpen} date={todayDate} speaker="charlie" />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">2. Bob's Solution</p>
              <ScriptStudioPreview label="CONTENT" script={previewContent} date={todayDate} speaker="bob" />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">3. Outtake — Charlie</p>
              <ScriptStudioPreview label="OUTTAKE" script={previewClose} date={todayDate} speaker="charlie" />
            </div>
          </div>
        </div>

        {/* ── Template Editor — defaults used for the Opening/Outtake of every future show ── */}
        <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                {template?.is_active ? 'Active Template (defaults)' : 'Template'}
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
                  rows={8}
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
                  rows={8}
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
                  rows={8}
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
      </div>
    </div>
  );
}