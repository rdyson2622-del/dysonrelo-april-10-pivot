import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, RefreshCw, Newspaper, CheckCircle2, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';

// Real (not practice) story picker: fetches 3 STRICTLY NATIONAL real estate
// news choices from the last 2 days, then builds the full article + scripts
// for whichever one is picked, dropping it straight into the same
// edit/approve/render pipeline as every other article (production_status:
// "pending_review" -> Shard1ScriptReviewCard -> Approve for Render -> real
// HeyGen render, not a test clip).
export default function NationalStoryPicker({ onCreated }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [choices, setChoices] = useState([]);
  const [buildingIdx, setBuildingIdx] = useState(null);
  const [result, setResult] = useState(null);
  const [pickedIdx, setPickedIdx] = useState(null);

  const fetchChoices = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 3 NATIONAL real estate / housing market news stories from the last 2 days (today or yesterday), dated ${new Date().toISOString().slice(0, 10)}.
STRICT RULE: National scope only — federal policy, national housing data, mortgage/interest rates, national migration trends, national market reports. Do NOT return any story about a single city, single metro area, or single region (no "San Diego home prices", no "Austin market", etc.) — a New York viewer must never receive a San Diego-only story.
For each story return: headline (under 12 words), dateline (e.g. "WASHINGTON —"), and a 2-sentence summary of the actual news.`,
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
                  dateline: { type: 'string' },
                  summary: { type: 'string' },
                },
              },
            },
          },
        },
      });
      setChoices(res.stories || []);
    setPickedIdx(null);
    setResult(null);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchChoices(); }, []);

  const handlePick = async (story, idx) => {
    setBuildingIdx(idx);
    setResult(null);
    try {
      const res = await base44.functions.invoke('dnnCreateNationalArticle', {
        headline: story.headline,
        dateline: story.dateline,
        summary: story.summary,
      });
      setResult({ success: true, headline: res.data.headline });
      setPickedIdx(idx);
      onCreated?.();
    } catch (e) {
      setResult({ success: false, error: e.response?.data?.error || e.message });
    }
    setBuildingIdx(null);
  };

  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4" style={{ color: GOLD }} />
          <h2 className="text-white font-bold">Pick Today's National Story (3 Choices)</h2>
        </div>
        <button onClick={fetchChoices} disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
          style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` }}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh Choices
        </button>
      </div>
      <p className="text-[11px] text-slate-400 mb-4">
        National only — last 2 days. Pick one to build the full script and drop it into the edit queue below for a real approve-and-render (not a practice take).
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-sm py-6" style={{ color: GOLD }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Pulling national headlines...
        </div>
      )}

      {error && <p className="text-sm py-4" style={{ color: '#ef4444' }}>Failed to load stories: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {choices.map((story, i) => (
            <div key={i} className="rounded-lg p-3 flex flex-col" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[9px] font-black tracking-widest uppercase text-slate-500 mb-1">{story.dateline}</span>
              <p className="text-xs font-bold text-white mb-2 leading-snug">{story.headline}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 flex-1">{story.summary}</p>
              {pickedIdx === i ? (
                <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected — Pending Review
                </div>
              ) : (
                <button onClick={() => handlePick(story, i)} disabled={buildingIdx !== null || pickedIdx !== null}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                  style={{ background: buildingIdx === i ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)', color: buildingIdx === i ? '#fff' : '#000' }}>
                  {buildingIdx === i ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Building Script...</>
                  ) : (
                    <>Select This Story <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg p-3 text-xs" style={{
          background: result.success ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${result.success ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          {result.success ? (
            <p className="font-bold text-green-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved. "{result.headline}" now shows as <u>Pending Review</u> in the list below this box — that's where your edits are stored and where you track it through each milestone (Pending Review → Approved for Render → Rendering → Complete).
            </p>
          ) : (
            <p className="text-red-400">Failed to build script: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}