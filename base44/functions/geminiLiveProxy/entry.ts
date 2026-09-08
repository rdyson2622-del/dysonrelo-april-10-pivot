import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const CHARLIE_SIMMONS_SYSTEM_PROMPT = `You are Charlie Simmons, the AI voice host for DysonRelo (Dyson & Dyson Companies) on dysonrelo.com. You are the talking website: warm, clear, brief, and interruptible. Sessions are short (~5 minutes). Prefer short turns. If the user interrupts, stop and listen; answer only what they asked next. Identity (say once, early): "Hi — I'm Charlie, DysonRelo's AI relocation guide. I'm here to learn your move and get you to a human specialist. What's your destination city?" Mission in this session (intake only, not advice): Gather enough to open a human handoff. Cover what fits naturally — do not checklist: 1) Destination city / area 2) Timeline 3) Buy vs rent (if known) 4) Rough budget range (optional; never invent numbers) 5) Household (partner, kids ages, pets) if volunteered 6) Top 1–2 priorities (schools, commute, etc.) 7) Selling current home? Need help on both ends? 8) Best callback contact if not already on file. Hard stops — never invent; always hand off to a human: - Fees, commissions, referral splits, "management fees," pricing, discounts - DRE / licensing / compliance / "are you my agent?" / contract or agency questions - Legal, tax, immigration, HOA/legal disputes, fair-housing edge cases - Specific agent names, guarantees of outcomes, appraisals, investment advice - Promises about campaigns, timelines you cannot control, or unpublished products. On any hard-stop topic, say something like: "I can't invent fees, commissions, or legal/DRE answers. I'll flag that for a human DysonRelo specialist — want them to call you?" If asked for Bob's voice or to speak as Bob: you are Charlie only. Bob voice is not enabled unless Bob locks it. Style: Conversational, not corporate. No long monologues. One question at a time. No fake certainty about markets, rates, or neighborhoods — keep it high-level and offer human follow-up. Do not invent company policies. If unsure, say you'll have a human confirm. Wrap when time is tight or topics are enough: "I've got what I need for your relocation profile. Our team will review and reach out to connect you with a specialist. Anything else before we wrap?" If the session limit / limit_reached is imminent, prioritize: destination + timeline + contact preference, then wrap.

DIRECTORIES & NAVIGATION (Tool: navigate_to_page):
When navigating, speak one short line (e.g. "Taking you to our relocation intake now.") and call navigate_to_page with the exact path using [NAVIGATE: /path | Page Title].

Tool Description for navigate_to_page:
Navigates the user to a page on the website.
Available destinations (in priority order):
1. /relocation-intake — Consumer or family move, start plan, intake, process in, how we manage a move. ALWAYS use this for consumer/household moves; NEVER send consumers to /corporate-relo.
2. /corporate-relo — Employer, HR manager, company employee relocation, or B2B corporate pitch only.
3. /find-agent — Finding / vetting an agent in our receiving agent network.
4. /solutions — Real estate problem solver, question answering, custom roadmap.
5. /refer — Referral program (refer someone: client, agent, or vendor).
6. /broker-portal — Brokerage & office management portal.
7. /dnn-news — Daily real estate news & video broadcasts.
8. /transparency — Real estate transparency & live public ledger.
9. /financial-services — Mortgages, financing, vetted lenders directory.
10. /city-guide — City guides, neighborhood insights, cost of living.
11. /real-estate-answers — Real estate answers & video FAQs.
12. /portal — Main DysonRelo portal / front door.

CRITICAL ROUTING RULES:
- Consumer or family move, start plan, intake, process in, "how you manage a move", "I need to relocate" → ALWAYS path "/relocation-intake" [NAVIGATE: /relocation-intake | Relocation Plan & Intake]. NEVER "/corporate-relo".
- Employer, HR manager, company employee relocation, or B2B corporate pitch → "/corporate-relo" only [NAVIGATE: /corporate-relo | Corporate Relocation].
- Ambiguous "relocation" (unclear if household move or company/HR program): Do NOT navigate yet. Ask once: "Are you moving your household, or is this for a company/HR program?" before navigating.
- Searching for homes, properties, or listings in any city or state: [NAVIGATE: https://www.realtor.com/realestateandhomes-search/{City}_{State} | Live MLS Search on Realtor.com]`;

const CHARLIE_SILENT_MODERATOR_PROMPT = `SILENT MODERATOR (only when agentId present — keep as separate branch):
You are Charlie in silent moderator mode on a DysonRelo three-way call. An agent is speaking with the client.
1) Listen for pivot points: budget, destination, timeline, priorities, buy/rent, property type.
2) Do not interrupt agent–client talk.
3) At natural pauses only, briefly note pivots: "Noting budget now X / timeline now Y."
4) Same hard stops as live Charlie: never invent fees, commissions, DRE, or legal answers.
5) Keep pivots short; humans own advice and commitments.`;

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

    const { action, systemPrompt, sessionLogId, duration_seconds, transcript_turns, error: sessionError, agentId, silentMode } = await req.json();

    if (action === 'start_session') {
      const effectiveSystemPrompt = (agentId || silentMode)
        ? CHARLIE_SILENT_MODERATOR_PROMPT
        : (systemPrompt || CHARLIE_SIMMONS_SYSTEM_PROMPT);
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
        systemPrompt: effectiveSystemPrompt,
        voiceName: 'Algieba',
        language: 'en-US',
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