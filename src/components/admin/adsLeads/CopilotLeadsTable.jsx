import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

function isWithinHours(dateStr, hours) {
  if (!dateStr) return false;
  return (Date.now() - new Date(dateStr).getTime()) <= hours * 60 * 60 * 1000;
}

function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export default function CopilotLeadsTable() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await base44.entities.CopilotReportRequest.list('-requested_at', 100);
    setLeads(rows);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const last24h = leads.filter(l => isWithinHours(l.requested_at, 24)).length;
  const last7d = leads.filter(l => isWithinHours(l.requested_at, 24 * 7)).length;
  const mtd = leads.filter(l => isThisMonth(l.requested_at)).length;

  return (
    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111111] p-5 text-white">
      <h2 className="text-lg font-semibold text-[#D4AF37] mb-3">CoPilot Leads (Text Me / Report Requests)</h2>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="rounded-xl border border-white/10 py-3"><p className="text-2xl font-bold">{last24h}</p><p className="text-xs text-white/50">Last 24 hours</p></div>
        <div className="rounded-xl border border-white/10 py-3"><p className="text-2xl font-bold">{last7d}</p><p className="text-xs text-white/50">Last 7 days</p></div>
        <div className="rounded-xl border border-white/10 py-3"><p className="text-2xl font-bold">{mtd}</p><p className="text-xs text-white/50">Month-to-date</p></div>
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-white/50">No Text Me / report requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/50 text-xs uppercase tracking-wide border-b border-white/10">
                <th className="py-2 pr-3">When</th>
                <th className="py-2 pr-3">Name / Phone</th>
                <th className="py-2 pr-3">Address</th>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 30).map(l => (
                <tr key={l.id} className="border-b border-white/5">
                  <td className="py-2 pr-3 whitespace-nowrap">{l.requested_at ? new Date(l.requested_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</td>
                  <td className="py-2 pr-3">{l.full_name || '—'}{l.phone ? ` · ${l.phone}` : ''}</td>
                  <td className="py-2 pr-3 max-w-[220px] truncate">{l.address || '—'}</td>
                  <td className="py-2 pr-3">{l.source || '—'}</td>
                  <td className="py-2 pr-3 capitalize">{l.status || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}