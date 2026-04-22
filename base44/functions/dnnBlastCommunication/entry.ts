import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { communication_id, target_tier } = await req.json();
    if (!communication_id) {
      return Response.json({ error: 'communication_id is required' }, { status: 400 });
    }

    // Fetch the communication
    const comm = await base44.asServiceRole.entities.DnnCommunication.get(communication_id);
    if (!comm) {
      return Response.json({ error: 'Communication not found' }, { status: 404 });
    }

    // Fetch subscribers
    const allSubs = await base44.asServiceRole.entities.DnnSubscriber.list('-created_date', 10000);
    const tier = target_tier || comm.target_tier || 'all';
    const subs = allSubs.filter(s => {
      if (s.unsubscribed) return false;
      if (!s.email) return false;
      if (tier === 'all') return true;
      return s.tier === tier;
    });

    if (subs.length === 0) {
      return Response.json({ success: true, sent: 0, message: 'No eligible subscribers found.' });
    }

    // Build email HTML
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${comm.subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Georgia',serif;">
  <div style="max-width:600px;margin:0 auto;background:#0a0a0a;padding:40px 32px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(212,175,55,0.3);">
      <p style="color:#D4AF37;font-size:11px;letter-spacing:0.3em;font-family:'Arial',sans-serif;margin:0 0 8px;">DYSON NEWS NETWORK</p>
      <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.2em;font-family:'Arial',sans-serif;margin:0;">INTELLIGENCE BUREAU</p>
    </div>

    <!-- Body -->
    <div style="color:#e5e5e5;font-size:16px;line-height:1.8;white-space:pre-line;">${comm.body}</div>

    <!-- CTA Button -->
    <div style="text-align:center;margin:36px 0;">
      <a href="https://dysonrelo.com" 
         style="background:linear-gradient(135deg,#e8c84a,#D4AF37,#b8920a);color:#000;font-weight:bold;font-size:14px;letter-spacing:0.1em;padding:14px 32px;border-radius:40px;text-decoration:none;display:inline-block;font-family:'Arial',sans-serif;">
        SECURE MY DNN INTELLIGENCE ACCESS
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
      <p style="color:rgba(255,255,255,0.35);font-size:11px;font-family:'Arial',sans-serif;line-height:1.6;margin:0;">
        Dyson News Network · Dyson & Dyson Companies, Inc. · CA DRE #02303118<br>
        <a href="https://dysonrelo.com/unsubscribe" style="color:rgba(212,175,55,0.5);text-decoration:none;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`;

    // Send in batches of 10 with small delay
    let sent = 0;
    let failed = 0;
    const BATCH = 10;

    for (let i = 0; i < subs.length; i += BATCH) {
      const chunk = subs.slice(i, i + BATCH);
      await Promise.all(chunk.map(async (sub) => {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: sub.email,
            subject: comm.subject,
            body: htmlBody,
            from_name: 'Bob Dyson — DNN',
          });
          sent++;
        } catch (err) {
          console.error(`Failed to send to ${sub.email}:`, err.message);
          failed++;
        }
      }));
      if (i + BATCH < subs.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // Update communication record
    await base44.asServiceRole.entities.DnnCommunication.update(communication_id, {
      status: 'blasted',
      blast_count: sent,
      blasted_at: new Date().toISOString(),
      blasted_by: user.email,
    });

    return Response.json({ success: true, sent, failed, total: subs.length });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});