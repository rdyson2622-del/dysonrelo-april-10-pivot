/**
 * Checks HeyGen video render status using the v3 API endpoint.
 * The v1 endpoint (video_status.get) is deprecated and returns 401 as of 2026.
 *
 * Returns { status, videoUrl, error }.
 * status: "processing" | "completed" | "failed" | "unknown"
 */
export async function checkHeygenStatus(heygenKey: string, videoId: string) {
  const res = await fetch(`https://api.heygen.com/v3/videos/${encodeURIComponent(videoId)}`, {
    headers: { 'X-Api-Key': heygenKey },
  });
  const data = await res.json();
  const info = data?.data || data;
  return {
    status: info?.status || 'unknown',
    videoUrl: info?.video_url || null,
    error: info?.error?.message || (typeof info?.error === 'string' ? info.error : null),
    duration: info?.duration || null,
  };
}