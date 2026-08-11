import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CATEGORY_COLORS } from './FlowCanvas';

export default function NodeFormModal({ node, allNodes, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    google_doc_url: '',
    category: 'instruction',
    connected_to: [],
    position_x: 100,
    position_y: 100,
  });

  useEffect(() => {
    if (node) {
      setForm({
        title: node.title || '',
        summary: node.summary || '',
        content: node.content || '',
        google_doc_url: node.google_doc_url || '',
        category: node.category || 'instruction',
        connected_to: node.connected_to || [],
        position_x: node.position_x ?? 100,
        position_y: node.position_y ?? 100,
      });
    }
  }, [node]);

  const toggleConnection = (id) => {
    setForm((f) => ({
      ...f,
      connected_to: f.connected_to.includes(id)
        ? f.connected_to.filter((x) => x !== id)
        : [...f.connected_to, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave(form);
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
              placeholder="e.g. System Prompt — Relocation Concierge"
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Summary (one line, shown on canvas)</Label>
            <Input
              className={inputCls}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Short description visible on the flow chart card"
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Category</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, category: key })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition"
                  style={{
                    borderColor: val.border,
                    background: form.category === key ? val.border : 'transparent',
                    color: form.category === key ? '#000' : val.border,
                  }}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Content (Markdown — the prompt/instructions for Claude)</Label>
            <Textarea
              className={inputCls + ' min-h-[200px] font-mono text-sm'}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Paste or write the full prompt, context, or instructions for this node..."
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Google Doc URL (hybrid — long-form content link)</Label>
            <Input
              className={inputCls}
              value={form.google_doc_url}
              onChange={(e) => setForm({ ...form, google_doc_url: e.target.value })}
              placeholder="https://docs.google.com/document/d/..."
            />
          </div>

          <div>
            <Label className="text-white mb-1.5 block">Connects To (click to toggle)</Label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-white/10 rounded-lg">
              {allNodes
                .filter((n) => n.id !== node?.id)
                .map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toggleConnection(n.id)}
                    className="px-2.5 py-1 rounded-md text-xs border transition"
                    style={{
                      borderColor: form.connected_to.includes(n.id) ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                      background: form.connected_to.includes(n.id) ? 'rgba(212,175,55,0.2)' : 'transparent',
                      color: form.connected_to.includes(n.id) ? '#D4AF37' : '#fff',
                    }}
                  >
                    {n.title}
                  </button>
                ))}
              {allNodes.filter((n) => n.id !== node?.id).length === 0 && (
                <span className="text-gray-500 text-xs">No other nodes yet.</span>
              )}
            </div>
          </div>

          {!node && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white mb-1.5 block">Canvas X</Label>
                <Input
                  type="number"
                  className={inputCls}
                  value={form.position_x}
                  onChange={(e) => setForm({ ...form, position_x: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className="text-white mb-1.5 block">Canvas Y</Label>
                <Input
                  type="number"
                  className={inputCls}
                  value={form.position_y}
                  onChange={(e) => setForm({ ...form, position_y: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gold-btn border-0">
            {node ? 'Save Changes' : 'Create Node'}
          </Button>
        </div>
      </div>
    </div>
  );
}