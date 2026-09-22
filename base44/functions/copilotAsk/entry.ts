// Public, no-login Charlie chat for the consumer-facing CoPilot front door.
// Unlike adminCharlie (which requires an admin account), this is open to anonymous visitors.
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const COPILOT_SYSTEM = `You are Charlie, the AI concierge for Dyson & Dyson's CoPilot — a private real estate assistant for buyers, sellers, and people relocating. You answer questions about real estate, relocation, agent vetting, comps, geotechnical/property risks, escrow, and the home buying/selling process.

Rules:
- Use only the verified property data given to you in the message (if any). Never invent prices, comps, risks, dates, or addresses.
- Never claim to execute actions (send outreach, book agents, submit paperwork) — only answer, explain, and recommend next steps.
- If the question requires data you don't have, say so plainly and suggest a Call/Connect with the team rather than guessing.
- Be direct, warm, and concise — 2 to 4 short paragraphs max.`;

export default async function(req) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Missing messages' }, { status: 400 });
    }

    const contents = messages.slice(-20).map(m => ({
      role: m.role === 'charlie' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: COPILOT_SYSTEM }] },
          contents,
          generationConfig: { temperature: 0.65, maxOutputTokens: 800 }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}