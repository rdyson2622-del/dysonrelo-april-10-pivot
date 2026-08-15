import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

const SECTIONS = [
  { key: 'departments', label: 'Departments' },
  { key: 'agent_context', label: 'AI Agent Intelligence' },
  { key: 'skills_sops', label: 'Skills & SOPs' },
  { key: 'tools_integrations', label: 'Integrations & Webhooks' },
];

export default function NodeFormModal({ node, allNodes, defaultSection, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: '',
    summary: '',
    section: 'agent_context',
    subsection: '',
    google_doc_url: '',
    content: '',
    is_priority: false,
    node_order: 0,
  });

  useEffect(() => {
    if (node) {
      setForm({
        title: node.title || '',
        summary: node.summary || '',
        section: node.section || 'agent_context',
        subsection: node.subsection || '',
        google_doc_url: node.google_doc_url || '',
        content: node.content || '',
        is_priority: node.is_priority || false,
        node_order: node.node_order ?? 0,
      });
    } else if (defaultSection) {
      setForm((f) => ({ ...f, section: defaultSection }));
    }
  }, [node, defaultSection]);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      subsection: form.section === 'departments' ? form.subsection : '',
      node_order: Number(form.node_order) || 0,
    });
  };

  const handleDelete = () => {
    if (node && confirm('Delete this node permanently?')) {
      onDelete(node.id);
    }
  };

  const inputCls = 'bg-dyson-charcoal border-white/20 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-dyson-charcoal border border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-serif text-white mb-4">{node ? 'Edit Node' : 'Add Node'}</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-white mb-1.5 block">Title</Label>
            <Input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Email Campaigns"
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Summary (one line)</Label>
            <Input
              className={inputCls}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Short description shown under the title"
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Section</Label>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setForm({ ...form, section: s.key, subsection: s.key === 'departments' ? form.subsection : '' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition"
                  style={{
                    borderColor: form.section === s.key ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                    background: form.section === s.key ? 'rgba(212,175,55,0.2)' : 'transparent',
                    color: form.section === s.key ? '#D4AF37' : '#fff',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {form.section === 'departments' && (
            <div>
              <Label className="text-white mb-1.5 block">Subsection (Department group)</Label>
              <Input
                className={inputCls}
                value={form.subsection}
                onChange={(e) => setForm({ ...form, subsection: e.target.value })}
                placeholder="e.g. Marketing, DNN News, Operations, Sales, Finance"
              />
            </div>
          )}

          <div>
            <Label className="text-white mb-1.5 block">Google Doc URL (clicking this node opens this link)</Label>
            <Input
              className={inputCls}
              value={form.google_doc_url}
              onChange={(e) => setForm({ ...form, google_doc_url: e.target.value })}
              placeholder="https://docs.google.com/document/d/..."
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Content (optional markdown — primary content lives in the Google Doc)</Label>
            <Textarea
              className={inputCls + ' min-h-[120px] font-mono text-sm'}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Optional in-app content or notes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-1.5 block">Sort Order</Label>
              <Input
                type="number"
                className={inputCls}
                value={form.node_order}
                onChange={(e) => setForm({ ...form, node_order: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.is_priority}
                  onChange={(e) => setForm({ ...form, is_priority: e.target.checked })}
                  className="w-4 h-4 accent-dyson-gold"
                />
                <span className="text-white text-sm">Priority node (gold star)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-6">
          <div>
            {node && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gold-btn border-0">
              {node ? 'Save Changes' : 'Create Node'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}