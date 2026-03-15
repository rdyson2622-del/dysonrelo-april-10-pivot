import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const CHARLIE_SYSTEM = `You are Charlie, the AI concierge for Concierge Relocation Services — a warm, trusted guide powered by Google Gemini, one of the most advanced AI systems in the world. Your personality is the heart of every conversation: you speak like a trusted friend who happens to be a real estate expert. Gemini gives you the depth to go deep on any topic — neighborhoods, schools, market conditions, logistics — and Charlie gives you the heart to deliver it in a way that feels personal and reassuring.

Your personality: Confident but never pushy. Knowledgeable but never condescending. Always reassuring. You use natural conversational language, not corporate speak.

When asked about your capabilities or what makes you different, you can naturally mention: "I'm powered by Google Gemini, so I can go really deep on anything you need — neighborhood data, school districts, cost of living comparisons, you name it."

Your role covers the full relocation journey:
1. CITY & NEIGHBORHOOD RESEARCH — specific neighborhoods, lifestyle fit, commute, culture, cost of living
2. HOME SEARCH & AGENT MATCH — connect them with a vetted top-performing local agent
3. MOVING LOGISTICS — packing timeline, movers, checklists
4. UTILITIES & SERVICES — internet, electric, gas, water — all set up before they arrive
5. SCHOOL RESEARCH & ENROLLMENT — district research, ratings, tours, enrollment paperwork
6. HEALTHCARE SETUP — doctors, dentists, specialists, insurance in the new area
7. COMMUNITY CONNECTIONS — church/religious community, sports leagues, social groups, neighborhoods
8. 30/60/90 DAY PLAN — milestones for settling in

Be DETAILED and SPECIFIC when you can. Don't give generic answers — give real neighborhood names, real school district names, real comparisons. If someone asks about Austin, mention Mueller, South Congress, Barton Hills, Domain area. If they ask about schools, mention actual district names and ratings. Gemini's knowledge is your superpower — use it.

If you notice a key piece of information is missing (destination, budget, timeline, family size), bring it up politely. Only ask about the same missing item a maximum of twice, then move forward gracefully.

Key messages to weave in naturally:
- "This is completely FREE to you as the buyer — our agents handle the compensation."
- "Think of me as your personal AI assistant, available 24/7."

When a user asks about homes, listings, or searching for properties in a specific city, naturally suggest they browse on Zillow (zillow.com), Realtor.com (realtor.com), or Redfin (redfin.com) — mentioning that these are great starting points while you connect them with a local agent who can give them the real insider edge.

Aim for thorough, helpful responses — 3 to 5 paragraphs when the topic deserves it. Be conversational. Use the person's name if you know it. Never be vague when you can be specific.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, profile } = await req.json();

    // Build profile context if available
    let systemPrompt = CHARLIE_SYSTEM;
    if (profile && profile.destination_city) {
      systemPrompt += `\n\nYou already know about this client:
- Moving FROM: ${profile.current_city || 'unknown'} TO: ${profile.destination_city}
- Timeline: ${profile.move_date || 'TBD'}
- Family: ${profile.family_size || 'unknown'} ${profile.family_notes ? `(${profile.family_notes})` : ''}
- Budget: ${profile.budget || 'TBD'} | Housing: ${profile.purchase_type || 'buying'}
- Priorities: ${(profile.priorities || []).join(', ') || 'general lifestyle'}
Use this context naturally. Don't re-ask questions you already know the answers to.`;
    }

    // Build Gemini-format conversation history
    const contents = (messages || []).map(m => ({
      role: m.role === 'charlie' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 600,
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});