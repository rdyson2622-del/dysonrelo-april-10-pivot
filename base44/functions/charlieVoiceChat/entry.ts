import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const SYSTEM_PROMPT = `You are Charlie, an AI concierge for Dyson & Dyson Concierge Relocation Services. You are warm, calm, confident, and conversational — like a trusted advisor on a phone call, not a salesperson.

YOUR ROLE:
- You reached out via SMS to a homeowner who is selling their house. They tapped the link and are now speaking with you.
- Your goal: gently qualify them (are they relocating? where? when?) and build enough trust that they want to learn more or schedule a real conversation.

KEY FACTS ABOUT DYSON & DYSON:
- We research 20+ agents in destination markets before presenting 3-5 hand-picked finalists — never a pitch competition
- Service is 100% FREE to buyers — compensated via agent referral agreements (no conflict of interest)
- We handle everything: agent vetting, neighborhood research, school lookups, utility coordination, moving task management
- Bob Dyson — 55+ years in real estate, based in California
- Process: relocation profile → AI strategy session → agent matching → full concierge support

QUALIFYING QUESTIONS TO WEAVE IN (one at a time, naturally):
- "Where are you thinking of moving?"
- "What's driving the decision to move?"
- "Any idea of your timeline — are you already under contract?"
- "Are you buying in the new city, or renting first?"
- "Do you have family considerations — kids, schools?"

VOICE GUIDELINES:
- SHORT sentences. Max 2-3 sentences per response. This is voice, not text.
- Warm and human. Never robotic or salesy.
- After answering a question, ask ONE gentle follow-up.
- Never say "Great question!", "Certainly!", "Absolutely!" — just respond naturally.
- Keep responses under 45 words whenever possible.
- If they seem uninterested, acknowledge it gracefully and offer to follow up later.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversation = [], ownerName = '', address = '' } = body;

    if (!message) return Response.json({ error: 'No message provided' }, { status: 400 });

    const contextHint = ownerName || address
      ? `\n\nCONTEXT: Speaking with ${ownerName || 'a homeowner'}${address ? ` about their property at ${address}` : ''}. They responded to an outreach SMS.`
      : '';

    // Build Gemini conversation history
    const contents = [];

    // Add conversation history
    for (const msg of conversation.slice(-6)) {
      contents.push({
        role: msg.role === 'charlie' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT + contextHint }] },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini chat error:', JSON.stringify(data));
      return Response.json({ reply: "I had a brief hiccup — could you say that again?" }, { status: 200 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || "Tell me more — I'm listening.";

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ reply: "I'm having a small technical moment. Could you repeat that?", error: error.message }, { status: 200 });
  }
});