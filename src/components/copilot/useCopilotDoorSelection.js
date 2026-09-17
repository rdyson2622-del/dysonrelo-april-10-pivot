import { useState } from 'react';
import { getDoorAudioBriefing, DEFAULT_DOOR_BRIEFINGS } from '@/components/copilot/doorAudioBriefings';
import { stopAllCopilotAudio } from '@/lib/copilotAudioController';

const aliases = { audit: 'dossier', dnn: 'news', vault: 'solutions', workflows: 'roadmap', operations: 'escrow' };

export default function useCopilotDoorSelection({ setView, setMessages, clearStage }) {
  const [doorSelectionVersion, setDoorSelectionVersion] = useState(0);
  const selectDoor = (id, isParked = false) => {
    if (isParked) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), sender: 'charlie', speakerName: 'Charlie Simmons',
        text: 'This back-office execution module is managed by our licensed fiduciary transaction desk. Select Property Audit, Agent Vetting, Move Roadmap, or Escrow Watch to explore your active tools.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }
    const door = aliases[id] || id;
    if (door != null && !DEFAULT_DOOR_BRIEFINGS[door]) return;
    stopAllCopilotAudio();
    clearStage();
    setView(door);
    setDoorSelectionVersion(version => version + 1);
    if (door == null) return;
    const briefing = getDoorAudioBriefing(door);
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      sender: briefing.speaker === 'bob' ? 'bob' : 'charlie',
      speakerName: briefing.speakerName,
      text: briefing.spokenText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };
  return { selectDoor, doorSelectionVersion };
}