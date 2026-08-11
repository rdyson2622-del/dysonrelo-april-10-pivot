import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, FileText, ExternalLink, Star } from 'lucide-react';

const SECTION_LABELS = {
  departments: 'Departments',
  agent_context: 'Agent Context',
  skills_sops: 'Skills & SOPs',
  tools_integrations: 'Tools & Integrations',
};

export default function AdminClaudeNodeDetail() {
  const { nodeId } = useParams();
  const navigate = useNavigate();

  const { data: node, isLoading } = useQuery({
    queryKey: ['claude-node', nodeId],
    queryFn: () => base44.entities.ClaudeNode.get(nodeId),
    enabled: !!nodeId,
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

  return (
    <div className="min-h-screen bg-dyson-black text-white">
      <div className="border-b border-white/10 px-6 py-3 flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/claude-flow')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Agent Library
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span>{SECTION_LABELS[node.section] || node.section}</span>
          {node.subsection && (
            <>
              <span>/</span>
              <span>{node.subsection}</span>
            </>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          {node.is_priority && <Star className="w-6 h-6 text-dyson-gold fill-dyson-gold shrink-0" />}
          <h1 className="text-3xl font-serif text-white">{node.title}</h1>
        </div>
        {node.summary && <p className="text-gray-400 text-lg mb-6">{node.summary}</p>}

        {/* Google Doc link — primary CTA */}
        {node.google_doc_url && (
          <a
            href={node.google_doc_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-lg border border-dyson-gold/40 bg-dyson-gold/10 text-dyson-gold-light text-sm font-medium hover:bg-dyson-gold/20 transition"
          >
            <FileText className="w-4 h-4" />
            Open Google Doc
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Optional in-app content */}
        {node.content && (
          <div className="bg-dyson-charcoal border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dyson-gold uppercase tracking-wider mb-3">Content</h2>
            <div className="prose prose-invert max-w-none text-gray-200">
              <ReactMarkdown>{node.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {!node.google_doc_url && !node.content && (
          <div className="bg-dyson-charcoal border border-white/10 rounded-xl p-8 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No Google Doc link or content set for this node yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}