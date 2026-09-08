import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { synthesizeCharlieSpeech, CHARLIE_RUBEN_VOICE_ID } from '../../shared/charlieVoiceSynthesizer.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { text } = await req.json();
    if (!text) return Response.json({ error: 'No text provided' }, { status: 400 });

    const clean = text.replace(/[*_#`]/g, '').replace(/\n+/g, ' ').trim();

    // Generate Charlie's authentic American voice (HeyGen Ruben voice)
    const audioUrl = await synthesizeCharlieSpeech(base44, clean);

    if (!audioUrl) {
      return Response.json({ error: 'Failed to generate speech' }, { status: 500 });
    }

    return Response.json({
      audioUrl,
      voice: 'ruben',
      voice_id: CHARLIE_RUBEN_VOICE_ID,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}