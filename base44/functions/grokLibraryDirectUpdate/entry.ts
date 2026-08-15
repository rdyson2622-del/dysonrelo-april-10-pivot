import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    // ── Auth: shared API key in x-api-key header ──
    const apiKey = req.headers.get('x-api-key') || req.headers.get('X-Api-Key');
    const expectedKey = secrets.get("CLAUDELIBRARYAPIKEY");
    if (!expectedKey) {
      return Response.json({ error: 'Server secret CLAUDELIBRARYAPIKEY is not configured. Set it in Dashboard → Settings → Environment Variables.' }, { status: 500 });
    }
    if (!apiKey || apiKey !== expectedKey) {
      return Response.json({ error: 'Invalid or missing API key. Send it in the x-api-key header.' }, { status: 401 });
    }

    // ── Parse body ──
    const body = await req.json();
    const { node_id, node_name, content, action, section, subsection } = body;

    if (!content || typeof content !== 'string') {
      return Response.json({ error: 'Missing or invalid "content" (must be a string).' }, { status: 400 });
    }
    if (!node_id && !node_name) {
      return Response.json({ error: 'Provide either node_id or node_name to identify the target node.' }, { status: 400 });
    }
    const validActions = ['create', 'update', 'append', 'replace'];
    const resolvedAction = action || 'update';
    if (!validActions.includes(resolvedAction)) {
      return Response.json({ error: `Invalid action "${action}". Must be one of: ${validActions.join(', ')}.` }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const b = base44.asServiceRole;

    // ── Resolve target node ──
    let node = null;
    if (node_id) {
      try {
        node = await b.entities.ClaudeNode.get(node_id);
      } catch (e) {
        // not found — fall through to name lookup for create
      }
    }
    if (!node && node_name) {
      const matches = await b.entities.ClaudeNode.filter({ title: node_name });
      node = matches && matches.length > 0 ? matches[0] : null;
    }

    // ── CREATE ──
    if (resolvedAction === 'create') {
      if (node) {
        return Response.json({ error: `Node "${node_name || node_id}" already exists. Use action "update" or "replace" instead.`, existing_id: node.id }, { status: 409 });
      }
      if (!node_name) {
        return Response.json({ error: 'action "create" requires node_name.' }, { status: 400 });
      }
      const created = await b.entities.ClaudeNode.create({
        title: node_name,
        content,
        section: section || 'agent_context',
        subsection: subsection || '',
      });
      return Response.json({
        status: 'created',
        node_id: created.id,
        node_name: created.title,
        content_length: content.length,
        message: `Node "${created.title}" created and content loaded.`,
      });
    }

    // ── UPDATE / REPLACE / APPEND (require existing node) ──
    if (!node) {
      return Response.json({ error: `Node "${node_name || node_id}" not found. Use action "create" to create it first.` }, { status: 404 });
    }

    let newContent = content;
    if (resolvedAction === 'append') {
      newContent = (node.content || '') + '\n\n' + content;
    }

    const updated = await b.entities.ClaudeNode.update(node.id, { content: newContent });

    return Response.json({
      status: resolvedAction === 'append' ? 'appended' : 'updated',
      node_id: updated.id,
      node_name: updated.title,
      section: updated.section,
      content_length: newContent.length,
      message: `Content ${resolvedAction === 'append' ? 'appended to' : 'loaded into'} node "${updated.title}".`,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}