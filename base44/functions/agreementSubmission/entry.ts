import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const APP_URL = 'https://dyson-relo-april-10-pivot-5ef050c4.base44.app';

const PUBLIC_FIELDS = [
  'id', 'token', 'client_name', 'corporate_sponsor', 'effective_date', 'origin_market', 'destination_market',
  'referral_fee_pct', 'relocation_fee_pct', 'special_commitments',
  'referring_broker_name', 'referring_broker_license', 'referring_agent_name', 'referring_agent_license',
  'referring_company', 'referring_email', 'referring_phone', 'referring_signature_name', 'referring_completed',
  'receiving_broker_name', 'receiving_broker_license', 'receiving_agent_name', 'receiving_agent_license',
  'receiving_company', 'receiving_email', 'receiving_phone', 'receiving_signature_name', 'receiving_completed',
];

function pickPublic(record) {
  const out = {};
  for (const key of PUBLIC_FIELDS) out[key] = record[key];
  return out;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const action = body.action;

    if (action === 'create') {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 403 });

      const token = crypto.randomUUID();
      const record = await base44.entities.ReferralAgreementSubmission.create({
        token,
        client_name: body.client_name || '',
        corporate_sponsor: body.corporate_sponsor || '',
        effective_date: body.effective_date || '',
        origin_market: body.origin_market || '',
        destination_market: body.destination_market || '',
        referral_fee_pct: body.referral_fee_pct || 25,
        relocation_fee_pct: body.relocation_fee_pct || 25,
        special_commitments: body.special_commitments || '',
        admin_email: user.email,
      });
      return Response.json({ record });
    }

    if (action === 'send') {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 403 });

      const { id, role, email, name } = body;
      if (!id || !role || !email) return Response.json({ error: 'Missing id, role, or email' }, { status: 400 });
      if (role !== 'referring' && role !== 'receiving') return Response.json({ error: 'Invalid role' }, { status: 400 });

      const record = await base44.entities.ReferralAgreementSubmission.get(id);
      if (!record) return Response.json({ error: 'Submission not found' }, { status: 404 });

      const now = new Date().toISOString();
      await base44.entities.ReferralAgreementSubmission.update(id, {
        [`sent_${role}_at`]: now,
        [`sent_${role}_email`]: email,
      });

      const link = `${APP_URL}/agreement-fill?token=${record.token}&role=${role}`;
      const roleLabel = role === 'referring' ? 'Referring Broker/Agent' : 'Receiving Broker/Agent';

      await base44.integrations.Core.SendEmail({
        to: email,
        subject: `Action Needed: Complete the Referral & Relocation Agreement — ${record.client_name || 'Client'}`,
        body: `Hi ${name || ''},\n\nThe Dyson & Dyson Companies, Inc. has sent you a Master Referral & Relocation Management Agreement to complete as the ${roleLabel} on the ${record.client_name || 'client'} file.\n\nPlease click the link below, fill in your information, and submit — no printing, scanning, or emailing required:\n\n${link}\n\nThank you,\nThe Dyson & Dyson Companies, Inc.`,
      });

      return Response.json({ success: true, link });
    }

    if (action === 'getByToken') {
      const { token, role } = body;
      if (!token || !role) return Response.json({ error: 'Missing token or role' }, { status: 400 });

      const matches = await base44.asServiceRole.entities.ReferralAgreementSubmission.filter({ token });
      const record = matches[0];
      if (!record) return Response.json({ error: 'Invalid or expired link' }, { status: 404 });

      return Response.json({ record: pickPublic(record) });
    }

    if (action === 'submit') {
      const { token, role, fields, signature_name } = body;
      if (!token || !role || !signature_name) return Response.json({ error: 'Missing required fields' }, { status: 400 });
      if (role !== 'referring' && role !== 'receiving') return Response.json({ error: 'Invalid role' }, { status: 400 });

      const matches = await base44.asServiceRole.entities.ReferralAgreementSubmission.filter({ token });
      const record = matches[0];
      if (!record) return Response.json({ error: 'Invalid or expired link' }, { status: 404 });

      const now = new Date().toISOString();
      const update = {
        ...fields,
        [`${role}_signature_name`]: signature_name,
        [`${role}_signed_at`]: now,
        [`${role}_completed`]: true,
      };
      await base44.asServiceRole.entities.ReferralAgreementSubmission.update(record.id, update);

      if (record.admin_email) {
        const roleLabel = role === 'referring' ? 'Referring Broker/Agent' : 'Receiving Broker/Agent';
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: record.admin_email,
          subject: `Agreement Completed: ${roleLabel} — ${record.client_name || 'Client'}`,
          body: `${signature_name} has completed and signed the agreement as the ${roleLabel} for ${record.client_name || 'the client'}.\n\nView it in the admin dashboard under Master Agreement > Sent Agreements.`,
        });
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}