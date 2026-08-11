import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, FileText, Pencil, ExternalLink } from 'lucide-react';
import { CATEGORY_COLORS } from '@/components/claude-flow/FlowCanvas';

export default function AdminClaudeNodeDetail() {
  const { nodeId } = useParams();
  const navigate = useNavigate();

  const { data: node, isLoading } = useQuery({
    queryKey: ['claude-node', nodeId],
    queryFn: () => base44.entities.ClaudeNode.get(nodeId),
    enabled: !!nodeId,
  });

  const { data: allNodes = [] } = useQuery({
    queryKey: ['claude-nodes'],
    queryFn: () => base44.entities.ClaudeNode.list('node_order', 200),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dyson-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-dyson-gold/30 border-t-dyson-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-screen bg-dyson-black text-white flex flex-col items-center justify-center">
        <p className="text-gray-400 mb-4">Node not found.</p>
        <Button onClick={() => navigate('/admin/claude-flow')} className="gold-btn border-0">
          Back to Flow Chart
        </Button>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.instruction;
  const connectedNodes = (node.connected_to || [])
    .map((id) => allNodes.find((n) => n.id === id))
    .filter(Boolean);
  const incomingNodes = allNodes.filter((n) => (n.connected_to || []).includes(node.id));

  return (
    <div className="min-h-screen bg-dyson-black text-white">
      <div className="border-b border-white/10 px-6 py-3 flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/claude-flow')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Flow Chart
        </Button>
        <div className="flex-1" />
        <Button
          onClick={() => navigate('/admin/claude-flow')}
          className="gold-btn border-0"
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          Edit in Flow Chart
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.border }}
        >
          {colors.label}
        </div>

        <h1 className="text-3xl font-serif text-white mb-2">{node.title}</h1>
        {node.summary && <p className="text-gray-400 text-lg mb-6">{node.summary}</p>}

        {node.google_doc_url && (
          <a
            href={node.google_doc_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-dyson-gold/40 bg-dyson-gold/10 text-dyson-gold-light text-sm hover:bg-dyson-gold/20 transition"
          >
            <FileText className="w-4 h-4" />
            Open Google Doc
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {node.content && (
          <div className="bg-dyson-charcoal border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-dyson-gold uppercase tracking-wider mb-3">Content</h2>
            <div className="prose prose-invert max-w-none text-gray-200">
              <ReactMarkdown>{node.content}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {connectedNodes.length > 0 && (
            <div className="bg-dyson-charcoal border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-dyson-gold uppercase tracking-wider mb-3">
                Connects To ({connectedNodes.length})
              </h3>
              <div className="space-y-2">
                {connectedNodes.map((n) => {
                  const c = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.instruction;
                  return (
                    <Link
                      key={n.id}
                      to={`/admin/claude-node/${n.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: c.border }} />
                      <span className="text-white text-sm">{n.title}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {incomingNodes.length > 0 && (
            <div className="bg-dyson-charcoal border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-dyson-gold uppercase tracking-wider mb-3">
                Linked From ({incomingNodes.length})
              </h3>
              <div className="space-y-2">
                {incomingNodes.map((n) => {
                  const c = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.instruction;
                  return (
                    <Link
                      key={n.id}
                      to={`/admin/claude-node/${n.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: c.border }} />
                      <span className="text-white text-sm">{n.title}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}