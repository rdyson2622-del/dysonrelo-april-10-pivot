import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getAuthHeader, exportDocText, extractDocId } from '../../shared/grokLibraryDrive.ts';

/**
 * grokLibrarySyncDoc — admin-only.
 * Pulls the current text content of a node's linked Google Doc and writes it
 * back into the node's `content` field (and derives a short `summary` from the
 * first line if no summary is set). This is the "update Google Doc →
 * updates Base44 metadata" half of the manual sync workflow.
 *
 * Payload: { nodeId: string }  — or omit to sync ALL nodes with a google_doc_url.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const authHeader = await getAuthHeader(base44);

    // Determine target nodes
    let nodes;
    if (body.nodeId) {
      const n = await base44.asServiceRole.entities.ClaudeNode.get(body.nodeId);
      nodes = n ? [n] : [];
    } else {
      nodes = await base44.asServiceRole.entities.ClaudeNode.list('node_order', 500);
    }

    let synced = 0;
    let failed = 0;
    const results = [];

    for (const node of nodes) {
      const docId = extractDocId(node.google_doc_url);
      if (!docId) {
        results.push({ nodeId: node.id, title: node.title, status: 'skipped', reason: 'no google_doc_url' });
        continue;
      }
      try {
        const text = await exportDocText(docId, authHeader);
        const update = { content: text };
        // Derive summary from first non-empty line if none set
        if (!node.summary) {
          const firstLine = text.split('\n').map((l) => l.trim()).find((l) => l);
          if (firstLine && firstLine !== node.title) {
            update.summary = firstLine.slice(0, 120);
          }
        }
        await base44.asServiceRole.entities.ClaudeNode.update(node.id, update);
        synced++;
        results.push({ nodeId: node.id, title: node.title, status: 'synced', chars: text.length });
      } catch (e) {
        failed++;
        results.push({ nodeId: node.id, title: node.title, status: 'failed', error: e.message });
      }
    }

    return Response.json({
      status: 'ok',
      synced,
      failed,
      results: body.nodeId ? results[0] : results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}