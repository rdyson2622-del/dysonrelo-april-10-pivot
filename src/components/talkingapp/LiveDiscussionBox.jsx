import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Copy, Check, Trash2, Volume2, Mic, Compass } from 'lucide-react';

export default function LiveDiscussionBox({
  transcript = [],
  currentSpeaker = null,
  generatingRoadmap = false,
  roadmap = null,
  onClear,
}) {
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.length, currentSpeaker]);

  const copyTranscript = () => {
    if (transcript.length === 0) return;
    const text = transcript
      .map((t) => `[${t.time || ''}] ${t.role === 'user' ? 'You' : 'Charlie AI'}: ${t.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#0f0f0f] border border-[#D4AF37]/50 shadow-2xl flex-1 flex flex-col justify-between space-y-3 h-full">
      
      {/* Header of Text Box */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black border border-[#D4AF37]/50 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Discussion Transcript
            </h3>
            <p className="text-[10px] text-white/50">
              Real-time speech-to-text dialogue capture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {transcript.length > 0 && (
            <>
              <button
                type="button"
                onClick={copyTranscript}
                className="p-1.5 rounded-lg bg-black hover:bg-[#1a1a1a] border border-white/15 text-white/80 hover:text-white text-xs transition-all cursor-pointer flex items-center gap-1"
                title="Copy conversation"
              >
                {copied ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={onClear}
                className="p-1.5 rounded-lg bg-black hover:bg-[#201010] border border-white/15 text-white/60 hover:text-[#ef4444] text-xs transition-all cursor-pointer"
                title="Clear transcript"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
          <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-black border border-[#10b981]/50 text-[#10b981]">
            CAPTURING
          </span>
        </div>
      </div>

      {/* Scrollable Conversation Turns Box */}
      <div 
        className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-black/60 border border-white/10 min-h-[300px] max-h-[500px]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212,175,55,0.4) rgba(0,0,0,0.5)',
        }}
      >
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40 space-y-2.5 my-auto min-h-[260px]">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">
                Spoken dialogue captures here in real-time
              </p>
              <p className="text-[11px] text-white/50 max-w-xs mt-1">
                Tap the gold microphone to speak. As you and Charlie talk, your exchange will be transcribed word-for-word in this box.
              </p>
            </div>
          </div>
        ) : (
          transcript.map((entry, idx) => {
            const isUser = entry.role === 'user';
            return (
              <div 
                key={entry.id || idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/45 px-1">
                  <span className={`font-bold ${isUser ? 'text-[#D4AF37]' : 'text-[#10b981]'}`}>
                    {isUser ? 'You' : 'Charlie AI'}
                  </span>
                  {entry.time && <span>• {entry.time}</span>}
                </div>

                <div 
                  className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#1e190e] border border-[#D4AF37]/40 text-white rounded-tr-sm shadow-md'
                      : 'bg-[#151515] border border-white/15 text-white/95 rounded-tl-sm shadow'
                  }`}
                >
                  {entry.text}
                </div>
              </div>
            );
          })
        )}

        {/* Live Speaker Status */}
        {currentSpeaker && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-xs text-[#D4AF37] animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-[11px] font-semibold">
              {currentSpeaker === 'assistant' ? 'Charlie is speaking…' : 'Listening to your speech…'}
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Generated Move Roadmap Summary if available */}
      {(generatingRoadmap || roadmap) && (
        <div className="p-3.5 rounded-2xl bg-[#14120c] border border-[#D4AF37]/60 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Post-Call Roadmap</span>
            </div>
            <span className="text-[9px] text-[#10b981] font-bold">Generated</span>
          </div>

          {generatingRoadmap ? (
            <p className="text-xs text-white/60 animate-pulse">
              Synthesizing discussion into relocation action plan…
            </p>
          ) : (
            <>
              {roadmap?.solution && (
                <p className="text-xs text-white/90 leading-relaxed font-serif italic">
                  “{roadmap.solution}”
                </p>
              )}
              {roadmap?.action_steps?.length > 0 && (
                <div className="space-y-1 pt-1">
                  {roadmap.action_steps.slice(0, 3).map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-[11px] text-white/80">
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black font-black text-[9px] flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <span className="truncate">{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Help Note Footer */}
      <div className="text-[10px] text-white/40 flex items-center justify-between px-1">
        <span>Transcripts retain privately in your session log</span>
        <span className="text-[#D4AF37]">Fiduciary Protected</span>
      </div>

    </div>
  );
}