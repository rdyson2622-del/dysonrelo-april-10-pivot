import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * dnnMarkStaleOnEdit — Entity automation handler for DnnBroadcast.
 *
 * Fires on every DnnBroadcast update. If the changed fields include script,
 * clips, headlines, presenter, or format, the current stitched MP4 is stale.
 * Sets needsReRender=true so distribution tools know to re-render before posting.
 *
 * This does NOT fire on needsReRender/videoUrl/heygenId changes (not in the
 * stale-field list), so there is no infinite loop.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { event, data, changed_fields } = body;
    if (!data || !event) return Response.json({ skipped: true });

    if (event.type !== 'update') return Response.json({ skipped: 'not_update' });

    // Fields that invalidate the stitched MP4
    const STALE_FIELDS = ['script', 'clips', 'headlines', 'presenter', 'format'];
    const hasStaleChange = (changed_fields || []).some((f) => STALE_FIELDS.includes(f));

    if (!hasStaleChange) return Response.json({ skipped: 'no_stale_fields' });
    if (data.needsReRender === true) return Response.json({ skipped: 'already_stale' });

    await base44.asServiceRole.entities.DnnBroadcast.update(data.id, { needsReRender: true });

    console.log(`[dnnMarkStaleOnEdit] Broadcast ${data.id} flagged as stale (changed: ${changed_fields?.join(', ')})`);
    return Response.json({ success: true, marked_stale: true, entity_id: data.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});