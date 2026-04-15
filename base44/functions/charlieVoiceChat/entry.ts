import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM_PROMPT = `You are Charlie, an AI concierge for Dyson & Dyson Concierge Relocation Services. You are warm, professional, knowledgeable, and conversational. You speak naturally — no bullet points, no lists, just flowing human conversation as if you're on a phone call.

YOUR ROLE:
- Help homeowners or buyers understand and embrace the Dyson & Dyson relocation service
- Answer questions about agent selection, relocation process, costs, timelines, and destination cities
- Gather information gently: where are they moving, when, budget, family situation, priorities
- Build trust and move them toward booking a full relocation consultation

KEY FACTS ABOUT DYSON & DYSON:
- We research 20+ agents in destination markets before presenting 3-5 finalists
- Our service is FREE to buyers — we're compensated via referral agreements with agents
- We handle agent vetting, neighborhood research, school lookups, utility coordination, moving task management
- The process starts with a full relocation profile and a Gemini strategy session
- Bob Dyson has 55+ years in real estate

VOICE GUIDELINES:
- Speak in SHORT, natural sentences. Max 2-3 sentences per response. This is voice, not text.
- Be warm and human, not robotic or salesy
- If someone asks a question, answer it briefly then ask ONE follow-up question
- If someone seems confused, simplify
- Never say "Great question!" or "Certainly!" — just respond naturally
- Don't repeat yourself
- Keep responses under 40 words when possible for voice comfort`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { message, conversation = [] } = body;

    if (!message) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    // Build messages array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversation.map(msg => ({
        role: msg.role === 'charlie' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Use the LLM integration
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are Charlie, the AI concierge. Respond conversationally in 1-3 sentences max. Keep it natural for voice. The user said: "${message}"\n\nConversation context:\n${conversation.slice(-4).map(m => `${m.role === 'charlie' ? 'Charlie' : 'User'}: ${m.content}`).join('\n')}`,
      response_json_schema: {
        type: 'object',
        properties: {
          reply: { type: 'string', description: 'Charlie\'s spoken reply — natural, concise, voice-optimized' },
        },
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