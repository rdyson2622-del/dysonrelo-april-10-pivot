import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TranscriptSidebar from '@/components/talkingapp/TranscriptSidebar';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';

const GOLD = '#D4AF37';

export default function TalkingApp() {
  const [status, setStatus] = useState('ready');
  const [transcript, setTranscript] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  const addTranscript = (entry) => setTranscript((prev) => [...prev, entry]);

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0d0d0d' }}>
      <header className="px-6 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <Link to="/Home">
          <ArrowLeft className="w-4 h-4" style={{ color: GOLD }} />
        </Link>
        <p className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Talking App</p>
      </header>
      <div className="flex-1 flex min-h-0">
        <TranscriptSidebar transcript={transcript} currentSpeaker={currentSpeaker} />
        <TalkingOrb
          status={status}
          setStatus={setStatus}
          onTranscript={addTranscript}
          onSpeaker={setCurrentSpeaker}
        />
      </div>
    </div>
  );
}