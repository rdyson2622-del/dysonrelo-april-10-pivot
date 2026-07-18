import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY');
    const headers = { 'X-Api-Key': HEYGEN_API_KEY };

    // 1. Get Show #4 record
    const shows = await base44.asServiceRole.entities.DnnBroadcast.list('-show_number', 20);
    const show4 = shows.find(s => s.show_number === 4);
    if (!show4) return Response.json({ error: 'Show 4 not found' }, { status: 404 });

    // 2. Fetch HeyGen CDN URL for the July 17 render ID
    const heygenId = show4.heygenId;
    const statusRes = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${heygenId}`, { headers });
    const statusData = await statusRes.json();
    const cdnUrl = statusData?.data?.video_url;
    const cdnDuration = statusData?.data?.duration;

    // 3. Download CDN video, check byte size
    const cdnRes = await fetch(cdnUrl);
    const cdnBuf = await cdnRes.arrayBuffer();
    const cdnBytes = cdnBuf.byteLength;

    // 4. Download stored video, check byte size
    const storedRes = await fetch(show4.videoUrl);
    const storedBuf = await storedRes.arrayBuffer();
    const storedBytes = storedBuf.byteLength;

    // 5. Compare first 500 bytes (header) to confirm same file
    const cdnHead = new Uint8Array(cdnBuf.slice(0, 500));
    const storedHead = new Uint8Array(storedBuf.slice(0, 500));
    let headerMatch = true;
    for (let i = 0; i < 500; i++) {
      if (cdnHead[i] !== storedHead[i]) { headerMatch = false; break; }
    }

    return Response.json({
      show4: {
        id: show4.id,
        show_name: show4.show_name,
        heygenId: show4.heygenId,
        videoUrl: show4.videoUrl,
        needsReRender: show4.needsReRender,
        broadcast_date: show4.broadcast_date,
      },
      heygen_cdn: {
        video_id: heygenId,
        duration: cdnDuration,
        cdn_bytes: cdnBytes,
      },
      stored_file: {
        url: show4.videoUrl,
        stored_bytes: storedBytes,
      },
      verification: {
        byte_size_match: cdnBytes === storedBytes,
        header_match: headerMatch,
        same_file: cdnBytes === storedBytes && headerMatch,
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});