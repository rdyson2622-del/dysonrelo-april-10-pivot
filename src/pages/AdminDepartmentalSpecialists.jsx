import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plug, AlertTriangle } from 'lucide-react';
import {
  COORDINATOR,
  SPECIALISTS,
  HOW_THE_TWO_APPS_WORK,
} from '@/lib/departmentalSpecialists';

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

function Detail({ spec }) {
  if (!spec) return null;
  return (
    <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.10)' }}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-2xl">{spec.icon}</span>
        <div>
          <h3 className="text-xl font-serif text-white">{spec.name}</h3>
          <p className="text-xs text-gray-400">{spec.howToAsk}</p>
        </div>
      </div>

      {spec.grokDoes && (
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
      )}

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

export default function AdminDepartmentalSpecialists() {
  const [selectedId, setSelectedId] = useState(SPECIALISTS[0].id);
  const selected = SPECIALISTS.find((s) => s.id === selectedId) || SPECIALISTS[0];

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
          Dyson & Dyson · Operating team
        </p>
        <h1 className="text-3xl font-serif mb-2" style={{ color: GOLD }}>AI Departmental Specialists</h1>
        <p className="text-gray-400 text-sm max-w-3xl leading-relaxed mb-6">
          Claude is retired. Cursor builds the Base44 app. Grok Bot writes briefs and visuals.
          Four Base44 desks: Marketing, Operations, Sales, and DNN News. Company finance is outside this app and is not assigned here.
        </p>

        <div
          className="rounded-xl p-4 mb-8 flex items-start gap-3"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)' }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
          <p className="text-sm text-gray-300 leading-relaxed">
            The xAI account is suspended, so Grok Bot image/video tools may be limited.
            Cursor Cloud Agents still run without that login — type the job here and attach visuals later.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {Object.values(HOW_THE_TWO_APPS_WORK).map((app) => (
            <div key={app.title} className="rounded-xl p-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-sm font-serif text-white mb-1">{app.title}</p>
              <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>{app.role}</p>
              <ul className="space-y-1 text-xs text-gray-400">
                {app.does.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.35)' }}
        >
          <div className="text-3xl">{COORDINATOR.icon}</div>
          <div className="flex-1">
            <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>{COORDINATOR.department}</p>
            <h2 className="text-lg font-serif text-white">{COORDINATOR.name}</h2>
            <p className="text-sm text-gray-300 mt-1">{COORDINATOR.oneLiner}</p>
            <p className="text-xs text-gray-500 mt-2">{COORDINATOR.howToAsk}</p>
          </div>
          <PlatformBadge platform={COORDINATOR.platform} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {SPECIALISTS.map((spec) => (
            <SpecialistCard
              key={spec.id}
              spec={spec}
              selected={selectedId === spec.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <Detail spec={selected} />

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            to="/admin/claude-flow"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <BookOpen className="w-4 h-4" style={{ color: GOLD }} />
            Knowledge Library
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
