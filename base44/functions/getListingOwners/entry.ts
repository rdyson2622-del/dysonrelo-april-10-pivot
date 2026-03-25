import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Always read from production (asServiceRole ignores test/dev environment flag)
    const owners = await base44.asServiceRole.entities.ListingOwner.list('-created_date', 500);
    return Response.json({ owners });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});