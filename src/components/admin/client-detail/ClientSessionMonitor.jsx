import React, { useEffect, useState } from 'react';
import { Play, Square, Loader, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const GOLD = '#D4AF37';

export default function ClientSessionMonitor({ client }) {
  const [sessionActive, setSessionActive] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Subscribe to live messages for this client
  useEffect(() => {
    const unsubscribe = base44.entities.ChatMessage.subscribe((event) => {
      if (event.data?.client_id === client.id && event.type === 'create') {
        setTranscript(prev => [...prev, event.data]);
      }
    });

    return unsubscribe;
  }, [client.id]);

  const handleStartSession = () => {
    setSessionActive(true);
    setTranscript([]);
    // Greet the client
    addMessageToChat('charlie', `Hello ${client.full_name}! I'm ready to discuss your relocation. Let's dive into your needs. What's your destination, and what's your timeline?`);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    addMessageToChat('charlie', 'Thank you for the interview! Your profile has been saved. We'll be in touch with agent recommendations.');
  };

  const addMessageToChat = async (role, content) => {
    try {
      const msg = {
        client_id: client.id,
        role,
        content,
        message_type: role === 'user' ? 'text' : 'recommendation',
      };
      
      // Save to ChatMessage entity (client sees instantly via subscription)
      await base44.entities.ChatMessage.create(msg);
      
      // Add locally immediately for UI responsiveness
      setTranscript(prev => [...prev, { ...msg, id: Date.now() }]);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  const handleSendAsAdmin = async () => {
    if (!inputValue.trim()) return;

    // Add admin's question/prompt
    addMessageToChat('user', inputValue);
    setInputValue('');
    setLoadingResponse(true);

    // Simulate Gemini thinking
    setTimeout(async () => {
      const geminiResponse = generateMockGeminiResponse(inputValue);
      addMessageToChat('charlie', geminiResponse);
      setLoadingResponse(false);
    }, 1500);
  };

  const generateMockGeminiResponse = (userInput) => {
    // Mock Gemini responses based on context
    const responses = {
      default: `That's helpful to know. Based on what you've shared, I'm noting that down in your profile. Can you tell me more about your lifestyle priorities—are schools, commute, walkability, or something else most important?`,
      budget: `Got it, so you're looking in the $${userInput.match(/\d+/)?.[0]}k range. That's useful. What property type interests you most—single-family homes, condos, or something more custom?`,
      timeline: `Perfect timing information. This helps us coordinate with agents and plan your move schedule. Are you starting to explore agents already, or would you like us to match you first?`,
      agent: `Great feedback on agent style. I'm making a note that you prefer ${userInput.includes('responsive') ? 'quick, responsive agents' : 'relationship-focused, educational agents'}. This will shape who we recommend.`,
    };

    let key = 'default';
    if (userInput.toLowerCase().includes('budget') || userInput.match(/\$\d+/)) key = 'budget';
    if (userInput.toLowerCase().includes('timeline') || userInput.toLowerCase().includes('month')) key = 'timeline';
    if (userInput.toLowerCase().includes('agent')) key = 'agent';

    return responses[key];
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Control header */}
      <div className="rounded-2xl border p-4 shrink-0" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${sessionActive ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            <div>
              <p className="font-bold text-sm" style={{ color: '#000' }}>Admin-Controlled Gemini Interview</p>
              <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
                {sessionActive ? '🔴 Session Active — Type to ask questions' : 'Ready to start'}
              </p>
            </div>
          </div>
          {!sessionActive ? (
            <Button onClick={handleStartSession} size="sm" style={{ background: GOLD, color: '#000' }} className="gap-2 font-bold whitespace-nowrap">
              <Play className="w-4 h-4" /> Start Interview
            </Button>
          ) : (
            <Button onClick={handleEndSession} size="sm" variant="destructive" className="gap-2 whitespace-nowrap">
              <Square className="w-4 h-4" /> End Session
            </Button>
          )}
        </div>
      </div>

      {/* Live transcript */}
      <div className="flex-1 rounded-2xl border overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: 'rgba(0,0,0,0.06)', background: '#f9f9f9' }}>
          {sessionActive && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          <h3 className="font-bold text-xs" style={{ color: '#000' }}>Live Interview Feed</h3>
          <span className="text-xs ml-auto" style={{ color: 'rgba(0,0,0,0.4)' }}>{transcript.length} messages</span>
        </div>

        {transcript.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center" style={{ background: '#f9f9f9' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.4)' }}>Click "Start Interview" to begin</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>Messages will sync to client's app instantly</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {transcript.map((msg, i) => {
              const isAdmin = msg.role === 'user';
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed`}
                    style={{
                      background: isAdmin ? '#000' : `${GOLD}20`,
                      color: isAdmin ? '#fff' : '#000',
                    }}>
                    <p className="text-xs font-semibold mb-1" style={{ opacity: 0.7 }}>
                      {isAdmin ? '👤 You (Admin)' : '🎙️ Gemini'}
                    </p>
                    {msg.content}
                  </div>
                </motion.div>
              );
            })}
            {loadingResponse && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center" style={{ color: GOLD }}>
                <Loader className="w-3 h-3 animate-spin" />
                <span className="text-xs">Gemini is thinking...</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input for admin */}
      {sessionActive && (
        <div className="shrink-0 flex gap-2">
          <Input
            placeholder="Ask about destination, budget, timeline, agent style..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendAsAdmin()}
            disabled={loadingResponse}
            className="border-0 rounded-xl h-10"
            style={{ background: '#f0f0f0' }}
          />
          <Button
            onClick={handleSendAsAdmin}
            disabled={!inputValue.trim() || loadingResponse}
            size="sm"
            style={{ background: GOLD, color: '#000' }}
            className="gap-1 font-bold whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </Button>
        </div>
      )}

      {/* Info */}
      {sessionActive && (
        <div className="text-xs p-2 rounded-lg" style={{ background: `${GOLD}10`, color: 'rgba(0,0,0,0.5)' }}>
          💡 Every message is auto-saved to the client's chat. They see it live on their Dashboard.
        </div>
      )}
    </div>
  );
}