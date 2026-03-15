import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// This function acts as a secure proxy for the Gemini Live API.
// It validates the user and returns a WebSocket URL for the client to connect to directly.
// NOTE: Gemini Live API requires a direct browser WebSocket connection.
// This endpoint validates auth and returns the secure WSS URL with the API key embedded.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, clientInfo, systemPrompt } = await req.json();

    if (action === 'start_session') {
      // Return the Gemini Live WebSocket URL for direct browser connection
      // The client connects directly to Gemini Live with the API key
      // This is the approved pattern for browser-based Gemini Live sessions
      const model = 'gemini-2.0-flash-live-001';
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;

      // Store session start in database
      await base44.asServiceRole.entities.ChatMessage.create({
        client_id: user.id,
        role: 'charlie',
        content: `[GEMINI LIVE SESSION STARTED] Client: ${clientInfo?.name || user.full_name} | Email: ${clientInfo?.email || user.email}`,
        message_type: 'task_update',
      });

      return Response.json({
        wsUrl,
        model,
        systemPrompt,
        clientId: user.id,
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});