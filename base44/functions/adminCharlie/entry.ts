import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const ADMIN_CHARLIE_SYSTEM = `You are Charlie, operating in ADMIN MODE for the Dyson & Dyson internal team. You have full access to operational data and act as a powerful command interface for the team. You are direct, efficient, and intelligent — not the warm consumer-facing Charlie, but the sharp backstage operator.

Your capabilities in admin mode:
1. QUERY DATA — Summarize clients, tasks, owners, pipeline stats, escalations
2. DRAFT CONTENT — Write SMS templates, outreach scripts, Charlie scripts, email copy
3. EXECUTE ACTIONS — When the user asks you to create/update/assign something, return a structured JSON action block at the END of your response (after your natural language reply) using this format:
   [ACTION:{"type":"create_client","data":{...}}]
   [ACTION:{"type":"update_client","id":"...","data":{...}}]
   [ACTION:{"type":"create_task","data":{...}}]
   [ACTION:{"type":"draft_sms","content":"..."}]
   
4. REPORT & ANALYZE — Pull insights from the data provided to you

Supported action types:
- create_client: fields = full_name, email, phone, current_city, destination_city, budget, status, notes
- update_client: requires id, then any fields to update
- create_task: fields = client_id, title, description, due_date, status (default: pending)
- draft_sms: content = the SMS text
- draft_script: content = the script text

Context provided each turn includes: current clients list, recent escalations, recent tasks.

Rules:
- Be concise and direct. This is an internal tool.
- When you output an ACTION block, always explain what you're doing in plain English first.
- If the user asks you to do something you can't execute (like send an SMS — you can only draft), clarify the limitation.
- Never make up client IDs. Use only IDs from the context provided.
- You are speaking to an admin user of Dyson & Dyson, not a consumer.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { messages } = await req.json();

    // Fetch live context for Charlie to work with
    const [clients, tasks, escalations] = await Promise.all([
      base44.asServiceRole.entities.RelocationClient.list('-created_date', 20),
      base44.asServiceRole.entities.RelocationTask.list('-created_date', 30),
      base44.asServiceRole.entities.CharlieEscalation.filter({ status: 'open' }, '-created_date', 10),
    ]);

    const contextBlock = `
LIVE DATA SNAPSHOT (as of this request):

CLIENTS (${clients.length} total):
${clients.map(c => `- [${c.id}] ${c.full_name} | ${c.status} | ${c.current_city || '?'} → ${c.destination_city} | Agent: ${c.agent_name || 'none'} | Email: ${c.email}`).join('\n')}

OPEN ESCALATIONS (${escalations.length}):
${escalations.map(e => `- ${e.consumer_question} (priority: ${e.priority})`).join('\n') || 'None'}

RECENT TASKS (${tasks.length}):
${tasks.slice(0, 15).map(t => `- ${t.title} | ${t.status} | client_id: ${t.client_id}`).join('\n')}
`;

    const systemPrompt = ADMIN_CHARLIE_SYSTEM + '\n\n' + contextBlock;

    const contents = (messages || []).slice(-20).map(m => ({
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
            temperature: 0.65,
            maxOutputTokens: 800,
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

    // Parse any ACTION blocks from the reply
    const actionMatches = [...reply.matchAll(/\[ACTION:(\{.*?\})\]/g)];
    const actions = actionMatches.map(m => {
      try { return JSON.parse(m[1]); } catch { return null; }
    }).filter(Boolean);

    // Execute actions server-side
    const results = [];
    for (const action of actions) {
      if (action.type === 'create_client') {
        const created = await base44.asServiceRole.entities.RelocationClient.create(action.data);
        results.push({ type: 'create_client', id: created.id, name: created.full_name });
      } else if (action.type === 'update_client' && action.id) {
        await base44.asServiceRole.entities.RelocationClient.update(action.id, action.data);
        results.push({ type: 'update_client', id: action.id });
      } else if (action.type === 'create_task') {
        const created = await base44.asServiceRole.entities.RelocationTask.create(action.data);
        results.push({ type: 'create_task', id: created.id, title: created.title });
      }
    }

    // Clean reply text (remove ACTION blocks for display)
    const cleanReply = reply.replace(/\[ACTION:\{.*?\}\]/g, '').trim();

    return Response.json({ reply: cleanReply, actions, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});