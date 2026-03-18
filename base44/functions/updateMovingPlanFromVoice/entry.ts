import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { client_id, audio_url } = await req.json();
    if (!client_id || !audio_url) {
      return Response.json({ error: 'Missing client_id or audio_url' }, { status: 400 });
    }

    // Fetch the audio and transcribe using Gemini
    const response = await fetch(audio_url);
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    // Use Gemini to transcribe and extract pivot points
    const analysisPrompt = `Analyze this voice note from a relocating buyer and extract any changes to their relocation plan:

Look for:
- Budget changes (e.g., "our budget is now X")
- Destination changes (e.g., "we're looking at Y instead of Z")
- Timeline shifts (e.g., "we need to move sooner/later")
- Priority updates (e.g., "schools are now more important")
- Property type changes (e.g., "maybe a condo instead")

Return a JSON object with:
{
  "summary": "brief summary of what was said",
  "pivots": [
    {
      "type": "budget_change|destination_change|timeline_shift|priority_update|property_type_change",
      "old_value": "previous value",
      "new_value": "new value",
      "description": "what changed"
    }
  ],
  "confidence": 0.0-1.0
}`;

    const geminiRes = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      file_urls: [audio_url],
      model: 'gemini_3_flash',
    });

    let pivotData = { pivots: [], summary: '' };
    try {
      pivotData = typeof geminiRes === 'string' ? JSON.parse(geminiRes) : geminiRes;
    } catch (e) {
      // Fallback if parsing fails
      pivotData = { pivots: [], summary: geminiRes, confidence: 0.5 };
    }

    // Fetch current moving plan
    const movingPlans = await base44.entities.MovingPlan.filter({ client_id }, '-created_date', 1);
    let movingPlan = movingPlans[0];

    if (!movingPlan) {
      return Response.json({ error: 'No moving plan found for client' }, { status: 404 });
    }

    // Update moving plan with detected pivots
    if (pivotData.pivots && pivotData.pivots.length > 0) {
      const newPivots = pivotData.pivots.map(pivot => ({
        timestamp: new Date().toISOString(),
        type: pivot.type,
        old_value: pivot.old_value,
        new_value: pivot.new_value,
        source: 'voice_note',
      }));

      // Update relevant fields based on pivot types
      const updates = {
        last_updated: new Date().toISOString(),
        last_updated_by: 'user_voice_note',
        pivot_points: [...(movingPlan.pivot_points || []), ...newPivots],
      };

      for (const pivot of pivotData.pivots) {
        if (pivot.type === 'budget_change') {
          updates.budget_range = pivot.new_value;
        } else if (pivot.type === 'destination_change') {
          updates.destination_city = pivot.new_value.split(',')[0]; // Extract city
          updates.destination_state = pivot.new_value.split(',')[1]?.trim();
        } else if (pivot.type === 'timeline_shift') {
          updates.move_timeline = pivot.new_value;
        } else if (pivot.type === 'priority_update') {
          // Extract priority from description and update priorities array
          if (updates.priorities) {
            updates.priorities = [...updates.priorities, pivot.new_value];
          }
        } else if (pivot.type === 'property_type_change') {
          updates.property_type = pivot.new_value;
        }
      }

      movingPlan = await base44.entities.MovingPlan.update(movingPlan.id, updates);
    }

    return Response.json({
      success: true,
      plan: movingPlan,
      pivots: pivotData.pivots,
      summary: pivotData.summary,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});