import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { upsertEscrowMilestone } from '../../shared/boldtrailSync.ts';

/**
 * Option B — Gmail-based escrow sync.
 * BoldTrail BackOffice sends per-transaction notification emails. This function
 * reads recent Gmail messages matching a transaction query, uses InvokeLLM to
 * extract milestone data (escrow #, type, due date, property), and upserts
 * EscrowMilestone records. Uses the already-authorized Gmail connector.
 *
 * Admin-only. Invoke manually or via a scheduled automation.
 */
const GMAIL_QUERY = '(from:boldtrail OR from:backoffice OR subject:escrow OR subject:transaction OR subject:"clear to close" OR subject:inspection) newer_than:7d';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    // Get Gmail access token via the connected OAuth connector
    let accessToken;
    try {
      const conn = await base44.asServiceRole.connectors.getConnection('gmail');
      accessToken = conn?.accessToken;
      if (!accessToken) throw new Error('No access token returned');
    } catch (e) {
      return Response.json({
        error: 'Gmail connector not connected',
        hint: 'Authorize the Gmail connector in the dashboard so this function can read transaction emails.',
      }, { status: 400 });
    }

    // List recent messages matching the query
    const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
    listUrl.searchParams.set('q', GMAIL_QUERY);
    listUrl.searchParams.set('maxResults', '20');
    const listRes = await fetch(listUrl.toString(), {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!listRes.ok) {
      return Response.json({ error: `Gmail list ${listRes.status}`, detail: await listRes.text() }, { status: 502 });
    }
    const listBody = await listRes.json();
    const messages = listBody.messages || [];

    let processed = 0, created = 0, updated = 0, skipped = 0;
    for (const msg of messages) {
      // Fetch full message
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!msgRes.ok) { skipped++; continue; }
      const msgBody = await msgRes.json();
      const subject = getHeader(msgBody, 'Subject');
      const from = getHeader(msgBody, 'From');
      const body = extractBody(msgBody);
      const combined = `Subject: ${subject}\nFrom: ${from}\n\n${body}`.slice(0, 8000);

      // Use InvokeLLM to extract structured milestone data
      const llmRes = await base44.integrations.Core.InvokeLLM({
        prompt: `You are parsing a real estate escrow / transaction notification email from BoldTrail BackOffice. Extract any escrow milestone information. Return JSON matching the schema. If you cannot confidently identify an escrow number and a milestone type, return empty/null values.\n\nEMAIL:\n${combined}`,
        response_json_schema: {
          type: 'object',
          properties: {
            escrow_number: { type: 'string' },
            property_address: { type: 'string' },
            escrow_company: { type: 'string' },
            milestone_type: { type: 'string', enum: ['initial_deposit','inspection','inspection_contingency_release','appraisal','loan_approval','homeowners_insurance','final_walkthrough','release_of_contingencies','clear_to_close','closing_date','funding','moving_date','utility_activation','other'] },
            milestone_name: { type: 'string' },
            due_date: { type: 'string', description: 'YYYY-MM-DD' },
            responsible_party: { type: 'string', enum: ['buyer','seller','escrow_company','lender','title_company','inspector','appraiser','client_action'] },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending','in_progress','completed','waived','at_risk','failed'] },
            confidence: { type: 'number' },
          },
        },
      });

      const data = llmRes.data || llmRes;
      if (!data || !data.escrow_number || !data.milestone_type || (data.confidence !== undefined && data.confidence < 0.6)) {
        skipped++;
        continue;
      }
      try {
        await upsertEscrowMilestone(base44, {
          client_id: 'gmail_import',
          escrow_number: data.escrow_number,
          property_address: data.property_address || '',
          escrow_company: data.escrow_company || 'BoldTrail',
          milestone_type: data.milestone_type,
          milestone_name: data.milestone_name || subject,
          due_date: data.due_date || new Date().toISOString().slice(0, 10),
          responsible_party: data.responsible_party || 'escrow_company',
          description: data.description || `Parsed from email: ${subject}`,
          status: data.status || 'pending',
          extracted_from: 'gmail',
        });
        created++;
        processed++;
      } catch { skipped++; }
    }

    return Response.json({
      status: 'ok',
      source: 'gmail',
      messages_scanned: messages.length,
      milestones_upserted: created + updated,
      skipped,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function getHeader(msg, name) {
  const h = (msg.payload?.headers || []).find(x => x.name.toLowerCase() === name.toLowerCase());
  return h ? h.value : '';
}

function extractBody(msg) {
  const part = msg.payload;
  if (part.body?.data) return decodeBase64(part.body.data);
  if (part.parts) {
    const text = part.parts.find(p => p.mimeType === 'text/plain');
    if (text?.body?.data) return decodeBase64(text.body.data);
    const html = part.parts.find(p => p.mimeType === 'text/html');
    if (html?.body?.data) return decodeBase64(html.body.data).replace(/<[^>]+>/g, ' ');
  }
  return '';
}

function decodeBase64(s) {
  try {
    const normalized = s.replace(/-/g, '+').replace(/_/g, '/');
    return atob(normalized);
  } catch { return ''; }
}