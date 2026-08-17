import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import {
  resolveBoldtrailApiBase,
  boldtrailGetCollection,
  BOLDTRAIL_CRM_API_BASE,
  BOLDTRAIL_BACKOFFICE_API_BASE,
} from '../../shared/boldtrailSync.ts';

/**
 * Diagnose the Wisdom Properties BoldTrail link without exposing secret values.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const token = (secrets.get('BOLDTRAIL_API_TOKEN') || '').trim();
    const resolved = resolveBoldtrailApiBase(secrets.get('BOLDTRAIL_API_BASE_URL'));

    const probes = [];
    if (token) {
      probes.push(await labeledProbe('backoffice_transactions', BOLDTRAIL_BACKOFFICE_API_BASE, '/transactions', token));
      probes.push(await labeledProbe('crm_contacts', BOLDTRAIL_CRM_API_BASE, '/contacts', token));
      if (resolved.baseUrl !== BOLDTRAIL_BACKOFFICE_API_BASE && resolved.baseUrl !== BOLDTRAIL_CRM_API_BASE) {
        probes.push(await labeledProbe('configured_transactions', resolved.baseUrl, '/transactions', token));
        probes.push(await labeledProbe('configured_deals', resolved.baseUrl, '/deals', token));
      }
    }

    const backoffice_live = probes.some((p) => p.id === 'backoffice_transactions' && p.ok);
    const crm_live = probes.some((p) => p.id === 'crm_contacts' && p.ok);
    const link_live = backoffice_live || probes.some((p) => p.ok && p.path.includes('transaction'));

    const next_steps = [];
    if (!token) {
      next_steps.push(
        'Get the Wisdom BoldTrail Back Office API key (Admin → API settings, or email support@brokermint.com) and paste it as BOLDTRAIL_API_TOKEN in Base44 → Settings → Secrets.'
      );
    }
    if (!resolved.configured || resolved.invalid || resolved.flavor !== 'backoffice') {
      next_steps.push(
        `Set BOLDTRAIL_API_BASE_URL to exactly ${BOLDTRAIL_BACKOFFICE_API_BASE} (Wisdom escrow/docs). Do not use api.boldtrail.com — that host 403s.`
      );
    }
    if (token && crm_live && !backoffice_live) {
      next_steps.push(
        'This token is a Lead Engine / CRM JWT. It can read contacts but not Back Office transactions. Generate a Brokermint/Back Office API key and replace BOLDTRAIL_API_TOKEN.'
      );
    }
    if (token && !crm_live && !backoffice_live) {
      next_steps.push(
        'Token was rejected by both Back Office (/transactions) and CRM (/contacts). Confirm it is the current Wisdom API key and was saved without extra spaces or quotes.'
      );
    }
    if (link_live && next_steps.length === 0) {
      next_steps.push('Back Office link is live. Use Sync Now on Escrow or pull an escrow # on Doc Audit.');
    }

    return Response.json({
      status: link_live ? 'ok' : (token ? 'auth_failed' : 'secrets_incomplete'),
      official_base_url: BOLDTRAIL_BACKOFFICE_API_BASE,
      crm_base_url: BOLDTRAIL_CRM_API_BASE,
      token_present: Boolean(token),
      token_length: token.length,
      token_looks_like_jwt: token.split('.').length === 3,
      base_url_secret_present: resolved.configured,
      base_url_secret_invalid: resolved.invalid,
      resolved_base_url: resolved.baseUrl,
      resolved_from: resolved.source,
      resolved_flavor: resolved.flavor,
      probes,
      backoffice_live,
      crm_live,
      link_live,
      next_steps,
      portal_steps: {
        backoffice_token: [
          'Log into Wisdom Properties BoldTrail Back Office as a company admin.',
          'Admin → API settings (or email support@brokermint.com if the key is not shown).',
          'Copy the Back Office API key.',
        ],
        crm_token_not_for_escrow: [
          'Lead Engine → Lead Dropbox → My API Tokens is the CRM JWT.',
          'That token is for contacts/users only. It will not pull escrow or transaction docs.',
        ],
        base44_secrets: [
          'Open the DysonRelo app on Base44.com → Settings → Secrets.',
          `Set BOLDTRAIL_API_BASE_URL = ${BOLDTRAIL_BACKOFFICE_API_BASE}`,
          'Set BOLDTRAIL_API_TOKEN = the Back Office API key.',
          'Save. Then Re-check on /admin/wisdom/escrow.',
        ],
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function labeledProbe(id, host, path, token) {
  const result = await boldtrailGetCollection(host, token, path);
  return {
    id,
    host,
    path,
    status: result.status,
    ok: result.ok,
    auth: result.auth,
    record_count: result.ok ? result.items.length : null,
    hint: result.ok
      ? 'Accepted the token'
      : result.status === 401
        ? '401 — token rejected on this host'
        : result.status === 404
          ? '404 — path not on this API'
          : result.detail || `HTTP ${result.status}`,
  };
}
