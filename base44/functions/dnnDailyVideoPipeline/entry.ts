import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Active HeyGen presenter config — passed through to n8n so the external
// pipeline renders with the correct anchor avatar + voice.
const DEFAULT_AVATAR_ID = '41f40b894f6944188c7908253b12e921'; // Charlie Simmons
const DEFAULT_VOICE_ID = 'cc5fb6c924064712ba9f690852aa4646';  // Charlie voice

/**
 * dnnDailyVideoPipeline — "Generate Daily Broadcast" trigger.
 *
 * Hands video generation off to n8n via webhook. Instead of running internal
 * HeyGen + Creatomate polling loops, this function:
 *   1. Creates a DnnBroadcast record with status: "processing"
 *   2. Sends an HTTP POST to the n8n webhook (N8N_BROADCAST_WEBHOOK_URL) with
 *      { broadcast_id, prompt_topics }
 *
 * n8n performs the full render pipeline and calls back `n8nBroadcastCallback`
 * with the final 1080p MP4 URL, which flips the record to status: "ready".
 *
 * Body:
 *   { prompt_topics?: string }  — optional topics/headlines override
 *                                (defaults to today's published article headlines)
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

    const webhookUrl = secrets.get('N8N_BROADCAST_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'N8N_BROADCAST_WEBHOOK_URL is not configured' }, { status: 500 });
    }

    // Parse optional prompt_topics from the request body
    let promptTopics = '';
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        promptTopics = String(body?.prompt_topics || '').trim();
      } catch (_) {}
    }

    // Default to today's published article headlines when no topics provided
    if (!promptTopics) {
      const today = await base44.asServiceRole.entities.DnnArticle.filter(
        { status: 'published' },
        '-generated_date',
        10
      );
      promptTopics = today
        .map(a => a.headline)
        .filter(Boolean)
        .join(' | ') || "Today's top relocation and real estate market headlines";
    }

    const today = new Date().toISOString().slice(0, 10);

    // Determine the next show number
    const existing = await base44.asServiceRole.entities.DnnBroadcast.list('-created_date', 1);
    const nextShowNumber = (existing[0]?.show_number || 0) + 1;

    // 1. Create the DnnBroadcast record in "processing" state
    const broadcast = await base44.asServiceRole.entities.DnnBroadcast.create({
      show_name: `Show ${nextShowNumber}`,
      show_number: nextShowNumber,
      broadcast_date: today,
      presenter: 'charlie',
      format: 'solo',
      status: 'processing',
      prompt_topics: promptTopics,
      headlines: promptTopics.split(' | ').filter(Boolean),
    });

    // 2. Fire the n8n webhook (post-response so we return immediately)
    const fire = async () => {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            broadcast_id: broadcast.id,
            prompt_topics: promptTopics,
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error(`n8n webhook failed (${res.status}): ${text}`);
          await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
            status: 'failed',
            errorMessage: `n8n webhook returned ${res.status}`,
          });
        }
      } catch (err) {
        console.error('n8n webhook error:', err.message);
        await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
          status: 'failed',
          errorMessage: `n8n webhook error: ${err.message}`,
        });
      }
    };

    // Attempt the webhook inline so we can report success/failure to the admin.
    // n8n typically responds 200 immediately (async workflow).
    let webhookStatus = 'sent';
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          broadcast_id: broadcast.id,
          prompt_topics: promptTopics,
          avatar_id: DEFAULT_AVATAR_ID,
          voice_id: DEFAULT_VOICE_ID,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        webhookStatus = `failed (${res.status})`;
        await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
          status: 'failed',
          errorMessage: `n8n webhook returned ${res.status}: ${text.slice(0, 200)}`,
        });
      }
    } catch (err) {
      webhookStatus = `error: ${err.message}`;
      await base44.asServiceRole.entities.DnnBroadcast.update(broadcast.id, {
        status: 'failed',
        errorMessage: `n8n webhook error: ${err.message}`,
      });
    }

    return Response.json({
      success: webhookStatus === 'sent',
      broadcast_id: broadcast.id,
      status: broadcast.status,
      prompt_topics: promptTopics,
      webhook: webhookStatus,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}