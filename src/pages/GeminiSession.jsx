import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import CommitmentGate from '../components/charlie/CommitmentGate';
import GeminiLiveSession from '../components/charlie/GeminiLiveSession';
import InterviewSummary from '../components/charlie/InterviewSummary';
import RelocationIntakeForm from '../components/charlie/RelocationIntakeForm';
import LayoutToggleButton from '../components/layout/LayoutToggleButton';
import { useLayout } from '@/lib/LayoutContext';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

export default function GeminiSession() {
  const [stage, setStage] = useState('gate'); // gate | intake | session | done
  const [clientInfo, setClientInfo] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [intakeData, setIntakeData] = useState(null);
  const { landscape } = useLayout();

  const handleCommit = (info) => {
    setClientInfo(info);
    setStage('intake');
  };

  const handleIntakeComplete = (data) => {
    setIntakeData(data);
    setStage('session');
  };

  const handleSessionComplete = (result) => {
    setSessionResult(result);
    setStage('done');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080808' }}>
      {/* Header */}
      <header className="px-6 py-3 flex items-center gap-3 shrink-0 frosted-dark"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <Link to="/Chat">
          <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: GOLD }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black" style={{ color: '#ffffff' }}>Gemini Live Interview</h1>
          <p className="text-sm" style={{ color: GOLD }}>Powered by Google Gemini • Your Private Relocation Session</p>
        </div>
        <LayoutToggleButton />
      </header>

      {/* Content */}
      <div className={`flex-1 w-full mx-auto flex flex-col ${landscape ? 'max-w-5xl' : 'max-w-2xl'}`} style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">

          {/* COMMITMENT GATE */}
          {stage === 'gate' && (
            <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col rounded-2xl m-4 overflow-hidden"
              style={{ background: '#0d0d0d', border: `1px solid ${GOLD}33` }}>
              {/* Gate header */}
              <div className="px-5 pt-5 pb-3 shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <div className="flex items-center gap-2 mb-1">
                 <span className="text-2xl">✨</span>
                 <h2 className="font-bold text-xl" style={{ color: GOLD }}>Before We Begin</h2>
                </div>
                <p className="text-sm" style={{ color: '#e5e5e5' }}>
                 Charlie will hand you off to Gemini for your private relocation interview.
                </p>
              </div>
              <CommitmentGate onCommit={handleCommit} />
            </motion.div>
          )}

          {/* LIVE SESSION */}
          {stage === 'session' && (
            <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col rounded-2xl m-4 overflow-hidden"
              style={{ background: '#0d0d0d', border: `1px solid ${GOLD}33`, minHeight: '600px' }}>
              {/* Session header */}
              <div className="px-5 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold" style={{ color: '#fff' }}>
                    Welcome, {clientInfo?.name?.split(' ')[0]} — Gemini is ready
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#e5e5e5' }}>
                 Speak naturally. This conversation builds your relocation profile.
                </p>
              </div>
              <GeminiLiveSession
                clientInfo={clientInfo}
                onSessionComplete={handleSessionComplete}
              />
            </motion.div>
          )}

          {/* DONE - Interview Summary */}
           {stage === 'done' && (
             <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col w-full">
               <InterviewSummary clientInfo={clientInfo} sessionResult={sessionResult} />
             </motion.div>
           )}

        </AnimatePresence>
      </div>
    </div>
  );
}