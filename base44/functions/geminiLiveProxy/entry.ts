import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// This function acts as a secure proxy for the Gemini Live API.
// It validates the user and returns a WebSocket URL for the client to connect to directly.
// NOTE: Gemini Live API requires a direct browser WebSocket connection.
// This endpoint validates auth and returns the secure WSS URL with the API key embedded.

Deno.serve(async (req) => {
  try {
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'GEMINI_API_KEY secret is not configured' }, { status: 500 });
    }

    const base44 = createClientFromRequest(req);
    let user = null;
    try { user = await base44.auth.me(); } catch (_) { user = null; }
    const isGuest = !user;
    const guestId = isGuest ? `guest_${crypto.randomUUID()}` : null;

    const { action, systemPrompt, sessionLogId, duration_seconds, transcript_turns, error: sessionError } = await req.json();

    if (action === 'start_session') {
      // --- DAILY SESSION CAP: max 3 sessions per user per day (admins exempt; guests exempt) ---
      if (user && user.role !== 'admin') {
        const today = new Date().toISOString().slice(0, 10);
        const todaySessions = await base44.asServiceRole.entities.TalkingSessionLog.filter({ user_id: user.id });
        const sessionsTodayCount = todaySessions.filter(s => s.started_at?.slice(0, 10) === today).length;

        if (sessionsTodayCount >= 3) {
          return Response.json({
            error: 'Daily session limit reached. You may start a new session tomorrow.',
            limit_reached: true,
          }, { status: 429 });
        }
      }

      // Native-audio Live model
      const model = 'gemini-2.5-flash-preview-native-audio-dialog';
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;

      // Log the session start for admin analytics/cost tracking
      const log = await base44.asServiceRole.entities.TalkingSessionLog.create({
        user_id: user ? user.id : guestId,
        user_name: user ? (user.full_name || '') : 'Guest (not logged in)',
        user_email: user ? (user.email || '') : '',
        model,
        started_at: new Date().toISOString(),
      });

      return Response.json({
        wsUrl,
        model,
        systemPrompt,
        clientId: user ? user.id : guestId,
        sessionLogId: log.id,
      });
    }

    if (action === 'end_session') {
      if (!sessionLogId) {
        return Response.json({ error: 'sessionLogId is required' }, { status: 400 });
      }
      const seconds = Number(duration_seconds) || 0;
      const minutes = seconds / 60;
      const estimated_cost_usd = Math.round(minutes * 0.023 * 10000) / 10000;

      const updateData: Record<string, unknown> = {
        ended_at: new Date().toISOString(),
        duration_seconds: seconds,
        transcript_turns: Number(transcript_turns) || 0,
        estimated_cost_usd,
      };

      if (sessionError) {
        updateData.error = String(sessionError).slice(0, 500);
      }

      const updated = await base44.asServiceRole.entities.TalkingSessionLog.update(sessionLogId, updateData);
      return Response.json({ success: true, log: updated });
    }

    if (action === 'log_failure') {
      if (sessionLogId && sessionError) {
        await base44.asServiceRole.entities.TalkingSessionLog.update(sessionLogId, {
          ended_at: new Date().toISOString(),
          error: String(sessionError).slice(0, 500),
        }).catch(() => {});
      }
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});