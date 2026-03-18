import React, { useEffect, useState } from 'react';
import { Radio, MessageCircle, Eye, Volume2, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function ClientSessionMonitor({ client }) {
  const [sessionActive, setSessionActive] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [listening, setListening] = useState(false);

  // Subscribe to live Gemini session updates via entity subscription
  useEffect(() => {
    if (!monitoring) return;

    const unsubscribe = base44.entities.ChatMessage.subscribe((event) => {
      // Only listen to this client's messages
      if (event.data?.client_id === client.id) {
        setTranscript(prev => [...prev, event.data]);
        
        // Auto-detect if session is active (Charlie or Gemini speaking)
        if (event.data.role === 'charlie' || event.data.content?.includes('Gemini')) {
          setSessionActive(true);
        }
      }
    });

    return unsubscribe;
  }, [monitoring, client.id]);

  // Auto-pause monitoring if session ends
  useEffect(() => {
    if (transcript.length > 0) {
      const lastMsg = transcript[transcript.length - 1];
      if (lastMsg.content?.includes('session complete') || lastMsg.content?.includes('Thank you')) {
        setTimeout(() => setSessionActive(false), 2000);
      }
    }
  }, [transcript]);

  const handleStartMonitoring = () => {
    setMonitoring(true);
    setTranscript([]);
  };

  const handleStopMonitoring = () => {
    setMonitoring(false);
    setSessionActive(false);
  };

  return (
    <div className="space-y-4">
      {/* Status header */}
      <div className="rounded-2xl border p-5" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${sessionActive ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            <div>
              <h2 className="font-bold text-base" style={{ color: '#000' }}>Gemini Session Monitor</h2>
              <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
                {sessionActive ? '🔴 Session Active' : monitoring ? '⏸️ Waiting for session...' : '⚫ Not monitoring'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!monitoring ? (
              <Button onClick={handleStartMonitoring} size="sm" style={{ background: GOLD, color: '#000' }} className="gap-2 font-bold">
                <Eye className="w-4 h-4" /> Start Monitoring
              </Button>
            ) : (
              <Button onClick={handleStopMonitoring} size="sm" variant="outline" className="gap-2">
                <Pause className="w-4 h-4" /> Stop
              </Button>
            )}
            {monitoring && sessionActive && (
              <Button onClick={() => setListening(!listening)} size="sm"
                style={{ background: listening ? '#ef4444' : GOLD, color: '#000' }} className="gap-2 font-bold">
                <Volume2 className="w-4 h-4" /> {listening ? 'Mute' : 'Listen'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Live transcript */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(0,0,0,0.06)', background: '#f9f9f9' }}>
          {monitoring && sessionActive && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          <h3 className="font-bold text-sm" style={{ color: '#000' }}>Live Transcript</h3>
          <span className="text-xs ml-auto" style={{ color: 'rgba(0,0,0,0.4)' }}>{transcript.length} messages</span>
        </div>

        {transcript.length === 0 && monitoring ? (
          <div className="p-8 text-center" style={{ background: '#f9f9f9' }}>
            <Radio className="w-8 h-8 mx-auto mb-2 animate-pulse" style={{ color: 'rgba(0,0,0,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(0,0,0,0.4)' }}>Waiting for client to start their Gemini session...</p>
          </div>
        ) : transcript.length === 0 ? (
          <div className="p-8 text-center" style={{ background: '#f9f9f9' }}>
            <MessageCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(0,0,0,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(0,0,0,0.4)' }}>Click "Start Monitoring" to watch live.</p>
          </div>
        ) : (
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {transcript.map((msg, i) => {
              const isUser = msg.role === 'user' || msg.role === 'client';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[75%]">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: isUser ? '#000' : GOLD }}>
                      {isUser ? '👤 ' + client.full_name : '🎙️ Gemini'}
                    </div>
                    <div className="rounded-lg px-3 py-2 text-sm leading-relaxed"
                      style={{
                        background: isUser ? '#000' : `${GOLD}15`,
                        color: isUser ? '#fff' : '#2a2a2a',
                      }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin notes during session */}
      {monitoring && (
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
          <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.4)' }}>💡 TIP</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.5)' }}>
            While monitoring, you can review the client's chat history tab to add internal notes or flag messages that need follow-up.
          </p>
        </div>
      )}
    </div>
  );
}