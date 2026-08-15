import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { buildAgentLibraryHtml } from '../../shared/agentLibraryExport.ts';

/**
 * exportGrokFlow — generates a STANDALONE, self-contained HTML file
 * that renders the Agent Library as a sectioned navigation hub:
 *   HOME → 4 section boxes → sub-item lists → Google Doc links
 *
 * The exported HTML works completely independently of Base44.
 * Auth: admin only.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const nodes = await base44.asServiceRole.entities.ClaudeNode.list('node_order', 500);
    const html = buildAgentLibraryHtml(nodes);

    const file = new File([html], 'agent-library.html', { type: 'text/html' });
    const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      file_url: upload.file_url,
      node_count: nodes.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}