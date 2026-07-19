import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

/**
 * heygenListTemplates — Lists all HeyGen templates available to the account.
 * Always includes the golden master template (fetched by ID) even if the
 * list endpoint doesn't return it (e.g. older draft versions without variables).
 * Also returns the hidden_templates list from the golden master LayoutTemplate
 * so the frontend can filter out old test templates.
 */
const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

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

    // Load golden master config to get hidden_templates + active template ID
    let goldenMaster = null;
    let hiddenTemplates = [];
    let activeTemplateId = null;
    try {
      const layouts = await base44.asServiceRole.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID });
      goldenMaster = layouts?.[0];
      hiddenTemplates = goldenMaster?.hidden_templates || [];
      activeTemplateId = goldenMaster?.heygen_template_id;
    } catch (e) {
      console.log(`Failed to load golden master: ${e.message}`);
    }

    // List all templates from HeyGen
    const res = await fetch('https://api.heygen.com/v2/templates', {
      headers: { 'X-Api-Key': heygenKey },
    });
    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: 'Failed to list templates', details: data }, { status: 502 });
    }

    const templates = data?.data?.templates || [];
    const collectedIds = new Set();

    // Fetch full template details (including variables) for each listed template
    const detailedTemplates = [];
    for (const t of templates) {
      const tplId = t.template_id || t.id || t._id;
      collectedIds.add(tplId);
      let variables = [];
      try {
        const detailRes = await fetch(`https://api.heygen.com/v2/template/${tplId}`, {
          headers: { 'X-Api-Key': heygenKey },
        });
        const detailData = await detailRes.json();
        const rawVars = detailData?.data?.variables;
        // HeyGen returns variables as an object keyed by name, NOT an array
        if (rawVars && typeof rawVars === 'object' && !Array.isArray(rawVars)) {
          variables = Object.entries(rawVars).map(([name, v]: [string, any]) => ({
            name,
            type: v?.type || 'unknown',
            properties: v?.properties ? Object.keys(v.properties) : [],
          }));
        } else if (Array.isArray(rawVars)) {
          variables = rawVars.map(v => ({
            name: v.name,
            type: v.type,
            properties: v.properties ? Object.keys(v.properties) : [],
          }));
        }
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
        is_golden_master: tplId === activeTemplateId,
        source: 'listed',
      });
    }

    // Always fetch the golden master template by ID directly — even if the list
    // endpoint didn't return it (older draft versions, templates without variables)
    if (activeTemplateId && !collectedIds.has(activeTemplateId)) {
      try {
        const detailRes = await fetch(`https://api.heygen.com/v2/template/${activeTemplateId}`, {
          headers: { 'X-Api-Key': heygenKey },
        });
        const detailData = await detailRes.json();
        if (detailRes.ok && detailData?.data) {
          const d = detailData.data;
          const rawVars = d.variables;
          let variables = [];
          if (rawVars && typeof rawVars === 'object' && !Array.isArray(rawVars)) {
            variables = Object.entries(rawVars).map(([name, v]: [string, any]) => ({
              name,
              type: v?.type || 'unknown',
              properties: v?.properties ? Object.keys(v.properties) : [],
            }));
          } else if (Array.isArray(rawVars)) {
            variables = rawVars.map(v => ({
              name: v.name,
              type: v.type,
              properties: v.properties ? Object.keys(v.properties) : [],
            }));
          }
          detailedTemplates.unshift({
            id: activeTemplateId,
            name: d.name || 'Golden Master (not listed)',
            status: d.status || 'active',
            created_at: d.created_at || null,
            thumbnail_image_url: d.thumbnail_image_url || d.thumbnail_url || d.preview_url || null,
            preview_image_url: d.preview_image_url || null,
            aspect_ratio: d.aspect_ratio || null,
            variables,
            is_golden_master: true,
            source: 'direct_fetch',
          });
          console.log(`[heygenListTemplates] Golden master ${activeTemplateId} fetched directly (not in list endpoint)`);
        } else {
          console.log(`[heygenListTemplates] Golden master ${activeTemplateId} direct fetch failed: ${detailData?.message || detailRes.status}`);
        }
      } catch (e) {
        console.log(`[heygenListTemplates] Golden master direct fetch error: ${e.message}`);
      }
    }

    return Response.json({
      success: true,
      count: detailedTemplates.length,
      templates: detailedTemplates,
      hidden_templates: hiddenTemplates,
      active_template_id: activeTemplateId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});