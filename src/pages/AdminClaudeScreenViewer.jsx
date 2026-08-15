import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Monitor, Square, Send, Loader2, Eye, EyeOff, Trash2, AlertCircle, Camera,
} from 'lucide-react';

const CAPTURE_INTERVAL_MS = 8000;
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.7;
const MAX_HISTORY_TURNS = 12;

const SYSTEM_PROMPT =
  "You are Grok acting as a continuous screen-viewing assistant for the admin of DysonRelo. " +
  "The user is sharing their screen live and you receive a fresh screenshot every few seconds. " +
  "Provide concise, high-signal observations: what's on screen, anything that looks broken or " +
  "worth attention, and brief suggestions. Keep responses short (2-4 sentences) unless the user " +
  "asks for detail. If the user asks a question about the screen, answer it directly using what you see.";

export default function AdminClaudeScreenViewer() {
  const [sharing, setSharing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [autoObserve, setAutoObserve] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [lastFrameUrl, setLastFrameUrl] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const conversationRef = useRef([]);
  const analyzingRef = useRef(false);

  useEffect(() => { analyzingRef.current = analyzing; }, [analyzing]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    return () => stopSharing(true);
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return null;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(vw, vh));
    const w = Math.max(1, Math.round(vw * scale));
    const h = Math.max(1, Math.round(vh * scale));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  }, []);

  const sendToGrok = useCallback(async (imageDataUrl, prompt) => {
    const base64 = imageDataUrl.split(',')[1];
    const res = await base44.functions.invoke('grokScreenVision', {
      image_base64: base64,
      image_media_type: 'image/jpeg',
      prompt,
      system_prompt: SYSTEM_PROMPT,
      conversation: conversationRef.current.slice(-MAX_HISTORY_TURNS * 2),
    });
    const data = res?.data || res;
    if (data?.error) throw new Error(data.error);
    return data.text || '';
  }, []);

  const observe = useCallback(async (prompt, kind) => {
    const frame = captureFrame();
    if (!frame) return;
    setLastFrameUrl(frame);
    setAnalyzing(true);
    try {
      const text = await sendToGrok(frame, prompt);
      conversationRef.current.push({ role: 'user', content: prompt });
      conversationRef.current.push({ role: 'assistant', content: text });
      if (conversationRef.current.length > MAX_HISTORY_TURNS * 2) {
        conversationRef.current = conversationRef.current.slice(-MAX_HISTORY_TURNS * 2);
      }
      setTranscript((t) => [
        ...t,
        { role: 'assistant', content: text, ts: Date.now(), kind },
      ]);
    } catch (e) {
      setError(e.message || 'Grok request failed.');
    } finally {
      setAnalyzing(false);
    }
  }, [captureFrame, sendToGrok]);

  const tick = useCallback(() => {
    if (analyzingRef.current) return;
    observe("Brief observation of what's on screen now — anything notable, broken, or worth attention.", 'observation');
  }, [observe]);

  const startSharing = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 2 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setSharing(true);
      const track = stream.getVideoTracks()[0];
      if (track) track.onended = () => stopSharing(true);
      setTimeout(() => tick(), 900);
      if (autoObserve) {
        intervalRef.current = setInterval(tick, CAPTURE_INTERVAL_MS);
      }
    } catch (e) {
      setError(e.message || 'Screen share denied or failed.');
    }
  };

  const stopSharing = (silent = false) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setSharing(false);
    if (!silent) setLastFrameUrl(null);
  };

  const toggleAutoObserve = () => {
    setAutoObserve((prev) => {
      const next = !prev;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (next && sharing) {
        intervalRef.current = setInterval(tick, CAPTURE_INTERVAL_MS);
      }
      return next;
    });
  };

  const handleAsk = async (e) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q || analyzing) return;
    setInput('');
    setTranscript((t) => [...t, { role: 'user', content: q, ts: Date.now(), kind: 'question' }]);
    await observe(q, 'answer');
  };

  const captureOnce = () => {
    if (analyzing) return;
    observe("Here's my current screen. What do you notice?", 'observation');
  };

  const clearTranscript = () => {
    setTranscript([]);
    conversationRef.current = [];
  };

  return (
    <div className="min-h-screen bg-dyson-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif text-dyson-gold flex items-center gap-2">
              <Monitor className="w-6 h-6" />
              Grok Screen Viewer
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Share your screen and Grok will continuously observe and answer questions about what it sees.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!sharing ? (
              <Button onClick={startSharing} className="gold-btn border-0">
                <Monitor className="w-4 h-4 mr-1.5" />
                Start Sharing
              </Button>
            ) : (
              <Button onClick={() => stopSharing(false)} variant="outline" className="border-red-500/40 text-red-400 hover:bg-red-500/10">
                <Square className="w-4 h-4 mr-1.5" />
                Stop
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: screen preview + controls */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black aspect-video flex items-center justify-center">
              {lastFrameUrl ? (
                <img src={lastFrameUrl} alt="Last captured frame" className="w-full h-full object-contain" />
              ) : (
                <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                  <Monitor className="w-10 h-10 opacity-40" />
                  <span>{sharing ? 'Waiting for first frame…' : 'Screen not shared yet'}</span>
                </div>
              )}
              {analyzing && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 text-xs bg-black/70 px-2 py-1 rounded-full">
                  <Loader2 className="w-3 h-3 animate-spin text-dyson-gold" />
                  <span className="text-dyson-gold">Grok is looking…</span>
                </div>
              )}
            </div>

            {/* Hidden video + canvas */}
            <video ref={videoRef} className="hidden" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={captureOnce}
                disabled={!sharing || analyzing}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Camera className="w-4 h-4 mr-1.5" />
                Capture & Analyze Once
              </Button>
              <Button
                onClick={toggleAutoObserve}
                disabled={!sharing}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {autoObserve ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
                {autoObserve ? 'Pause Auto-Observe' : 'Resume Auto-Observe'}
              </Button>
              <Button
                onClick={clearTranscript}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Clear Transcript
              </Button>
            </div>

            {sharing && autoObserve && (
              <p className="text-xs text-gray-500">
                Auto-observing every {CAPTURE_INTERVAL_MS / 1000}s. Each frame is downscaled to max {MAX_DIMENSION}px and sent with rolling context.
              </p>
            )}
          </div>

          {/* Right: transcript + input */}
          <div className="flex flex-col rounded-xl border border-white/15 bg-dyson-charcoal h-[70vh]">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-semibold text-dyson-gold">Grok Transcript</span>
              <span className="text-xs text-gray-500">{transcript.length} messages</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-500 text-sm">
                  <div>
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Start sharing your screen — Grok will begin observing automatically.
                  </div>
                </div>
              ) : (
                transcript.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-dyson-gold/20 border border-dyson-gold/40 text-white'
                          : 'bg-white/5 border border-white/10 text-gray-100'
                      }`}
                    >
                      {m.kind === 'observation' && (
                        <div className="text-[10px] uppercase tracking-wider text-dyson-gold/70 mb-1">Observation</div>
                      )}
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            <form onSubmit={handleAsk} className="p-3 border-t border-white/10 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={sharing ? 'Ask Grok about your screen…' : 'Start sharing to ask questions'}
                disabled={!sharing || analyzing}
                className="bg-black/40 border-white/20 text-white"
              />
              <Button type="submit" disabled={!sharing || analyzing || !input.trim()} className="gold-btn border-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}