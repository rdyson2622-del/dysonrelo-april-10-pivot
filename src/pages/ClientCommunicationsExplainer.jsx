import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MessageSquare, Phone, CheckCircle } from 'lucide-react';

const GOLD = '#D4AF37';

export default function ClientCommunicationsExplainer() {
  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4 flex items-center gap-3" style={{ background: 'rgba(8,8,8,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <Link to="/chat" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Communications Hub</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Intro */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}>
            Stay Connected with Your Dyson Team
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Georgia, serif' }}>
            Every message you send — whether through Charlie chat, SMS reply, or email — reaches your dedicated team in one unified thread. No jumping between apps. No missed messages. Just a conversation you can trust.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}>
            How It Works
          </h3>
          
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <MessageCircle className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Message Your Way</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Send messages through Charlie, reply to SMS, or use email — whichever feels most natural. All conversations flow into one unified inbox where your Dyson team is always watching.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <MessageSquare className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Real-Time Responses</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Your team sees every message instantly. No delays. No waiting for office hours. Replies come back on the same channel you used, so the conversation never breaks rhythm.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Nothing to Download</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Everything lives here in your client dashboard. No separate apps. No notification overload. Just one place where you and your Dyson team connect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Your Team Sees */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}>
            Your Dedicated Team
          </h3>
          <div className="rounded-2xl p-8" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Every message you send — via Charlie chat, SMS reply, or email — reaches your Dyson team in one unified thread. They see your complete conversation history across all channels. They reply directly on the same channel you used, and your response is delivered instantly.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <strong>Bottom line:</strong> You're never talking to different people. You're always talking to the same team who knows your move, your timeline, and your goals.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-black transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})` }}>
            Go to Communications Hub
          </Link>
        </div>
      </div>
    </div>
  );
}