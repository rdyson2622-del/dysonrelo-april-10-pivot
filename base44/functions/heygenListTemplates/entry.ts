import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * heygenListTemplates — Lists all HeyGen templates available to the account.
 * Helps verify which template IDs exist and are published.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heygenKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    // List all templates
    const res = await fetch('https://api.heygen.com/v2/templates', {
      headers: { 'X-Api-Key': heygenKey },
    });
    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: 'Failed to list templates', details: data }, { status: 502 });
    }

    const templates = data?.data?.templates || [];
    return Response.json({
      success: true,
      count: templates.length,
      raw_keys: templates.length > 0 ? Object.keys(templates[0]) : [],
      templates: templates.map(t => ({
        id: t.id || t.template_id || t._id,
        name: t.name,
        status: t.status,
        created_at: t.created_at,
        variables: (t.variables || []).map(v => v.name),
      })),
      raw_first: templates[0] || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});