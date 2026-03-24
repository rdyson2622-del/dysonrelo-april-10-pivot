import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Check, X, Search, MessageCircle, ToggleLeft, ToggleRight, Volume2, Square, Copy, History, Mic } from 'lucide-react';
import { speakAsCharlie, stopCharlie } from '../components/charlie/charlieVoice';

const GOLD = '#D4AF37';

const TYPE_COLORS = {
  greeting:      'bg-blue-100 text-blue-700',
  response:      'bg-emerald-100 text-emerald-700',
  gate:          'bg-amber-100 text-amber-700',
  cta:           'bg-purple-100 text-purple-700',
  fallback:      'bg-slate-100 text-slate-600',
  system_prompt: 'bg-red-100 text-red-700',
};

const BLANK = {
  page_code: '',
  page_name: '',
  context: '',
  script_text: '',
  script_type: 'response',
  is_active: true,
  notes: '',
};

export default function AdminCharlieScripts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterCode, setFilterCode] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [adding, setAdding] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [testText, setTestText] = useState('');
  const [testPlaying, setTestPlaying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { data: scripts = [], isLoading, error } = useQuery({
    queryKey: ['charlie-scripts'],
    queryFn: async () => {
      const result = await base44.entities.CharlieScript.list('-updated_date', 200);
      console.log('Charlie Scripts loaded:', result);
      return result;
    },
  });

  React.useEffect(() => {
    if (error) console.error('Scripts query error:', error);
  }, [error]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const me = await base44.auth.me();
      const payload = { ...data, last_edited_by: me?.email || 'admin' };
      if (data.id) return base44.entities.CharlieScript.update(data.id, payload);
      return base44.entities.CharlieScript.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['charlie-scripts'] });
      setEditing(false);
      setAdding(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CharlieScript.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['charlie-scripts'] });
      setSelected(null);
    },
  });

  const duplicateScript = (script) => {
    const { id, created_date, updated_date, ...rest } = script;
    setForm({ ...rest, page_name: rest.page_name + ' (copy)', page_number: null });
    setAdding(true);
    setEditing(false);
    setSelected(null);
  };

  const toggleActive = (script) => {
    base44.entities.CharlieScript.update(script.id, { is_active: !script.is_active })
      .then(() => qc.invalidateQueries({ queryKey: ['charlie-scripts'] }));
  };

  // Unique page codes for filter tabs
  const pageCodes = ['ALL', ...Array.from(new Set(scripts.map(s => s.page_code))).sort()];

  const filtered = scripts.filter(s => {
    const matchCode = filterCode === 'ALL' || s.page_code === filterCode;
    const q = search.toLowerCase();
    const matchSearch = !q || s.page_name?.toLowerCase().includes(q) ||
      s.script_text?.toLowerCase().includes(q) || s.page_code?.toLowerCase().includes(q);
    return matchCode && matchSearch;
  });

  const startEdit = (script) => {
    setForm({ ...script });
    setEditing(true);
    setAdding(false);
  };

  const startAdd = () => {
    setForm(BLANK);
    setAdding(true);
    setEditing(false);
    setSelected(null);
  };

  const cancelForm = () => { setEditing(false); setAdding(false); };

  return (
    <div id="205" className="min-h-screen" style={{ background: '#f4f4f4' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
        style={{ background: '#000', borderBottom: `1px solid rgba(212,175,55,0.2)` }}>
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5" style={{ color: GOLD }} />
          <div>
            <h1 className="font-bold text-white text-sm tracking-wide">CHARLIE'S SCRIPTS</h1>
            <p className="text-xs" style={{ color: GOLD }}>Review & edit every script Charlie delivers</p>
          </div>
        </div>
        <Button onClick={startAdd} className="gap-2 text-sm font-bold"
          style={{ background: GOLD, color: '#000' }}>
          <Plus className="w-4 h-4" /> Add Script
        </Button>
      </header>

      <div className="flex h-[calc(100vh-65px)]">

        {/* LEFT — list */}
        <div className="w-80 shrink-0 flex flex-col border-r border-slate-200 bg-white overflow-hidden">

          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search scripts..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm" />
            </div>
          </div>

          {/* Page code filter tabs */}
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-slate-100">
            {pageCodes.map(code => (
              <button key={code} onClick={() => setFilterCode(code)}
                className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                style={{
                  background: filterCode === code ? GOLD : '#f0f0f0',
                  color: filterCode === code ? '#000' : '#555',
                }}>
                {code}
              </button>
            ))}
          </div>

          {/* Script list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No scripts found</div>
            )}
            {filtered.map(script => (
              <button key={script.id} onClick={() => { setSelected(script); setEditing(false); setAdding(false); setTestText(''); setShowHistory(false); stopCharlie(); setPlaying(false); setTestPlaying(false); }}
                className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-all hover:bg-slate-50 ${selected?.id === script.id ? 'bg-amber-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {script.page_number != null && (
                        <span className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                          #{script.page_number}
                        </span>
                      )}
                      <span className="text-xs font-black tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#8B6914' }}>
                        {script.page_code}
                      </span>
                      {!script.is_active && (
                        <span className="text-xs text-slate-400 italic">inactive</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{script.page_name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{script.context}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${TYPE_COLORS[script.script_type] || 'bg-slate-100 text-slate-600'}`}>
                    {script.script_type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — detail / edit / add */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ADD FORM */}
          {adding && (
            <ScriptForm form={form} setForm={setForm} onSave={() => saveMutation.mutate(form)}
              onCancel={cancelForm} saving={saveMutation.isPending} title="New Script" />
          )}

          {/* EDIT FORM */}
          {editing && selected && (
            <ScriptForm form={form} setForm={setForm} onSave={() => saveMutation.mutate(form)}
              onCancel={cancelForm} saving={saveMutation.isPending} title="Edit Script"
              onDelete={() => { if (confirm('Delete this script?')) deleteMutation.mutate(selected.id); }} />
          )}

          {/* VIEW DETAIL */}
          {!adding && !editing && selected && (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {selected.page_number != null && (
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                        #{selected.page_number}
                      </span>
                    )}
                    <span className="text-xs font-black tracking-widest px-2 py-0.5 rounded"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#8B6914' }}>
                      {selected.page_code}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[selected.script_type]}`}>
                      {selected.script_type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{selected.page_name}</h2>
                  {selected.context && <p className="text-sm text-slate-500 mt-0.5">Context: {selected.context}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(selected)} className="gap-1.5">
                    {selected.is_active ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                    {selected.is_active ? 'Active' : 'Inactive'}
                  </Button>
                  <Button size="sm" variant="outline"
                    onClick={() => {
                      if (playing) {
                        stopCharlie();
                        setPlaying(false);
                      } else {
                        speakAsCharlie(selected.script_text, () => setPlaying(true), () => setPlaying(false));
                      }
                    }}
                    className="gap-1.5"
                    style={{ borderColor: playing ? '#ef4444' : GOLD, color: playing ? '#ef4444' : '#8B6914' }}>
                    {playing ? <><Square className="w-3.5 h-3.5" /> Stop</> : <><Volume2 className="w-3.5 h-3.5" /> Preview Voice</>}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => duplicateScript(selected)} className="gap-1.5">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowHistory(h => !h)} className="gap-1.5"
                    style={{ borderColor: showHistory ? GOLD : undefined, color: showHistory ? '#8B6914' : undefined }}>
                    <History className="w-3.5 h-3.5" /> History
                  </Button>
                  <Button size="sm" onClick={() => startEdit(selected)} className="gap-1.5"
                    style={{ background: GOLD, color: '#000' }}>
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: '#0d0d0d', color: '#f5f5f5', fontFamily: 'monospace', border: `1px solid ${GOLD}33` }}>
                {selected.script_text}
              </div>

              {selected.notes && (
                <div className="rounded-lg p-3 bg-amber-50 border border-amber-100 text-sm text-amber-800">
                  <strong>Notes:</strong> {selected.notes}
                </div>
              )}
              {/* Change History */}
              {showHistory && (
                <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <p className="text-xs font-bold text-slate-600 tracking-wide">CHANGE HISTORY</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {selected.last_edited_by ? (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{selected.last_edited_by}</p>
                          <p className="text-xs text-slate-400">
                            Last updated {selected.updated_date ? new Date(selected.updated_date).toLocaleString() : 'unknown'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No edit history recorded yet.</p>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-600">Script created</p>
                        <p className="text-xs text-slate-400">
                          {selected.created_date ? new Date(selected.created_date).toLocaleString() : 'unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Voice Tester */}
              <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-slate-500" />
                  <p className="text-xs font-bold text-slate-600 tracking-wide">TEST CHARLIE'S VOICE</p>
                </div>
                <div className="p-4 space-y-3">
                  <textarea
                    value={testText}
                    onChange={e => setTestText(e.target.value)}
                    placeholder="Type any text here to hear how Charlie sounds before saving..."
                    rows={3}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"
                      onClick={() => {
                        if (testPlaying) { stopCharlie(); setTestPlaying(false); }
                        else speakAsCharlie(testText || selected.script_text, () => setTestPlaying(true), () => setTestPlaying(false));
                      }}
                      disabled={!testText && !selected.script_text}
                      className="gap-1.5"
                      style={{ borderColor: testPlaying ? '#ef4444' : GOLD, color: testPlaying ? '#ef4444' : '#8B6914' }}>
                      {testPlaying ? <><Square className="w-3.5 h-3.5" /> Stop</> : <><Volume2 className="w-3.5 h-3.5" /> {testText ? 'Play Custom Text' : 'Play Script'}</>}
                    </Button>
                    {testText && (
                      <Button size="sm" variant="ghost" onClick={() => setTestText('')} className="text-slate-400 text-xs">
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {selected.last_edited_by && (
                <p className="text-xs text-slate-400 mt-3">Last edited by: {selected.last_edited_by}</p>
              )}
            </motion.div>
          )}

          {/* Empty state */}
          {!adding && !editing && !selected && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Select a script to view or edit it</p>
              <p className="text-xs mt-1">Or click "Add Script" to create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScriptForm({ form, setForm, onSave, onCancel, saving, title, onDelete }) {
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <div className="flex gap-2">
          {onDelete && (
            <Button size="sm" variant="outline" onClick={onDelete} className="text-red-500 border-red-200 hover:bg-red-50">
              Delete
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onCancel}><X className="w-3.5 h-3.5" /></Button>
          <Button size="sm" onClick={onSave} disabled={saving} className="gap-1.5"
            style={{ background: '#D4AF37', color: '#000' }}>
            <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">PAGE NUMBER</label>
            <Input type="number" value={form.page_number ?? ''} onChange={e => set('page_number', e.target.value === '' ? null : Number(e.target.value))}
              placeholder="e.g. 1" className="font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">PAGE CODE *</label>
            <Input value={form.page_code} onChange={e => set('page_code', e.target.value.toUpperCase())}
              placeholder="e.g. HOME, GATE-1" className="font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">SCRIPT TYPE *</label>
            <select value={form.script_type} onChange={e => set('script_type', e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
              {['greeting','response','gate','cta','fallback','system_prompt'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">PAGE NAME *</label>
          <Input value={form.page_name} onChange={e => set('page_name', e.target.value)}
            placeholder="e.g. Home Hero, Commitment Gate Step 1" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">CONTEXT / TRIGGER</label>
          <Input value={form.context} onChange={e => set('context', e.target.value)}
            placeholder="When is this script shown or spoken?" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">SCRIPT TEXT *</label>
          <textarea value={form.script_text} onChange={e => set('script_text', e.target.value)}
            rows={8} placeholder="The full script Charlie delivers..."
            className="w-full rounded-md border border-input px-3 py-2 text-sm leading-relaxed resize-y"
            style={{ fontFamily: 'monospace', minHeight: 160 }} />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">INTERNAL NOTES</label>
          <Input value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Why was this changed? What does it do?" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" checked={form.is_active}
            onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
          <label htmlFor="is_active" className="text-sm text-slate-700">Active (Charlie will use this script)</label>
        </div>
      </div>
    </div>
  );
}