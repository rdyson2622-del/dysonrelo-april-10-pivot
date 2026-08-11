import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Claude Screen Vision — receives a base64 screenshot + prompt (+ rolling text
// conversation) and forwards to the Anthropic Messages API with vision enabled.
// Returns Claude's text response. Used by the Admin Claude Screen Viewer for
// continuous screen observation.

export default async function(req) {
  try {
    const apiKey = secrets.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY secret not configured. Add it in Dashboard → Settings → Environment Variables.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const {
      image_base64,
      image_media_type,
      prompt,
      system_prompt,
      conversation,
      model,
      max_tokens,
    } = body;

    if (!image_base64 || typeof image_base64 !== 'string') {
      return Response.json({ error: 'Missing image_base64 (base64 string, no data: prefix).' }, { status: 400 });
    }
    if (!prompt && (!Array.isArray(conversation) || conversation.length === 0)) {
      return Response.json({ error: 'Provide either a prompt or a conversation history.' }, { status: 400 });
    }

    const mediaType = image_media_type || 'image/jpeg';

    // Build messages: prior text turns (if any) + current image+prompt turn.
    const messages = [];
    if (Array.isArray(conversation)) {
      for (const turn of conversation) {
        if (turn && turn.role && turn.content) {
          messages.push({ role: turn.role, content: String(turn.content) });
        }
      }
    }

    const currentContent = [
      { type: 'image', source: { type: 'base64', media_type: mediaType, data: image_base64 } },
    ];
    if (prompt) {
      currentContent.push({ type: 'text', text: String(prompt) });
    }
    messages.push({ role: 'user', content: currentContent });

    const payload = {
      model: model || 'claude-sonnet-4-5-20250929',
      max_tokens: Math.min(Math.max(Number(max_tokens) || 1024, 64), 4096),
      messages,
    };
    if (system_prompt) {
      payload.system = String(system_prompt);
    }

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const apiJson = await apiRes.json().catch(() => ({}));
    if (!apiRes.ok) {
      return Response.json(
        { error: apiJson?.error?.message || `Anthropic API error (${apiRes.status})`, raw: apiJson },
        { status: 502 }
      );
    }

    const text = (apiJson.content || []).map((c) => c.text || '').join('').trim();
    return Response.json({
      text,
      usage: apiJson.usage || null,
      model: apiJson.model || null,
      stop_reason: apiJson.stop_reason || null,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}