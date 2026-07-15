import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch broadcast video clips
    let segments = [];
    try {
      const clips = await base44.asServiceRole.entities.DnnNewsClip.list(undefined, 200);
      const byArticle = {};
      for (const c of clips) {
        const key = c.question || 'Other';
        if (!byArticle[key]) byArticle[key] = [];
        byArticle[key].push(c);
      }
      for (const headline of Object.keys(byArticle)) {
        const articleClips = byArticle[headline].sort((a, b) => (a.faqIndex || 0) - (b.faqIndex || 0));
        const allReady = articleClips.every(c =>
          c.charlieVideoUrl && (!c.bobScript || c.bobVideoUrl)
        );
        if (!allReady) continue;
        for (const c of articleClips) {
          if (c.kind === 'qa') {
            if (c.bobVideoUrl) {
              segments.push({ src: c.bobVideoUrl, speaker: 'bob', title: c.question });
            }
          } else {
            segments.push({ src: c.charlieVideoUrl, speaker: 'charlie' });
          }
        }
      }
    } catch (e) {
      // If clips can't be fetched, continue with empty segments
    }

    const ogTitle = "DNN Intelligence Bureau — Daily Relocation Broadcast";
    const ogDescription = "Charlie Simmons and Bob Dyson break down today's top relocation and real estate intelligence. Watch the full broadcast.";
    const ogImage = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

    // Build video segments JSON for the player
    const segmentsJson = JSON.stringify(segments);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${ogTitle}</title>
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDescription}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="https://dysonrelo.com/api/functions/broadcastShowMeta" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Dyson Relo" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="627" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDescription}" />
  <meta name="twitter:image" content="${ogImage}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; }
    #player { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
    #video { max-width: 100%; max-height: 100%; }
    .controls { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; gap: 24px; padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
    .controls button { background: none; border: none; color: #D4AF37; cursor: pointer; font-size: 24px; padding: 8px; }
    .controls button:hover { transform: scale(1.1); }
    .badge { position: fixed; top: 16px; left: 16px; display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: rgba(0,0,0,0.65); border: 1px solid rgba(212,175,55,0.4); border-radius: 8px; backdrop-filter: blur(4px); }
    .badge .dot { width: 8px; height: 8px; border-radius: 50%; background: #D4AF37; animation: pulse 1.5s infinite; }
    .badge .label { font-size: 10px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: #D4AF37; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    .close-btn { position: fixed; top: 16px; right: 16px; width: 48px; height: 48px; border-radius: 50%; background: rgba(0,0,0,0.6); border: 1px solid #D4AF37; color: #D4AF37; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; }
    .overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); }
    .overlay .play-btn { width: 80px; height: 80px; border-radius: 50%; background: rgba(0,0,0,0.65); border: 2px solid #D4AF37; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .overlay .play-btn span { font-size: 32px; color: #D4AF37; margin-left: 4px; }
  </style>
</head>
<body>
  <div id="player">
    <video id="video" playsinline></video>
  </div>
  <div class="badge" id="badge">
    <span class="dot"></span>
    <span class="label" id="speaker-label">DNN</span>
  </div>
  <button class="close-btn" onclick="window.location.href='https://dysonrelo.com/'">&times;</button>
  <div class="controls">
    <button id="play-pause" onclick="togglePlay()">&#9658;</button>
    <button id="mute-btn" onclick="toggleMute()">&#128264;</button>
    <button onclick="replay()">&#8635;</button>
  </div>
  <div class="overlay" id="overlay">
    <div class="play-btn" onclick="startPlay()"><span>&#9658;</span></div>
  </div>

  <script>
    const segments = ${segmentsJson};
    let idx = 0;
    let video = document.getElementById('video');
    let overlay = document.getElementById('overlay');
    let speakerLabel = document.getElementById('speaker-label');
    let playPauseBtn = document.getElementById('play-pause');

    const SPEAKER_LABELS = {
      charlie: 'CHARLIE · DYSON AI CONCIERGE',
      bob: 'BOB DYSON · FOUNDER',
      sting: 'DNN'
    };

    function loadSegment() {
      if (idx >= segments.length) {
        speakerLabel.textContent = 'DNN';
        video.style.display = 'none';
        return;
      }
      const seg = segments[idx];
      video.src = seg.src;
      video.style.display = 'block';
      speakerLabel.textContent = SPEAKER_LABELS[seg.speaker] || 'DNN';
      video.load();
      video.muted = false;
      video.play().then(() => {
        overlay.style.display = 'none';
        playPauseBtn.innerHTML = '&#10074;&#10074;';
      }).catch(() => {
        video.muted = true;
        video.play().then(() => {
          overlay.style.display = 'none';
          playPauseBtn.innerHTML = '&#10074;&#10074;';
        }).catch(() => {});
      });
    }

    function startPlay() {
      video.muted = false;
      video.play().then(() => {
        overlay.style.display = 'none';
        playPauseBtn.innerHTML = '&#10074;&#10074;';
      }).catch(() => {
        video.muted = true;
        video.play().then(() => {
          overlay.style.display = 'none';
          playPauseBtn.innerHTML = '&#10074;&#10074;';
        }).catch(() => {});
      });
    }

    function togglePlay() {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '&#10074;&#10074;';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '&#9658;';
      }
    }

    function toggleMute() {
      video.muted = !video.muted;
      document.getElementById('mute-btn').innerHTML = video.muted ? '&#128263;' : '&#128264;';
    }

    function replay() {
      idx = 0;
      loadSegment();
    }

    video.addEventListener('ended', () => {
      idx++;
      if (idx < segments.length) {
        loadSegment();
      } else {
        speakerLabel.textContent = 'DNN · BROADCAST COMPLETE';
        setTimeout(() => window.location.href = 'https://dysonrelo.com/', 3000);
      }
    });

    if (segments.length === 0) {
      document.getElementById('player').innerHTML = '<div style="text-align:center;"><p style="color:#D4AF37;font-size:14px;font-weight:bold;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">DNN Intelligence Bureau</p><p style="color:#64748b;font-size:12px;">No broadcast available at this time.</p></div>';
      overlay.style.display = 'none';
    } else {
      loadSegment();
    }
  </script>
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