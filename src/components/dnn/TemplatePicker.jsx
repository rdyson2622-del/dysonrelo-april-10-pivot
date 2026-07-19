import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle, AlertTriangle, RefreshCw, Image as ImageIcon, LayoutTemplate, Play } from 'lucide-react';

const GOLD = '#D4AF37';
const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

export default function TemplatePicker() {
  const queryClient = useQueryClient();
  const [assigning, setAssigning] = useState(null);
  const [assignMsg, setAssignMsg] = useState(null);
  const [testing, setTesting] = useState(null);
  const [testResults, setTestResults] = useState({});

  // Fetch available HeyGen templates
  const { data: templateList, isLoading: templatesLoading } = useQuery({
    queryKey: ['heygenTemplates'],
    queryFn: async () => {
      const res = await base44.functions.invoke('heygenListTemplates', {});
      return res.data;
    },
    refetchInterval: 60000,
  });

  // Fetch current golden master config
  const { data: goldenMaster } = useQuery({
    queryKey: ['goldenMasterLayout'],
    queryFn: () => base44.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID }),
    refetchInterval: 30000,
  });
  const golden = goldenMaster?.[0];
  const currentTemplateId = golden?.heygen_template_id;
  const bgUrl = golden?.background?.url;

  const templates = templateList?.templates || [];
  const currentMatch = templates.find(t => t.id === currentTemplateId);

  const handleTestRender = async (templateId, templateName) => {
    setTesting(templateId);
    setTestResults(prev => ({ ...prev, [templateId]: null }));
    try {
      // Find the most recent broadcast with a script
      const broadcasts = await base44.entities.DnnBroadcast.list('-broadcast_date', 20);
      const target = broadcasts.find(b => b.script);
      if (!target) {
        setTestResults(prev => ({ ...prev, [templateId]: { success: false, msg: 'No broadcast with a script found' } }));
        setTesting(null);
        return;
      }

      const res = await base44.functions.invoke('dnnStitchBroadcast', {
        action: 'start',
        broadcastId: target.id,
        templateId,
      });

      if (res.data?.success) {
        setTestResults(prev => ({ ...prev, [templateId]: { success: true, msg: `Render started — check pipeline for video` } }));
      } else {
        setTestResults(prev => ({ ...prev, [templateId]: { success: false, msg: res.data?.error || 'Render failed' } }));
      }
    } catch (e) {
      setTestResults(prev => ({ ...prev, [templateId]: { success: false, msg: e.message } }));
    }
    setTesting(null);
  };

  const handleAssign = async (templateId, templateName) => {
    setAssigning(templateId);
    setAssignMsg(null);
    try {
      await base44.entities.LayoutTemplate.update(MASTER_LAYOUT_ID, {
        heygen_template_id: templateId,
      });
      await queryClient.invalidateQueries({ queryKey: ['goldenMasterLayout'] });
      setAssignMsg({ success: true, msg: `Assigned "${templateName}" as golden master` });
    } catch (e) {
      setAssignMsg({ success: false, msg: e.message });
    }
    setAssigning(null);
  };

  return (
    <div className="px-6 py-4" style={{ background: 'rgba(212,175,55,0.04)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="flex items-center gap-2 mb-3">
        <LayoutTemplate className="w-4 h-4" style={{ color: GOLD }} />
        <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>HeyGen Template Manager</p>
        <span className="text-[10px] text-slate-500">— select which template is the golden master</span>
      </div>

      {/* Current config */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: currentMatch ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${currentMatch ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
          {currentMatch ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
          <div>
            <p className="text-[9px] font-black tracking-widest uppercase text-slate-500">Active Template ID</p>
            <p className="text-xs font-mono" style={{ color: currentMatch ? '#4ade80' : '#ef4444' }}>{currentTemplateId || 'NOT SET'}</p>
          </div>
        </div>
        {currentMatch && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[10px] text-slate-400">Name: <span className="font-bold text-white">{currentMatch.name}</span></p>
          </div>
        )}
        {bgUrl && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ImageIcon className="w-3 h-3" style={{ color: GOLD }} />
            <p className="text-[10px] text-slate-400">BG: <span className="text-slate-300">3-pillar studio</span></p>
          </div>
        )}
      </div>

      {/* Warning if current ID doesn't match any HeyGen template */}
      {currentTemplateId && !currentMatch && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-300">
            The template ID <code className="text-red-200 font-mono">{currentTemplateId}</code> does not exist in your HeyGen account.
            Select a template below to fix this.
          </p>
        </div>
      )}

      {/* Template grid */}
      {templatesLoading ? (
        <div className="flex items-center gap-2 py-3">
          <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
          <p className="text-xs text-slate-500">Loading templates from HeyGen…</p>
        </div>
      ) : templates.length === 0 ? (
        <p className="text-xs text-slate-500 py-3">No templates found in your HeyGen account.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((tpl) => {
            const isActive = tpl.id === currentTemplateId;
            return (
              <div key={tpl.id} className="rounded-lg overflow-hidden transition-all"
                style={{
                  background: isActive ? 'rgba(74,222,128,0.06)' : '#1a1a1a',
                  border: `1.5px solid ${isActive ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-white truncate">{tpl.name}</p>
                    {isActive && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                  </div>
                  <p className="text-[9px] font-mono text-slate-500 mb-2 truncate">{tpl.id}</p>
                  <div className="aspect-video rounded overflow-hidden mb-2 bg-black flex items-center justify-center">
                    {tpl.thumbnail_image_url || tpl.preview_image_url ? (
                      <img src={tpl.thumbnail_image_url || tpl.preview_image_url} alt={tpl.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                        <p className="text-[9px] text-slate-600">No preview</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAssign(tpl.id, tpl.name)}
                      disabled={isActive || assigning === tpl.id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40"
                      style={{
                        background: isActive ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg, #e8c84a, #D4AF37)',
                        color: isActive ? '#4ade80' : '#000',
                      }}>
                      {assigning === tpl.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                      {isActive ? '✓ ACTIVE' : 'Set as Master'}
                    </button>
                    <button
                      onClick={() => handleTestRender(tpl.id, tpl.name)}
                      disabled={testing === tpl.id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold text-white transition-all disabled:opacity-40"
                      style={{ background: '#333', border: '1px solid rgba(212,175,55,0.3)' }}>
                      {testing === tpl.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      Test Render
                    </button>
                  </div>
                  {testResults[tpl.id] && (
                    <p className={`text-[9px] mt-1.5 ${testResults[tpl.id].success ? 'text-green-400' : 'text-red-400'}`}>
                      {testResults[tpl.id].success ? '✓' : '✗'} {testResults[tpl.id].msg}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign result */}
      {assignMsg && (
        <p className={`text-[10px] mt-2 ${assignMsg.success ? 'text-green-400' : 'text-red-400'}`}>
          {assignMsg.success ? '✓' : '✗'} {assignMsg.msg}
        </p>
      )}
    </div>
  );
}