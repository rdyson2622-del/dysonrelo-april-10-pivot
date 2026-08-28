import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Newspaper, ArrowDown, Save, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const BOB_COLOR = '#A78BFA';

/**
 * ScriptSequenceFlow — the simplified, linear replacement for the old
 * scattered Script Studio layout. Three steps, top to bottom:
 *   1. Read today's 4 national stories, pick one.
 *   2. That story drops into the show's actual broadcast order:
 *      OPENING (Charlie) → BOB'S SOLUTION (Bob) → OUTTAKE (Charlie).
 *   3. Save writes straight to today's broadcast (intro/content/outro_script).
 */
export default function ScriptSequenceFlow({ template, latestBroadcast, todayDate, onSaved }) {
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [storiesError, setStoriesError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [openScript, setOpenScript] = useState('');
  const [contentScript, setContentScript] = useState('');
  const [outroScript, setOutroScript] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const fetchStories = async () => {
    setLoadingStories(true);
    setStoriesError(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 4 NATIONAL real estate news stories from TODAY. National only — no local/regional/single-city stories. For each, write a short broadcast-ready script (2-3 sentences, spoken tone, suitable for co-anchor Bob) covering the headline, then end with ONE natural toss-line handing off to co-anchor Bob so Charlie doesn't have to write a new toss every time. Vary the toss style across the 4 scripts using patterns like: "Bob's in the field working with our clients today...Bob?", "Bob's in Del Mar today...Bob?", "Bob's in Washington D.C. today...Bob?" — pick a plausible city/context per story. Keep each toss-line short and reusable.`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: {
            stories: {
              type: 'array',
              items: {
                type: 'object',
                properties: { headline: { type: 'string' }, script: { type: 'string' } },
              },
            },
          },
        },
      });
      setStories(res.stories || []);
    } catch (e) {
      setStoriesError(e.message);
    }
    setLoadingStories(false);
  };

  useEffect(() => { fetchStories(); }, []);

  // Pre-load existing today's broadcast sequence, if one already exists.
  useEffect(() => {
    if (latestBroadcast) {
      setOpenScript(latestBroadcast.intro_script || '');
      setContentScript(latestBroadcast.content_script || '');
      setOutroScript(latestBroadcast.outro_script || '');
    }
  }, [latestBroadcast]);

  const handleSelectStory = (i) => {
    setSelectedIndex(i);
    const story = stories[i];
    const open = (template?.open_script_template || '')
      .replace(/{DATE}/g, todayDate)
      .replace(/{STORY_TEASERS}/g, story.headline || '');
    setOpenScript(open);
    setContentScript(story.script || '');
    setOutroScript((template?.close_script_template || '').replace(/{DATE}/g, todayDate));
    setSaveMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload = {
        intro_script: openScript,
        content_script: contentScript,
        outro_script: outroScript,
        headlines: selectedIndex !== null && stories[selectedIndex] ? [stories[selectedIndex].headline] : latestBroadcast?.headlines,
      };
      if (latestBroadcast) {
        await base44.entities.DnnBroadcast.update(latestBroadcast.id, payload);
      } else {
        await base44.entities.DnnBroadcast.create({
          broadcast_date: new Date().toISOString().slice(0, 10),
          status: 'script_ready',
          ...payload,
        });
      }
      setSaveMsg({ type: 'success', text: "Saved to today's broadcast." });
      onSaved?.();
    } catch (e) {
      setSaveMsg({ type: 'error', text: e.message });
    }
    setSaving(false);
  };

  const hasSequence = openScript || contentScript || outroScript;

  return (
    <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Step 1 — pick a story */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Step 1 — Read & Select Today's Story
          </p>
        </div>
        <button onClick={fetchStories} disabled={loadingStories}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
          style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` }}>
          {loadingStories ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh Stories
        </button>
      </div>

      {loadingStories && (
        <div className="flex items-center gap-2 text-sm py-6" style={{ color: GOLD }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Pulling today's national headlines...
        </div>
      )}
      {storiesError && <p className="text-sm py-4" style={{ color: '#ef4444' }}>Failed to load stories: {storiesError}</p>}

      {!loadingStories && !storiesError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          {stories.map((story, i) => (
            <button key={i} onClick={() => handleSelectStory(i)}
              className="text-left rounded-lg p-3 transition-all"
              style={{
                background: selectedIndex === i ? 'rgba(212,175,55,0.1)' : '#0d0d0d',
                border: `1px solid ${selectedIndex === i ? GOLD : 'rgba(255,255,255,0.08)'}`,
              }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-white">{i + 1}. {story.headline}</p>
                {selectedIndex === i && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{story.script}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — the actual broadcast sequence, in order */}
      {hasSequence && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
            Step 2 — Broadcast Sequence (in order)
          </p>

          <SequenceStep label="1. OPENING" speaker="CHARLIE" color={GOLD} value={openScript} onChange={setOpenScript} />
          <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-slate-600" /></div>
          <SequenceStep label="2. BOB'S SOLUTION" speaker="BOB" color={BOB_COLOR} value={contentScript} onChange={setContentScript} />
          <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-slate-600" /></div>
          <SequenceStep label="3. OUTTAKE" speaker="CHARLIE" color={GOLD} value={outroScript} onChange={setOutroScript} />

          <div className="flex items-center justify-between pt-3 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {saveMsg && (
              <p className="text-[11px]" style={{ color: saveMsg.type === 'success' ? '#4ade80' : '#f87171' }}>
                {saveMsg.type === 'success' ? '✓ ' : '✗ '}{saveMsg.text}
              </p>
            )}
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition-all disabled:opacity-50 ml-auto"
              style={{ background: saving ? '#666' : 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : "Save Sequence to Today's Broadcast"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SequenceStep({ label, speaker, color, value, onChange }) {
  return (
    <div className="rounded-lg p-3" style={{ background: '#0d0d0d', border: `1px solid ${color}40` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>{label}</span>
        <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ background: `${color}20`, color }}>
          {speaker}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full rounded-lg p-3 text-[12px] text-white resize-y leading-relaxed font-mono"
        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
      />
    </div>
  );
}