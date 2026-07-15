import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const ogTitle = "DNN Intelligence Bureau — Daily Relocation Broadcast";
    const ogDescription = "Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence. Watch the full broadcast.";
    const ogImage = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
    const broadcastUrl = "https://dysonrelo.com/broadcast-show";
    const canonicalUrl = "https://dysonrelo.com/api/functions/broadcastShowMeta";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${ogTitle}</title>
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDescription}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Dyson Relo" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="627" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDescription}" />
  <meta name="twitter:image" content="${ogImage}" />
</head>
<body>
  <p>Redirecting to broadcast…</p>
  <script>window.location.href = "https://dysonrelo.com/broadcast-show";</script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});