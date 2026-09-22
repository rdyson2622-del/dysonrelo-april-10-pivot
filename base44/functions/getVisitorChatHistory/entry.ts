import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

// Lets an anonymous CoPilot visitor read back their own past turns (saved by
// copilotAsk under their visitor_id) for display in My Library. A normal
// entity read would be blocked by ChatMessage's RLS for anonymous visitors,
// so this uses the service role, scoped strictly to the visitor_id supplied.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { visitor_id } = await req.json();
    if (!visitor_id) return Response.json({ error: 'Missing visitor_id' }, { status: 400 });
    const messages = await base44.asServiceRole.entities.ChatMessage.filter({ client_id: visitor_id }, '-created_date', 50);
    return Response.json({ messages });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}