import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const CHANNEL_LABELS = { 'DNN in-app': 'DNN News section in app' };

export default function PrDistributionTable({ distributions, onUpdateMetrics }) {
  if (!distributions.length) {
    return <p className="text-sm text-muted-foreground">No distributions yet.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/40 text-left text-muted-foreground">
        <tr>
          <th className="p-2">Channel</th>
          <th className="p-2">Destination</th>
          <th className="p-2">Posted</th>
          <th className="p-2">Views</th>
          <th className="p-2">Clicks</th>
          <th className="p-2">Leads</th>
          <th className="p-2">Metrics Updated</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {distributions.map(d => (
          <tr key={d.id} className="border-t">
            <td className="p-2">{CHANNEL_LABELS[d.channel] || d.channel}</td>
            <td className="p-2">{d.destination || '—'}</td>
            <td className="p-2">{d.postedAt ? format(new Date(d.postedAt), 'MMM d, yyyy') : '—'}</td>
            <td className="p-2">{d.views ?? '—'}</td>
            <td className="p-2">{d.clicks ?? '—'}</td>
            <td className="p-2">{d.leadsAttributed ?? '—'}</td>
            <td className="p-2">{d.metricsUpdatedAt ? format(new Date(d.metricsUpdatedAt), 'MMM d, yyyy') : '—'}</td>
            <td className="p-2"><Button size="sm" variant="ghost" onClick={() => onUpdateMetrics(d)}>Update</Button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}