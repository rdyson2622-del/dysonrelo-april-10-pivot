import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mapWebhookEventToMilestone, upsertEscrowMilestone } from '../../shared/boldtrailSync.ts';

/**
 * Option C — API Nation webhook receiver.
 * API Nation fires webhooks when BoldTrail BackOffice transactions change.
 * This endpoint validates the shared secret (passed as ?secret=...), parses
 * the payload, and upserts an EscrowMilestone record.
 *
 * No user auth (webhook) — uses service role + secret validation.
 * Configure the destination URL in API Nation as:
 *   https://api.base44.com/v1/apps/<APP_ID>/functions/apiNationWebhook?secret=<API_NATION_WEBHOOK_SECRET>
 */
export default async function(req) {
  try {
    const expectedSecret = secrets.get('API_NATION_WEBHOOK_SECRET');
    if (!expectedSecret) {
      return Response.json({ error: 'API_NATION_WEBHOOK_SECRET not set' }, { status: 500 });
    }
    const url = new URL(req.url);
    const provided = url.searchParams.get('secret');
    if (!provided || provided !== expectedSecret) {
      return Response.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const event = await req.json();
    if (!event || typeof event !== 'object') {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // API Nation may send a single event or a batch
    const events = Array.isArray(event.events) ? event.events : [event];
    let created = 0, updated = 0, skipped = 0;
    for (const evt of events) {
      try {
        const milestone = mapWebhookEventToMilestone(evt, evt.client_id);
        if (!milestone.escrow_number || !milestone.milestone_type) { skipped++; continue; }
        await upsertEscrowMilestone(base44, milestone);
        created++;
      } catch { skipped++; }
    }

    return Response.json({
      status: 'ok',
      source: 'apination_webhook',
      events_received: events.length,
      milestones_upserted: created,
      skipped,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}