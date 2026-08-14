import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Clapperboard, Download, Radio, Users, Zap
} from 'lucide-react';
import {
  DNN_DESK_LEAD,
  DNN_DESK_SPECIALISTS,
  DNN_SOCIAL_TARGETS,
} from '@/lib/dnnDeskAgents';

const GOLD = '#D4AF37';

export default function AdminDnnDeskOrg() {
  return (
    <div className="min-h-screen p-6 pb-16" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/admin/dnn/in-house-creative" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4" style={{ color: GOLD }}>
          <ArrowLeft className="w-3.5 h-3.5" /> In-House Creative
        </Link>

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>DYSON NEWS NETWORK</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">DNN Desk — Lead Agent & Specialists</h1>
          <p className="text-sm max-w-3xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Conductor leads the morning desk. Specialist AI assistants own each stage from national
            sources to a usable MP4 posted across seven social targets.
          </p>
        </div>

        {/* Lead */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#000', border: `2px solid ${DNN_DESK_LEAD.color}` }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${DNN_DESK_LEAD.color}22`, border: `1px solid ${DNN_DESK_LEAD.color}` }}>
                <Users className="w-6 h-6" style={{ color: DNN_DESK_LEAD.color }} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: DNN_DESK_LEAD.color }}>Lead agent</p>
                <h2 className="text-xl font-bold text-white">{DNN_DESK_LEAD.name}</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{DNN_DESK_LEAD.title} · {DNN_DESK_LEAD.role}</p>
                <p className="text-sm mt-2 max-w-2xl" style={{ color: 'rgba(255,255,255,0.75)' }}>{DNN_DESK_LEAD.owns}</p>
              </div>
            </div>
            <Link
              to="/admin/dnn/in-house-creative"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] px-4 py-2 rounded-full"
              style={{ background: GOLD, color: '#000' }}
            >
              <Clapperboard className="w-3.5 h-3.5" /> Run bake desk
            </Link>
          </div>
        </div>

        {/* Specialists */}
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4" style={{ color: GOLD }} />
          <h3 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Specialist assistants</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          {DNN_DESK_SPECIALISTS.map((agent) => (
            <div key={agent.id} className="rounded-2xl p-4" style={{ background: '#000', border: `1px solid ${agent.color}44` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: agent.color }}>{agent.stage}</p>
                  <h4 className="text-base font-bold text-white">{agent.name}</h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{agent.title}</p>
                </div>
                <Radio className="w-4 h-4 shrink-0" style={{ color: agent.color }} />
              </div>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{agent.owns}</p>
              <p className="text-[11px] mb-3 font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>{agent.functionHint}</p>
              <div className="flex flex-wrap gap-2">
                {agent.surfaces.map((path) => (
                  <Link
                    key={path}
                    to={path}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${agent.color}18`, color: agent.color, border: `1px solid ${agent.color}44` }}
                  >
                    {path.replace('/admin/', '')}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Seven sites */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: '#000', border: `1px solid ${GOLD}33` }}>
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4" style={{ color: GOLD }} />
            <h3 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              Seven social / distribution targets
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DNN_SOCIAL_TARGETS.map((site, i) => (
              <div key={site.id} className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}22` }}>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>0{i + 1}</p>
                <p className="text-sm font-bold text-white">{site.label}</p>
                <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {site.mode === 'api' ? 'Native video API' : site.mode === 'in_app' ? 'In-app player' : 'MP4 download / Loomly'}
                  {' · '}{site.specialist}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
            End state: Signal bakes <code style={{ color: GOLD }}>compositedVideoUrl</code> → Herald posts API channels
            and stages downloads for YouTube / TikTok / X. Plan: <code style={{ color: GOLD }}>DNN_DESK_AGENTS_AND_MP4_PLAN.md</code>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/dnn/in-house-creative" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: `1px solid ${GOLD}44` }}>
            Bake MP4 desk →
          </Link>
          <Link to="/admin/site-coordination" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Site Coordination →
          </Link>
          <Link to="/ai-assistants" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Full 21 AI Assistants →
          </Link>
        </div>
      </div>
    </div>
  );
}
