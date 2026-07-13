import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const EPIDEMIC_BASE = 'https://www.epidemicsound.com/api';
const EPIDEMIC_API_VERSION = 'v0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action = 'search', term, trackId, format = 'mp3', mood, genre } = body;
    const apiKey = Deno.env.get('EPIDEMIC_API_KEY');
    if (!apiKey) return Response.json({ error: 'EPIDEMIC_API_KEY secret not set' }, { status: 500 });

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };

    if (action === 'search') {
      const params = new URLSearchParams();
      if (term) params.append('term', term);
      if (mood) params.append('mood', mood);
      if (genre) params.append('genre', genre);
      const url = `${EPIDEMIC_BASE}/${EPIDEMIC_API_VERSION}/tracks/search?${params.toString()}`;
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return Response.json(data);

    } else if (action === 'download') {
      if (!trackId) return Response.json({ error: 'trackId required for download' }, { status: 400 });
      const url = `${EPIDEMIC_BASE}/${EPIDEMIC_API_VERSION}/tracks/${trackId}/download?format=${format}`;
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return Response.json(data);

    } else if (action === 'collections') {
      const url = `${EPIDEMIC_BASE}/${EPIDEMIC_API_VERSION}/collections`;
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return Response.json(data);
    }

    return Response.json({ error: 'Unknown action: ' + action }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});