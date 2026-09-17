import React, { useState, useEffect } from 'react';
import { 
  X, Save, RotateCcw, Volume2, VolumeX, Sparkles, 
  Scale, Shield, GitBranch, ShieldCheck, Radio, Check, 
  Copy, FileText
} from 'lucide-react';
import { 
  DEFAULT_DOOR_BRIEFINGS, 
  getDoorAudioBriefing, 
  saveDoorScript, 
  resetDoorScript 
} from './doorAudioBriefings';
import { stopAllCopilotAudio } from '@/lib/copilotAudioController';

export default function CopilotScriptRewriteModal({
  isOpen = false,
  onClose,
  initialDoor = 'vetting'
}) {
  const [selectedDoor, setSelectedDoor] = useState(initialDoor);
  const [scriptText, setScriptText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialDoor) {
      setSelectedDoor(initialDoor);
    }
  }, [initialDoor]);

  // Load current script for the selected door
  useEffect(() => {
    const briefing = getDoorAudioBriefing(selectedDoor);
    setScriptText(briefing.spokenText || '');
    setIsSaved(false);
    stopPreview();
  }, [selectedDoor, isOpen]);

  // Stop any audio on modal close
  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  const stopPreview = () => {
    setIsPreviewing(false);
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (_) {}
  };

  const handleSave = () => {
    saveDoorScript(selectedDoor, scriptText.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    resetDoorScript(selectedDoor);
    const defaultBriefing = DEFAULT_DOOR_BRIEFINGS[selectedDoor];
    setScriptText(defaultBriefing?.spokenText || '');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePreview = () => {
    if (isPreviewing) {
      stopPreview();
      return;
    }

    stopAllCopilotAudio();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const briefing = DEFAULT_DOOR_BRIEFINGS[selectedDoor];
      const isBob = briefing.speaker === 'bob';

      const utterance = new SpeechSynthesisUtterance(scriptText);
      utterance.rate = isBob ? 0.95 : 1.0;
      utterance.pitch = isBob ? 0.9 : 1.05;
      utterance.volume = 0.7; // Comfortable volume, not too loud

      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      const maleVoice = englishVoices.find(v => /male|daniel|david|george|alex/i.test(v.name));
      const naturalVoice = englishVoices.find(v => /natural|google|premium/i.test(v.name));
      if (maleVoice && isBob) {
        utterance.voice = maleVoice;
      } else if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onend = () => setIsPreviewing(false);
      utterance.onerror = () => setIsPreviewing(false);

      setIsPreviewing(true);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech preview failed:', err);
      setIsPreviewing(false);
    }
  };

  if (!isOpen) return null;

  const currentBriefing = getDoorAudioBriefing(selectedDoor);
  const isBob = currentBriefing.speaker === 'bob';
  const wordCount = (scriptText.trim().match(/\S+/g) || []).length;
  const estimatedSeconds = Math.round(wordCount / (isBob ? 2.2 : 2.5));

  const doors = [
    { id: 'dossier', label: 'Property Audit', icon: Scale, speaker: 'Charlie' },
    { id: 'vetting', label: 'Agent Vetting', icon: Shield, speaker: 'Bob' },
    { id: 'roadmap', label: 'Move Roadmap', icon: GitBranch, speaker: 'Charlie' },
    { id: 'escrow', label: 'Escrow Watch', icon: ShieldCheck, speaker: 'Bob' },
    { id: 'news', label: 'DNN News', icon: Radio, speaker: 'Charlie & Bob' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0e0e0e] border border-[#D4AF37]/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#141414] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>Voice Briefing Script Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
                  All 5 Execution Doors
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Inspect and rewrite the exact spoken script for each mini-app pill
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopPreview();
              onClose?.();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Doors Selector Bar */}
        <div className="px-4 py-2 bg-[#121212] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0">
          {doors.map((d) => {
            const Icon = d.icon;
            const isSelected = selectedDoor === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDoor(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md' 
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#D4AF37]'}`} />
                <span>{d.label}</span>
                <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-black/20 text-black' : 'text-stone-400'}`}>
                  ({d.speaker})
                </span>
              </button>
            );
          })}
        </div>

        {/* Speaker Profile & Active Context */}
        <div className="px-4 py-3 bg-[#161616] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={currentBriefing.avatar} 
              alt={currentBriefing.speakerName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/60 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {currentBriefing.speakerName}
                </span>
                <span className="text-[10px] text-[#D4AF37] font-mono">
                  {currentBriefing.speakerRole}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                {currentBriefing.subtitle}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 font-mono text-[11px] text-stone-400">
            <div><strong className="text-white">{wordCount}</strong> words</div>
            <div className="text-[10px] text-stone-500">~{estimatedSeconds}s audio</div>
          </div>
        </div>

        {/* Script Textarea Editor */}
        <div className="p-4 flex-1 flex flex-col min-h-0 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <label className="font-semibold text-stone-300">
              Spoken Script Text:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default script"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>

          <textarea
            value={scriptText}
            onChange={(e) => {
              setScriptText(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Type the spoken voice-over script here..."
            rows={7}
            className="w-full flex-1 p-3.5 bg-black/80 border border-white/20 rounded-xl text-white text-xs sm:text-[13px] leading-relaxed outline-none focus:border-[#D4AF37] transition-all resize-none font-sans scrollbar-thin"
          />

          <p className="text-[11px] text-stone-500 italic">
            Tips: Keep scripts focused on explaining the specific pill (comps & risks, representation standards, 7-phase timeline, or deposit protections). The speech synthesis will speak your exact text.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-[#141414] border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePreview}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPreviewing 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {isPreviewing ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                  <span>Stop Preview</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Listen to Preview</span>
                </>
              )}
            </button>

            {isSaved && (
              <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Saved successfully</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopPreview();
                onClose?.();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Script</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}