import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';
import {
  WORKFLOW_DESKS,
  MASTER_JOURNEYS,
  getDesk,
  getFlow,
} from '@/lib/departmentWorkflows';
import WorkflowActionPanel from '@/components/workflow/WorkflowActionPanel';
import WorkflowActionLog from '@/components/workflow/WorkflowActionLog';

const GOLD = '#D4AF37';

function Connector({ color }) {
  return (
    <div className="flex items-center shrink-0 px-1">
      <div className="w-5 h-0.5" style={{ background: `${color}40` }} />
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, opacity: 0.7 }} />
      <div className="w-5 h-0.5" style={{ background: `${color}40` }} />
    </div>
  );
}

function StageBox({ stage, index, color, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(stage.id)}
      className="group relative shrink-0 w-40 rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.03]"
      style={{
        borderColor: selected ? color : `${color}50`,
        background: selected ? `${color}22` : `${color}0d`,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mb-2"
        style={{ background: `${color}25`, border: `1px solid ${color}60`, color }}
      >
        {index + 1}
      </div>
      <h3 className="text-sm font-serif text-white leading-tight mb-1">{stage.title}</h3>
      <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {stage.plain}
      </p>
      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white mt-2" />
    </button>
  );
}

function StageDetail({ stage, color }) {
  if (!stage) return null;
  return (
    <div className="rounded-2xl p-6 mt-6" style={{ background: '#111', border: `1px solid ${color}40` }}>
      <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color }}>
        What happens here
      </p>
      <h3 className="text-xl font-serif text-white mb-2">{stage.title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed mb-5">{stage.plain}</p>
      {stage.pages?.length > 0 && (
        <>
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>
            Open these pages — no code required
          </p>
          <div className="flex flex-wrap gap-2">
            {stage.pages.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', color: GOLD, border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {p.label}
                <ExternalLink className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DepartmentView({ deskId }) {
  const desk = getDesk(deskId);
  const flow = getFlow(deskId);
  const [active, setActive] = useState(flow?.stages?.[0]?.id || null);

  if (!desk || !flow) {
    return (
      <div className="text-gray-400">
        Unknown desk. <Link to="/admin/workflows" className="text-dyson-gold underline">Back to master</Link>
      </div>
    );
  }

  const stage = flow.stages.find((s) => s.id === active) || flow.stages[0];

  return (
    <div>
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${desk.color}18`, border: `1px solid ${desk.color}50` }}
        >
          {desk.icon}
        </div>
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: desk.color }}>
            {desk.specialist}
          </p>
          <h1 className="text-3xl font-serif text-white">{flow.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{flow.audience}</p>
          <p className="text-sm text-gray-300 mt-3 max-w-3xl leading-relaxed">{flow.story}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3">Click a box. Read the English. Execute or open the page.</p>
      <div className="flex items-stretch gap-0 overflow-x-auto pb-4">
        {flow.stages.map((s, idx) => (
          <React.Fragment key={s.id}>
            <StageBox
              stage={s}
              index={idx}
              color={desk.color}
              selected={active === s.id}
              onSelect={setActive}
            />
            {idx < flow.stages.length - 1 && <Connector color={desk.color} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkflowActionPanel stage={stage} desk={desk} />
        </div>
        <div>
          <WorkflowActionLog deskId={desk.id} color={desk.color} />
        </div>
      </div>
    </div>
  );
}

function JourneyLane({ journey }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: '#111', border: `1px solid ${journey.color}35` }}>
      <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: journey.color }}>
        {journey.title}
      </p>
      <div className="flex items-stretch gap-0 overflow-x-auto">
        {journey.steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div
              className="shrink-0 w-36 rounded-xl p-3"
              style={{ background: `${journey.color}12`, border: `1px solid ${journey.color}40` }}
            >
              <p className="text-sm font-serif text-white leading-tight">{step.label}</p>
              <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.via}</p>
            </div>
            {idx < journey.steps.length - 1 && <Connector color={journey.color} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function MasterView() {
  const navigate = useNavigate();

  return (
    <div>
      <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>
        For new IT · pictures first
      </p>
      <h1 className="text-3xl font-serif mb-2" style={{ color: GOLD }}>Grok Bot- Master Workflow Atlas</h1>
      <p className="text-gray-400 text-sm max-w-3xl leading-relaxed mb-8">
        This is the map of how DysonRelo actually runs. Five department desks do the work.
        Three knowledge desks keep the files and pipes honest. Click a department to see its flowchart —
        the same look as the rest of this admin, no code required.
      </p>

      <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>
        Departments
      </p>
      <div className="flex items-stretch gap-0 overflow-x-auto pb-6">
        {WORKFLOW_DESKS.filter((d) => d.id !== 'knowledge').map((desk, idx, list) => (
          <React.Fragment key={desk.id}>
            <button
              type="button"
              onClick={() => navigate(`/admin/workflows/${desk.id}`)}
              className="group relative shrink-0 w-44 rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.03]"
              style={{ borderColor: `${desk.color}50`, background: `${desk.color}0d` }}
            >
              <div className="text-2xl mb-2">{desk.icon}</div>
              <h2 className="text-sm font-serif text-white leading-tight">{desk.name}</h2>
              <p className="text-[11px] mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {desk.short}
              </p>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white mt-2" />
            </button>
            {idx < list.length - 1 && <Connector color={desk.color} />}
          </React.Fragment>
        ))}
      </div>

      <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: '#3b82f6' }}>
        Shared knowledge & pipes
      </p>
      <button
        type="button"
        onClick={() => navigate('/admin/workflows/knowledge')}
        className="w-full text-left rounded-2xl p-5 mb-8 transition-all hover:scale-[1.01]"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.35)' }}
      >
        <p className="text-lg font-serif text-white">Canon → Playbook → Conduit</p>
        <p className="text-sm text-gray-400 mt-1">
          Who we are, how we work, what is plugged in. Departments read these. They do not rewrite them.
        </p>
      </button>

      <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: GOLD }}>
        Four journeys humans can follow
      </p>
      <div className="space-y-4">
        {MASTER_JOURNEYS.map((j) => (
          <JourneyLane key={j.id} journey={j} />
        ))}
      </div>
    </div>
  );
}

export default function AdminWorkflowAtlas() {
  const { deskId } = useParams();

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to={deskId ? '/admin/workflows' : '/admin'}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {deskId ? 'Master atlas' : 'Admin home'}
          </Link>
          <div className="flex flex-wrap gap-2">
            {WORKFLOW_DESKS.map((d) => (
              <Link
                key={d.id}
                to={`/admin/workflows/${d.id}`}
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  border: `1px solid ${deskId === d.id ? d.color : 'rgba(255,255,255,0.15)'}`,
                  color: deskId === d.id ? d.color : '#aaa',
                  background: deskId === d.id ? `${d.color}18` : 'transparent',
                }}
              >
                {d.icon} {d.name}
              </Link>
            ))}
          </div>
        </div>

        {deskId ? <DepartmentView deskId={deskId} /> : <MasterView />}
      </div>
    </div>
  );
}