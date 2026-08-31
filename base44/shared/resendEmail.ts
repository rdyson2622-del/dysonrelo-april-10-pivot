import { secrets } from 'base44:runtime';

/**
 * sendViaResend — sends email through Resend instead of Base44's built-in
 * SendEmail integration. Used for cold B2B outreach (e.g. listing agents)
 * that needs to scale well beyond Base44's shared-infra sending limits,
 * using our own authenticated domain (dysonrelo.com) and its own reputation.
 */
export async function sendViaResend({ to, subject, html, from }: { to: string; subject: string; html: string; from?: string }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secrets.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from || 'Dyson Relo <bob@dysonrelo.com>',
      to,
      subject,
      html,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Resend request failed');
  }
  return data;
}