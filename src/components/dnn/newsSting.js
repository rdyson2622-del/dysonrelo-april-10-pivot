// Synthesized "breaking news" broadcast sting — no audio files needed.
// Classic network-news open: pulsing low drone, three escalating hits,
// a rising sweep, and a final orchestral-style impact. ~3.2 seconds.
export function playNewsSting() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  const now = ctx.currentTime;

  // Low pulsing drone
  const drone = ctx.createOscillator();
  drone.type = 'sawtooth';
  drone.frequency.value = 55;
  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.0001, now);
  droneGain.gain.exponentialRampToValueAtTime(0.18, now + 0.15);
  droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 200;
  drone.connect(droneFilter).connect(droneGain).connect(master);
  drone.start(now);
  drone.stop(now + 3.3);

  // Three escalating timpani-style hits
  [0, 0.55, 1.1].forEach((t, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const f = 90 + i * 30;
    osc.frequency.setValueAtTime(f * 2, now + t);
    osc.frequency.exponentialRampToValueAtTime(f, now + t + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, now + t);
    g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.5);
    osc.connect(g).connect(master);
    osc.start(now + t);
    osc.stop(now + t + 0.55);
  });

  // Rising sweep into the final hit
  const sweep = ctx.createOscillator();
  sweep.type = 'sawtooth';
  sweep.frequency.setValueAtTime(220, now + 1.4);
  sweep.frequency.exponentialRampToValueAtTime(880, now + 2.2);
  const sweepGain = ctx.createGain();
  sweepGain.gain.setValueAtTime(0.0001, now + 1.4);
  sweepGain.gain.exponentialRampToValueAtTime(0.12, now + 2.1);
  sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
  sweep.connect(sweepGain).connect(master);
  sweep.start(now + 1.4);
  sweep.stop(now + 2.3);

  // Final impact chord (root + fifth + octave)
  [110, 165, 220].forEach(f => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.28, now + 2.2);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    osc.connect(g).connect(master);
    osc.start(now + 2.2);
    osc.stop(now + 3.25);
  });

  setTimeout(() => ctx.close(), 3600);
}