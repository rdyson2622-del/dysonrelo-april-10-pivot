import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * pipelineCreditsMonitor — Aggregates live balances + usage for every paid
 * node in the DNN n8n production pipeline so admins can see financial input
 * across the whole chain in one place.
 *
 * Returns:
 *  {
 *    heygen:   { available, remaining_quota, plan_credit, total, error },
 *    twilio:   { available, balance, currency, error },
 *    creatomate: { available: false, note, dashboard_url, in_progress, completed_this_month },
 *    gemini:   { available: false, note, dashboard_url, articles_today },
 *    epidemic: { available: false, note, dashboard_url }
 *  }
 *
 * HeyGen + Twilio expose live balance APIs; Creatomate, Gemini, and Epidemic
 * do not — for those we return a dashboard link plus usage counts pulled from
 * the database so the admin still has visibility into pipeline throughput.
 *
 * Auth: admin session.
 */

function basicAuth(user, pass) {
  const raw = `${user}:${pass}`;
  const bytes = new TextEncoder().encode(raw);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return 'Basic ' + btoa(bin);
}

function isThisMonth(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
}
function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate();
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── HeyGen live quota ──────────────────────────────────────────────────
    let heygen = { available: false, remaining_quota: 0, plan_credit: 0, total: 0, error: null };
    try {
      const heygenKey = secrets.get('HEYGEN_API_KEY');
      if (heygenKey) {
        const res = await fetch('https://api.heygen.com/v2/user/remaining_quota', {
          headers: { 'X-Api-Key': heygenKey },
        });
        const raw = await res.json();
        const data = raw?.data ?? raw;
        if (res.ok) {
          const remaining = Number(data?.remaining_quota ?? 0);
          const plan = Number(data?.details?.plan_credit ?? 0);
          heygen = {
            available: true,
            remaining_quota: remaining,
            plan_credit: plan,
            total: remaining + plan,
            error: null,
          };
        } else {
          heygen.error = raw?.error?.message || 'HeyGen request failed';
        }
      } else {
        heygen.error = 'HEYGEN_API_KEY not set';
      }
    } catch (e) {
      heygen.error = e.message;
    }

    // ── Twilio live balance ────────────────────────────────────────────────
    let twilio = { available: false, balance: null, currency: null, error: null };
    try {
      const sid = secrets.get('TWILIO_ACCOUNT_SID');
      const token = secrets.get('TWILIO_AUTH_TOKEN');
      if (sid && token) {
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Balance.json`, {
          headers: { Authorization: basicAuth(sid, token) },
        });
        const data = await res.json();
        if (res.ok) {
          twilio = {
            available: true,
            balance: parseFloat(data.balance),
            currency: data.currency || 'USD',
            error: null,
          };
        } else {
          twilio.error = data?.message || 'Twilio request failed';
        }
      } else {
        twilio.error = 'Twilio credentials not set';
      }
    } catch (e) {
      twilio.error = e.message;
    }

    // ── Database usage counts for dashboard-only services ──────────────────
    const broadcasts = await base44.asServiceRole.entities.DnnBroadcast.list('-created_date', 200);
    const creatomateInProgress = broadcasts.filter(b =>
      b.compositedVideoUrl && String(b.compositedVideoUrl).startsWith('creatomate:pending:')
    ).length;
    const creatomateCompletedThisMonth = broadcasts.filter(b =>
      b.compositedVideoUrl &&
      !String(b.compositedVideoUrl).startsWith('creatomate:pending:') &&
      isThisMonth(b.published_at || b.updated_date)
    ).length;

    const articles = await base44.asServiceRole.entities.DnnArticle.list('-created_date', 100);
    const articlesToday = articles.filter(a => isToday(a.generated_date || a.created_date)).length;

    const creatomate = {
      available: false,
      note: 'Creatomate exposes no balance API — credits are viewable in the dashboard API Log only.',
      dashboard_url: 'https://creatomate.com/dashboard/api-log',
      in_progress: creatomateInProgress,
      completed_this_month: creatomateCompletedThisMonth,
    };
    const gemini = {
      available: false,
      note: 'Google AI usage is billed via Google Cloud — no simple balance endpoint.',
      dashboard_url: 'https://aistudio.google.com/usage',
      articles_today: articlesToday,
    };
    const epidemic = {
      available: false,
      note: 'Epidemic Sound is a flat subscription — no per-call balance to monitor.',
      dashboard_url: 'https://www.epidemicsound.com/your-subscription/',
    };

    return Response.json({
      heygen,
      twilio,
      creatomate,
      gemini,
      epidemic,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}