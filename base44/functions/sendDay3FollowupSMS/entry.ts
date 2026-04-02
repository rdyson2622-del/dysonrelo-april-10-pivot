import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Sends Day 3 follow-up SMS to owners who haven't replied to initial outreach
// Runs once daily via scheduled automation
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    // Allow admin users or scheduled automation
    if (user?.role !== 'admin' && !req.headers.get('x-scheduled-automation')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all campaigns still in 'outreach' stage (no response yet)
    const campaigns = await base44.asServiceRole.entities.OwnerOutreachCampaign.filter({
      workflow_stage: 'outreach',
    });

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    const messagingSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');

    if (!messagingSid) {
      return Response.json({ error: 'TWILIO_MESSAGING_SERVICE_SID not configured' }, { status: 400 });
    }

    // Fetch the Day 3 SMS template
    const templates = await base44.asServiceRole.entities.MessageTemplate.filter({
      name: 'Owner Outreach SMS #2 - Day 3',
    });

    if (!templates.length) {
      return Response.json({ error: 'Day 3 SMS template not found' }, { status: 404 });
    }

    const templateContent = templates[0].content;
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const results = [];
    const now = new Date();

    for (const campaign of campaigns) {
      if (!campaign.owner_phone || !campaign.listing_owner_id) continue;

      // Check if SMS was sent ~3 days ago (between 2.5 and 3.5 days)
      const sentDate = new Date(campaign.sms_sent_date);
      const daysSinceSent = (now - sentDate) / (1000 * 60 * 60 * 24);

      // Only send Day 3 if it's been 2.5-3.5 days (window to avoid duplicates)
      if (daysSinceSent < 2.5 || daysSinceSent > 3.5) {
        continue;
      }

      // Check if Day 3 already sent (look for marker in notes)
      if (campaign.notes && campaign.notes.includes('Day 3 follow-up sent')) {
        continue;
      }

      // Prepare Day 3 message
      let messageBody = templateContent.replace(/\{\{owner_name\}\}/g, campaign.owner_name || 'there');

      // Schedule 5 minutes in future
      const sendAt = new Date(now.getTime() + 5 * 60 * 1000);
      const sendAtISO = sendAt.toISOString().replace('Z', '+0000');

      const formData = new URLSearchParams();
      formData.append('To', campaign.owner_phone);
      formData.append('From', fromNumber);
      formData.append('Body', messageBody);
      formData.append('SendAt', sendAtISO);
      formData.append('ScheduleType', 'fixed');
      formData.append('MessagingServiceSid', messagingSid);

      try {
        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        const result = await response.json();

        if (!response.ok) {
          results.push({
            campaign_id: campaign.id,
            owner_name: campaign.owner_name,
            status: 'failed',
            error: result.message,
          });
          continue;
        }

        // Mark as sent in notes
        await base44.asServiceRole.entities.OwnerOutreachCampaign.update(campaign.id, {
          notes: (campaign.notes || '') + `\n[${new Date().toLocaleString()}] Day 3 follow-up sent (Message SID: ${result.sid}).`,
        });

        results.push({
          campaign_id: campaign.id,
          owner_name: campaign.owner_name,
          status: 'queued',
          message_sid: result.sid,
        });

      } catch (err) {
        results.push({
          campaign_id: campaign.id,
          owner_name: campaign.owner_name,
          status: 'failed',
          error: err.message,
        });
      }
    }

    const sent = results.filter(r => r.status === 'queued').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return Response.json({
      success: true,
      checked: campaigns.length,
      sent,
      failed,
      results,
    });

  } catch (error) {
    console.error('Day 3 follow-up error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});