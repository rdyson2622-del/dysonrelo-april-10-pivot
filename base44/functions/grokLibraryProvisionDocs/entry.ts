import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import {
  getAuthHeader, findOrCreateFolder, createGoogleDoc, writeDocContent,
  ROOT_FOLDER_NAME, SECTION_FOLDERS, SECTION_LABELS,
} from '../../shared/grokLibraryDrive.ts';

/**
 * grokLibraryProvisionDocs — admin-only.
 * Creates the Google Drive folder tree mirroring the flowchart, one Google Doc
 * per ClaudeNode (placed in the correct section/subsection folder), writes each
 * doc URL back to the node's google_doc_url field, and generates a master
 * overview Google Doc with the full 4-section hierarchy + links.
 *
 * Payload: { force?: boolean } — when true, re-creates docs even if a node
 * already has a google_doc_url.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const force = !!body.force;

    const authHeader = await getAuthHeader(base44);

    // Load all nodes
    const nodes = await base44.asServiceRole.entities.ClaudeNode.list('node_order', 500);

    // 1. Root folder
    const rootId = await findOrCreateFolder(ROOT_FOLDER_NAME, null, authHeader);

    // 2. Section folders
    const sectionFolderIds = {};
    for (const key of Object.keys(SECTION_FOLDERS)) {
      sectionFolderIds[key] = await findOrCreateFolder(SECTION_FOLDERS[key], rootId, authHeader);
    }

    // 3. Departments subsection folders
    const subFolderIds = {}; // `${section}:${subsection}` -> id
    const deptNodes = nodes.filter((n) => n.section === 'departments');
    const deptSubs = [...new Set(deptNodes.map((n) => n.subsection || 'General'))];
    for (const sub of deptSubs) {
      subFolderIds[`departments:${sub}`] = await findOrCreateFolder(sub, sectionFolderIds.departments, authHeader);
    }

    // 4. Create one doc per node
    let created = 0;
    let skipped = 0;
    const nodeDocLinks = []; // for master doc

    for (const node of nodes) {
      if (node.google_doc_url && !force) {
        skipped++;
        nodeDocLinks.push({ node, url: node.google_doc_url });
        continue;
      }

      // Determine parent folder
      let parentId;
      if (node.section === 'departments') {
        parentId = subFolderIds[`departments:${node.subsection || 'General'}`];
      } else {
        parentId = sectionFolderIds[node.section] || sectionFolderIds.agent_context;
      }

      const { id: docId, url } = await createGoogleDoc(node.title, parentId, authHeader);

      // Seed the doc with the node's existing content/summary
      const seedText = node.content || node.summary
        ? `${node.title}\n\n${node.content || node.summary}`
        : `${node.title}\n\n(This document is the canonical content for the "${node.title}" node in the Grok AI Agent Library. Edit this doc — then run sync to update Base44.)`;
      await writeDocContent(docId, seedText, authHeader);

      // Write URL back to the node
      await base44.asServiceRole.entities.ClaudeNode.update(node.id, { google_doc_url: url });
      created++;
      nodeDocLinks.push({ node, url });
    }

    // 5. Master overview doc at root
    const master = await createGoogleDoc("00_MASTER_OVERVIEW", rootId, authHeader);
    let masterText = "GROK AI AGENT LIBRARY — MASTER OVERVIEW\n\n";
    masterText += "This document mirrors the Base44 Grok AI Agent Library Flow Chart.\n";
    masterText += "Each section below corresponds to a flowchart section; each linked item is a node.\n\n";

    for (const sectionKey of Object.keys(SECTION_FOLDERS)) {
      masterText += `\n═══════════════════════════════════════════\n`;
      masterText += `${SECTION_FOLDERS[sectionKey]} — ${SECTION_LABELS[sectionKey]}\n`;
      masterText += `═══════════════════════════════════════════\n\n`;

      const sectionNodes = nodeDocLinks
        .filter((x) => x.node.section === sectionKey)
        .sort((a, b) => (a.node.node_order || 0) - (b.node.node_order || 0));

      if (sectionKey === 'departments') {
        const subs = [...new Set(sectionNodes.map((x) => x.node.subsection || 'General'))];
        for (const sub of subs) {
          masterText += `— ${sub} —\n`;
          sectionNodes
            .filter((x) => (x.node.subsection || 'General') === sub)
            .forEach((x) => {
              masterText += `  • ${x.node.title}\n    ${x.url}\n`;
            });
          masterText += "\n";
        }
      } else {
        sectionNodes.forEach((x) => {
          masterText += `  • ${x.node.title}\n    ${x.url}\n`;
        });
        masterText += "\n";
      }
    }

    await writeDocContent(master.id, masterText, authHeader);

    return Response.json({
      status: 'ok',
      root_folder_id: rootId,
      master_doc_url: master.url,
      nodes_total: nodes.length,
      docs_created: created,
      docs_skipped: skipped,
      section_folders: sectionFolderIds,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}