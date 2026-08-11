import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import FlowCanvas from '@/components/claude-flow/FlowCanvas';
import NodeFormModal from '@/components/claude-flow/NodeFormModal';
import { Download, Plus, Pencil, Link2 } from 'lucide-react';

export default function AdminClaudeFlowChart() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);

  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ['claude-nodes'],
    queryFn: () => base44.entities.ClaudeNode.list('node_order', 200),
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

  const handlePositionChange = (id, x, y) => {
    queryClient.setQueryData(['claude-nodes'], (old) =>
      (old || []).map((n) => (n.id === id ? { ...n, position_x: x, position_y: y } : n))
    );
  };

  const handleSavePosition = (id, x, y) => {
    updateMutation.mutate({ id, data: { position_x: x, position_y: y } });
  };

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

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-serif text-dyson-gold">Claude Node Flow Chart</h1>
            <p className="text-gray-400 text-sm mt-1">
              Build and link nodes for Claude. Click a node to view its full content. Drag to reposition.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={editMode ? 'default' : 'outline'}
              onClick={() => setEditMode(!editMode)}
              className={editMode ? 'gold-btn border-0' : 'border-white/20 text-white hover:bg-white/10'}
            >
              <Pencil className="w-4 h-4 mr-1.5" />
              {editMode ? 'Edit Mode ON' : 'Edit Mode OFF'}
            </Button>
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
          <div className="mb-3 flex items-center gap-2 text-sm text-dyson-gold-light bg-dyson-gold/10 border border-dyson-gold/30 rounded-lg px-3 py-2">
            <Link2 className="w-4 h-4" />
            <span>Export ready (valid 7 days): </span>
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
          <FlowCanvas
            nodes={nodes}
            onPositionChange={handlePositionChange}
            onSavePosition={handleSavePosition}
            editable={editMode}
          />
        )}

        {showModal && (
          <NodeFormModal
            node={editingNode}
            allNodes={nodes}
            onSave={handleSaveNode}
            onClose={() => { setShowModal(false); setEditingNode(null); }}
          />
        )}
      </div>
    </div>
  );
}