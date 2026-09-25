import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, RefreshCw, Newspaper, CheckCircle2, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';
const MAX_RECOMMENDED = 7;

// Real (not practice) story picker: fetches 10 STRICTLY NATIONAL real estate
// news choices from the last 2 days, lets the admin check off up to 7 in one
// sitting, then builds the full article + scripts for each selected story in
// one batch — dropping each straight into the same edit/approve/render
// pipeline as every other article (production_status: "pending_review" ->
// Shard1ScriptReviewCard -> Approve for Render -> real HeyGen render, not a
// test clip).
export default function NationalStoryPicker({ onCreated }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [building, setBuilding] = useState(false);
  const [builtIdxs, setBuiltIdxs] = useState(new Set());
  const [progress, setProgress] = useState(null); // { done, total }
  const [result, setResult] = useState(null);

  const fetchChoices = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 10 NATIONAL real estate / housing market news stories from the last 2 days (today or yesterday), dated ${new Date().toISOString().slice(0, 10)}.
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
      setSelected(new Set());
      setBuiltIdxs(new Set());
      setResult(null);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchChoices(); }, []);

  const toggleSelect = (idx) => {
    if (building) return;
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleBuildSelected = async () => {
    const idxs = Array.from(selected);
    if (!idxs.length) return;
    setBuilding(true);
    setResult(null);
    let ok = 0;
    const failed = [];
    for (const idx of idxs) {
      const story = choices[idx];
      try {
        await base44.functions.invoke('dnnCreateNationalArticle', {
          headline: story.headline,
          dateline: story.dateline,
          summary: story.summary,
        });
        ok++;
        setBuiltIdxs((b) => new Set(b).add(idx));
      } catch (e) {
        failed.push(story.headline);
      }
      setProgress({ done: ok + failed.length, total: idxs.length });
    }
    setProgress(null);
    setBuilding(false);
    setResult({
      success: failed.length === 0,
      text: failed.length
        ? `Built ${ok} of ${idxs.length}. Failed: ${failed.join(', ')}`
        : `Built all ${ok} stories — they're now in the review queue below as Pending Review.`,
    });
    if (ok > 0) onCreated?.();
  };

  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4" style={{ color: GOLD }} />
          <h2 className="text-white font-bold">Pick Today's National Stories (10 Choices)</h2>
        </div>
        <button onClick={fetchChoices} disabled={loading || building}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
          style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` }}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh Choices
        </button>
      </div>
      <p className="text-[11px] text-slate-400 mb-4">
        National only — last 2 days. Check off up to {MAX_RECOMMENDED} to build in one batch, review/edit them all here today, then approve for render — it's stale news tomorrow.
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-sm py-6" style={{ color: GOLD }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Pulling national headlines...
        </div>
      )}

      {error && <p className="text-sm py-4" style={{ color: '#ef4444' }}>Failed to load stories: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {choices.map((story, i) => {
              const isSelected = selected.has(i);
              const isBuilt = builtIdxs.has(i);
              return (
                <label key={i}
                  className="rounded-lg p-3 flex flex-col gap-1 cursor-pointer"
                  style={{
                    background: '#0d0d0d',
                    border: `1px solid ${isBuilt ? 'rgba(74,222,128,0.4)' : isSelected ? GOLD : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" checked={isSelected} disabled={building || isBuilt}
                      onChange={() => toggleSelect(i)} className="mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">{story.dateline}</span>
                      <p className="text-xs font-bold text-white leading-snug">{story.headline}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-6">{story.summary}</p>
                  {isBuilt && (
                    <span className="pl-6 flex items-center gap-1 text-[10px] font-bold" style={{ color: '#4ade80' }}>
                      <CheckCircle2 className="w-3 h-3" /> Built — Pending Review
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <button onClick={handleBuildSelected} disabled={building || selected.size === 0}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold disabled:opacity-50 w-full md:w-auto"
            style={{ background: building ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)', color: building ? '#fff' : '#000' }}>
            {building ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Building {progress ? `${progress.done}/${progress.total}` : ''}...</>
            ) : (
              <>Build Selected ({selected.size}) <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </>
      )}

      {result && (
        <div className="mt-4 rounded-lg p-3 text-xs" style={{
          background: result.success ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${result.success ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          {result.success ? (
            <p className="font-bold text-green-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> {result.text}
            </p>
          ) : (
            <p className="text-red-400">{result.text}</p>
          )}
        </div>
      )}
    </div>
  );
}