import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plug, Sparkles, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { LIBRARY_SPECIALISTS, LIBRARY_COORDINATOR_NOTE } from '@/lib/librarySpecialists';
import { AGENT_LIBRARY_CATALOG, catalogBySection, catalogSeedPayload } from '@/lib/agentLibraryCatalog';

const GOLD = '#D4AF37';

function PlatformBadge({ platform }) {
  return (
    <span
      className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.35)' }}
    >
      {platform}
    </span>
  );
}

function SpecialistCard({ spec, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(spec.id)}
      className="text-left rounded-2xl p-5 transition-all w-full"
      style={{
        background: selected ? 'rgba(212,175,55,0.10)' : '#111',
        border: `1px solid ${selected ? GOLD : 'rgba(255,255,255,0.10)'}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${spec.color}18`, border: `1px solid ${spec.color}40` }}
        >
          {spec.icon}
        </div>
        <PlatformBadge platform={spec.platform} />
      </div>
      <p className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: spec.color }}>
        {spec.department}
      </p>
      <h2 className="text-lg font-serif text-white mb-2">{spec.name}</h2>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {spec.oneLiner}
      </p>
    </button>
  );
}

function Detail({ spec, seededTitles }) {
  if (!spec) return null;
  const docs = catalogBySection(spec.section);
  return (
    <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.10)' }}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-2xl">{spec.icon}</span>
        <div>
          <h3 className="text-xl font-serif text-white">{spec.name}</h3>
          <p className="text-xs text-gray-400">{spec.howToAsk}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>Grok Bot</p>
          <p className="text-sm text-gray-300">{spec.grokDoes}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2 text-white">Cursor</p>
          <p className="text-sm text-gray-300">{spec.cursorDoes}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>Owns</p>
          <ul className="space-y-1.5 text-sm text-gray-300">
            {spec.owns.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2 text-gray-500">Does not own</p>
          <ul className="space-y-1.5 text-sm text-gray-400">
            {spec.doesNotOwn.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-white/10">
        <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>
          Library nodes · execute with {spec.consumeAssistants.join(', ')}
        </p>
        <div className="space-y-2">
          {docs.map((doc) => {
            const live = seededTitles.has(doc.title);
            return (
              <div
                key={doc.slug}
                className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div>
                  <p className="text-sm text-white font-medium">{doc.title}</p>
                  <p className="text-xs text-gray-500">{doc.summary}</p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Execute: {doc.executeWith.join(' · ')}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold tracking-widest uppercase shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    color: live ? '#86efac' : '#fbbf24',
                    border: `1px solid ${live ? 'rgba(134,239,172,0.35)' : 'rgba(251,191,36,0.35)'}`,
                  }}
                >
                  {live ? 'In library' : 'Catalog'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {spec.adminPaths?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>
            Admin shortcuts
          </p>
          <div className="flex flex-wrap gap-2">
            {spec.adminPaths.map((path) => (
              <Link
                key={path}
                to={path}
                className="text-xs px-2.5 py-1 rounded-lg font-mono"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#d4af37', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {path}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLibrarySpecialists() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(LIBRARY_SPECIALISTS[0].id);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const selected = LIBRARY_SPECIALISTS.find((s) => s.id === selectedId) || LIBRARY_SPECIALISTS[0];

  const { data: nodes = [] } = useQuery({
    queryKey: ['claude-nodes'],
    queryFn: () => base44.entities.ClaudeNode.list('node_order', 500),
  });

  const seededTitles = new Set(nodes.map((n) => n.title));
  const missing = AGENT_LIBRARY_CATALOG.filter((n) => !seededTitles.has(n.title)).length;

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await base44.functions.invoke('grokLibrarySeedCatalog', {
        nodes: catalogSeedPayload(),
      });
      const data = res?.data || res;
      setSeedResult(data);
      queryClient.invalidateQueries({ queryKey: ['claude-nodes'] });
    } catch (err) {
      setSeedResult({ error: err?.message || 'Seed failed' });
    }
    setSeeding(false);
  };

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
          Dyson & Dyson · Knowledge desks
        </p>
        <h1 className="text-3xl font-serif mb-2" style={{ color: GOLD }}>AI Library Specialists</h1>
        <p className="text-gray-400 text-sm max-w-3xl leading-relaxed mb-6">
          Three new desks for the three Agent Library sections that are not departments.
          Canon, Playbook, and Conduit own the documents and pipes.
          Marketing, Operations, Sales, DNN News, and Finance still execute the work.
        </p>

        <div
          className="rounded-xl p-4 mb-8"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.35)' }}
        >
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">{LIBRARY_COORDINATOR_NOTE.title}.</strong>{' '}
            {LIBRARY_COORDINATOR_NOTE.body}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {LIBRARY_SPECIALISTS.map((spec) => (
            <SpecialistCard
              key={spec.id}
              spec={spec}
              selected={selectedId === spec.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <Detail spec={selected} seededTitles={seededTitles} />

        <div
          className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.35)' }}
        >
          <Sparkles className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Seed Knowledge Library nodes</p>
            <p className="text-xs text-gray-400 mt-1">
              Writes the 15 catalog documents into ClaudeNode. Existing titles are left alone.
              {missing === 0 ? ' All catalog nodes are already in the library.' : ` ${missing} catalog node${missing === 1 ? '' : 's'} missing.`}
            </p>
            {seedResult && (
              <p className="text-xs mt-2" style={{ color: seedResult.error ? '#f87171' : '#86efac' }}>
                {seedResult.error
                  ? seedResult.error
                  : `Created ${seedResult.created ?? 0}, skipped ${seedResult.skipped ?? 0}.`}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding || missing === 0}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl disabled:opacity-40"
            style={{ background: GOLD, color: '#111', fontWeight: 700 }}
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {seeding ? 'Seeding…' : 'Seed catalog'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            to="/admin/workflows"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
            style={{ border: '1px solid rgba(212,175,55,0.35)', color: GOLD }}
          >
            🗺️ Grok Bot- Master Workflow Atlas
          </Link>
          <Link
            to="/connect"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <Plug className="w-4 h-4" style={{ color: GOLD }} />
            Connect AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}