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

    const { action, systemPrompt, sessionLogId, duration_seconds, transcript_turns } = await req.json();

    if (action === 'start_session') {
      // --- DAILY SESSION CAP: max 3 sessions per user per day (admins exempt, since they test repeatedly) ---
      if (user.role !== 'admin') {
        const today = new Date().toISOString().slice(0, 10); // "2026-03-17"
        const todaySessions = await base44.asServiceRole.entities.TalkingSessionLog.filter({ user_id: user.id });
        const sessionsTodayCount = todaySessions.filter(s => s.started_at?.slice(0, 10) === today).length;

        if (sessionsTodayCount >= 3) {
          return Response.json({
            error: 'Daily session limit reached. You may start a new session tomorrow.',
            limit_reached: true,
          }, { status: 429 });
        }
      }
      // -----------------------------------------------------------

      // Native-audio Live model — supports barge-in interruption, affective
      // (emotion-aware) dialog, and proactive speaking without a text round-trip.
      const model = 'gemini-2.5-flash-preview-native-audio-dialog';
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;

      // Log the session start for admin analytics/cost tracking
      const log = await base44.asServiceRole.entities.TalkingSessionLog.create({
        user_id: user.id,
        user_name: user.full_name || '',
        user_email: user.email || '',
        model,
        started_at: new Date().toISOString(),
      });

      return Response.json({
        wsUrl,
        model,
        systemPrompt,
        clientId: user.id,
        sessionLogId: log.id,
      });
    }

    if (action === 'end_session') {
      if (!sessionLogId) {
        return Response.json({ error: 'sessionLogId is required' }, { status: 400 });
      }
      const seconds = Number(duration_seconds) || 0;
      const minutes = seconds / 60;
      // Rough estimate: Gemini 2.5 Flash native-audio Live pricing is ~$0.005/min
      // audio-in + ~$0.018/min audio-out; assume roughly equal in/out per call.
      const estimated_cost_usd = Math.round(minutes * 0.023 * 10000) / 10000;

      const updated = await base44.asServiceRole.entities.TalkingSessionLog.update(sessionLogId, {
        ended_at: new Date().toISOString(),
        duration_seconds: seconds,
        transcript_turns: Number(transcript_turns) || 0,
        estimated_cost_usd,
      });

      return Response.json({ success: true, log: updated });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});