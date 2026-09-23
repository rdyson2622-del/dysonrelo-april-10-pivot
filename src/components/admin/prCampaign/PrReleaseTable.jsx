import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format } from 'date-fns';

const STATUSES = ['Draft', 'Approved', 'In production', 'Distributed', 'Archived'];

export default function PrReleaseTable({ releases, distributions, loading, onSelect }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => releases.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(r.title || '').toLowerCase().includes(q) && !(r.campaign || '').toLowerCase().includes(q)) return false;
    }
    return true;
  }), [releases, search, statusFilter]);

  const distCount = id => distributions.filter(d => d.pr_release_id === id).length;
  const lastMetricsUpdate = id => {
    const rows = distributions.filter(d => d.pr_release_id === id && d.metricsUpdatedAt);
    if (!rows.length) return '—';
    const latest = rows.sort((a, b) => new Date(b.metricsUpdatedAt) - new Date(a.metricsUpdatedAt))[0];
    return format(new Date(latest.metricsUpdatedAt), 'MMM d, yyyy');
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading releases…</p>;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex flex-wrap gap-3 p-4 border-b">
        <Input placeholder="Search title or campaign…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Week</th>
            <th className="p-3">Status</th>
            <th className="p-3">Approved</th>
            <th className="p-3"># Distributions</th>
            <th className="p-3">Last Metrics Update</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id} className="border-t cursor-pointer hover:bg-muted/30" onClick={() => onSelect(r.id)}>
              <td className="p-3 font-medium text-foreground">{r.title}</td>
              <td className="p-3">{r.weekLabel || '—'}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3">{r.approvedByBobAt ? format(new Date(r.approvedByBobAt), 'MMM d, yyyy') : '—'}</td>
              <td className="p-3">{distCount(r.id)}</td>
              <td className="p-3">{lastMetricsUpdate(r.id)}</td>
            </tr>
          ))}
          {!filtered.length && (
            <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No releases found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}