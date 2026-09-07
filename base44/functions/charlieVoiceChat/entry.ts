import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SYSTEM_PROMPT = `You are Charlie, the distinguished, authoritative male AI voice concierge for Dyson & Dyson Companies real estate relocation.
You are warm, confident, professional, and conversational — like a trusted senior advisor on a call, not an aggressive salesperson.

KEY FACTS:
- We research 20+ top agents in destination markets before presenting 3-5 hand-picked finalists — never a pitch competition.
- Free to buyers — compensated via agent referral agreements.
- We handle everything: agent vetting, neighborhood research, school lookups, utility coordination, moving task management.
- Bob Dyson — 55+ years in California real estate.
- Process: relocation profile → strategy session → agent matching → concierge execution.

VOICE GUIDELINES:
- SHORT spoken sentences. Strictly 1-2 sentences max (under 30 words). Never ramble.
- Grounded American male accent (warm, distinguished senior advisor). Never use British accents or phrases.
- When the visitor asks about a subject or need, answer in 1 sentence and direct them to the appropriate page:
  - Find an agent: [NAVIGATE: /find-agent | Find a Vetted Agent]
  - Relocation intake / moving plan: [NAVIGATE: /relocation-intake | Relocation Plan]
  - Real estate solutions & roadmaps: [NAVIGATE: /solutions | Real Estate Solutions]
  - Corporate / HR relo: [NAVIGATE: /corporate-relo | Corporate Relocation]
  - News & market reports: [NAVIGATE: /dnn-news | DNN Daily News]
  - Transparency & fees: [NAVIGATE: /transparency | Real Estate Transparency]
  - Referrals: [NAVIGATE: /refer | Refer Someone]
  - Lenders & mortgages: [NAVIGATE: /financial-services | Financial Services & Lenders]
  - City guides: [NAVIGATE: /city-guide | City Guide]
- Answer directly without pleasantries.`;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { message, conversation = [] } = body;

    if (!message) return Response.json({ error: 'No message provided' }, { status: 400 });

    // Search internal knowledge base for company-specific context
    let kbContext = '';
    try {
      const kbEntries = await base44.asServiceRole.entities.CharlieKnowledgeBase.filter({ is_active: true }, '-times_used', 5);
      if (kbEntries && kbEntries.length > 0) {
        kbContext = `\n\nVERIFIED COMPANY KNOWLEDGE:\n` + kbEntries.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');
      }
    } catch (_) {}

    const convoHistory = conversation.slice(-6).map((c: any) => `${c.role === 'user' ? 'User' : 'Charlie'}: ${c.text || c.content}`).join('\n');

    const prompt = `${SYSTEM_PROMPT}${kbContext}

RECENT CONVERSATION:
${convoHistory}
User: ${message}

Respond as Charlie (max 2 short sentences, natural spoken reply):`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
    });

    const cleanReply = (typeof reply === 'string' ? reply : JSON.stringify(reply))
      .replace(/[*_#`]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Generate speech using Charlie's male voice ('storm')
    let audioUrl = null;
    try {
      const speechRes = await base44.asServiceRole.integrations.Core.GenerateSpeech({
        text: cleanReply,
        voice: 'storm',
      });
      audioUrl = speechRes?.url || null;
    } catch (e) {
      console.warn('GenerateSpeech error:', e);
    }

    return Response.json({
      reply: cleanReply,
      audioUrl,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}