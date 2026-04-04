import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Keywords that indicate a positive reply
const YES_KEYWORDS = ['yes', 'interested', 'sure', 'please', 'call me', 'sounds good', 'tell me more', 'id like', "i'd like", 'absolutely', 'definitely'];
const STOP_KEYWORDS = ['stop', 'unsubscribe', 'remove', 'opt out', 'optout', 'no thanks', 'not interested'];

function normalizePhone(phone) {
  if (!phone) return null;
  return phone.replace(/\D/g, '').replace(/^1/, '');
}

function extractEmailBody(message) {
  const payload = message.payload;
  if (!payload) return '';

  const decode = (data) => {
    try {
      return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    } catch { return ''; }
  };

  if (payload.body?.data) return decode(payload.body.data);

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decode(part.body.data);
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return decode(part.body.data).replace(/<[^>]+>/g, ' ');
      }
    }
  }
  return '';
}

function getHeader(message, name) {
  return message.payload?.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    const messageIds = body.data?.new_message_ids ?? [];
    if (!messageIds.length) {
      return Response.json({ status: 'no_new_messages' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load all listing owners and outreach campaigns once
    const [owners, campaigns] = await Promise.all([
      base44.asServiceRole.entities.ListingOwner.list('-created_date', 5000),
      base44.asServiceRole.entities.OwnerOutreachCampaign.list('-created_date', 5000),
    ]);

    let processed = 0;
    let matched = 0;

    for (const messageId of messageIds) {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: authHeader }
      );
      if (!res.ok) continue;

      const message = await res.json();
      const from = getHeader(message, 'from');
      const subject = getHeader(message, 'subject');
      const body_text = extractEmailBody(message).toLowerCase().trim();
      const date = getHeader(message, 'date');

      processed++;

      // Try to match by email address in "From" header
      const fromEmail = from.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0]?.toLowerCase();
      const fromPhone = normalizePhone(from.match(/[\d\-\(\)\+\s]{10,}/)?.[0]);

      let matchedOwner = null;

      if (fromEmail) {
        matchedOwner = owners.find(o => o.email?.toLowerCase() === fromEmail);
      }
      if (!matchedOwner && fromPhone) {
        matchedOwner = owners.find(o => normalizePhone(o.phone) === fromPhone);
      }

      // Determine intent
      const isYes = YES_KEYWORDS.some(k => body_text.includes(k));
      const isStop = STOP_KEYWORDS.some(k => body_text.includes(k));

      const noteEntry = `[Email ${new Date().toLocaleDateString()}] From: ${from} | Subject: ${subject} | Intent: ${isYes ? 'INTERESTED' : isStop ? 'OPT-OUT' : 'REPLY'} | Body: ${body_text.substring(0, 200)}`;

      if (matchedOwner) {
        matched++;
        const newStatus = isStop ? 'not_interested' : isYes ? 'interested' : 'in_conversation';

        // Update ListingOwner
        await base44.asServiceRole.entities.ListingOwner.update(matchedOwner.id, {
          contact_status: newStatus,
          last_contacted: new Date().toISOString().split('T')[0],
          notes: (matchedOwner.notes ? matchedOwner.notes + '\n' : '') + noteEntry,
        });

        // Update or create OwnerOutreachCampaign
        const existingCampaign = campaigns.find(c => c.listing_owner_id === matchedOwner.id);
        if (existingCampaign) {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.update(existingCampaign.id, {
            workflow_stage: isYes ? 'response' : existingCampaign.workflow_stage,
            response_date: new Date().toISOString(),
            notes: (existingCampaign.notes ? existingCampaign.notes + '\n' : '') + noteEntry,
          });
        } else {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
            listing_owner_id: matchedOwner.id,
            owner_name: matchedOwner.owner_name,
            owner_phone: matchedOwner.phone || '',
            property_address: matchedOwner.property_address || '',
            workflow_stage: isYes ? 'response' : 'outreach',
            response_date: new Date().toISOString(),
            notes: noteEntry,
          });
        }

        // If STOP, also log opt-out
        if (isStop) {
          await base44.asServiceRole.entities.OptOut.create({
            phone: matchedOwner.phone || fromEmail || '',
            source: 'manual',
            opted_out_at: new Date().toISOString(),
            reason: 'Email opt-out reply: ' + body_text.substring(0, 100),
          });
        }
      } else {
        // Unmatched reply — still log as OptIn for follow-up
        if (isYes && fromEmail) {
          await base44.asServiceRole.entities.OptIn.create({
            email: fromEmail,
            source: 'sms_reply',
            opted_in_at: new Date().toISOString(),
            status: 'new',
            notes: noteEntry,
          });
        }
      }
    }

    return Response.json({ status: 'ok', processed, matched });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});