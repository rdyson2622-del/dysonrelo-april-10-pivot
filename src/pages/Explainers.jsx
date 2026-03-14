import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, Mic, ArrowLeft } from 'lucide-react';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

const HISTORY_IMAGES = [
  "https://images.unsplash.com/photo-1533613220915-609f21a91335?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1532619927891-4d71bcdd2167?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1485579149c0-123123ae6333?w=400&h=500&fit=crop"
];

export default function Explainers() {
  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9', color: '#fff' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-14 py-4 frosted-dark"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <Link to="/Home" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-sm font-semibold" style={{ color: GOLD }}>Back</span>
        </Link>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        <div className="w-20" />
      </nav>

      <main className="max-w-5xl mx-auto px-6 md:px-14 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-widest"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.25)' }}>
            ✨ Introducing "Talkies"
          </div>
          <h1 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '0.28em', marginBottom: '1.5rem', color: '#fff' }}>
            THE MODERN <span className="gold-text-gradient">EVOLUTION</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-12" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Just as motion pictures evolved from silent films to "talkies" in 1927, we're pioneering the next revolution: voice-powered AI in real estate.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-20"
        >
          {/* Then Card */}
          <div className="rounded-3xl p-8 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.15)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
                <Volume2 className="w-6 h-6" style={{ color: GOLD }} />
              </div>
              <h3 className="serif-heading text-2xl" style={{ color: '#fff' }}>Then: 1927 "Talkies"</h3>
            </div>
            <p className="leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              When the movie "The Jazz Singer" premiered, it revolutionized entertainment by adding synchronized sound to motion pictures. One of the first entertainers in those times, Charlie Chaplin was a significant figure. Audiences were amazed to hear actors speak.
            </p>
            <p className="font-semibold" style={{ color: GOLD }}>
              It changed everything. Silent films became obsolete overnight.
            </p>
            <button className="mt-6 w-full py-3 rounded-full font-semibold transition-all hover:opacity-90" 
              style={{ background: GOLD, color: '#000' }}>
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4" />
                Hear Charlie read this
              </div>
            </button>
          </div>

          {/* Now Card */}
          <div className="rounded-3xl p-8 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(212,175,55,0.15)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
                <Mic className="w-6 h-6" style={{ color: GOLD }} />
              </div>
              <h3 className="serif-heading text-2xl" style={{ color: '#fff' }}>Now: AI "Talkies"</h3>
            </div>
            <p className="leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              We're experimenting with voice-to-voice technology that lets you talk naturally with Charlie — he understands your needs, explains complex processes, and guides you through every step.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              While Charlie is still learning the full range of our services, every conversation is backed up by the text chat box in the upper-right corner of each page — so you're always connected.
            </p>
            <button className="w-full py-3 rounded-full font-semibold transition-all hover:opacity-90" 
              style={{ background: GOLD, color: '#000' }}>
              <div className="flex items-center justify-center gap-2">
                <Mic className="w-4 h-4" />
                Hear Charlie read this
              </div>
            </button>
          </div>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-10 md:p-16 border" style={{ background: 'rgba(212,175,55,0.02)', borderColor: 'rgba(212,175,55,0.1)' }}
        >
          {/* Images Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {HISTORY_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden h-48 md:h-64"
              >
                <img src={img} alt={`Historical moment ${i + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <h2 className="gold-text-gradient serif-heading text-2xl md:text-3xl mb-6" style={{ letterSpacing: '-0.01em' }}>
            Dyson & Dyson Real Estate — We're known for making history.
          </h2>

          <ul className="space-y-4">
            {[
              "Voice AI (Voice to Voice) is developing and is the future of real estate communications.",
              "Charlie joined us to become the first to employ this new technology on just about every subject you can imagine when it comes to home ownership, buying and selling, or just those daily homeowner needs.",
              "Like any new technology, Charlie might stumble a few times since he couldn't even talk in the 1920's.",
              "Voice to Voice is a fun new entry into all of our lives — so watch us and join us by adding other subscribers to broaden our networks on this fun new road we are all traveling."
            ].map((item, i) => (
              <li key={i} className="flex gap-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <span style={{ color: GOLD }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 rounded-full font-bold transition-all hover:opacity-90" style={{ background: GOLD, color: '#000' }}>
              ✏️ Edit Page
            </button>
            <button className="px-8 py-3 rounded-full font-bold border transition-all hover:bg-white/5" style={{ borderColor: GOLD, color: GOLD }}>
              Subscribe for Free
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}