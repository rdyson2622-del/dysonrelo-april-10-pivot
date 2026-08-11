import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import NodeFormModal from '@/components/claude-flow/NodeFormModal';
import {
  Download, Plus, Pencil, ArrowLeft, ExternalLink, Star,
  Building2, Brain, BookOpen, Wrench, FileText, ChevronRight,
} from 'lucide-react';

const SECTIONS = [
  {
    key: 'departments',
    label: 'Departments',
    icon: Building2,
    description: 'Marketing, Operations, Sales, Finance & DNN News',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.08)',
  },
  {
    key: 'agent_context',
    label: 'Agent Context',
    icon: Brain,
    description: 'Master files, brand voice, customer profiles & company knowledge',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    key: 'skills_sops',
    label: 'Skills & SOPs',
    icon: BookOpen,
    description: 'Standard operating procedures & skill definitions',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    key: 'tools_integrations',
    label: 'Tools & Integrations',
    icon: Wrench,
    description: 'Gmail, Drive, Slack, Calendar & CRM connections',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
];

const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

export default function AdminClaudeFlowChart() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);

  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ['claude-nodes'],
    queryFn: () => base44.entities.ClaudeNode.list('node_order', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ClaudeNode.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-nodes'] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClaudeNode.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-nodes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ClaudeNode.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-nodes'] });
    },
  });

  const handleSaveNode = (data) => {
    if (editingNode) {
      updateMutation.mutate(
        { id: editingNode.id, data },
        { onSuccess: () => { setShowModal(false); setEditingNode(null); } }
      );
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteNode = (id) => {
    if (confirm('Delete this node?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await base44.functions.invoke('exportClaudeFlow', {});
      const data = res?.data || res;
      if (data?.file_url) {
        setExportUrl(data.file_url);
        window.open(data.file_url, '_blank');
      }
    } catch (e) {
      console.error('Export failed:', e);
    }
    setExporting(false);
  };

  const openNode = (node) => {
    if (node.google_doc_url) {
      window.open(node.google_doc_url, '_blank');
    }
  };

  const sectionNodes = (key) => nodes.filter((n) => n.section === key);

  // ─── SECTION VIEW (sub-items list) ────────────────────────────────────
  if (activeSection) {
    const section = SECTION_MAP[activeSection];
    const items = sectionNodes(activeSection).sort((a, b) => (a.node_order || 0) - (b.node_order || 0));

    // Group by subsection for Departments
    const hasSubsections = activeSection === 'departments';
    const subsections = hasSubsections
      ? [...new Set(items.map((n) => n.subsection || 'General'))]
      : [];

    const renderItem = (node) => (
      <div
        key={node.id}
        className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-dyson-charcoal hover:border-white/25 hover:bg-dyson-charcoal/80 transition cursor-pointer"
        onClick={() => openNode(node)}
      >
        {node.is_priority ? (
          <Star className="w-4 h-4 text-dyson-gold fill-dyson-gold shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-gray-500 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate">{node.title}</div>
          {node.summary && <div className="text-gray-400 text-xs truncate">{node.summary}</div>}
        </div>
        {node.google_doc_url && <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-dyson-gold shrink-0" />}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingNode(node);
            setShowModal(true);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 shrink-0"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
    );

    return (
      <div className="min-h-screen bg-dyson-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setActiveSection(null)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Home
            </Button>
            <Button
              onClick={() => { setEditingNode(null); setShowModal(true); }}
              className="gold-btn border-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Node
            </Button>
          </div>

          {/* Section header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: section.bg, border: `1px solid ${section.color}` }}
            >
              <section.icon className="w-7 h-7" style={{ color: section.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-white">{section.label}</h1>
              <p className="text-gray-400 text-sm">{section.description}</p>
            </div>
          </div>

          {/* Items */}
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-dyson-gold/30 border-t-dyson-gold rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">No nodes in this section yet</p>
              <p className="text-sm">Click "Add Node" to create the first one.</p>
            </div>
          ) : hasSubsections ? (
            <div className="space-y-8">
              {subsections.map((sub) => (
                <div key={sub}>
                  <h2 className="text-sm font-semibold text-dyson-gold uppercase tracking-wider mb-3">
                    {sub}
                  </h2>
                  <div className="space-y-2">
                    {items.filter((n) => (n.subsection || 'General') === sub).map(renderItem)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(renderItem)}
            </div>
          )}

          {showModal && (
            <NodeFormModal
              node={editingNode}
              allNodes={nodes}
              defaultSection={activeSection}
              onSave={handleSaveNode}
              onDelete={handleDeleteNode}
              onClose={() => { setShowModal(false); setEditingNode(null); }}
            />
          )}
        </div>
      </div>
    );
  }

  // ─── HOME VIEW (4 section boxes) ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif text-dyson-gold">Agent Library</h1>
            <p className="text-gray-400 text-sm mt-1">
              Visual flowchart navigation for the DysonRelo AI agent system. Click a section to browse.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExport}
              disabled={exporting || nodes.length === 0}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent border"
            >
              <Download className="w-4 h-4 mr-1.5" />
              {exporting ? 'Exporting...' : 'Export HTML'}
            </Button>
            <Button onClick={() => { setEditingNode(null); setShowModal(true); }} className="gold-btn border-0">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Node
            </Button>
          </div>
        </div>

        {exportUrl && (
          <div className="mb-4 flex items-center gap-2 text-sm text-dyson-gold-light bg-dyson-gold/10 border border-dyson-gold/30 rounded-lg px-3 py-2">
            <ExternalLink className="w-4 h-4" />
            <span>Export ready: </span>
            <a href={exportUrl} target="_blank" rel="noreferrer" className="underline truncate">
              {exportUrl}
            </a>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-4 border-dyson-gold/30 border-t-dyson-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex items-stretch gap-0 overflow-x-auto pb-4">
            {SECTIONS.map((section, idx) => {
              const count = sectionNodes(section.key).length;
              return (
                <React.Fragment key={section.key}>
                  <button
                    onClick={() => setActiveSection(section.key)}
                    className="group relative shrink-0 w-44 rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.03] hover:shadow-lg"
                    style={{
                      borderColor: `${section.color}50`,
                      background: section.bg,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                      style={{ background: `radial-gradient(circle at top right, ${section.color}18, transparent 65%)` }}
                    />
                    <div className="relative flex flex-col items-center text-center gap-2">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${section.color}25`, border: `1px solid ${section.color}60` }}
                      >
                        <section.icon className="w-5 h-5" style={{ color: section.color }} />
                      </div>
                      <h2 className="text-sm font-serif text-white leading-tight">{section.label}</h2>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${section.color}20`, color: section.color }}
                      >
                        {count} {count === 1 ? 'item' : 'items'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition" />
                    </div>
                  </button>
                  {idx < SECTIONS.length - 1 && (
                    <div className="flex items-center shrink-0 px-1">
                      <div className="w-6 h-0.5" style={{ background: `${section.color}40` }} />
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: section.color, opacity: 0.6 }} />
                      <div className="w-6 h-0.5" style={{ background: `${SECTIONS[idx + 1].color}40` }} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {showModal && (
          <NodeFormModal
            node={editingNode}
            allNodes={nodes}
            onSave={handleSaveNode}
            onDelete={handleDeleteNode}
            onClose={() => { setShowModal(false); setEditingNode(null); }}
          />
        )}
      </div>
    </div>
  );
}