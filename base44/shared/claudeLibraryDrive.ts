/**
 * Shared Google Drive helpers for the Claude AI Agent Library.
 * Used by claudeLibraryProvisionDocs and claudeLibrarySyncDoc.
 */

export const ROOT_FOLDER_NAME = "DysonRelo Agent Library";

export const SECTION_FOLDERS = {
  departments: "01_Departments",
  agent_context: "02_Agent_Context",
  skills_sops: "03_Skills_SOPs",
  tools_integrations: "04_Tools_Integrations",
};

export const SECTION_LABELS = {
  departments: "Departments",
  agent_context: "Agent Context",
  skills_sops: "Skills & SOPs",
  tools_integrations: "Tools & Integrations",
};

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

export async function getAuthHeader(base44) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection("googledrive");
  return { Authorization: `Bearer ${accessToken}` };
}

/** Find a folder by name inside a parent, or create it. Returns the folder id. */
export async function findOrCreateFolder(name, parentId, authHeader) {
  const parentQ = parentId ? `'${parentId}' in parents` : "";
  const q = `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentQ ? " and " + parentQ : ""}`;
  const url = `${DRIVE_API}?q=${encodeURIComponent(q)}&fields=files(id,name)`;
  const res = await fetch(url, { headers: authHeader });
  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  const body = { name, mimeType: "application/vnd.google-apps.folder" };
  if (parentId) body.parents = [parentId];
  const createRes = await fetch(DRIVE_API + "?fields=id", {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const created = await createRes.json();
  return created.id;
}

/** Create a Google Doc inside a parent folder. Returns { id, url }. */
export async function createGoogleDoc(name, parentId, authHeader) {
  const body = { name, mimeType: "application/vnd.google-apps.document" };
  if (parentId) body.parents = [parentId];
  const res = await fetch(DRIVE_API + "?fields=id", {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const doc = await res.json();
  return { id: doc.id, url: `https://docs.google.com/document/d/${doc.id}/edit` };
}

/** Write text content into a Google Doc (replaces all content). */
export async function writeDocContent(fileId, text, authHeader) {
  await fetch(`https://docs.googleapis.com/v1/documents/${fileId}:batchUpdate`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [{ insertText: { location: { index: 1 }, text: text || "" } }],
    }),
  });
}

/** Export a Google Doc's content as plain text. */
export async function exportDocText(fileId, authHeader) {
  const res = await fetch(
    `${DRIVE_API}/${fileId}/export?mimeType=text/plain`,
    { headers: authHeader }
  );
  return await res.text();
}

/** Extract the Google Doc file id from a docs.google.com URL. */
export function extractDocId(url) {
  if (!url) return null;
  const m = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}