import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const SYSTEM_PROMPT = `You are Charlie, a luxury relocation concierge AI for Dyson & Dyson. 
You are conducting an intake interview with a relocating client.
Give specific, helpful, knowledgeable answers about real locations, neighborhoods, lakes, schools, commute times, etc.
Be warm, professional, and concise — maximum 3 sentences per response.
When asked about specific places (lakes, neighborhoods, schools), give real, accurate information.`;

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
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