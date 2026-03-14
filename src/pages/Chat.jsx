import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '../components/charlie/ChatInterface';
import CharlieAvatar from '../components/charlie/CharlieAvatar';

export default function Chat() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 shrink-0">
        <Link to="/Dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <CharlieAvatar size="sm" speaking={false} />
        <div>
          <h1 className="font-bold text-slate-900 text-sm">Chat with Charlie</h1>
          <p className="text-xs text-slate-400">Your relocation assistant</p>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-6">
        <ChatInterface
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />
      </div>
    </div>
  );
}