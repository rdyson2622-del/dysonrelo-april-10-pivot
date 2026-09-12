import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, UserCheck, LayoutDashboard, BookOpen, BarChart3 } from 'lucide-react';

export default function WorkflowModuleCards({
  onOpenImport,
  onOpenAssignBatch,
  onSelectTab,
  pendingCount = 0,
  scriptsCount = 2,
}) {
  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#D4AF37]">
            OPERATIONAL WORKFLOW MODULES
          </h2>
          <span className="text-[10px] text-white/50 font-medium">
            (Stage 4 Call Desk Architecture)
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
          5 Active Pipelines
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Card 1: Import */}
        <div 
          onClick={onOpenImport}
          className="p-3.5 rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#D4AF37] hover:scale-[1.01] transition-all flex flex-col justify-between space-y-2 cursor-pointer shadow-md group"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/20 group-hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
              Import Today’s List (CSV/Numbers)
            </h3>
            <p className="text-[11px] text-white/60 leading-snug">
              Daily $2M+ pending listings import via CSV or Numbers spreadsheet into PendingLead schema.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>Pipeline 1</span>
            <span className="text-[#D4AF37] font-semibold flex items-center gap-0.5">
              <span>Launch</span> →
            </span>
          </div>
        </div>

        {/* Card 2: Batch Assignment */}
        <div 
          onClick={onOpenAssignBatch}
          className="p-3.5 rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#D4AF37] hover:scale-[1.01] transition-all flex flex-col justify-between space-y-2 cursor-pointer shadow-md group"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/20 group-hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
              Assign Batch to Relocation Agent
            </h3>
            <p className="text-[11px] text-white/60 leading-snug">
              One-click allocation of targeted batch to assigned relocation affiliate (Lisa Hurt).
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>Pipeline 2</span>
            <span className="text-[#D4AF37] font-semibold flex items-center gap-0.5">
              <span>Assign</span> →
            </span>
          </div>
        </div>

        {/* Card 3: Agent Working Board */}
        <Link
          to="/relocation-agent-desk"
          className="p-3.5 rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#D4AF37] hover:scale-[1.01] transition-all flex flex-col justify-between space-y-2 cursor-pointer shadow-md group block"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/20 group-hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
              Agent Working Board
            </h3>
            <p className="text-[11px] text-white/60 leading-snug">
              High-density daily caller board with inline disposition, outcome logging, and callback calendar.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>{pendingCount} leads in queue</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <span>Open</span> ↗
            </span>
          </div>
        </Link>

        {/* Card 4: Scripts */}
        <div 
          onClick={() => onSelectTab('scripts')}
          className="p-3.5 rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#D4AF37] hover:scale-[1.01] transition-all flex flex-col justify-between space-y-2 cursor-pointer shadow-md group"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/20 group-hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
              Scripts Library (Pending + HR)
            </h3>
            <p className="text-[11px] text-white/60 leading-snug">
              Version-controlled fiduciary scripts for Pending Listing inquiries and Corporate HR onboarding calls.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>{scriptsCount} Scripts</span>
            <span className="text-[#D4AF37] font-semibold flex items-center gap-0.5">
              <span>Review</span> →
            </span>
          </div>
        </div>

        {/* Card 5: Analytics */}
        <div 
          onClick={() => onSelectTab('analytics')}
          className="p-3.5 rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#D4AF37] hover:scale-[1.01] transition-all flex flex-col justify-between space-y-2 cursor-pointer shadow-md group"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/20 group-hover:border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
              Analytics (Pending vs HR)
            </h3>
            <p className="text-[11px] text-white/60 leading-snug">
              Split performance telemetry tracking pending lead connect rates independently from HR prospect calls.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>Split Metrics</span>
            <span className="text-[#D4AF37] font-semibold flex items-center gap-0.5">
              <span>Inspect</span> →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}