import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Send, Trash2, Eye, EyeOff, Share2, CheckCircle, Clock, Globe } from 'lucide-react';

const STYLE_GUIDE = `You are a writer for the Dyson News Network (DNN), a premium real estate intelligence service for people relocating across America. Write in the "1927 Parallel" style: authoritative, sophisticated, slightly cinematic — think a trusted financial journalist who also appreciates the drama of the American migration story. No fluff. No clickbait. Lead with the data, end with the implication for readers who are considering a move. Each brief should be 3-4 short paragraphs, under 300 words.`;

export default function DnnNewsFeed() {
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['dnnArticles'],
    queryFn: () => base44.entities.DnnArticle.list('-created_date', 100),
  });

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${STYLE_GUIDE}

Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

Search the web for 5 "relocation-triggering" news items from the past 48 hours related to: California tax policy, Bay Area housing/job market, Arizona housing boom, Florida migration, New York cost of living, interest rate moves, remote work policy changes, or major employer relocations.

For each item, write a DNN brief. Return a JSON object with this schema:
{
  "briefs": [
    {
      "headline": "string (punchy, under 12 words)",
      "dateline": "string (e.g. SAN FRANCISCO — )",
      "body": "string (3-4 paragraphs, under 300 words, 1927 Parallel style)",
      "tags": ["array", "of", "tags"],
      "trigger_type": "one of: tax_policy | housing_market | job_market | interest_rates | migration_data | employer_news"
    }
  ]
}`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          briefs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                headline: { type: 'string' },
                dateline: { type: 'string' },
                body: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                trigger_type: { type: 'string' },
              }
            }
          }
        }
      }
    });

    const briefs = res?.briefs || [];
    for (const brief of briefs) {
      await base44.entities.DnnArticle.create({
        headline: brief.headline,
        dateline: brief.dateline,
        body: brief.body,
        tags: brief.tags || [],
        trigger_type: brief.trigger_type,
        status: 'staged',
        generated_date: new Date().toISOString(),
      });
    }
    queryClient.invalidateQueries({ queryKey: ['dnnArticles'] });
    setGenerating(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.DnnArticle.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ['dnnArticles'] });
  };

  const deleteArticle = async (id) => {
    if (!confirm('Delete this brief?')) return;
    await base44.entities.DnnArticle.delete(id);
    queryClient.invalidateQueries({ queryKey: ['dnnArticles'] });
  };

  const TRIGGER_COLORS = {
    tax_policy: 'bg-red-900/40 text-red-300 border-red-800',
    housing_market: 'bg-blue-900/40 text-blue-300 border-blue-800',
    job_market: 'bg-purple-900/40 text-purple-300 border-purple-800',
    interest_rates: 'bg-amber-900/40 text-amber-300 border-amber-800',
    migration_data: 'bg-green-900/40 text-green-300 border-green-800',
    employer_news: 'bg-indigo-900/40 text-indigo-300 border-indigo-800',
  };

  const STATUS_COLORS = {
    staged: 'text-yellow-400',
    published: 'text-green-400',
    blasted: 'text-blue-400',
    archived: 'text-slate-500',
  };

  const staged = articles.filter(a => a.status === 'staged');
  const published = articles.filter(a => a.status !== 'staged' && a.status !== 'archived');
  const archived = articles.filter(a => a.status === 'archived');

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5" style={{ color: '#D4AF37' }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#D4AF37' }}>Dyson News Network</span>
            </div>
            <h1 className="text-2xl font-black text-white">News Feed — Staging</h1>
            <p className="text-sm text-slate-400 mt-1">AI-generated briefs in review. Approve before pushing live.</p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="gap-2 font-bold"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}
          >
            {generating
              ? <><RefreshCw className="w-4 h-4 animate-spin" />Scanning web...</>
              : <><Sparkles className="w-4 h-4" />Generate Today's Briefs</>}
          </Button>
        </div>

        {generating && (
          <div className="mb-6 rounded-xl border p-4 flex items-center gap-3" style={{ background: 'rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.2)' }}>
            <RefreshCw className="w-5 h-5 animate-spin" style={{ color: '#D4AF37' }} />
            <div>
              <p className="text-sm font-semibold text-white">The AI Reporter is scanning the web...</p>
              <p className="text-xs text-slate-400">Finding relocation-triggering news and writing briefs in the 1927 Parallel style. Usually takes 20–40 seconds.</p>
            </div>
          </div>
        )}

        {isLoading && <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-400 rounded-full animate-spin" /></div>}

        {/* Staged */}
        {staged.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-bold tracking-widest text-yellow-400 uppercase">Awaiting Review ({staged.length})</h2>
            </div>
            <div className="space-y-3">
              {staged.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  expanded={expandedId === article.id}
                  onToggle={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  onStatusChange={updateStatus}
                  onDelete={deleteArticle}
                  triggerColors={TRIGGER_COLORS}
                  statusColors={STATUS_COLORS}
                />
              ))}
            </div>
          </div>
        )}

        {/* Published */}
        {published.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h2 className="text-sm font-bold tracking-widest text-green-400 uppercase">Approved / Distributed ({published.length})</h2>
            </div>
            <div className="space-y-3">
              {published.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  expanded={expandedId === article.id}
                  onToggle={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  onStatusChange={updateStatus}
                  onDelete={deleteArticle}
                  triggerColors={TRIGGER_COLORS}
                  statusColors={STATUS_COLORS}
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div className="text-center py-24">
            <Globe className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400 font-medium">No briefs yet.</p>
            <p className="text-slate-600 text-sm mt-1">Click "Generate Today's Briefs" to have the AI Reporter scan the web.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, expanded, onToggle, onStatusChange, onDelete, triggerColors, statusColors }) {
  const triggerLabel = article.trigger_type?.replace(/_/g, ' ') || 'general';
  const tagColor = triggerColors[article.trigger_type] || 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <div className="rounded-xl overflow-hidden border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${tagColor}`}>{triggerLabel}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColors[article.status] || 'text-slate-400'}`}>● {article.status}</span>
              <span className="text-[10px] text-slate-600">{article.generated_date ? new Date(article.generated_date).toLocaleDateString() : ''}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-snug">{article.headline}</h3>
            {article.dateline && <p className="text-xs text-slate-500 mt-0.5 font-mono">{article.dateline}</p>}
          </div>
          <button onClick={onToggle} className="text-slate-500 hover:text-white transition flex-shrink-0 mt-1">
            {expanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{article.body}</p>
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {article.tags.map(t => (
                  <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">#{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {article.status === 'staged' && (
            <>
              <button onClick={() => onStatusChange(article.id, 'published')}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition"
                style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                <CheckCircle className="w-3 h-3" /> Publish to Site
              </button>
              <button onClick={() => onStatusChange(article.id, 'blasted')}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                <Send className="w-3 h-3" /> Blast to Subscribers
              </button>
              <button onClick={() => onStatusChange(article.id, 'archived')}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                Archive
              </button>
            </>
          )}
          {article.status !== 'staged' && (
            <button onClick={() => onStatusChange(article.id, 'staged')}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold transition"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
              Move to Staging
            </button>
          )}
          <button onClick={() => onDelete(article.id)}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ml-auto"
            style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}