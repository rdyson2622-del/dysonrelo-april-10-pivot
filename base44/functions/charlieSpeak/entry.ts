import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { text } = await req.json();
    if (!text) return Response.json({ error: 'No text provided' }, { status: 400 });

    const clean = text.replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();

    // Generate Charlie's authoritative, distinguished male voice ('storm')
    const speechRes = await base44.asServiceRole.integrations.Core.GenerateSpeech({
      text: clean,
      voice: 'storm',
    });

    if (!speechRes?.url) {
      return Response.json({ error: 'Failed to generate speech' }, { status: 500 });
    }

    return Response.json({
      audioUrl: speechRes.url,
      voice: 'storm',
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}