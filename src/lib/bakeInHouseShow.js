import { base44 } from '@/api/base44Client';

const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const CHARLIE_HEADSHOT = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a0f097ef2_generated_image.png';
const BOB_HEADSHOT = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png';

const W = 1920;
const H = 1080;
const GOLD = '#D4AF37';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function synthesizeScene(text, speaker) {
  const res = await base44.functions.invoke('charlieSpeak', { text, speaker });
  const { audio, mimeType } = res?.data || {};
  if (!audio) throw new Error(res?.data?.error || `TTS failed for ${speaker}`);
  return { buffer: base64ToArrayBuffer(audio), mimeType: mimeType || 'audio/mpeg' };
}

function drawCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const br = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (ir > br) {
    sw = img.height * br;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / br;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawHostPlate(ctx, img, { x, y, w, h, label, active }) {
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.strokeStyle = active ? GOLD : 'rgba(212,175,55,0.45)';
  ctx.lineWidth = active ? 6 : 3;
  roundRectPath(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.stroke();
  ctx.clip();
  drawCover(ctx, img, x, y, w, h - 48);
  ctx.restore();

  ctx.fillStyle = '#111';
  ctx.fillRect(x, y + h - 48, w, 48);
  ctx.fillStyle = active ? '#ef4444' : '#64748b';
  ctx.beginPath();
  ctx.arc(x + 24, y + h - 24, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(label, x + 40, y + h - 18);
}

function drawFrame(ctx, assets, scene, headline, bullets) {
  const { bg, charlie, bob } = assets;
  drawCover(ctx, bg, 0, 0, W, H);

  // Headline card
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.strokeStyle = 'rgba(212,175,55,0.55)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, 40, 36, 1100, 110, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('DNN MORNING BRIEF', 64, 78);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px system-ui, sans-serif';
  const title = (headline || 'DNN Morning Intelligence').slice(0, 64);
  ctx.fillText(title, 64, 122);

  const charlieActive = scene.role === 'charlie';
  const bobActive = scene.role === 'bob';

  if (bobActive && bullets?.length) {
    const bx = 520;
    const by = 200;
    const bw = 880;
    const bh = 360;
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4;
    roundRectPath(ctx, bx, by, bw, bh, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#111';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText('SOLUTIONS DESK', bx + 28, by + 48);
    ctx.font = '600 28px system-ui, sans-serif';
    bullets.slice(0, 5).forEach((b, i) => {
      ctx.fillText(`• ${String(b).slice(0, 70)}`, bx + 28, by + 110 + i * 44);
    });
  }

  drawHostPlate(ctx, charlie, {
    x: 48,
    y: 520,
    w: 360,
    h: 500,
    label: 'CHARLIE SIMMONS · DNN NEWS DESK',
    active: charlieActive,
  });
  drawHostPlate(ctx, bob, {
    x: W - 408,
    y: 520,
    w: 360,
    h: 500,
    label: 'BOB DYSON · REPORTING',
    active: bobActive,
  });

  // On-air badge
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  roundRectPath(ctx, W / 2 - 160, H - 70, 320, 40, 20);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${scene.label} · IN-HOUSE`, W / 2, H - 44);
  ctx.textAlign = 'left';
}

/**
 * Bake an in-house morning show to a CDN video URL (WebM).
 * Writes compositedVideoUrl when broadcastId is provided.
 */
export async function bakeInHouseShow({
  introScript,
  contentScript,
  outroScript,
  bullets = [],
  headline = 'DNN Morning Intelligence',
  broadcastId = null,
  onProgress = () => {},
}) {
  if (typeof window === 'undefined') {
    throw new Error('bakeInHouseShow must run in the browser');
  }

  onProgress({ phase: 'assets', message: 'Loading studio assets…' });
  const [bg, charlie, bob] = await Promise.all([
    loadImage(STUDIO_BG),
    loadImage(CHARLIE_HEADSHOT),
    loadImage(BOB_HEADSHOT),
  ]);
  const assets = { bg, charlie, bob };

  const scenes = [
    { id: 'intro', role: 'charlie', label: 'CHARLIE OPEN', text: introScript, speaker: 'charlie' },
    { id: 'content', role: 'bob', label: 'BOB REPORT', text: contentScript, speaker: 'bob' },
    { id: 'outro', role: 'charlie', label: 'CHARLIE CLOSE', text: outroScript, speaker: 'charlie' },
  ].filter((s) => (s.text || '').trim());

  if (!scenes.length) throw new Error('No scripts to bake');

  onProgress({ phase: 'tts', message: 'Synthesizing Charlie & Bob voices…' });
  const prepared = [];
  for (const scene of scenes) {
    onProgress({ phase: 'tts', message: `TTS · ${scene.label}` });
    const audio = await synthesizeScene(scene.text, scene.speaker);
    prepared.push({ ...scene, audio });
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  const canvasStream = canvas.captureStream(30);
  const combined = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
    ? 'video/webm;codecs=vp9,opus'
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      ? 'video/webm;codecs=vp8,opus'
      : 'video/webm';

  const chunks = [];
  const recorder = new MediaRecorder(combined, { mimeType, videoBitsPerSecond: 6_000_000 });
  recorder.ondataavailable = (e) => {
    if (e.data?.size) chunks.push(e.data);
  };

  const recorded = new Promise((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = () => reject(new Error('MediaRecorder failed'));
  });

  onProgress({ phase: 'record', message: 'Recording studio MP4/WebM…' });
  recorder.start(250);

  // Brief slate
  drawFrame(ctx, assets, { role: 'charlie', label: 'DNN STAND BY' }, headline, bullets);
  await new Promise((r) => setTimeout(r, 800));

  for (const scene of prepared) {
    onProgress({ phase: 'record', message: `Recording · ${scene.label}` });
    const decoded = await audioCtx.decodeAudioData(scene.audio.buffer.slice(0));
    const source = audioCtx.createBufferSource();
    source.buffer = decoded;
    source.connect(dest);
    // Also connect silently to speakers optional — keep bake silent for operator
    const gain = audioCtx.createGain();
    gain.gain.value = 0.0001;
    source.connect(gain);
    gain.connect(audioCtx.destination);

    const ended = new Promise((resolve) => {
      source.onended = resolve;
    });

    const start = performance.now();
    source.start();
    let raf = 0;
    const tick = () => {
      drawFrame(ctx, assets, scene, headline, scene.role === 'bob' ? bullets : []);
      // subtle pulse
      if (scene.role === 'charlie' || scene.role === 'bob') {
        const t = (performance.now() - start) / 300;
        ctx.fillStyle = `rgba(212,175,55,${0.08 + 0.06 * Math.sin(t)})`;
        ctx.fillRect(0, 0, W, 8);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    await ended;
    cancelAnimationFrame(raf);
  }

  // End hold
  drawFrame(ctx, assets, { role: 'charlie', label: 'DNN SIGN OFF' }, headline, []);
  await new Promise((r) => setTimeout(r, 600));

  recorder.stop();
  canvasStream.getTracks().forEach((t) => t.stop());
  await audioCtx.close();

  const blob = await recorded;
  if (!blob.size) throw new Error('Bake produced an empty video');

  onProgress({ phase: 'upload', message: 'Uploading finished show…' });
  const file = new File([blob], `dnn-morning-${Date.now()}.webm`, { type: blob.type || mimeType });
  const upload = await base44.integrations.Core.UploadFile({ file });
  const fileUrl = upload?.file_url || upload?.url;
  if (!fileUrl) throw new Error('UploadFile did not return a URL');

  if (broadcastId) {
    onProgress({ phase: 'save', message: 'Saving compositedVideoUrl…' });
    await base44.entities.DnnBroadcast.update(broadcastId, {
      compositedVideoUrl: fileUrl,
      videoUrl: fileUrl,
      status: 'ready',
      errorMessage: '',
    });
  }

  onProgress({ phase: 'done', message: 'Usable video ready for 7-site distribution' });
  return {
    fileUrl,
    mimeType: blob.type || mimeType,
    bytes: blob.size,
    broadcastId,
    blob,
  };
}
