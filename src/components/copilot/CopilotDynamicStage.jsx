import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Radio, Scale, Shield, 
  GitBranch, ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Clock, ArrowRight, Video, Sparkles, Maximize2
} from 'lucide-react';
import CopilotDoorAudioBriefingStage from './CopilotDoorAudioBriefingStage';
import CopilotIntegratedSubjectStage from './CopilotIntegratedSubjectStage';
import { resolveIntegratedSubject } from './subjectVisualRegistry';
import { stopAllCopilotAudio, subscribeToStopAllAudio } from '@/lib/copilotAudioController';

const DNN_STUDIO_POSTER = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/d5e0cb3f1_Screenshot2026-09-14at81551PM.png';

export default function CopilotDynamicStage({
  activeView = 'dossier',
  objectiveProject = null,
  selectedSubject = null,
  activeExplainer = null,
  dossierData = {},
  property = '',
  playUrl = '',
  headline = '',
  onPromptClick,
  onToggleExplode
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Stop all audio on any view or subject transition to avoid overlapping voices
  useEffect(() => {
    stopAllCopilotAudio();
    setIsPlaying(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (_) {}
    }
  }, [activeView, selectedSubject, activeExplainer]);

  // Subscribe to global stop-audio events
  useEffect(() => {
    return subscribeToStopAllAudio(() => {
      setIsPlaying(false);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (_) {}
      }
    });
  }, []);

  // Determine what type of content to show in the stage:
  // 1. Explicit video from active explainer
  // 2. Selected subject from Solutions Vault (video OR specialized visual diagram)
  // 3. View-based visual/video (News = DNN Broadcast; Vetting = Vetting standards; Roadmap = 7-phase sequence; Escrow = Deposit shield; Audit = Property snapshot)

  const hasActiveExplainerVideo = Boolean(activeExplainer?.videoUrl);
  const isSelectedSubjectVideo = Boolean(selectedSubject?.videoUrl);
  const videoToPlay = hasActiveExplainerVideo 
    ? activeExplainer.videoUrl 
    : (isSelectedSubjectVideo ? selectedSubject.videoUrl : null);

  const videoTitle = hasActiveExplainerVideo 
    ? (activeExplainer.label || activeExplainer.topic || 'Video Explainer')
    : (isSelectedSubjectVideo ? selectedSubject.title : 'Video Explainer');

  // Video setup: comfortable volume, explicit user play (NO unexpected unprompted loud autoplay)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.65; // Balanced volume (not too loud)
    }
    // If an explicit explainer was triggered by user click, play it once
    if (hasActiveExplainerVideo && videoRef.current && videoToPlay) {
      stopAllCopilotAudio();
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 0.65;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [videoToPlay, hasActiveExplainerVideo]);

  // Toggle play/pause for video
  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // If there's a video to play for this subject or news, render video player
  if (videoToPlay) {
    return (
      <div
        className="relative w-[66%] max-w-[450px] min-w-[315px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/50 group shrink-0 transition-all duration-300"
        style={{
          aspectRatio: '16/9',
          background: '#000',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        }}
      >
        <video
          ref={videoRef}
          key={videoToPlay}
          src={videoToPlay}
          poster={DNN_STUDIO_POSTER}
          controls
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
          style={{ display: 'block', background: '#000' }}
        />
        {/* Subtle pill tag indicating subject */}
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="truncate max-w-[200px]">{videoTitle}</span>
          </span>
        </div>
      </div>
    );
  }

  // B. Selected Subject (Visual, Audio Briefing, Script Text & Consumer Response)
  // Activated across all categories: Property Audit, Agent Vetting, Move Roadmap, Escrow Watch, Solutions Vault, News
  if (selectedSubject) {
    const integratedSubject = resolveIntegratedSubject(selectedSubject, activeView, property, dossierData);
    if (integratedSubject) {
      return (
        <CopilotIntegratedSubjectStage
          subject={integratedSubject}
          objectiveProject={objectiveProject}
          dossierData={dossierData}
          property={property}
          onPromptClick={onPromptClick}
          onToggleExplode={onToggleExplode}
        />
      );
    }
  }

  // C. View-Specific Audio Briefing & Visual Stages for Active Execution Doors
  // (Property Audit, Agent Vetting, Move Roadmap, Escrow Watch, DNN News)
  return (
    <CopilotDoorAudioBriefingStage
      activeDoor={activeView || 'dossier'}
      objectiveProject={objectiveProject}
      dossierData={dossierData}
      property={property}
      onPromptClick={onPromptClick}
      onToggleExplode={onToggleExplode}
    />
  );
}