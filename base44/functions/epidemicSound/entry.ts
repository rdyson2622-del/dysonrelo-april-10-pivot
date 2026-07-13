import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const EPIDEMIC_BASE = 'https://partner-content-api.epidemicsound.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action = 'search', term, trackId, format = 'mp3', quality = 'normal', limit = 20, offset = 0 } = body;
    const apiKey = Deno.env.get('EPIDEMIC_API_KEY');
    if (!apiKey) return Response.json({ error: 'EPIDEMIC_API_KEY secret not set' }, { status: 500 });

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };

    if (action === 'search') {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (term) params.append('term', term);
      const url = `${EPIDEMIC_BASE}/v0/tracks/search?${params.toString()}`;
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return Response.json(data);

    } else if (action === 'download') {
      if (!trackId) return Response.json({ error: 'trackId required for download' }, { status: 400 });
      const url = `${EPIDEMIC_BASE}/v0/tracks/${trackId}/download?format=${format}&quality=${quality}`;
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return Response.json(data);

    } else if (action === 'collections') {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const url = `${EPIDEMIC_BASE}/v0/collections?${params.toString()}`;
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return Response.json(data);
    }

    return Response.json({ error: 'Unknown action: ' + action }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});