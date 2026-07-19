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

    // Fetch full template details (including variables) for each template
    const detailedTemplates = [];
    for (const t of templates) {
      const tplId = t.template_id || t.id || t._id;
      let variables = [];
      try {
        const detailRes = await fetch(`https://api.heygen.com/v2/template/${tplId}`, {
          headers: { 'X-Api-Key': heygenKey },
        });
        const detailData = await detailRes.json();
        const rawVars = detailData?.data?.variables || [];
        variables = rawVars.map(v => ({
          name: v.name,
          type: v.type,
          properties: v.properties ? Object.keys(v.properties) : [],
        }));
      } catch (e) {
        console.log(`Failed to fetch details for template ${tplId}: ${e.message}`);
      }
      detailedTemplates.push({
        id: tplId,
        name: t.name,
        status: t.status,
        created_at: t.created_at,
        thumbnail_image_url: t.thumbnail_image_url || t.thumbnail_url || t.preview_url || null,
        preview_image_url: t.preview_image_url || null,
        aspect_ratio: t.aspect_ratio || null,
        variables,
      });
    }

    return Response.json({
      success: true,
      count: detailedTemplates.length,
      templates: detailedTemplates,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});