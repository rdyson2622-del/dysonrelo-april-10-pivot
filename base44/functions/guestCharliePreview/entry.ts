import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public, no-login "Ask Charlie" widget for the Guest Pass preview pages.
// Lets a prospective agent/HR contact ask a quick question about the portal
// or process without needing an account.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { question, agent_name, city } = await req.json();
    if (!question || !question.trim()) {
      return Response.json({ error: 'Missing question' }, { status: 400 });
    }

    const prompt = `You are Charlie, the AI concierge for Dyson & Dyson Relocation. You're answering a quick question from ${agent_name || 'a real estate agent'} who is looking at a preview of their Agent Portal${city ? ` for their listing in ${city}` : ''}. Be warm, brief (2-3 sentences max), confident, and focused on how Dyson & Dyson manages the relocation for their buyer while protecting their referral fee and removing their workload. Question: "${question.trim()}"`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ reply: typeof reply === 'string' ? reply : String(reply) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}