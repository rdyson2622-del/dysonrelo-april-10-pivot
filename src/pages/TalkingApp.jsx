import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TranscriptSidebar from '@/components/talkingapp/TranscriptSidebar';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';

const GOLD = '#D4AF37';

export default function TalkingApp() {
  const [status, setStatus] = useState('ready');
  const [transcript, setTranscript] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const prevStatusRef = useRef(status);
  const sessionLogIdRef = useRef(null);

  const addTranscript = (entry) => setTranscript((prev) => [...prev, entry]);

  // When a call ends, turn whatever the caller discussed into a real estate
  // roadmap (same engine as the "Ask Your Concierge" solution map) and show
  // it in the sidebar below the transcript.
  useEffect(() => {
    const wasLive = prevStatusRef.current === 'active' || prevStatusRef.current === 'connecting';
    if (wasLive && status === 'ready') {
      const userText = transcript.filter((t) => t.role === 'user').map((t) => t.text).join(' ').trim();
      if (userText.length > 10) {
        setGeneratingRoadmap(true);
        base44.functions.invoke('realEstateIssueRoadmap', { request_text: userText, context: 'general' })
          .then((res) => {
            setRoadmap(res.data?.request || null);
            if (sessionLogIdRef.current) {
              base44.entities.TalkingSessionLog.update(sessionLogIdRef.current, { roadmap_generated: true }).catch(() => {});
            }
          })
          .catch(() => {})
          .finally(() => setGeneratingRoadmap(false));
      }
    }
    prevStatusRef.current = status;
  }, [status, transcript]);

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0d0d0d' }}>
      <header className="px-6 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <Link to="/Home">
          <ArrowLeft className="w-4 h-4" style={{ color: GOLD }} />
        </Link>
        <p className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Talking App</p>
      </header>
      <div className="flex-1 flex min-h-0">
        <TranscriptSidebar
          transcript={transcript}
          currentSpeaker={currentSpeaker}
          roadmap={roadmap}
          generatingRoadmap={generatingRoadmap}
        />
        <TalkingOrb
          status={status}
          setStatus={setStatus}
          onTranscript={addTranscript}
          onSpeaker={setCurrentSpeaker}
          onSessionId={(id) => { sessionLogIdRef.current = id; }}
        />
      </div>
    </div>
  );
}