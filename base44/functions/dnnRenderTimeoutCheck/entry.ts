import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * dnnRenderTimeoutCheck — watchdog for stuck n8n Higgsfield renders.
 *
 * The n8n pipeline calls back dnnRenderDispatched / n8nBroadcastCallback
 * when done, but if n8n stalls or never responds, a broadcast can sit in
 * "processing" or "rendering" forever with no alert — a silent failure.
 *
 * This scans broadcasts stuck in those statuses for more than
 * TIMEOUT_MINUTES since their last update and force-marks them "failed"
 * with a clear errorMessage. That update triggers the existing
 * "Broadcast Render Failure Alert" entity automation, which SMS's the admin.
 *
 * Run on a schedule (see automation). Admin-only.
 */

const TIMEOUT_MINUTES = 20;
const STUCK_STATUSES = ['processing', 'rendering', 'compositing'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const Broadcasts = base44.asServiceRole.entities.DnnBroadcast;
    const cutoff = Date.now() - TIMEOUT_MINUTES * 60 * 1000;

    const flagged = [];
    for (const status of STUCK_STATUSES) {
      const stuck = await Broadcasts.filter({ status });
      for (const b of stuck) {
        const lastUpdate = new Date(b.updated_date || b.created_date).getTime();
        if (lastUpdate < cutoff) {
          await Broadcasts.update(b.id, {
            status: 'failed',
            errorMessage: `Render timed out — no callback from the render pipeline after ${TIMEOUT_MINUTES} minutes (was stuck in "${status}").`,
          });
          flagged.push({ id: b.id, show_name: b.show_name, was_status: status });
        }
      }
    }

    return Response.json({ success: true, flagged_count: flagged.length, flagged });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}