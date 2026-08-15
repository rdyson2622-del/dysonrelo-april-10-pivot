import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getAuthHeader, exportDocText, extractDocId } from '../../shared/grokLibraryDrive.ts';

/**
 * grokLibraryWebhookSync — Google Drive connector webhook handler.
 * Fires on `changes` events (any Drive change). Uses the Changes API with a
 * persisted page token (SyncState entity) for incremental sync: only files
 * that match a ClaudeNode's google_doc_url are pulled and written back to
 * the node's `content` field.
 *
 * Called by the Base44 platform — no custom auth needed.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    // Initial sync acknowledgment from Google
    const state = body?.data?._provider_meta?.['x-goog-resource-state'];
    if (state === 'sync') {
      return Response.json({ status: 'sync_ack' });
    }

    const authHeader = await getAuthHeader(base44);

    // Load or initialize the page token
    const existing = await base44.asServiceRole.entities.SyncState.list();
    let syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      const tokenRes = await fetch(
        'https://www.googleapis.com/drive/v3/changes/startPageToken',
        { headers: authHeader }
      );
      const { startPageToken } = await tokenRes.json();
      await base44.asServiceRole.entities.SyncState.create({
        page_token: startPageToken,
        last_synced_at: new Date().toISOString(),
      });
      return Response.json({ status: 'initialized' });
    }

    // Fetch all pages of changes since the last token
    const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType)),newStartPageToken,nextPageToken`;
    let changesUrl = baseUrl + `&pageToken=${syncRecord.page_token}`;
    const allChanges = [];
    let newPageToken = null;

    while (changesUrl) {
      const changesRes = await fetch(changesUrl, { headers: authHeader });
      if (!changesRes.ok) break;
      const page = await changesRes.json();
      allChanges.push(...(page.changes || []));
      if (page.newStartPageToken) newPageToken = page.newStartPageToken;
      changesUrl = page.nextPageToken ? baseUrl + `&pageToken=${page.nextPageToken}` : null;
    }

    // Build a lookup map: docId -> node
    const nodes = await base44.asServiceRole.entities.ClaudeNode.list('node_order', 500);
    const nodeByDocId = {};
    for (const node of nodes) {
      const docId = extractDocId(node.google_doc_url);
      if (docId) nodeByDocId[docId] = node;
    }

    // Process changes — only Google Docs that match our library nodes
    let synced = 0;
    const syncedTitles = [];
    for (const change of allChanges) {
      const file = change.file;
      if (!file || file.mimeType !== 'application/vnd.google-apps.document') continue;
      const node = nodeByDocId[file.id];
      if (!node) continue;

      try {
        const text = await exportDocText(file.id, authHeader);
        const update = { content: text };
        if (!node.summary) {
          const firstLine = text.split('\n').map((l) => l.trim()).find((l) => l);
          if (firstLine && firstLine !== node.title) {
            update.summary = firstLine.slice(0, 120);
          }
        }
        await base44.asServiceRole.entities.ClaudeNode.update(node.id, update);
        synced++;
        syncedTitles.push(node.title);
      } catch {
        // skip individual file errors
      }
    }

    // Save the new page token + summary
    if (newPageToken) {
      const summary = `${synced} node(s) synced: ${syncedTitles.join(', ') || 'none'}`;
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
        page_token: newPageToken,
        last_synced_at: new Date().toISOString(),
        last_sync_summary: summary,
      });
    }

    return Response.json({
      status: 'ok',
      changes_scanned: allChanges.length,
      nodes_synced: synced,
      synced_titles: syncedTitles,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}