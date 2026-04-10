import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Edit2, Plus, MessageSquare, Search, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const GOLD = '#D4AF37';

const SCRIPT_TYPE_COLORS = {
  greeting: '#4ade80',
  response: '#60a5fa',
  gate: '#f472b6',
  cta: GOLD,
  fallback: '#f87171',
  system_prompt: '#a78bfa',
};

const EMPTY_FORM = {
  page_number: '',
  page_code: '',
  page_name: '',
  context: '',
  script_text: '',
  script_type: 'response',
  is_active: true,
  notes: '',
};

export default function AdminCharlieScripts() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingScript, setEditingScript] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.CharlieScript.list('-updated_date', 200);
    setScripts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = scripts.filter(s => {
    const matchSearch = !searchTerm ||
      s.page_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.page_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.script_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.context?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || s.script_type === filterType;
    return matchSearch && matchType;
  });

  const handleSave = async () => {
    setSaving(true);
    const { id, created_date, updated_date, created_by, ...fields } = editingScript;
    if (id) {
      await base44.entities.CharlieScript.update(id, fields);
    } else {
      await base44.entities.CharlieScript.create(fields);
    }
    setSaving(false);
    setEditingScript(null);
    load();
  };

  const handleToggleActive = async (script) => {
    await base44.entities.CharlieScript.update(script.id, { is_active: !script.is_active });
    setScripts(prev => prev.map(s => s.id === script.id ? { ...s, is_active: !s.is_active } : s));
  };

  const SCRIPT_TYPES = ['greeting', 'response', 'gate', 'cta', 'fallback', 'system_prompt'];

  return (
    <div className="p-6 min-h-screen" style={{ background: '#808080', color: '#fff' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare style={{ color: GOLD }} /> CHARLIE'S SCRIPTS
          </h1>
          <p className="text-sm mt-1" style={{ color: '#999' }}>Review & edit every script Charlie delivers</p>
        </div>
        <button
          onClick={() => setEditingScript({ ...EMPTY_FORM })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all hover:opacity-80"
          style={{ background: GOLD, color: '#000' }}
        >
          <Plus size={18} /> Add Script
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: '#666' }} />
          <input
            type="text"
            placeholder="Search scripts by code, name, content..."
            className="w-full rounded-lg py-2 pl-10 pr-4 outline-none transition-all"
            style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
            onFocus={e => e.target.style.borderColor = GOLD}
            onBlur={e => e.target.style.borderColor = '#333'}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...SCRIPT_TYPES].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
              style={{
                background: filterType === t ? GOLD : '#1a1a1a',
                color: filterType === t ? '#000' : '#aaa',
                border: `1px solid ${filterType === t ? GOLD : '#333'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 text-xs text-gray-500">
        <span>{scripts.length} total</span>
        <span>{scripts.filter(s => s.is_active).length} active</span>
        <span>{filtered.length} shown</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading scripts...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No scripts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(script => (
            <div
              key={script.id}
              className="rounded-xl p-5 transition-all"
              style={{
                background: '#1a1a1a',
                border: `1px solid ${script.is_active ? 'rgba(212,175,55,0.2)' : '#2a2a2a'}`,
                opacity: script.is_active ? 1 : 0.55,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#000', color: GOLD, border: `1px solid ${GOLD}33` }}>
                    {script.page_code || '—'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold capitalize" style={{ background: '#111', color: SCRIPT_TYPE_COLORS[script.script_type] || '#aaa', border: `1px solid ${SCRIPT_TYPE_COLORS[script.script_type] || '#333'}33` }}>
                    {script.script_type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggleActive(script)} title={script.is_active ? 'Deactivate' : 'Activate'}>
                    {script.is_active
                      ? <ToggleRight size={18} style={{ color: GOLD }} />
                      : <ToggleLeft size={18} style={{ color: '#555' }} />}
                  </button>
                  <button onClick={() => setEditingScript({ ...script })} className="hover:opacity-70 transition-opacity">
                    <Edit2 size={15} style={{ color: '#aaa' }} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1" style={{ color: '#fff' }}>{script.page_name || 'Untitled'}</h3>
              {script.context && (
                <p className="text-xs mb-2" style={{ color: '#888' }}>📍 {script.context}</p>
              )}
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#ccc' }}>
                "{script.script_text}"
              </p>
              {script.notes && (
                <p className="text-xs mt-2 italic" style={{ color: '#666' }}>📝 {script.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}44` }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #333' }}>
              <h2 className="font-bold text-lg" style={{ color: GOLD }}>
                {editingScript.id ? 'Edit Script' : 'New Script'}
              </h2>
              <button onClick={() => setEditingScript(null)}><X size={20} style={{ color: '#aaa' }} /></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Page Number" value={editingScript.page_number} onChange={v => setEditingScript(p => ({ ...p, page_number: v }))} placeholder="e.g. 1" />
                <Field label="Page Code *" value={editingScript.page_code} onChange={v => setEditingScript(p => ({ ...p, page_code: v }))} placeholder="e.g. HOME" />
              </div>
              <Field label="Page Name *" value={editingScript.page_name} onChange={v => setEditingScript(p => ({ ...p, page_name: v }))} placeholder="e.g. Home Hero" />
              <Field label="Context (when triggered)" value={editingScript.context} onChange={v => setEditingScript(p => ({ ...p, context: v }))} placeholder="e.g. On page load" />

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: '#aaa' }}>Script Type *</label>
                <select
                  value={editingScript.script_type}
                  onChange={e => setEditingScript(p => ({ ...p, script_type: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 outline-none"
                  style={{ background: '#111', border: '1px solid #333', color: '#fff' }}
                >
                  {SCRIPT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: '#aaa' }}>Script Text *</label>
                <textarea
                  rows={6}
                  value={editingScript.script_text}
                  onChange={e => setEditingScript(p => ({ ...p, script_text: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 outline-none resize-none"
                  style={{ background: '#111', border: '1px solid #333', color: '#fff' }}
                  placeholder="The full script Charlie delivers..."
                />
              </div>

              <Field label="Internal Notes" value={editingScript.notes} onChange={v => setEditingScript(p => ({ ...p, notes: v }))} placeholder="Why this script exists, recent changes..." />

              <div className="flex items-center gap-3">
                <button onClick={() => setEditingScript(p => ({ ...p, is_active: !p.is_active }))} >
                  {editingScript.is_active
                    ? <ToggleRight size={24} style={{ color: GOLD }} />
                    : <ToggleLeft size={24} style={{ color: '#555' }} />}
                </button>
                <span className="text-sm" style={{ color: editingScript.is_active ? GOLD : '#666' }}>
                  {editingScript.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #333' }}>
              <button onClick={() => setEditingScript(null)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#333', color: '#fff' }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editingScript.page_code || !editingScript.script_text}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
                style={{ background: GOLD, color: '#000' }}
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Script'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: '#aaa' }}>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2 outline-none"
        style={{ background: '#111', border: '1px solid #333', color: '#fff' }}
      />
    </div>
  );
}