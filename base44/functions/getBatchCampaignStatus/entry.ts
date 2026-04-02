import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { city } = await req.json();

    // Get the most recent batch log for this city
    const logs = await base44.entities.BatchSMSLog.filter({ city }, '-sent_at', 1);
    if (!logs.length) {
      return Response.json({ status: 'not_found' });
    }

    const log = logs[0];
    const sentAt = new Date(log.sent_at);
    const now = new Date();
    const elapsedMs = now - sentAt;
    const elapsedMinutes = Math.floor(elapsedMs / 60000);
    
    // Each message takes 3 minutes, so estimate total time
    const totalMinutes = log.sent_count * 3;
    const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);
    const remainingHours = (remainingMinutes / 60).toFixed(1);
    
    // Estimate sent based on elapsed time (one every 3 minutes)
    const estimatedSent = Math.min(log.sent_count, Math.floor(elapsedMinutes / 3));

    return Response.json({
      city: log.city,
      total: log.sent_count,
      estimated_sent: estimatedSent,
      failed: log.failed_count || 0,
      skipped: log.skipped_count || 0,
      remaining_hours: remainingHours,
      sent_at: log.sent_at,
      is_active: remainingMinutes > 0,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});