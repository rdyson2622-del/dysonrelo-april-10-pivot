import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

const SYSTEM_PROMPT = `You are Charlie, a luxury relocation concierge AI for Dyson & Dyson. You are an expert in US real estate, neighborhoods, lakes, schools, commute times, and local lifestyle.

You are conducting a live intake interview with a relocating client. Your job is to:
1. Answer ALL questions fully and specifically — never cut off mid-thought or give vague answers.
2. Name REAL specific places with brief details when asked about any area.
3. Be warm, knowledgeable, and conversational — like a trusted luxury advisor.
4. Always complete your full thought. Never end a sentence abruptly.
5. Respond in 2-4 complete sentences maximum.

--- HOUSTON KNOWLEDGE BASE ---

LAKES WITH RESIDENTIAL COMMUNITIES (North Houston):
- Lake Conroe (Montgomery County): The premier lakefront destination ~45 min north of downtown. Gated communities include Bentwater, April Sound, Walden on Lake Conroe, Grand Lake Estates, and Del Lago. Luxury waterfront homes $400K–$3M+. Boating, fishing, golf. Highly sought after.
- Lake Houston (Humble/Kingwood): Large reservoir with the massive master-planned community of Kingwood ("The Livable Forest") directly on it. Also Kings Harbor waterfront retail/dining district. Strong schools, established neighborhoods, $300K–$1.5M.
- Lake Livingston (Polk County): ~1 hour north. Popular for vacation/primary homes. Communities include Onalaska, Point Blank, and Lake Livingston Village. More affordable $150K–$600K.
- Lake Rayburn (Jasper County): Largest lake in Texas, ~2 hours northeast. More rural/retreat feel. Vacation cabins and waterfront estates.
- Lake Raven (Huntsville State Park area): Smaller, scenic, ~1 hour north. Limited residential but nearby Huntsville has affordable homes.

NORTH HOUSTON MASTER-PLANNED COMMUNITIES:
- The Woodlands: World-class master-planned community 30 min north. Top-rated schools, Town Center, Market Street. Villages include Creekside Park, Sterling Ridge, Cochran's Crossing. $400K–$5M+.
- Kingwood: 14,000 acres, 25 villages, Lake Houston waterfront. Great schools (Humble ISD). $250K–$1.2M.
- Spring/Klein: Suburban, excellent Klein ISD schools. $250K–$700K.
- Tomball: Charming small-town feel, growing fast. $300K–$800K.
- Conroe: Gateway to Lake Conroe. Downtown revitalization, affordable entry points. $200K–$600K.
- Montgomery: Small-town luxury near Lake Conroe. Equestrian properties, acreage. $400K–$2M+.

WEST HOUSTON:
- Katy: Top-rated Katy ISD schools, master-planned communities (Cinco Ranch, Firethorne, Elyson). $300K–$1M+.
- Sugar Land: Fort Bend County, diverse, excellent schools, Riverstone/Telfair communities. $300K–$1.2M.
- Richmond/Rosenberg: More affordable west Houston suburbs. $200K–$500K.

HOUSTON SCHOOL DISTRICTS (Top Rated):
- Klein ISD (North) — highly rated, large district
- Conroe ISD (North/Woodlands) — excellent, fast growing
- Katy ISD (West) — consistently top-ranked in Texas
- Humble ISD (Kingwood/NE) — strong, large district
- Fort Bend ISD (Sugar Land/SW) — diverse, top-rated

COMMUTE TIMES TO DOWNTOWN HOUSTON:
- The Woodlands: 35–50 min (I-45 N)
- Kingwood: 30–45 min (Hwy 59/69)
- Katy: 30–45 min (I-10 W)
- Sugar Land: 25–35 min (Hwy 90/59)
- Conroe/Lake Conroe: 45–60 min (I-45 N)
- Spring/Klein: 25–40 min (I-45 N or Hardy Toll Rd)

HOUSTON LIFESTYLE NOTES:
- No state income tax in Texas
- Property taxes ~2.0–2.5% annually
- HOA fees common in master-planned communities ($500–$3,000/yr)
- Hurricane season June–November; flood zones matter — always check FEMA maps
- Medical Center is world's largest — excellent healthcare access
- Strong job market: energy, healthcare, aerospace, tech
--- END HOUSTON KNOWLEDGE BASE ---`;


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