/**
 * Global audio and voice coordinator for DysonHomes Copilot.
 * Ensures that clicking through mini apps, switching views, or triggering new media
 * instantly terminates ALL previous audio and video across the entire DOM,
 * eliminating overlapping voices and background playback.
 */

// Active non-DOM media elements registry (e.g. new Audio() instances)
const activeMediaRegistry = new Set();

export function registerActiveMedia(media) {
  if (!media) return () => {};
  activeMediaRegistry.add(media);
  return () => {
    activeMediaRegistry.delete(media);
  };
}

export function stopAllCopilotAudio() {
  if (typeof window === 'undefined') return;

  // 1. Unconditionally terminate and cancel browser speech synthesis immediately
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (typeof window.speechSynthesis.pause === 'function') {
        try { window.speechSynthesis.pause(); } catch (_) {}
      }
      window.speechSynthesis.cancel();
    }
  } catch (_) {}

  // 2. Pause and reset all registered non-DOM audio objects
  try {
    activeMediaRegistry.forEach((media) => {
      try {
        if (typeof media.pause === 'function') media.pause();
        if ('currentTime' in media) media.currentTime = 0;
      } catch (_) {}
    });
    activeMediaRegistry.clear();
  } catch (_) {}

  // 3. Pause and reset all video and audio elements in the entire DOM
  try {
    const mediaElements = document.querySelectorAll('audio, video');
    mediaElements.forEach((el) => {
      try {
        if (!el.paused) {
          el.pause();
        }
        el.currentTime = 0;
      } catch (_) {}
    });
  } catch (_) {}

  // 4. Notify all listening components to reset their playing states immediately
  try {
    window.dispatchEvent(new CustomEvent('dyson_copilot_stop_all_audio'));
  } catch (_) {}
}

export function subscribeToStopAllAudio(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    try {
      callback();
    } catch (_) {}
  };
  window.addEventListener('dyson_copilot_stop_all_audio', handler);
  return () => {
    window.removeEventListener('dyson_copilot_stop_all_audio', handler);
  };
}