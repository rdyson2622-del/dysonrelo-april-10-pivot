import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { waitUntil } from 'base44:runtime';

/**
 * emailOpenPixel — Returns a 1x1 transparent GIF and logs an email open.
 *
 * Called unauthenticated (email clients fetch the image via GET).
 * Query params:
 *   bid  — DnnBroadcast ID (required to log an open)
 *   cid  — AudienceContact ID (optional)
 *   aid  — TargetAudienceProfile ID (optional)
 *
 * The open is recorded as an EmailOpen entity (service role) AFTER the
 * pixel is returned, via waitUntil, so the image response is not delayed.
 */

const PIXEL_B64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function pixelBytes() {
  return Uint8Array.from(atob(PIXEL_B64), (c) => c.charCodeAt(0));
}

export default async function (req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const bid = url.searchParams.get('bid') || '';
    const cid = url.searchParams.get('cid') || '';
    const aid = url.searchParams.get('aid') || '';
    const ua = req.headers.get('user-agent') || '';

    if (bid) {
      const base44 = createClientFromRequest(req);
      waitUntil(
        base44.asServiceRole.entities.EmailOpen.create({
          broadcast_id: bid,
          contact_id: cid,
          audience_id: aid,
          channel: 'subscriber_email',
          opened_at: new Date().toISOString(),
          user_agent: ua.slice(0, 300),
        }).catch(() => {})
      );
    }

    return new Response(pixelBytes(), {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response(pixelBytes(), {
      status: 200,
      headers: { 'Content-Type': 'image/gif' },
    });
  }
}