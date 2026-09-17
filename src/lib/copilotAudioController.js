/**
 * Global audio and voice coordinator for DysonHomes Copilot.
 * Ensures that clicking through mini apps, switching views, or triggering new media
 * instantly terminates ALL previous audio and video across the entire DOM,
 * eliminating overlapping voices and background playback.
 */

export function stopAllCopilotAudio() {
  if (typeof window === 'undefined') return;

  // 1. Cancel browser speech synthesis if active
  try {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  } catch (_) {}

  // 2. Pause and reset all video and audio elements in the entire document
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

  // 3. Notify all listening components to reset their playing states
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