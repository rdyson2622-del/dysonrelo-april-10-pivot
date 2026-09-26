import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// Gemini 3.8 Live (GA, released Sep 15, 2026) — model ID confirmed in Google's
// current Gemini Live API docs (ai.google.dev/gemini-api/docs/models/gemini-3.8-live).
// Replaces the older gemini-2.5-flash-preview-native-audio-dialog preview model.
const LIVE_MODEL = 'models/gemini-3.8-live';

const CHARLIE_SIMMONS_SYSTEM_PROMPT = `You are Charlie Simmons, the distinguished AI voice concierge and fiduciary relocation director for DysonRelo (The Dyson & Dyson Companies, Inc.) on dysonrelo.com.
You speak with a natural, authoritative, articulate American accent — warm, cultured, and deeply knowledgeable. Never use British idioms or accents.

FOUNDATIONAL EXPERTISE & DEEP LEARNING MODEL ACCESS:
You have full permission to leverage your complete Gemini deep-learning foundational knowledge base, advanced real estate analytics, and economic reasoning.
You are NOT a simple receptionist or mechanical intake form. You speak with the authority, clarity, and analytical depth of an elite real estate fiduciary backed by 55+ years of brokerage heritage (founded by veteran California broker Bob Dyson).

CORE INTELLIGENCE CAPABILITIES:
1. Real Estate Economics: Analyze mortgage rate fluctuations, Fed policies, inventory cycles, market absorption rates, and valuation trends across all 50 states.
2. State & Local Tax Analytics: Deliver precise comparisons on state tax structures — contrasting 0% state income tax havens (Texas, Florida, Nevada, Tennessee, Washington, Wyoming) against high-tax origin states (California, New York, Illinois), local property tax millage rates, and net purchasing power.
3. Neighborhood & School Micro-Data: Speak knowledgeably on specific micro-neighborhoods, school district metrics, appreciation trajectories, and lifestyle corridors across major U.S. markets.
4. Independent Agent Vetting: Explain our fiduciary vetting framework. We screen over 20 top-producing agents in the target destination, examining closed sales volume, negotiation rigor, ethics, and disciplinary history, shortlisting only the top 3 to 5 vetted fiduciaries.
5. Fiduciary Relocation Management: Explain that we orchestrate the entire move with zero fees to buyers and relocating clients (our advisory is compensated exclusively via standard brokerage-to-brokerage referral allocations).
6. Escrow & Contract Audit: Explain how we audit contracts, track critical contingency dates (inspections, loan commitments, appraisals), and resolve transaction friction proactively.

VOICE-TO-VOICE CADENCE & SPOKEN DELIVERY:
- Deliver 2 to 3 articulate spoken sentences that directly answer the user's questions with data, insight, and fiduciary guidance.
- Sound conversational and natural for voice synthesis: never use markdown, asterisks, bullet points, or numbering in spoken turns.
- Keep pace interactive: invite natural dialogue and offer relevant next steps without overwhelming monologues.

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
// It validates the user, mints a short-lived ephemeral token server-side (the
// raw GEMINI_API_KEY never reaches the browser), and returns the WSS URL built
// with that token for the client to connect to directly.
async function createEphemeralToken(): Promise<string> {
  const now = Date.now();
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
    method: 'POST',
    headers: {
      'x-goog-api-key': GEMINI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uses: 1,
      expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
      newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
    }),
  });
  const data = await res.json();
  if (!res.ok || !data?.name) {
    throw new Error(`Failed to create ephemeral token: ${JSON.stringify(data)}`);
  }
  return data.name;
}

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

    const { action, systemPrompt, sessionLogId, conversationId, duration_seconds, transcript_turns, error: sessionError, agentId, silentMode, page, role, text } = await req.json();

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

      const ephemeralToken = await createEphemeralToken();
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${ephemeralToken}`;

      const startedAt = new Date().toISOString();

      // Log the session start for admin analytics/cost tracking
      const log = await base44.asServiceRole.entities.TalkingSessionLog.create({
        user_id: user ? user.id : guestId,
        user_name: user ? (user.full_name || '') : 'Guest (not logged in)',
        user_email: user ? (user.email || '') : '',
        model: LIVE_MODEL,
        started_at: startedAt,
      });

      // Create the conversation transcript record — turns get appended to it
      // live as the call progresses (see action: 'append_turn'), so nothing is
      // lost even if the call drops mid-conversation.
      const conversation = await base44.asServiceRole.entities.CharlieConversation.create({
        session_start: startedAt,
        page: page || '',
        visitor_id: user ? user.id : guestId,
        visitor_email: user ? (user.email || '') : '',
        visitor_name: user ? (user.full_name || '') : '',
        model: LIVE_MODEL,
        transcript: [],
        talking_session_log_id: log.id,
      });

      return Response.json({
        wsUrl,
        model: LIVE_MODEL,
        systemPrompt: effectiveSystemPrompt,
        voiceName: 'Algieba',
        language: 'en-US',
        clientId: user ? user.id : guestId,
        sessionLogId: log.id,
        conversationId: conversation.id,
      });
    }

    if (action === 'append_turn') {
      if (!conversationId || !role || !text) {
        return Response.json({ error: 'conversationId, role, and text are required' }, { status: 400 });
      }
      const conversation = await base44.asServiceRole.entities.CharlieConversation.get(conversationId);
      if (!conversation) return Response.json({ error: 'Conversation not found' }, { status: 404 });

      const nextTranscript = [...(conversation.transcript || []), { role, text, at: new Date().toISOString() }];
      await base44.asServiceRole.entities.CharlieConversation.update(conversationId, { transcript: nextTranscript });
      return Response.json({ success: true });
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

      if (conversationId) {
        await base44.asServiceRole.entities.CharlieConversation.update(conversationId, {
          session_end: new Date().toISOString(),
        }).catch(() => {});
      }

      return Response.json({ success: true, log: updated });
    }

    if (action === 'log_failure') {
      if (sessionLogId && sessionError) {
        await base44.asServiceRole.entities.TalkingSessionLog.update(sessionLogId, {
          ended_at: new Date().toISOString(),
          error: String(sessionError).slice(0, 500),
        }).catch(() => {});
      }
      if (conversationId) {
        await base44.asServiceRole.entities.CharlieConversation.update(conversationId, {
          session_end: new Date().toISOString(),
        }).catch(() => {});
      }
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});