import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transcript, clientInfo } = await req.json();

    // Build transcript text
    const transcriptText = (transcript || [])
      .filter(t => t.role !== 'system')
      .map(t => `${t.role === 'user' ? 'CLIENT' : 'GEMINI'}: ${t.text}`)
      .join('\n');

    // Ask Gemini to extract structured profile data
    const extractPrompt = `You are a data extraction specialist. Analyze this relocation interview transcript and extract all relevant information.

TRANSCRIPT:
${transcriptText}

Extract the following into a JSON object. Use null for anything not mentioned:
{
  "destination_city": "city, state",
  "current_city": "city, state",
  "move_timeline": "timeline mentioned",
  "family_size": number or null,
  "family_details": "ages of kids, pets, etc.",
  "budget_range": "price range mentioned",
  "purchase_type": "buying or renting",
  "priorities": ["array", "of", "priorities", "mentioned"],
  "selling_current_home": true/false/null,
  "employment": "remote/transferring/job searching/employed locally",
  "personality_notes": "lifestyle preferences, city vs suburbs, etc.",
  "action_items": ["list", "of", "specific", "tasks", "mentioned"],
  "special_needs": "any medical, accessibility, elderly parents, etc.",
  "agent_personality_match": "personality traits to look for in agent match",
  "summary": "2-3 sentence summary of the client and their needs"
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: extractPrompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          }
        })
      }
    );

    const geminiData = await geminiRes.json();
    const rawJson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let profile = {};
    try { profile = JSON.parse(rawJson); } catch (e) { profile = {}; }

    // Save full transcript as ChatMessages
    const fullTranscriptText = `[GEMINI LIVE SESSION TRANSCRIPT]\nDuration: ${transcript.length} exchanges\n\n${transcriptText}`;

    await base44.asServiceRole.entities.ChatMessage.create({
      client_id: user.id,
      role: 'charlie',
      content: fullTranscriptText,
      message_type: 'text',
      flag_status: 'none',
    });

    // Update or create RelocationClient profile
    const existingClients = await base44.asServiceRole.entities.RelocationClient.filter({
      email: clientInfo?.email || user.email
    });

    const clientData = {
      full_name: clientInfo?.name || user.full_name,
      email: clientInfo?.email || user.email,
      phone: clientInfo?.phone || '',
      destination_city: profile.destination_city || '',
      current_city: profile.current_city || '',
      budget: mapBudgetToEnum(profile.budget_range),
      priorities: mapPriorities(profile.priorities || []),
      notes: [
        profile.summary,
        profile.family_details ? `Family: ${profile.family_details}` : null,
        profile.employment ? `Employment: ${profile.employment}` : null,
        profile.personality_notes ? `Personality: ${profile.personality_notes}` : null,
        profile.special_needs ? `Special needs: ${profile.special_needs}` : null,
        profile.agent_personality_match ? `Agent match notes: ${profile.agent_personality_match}` : null,
      ].filter(Boolean).join('\n\n'),
      status: 'in_consultation',
      move_date: profile.move_timeline || '',
      family_size: profile.family_size || null,
    };

    let clientId;
    if (existingClients && existingClients.length > 0) {
      await base44.asServiceRole.entities.RelocationClient.update(existingClients[0].id, clientData);
      clientId = existingClients[0].id;
    } else {
      const newClient = await base44.asServiceRole.entities.RelocationClient.create(clientData);
      clientId = newClient.id;
    }

    // Create RelocationTasks from action items
    const tasks = [];
    for (const item of (profile.action_items || [])) {
      const task = await base44.asServiceRole.entities.RelocationTask.create({
        client_id: clientId,
        title: item,
        category: categorizeTask(item),
        status: 'pending',
        priority: 'medium',
      });
      tasks.push(task);
    }

    // Alert admin — create a flagged message for staff review
    await base44.asServiceRole.entities.ChatMessage.create({
      client_id: user.id,
      role: 'charlie',
      content: `[NEW CLIENT READY FOR AGENT MATCHING]\n\nClient: ${clientData.full_name}\nEmail: ${clientData.email}\nDestination: ${profile.destination_city}\nBudget: ${profile.budget_range}\nTimeline: ${profile.move_timeline}\n\nSummary: ${profile.summary}\n\nAction items created: ${tasks.length}`,
      message_type: 'task_update',
      flag_status: 'reviewed',
    });

    // 🚨 CRITICAL: Email admin immediately — Gemini session completed
    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const emailPromises = adminUsers.map(admin =>
      base44.asServiceRole.integrations.Core.SendEmail({
        to: admin.email,
        from_name: 'Dyson & Dyson System',
        subject: `🚨 NEW GEMINI SESSION COMPLETE — ${clientData.full_name} → ${profile.destination_city}`,
        body: `NEW CLIENT GEMINI SESSION COMPLETED
==========================================

CLIENT: ${clientData.full_name}
EMAIL: ${clientData.email}
PHONE: ${clientData.phone || 'Not provided'}

DESTINATION: ${profile.destination_city}
BUDGET: ${profile.budget_range || 'Not specified'}
TIMELINE: ${profile.move_timeline || 'Not specified'}
PURCHASE TYPE: ${profile.purchase_type || 'Not specified'}
FAMILY: ${profile.family_details || 'Not specified'}
EMPLOYMENT: ${profile.employment || 'Not specified'}

SUMMARY:
${profile.summary || 'No summary generated'}

PRIORITIES: ${(profile.priorities || []).join(', ') || 'None listed'}

AGENT PERSONALITY MATCH:
${profile.agent_personality_match || 'Not specified'}

SPECIAL NEEDS:
${profile.special_needs || 'None'}

ACTION ITEMS CREATED: ${tasks.length}
${(profile.action_items || []).map(a => '  • ' + a).join('\n')}

==========================================
ACTION REQUIRED: Log into admin and match this client with an agent.
dysonrelo.com/admin/clients
==========================================`
      })
    );
    await Promise.all(emailPromises);

    // Track analytics event
    await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Log this event silently: Gemini session completed for ${clientData.full_name} going to ${profile.destination_city}. Return just: {"logged": true}`,
      response_json_schema: { type: 'object', properties: { logged: { type: 'boolean' } } }
    }).catch(() => {}); // non-blocking

    return Response.json({ profile, tasks, clientId });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function mapBudgetToEnum(budgetStr) {
  if (!budgetStr) return null;
  const b = budgetStr.toLowerCase();
  if (b.includes('200') && b.includes('under')) return 'under_200k';
  if (b.includes('200') || b.includes('300')) return '200k_400k';
  if (b.includes('400') || b.includes('500')) return '400k_600k';
  if (b.includes('600') || b.includes('700')) return '600k_800k';
  if (b.includes('800') || b.includes('900')) return '800k_1m';
  if (b.includes('million') || b.includes('1m') || b.includes('1.')) return 'over_1m';
  return null;
}

function mapPriorities(arr) {
  const map = {
    'school': 'schools', 'education': 'schools',
    'commute': 'commute', 'transit': 'commute',
    'safe': 'safety', 'crime': 'safety',
    'church': 'religious_community', 'religion': 'religious_community', 'faith': 'religious_community',
    'hospital': 'healthcare', 'doctor': 'healthcare', 'medical': 'healthcare',
    'park': 'nature', 'outdoor': 'nature', 'hiking': 'nature',
    'nightlife': 'nightlife', 'restaurant': 'nightlife', 'dining': 'nightlife',
    'walk': 'walkability',
    'art': 'arts_culture', 'museum': 'arts_culture', 'culture': 'arts_culture',
    'sport': 'sports_recreation', 'gym': 'sports_recreation', 'recreation': 'sports_recreation',
    'shop': 'shopping', 'mall': 'shopping',
  };
  const valid = ['schools','commute','nightlife','walkability','safety','nature','healthcare','religious_community','shopping','dining','arts_culture','sports_recreation'];
  const result = new Set();
  for (const item of arr) {
    const lower = item.toLowerCase();
    for (const [key, val] of Object.entries(map)) {
      if (lower.includes(key)) result.add(val);
    }
    if (valid.includes(lower)) result.add(lower);
  }
  return [...result];
}

function categorizeTask(taskText) {
  const t = taskText.toLowerCase();
  if (t.includes('school') || t.includes('enroll')) return 'schools';
  if (t.includes('doctor') || t.includes('medical') || t.includes('hospital')) return 'healthcare';
  if (t.includes('flight') || t.includes('airline') || t.includes('travel')) return 'moving';
  if (t.includes('util') || t.includes('electric') || t.includes('internet') || t.includes('gas')) return 'utilities';
  if (t.includes('church') || t.includes('synagogue') || t.includes('mosque') || t.includes('community')) return 'social';
  if (t.includes('home') || t.includes('house') || t.includes('listing') || t.includes('agent')) return 'housing';
  if (t.includes('job') || t.includes('work') || t.includes('employ')) return 'employment';
  if (t.includes('license') || t.includes('dmv') || t.includes('register')) return 'legal';
  return 'other';
}