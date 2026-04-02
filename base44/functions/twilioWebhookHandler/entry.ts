import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Handles Twilio Status Callbacks and Inbound SMS
// Twilio sends: MessageStatus (delivered, failed, etc.) and Message (inbound replies)
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.text();
    const params = new URLSearchParams(body);

    // Verify it's from Twilio (basic check - in production, verify the signature)
    const messageStatus = params.get('MessageStatus');
    const messageSid = params.get('MessageSid');
    const from = params.get('From');
    const to = params.get('To');
    const body_text = params.get('Body');
    const errorCode = params.get('ErrorCode');
    const errorMessage = params.get('ErrorMessage');

    const base44 = createClientFromRequest(req);

    // Normalize phone numbers (remove + and country code for matching)
    const normalizePhone = (phone) => phone ? phone.replace(/\D/g, '').slice(-10) : '';
    const fromNormalized = normalizePhone(from);
    const toNormalized = normalizePhone(to);

    // Try to find the listing owner by phone
    const owners = await base44.asServiceRole.entities.ListingOwner.filter({});
    const owner = owners.find(o => normalizePhone(o.phone) === fromNormalized);

    if (!owner) {
      console.log(`No owner found for phone ${from}`);
      return Response.json({ success: false, reason: 'owner_not_found' });
    }

    // Handle inbound SMS (reply from owner)
    if (body_text && !messageStatus) {
      console.log(`Inbound SMS from ${from}: ${body_text}`);

      // Update ListingOwner contact_status
      await base44.asServiceRole.entities.ListingOwner.update(owner.id, {
        contact_status: 'in_conversation',
        last_contacted: new Date().toISOString().split('T')[0],
      });

      // Find or create OwnerOutreachCampaign
      const campaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({
        listing_owner_id: owner.id,
      });

      if (campaigns.length > 0) {
        // Update existing campaign with reply
        await base44.asServiceRole.entities.OwnerOutreachCampaign.update(campaigns[0].id, {
          response_date: new Date().toISOString(),
          workflow_stage: 'response',
          notes: (campaigns[0].notes || '') + `\n[${new Date().toLocaleString()}] Owner replied: "${body_text}"`,
        });
      } else {
        // Create new campaign record for this reply
        await base44.asServiceRole.entities.OwnerOutreachCampaign.create({
          listing_owner_id: owner.id,
          owner_name: owner.owner_name,
          owner_phone: owner.phone,
          property_address: owner.property_address || '',
          workflow_stage: 'response',
          response_date: new Date().toISOString(),
          notes: `[${new Date().toLocaleString()}] Owner replied: "${body_text}"`,
        });
      }

      return Response.json({ success: true, type: 'inbound_sms', owner_id: owner.id });
    }

    // Handle message status updates (delivered, failed, etc.)
    if (messageStatus) {
      console.log(`Message ${messageSid} status: ${messageStatus}`);

      // Find campaign by message tracking (we'd need to store messageSid in DB for this)
      // For now, we'll update based on recent outreach
      const campaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({
        listing_owner_id: owner.id,
      });

      if (campaigns.length > 0) {
        const campaign = campaigns[0];
        let statusNote = '';

        if (messageStatus === 'delivered') {
          statusNote = `✓ Message delivered at ${new Date().toLocaleString()}`;
          await base44.asServiceRole.entities.ListingOwner.update(owner.id, {
            contact_status: 'contacted',
          });
        } else if (messageStatus === 'failed') {
          statusNote = `✗ Message failed: ${errorMessage || 'Unknown error'} (Code: ${errorCode})`;
          await base44.asServiceRole.entities.ListingOwner.update(owner.id, {
            contact_status: 'not_interested', // Mark failed attempts as not interested
          });
        } else if (messageStatus === 'read') {
          statusNote = `👁️ Message read at ${new Date().toLocaleString()}`;
        } else if (messageStatus === 'undelivered') {
          statusNote = `⚠️ Message undelivered`;
        }

        if (statusNote) {
          await base44.asServiceRole.entities.OwnerOutreachCampaign.update(campaign.id, {
            notes: (campaign.notes || '') + `\n[${new Date().toLocaleString()}] ${statusNote}`,
          });
        }
      }

      return Response.json({ success: true, type: 'message_status', status: messageStatus, owner_id: owner.id });
    }

    return Response.json({ success: false, reason: 'no_status_or_body' });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});