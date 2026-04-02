import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

export default function AdminBatchSMSLog() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['batchSMSLogs'],
    queryFn: () => base44.entities.BatchSMSLog.list('-sent_at', 500),
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Batch SMS Logs</h1>
        <p className="text-sm text-slate-500 mb-6">{logs.length} total batches sent</p>

        {/* Purpose & Instructions */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-5">
            <div className="flex gap-4">
              <Send className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">What is this?</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Complete historical record of all SMS batch campaigns sent from the admin panel. Each entry tracks delivery success/failure rates, bounce metrics, and processing duration for compliance and performance auditing.
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    <span><strong>Sent:</strong> Messages successfully queued to Twilio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    <span><strong>Failed:</strong> Messages rejected by Twilio (bad number, carrier block, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>—</span>
                    <span><strong>Skipped:</strong> Contacts missing phone numbers or opted out already</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {logs.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center text-slate-400">
              No batch sends yet
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold">City</th>
                  <th className="text-center px-4 py-3 font-semibold">Batch Size</th>
                  <th className="text-center px-4 py-3 font-semibold">Sent</th>
                  <th className="text-center px-4 py-3 font-semibold">Failed</th>
                  <th className="text-center px-4 py-3 font-semibold">Skipped</th>
                  <th className="text-center px-4 py-3 font-semibold">Duration (min)</th>
                  <th className="text-left px-4 py-3 font-semibold">Sent By</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {log.sent_at ? new Date(log.sent_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{log.city || '—'}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{log.batch_size}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-green-100 text-green-700">{log.sent_count || 0}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {log.failed_count > 0 ? (
                        <Badge className="bg-red-100 text-red-700">{log.failed_count}</Badge>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{log.skipped_count || 0}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{log.estimated_duration_minutes || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs truncate max-w-[150px]" title={log.sent_by}>
                      {log.sent_by || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}