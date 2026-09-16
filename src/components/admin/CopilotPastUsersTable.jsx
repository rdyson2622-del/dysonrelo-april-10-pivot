import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Clock, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotPastUsersTable() {
  const { data: visitors = [], isLoading: isLoadingVisitors } = useQuery({
    queryKey: ['copilot-past-users'],
    queryFn: async () => {
      const [vList, touches, reports] = await Promise.all([
        base44.entities.CopilotVisitor.list('-last_seen_at', 100),
        base44.entities.CopilotPropertyTouch.list('-created_at', 200),
        base44.entities.CopilotReportRequest.list('-requested_at', 200)
      ]);

      // Create lookup maps for fast enrichment
      const touchesByVisitor = new Map();
      touches.forEach(t => {
        if (t.visitor_id && !touchesByVisitor.has(t.visitor_id)) {
          touchesByVisitor.set(t.visitor_id, t);
        }
      });

      const reportsByPhone = new Map();
      const reportsByEmail = new Map();
      reports.forEach(r => {
        if (r.phone && !reportsByPhone.has(r.phone)) {
          reportsByPhone.set(r.phone, r);
        }
        if (r.email && !reportsByEmail.has(r.email.toLowerCase())) {
          reportsByEmail.set(r.email.toLowerCase(), r);
        }
      });

      return (vList || []).map(v => {
        const lastTouch = touchesByVisitor.get(v.id);
        const lastReport = (v.phone && reportsByPhone.get(v.phone)) || 
                           (v.email && reportsByEmail.get(v.email.toLowerCase())) || 
                           null;

        const lastAddress = lastTouch?.address || lastReport?.address || '—';
        const lastReportDate = lastReport?.requested_at || (lastTouch?.report_requested ? lastTouch?.created_at : null);
        const reportStatus = lastReport?.status || (lastTouch?.report_requested ? 'held' : 'none');

        return {
          id: v.id,
          name: v.name || 'Anonymous Visitor',
          phone: v.phone || null,
          email: v.email || null,
          source: v.source || 'copilot',
          lastSeenAt: v.last_seen_at || v.created_date,
          lastAddress,
          lastReportDate,
          reportStatus
        };
      });
    },
    refetchInterval: 15000
  });

  return (
    <div 
      className="rounded-2xl p-5 sm:p-6 shadow-xl space-y-4" 
      style={{ background: '#000', border: `1px solid rgba(212,175,55,0.3)` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-[#D4AF37]/30">
            <Users className="w-4 h-4" style={{ color: GOLD }} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-wide">
              Copilot past users
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              Read-only store of Copilot visitors, last audited property, and held report requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300">
            {visitors.length} {visitors.length === 1 ? 'record' : 'records'}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Read-Only
          </span>
        </div>
      </div>

      {isLoadingVisitors ? (
        <div className="py-8 text-center">
          <div className="w-6 h-6 border-2 border-stone-600 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 mt-2 font-mono">Loading Copilot past users...</p>
        </div>
      ) : visitors.length === 0 ? (
        <div className="py-8 text-center text-stone-400 space-y-1">
          <p className="text-xs font-mono">No Copilot past users recorded yet.</p>
          <p className="text-[11px] text-stone-500 font-sans">
            Submissions through the Text Me Report capture modal will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans text-stone-300">
            <thead>
              <tr className="border-b border-white/10 text-[#D4AF37] uppercase text-[10px] font-mono tracking-wider">
                <th className="py-2.5 px-3">Phone / Email</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Last Address</th>
                <th className="py-2.5 px-3">Last Report Request</th>
                <th className="py-2.5 px-3 text-right">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((user) => {
                const reportDateFormatted = user.lastReportDate 
                  ? new Date(user.lastReportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—';
                const lastSeenFormatted = user.lastSeenAt
                  ? new Date(user.lastSeenAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—';

                return (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono">
                      <div className="space-y-0.5">
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-white font-medium">
                            <Phone className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                            <Mail className="w-3 h-3 text-stone-500 shrink-0" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                          </div>
                        )}
                        {!user.phone && !user.email && (
                          <span className="text-stone-500 italic text-[11px]">No contact info</span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-medium text-white">
                      <span>{user.name}</span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 max-w-[280px]">
                        <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span className="truncate text-stone-200" title={user.lastAddress}>
                          {user.lastAddress}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      {user.reportStatus === 'held' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                            Held
                          </span>
                          <span className="text-stone-400 text-[11px]">{reportDateFormatted}</span>
                        </div>
                      ) : user.lastReportDate ? (
                        <span className="text-stone-300">{reportDateFormatted}</span>
                      ) : (
                        <span className="text-stone-600">None</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-stone-400 text-[11px]">
                      {lastSeenFormatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}