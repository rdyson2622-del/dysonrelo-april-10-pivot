import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { clientInfo, form } = await req.json();

    const subject = `New Relocation Profile: ${clientInfo.name} → ${form.destination_city}, ${form.destination_state}`;

    const body = `
NEW RELOCATION PROFILE SUBMITTED
================================

CLIENT: ${clientInfo.name}
EMAIL: ${clientInfo.email}
PHONE: ${clientInfo.phone || 'Not provided'}

--- DESTINATION ---
City: ${form.destination_city}
State: ${form.destination_state}
Timeline: ${form.timeline}

--- BUDGET ---
${form.budget}

--- PROPERTY PREFERENCES ---
Types: ${(form.property_types || []).join(', ') || 'Not selected'}

--- FAMILY ---
Household: ${form.family_size}
Children ages: ${(form.kid_ages || []).join(', ') || 'N/A'}
Pets: ${form.pets || 'Not specified'}

--- LIFESTYLE PRIORITIES ---
${(form.priorities || []).map(p => '• ' + p).join('\n') || 'None selected'}

--- PREFERRED AGENT STYLE ---
${(form.agent_styles || []).map(a => '• ' + a).join('\n') || 'None selected'}

--- CURRENT HOME SITUATION ---
${form.current_situation || 'Not specified'}

--- ADDITIONAL NOTES ---
${form.additional_notes || 'None'}

================================
Ready for your call with ${clientInfo.name}.
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject,
      body,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});