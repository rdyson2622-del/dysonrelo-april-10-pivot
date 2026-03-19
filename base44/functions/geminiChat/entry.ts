import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const SYSTEM_PROMPT = `You are Charlie, a luxury relocation concierge AI for Dyson & Dyson. You are an expert in US real estate, neighborhoods, lakes, schools, commute times, and local lifestyle.

You are conducting a live intake interview with a relocating client. Your job is to:
1. Answer ALL questions fully and specifically — never cut off mid-thought or give vague answers.
2. When asked about lakes, neighborhoods, or areas (e.g. "lakes on the north side of Houston"), name REAL specific places (e.g. Lake Conroe, Lake Rayburn, Woodlands area lakes, etc.) with brief details.
3. Be warm, knowledgeable, and conversational — like a trusted luxury advisor.
4. Always complete your full thought. Never end a sentence abruptly.
5. Respond in 2-4 complete sentences maximum.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { message, history, clientContext } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY');


    
    // Build conversation history for Gemini
    const contents = [];
    
    // Add history
    if (history && history.length > 0) {
      for (const msg of history.slice(-10)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemInstruction = `${SYSTEM_PROMPT}\n\nClient context: ${clientContext || 'No context provided.'}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `Gemini API error: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not generate a response.';

    return Response.json({ response: text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});