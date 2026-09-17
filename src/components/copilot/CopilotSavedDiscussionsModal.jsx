import React, { useState, useEffect } from 'react';
import { 
  Bookmark, X, Trash2, ArrowUpRight, Copy, Check, Download, 
  MessageSquare, Calendar, Sparkles, Plus, Clock, ShieldCheck, Lock, UserCheck
} from 'lucide-react';
import { 
  getCheckedInUser, 
  saveToClientVault, 
  saveToGlobalBrain 
} from '@/lib/copilotContactSession';
import CopilotPreferredClientModal from './CopilotPreferredClientModal';

const STORAGE_KEY = 'dyson_copilot_saved_discussions';

// Initial seed discussion to showcase functionality if user has none saved yet
const DEFAULT_SEED_DISCUSSIONS = [
  {
    id: 'seed-7414-fay',
    title: '7414 Fay Ave, La Jolla — Bluff Setback & Contingency Audit',
    propertyAddress: '7414 Fay Ave, La Jolla, CA 92037',
    savedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'Bob Dyson verified 25-ft coastal bluff setback protocol and contingency shields.',
    messages: [
      {
        id: 1,
        sender: 'consumer',
        speakerName: 'You (Buyer)',
        text: "We're looking at 7414 Fay Ave in La Jolla. Is the coastal bluff setback going to be a problem, and what unvarnished risks should we know about before writing an offer?",
        time: '10:14 AM'
      },
      {
        id: 2,
        sender: 'charlie',
        speakerName: 'Charlie Simmons (Voice)',
        text: "Charlie here. On 7414 Fay Ave, coastal zoning requires a mandatory 25-foot bluff setback and an updated geotechnical soil report. Public comps also indicate the listing is priced at an 18% premium over recent neighborhood sales. Let me bring in Bob Dyson to review your physical inspection contingency protections.",
        time: '10:14 AM'
      },
      {
        id: 3,
        sender: 'bob',
        speakerName: 'Bob Dyson (Broker)',
        text: "Bob Dyson here. Charlie is spot-on about the bluff setback. In California coastal parcels, ancient fault lines and erosion zones are serious deal-breakers. We mandate an un-waivable geological soil stability inspection and strict escrow contingency shields so you never risk your earnest money deposit.",
        time: '10:15 AM'
      }
    ]
  }
];

export default function CopilotSavedDiscussionsModal({
  isOpen,
  onClose,
  currentMessages = [],
  currentProperty = '',
  onRestoreDiscussion,
  onSaveCurrent,
}) {
  const [savedList, setSavedList] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isPreferredModalOpen, setIsPreferredModalOpen] = useState(false);
  const [pendingSaveItem, setPendingSaveItem] = useState(null);

  const currentUser = getCheckedInUser();
  const isRecognized = !!currentUser?.isPreferredClient;

  // Load from local storage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedList(parsed);
          return;
        }
      }
      setSavedList(DEFAULT_SEED_DISCUSSIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DISCUSSIONS));
    } catch (e) {
      setSavedList(DEFAULT_SEED_DISCUSSIONS);
    }
  }, []);

  // Update default title when opening modal
  useEffect(() => {
    if (isOpen) {
      const addr = currentProperty ? currentProperty.split(',')[0] : 'Property Discussion';
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setCustomTitle(`${addr} — CoPilot Fiduciary Notes (${dateStr})`);
      setCustomNotes('');
      setSaveSuccessMsg('');
      setIsSavingNew(false);
      setSelectedDiscussion(null);
    }
  }, [isOpen, currentProperty]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e) => {
    e?.preventDefault();
    if (!currentMessages || currentMessages.length === 0) return;

    const newRecord = {
      id: 'saved-' + Date.now(),
      title: customTitle.trim() || `CoPilot Discussion (${new Date().toLocaleDateString()})`,
      propertyAddress: currentProperty || 'General Fiduciary Inquiry',
      savedAt: new Date().toISOString(),
      notes: customNotes.trim(),
      messages: currentMessages
    };

    // Unrecognized User State: trigger soft Preferred Client modal
    if (!isRecognized) {
      setPendingSaveItem(newRecord);
      setIsPreferredModalOpen(true);
      return;
    }

    // Recognized Client State: save seamlessly in background
    executeSaveItem(newRecord);
  };

  const executeSaveItem = (newRecord) => {
    const updated = [newRecord, ...savedList.filter(item => item.id !== newRecord.id)];
    setSavedList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    setIsSavingNew(false);
    setSaveSuccessMsg('Saved to your Private Vault');
    if (onSaveCurrent) onSaveCurrent(newRecord);

    // 1. Dual-Storage Pipeline 1: Personal Client Vault (Private)
    saveToClientVault({
      title: newRecord.title,
      item_type: 'discussion',
      address: newRecord.propertyAddress,
      notes: newRecord.notes,
      payload: { messages: newRecord.messages },
      clientUser: currentUser
    });

    // 2. Dual-Storage Pipeline 2: Global AI Brain (Internal Anonymized Q&A)
    if (Array.isArray(newRecord.messages)) {
      for (let i = 0; i < newRecord.messages.length - 1; i++) {
        const msg = newRecord.messages[i];
        const nextMsg = newRecord.messages[i + 1];
        if (msg.sender === 'consumer' || msg.sender === 'user') {
          if (nextMsg.sender === 'charlie' || nextMsg.sender === 'bob') {
            saveToGlobalBrain({
              question: msg.text,
              answer: nextMsg.text,
              speaker: nextMsg.sender,
              topic: 'Fiduciary Property Inquiry',
              property_address: newRecord.propertyAddress
            });
          }
        }
      }
    }

    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    const updated = savedList.filter(item => item.id !== id);
    setSavedList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
    if (selectedDiscussion?.id === id) {
      setSelectedDiscussion(null);
    }
  };

  const handleCopyTranscript = (item, e) => {
    e?.stopPropagation();
    const transcriptText = `--- DYSONHOMES COPILOT SAVED DISCUSSION ---
Title: ${item.title}
Property: ${item.propertyAddress || 'N/A'}
Date: ${new Date(item.savedAt).toLocaleString()}
${item.notes ? `Notes: ${item.notes}\n` : ''}
TRANSCRIPT:
${item.messages.map(m => `[${m.time || ''}] ${m.speakerName || (m.sender === 'user' ? 'You' : m.sender === 'bob' ? 'Bob Dyson' : 'Charlie Simmons')}:\n${m.text}\n`).join('\n')}
--- END OF FIDUCIARY TRANSCRIPT ---`;

    navigator.clipboard.writeText(transcriptText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTranscript = (item, e) => {
    e?.stopPropagation();
    const transcriptText = `DYSONHOMES COPILOT DISCUSSION
Title: ${item.title}
Property: ${item.propertyAddress || 'N/A'}
Saved At: ${new Date(item.savedAt).toLocaleString()}
${item.notes ? `Notes: ${item.notes}\n` : ''}
==================================================
${item.messages.map(m => `[${m.time || ''}] ${m.speakerName || m.sender}:\n${m.text}\n`).join('\n--------------------------------------------------\n')}
==================================================
Independent Fiduciary Oversight · California Broker License #00609384`;

    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (item) => {
    if (onRestoreDiscussion) {
      onRestoreDiscussion(item.messages);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0f0f0f] border border-[#D4AF37]/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#141414] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Preferred Client Vault
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#D4AF37] font-mono font-bold">
                  {savedList.length} Files
                </span>
                {isRecognized && (
                  <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans">
                    Preferred Client Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Private vault for saved discussions, property audits &amp; fiduciary intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar: Save Current Discussion Button */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#121212] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-stone-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Active canvas has <strong>{currentMessages.length}</strong> message{currentMessages.length === 1 ? '' : 's'}</span>
          </span>

          <div className="flex items-center gap-2">
            {saveSuccessMsg && (
              <span className="text-[11px] text-emerald-400 font-semibold animate-in fade-in">
                {saveSuccessMsg}
              </span>
            )}

            <button
              type="button"
              disabled={currentMessages.length === 0}
              onClick={() => setIsSavingNew(prev => !prev)}
              className="px-3 py-1.5 rounded-lg bg-[#ede0cc] hover:bg-[#e2d3bd] text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSavingNew ? 'Cancel Form' : 'Save Active Discussion'}</span>
            </button>
          </div>
        </div>

        {/* Save Current Discussion Inline Form */}
        {isSavingNew && (
          <form onSubmit={handleSaveCurrent} className="px-4 sm:px-6 py-3.5 bg-[#171717] border-b border-[#D4AF37]/30 space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] block font-bold">
                Discussion Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
                placeholder="e.g. 7414 Fay Ave — Coastal Bluff & Price Analysis"
                className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-bold">
                Optional Notes / Reminders
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Follow up on geotechnical soil report before Friday"
                className="w-full bg-[#0a0a0a] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSavingNew(false)}
                className="px-3 py-1.5 rounded-lg text-stone-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#e0bc43] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Bookmark className="w-3.5 h-3.5 fill-black" />
                <span>Confirm Save</span>
              </button>
            </div>
          </form>
        )}

        {/* Discussions List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin">
          {savedList.length === 0 ? (
            <div className="text-center py-10 space-y-3 text-stone-400">
              <MessageSquare className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-xs">No discussions saved yet.</p>
              <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                Ask a question to Charlie Simmons or Bob Dyson on Page 2, then tap "Save Discussion" to keep permanent records of comps and contingency strategies.
              </p>
            </div>
          ) : (
            savedList.map((item) => {
              const isSelected = selectedDiscussion?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all p-3.5 sm:p-4 space-y-2.5 ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#1a1711] shadow-lg'
                      : 'border-white/10 hover:border-white/25 bg-[#121212]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-stone-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#D4AF37]" />
                          <span>{new Date(item.savedAt).toLocaleDateString()} {new Date(item.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                        <span>•</span>
                        <span className="text-stone-300">
                          {item.messages.length} message{item.messages.length === 1 ? '' : 's'}
                        </span>
                        {item.propertyAddress && (
                          <>
                            <span>•</span>
                            <span className="text-stone-300 truncate max-w-[200px]">
                              {item.propertyAddress}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleCopyTranscript(item, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                        title="Copy transcript to clipboard"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDownloadTranscript(item, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                        title="Download text transcript"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-stone-400 hover:text-red-400 border border-white/10 transition-all cursor-pointer"
                        title="Delete saved discussion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11.5px] text-[#ede0cc] bg-black/40 px-2.5 py-1.5 rounded-md border border-white/5 italic">
                      "{item.notes}"
                    </p>
                  )}

                  {/* Messages Preview / Expand */}
                  <div className="space-y-1.5 pt-1">
                    {item.messages.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="text-[11px] leading-relaxed text-stone-300 bg-[#0d0d0d] px-2.5 py-1.5 rounded border border-white/5">
                        <span className="font-bold text-white mr-1.5">
                          {m.sender === 'user' ? 'You:' : m.sender === 'bob' ? 'Bob Dyson:' : 'Charlie Simmons:'}
                        </span>
                        <span className="line-clamp-2">{m.text}</span>
                      </div>
                    ))}
                    {item.messages.length > 2 && (
                      <div className="text-[10px] text-stone-500 italic">
                        +{item.messages.length - 2} more turn{item.messages.length - 2 === 1 ? '' : 's'}...
                      </div>
                    )}
                  </div>

                  {/* Bottom Restore Bar */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      Independent Fiduciary Record
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRestore(item)}
                      className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-[11px] transition-all cursor-pointer flex items-center gap-1 border border-[#D4AF37]/50"
                      title="Load this discussion into your active chat canvas"
                    >
                      <span>Load into Chat Canvas</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#141414] border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span className="text-[10.5px]">
            {isRecognized ? `Preferred Client Vault · ${currentUser.firstName}` : 'Private Client Vault · Confidential Fiduciary Records'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Soft Preferred Client Modal (Triggered for Unrecognized Guests) */}
      <CopilotPreferredClientModal
        isOpen={isPreferredModalOpen}
        onClose={() => setIsPreferredModalOpen(false)}
        pendingItem={pendingSaveItem}
        onClaimSuccess={(client) => {
          if (pendingSaveItem) {
            executeSaveItem(pendingSaveItem);
          }
        }}
      />
    </div>
  );
}