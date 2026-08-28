import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Newspaper } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

// Pulls 4 TODAY, NATIONAL-ONLY real estate news stories and drops each into
// its own editable script box so Bob can rework the phrasing for future
// script entries without re-researching the stories himself.
export default function NationalNewsScriptBox() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stories, setStories] = useState([]);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 4 NATIONAL real estate news stories from TODAY. National only — no local/regional/single-city stories. For each, write a short broadcast-ready script phrase (2-3 sentences, spoken tone, suitable for a news anchor) covering the headline.`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: {
            stories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  headline: { type: 'string' },
                  script: { type: 'string' },
                },
              },
            },
          },
        },
      });
      setStories(res.stories || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStories(); }, []);

  const handleScriptChange = (i, value) => {
    setStories((prev) => prev.map((s, idx) => (idx === i ? { ...s, script: value } : s)));
  };

  return (
    <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4" style={{ color: GOLD }} />
          <h2 className="text-white font-bold">Today's National Real Estate Stories (Script Box)</h2>
        </div>
        <button onClick={fetchStories} disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
          style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` }}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh Stories
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm py-6" style={{ color: GOLD }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Pulling today's national headlines...
        </div>
      )}

      {error && (
        <p className="text-sm py-4" style={{ color: '#ef4444' }}>Failed to load stories: {error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((story, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold text-white mb-2">{i + 1}. {story.headline}</p>
              <textarea
                value={story.script || ''}
                onChange={(e) => handleScriptChange(i, e.target.value)}
                rows={5}
                className="w-full rounded-lg p-3 text-[12px] text-white resize-y leading-relaxed"
                style={{ background: '#000', border: '1px solid rgba(212,175,55,0.2)', outline: 'none' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}