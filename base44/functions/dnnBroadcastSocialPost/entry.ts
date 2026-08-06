import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { postBroadcastToSocial } from '../../shared/dnnSocialPostCore.ts';

/**
 * dnnBroadcastSocialPost — Posts a finished DNN broadcast MP4 to LinkedIn
 * (video upload), Facebook (video upload), and Instagram (Reels) in one call.
 *
 * Body:
 *   { broadcast_id, text?, organizationName?, linkedinPages?: string[], channels?: string[] }
 *
 * - LinkedIn: pass linkedinPages: ['DNN','Bob Dyson','Dyson & Dyson Relocation','personal']
 *   to post to multiple pages in one call (video downloaded once, reused per page).
 *   organizationName (single string) still works for backward compat.
 * - Facebook: uploads the MP4 to the first managed Page as a native video.
 * - Instagram: 2-step Reels publish (create container, then publish).
 * - Records each successful post in the broadcast's distribution array.
 *
 * Auth: admin session.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { broadcast_id, text, organizationName } = body;
    if (!broadcast_id) {
      return Response.json({ error: 'broadcast_id is required' }, { status: 400 });
    }

    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.get(broadcast_id).catch(() => null);
    if (!broadcast) {
      return Response.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    const result = await postBroadcastToSocial(base44, broadcast, {
      channels: body.channels,
      linkedinPages: body.linkedinPages,
      organizationName,
      text,
    });

    return Response.json({
      success: result.success,
      broadcast_id,
      ...result,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}