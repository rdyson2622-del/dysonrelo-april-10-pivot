import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Plays a green-screen video and keys out the green so only the subject shows.
const ChromaKeyVideo = forwardRef(function ChromaKeyVideo({ src, onEnded, onTimeUpdate, onCanPlay, onPlayBlocked, onClick, className, style }, ref) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    get paused() { return videoRef.current?.paused ?? true; },
    get muted() { return videoRef.current?.muted ?? true; },
    set muted(value) { if (videoRef.current) videoRef.current.muted = value; },
    get currentTime() { return videoRef.current?.currentTime ?? 0; },
    set currentTime(value) { if (videoRef.current) videoRef.current.currentTime = value; },
  }));

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let raf;

    const draw = () => {
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
          if (g > 80 && g > r * 1.22 && g > b * 1.22) d[i + 3] = 0;
        }
        ctx.putImageData(frame, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        key={src}
        src={src}
        playsInline
        crossOrigin="anonymous"
        className="hidden"
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
        onError={() => onPlayBlocked?.()}
      />
      <canvas ref={canvasRef} onClick={onClick} className={className} style={style} />
    </>
  );
});

export default ChromaKeyVideo;