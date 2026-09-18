import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { synthesizeBobSpeech, BOB_STUDIO_VOICE_ID } from '../../shared/bobVoiceSynthesizer.ts';

export default async function(req: Request): Promise<Response> {
  try {
    createClientFromRequest(req);
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'No text provided' }, { status: 400 });
    }

    const audioUrl = await synthesizeBobSpeech(text);
    if (!audioUrl) {
      return Response.json({ error: 'Failed to generate Bob studio speech' }, { status: 500 });
    }

    return Response.json({ audioUrl, voice: 'bob_studio', voice_id: BOB_STUDIO_VOICE_ID });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}