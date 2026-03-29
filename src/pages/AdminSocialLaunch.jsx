import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCheck, Linkedin, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const POSTS = [
  {
    id: 1,
    label: 'Post 1 — The Introduction',
    linkedin: `Big news — after 54 years in real estate, we just launched something that changes everything about how families relocate.

Introducing dysonrelo.com — your AI-powered concierge relocation manager.

✅ Charlie (our AI advisor) researches your destination 24/7
✅ We vet and present the top local agents — you pick
✅ We manage every step of your move — schools, utilities, logistics
✅ Completely FREE to relocating families

Whether you're moving across the country or across the state, you no longer have to figure it out alone.

Try it tonight → dysonrelo.com

#Relocation #RealEstate #AIAdvisor #DysonRelo #MovingMadeSimple`,

    loomly: `Big news — after 54 years in real estate, we just launched something that changes everything about how families relocate.

Introducing dysonrelo.com — your AI-powered concierge relocation manager.

✅ Charlie (our AI) researches your destination 24/7
✅ We vet and present top local agents — you pick
✅ We manage every step — schools, utilities, logistics
✅ Completely FREE to relocating families

Try it tonight → dysonrelo.com

#Relocation #RealEstate #MovingMadeSimple #DysonRelo`,
  },
  {
    id: 2,
    label: 'Post 2 — The Value Hook',
    linkedin: `Most families spend 200+ hours managing a relocation on their own.

Wrong schools. Wrong neighborhood. Wrong agent.

We built dysonrelo.com to fix that.

Our AI advisor Charlie handles:
🏠 Deep neighborhood research
🎓 School district analysis
💰 Cost of living comparisons
🤝 Curated agent matching in your destination city
📦 Full move logistics coordination

You focus on your family. We handle the rest.

And it's free.

Start your relocation profile → dysonrelo.com

#ConciergeRelocation #RealEstate #MovingTips #DysonRelo #FamilyMove`,

    loomly: `Most families spend 200+ hours managing a relocation alone.

Wrong schools. Wrong neighborhood. Wrong agent.

We built dysonrelo.com to fix that.

Charlie (our AI) handles:
🏠 Neighborhood research
🎓 School district analysis
💰 Cost of living comparisons
🤝 Agent matching in your destination city

You focus on your family. We handle the rest. And it's free.

Start your profile → dysonrelo.com

#ConciergeRelocation #RealEstate #MovingTips #DysonRelo`,
  },
];

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook', color: '#1877F2' },
  { key: 'tiktok', label: 'TikTok', color: '#000' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000' },
  { key: 'instagram', label: 'Instagram', color: '#E1306C' },
];

export default function AdminSocialLaunch() {
  const [copied, setCopied] = useState(null);
  const [posting, setPosting] = useState(null);
  const [posted, setPosted] = useState({});
  const [error, setError] = useState(null);

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const postToLinkedIn = async (post) => {
    setPosting(post.id);
    setError(null);
    try {
      await base44.functions.invoke('postToLinkedIn', { text: post.linkedin });
      setPosted(prev => ({ ...prev, [post.id]: true }));
    } catch (err) {
      setError(`Post ${post.id} failed: ${err.message}`);
    } finally {
      setPosting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4 flex items-center gap-3">
        <Link to="/admin">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-slate-900">Social Media Launch</h1>
          <p className="text-xs text-slate-500">2-post campaign — dysonrelo.com launch</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* Loomly reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Loomly Workflow</p>
            <p className="text-xs text-blue-700 mt-0.5">Copy each "Loomly / Other Platforms" script below and paste into <strong>loomly.com</strong> for Facebook, TikTok, YouTube & Instagram. LinkedIn posts directly from this page.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
        )}

        {POSTS.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            {/* Post Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Campaign Drop {post.id}</span>
                <p className="font-semibold text-slate-900 mt-0.5">{post.label}</p>
              </div>
              {posted[post.id] && (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Posted to LinkedIn
                </span>
              )}
            </div>

            <div className="p-6 space-y-5">
              {/* LinkedIn Section */}
              <div className="rounded-xl border border-[#0A66C2]/30 bg-[#0A66C2]/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-sm font-semibold text-[#0A66C2]">LinkedIn</span>
                    <span className="text-xs text-slate-400">— posts directly from here</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(post.linkedin, `li-${post.id}`)}
                    className="gap-1 text-xs"
                  >
                    {copied === `li-${post.id}` ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === `li-${post.id}` ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{post.linkedin}</pre>
                <Button
                  onClick={() => postToLinkedIn(post)}
                  disabled={posting === post.id || posted[post.id]}
                  className="w-full gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
                >
                  {posting === post.id ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</>
                  ) : posted[post.id] ? (
                    <><CheckCheck className="w-4 h-4" /> Posted ✓</>
                  ) : (
                    <><Send className="w-4 h-4" /> Post to LinkedIn Now</>
                  )}
                </Button>
              </div>

              {/* Loomly / Other Platforms Section */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-700">Loomly / Other Platforms</span>
                    <div className="flex gap-1.5">
                      {PLATFORMS.map(p => (
                        <span key={p.key} className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: p.color }}>
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(post.loomly, `lm-${post.id}`)}
                    className="gap-1 text-xs shrink-0"
                  >
                    {copied === `lm-${post.id}` ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === `lm-${post.id}` ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{post.loomly}</pre>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Timing guidance */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">📅 Posting Strategy</p>
          <p><strong>Post 1</strong> — Tonight. Best window: 6–8pm PT</p>
          <p><strong>Post 2</strong> — 48–72 hours later for maximum reach without overlap.</p>
        </div>
      </main>
    </div>
  );
}