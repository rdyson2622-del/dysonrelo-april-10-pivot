import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { client_id, escrow_text, property_address, escrow_company, escrow_number } = payload;

    if (!client_id || !escrow_text) {
      return Response.json({ error: 'Missing client_id or escrow_text' }, { status: 400 });
    }

    // Call Gemini to extract milestone dates
    const geminiPrompt = `You are an escrow document analyzer. Extract all important milestone dates and deadlines from this escrow instruction document. For each date, identify:
1. The type of milestone (inspection, loan approval, closing, contingency release, etc.)
2. The specific date
3. Who is responsible
4. Any special notes

Return ONLY a valid JSON array with objects like:
[
  {
    "milestone_type": "inspection",
    "milestone_name": "Home Inspection Deadline",
    "due_date": "2026-05-15",
    "responsible_party": "buyer_action",
    "description": "Buyer must complete home inspection"
  },
  ...
]

DOCUMENT TEXT:
${escrow_text}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: geminiPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          milestones: {
            type: "array",
            items: {
              type: "object",
              properties: {
                milestone_type: { type: "string" },
                milestone_name: { type: "string" },
                due_date: { type: "string" },
                responsible_party: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          summary: { type: "string" }
        }
      }
    });

    const { milestones = [], summary = '' } = response || {};

    // Create milestone records
    const createdMilestones = [];
    for (const m of milestones) {
      try {
        const created = await base44.asServiceRole.entities.EscrowMilestone.create({
          client_id,
          property_address: property_address || 'Unknown',
          escrow_company: escrow_company || 'Unknown',
          escrow_number: escrow_number || '',
          milestone_type: m.milestone_type || 'other',
          milestone_name: m.milestone_name,
          due_date: m.due_date,
          description: m.description,
          responsible_party: m.responsible_party || 'client_action',
          status: 'pending',
          extracted_from: 'Escrow Instructions (parsed)',
          notes: `Auto-extracted from escrow document on ${new Date().toLocaleDateString()}`
        });
        createdMilestones.push(created);
      } catch (e) {
        console.error(`Failed to create milestone: ${m.milestone_name}`, e.message);
      }
    }

    return Response.json({
      success: true,
      milestones_created: createdMilestones.length,
      milestones: createdMilestones,
      summary
    });
  } catch (error) {
    console.error('parseEscrowInstructions error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});