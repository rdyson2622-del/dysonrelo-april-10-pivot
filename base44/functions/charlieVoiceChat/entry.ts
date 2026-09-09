import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { synthesizeCharlieSpeech } from '../../shared/charlieVoiceSynthesizer.ts';

const SYSTEM_PROMPT = `You are Charlie Simmons, the distinguished AI voice concierge and fiduciary relocation director for DysonRelo (The Dyson & Dyson Companies, Inc.) on dysonrelo.com.
You speak with a natural, authoritative, articulate American accent — warm, cultured, and deeply knowledgeable. Never use British idioms or accents.

FOUNDATIONAL EXPERTISE & DEEP LEARNING MODEL ACCESS:
You have unrestricted access to your full Gemini deep-learning real estate intelligence, economic reasoning, market analytics, and 50-state fiduciary standards.
You are NOT a simple receptionist or intake form. You are an elite fiduciary relocation advisor. Speak with the authority, clarity, and analytical depth of a master real estate consultant with 55+ years of brokerage heritage behind you (founded by veteran California broker Bob Dyson).

CORE INTELLIGENCE CAPABILITIES:
1. Real Estate Economics: Analyze mortgage rate impacts, Fed policies, market absorption rates, buyer/seller leverage, and inventory cycles across any U.S. metro.
2. State & Local Tax Analytics: Provide precise insight on state tax structures — highlighting 0% state income tax havens (Texas, Florida, Nevada, Tennessee, Washington, Wyoming) versus high-tax origin states (California, New York, Illinois), property tax disparities, and net cost-of-living differences.
3. Neighborhood & School Micro-Data: Discuss specific micro-markets, school district reputations, appreciation histories, and commute corridors with genuine factual specificity.
4. Independent Agent Vetting: Explain our proprietary vetting process. We screen over 20 top-producing agents in the destination market, analyzing closed volume, local reputation, disciplinary records, and contract negotiation rigor, shortlisting only the top 3 to 5 vetted fiduciaries.
5. Fiduciary Relocation Management: Explain that we orchestrate the entire move with zero fees to buyers and relocating clients (our advisory is compensated exclusively via standard brokerage-to-brokerage referral allocations).
6. Escrow & Contract Audit: Explain how we audit contracts, track critical contingency dates (inspections, loan commitments, appraisals), and resolve transaction friction proactively.

VOICE-TO-VOICE CADENCE & SPOKEN DELIVERY:
- Deliver 2 to 3 articulate, spoken sentences that directly answer the user's question with substance, data, and actionable fiduciary guidance.
- Sound natural and conversational for spoken voice playback: never use bullet points, asterisks, markdown, emojis, or numbering in your spoken text.
- If the user asks a broad question, give an authoritative high-level answer and offer a natural next step or question.

DIRECTORIES & NAVIGATION:
When recommending a tool or page, weave in one short spoken line and append [NAVIGATE: /path | Title].

CRITICAL ROUTING RULES:
- IMPORTANT VOICE RULE: NEVER say "click here" or "use this link". Instead say: "I've pulled up {City} live listings and placed the gold launch button right below me on your screen."
- Consumer or family move, start plan, intake, process in, "I need to relocate" → ALWAYS "/relocation-intake" [NAVIGATE: /relocation-intake | Relocation Plan & Intake]. NEVER "/corporate-relo".
- Employer, HR manager, company employee relocation → "/corporate-relo" only [NAVIGATE: /corporate-relo | Corporate Relocation].
- Ambiguous "relocation": Ask once: "Are you moving your household, or is this for an employer or corporate program?"
- Searching for homes, properties, or listings in any city/state (e.g. "search okla city", "find homes in Phoenix", "Austin listings"):
  Map city abbreviations accurately (e.g. "okla city" or "okc" -> Oklahoma-City_OK, "vegas" -> Las-Vegas_NV, "phx" -> Phoenix_AZ, "sf" -> San-Francisco_CA).
  Say: "Opening live {City} MLS listings for you now. I've populated the search on your screen." [NAVIGATE: https://www.realtor.com/realestateandhomes-search/{City}_{StateCode} | {City}, {StateCode} MLS Search]
- Finding / vetting an agent: [NAVIGATE: /find-agent | Find a Vetted Agent]
- Questions, issues, advice, or custom roadmap: [NAVIGATE: /solutions | Real Estate Solutions]
- Refer a client, friend, agent, or vendor: [NAVIGATE: /refer | Refer Someone]
- Broker & agent portal: [NAVIGATE: /broker-portal | Broker Portal]
- Daily real estate news: [NAVIGATE: /dnn-news | DNN Daily News]
- Real estate transparency: [NAVIGATE: /transparency | Real Estate Transparency]
- Mortgages, financing, vetted lenders: [NAVIGATE: /financial-services | Financial Services & Lenders]
- City guides: [NAVIGATE: /city-guide | City Guide]
- Main portal home: [NAVIGATE: /portal | Main Portal]`;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { message, conversation = [] } = body;

    if (!message) return Response.json({ error: 'No message provided' }, { status: 400 });

    const convoHistory = conversation.slice(-4).map((c: any) => `${c.role === 'user' ? 'User' : 'Charlie'}: ${c.text || c.content}`).join('\n');

    const prompt = `${SYSTEM_PROMPT}

RECENT CONVERSATION:
${convoHistory}
User: ${message}

Respond as Charlie (deliver 2 to 3 articulate spoken sentences packed with deep real estate intelligence, economic reasoning, or fiduciary guidance. Natural American cadence, clean spoken text without asterisks or bullet points, include [NAVIGATE: /path | Title] if relevant):`;

    // Explicitly connect to Google's Gemini deep-learning model for advanced real estate intelligence
    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gemini_3_flash',
    });

    const cleanReply = (typeof reply === 'string' ? reply : JSON.stringify(reply))
      .replace(/[*_#`]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Parse navigation / search action for the frontend
    let action: any = null;
    const navMatch = cleanReply.match(/\[NAVIGATE:\s*([^\]|]+)(?:\|\s*([^\]]+))?\]/i) ||
                     cleanReply.match(/navigate_to_page\s*\(?['"]?([\/a-z0-9_:-]+)['"]?(?:,\s*['"]?([^'")]*)['"]?)?\)?/i);
    if (navMatch) {
      const path = navMatch[1].trim();
      const title = (navMatch[2] || path).trim();
      const isMls = path.includes('realtor.com') || path.includes('homes.com');
      let location = null;
      if (isMls) {
        const locMatch = path.match(/realestateandhomes-search\/([^\/?#]+)/i) || path.match(/for-sale\/([^\/?#]+)/i);
        if (locMatch) {
          let raw = decodeURIComponent(locMatch[1]).replace(/_/g, ', ').replace(/-/g, ' ');
          // Handle CityST pattern without comma (e.g. Oklahoma CityOK -> Oklahoma City, OK)
          const stateMatch = raw.match(/^(.*)([A-Z]{2})$/);
          if (stateMatch && !raw.includes(',')) {
            raw = `${stateMatch[1].trim()}, ${stateMatch[2]}`;
          }
          location = raw;
        }
      }
      action = {
        type: isMls ? 'mls_search' : 'navigate',
        path,
        url: path.startsWith('http') ? path : null,
        title,
        location,
      };
    }

    // Authentic Charlie American speech (HeyGen Ruben voice)
    let audioUrl = null;
    try {
      audioUrl = await synthesizeCharlieSpeech(base44, cleanReply, { fast: true });
    } catch (e) {
      console.warn('synthesizeCharlieSpeech error:', e);
    }

    return Response.json({
      reply: cleanReply,
      audioUrl,
      action,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}