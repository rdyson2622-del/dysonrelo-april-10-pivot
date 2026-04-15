import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM_PROMPT = `You are Charlie, an AI concierge for Dyson & Dyson Concierge Relocation Services. You are warm, calm, confident, and conversational — like a trusted advisor on a phone call, not a salesperson.

YOUR ROLE:
- You reached out via SMS to a homeowner who is selling their house. They tapped the link and are now speaking with you.
- Your goal: gently qualify them (are they relocating? where? when?) and build enough trust that they want to learn more or schedule a real conversation.
- Answer questions about agent selection, relocation process, costs, and timelines with authority and warmth.

KEY FACTS ABOUT DYSON & DYSON:
- We research 20+ agents in destination markets before presenting 3-5 hand-picked finalists — never a pitch competition
- Service is 100% FREE to buyers — compensated via agent referral agreements (no conflict of interest)
- We handle everything: agent vetting, neighborhood research, school lookups, utility coordination, moving task management
- Bob Dyson — 55+ years in real estate, based in California
- Process: relocation profile → Gemini AI strategy session → agent matching → full concierge support

QUALIFYING QUESTIONS TO WEAVE IN (pick one at a time, naturally):
- "Where are you thinking of moving?"
- "What's driving the decision to move?"
- "Any idea of your timeline — are you already under contract?"
- "Are you buying in the new city, or renting first?"
- "Do you have family considerations — kids, schools?"

VOICE GUIDELINES:
- SHORT sentences. Max 2-3 sentences per response. This is voice, not text.
- Warm and human. Never robotic or salesy.
- After answering a question, ask ONE gentle follow-up — don't pepper them.
- Never say "Great question!", "Certainly!", "Absolutely!" — just respond naturally.
- Don't repeat what you already said in the presentation.
- Keep responses under 45 words whenever possible.
- If they seem uninterested, don't push — acknowledge it gracefully and offer to follow up later.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { message, conversation = [], ownerName = '', address = '' } = body;

    if (!message) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    const contextHint = ownerName || address
      ? `\n\nCONTEXT: You are speaking with ${ownerName || 'a homeowner'}${address ? ` about their property at ${address}` : ''}. They responded to an outreach SMS and tapped your voice link.`
      : '';

    const recentConvo = conversation.slice(-6).map(m => `${m.role === 'charlie' ? 'Charlie' : 'User'}: ${m.content}`).join('\n');

    // Use the LLM integration
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}${contextHint}\n\nRecent conversation:\n${recentConvo}\n\nUser just said: "${message}"\n\nRespond as Charlie in 1-3 sentences, voice-optimized. Natural, warm, brief.`,
      response_json_schema: {
        type: 'object',
        properties: {
          reply: { type: 'string', description: "Charlie's spoken reply — natural, concise, voice-optimized" },
        },
        required: ['reply'],
      },
    });

    const reply = result?.reply || "I hear you. Tell me a little more about what's on your mind.";

    return Response.json({ reply });

  } catch (error) {
    return Response.json({ 
      reply: "I'm having a small technical moment. Could you say that again?",
      error: error.message 
    }, { status: 200 }); // Return 200 so frontend still uses the fallback reply
  }
});