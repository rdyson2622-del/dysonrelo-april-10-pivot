import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/**
 * ChromaKeyVideo — plays a green-screen video and keys out the green
 * so only the subject shows (transparent canvas where green was).
 *
 * Extended to support the event handlers needed by DnnNewsBroadcastPlayer:
 *   onEnded, onTimeUpdate, onCanPlay, onClick, muted, playsInline, poster
 */
const ChromaKeyVideo = forwardRef(function ChromaKeyVideo({
  src, onEnded, onTimeUpdate, onCanPlay, onClick, onPlayBlocked,
  muted, playsInline, poster, className, style
}, ref) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    get currentTime() { return videoRef.current?.currentTime || 0; },
    get duration() { return videoRef.current?.duration || 0; },
    get paused() { return videoRef.current?.paused ?? true; },
    set muted(v) { if (videoRef.current) videoRef.current.muted = v; },
    get muted() { return videoRef.current?.muted ?? false; },
    set currentTime(v) { if (videoRef.current) videoRef.current.currentTime = v; },
    videoElement: videoRef.current,
  }));

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let raf;
    let stopped = false;

    const draw = () => {
      if (stopped) return;
      if (video.videoWidth) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = frame.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          if (g > 90 && g > r * 1.35 && g > b * 1.35) d[i + 3] = 0;
        }
        ctx.putImageData(frame, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        key={src}
        src={src}
        muted={muted}
        playsInline={playsInline}
        poster={poster}
        preload="auto"
        crossOrigin="anonymous"
        className="hidden"
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
      />
      <canvas
        ref={canvasRef}
        onClick={onClick}
        className={className}
        style={style}
      />
    </>
  );
});

export default ChromaKeyVideo;