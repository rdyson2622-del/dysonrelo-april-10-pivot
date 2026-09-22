import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { waitUntil } from 'base44:runtime';

// Public, no-login Charlie chat for the consumer-facing CoPilot front door.
// Unlike adminCharlie (which requires an admin account), this is open to anonymous visitors.
// Uses the platform's built-in LLM integration rather than a direct Gemini API key.
const COPILOT_SYSTEM = `You are Charlie, the AI concierge for Dyson & Dyson's CoPilot — a private real estate assistant for buyers, sellers, and people relocating. You answer questions about real estate, relocation, agent vetting, comps, geotechnical/property risks, escrow, and the home buying/selling process.

Rules:
- Use only the verified property data given to you in the conversation (if any). Never invent prices, comps, risks, dates, or addresses.
- Never claim to execute actions (send outreach, book agents, submit paperwork) — only answer, explain, and recommend next steps.
- If the question requires data you don't have, say so plainly and suggest a Call/Connect with the team rather than guessing.
- Be direct, warm, and concise — 2 to 4 short paragraphs max.`;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { messages, visitor_id, question } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Missing messages' }, { status: 400 });
    }

    const transcript = messages.slice(-20)
      .map(m => `${m.role === 'charlie' ? 'Charlie' : 'User'}: ${m.content}`)
      .join('\n');

    const prompt = `${COPILOT_SYSTEM}\n\nConversation so far:\n${transcript}\n\nRespond as Charlie to the most recent user message.`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });
    const replyText = typeof reply === 'string' ? reply : String(reply);

    // Persist this turn so it shows up in Admin > Client Conversations and the
    // consumer's own My Library. Anonymous visitors have no authenticated user,
    // so this write goes through the service role and is keyed by a stable
    // per-browser visitor_id instead of a logged-in user id.
    if (visitor_id) {
      const questionText = String(question || messages[messages.length - 1]?.content || '').slice(0, 5000);
      waitUntil(Promise.all([
        base44.asServiceRole.entities.ChatMessage.create({ client_id: visitor_id, role: 'user', content: questionText }),
        base44.asServiceRole.entities.ChatMessage.create({ client_id: visitor_id, role: 'charlie', content: replyText })
      ]).catch(() => {}));
    }

    return Response.json({ reply: replyText });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}