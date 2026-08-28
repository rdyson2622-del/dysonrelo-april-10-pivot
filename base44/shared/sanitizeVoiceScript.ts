/**
 * sanitizeVoiceScript — strips punctuation known to make HeyGen's
 * text-to-speech engine go silent or garble the audio (em-dash, en-dash,
 * smart quotes, bullet characters). Applied right before any script text
 * is sent to HeyGen as voice.input_text, as a safety net in case the LLM
 * ignores the "no em-dashes" instruction in the prompt.
 */
export function sanitizeVoiceScript(text: string): string {
  if (!text) return text;
  return text
    .replace(/[\u2014\u2013]/g, ', ') // em-dash, en-dash -> comma
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes
    .replace(/[\u201c\u201d]/g, '"')   // smart double quotes
    .replace(/[\u2022\u25cf\u25aa]/g, '') // bullet characters
    .replace(/\s{2,}/g, ' ')
    .trim();
}