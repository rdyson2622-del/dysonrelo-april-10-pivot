import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { GOLD, statusConfig } from './relocationProjectStatus';

export default function RelocationProjectCard({ project, onClick }) {
  const cfg = statusConfig(project.status);
  const Icon = cfg.icon;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 transition-all hover:scale-[1.01]"
      style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-bold text-base text-white truncate">{project.clientName}</p>
        <span className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
          style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}55` }}>
          <Icon className="w-3 h-3" /> {cfg.label}
        </span>
      </div>
      <p className="text-sm text-white/70 flex items-center gap-1.5 flex-wrap">
        {project.originAddress || 'Origin TBD'} <ArrowRight className="w-3 h-3" style={{ color: GOLD }} /> {project.destinationMetro || 'Destination TBD'}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="w-3 h-3" />
          {project.targetMoveDate ? new Date(project.targetMoveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Move date TBD'}
        </span>
        {project.projectedReferralFee > 0 && (
          <span className="text-xs font-bold" style={{ color: GOLD }}>
            ${Number(project.projectedReferralFee).toLocaleString()} projected
          </span>
        )}
      </div>
    </button>
  );
}