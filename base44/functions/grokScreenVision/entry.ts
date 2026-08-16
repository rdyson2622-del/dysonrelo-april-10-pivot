import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Grok Screen Vision — receives a base64 screenshot + prompt (+ rolling text
// conversation) and forwards it to the platform's built-in LLM (the same engine
// that powers the Grok Bot specialists in the Command Center) with the image
// attached via file_urls for vision capability.
//
// This drops the Anthropic API dependency — no ANTHROPIC_API_KEY needed.
// Uses platform LLM credits (InvokeLLM) instead.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
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
    const ext = mediaType === 'image/png' ? 'png' : 'jpg';

    // Decode base64 → binary buffer
    const binString = atob(image_base64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }

    // Upload the frame so InvokeLLM can read it via file_urls (vision)
    const file = new File([bytes], `screen-frame.${ext}`, { type: mediaType });
    const uploadRes = await base44.integrations.Core.UploadFile({ file });
    const fileUrl = uploadRes?.file_url;
    if (!fileUrl) {
      throw new Error('Frame upload failed — no file_url returned.');
    }

    // Build the full prompt: system instructions + rolling conversation + current ask
    // (InvokeLLM has no separate system_prompt param, so we fold it in)
    let fullPrompt = '';
    if (system_prompt) {
      fullPrompt += `${system_prompt}\n\n---\n\n`;
    }
    if (Array.isArray(conversation)) {
      for (const turn of conversation) {
        if (turn && turn.role && turn.content) {
          fullPrompt += `${turn.role === 'assistant' ? 'Grok' : 'User'}: ${turn.content}\n`;
        }
      }
      fullPrompt += '\n---\n\n';
    }
    if (prompt) {
      fullPrompt += `User: ${prompt}\nGrok:`;
    } else {
      fullPrompt += `Grok:`;
    }

    // Call the platform LLM with the image attached — routes to a vision-capable model
    const llmRes = await base44.integrations.Core.InvokeLLM({
      prompt: fullPrompt,
      file_urls: [fileUrl],
    });

    const text = typeof llmRes === 'string'
      ? llmRes
      : (llmRes?.text || (llmRes?.response) || JSON.stringify(llmRes));

    return Response.json({
      text: String(text).trim(),
      usage: null,
      model: 'grok-bot',
      stop_reason: null,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}