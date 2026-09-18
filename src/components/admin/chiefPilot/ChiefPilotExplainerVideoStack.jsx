import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, MoreVertical } from 'lucide-react';

function ExplainerVideoCard({ item }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setPlaying(true); } else { video.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };
  const goFullscreen = () => { videoRef.current?.requestFullscreen?.(); };
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-black/15 bg-dyson-warm-paper shadow-sm">
      <div className="relative aspect-video w-full bg-dyson-black">
        <video
          ref={videoRef}
          src={item.videoUrl}
          muted={muted}
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={togglePlay}
          className="h-full w-full cursor-pointer"
        />
        <button type="button" onClick={() => {}} className="absolute right-2 top-2 text-white/80"><MoreVertical size={18} /></button>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-gradient-to-t from-black/80 to-transparent p-3">
          <button type="button" onClick={togglePlay} className="text-white">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <button type="button" onClick={toggleMute} className="text-white">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <div className="mx-1 h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"><div className="h-full bg-white/90" style={{ width: `${progress}%` }} /></div>
          <button type="button" onClick={goFullscreen} className="text-white"><Maximize size={18} /></button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-dyson-gold-deep">{item.speakerName}</p>
        <h3 className="mt-1 text-base font-semibold leading-5">{item.label}</h3>
      </div>
    </article>
  );
}

export default function ChiefPilotExplainerVideoStack({ explainers }) {
  return (
    <div className="grid content-start items-start gap-3 grid-cols-1">
      {explainers.map(item => <ExplainerVideoCard key={item.id} item={item} />)}
    </div>
  );
}