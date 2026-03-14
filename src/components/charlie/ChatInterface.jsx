import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import CharlieAvatar from './CharlieAvatar';
import ChatBubble from './ChatBubble';
import { base44 } from '@/api/base44Client';

const CHARLIE_SUGGESTIONS = [
  "Tell me about schools in my new city",
  "Help me create a moving checklist",
  "What's the cost of living like?",
  "Find me local services nearby",
  "What neighborhoods should I look at?",
];

export default function ChatInterface({ expanded = false, onToggleExpand, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'charlie',
      content: "Hey there! I'm Charlie, your relocation buddy! 🏠 Moving to a new city can feel overwhelming, but I'm here to make it a breeze. Ask me anything about your new city, moving logistics, or local tips!",
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg = { role: 'user', content: messageText, type: 'text' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setIsSpeaking(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Charlie, a friendly and knowledgeable relocation assistant character. You help people who are moving to new cities. You're warm, encouraging, and practical. Keep responses concise but helpful (2-3 paragraphs max). Use occasional emojis but don't overdo it.

User message: ${messageText}

Provide helpful, specific advice about relocation. If they ask about a specific city, provide real insights about neighborhoods, cost of living, schools, local culture, etc.`,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'charlie', content: response, type: 'text' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'charlie',
          content: "Oops! I had a little hiccup there. Could you try asking me again? I'm ready to help! 😊",
          type: 'text',
        },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => setIsSpeaking(false), 1000);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be integrated here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      className={`flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden ${
        expanded ? 'fixed inset-4 z-50' : 'h-[520px] w-full'
      }`}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CharlieAvatar size="sm" speaking={isSpeaking} />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Charlie</h3>
          <p className="text-xs text-slate-300">
            {isTyping ? 'Typing...' : isListening ? 'Listening...' : 'Your Relocation Buddy'}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-300 hover:text-white hover:bg-white/10"
            onClick={onToggleExpand}
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-300 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-slate-400 text-sm"
            >
              <div className="flex gap-1">
                <motion.div className="w-2 h-2 bg-orange-400 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                <motion.div className="w-2 h-2 bg-orange-400 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                <motion.div className="w-2 h-2 bg-orange-400 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
              </div>
              Charlie is thinking...
            </motion.div>
          )}

          {/* Suggestions when chat is new */}
          {messages.length === 1 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Try asking</p>
              {CHARLIE_SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                  onClick={() => handleSend(s)}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Button
            type="button"
            size="icon"
            variant={isListening ? 'default' : 'outline'}
            className={`shrink-0 ${isListening ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            placeholder="Ask Charlie anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}