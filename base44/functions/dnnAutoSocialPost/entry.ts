import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { postBroadcastToSocial } from '../../shared/dnnSocialPostCore.ts';

/**
 * dnnAutoSocialPost — End-of-pipeline automatic social posting.
 *
 * Triggered by a Base44 entity automation whenever a DnnBroadcast record's
 * status transitions to "ready" (n8n W2 uploaded the final composited MP4
 * with the studio background baked in).
 *
 * Posts the broadcast to ALL distribution channels in one call:
 *   - LinkedIn: DNN page, Bob Dyson page, Dyson & Dyson Relocation page,
 *     AND the admin's personal LinkedIn profile.
 *   - Facebook: DNN News page (or first managed page).
 *   - Instagram: Business account Reels.
 *
 * Guards:
 *   - Only runs when status is 'ready' or 'completed' (finished video).
 *   - Skips any channel that already has a 'sent' distribution entry, so a
 *     re-fire (e.g. status later flips to 'completed') only retries channels
 *     that failed or were never attempted — no duplicate posts.
 *
 * Trigger: entity automation on DnnBroadcast update (status → ready/completed)
 *   Payload shape: { event, data, old_data, changed_fields }
 */
const AUTO_CHANNELS = ['linkedin', 'facebook', 'instagram'];
const AUTO_LINKEDIN_PAGES = ['DNN', 'Bob Dyson', 'Dyson & Dyson Relocation', 'personal'];

export default async function(req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch (_) { body = {}; }

    // Entity automation payload: { event: {type, entity_name, entity_id}, data, old_data, changed_fields }
    const broadcastId = body?.event?.entity_id || body?.data?.id || body?.broadcast_id;
    if (!broadcastId) {
      return Response.json({ error: 'No broadcast id in automation payload' }, { status: 400 });
    }

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcastId).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    // Only post when the finished (composited) video is available.
    if (broadcast.status !== 'ready' && broadcast.status !== 'completed') {
      return Response.json({ skipped: true, reason: `status is '${broadcast.status}', not 'ready' or 'completed'` });
    }

    const hasComposited = broadcast.compositedVideoUrl && !String(broadcast.compositedVideoUrl).startsWith('creatomate:pending:');
    const hasRaw = broadcast.videoUrl && !String(broadcast.videoUrl).startsWith('heygen:pending:');
    if (!hasComposited && !hasRaw) {
      return Response.json({ skipped: true, reason: 'No finished video URL yet' });
    }

    // Mark the show as posted to the in-app News section (DB-only flag — no API
    // call). This is what makes it appear on the News page featured slot + the
    // Broadcast Archive. Mutate the in-memory broadcast.distribution so the
    // social post call below includes it in the array it writes back; if social
    // is fully skipped we persist it ourselves.
    let addedInAppNews = false;
    const distArr = [...(broadcast.distribution || [])];
    if (!distArr.some(d => d.channel === 'in_app_news' && d.status === 'sent')) {
      distArr.push({ channel: 'in_app_news', status: 'sent', recipient: 'All News Page Visitors', posted_at: new Date().toISOString() });
      broadcast.distribution = distArr;
      addedInAppNews = true;
    }

    // Skip channels already successfully posted (prevents duplicates on re-fire).
    const dist = broadcast.distribution || [];
    const alreadySent = (ch) => dist.some(d => d.channel === ch && d.status === 'sent');
    const channelsToPost = AUTO_CHANNELS.filter(ch => !alreadySent(ch));
    if (channelsToPost.length === 0) {
      if (addedInAppNews) {
        await base44.asServiceRole.entities.DnnBroadcast.update(broadcastId, { distribution: broadcast.distribution });
      }
      return Response.json({ skipped: true, reason: 'All social channels already posted', broadcast_id: broadcastId, added_in_app_news: addedInAppNews });
    }

    const result = await postBroadcastToSocial(base44, broadcast, {
      channels: channelsToPost,
      linkedinPages: channelsToPost.includes('linkedin') ? AUTO_LINKEDIN_PAGES : [],
    });

    return Response.json({
      success: result.success,
      broadcast_id: broadcastId,
      channels_posted: channelsToPost,
      added_in_app_news: addedInAppNews,
      ...result,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}